/*
    This file is part of Ironbane MMO.

    Ironbane MMO is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Ironbane MMO is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Ironbane MMO.  If not, see <http://www.gnu.org/licenses/>.
*/
IronbaneApp
    .factory('socketHandler', ['$log', 'socket', function($log, socket) {
        // this factory function should be a singleton, the returned object however wouldn't be
        socket.on('chatMessage', function(data) {
            hudHandler.AddChatMessage(data);
        });

        socket.on('bigMessage', function(data) {
            bm(data.message);
        });

        socket.on('cutscene', function(id) {
            cinema.PlayCutscene(id);
        });

        socket.on('say', function(data) {
            var unit = FindUnit(data.id);

            if (unit) {
                ironbane.getUnitList().addUnit(new ChatBubble(unit, data.message));
            }
        });

        socket.on('disconnect', function() {
            //socketHandler.socket.disconnect();
            
            ironbane.getUnitList().destroy();
            terrainHandler.Destroy();
            ironbane.player = null;
            //socketHandler.loggedIn = false;

            if (!noDisconnectTrigger) {
                //socketHandler.serverOnline = false;
                hudHandler.messageAlert('It appears the server crashed! Either that, or there is something wrong with your internet connection. I\'m terribly sorry about that.<br><br>In case the server crashed, an auto-restart will most-likely occur. Please refresh the page in a few seconds.', 'nobutton');
            }
        });

        socket.on('doJump', function(data) {
            var unit = FindUnit(data.id);
            unit.jump();
        });

        socket.on('toggle', function(data) {
            var unit = FindUnit(data.id);
            if (unit && unit instanceof ToggleableObstacle) {
                unit.Toggle(data['on']);
            }
        });

        socket.on('addParticle', function(data) {
            var unit;

            if (angular.isDefined(data.fu)) {
                unit = FindUnit(data.fu);
                particleHandler.Add(ParticleTypeEnum[data.p], {
                    followUnit: unit
                });
            } else if (angular.isDefined(data.pfu)) {
                unit = FindUnit(data.pfu);
                particleHandler.Add(ParticleTypeEnum[data.p], {
                    particleFollowUnit: unit
                });
            } else if (angular.isDefined(data.pos)) {
                particleHandler.Add(ParticleTypeEnum[data.p], {
                    position: ConvertVector3(data.pos)
                });
            }
        });

        socket.on('addProjectile', function(data) {
            var unit = FindUnit(data.o);

            if (unit) {
                // Alter the start position to cope with lag
                data.s = unit.position.clone();

                // Take into account the size
                data.s.y += unit.size * 0.5;
            }

            var weapon = angular.isDefined(data.w) ? items[data.w] : null;
            var target = ConvertVector3(data.t);

            if (data.sw) {
                unit.swingWeapon(target, weapon);
            }

            var particle = new Projectile(ConvertVector3(data.s), target, unit, data.w);
            particle.velocity.add(unit.fakeVelocity);

            ironbane.getUnitList().addUnit(particle);
        });

        socket.on('updateClothes', function(data) {
            var unit = FindUnit(data.id);

            unit.appearance.head = data.head;
            unit.appearance.body = data.body;
            unit.appearance.feet = data.feet;

            unit.updateClothes();
        });

        socket.on('updateWeapon', function(data) {
            var unit = FindUnit(data.id);
            unit.updateWeapon(data.weapon);
        });

        socket.on('receiveItem', function(data) {
            // todo: reference this...
            socketHandler.playerData.items.push(data);

            hudHandler.ReloadInventory();
        });

        socket.on('lootFromBag', function(data) {
            // occurs when someone nearby loots from a bag
            // refresh the bag
            //$log.log('lootFromBag REPLY:', data);
            hudHandler.ReloadInventory();
            if (ironbane.player.canLoot) {
                ironbane.player.lootItems = data.loot;
            }
        });

        socket.on('respawn', function(data) {
            var unit = FindUnit(data.id);

            if (unit) {
                unit.health = data.h;
                unit.object3D.position.copy(ConvertVector3(data.p));

                if (unit === ironbane.player) {
                    terrainHandler.transitionState = transitionStateEnum.START;

                    $('#gameFrame').animate({
                        opacity: 0.00
                    }, 1000, function() {
                        terrainHandler.transitionState = transitionStateEnum.MIDDLE;

                        setTimeout(function() {
                            ironbane.showingGame = false;
                        }, 100);

                        socketHandler.readyToReceiveUnits = false;
                        terrainHandler.ChangeZone(data.z);
                        ironbane.player.unitStandingOn = null;

                        hudHandler.ShowHUD();
                        hudHandler.makeHealthBar(true);

                        hudHandler.ReloadInventory();
                    });
                }

                unit.canMove = true;
                unit.dead = false;

                unit.Respawn();
            }
        });

        socket.on('setStat', function(data) {
            var unit = FindUnit(data.id);

            if (unit) {
                if (data.s === 'h') {
                    //unit.health = data['h'];
                    unit.setHealth(data.h, data.np);
                    if (unit === ironbane.player) {
                        makeHealthBar(true);
                    }
                }
                if (data.s === 'a') {
                    //unit.armor = data['a'];
                    unit.setArmor(data.a, data.np);
                    if (unit === ironbane.player) {
                        hudHandler.makeArmorBar(true);
                    }
                }
                if (data.s === 'hm') {
                    unit.healthMax = data.hm;
                    if (unit === ironbane.player) {
                        makeHealthBar(true);
                    }
                }
                if (data.s === 'am') {
                    unit.armorMax = data.am;
                    if (unit === ironbane.player) {
                        hudHandler.makeArmorBar(true);
                    }
                }
            }
        });

        socket.on('teleport', function(data) {
            this.transitionState = transitionStateEnum.START;

            $('#gameFrame').animate({
                opacity: 0.00
            }, 1000, function() {
                setTimeout(function() {
                    ironbane.showingGame = false;
                }, 100);

                setTimeout(function() {
                    terrainHandler.transitionState = transitionStateEnum.MIDDLE;
                }, 100);

                socketHandler.readyToReceiveUnits = false;

                terrainHandler.ChangeZone(data.zone);

                ironbane.player.object3D.position.copy(data.pos);
                ironbane.player.unitStandingOn = null;
            });
        });

        socket.on('getMeleeHit', function(data) {
            var victim = FindUnit(data.victim);
            var attacker = FindUnit(data.attacker);

            victim.setHealth(data.h);
            victim.setArmor(data.a);
            victim.GetMeleeHit(attacker);
        });

        socket.on('setTileHeight', function(array) {
            if (!le("globalEnable")) {
                return;
            }

            for (var d = 0; d < array.length; d++) {
                var data = array[d];
                levelEditor.SetTileHeight(data.tx, data.tz, data.height, false, false, true);
            }
        });

        socket.on('setTileImage', function(data) {
            if (!le("globalEnable")) {
                return;
            }

            levelEditor.SetTileImage(data.tx, data.tz, data.image, false, true);
        });

        socket.on('removeUnit', function(data) {
            
            ironbane.getUnitList().removeUnit({id:data.id});
        });

        socket.on('addModel', function(data) {
            hudHandler.AddChatMessage('Adding model...');

            levelEditor.PlaceModel(ConvertVector3(data.position),
                data.rX,
                data.rY,
                data.rZ,
                parseInt(data.param, 10));
        });

        socket.on('paintModel', function(data) {
            var cellPos;
            // Find the model at this position, and reload it
            if (data.global) {
                // When global, change preMeshes
                _.extend(preMeshes[data.id], data.metadata);

                cellPos = WorldToCellCoordinates(data.pos.x, data.pos.z, cellSize);
                _.each(terrainHandler.GetCellByGridPosition(cellPos.x, cellPos.z).objectData, function(obj) {
                    if (obj.metadata && ConvertVector3(obj).equals(ConvertVector3(data.pos).Round())) {
                        _.extend(obj.metadata, data.metadata);
                    }
                });

                _.each(terrainHandler.cells, function(cell) {
                    cell.ReloadObjectsOnly();
                });
            } else {
                cellPos = WorldToCellCoordinates(data.pos.x, data.pos.z, cellSize);

                _.each(terrainHandler.GetCellByGridPosition(cellPos.x, cellPos.z).objectData, function(obj) {
                    if (_.isEmpty(data.metadata)) {
                        delete obj.metadata;
                    }

                    if (obj.metadata) {
                        //_.extend(obj.metadata, data.metadata);
                        obj.metadata = data.metadata;
                    }
                });

                _.each(terrainHandler.cells, function(cell) {
                    _.each(cell.objects, function(obj) {
                        if (obj.position.clone().Round(2).equals(data.pos)) {
                            var rotation = obj.rotation.clone();
                            var param = obj.param;
                            var metadata = obj.metadata;

                            cell.objects = _.without(cell.objects, obj);

                            obj.Destroy();

                            setTimeout(function() {
                                var unit = new Mesh(ConvertVector3(data.pos), rotation, 0, param, data.metadata);
                                ironbane.getUnitList().addUnit(unit);
                                cell.objects.push(unit);
                            }, 1);
                        }
                    });
                });
            }
        });

        socket.on('deleteModel', function(pos) {
            pos = ConvertVector3(pos).Round(2);
            hudHandler.AddChatMessage("Removing model...");

            // Check
            _.each(terrainHandler.cells, function(cell) {
                _.each(cell.objects, function(obj) {
                    if (obj.position.clone().Round(2).equals(pos)) {
                        cell.objects = _.without(cell.objects, obj);
                        var cellPos = WorldToCellCoordinates(obj.position.x, obj.position.z, cellSize);
                        var objInList = _.find(terrainHandler.GetCellByGridPosition(cellPos.x, cellPos.z).objectData, function(otherObj) {
                            return obj.position.clone().Round(2).equals(ConvertVector3(otherObj));
                        });

                        if (objInList) {
                            var temp = terrainHandler.GetCellByGridPosition(cellPos.x, cellPos.z).objectData;
                            temp =
                                _.without(temp, objInList);
                        }

                        obj.Destroy();
                    }
                });

                if (!le("globalEnable")) {
                    var newList = [];
                    _.each(cell.objectData, function(obj) {
                        if (!ConvertVector3(obj).equals(pos)) {
                            newList.push(obj);
                        }
                    });
                    cell.objectData = newList;
                }
            });

            if (!le("globalEnable")) {
                terrainHandler.GetCellByWorldPosition(pos).Reload();
            }

            terrainHandler.RebuildOctree();
        });

        // Pathfinding
        socket.on('ppAddNode', function(data) {
            if (!showEditor) {
                return;
            }

            nodeHandler.AddNode(0, data.id, ConvertVector3(data.pos));
        });

        socket.on('ppAddEdge', function(data) {
            if (!showEditor) {
                return;
            }

            nodeHandler.AddEdge(0, data.from, data.to, data.twoway);
        });

        socket.on('ppDeleteNode', function(data) {
            if (!showEditor) {
                return;
            }

            nodeHandler.DeleteNode(0, data.id);
        });

        socket.on('snapshot', function(snapshot) {
            for (var x = 0; x < snapshot.length; x++) {
                var unitdata = snapshot[x];
                var unit = ironbane.getUnitList.findUnit(unitdata.id);
                if (unit) {
                    if (unit !== ironbane.player) {
                        if (angular.isDefined(unitdata.p)) {
                            unit.targetPosition.x = unitdata.p.x;
                            unit.targetPosition.z = unitdata.p.z;
                            unit.targetPosition.y = unitdata.p.y;
                        }

                        if (angular.isDefined(unitdata.rx)) {
                            unit.targetRotation.x = unitdata.rx;
                        }

                        if (angular.isDefined(unitdata.ry)) {
                            unit.targetRotation.y = unitdata.ry;
                        }

                        if (angular.isDefined(unitdata.rz)) {
                            unit.targetRotation.z = unitdata.rz;
                        }

                        if (angular.isDefined(unitdata.u)) {
                            unit.unitStandingOn = FindUnit(unitdata.u);
                        } else {
                            unit.unitStandingOn = null;
                        }

                        if (Math.abs(unit.object3D.position.y - unitdata.p.y) > 1) {
                            unit.object3D.position.y = unitdata.p.y;
                        }
                    }
                }
            }
        });

        // here is where we actually send the class
        var SocketHandler = function() {
            this.serverOnline = false;
            this.loggedIn = false;
            this.spawnLocation = null;
            this.spawnRotation = 0;
            this.playerData = null;
            this.readyToReceiveUnits = false;
            this.inGame = false;
        };

        SocketHandler.prototype.connect = function() {
            socket.connect();

            socket.emit('getStartData', {}, function(reply) {
                numberOfPlayersOnline = reply.numberOfPlayersOnline;
            });
        };

        SocketHandler.prototype.joinGame = function() {
            var self = this,
                data = {
                    id: startdata.user,
                    characterID: startdata.characterUsed,
                    guest: startdata.user === 0
                };

            // used to be "connectServer"
            socket.emit('game:join', data, function(reply) {
                if(reply.errmsg) {
                    // handle error
                    return;
                }

                self.loggedIn = true;
                // Get a spawn from the server
                self.spawnLocation = ConvertVector3(reply.position);
                self.spawnRotation = reply.rotY;

                self.playerData = reply;

                setTimeout(function() {
                    ironbane.showingGame = false;
                }, 100);

                terrainHandler.ChangeZone(reply.zone);

                self.inGame = true;

                if (reply.editor) {
                    showEditor = true;
                    levelEditor.Start();
                }

                hudHandler.MakeSlotItems(false);
            });
        };

        return SocketHandler;
    }]);