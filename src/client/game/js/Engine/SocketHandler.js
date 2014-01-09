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

var playerZone = 1;


var SocketHandler = Class.extend({
    Init: function() {

        if (!Detector.webgl) return;

        this.loggedIn = false;
        this.bytesReceived = 0;

        this.serverOnline = typeof io === 'undefined' ? false : true;

        this.spawnLocation = null;
        this.spawnRotation = 0;

        var playerData = null;
        this.getPlayerData = function(){
            return playerData;
        };

        this.readyToReceiveUnits = false;

        this.inGame = false;


        
        if (this.serverOnline) {

            this.socket = io.connect('http://' + ironbane_hostname + ':' + ironbane_port + '/', {
                reconnect: false
            });

            this.socket.emit('getStartData', {}, function(reply) {
                numberOfPlayersOnline = reply.numberOfPlayersOnline;

                socketHandler.Setup();

            });

            // Socket behaviour
            this.socket.on('chatMessage', function(data) {
                hudHandler.AddChatMessage(data);
            });

            this.socket.on('bigMessage', function(data) {
                bm(data.message);
            });

            this.socket.on('cutscene', function(id) {
                cinema.PlayCutscene(id);
            });

            this.socket.on('say', function(data) {
                var unit = ironbane.getUnitList().findUnit(data.id);

                if (unit) {
                    ironbane.getUnitList().addUnit(new ChatBubble(unit, data.message));
                }
            });


            this.socket.on('disconnect', function() {



                socketHandler.socket.disconnect();

                ironbane.getUnitList().destroy();

                ironbane.getUnitList().clear();

                terrainHandler.Destroy();

                ironbane.player = null;

                socketHandler.loggedIn = false;

                if (!noDisconnectTrigger) {
                    socketHandler.serverOnline = false;

                    hudHandler.messageAlert('The connection with the server was lost.<br><br>Trying to reconnect...', 'nobutton');

                    setTimeout(function() {
                        location.reload();
                    }, 2000);
                }



                //hudHandler.ShowMenuScreen();

                //hudHandler.Init();


                //alert('socket disconnected');
            });


    this.Connect = function(abortConnect) {
        if (!this.serverOnline) return;

        if (_.isUndefined(startdata.characterUsed)) return;

        if (socketHandler.inGame) {
            //alert('Already in game!');
            return;
        }

        var data;

        if (startdata.loggedIn) {
            data = {
                id: startdata.user,
                characterID: startdata.characterUsed,
                guest: false,
                pass: startdata.pass
            };
        } else {
            data = {
                characterID: startdata.characterUsed,
                guest: true
            };
        }

        $('#bogusButton').select();
        $('#gameFrame').focus();

        this.socket.emit('connectServer', data, function(reply) {
            if (!_.isUndefined(reply.errmsg)) {
                hudHandler.messageAlert(reply.errmsg);
                abortConnect();
                hudHandler.ShowMenuScreen();
                return;
            }

            socketHandler.loggedIn = true;

            // Get a spawn from the server
            socketHandler.spawnLocation = ConvertVector3(reply.position);
            socketHandler.spawnRotation = reply.rotY;

            playerData = reply;

            setTimeout(function() {
                ironbane.showingGame = false;
                // successful, show hud now we're in game
                hudHandler.ShowHUD();
            }, 1000);

            terrainHandler.ChangeZone(reply.zone);

            socketHandler.inGame = true;

            if (reply.editor) {
                showEditor = true;
                levelEditor.Start();
            }


        });
    };
    this.Setup = function() {

        this.socket.on('addUnit', function(data) {
            //if ( !socketHandler.loggedIn ) return;
            // Depending on the type we add diffent things
            // return;
            // bm("addunit");

            var unit = null;


            var template = null;
            if ( data.id < 0 ) {
                template = units[data.template];
            }
            else {
                template = {
                    type:UnitTypeEnum.PLAYER
                };
            }

            var unitname = data.id < 0 ? template.name : data.name;

            switch (template.type) {
                case UnitTypeEnum.MOVINGOBSTACLE:
                    unit = new MovingObstacle(ConvertVector3(data.position), new THREE.Euler(data.rotX, data.rotY, data.rotZ), data.id, data.param, data.metadata);
                    break;
                case UnitTypeEnum.TRAIN:
                    unit = new Train(ConvertVector3(data.position), new THREE.Euler(data.rotX, data.rotY, data.rotZ), data.id, data.param, data.metadata);
                    break;
                case UnitTypeEnum.TOGGLEABLEOBSTACLE:
                    unit = new ToggleableObstacle(ConvertVector3(data.position), new THREE.Euler(data.rotX, data.rotY, data.rotZ), data.id, data.param, data.metadata);
                    break;
                case UnitTypeEnum.LEVER:
                    unit = new Lever(ConvertVector3(data.position), data.id, data.metadata);
                    break;
                case UnitTypeEnum.TELEPORTENTRANCE:
                    unit = new TeleportEntrance(ConvertVector3(data.position), data.id, data.metadata);
                    break;
                case UnitTypeEnum.TELEPORTEXIT:
                    unit = new TeleportExit(ConvertVector3(data.position), data.id, data.metadata);
                    break;
                case UnitTypeEnum.MUSICPLAYER:
                    unit = new MusicPlayer(ConvertVector3(data.position), data.id, data.metadata);
                    break;
                case UnitTypeEnum.HEARTPIECE:
                    unit = new HeartPiece(ConvertVector3(data.position), data.id);
                    break;
                case UnitTypeEnum.SIGN:
                    unit = new Sign(ConvertVector3(data.position), new THREE.Euler(0, data.rotY, 0), data.id, data.param, data.metadata);
                    break;
                case UnitTypeEnum.WAYPOINT:
                    // Don't show on production
                    if ( isProduction ) return;

                    unit = new Waypoint(ConvertVector3(data.position), data.id);
                    break;

                case UnitTypeEnum.TRIGGER:
                    unit = new Trigger(ConvertVector3(data.position), data.id);
                    break;

                case UnitTypeEnum.BANK:
                    //console.log('got bank!', data);
                    unit = new Mesh(ConvertVector3(data.position), new THREE.Euler(0, data.rotY, 0), data.id, data.metadata.mesh, data.metadata);
                    break;

                case UnitTypeEnum.LOOTABLE:
                    if ( data.param < 10 ) {
                      unit = new LootBag(ConvertVector3(data.position), data.id, data.param);
                    } else {
                      unit = new LootableMesh(ConvertVector3(data.position), new THREE.Euler(0, data.rotY, 0), data.id, data.param, data.metadata);
                    }
                    break;
                default:
                    // return;
                    unit = new Fighter(ConvertVector3(data.position), new THREE.Euler(0, data.rotY, 0), data.id, unitname, data.param, data.size, data.health, data.armor, data.healthMax, data.armorMax);
                    break;
            }

            if ( data.id < 0 ) {
                unit.template = template;
            }


            if (unit instanceof Fighter) {
                // Update clothing
                unit.appearance.hair = data.hair;
                unit.appearance.skin = data.skin;
                unit.appearance.eyes = data.eyes;
                unit.appearance.body = data.body;
                unit.appearance.head = data.head;
                unit.appearance.feet = data.feet;

                if (template.type == UnitTypeEnum.TURRET) {
                    // if (!showEditor || !levelEditor.editorGUI.opShowDebug) {
                        // unit.appearance.hair = 0;
                        // unit.appearance.eyes = 0;
                        // unit.appearance.skin = 0;
                        // unit.appearance.body = 0;
                        // unit.appearance.head = 0;
                        // unit.appearance.feet = 0;

                        unit.enableShadow = false;
                    // }
                }
            }



            if (unit) {
                if (unit instanceof Fighter) {
                    unit.updateClothes();

                    if (!_.isUndefined(data.weapon)) {
                        unit.updateWeapon(data.weapon);
                    }
                }

                ironbane.getUnitList().addUnit(unit);
            }
        });
        this.socket.on('doJump', function(data) {
            //if ( !socketHandler.loggedIn ) return;

            var unit = ironbane.getUnitList().findUnit(data.id);

            unit.jump();


        });


        // this.socket.on('foundHeartPiece', function (data) {
        //     //if ( !socketHandler.loggedIn ) return;

        //     var unit = FindUnit(data.id);

        //     if ( unit == ironbane.player ) {

        //       var foundPiece = data['piece'];

        //       var heartPiecesTotal = ironbane.player.heartPieces.length;
        //       var level = Math.floor(heartPiecesTotal / 5);

        //     }


        // });

        this.socket.on('toggle', function(data) {
            //if ( !socketHandler.loggedIn ) return;

            var unit = ironbane.getUnitList().findUnit(data.id);

            if (unit && unit instanceof ToggleableObstacle) {
                unit.Toggle(data.on);
            }


        });

        this.socket.on('addParticle', function(data) {
            //if ( !socketHandler.loggedIn ) return;



            if (!_.isUndefined(data.fu)) {
                var unit = ironbane.getUnitList().findUnit(data.fu);
                particleHandler.Add(ParticleTypeEnum[data.p], {
                    followUnit: unit
                });
            } else if (!_.isUndefined(data.pfu)) {
                var unit = ironbane.getUnitList().findUnit(data.pfu);
                particleHandler.Add(ParticleTypeEnum[data.p], {
                    particleFollowUnit: unit
                });
            } else if (!_.isUndefined(data.pos)) {
                particleHandler.Add(ParticleTypeEnum[data.p], {
                    position: ConvertVector3(data.pos)
                });
            }


        });

        this.socket.on('addProjectile', function(data) {
            //if ( !socketHandler.loggedIn ) return;

            var unit = ironbane.getUnitList().findUnit(data.o);

            // if ( !data['p'] || _.isUndefined(ProjectileTypeEnum[data['p']]) ) ba('Bad projectile type');

            if (unit) {
                // Alter the start position to cope with lag
                data.s = unit.position.clone();

                // Take into account the size
                data.s.y += unit.size * 0.5;
            }

            var weapon = !_.isUndefined(data.w) ? items[data.w] : null;

            var target = ConvertVector3(data.t);

            if (data.sw) {
                unit.swingWeapon(target, weapon);
            }

            var particle = new Projectile(ConvertVector3(data.s), target, unit, data.w);

            particle.velocity.add(unit.fakeVelocity);



            ironbane.getUnitList().addUnit(particle);
        });

        this.socket.on('updateClothes', function(data) {
            var unit = ironbane.getUnitList().findUnit(data.id);

            console.log('updateClothes!', data);

            unit.appearance.skin = data.skin;
            unit.appearance.eyes = data.eyes;
            unit.appearance.hair = data.hair;
            unit.appearance.head = data.head;
            unit.appearance.body = data.body;
            unit.appearance.feet = data.feet;

            // if special is provided, then use that as override
            unit.updateClothes(data.special);
        });

        this.socket.on('updateWeapon', function(data) {
            var unit = ironbane.getUnitList().findUnit(data.id);
            unit.updateWeapon(data.weapon);
        });

        // comes from GiveItem and addItem on server
        this.socket.on('receiveItem', function(item) {
            playerData.items.push(item);
            hudHandler.fillInvSlot(item);

            if(item.type === 'cash') {
                hudHandler.makeCoinBar(true);
            }
        });

        // replace player inv with server inv
        this.socket.on('updateInventory', function(data) {
            playerData.items = data.items;
            hudHandler.showInv({slots: 10, items: data.items});
        });

        // BANKING V1
        this.socket.on('openBank', function(data) {
            //console.log('openBank!', data);
            hudHandler.showBank(data);
        });

        this.socket.on('closeBank', function(data) {
            //console.log('closeBank!', data);
            hudHandler.hideBank();
        });
        // BANKING...

        this.socket.on('lootFromBag', function(data) {
            // occurs when someone nearby loots from a bag
            // refresh the bag
            hudHandler.updateLoot(data);
        });

        // someone nearby has purchased something, or perhaps on restock
        this.socket.on('updateVendor', function(data) {
            hudHandler.updateVendor(data);
        });

        this.socket.on('respawn', function(data) {
            var unit = ironbane.getUnitList().findUnit(data.id);

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
                        ironbane.player.updateWeapon(0);

                        terrainHandler.ChangeZone(data.z);

                        ironbane.player.unitStandingOn = null;

                        hudHandler.ShowHUD();


                        hudHandler.showInv({slots: 10, items: playerData.items});
                    });
                }

                unit.canMove = true;
                unit.dead = false;

                unit.Respawn();
            }
        });

        //        this.socket.on('doSwing', function (data) {
        //            //if ( !socketHandler.loggedIn ) return;
        //
        //            var unit = FindUnit(data.id);
        //
        //            unit.swingWeapon();
        //        });
        // this.socket.on('swingWeapon', function (data) {
        //     var attacker = FindUnit(data.id);

        //     var weapon = !_.isUndefined(data.w) ? items[data.w] : null;

        //     if ( data['p'] == null ) {
        //         attacker.swingWeapon(null, weapon);
        //     }
        //     else {
        //         var attackPosition = ConvertVector3(data['p']);

        //         if ( attacker ) {
        //             attacker.swingWeapon(attackPosition, weapon);
        //         }
        //     }
        // });

        this.socket.on('setStat', function(data) {
            var unit = ironbane.getUnitList().findUnit(data.id);

            if (unit) {
                if (data.s == 'h') {
                    //unit.health = data['h'];
                    unit.setHealth(data.h, data.np);
                    if (unit == ironbane.player) {
                        hudHandler.makeHealthBar(true);
                    }
                }
                if (data.s == 'a') {
                    //unit.armor = data['a'];
                    unit.setArmor(data.a, data.np);
                    if (unit == ironbane.player) {
                        hudHandler.makeArmorBar(true);
                    }
                }
                if (data.s == 'hm') {
                    unit.healthMax = data.hm;
                    if (unit == ironbane.player) {
                        hudHandler.makeHealthBar(true);
                    }
                }
                if (data.s == 'am') {
                    unit.armorMax = data.am;
                    if (unit == ironbane.player) {
                        hudHandler.makeArmorBar(true);
                    }
                }
            }
        });

        this.socket.on('teleport', function(data) {

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


        this.socket.on('getMeleeHit', function(data) {
            //if ( !socketHandler.loggedIn ) return;

            var victim = ironbane.getUnitList().findUnit(data.victim);
            var attacker = ironbane.getUnitList().findUnit(data.attacker);

            victim.setHealth(data.h);
            victim.setArmor(data.a);
            victim.GetMeleeHit(attacker);


        });

        this.socket.on('removeUnit', function(data) {

            // Remove the unit from the list
            var unit = _.find(ironbane.getUnitList().all(), function(unit) {
                return unit.id === data.id;
            });

            if ( unit ) {
                unit.Destroy();
                ironbane.getUnitList().removeUnit(unit);
            }
            
        });

        this.socket.on('addModel', function(data) {

            levelEditor.PlaceModel(ConvertVector3(data.position),
                data.rX,
                data.rY,
                data.rZ,
                parseInt(data.param, 10));

        });

        this.socket.on('paintModel', function(data) {

            // Find the model at this position, and reload it

            if (data.global) {
                // When global, change preMeshes
                _.extend(preMeshes[data.id], data.metadata);


                var cellPos = WorldToCellCoordinates(data.pos.x,
                    data.pos.z, cellSize);

                _.each(terrainHandler.GetCellByGridPosition(cellPos.x, cellPos.z).objectData, function(obj) {

                    if (obj.metadata &&
                        ConvertVector3(obj).equals(ConvertVector3(data.pos).Round())) {
                        _.extend(obj.metadata, data.metadata);
                    }


                });


                _.each(terrainHandler.cells, function(cell) {
                    cell.ReloadObjectsOnly();
                });
            } else {

                var cellPos = WorldToCellCoordinates(data.pos.x,
                    data.pos.z, cellSize);

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
                            var metadata = data.metadata;


                            levelEditor.PlaceModel(ConvertVector3(data.pos),
                                rotation.x,
                                rotation.y,
                                rotation.z,
                                param, metadata);

                            cell.objects = _.without(cell.objects, obj);

                            obj.Destroy();
                        }


                    });
                });
            }
        });

        this.socket.on('deleteModel', function(pos) {

            pos = ConvertVector3(pos).Round(2);

            if ( pos.equals(ironbane.newLevelEditor.selectedObjectOldPosition.clone().Round(2)) ) {
                // We want to remove the object we are currently holding!
                // So Undo it so we can find it here
                ironbane.newLevelEditor.Undo();
            }


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

                        ironbane.removeUnit(obj);

                    }
                });

                if (!le("globalEnable")) {
                    var newList = [];
                    _.each(cell.objectData, function(obj) {
                        if (!ConvertVector3(obj).equals(pos)) newList.push(obj);
                    });
                    cell.objectData = newList;
                }
            });

            if (!le("globalEnable")) {
                console.log("deleting model");
                terrainHandler.GetCellByWorldPosition(pos).Reload();
            }


            terrainHandler.RebuildOctree();

        });


        // Pathfinding
        this.socket.on('ppAddNode', function(data) {
            if (!showEditor) return;

            nodeHandler.AddNode(0, data.id, ConvertVector3(data.pos));
        });

        this.socket.on('ppAddEdge', function(data) {
            if (!showEditor) return;

            nodeHandler.AddEdge(0, data.from, data.to, data.twoway);
        });

        this.socket.on('ppDeleteNode', function(data) {
            if (!showEditor) return;

            nodeHandler.DeleteNode(0, data.id);
        });


        this.socket.on('snapshot', function(snapshot) {
            //if ( !socketHandler.loggedIn ) return;
            socketHandler.bytesReceived += 2 * snapshot.length;
            for (var x = 0; x < snapshot.length; x++) {
                var unitdata = snapshot[x];
                var unit = ironbane.getUnitList().findUnit(unitdata.id);
                if (unit) {
                    if (unit != ironbane.player) {

                        if ( le("mpTransformMode")
                            && ironbane.newLevelEditor
                            && ironbane.newLevelEditor.selectedObject
                            && ironbane.newLevelEditor.selectedObject.unit === unit ) continue;

                        if (!_.isUndefined(unitdata.p)) {
                            unit.targetPosition.x = unitdata.p.x;
                            unit.targetPosition.z = unitdata.p.z;
                            unit.targetPosition.y = unitdata.p.y;
                        }

                        if (!_.isUndefined(unitdata.rx)) unit.targetRotation.x = unitdata.rx;
                        if (!_.isUndefined(unitdata.ry)) unit.targetRotation.y = unitdata.ry;
                        if (!_.isUndefined(unitdata.rz)) unit.targetRotation.z = unitdata.rz;

                        if (!_.isUndefined(unitdata.u)) {
                            unit.unitStandingOn = ironbane.getUnitList().findUnit(unitdata.u);
                        } else {
                            unit.unitStandingOn = null;
                        }

                        // Only for fighters, otherwise zeppelins etc start to bug
                        if ( unit instanceof Fighter ) {
                            if (Math.abs(unit.object3D.position.y - unitdata.p.y) > 1) unit.object3D.position.y = unitdata.p.y;
                        }
                    }
                }
            }
        });
    

    };
}

    }
});

var socketHandler = new SocketHandler();
