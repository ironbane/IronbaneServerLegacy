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

        this.serverOnline = typeof io === 'undefined' ? false : true;

        this.spawnLocation = null;
        this.spawnRotation = 0;

        this.playerData = null;

        this.readyToReceiveUnits = false;

        this.inGame = false;


        this.InitConnection();

    },
    InitConnection: function() {

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
                var unit = FindUnit(data.id);

                if (unit) {
                    ironbane.unitList.push(new ChatBubble(unit, data['message']));
                }
            });


            this.socket.on('disconnect', function() {



                socketHandler.socket.disconnect();


                for (var u = 0; u < ironbane.unitList.length; u++) ironbane.unitList[u].Destroy();

                ironbane.unitList = [];

                terrainHandler.Destroy();

                ironbane.player = null;

                socketHandler.loggedIn = false;

                if (!noDisconnectTrigger) {
                    socketHandler.serverOnline = false;

                    hudHandler.MessageAlert('It appears the server crashed! Either that, or there is something wrong with your internet connection. I\'m terribly sorry about that.<br><br>In case the server crashed, an auto-restart will most-likely occur. Please refresh the page in a few seconds.', 'nobutton');
                }



                //hudHandler.ShowMenuScreen();

                //hudHandler.Init();


                //alert('socket disconnected');
            });



        }

    },
    Connect: function(abortConnect) {
        if (!this.serverOnline) return;

        if (!ISDEF(startdata.characterUsed)) return;

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
            if (ISDEF(reply.errmsg)) {
                hudHandler.MessageAlert(reply.errmsg);
                abortConnect();
                hudHandler.ShowMenuScreen();
                return;
            }

            socketHandler.loggedIn = true;

            // Get a spawn from the server
            socketHandler.spawnLocation = ConvertVector3(reply.position);
            socketHandler.spawnRotation = reply.rotY;

            socketHandler.playerData = reply;

            setTimeout(function() {
                ironbane.showingGame = false;
            }, 100);

            terrainHandler.ChangeZone(reply.zone);

            socketHandler.inGame = true;

            if (reply.editor) {
                showEditor = true;
                levelEditor.Start();
            }

            hudHandler.MakeSlotItems(false);
        });
    },
    Setup: function() {

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
                    unit = new MovingObstacle(ConvertVector3(data.position), new THREE.Vector3(data.rotX, data.rotY, data.rotZ), data.id, data.param, data.metadata);
                    break;
                case UnitTypeEnum.TRAIN:
                    unit = new Train(ConvertVector3(data.position), new THREE.Vector3(data.rotX, data.rotY, data.rotZ), data.id, data.param, data.metadata);
                    break;
                case UnitTypeEnum.TOGGLEABLEOBSTACLE:
                    unit = new ToggleableObstacle(ConvertVector3(data.position), new THREE.Vector3(data.rotX, data.rotY, data.rotZ), data.id, data.param, data.metadata);
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
                    unit = new Sign(ConvertVector3(data.position), new THREE.Vector3(data.rotX, data.rotY, data.rotZ), data.id, data.param, data.metadata);
                    break;
                case UnitTypeEnum.LOOTABLE:
                    if ( data.param < 10 ) {
                      unit = new LootBag(ConvertVector3(data.position), data.id, data.param);
                    } else {
                      unit = new LootableMesh(ConvertVector3(data.position), new THREE.Vector3(data.rotX, data.rotY, data.rotZ), data.id, data.param, data.metadata);
                    }
                    break;
                default:
                    // return;
                    unit = new Fighter(ConvertVector3(data.position), new THREE.Vector3(0, data.rotY, 0), data.id, unitname, data.param, data['size'], data['health'], data['armor'], data['healthMax'], data['armorMax']);
                    break;
            }

            if ( data.id < 0 ) {
                unit.template = template;
            }


            if (unit instanceof Fighter) {
                // Update clothing
                unit.appearance.hair = data['hair'];
                unit.appearance.skin = data['skin'];
                unit.appearance.eyes = data['eyes'];
                unit.appearance.body = data['body'];
                unit.appearance.head = data['head'];
                unit.appearance.feet = data['feet'];

                if (template.type == UnitTypeEnum.TURRET) {
                    if (!showEditor || !levelEditor.editorGUI.opShowDebug) {
                        unit.appearance.hair = 0;
                        unit.appearance.eyes = 0;
                        unit.appearance.skin = 0;
                        unit.appearance.body = 0;
                        unit.appearance.head = 0;
                        unit.appearance.feet = 0;

                        unit.enableShadow = false;
                    }
                }
            }



            if (unit) {
                if (unit instanceof Fighter) {
                    unit.UpdateClothes();

                    if (ISDEF(data['weapon'])) {
                        unit.UpdateWeapon(data['weapon']);
                    }
                }

                ironbane.unitList.push(unit);
            }
        });
        this.socket.on('doJump', function(data) {
            //if ( !socketHandler.loggedIn ) return;

            var unit = FindUnit(data.id);

            unit.Jump();


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

            var unit = FindUnit(data.id);

            if (unit && unit instanceof ToggleableObstacle) {
                unit.Toggle(data['on']);
            }


        });

        this.socket.on('addParticle', function(data) {
            //if ( !socketHandler.loggedIn ) return;



            if (ISDEF(data['fu'])) {
                var unit = FindUnit(data['fu']);
                particleHandler.Add(ParticleTypeEnum[data['p']], {
                    followUnit: unit
                });
            } else if (ISDEF(data['pfu'])) {
                var unit = FindUnit(data['pfu']);
                particleHandler.Add(ParticleTypeEnum[data['p']], {
                    particleFollowUnit: unit
                });
            } else if (ISDEF(data['pos'])) {
                particleHandler.Add(ParticleTypeEnum[data['p']], {
                    position: ConvertVector3(data['pos'])
                });
            }


        });

        this.socket.on('addProjectile', function(data) {
            //if ( !socketHandler.loggedIn ) return;

            var unit = FindUnit(data['o']);

            // if ( !data['p'] || !ISDEF(ProjectileTypeEnum[data['p']]) ) ba('Bad projectile type');

            if (unit) {
                // Alter the start position to cope with lag
                data['s'] = unit.position.clone();

                // Take into account the size
                data.s.y += unit.size * 0.5;
            }

            var weapon = ISDEF(data.w) ? items[data.w] : null;

            var target = ConvertVector3(data['t']);

            if (data.sw) {
                unit.SwingWeapon(target, weapon);
            }

            var particle = new Projectile(ConvertVector3(data['s']), target, unit, data['w']);

            particle.velocity.addSelf(unit.fakeVelocity);



            ironbane.unitList.push(particle);
        });

        this.socket.on('updateClothes', function(data) {
            //if ( !socketHandler.loggedIn ) return;

            var unit = FindUnit(data.id);

            unit.appearance.head = data['head'];
            unit.appearance.body = data['body'];
            unit.appearance.feet = data['feet'];

            unit.UpdateClothes();

        });

        this.socket.on('updateWeapon', function(data) {
            //if ( !socketHandler.loggedIn ) return;

            var unit = FindUnit(data.id);

            unit.UpdateWeapon(data['weapon']);

        });

        this.socket.on('receiveItem', function(data) {
            // occurs when someone nearby loots from a bag
            // refresh the bag

            socketHandler.playerData.items.push(data);

            hudHandler.ReloadInventory();

        });

        this.socket.on('lootFromBag', function(data) {
            // occurs when someone nearby loots from a bag
            // refresh the bag
            console.log('lootFromBag REPLY:', data);
            hudHandler.ReloadInventory();
            if (ironbane.player.canLoot) {
                ironbane.player.lootItems = data.loot;
            }
        });

        this.socket.on('respawn', function(data) {

            var unit = FindUnit(data.id);

            if (unit) {

                unit.health = data['h'];
                unit.localPosition.copy(ConvertVector3(data['p']));

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
                        hudHandler.MakeHealthBar(true);


                        hudHandler.ReloadInventory();


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
        //            unit.SwingWeapon();
        //        });
        // this.socket.on('swingWeapon', function (data) {
        //     var attacker = FindUnit(data.id);

        //     var weapon = ISDEF(data.w) ? items[data.w] : null;

        //     if ( data['p'] == null ) {
        //         attacker.SwingWeapon(null, weapon);
        //     }
        //     else {
        //         var attackPosition = ConvertVector3(data['p']);

        //         if ( attacker ) {
        //             attacker.SwingWeapon(attackPosition, weapon);
        //         }
        //     }
        // });

        this.socket.on('setStat', function(data) {
            var unit = FindUnit(data.id);

            if (unit) {
                if (data['s'] == 'h') {
                    //unit.health = data['h'];
                    unit.SetHealth(data['h'], data['np']);
                    if (unit == ironbane.player) {
                        hudHandler.MakeHealthBar(true);
                    }
                }
                if (data['s'] == 'a') {
                    //unit.armor = data['a'];
                    unit.SetArmor(data['a'], data['np']);
                    if (unit == ironbane.player) {
                        hudHandler.MakeArmorBar(true);
                    }
                }
                if (data['s'] == 'hm') {
                    unit.healthMax = data['hm'];
                    if (unit == ironbane.player) {
                        hudHandler.MakeHealthBar(true);
                    }
                }
                if (data['s'] == 'am') {
                    unit.armorMax = data['am'];
                    if (unit == ironbane.player) {
                        hudHandler.MakeArmorBar(true);
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

                ironbane.player.localPosition.copy(data.pos);
                ironbane.player.unitStandingOn = null;


            });


        });


        this.socket.on('getMeleeHit', function(data) {
            //if ( !socketHandler.loggedIn ) return;

            var victim = FindUnit(data['victim']);
            var attacker = FindUnit(data['attacker']);

            victim.SetHealth(data['h']);



            victim.SetArmor(data['a']);



            victim.GetMeleeHit(attacker);


        });
        this.socket.on('setTileHeight', function(array) {

            if (!le("globalEnable")) return;

            for (var d = 0; d < array.length; d++) {
                var data = array[d];

                levelEditor.SetTileHeight(data['tx'], data['tz'], data['height'], false, false, true);
            }


            // Make all gameobjects re-init their height
            //            for(var u in ironbane.unitList){
            //                ironbane.unitList[u].positionedShadowMesh = false;
            //            }


        });
        this.socket.on('setTileImage', function(data) {
            if (!le("globalEnable")) return;

            levelEditor.SetTileImage(data['tx'], data['tz'], data['image'], false, true);
        });
        this.socket.on('removeUnit', function(data) {
            //if ( !socketHandler.loggedIn ) return;
            //bm('remove unit: '+data.id);

            // Remove the unit from the list
            for (var i = 0; i < ironbane.unitList.length; i++) {
                if (ironbane.unitList[i].id == data.id) {
                    ironbane.unitList[i].Destroy();
                    ironbane.unitList.splice(i, 1);
                    break;
                }
            }
        });



        this.socket.on('addModel', function(data) {
            //if ( !socketHandler.loggedIn ) return;
            //bm('remove unit: '+data.id);

            hudHandler.AddChatMessage('Adding model...');

            levelEditor.PlaceModel(ConvertVector3(data.position),
                data.rX,
                data.rY,
                data.rZ,
                parseInt(data.param));
        });

        this.socket.on('paintModel', function(data) {
            //if ( !socketHandler.loggedIn ) return;
            //bm('remove unit: '+data.id);

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
                            var metadata = obj.metadata;

                            cell.objects = _.without(cell.objects, obj);

                            obj.Destroy();

                            setTimeout(function() {
                                var unit = new Mesh(ConvertVector3(data.pos),
                                    rotation, 0, param, data.metadata);
                                ironbane.unitList.push(unit);
                                cell.objects.push(unit);
                            }, 1);
                        }


                    });
                });
            }
        });

        this.socket.on('deleteModel', function(pos) {

            pos = ConvertVector3(pos).Round(2);
            //if ( !socketHandler.loggedIn ) return;
            //bm('remove unit: '+data.id);


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
                        if (!ConvertVector3(obj).equals(pos)) newList.push(obj);
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
        this.socket.on('ppAddNode', function(data) {
            if (!showEditor) return;

            nodeHandler.AddNode(0, data.id, ConvertVector3(data['pos']));
        });

        this.socket.on('ppAddEdge', function(data) {
            if (!showEditor) return;

            nodeHandler.AddEdge(0, data['from'], data['to'], data['twoway']);
        });

        this.socket.on('ppDeleteNode', function(data) {
            if (!showEditor) return;

            nodeHandler.DeleteNode(0, data.id);
        });


        this.socket.on('snapshot', function(snapshot) {
            //if ( !socketHandler.loggedIn ) return;

            for (var x = 0; x < snapshot.length; x++) {
                var unitdata = snapshot[x];
                var unit = FindUnit(unitdata.id);
                if (unit) {
                    if (unit != ironbane.player) {

                        if (ISDEF(unitdata.p)) {
                            unit.targetPosition.x = unitdata.p.x;
                            unit.targetPosition.z = unitdata.p.z;
                            unit.targetPosition.y = unitdata.p.y;

                            // sw("unit.targetPosition", unit.targetPosition);
                        }
                        //this.targetPosition.y = unit.position.y;



                        if (ISDEF(unitdata.rx)) unit.targetRotation.x = unitdata.rx;
                        if (ISDEF(unitdata.ry)) unit.targetRotation.y = unitdata.ry;
                        if (ISDEF(unitdata.rz)) unit.targetRotation.z = unitdata.rz;


                        if (ISDEF(unitdata.u)) {
                            unit.unitStandingOn = FindUnit(unitdata.u);
                        } else {
                            unit.unitStandingOn = null;
                        }

                        if (Math.abs(unit.localPosition.y - unitdata.p.y) > 1) unit.localPosition.y = unitdata.p.y;


                        //						// If players are still too far away from their target we can't set their speed to 0
                        //						// Do some prediction
                        //						var distance = unit.targetPosition.clone().subSelf(unit.position).length();
                        ////						player.tSpeed = Math.max(player.tSpeed, distance * 10);
                        ////                                                player.tSpeed = Math.min(player.tSpeed, distance * 10);
                        //
                        ////                        unit.targetSpeed = Math.max(distance*100, 50);
                        ////                        unit.targetSpeed = Math.min(distance*100, max_speed);
                        //                        unit.targetSpeed = Math.max(distance*50, player.tSpeed);
                        //
                        //                        debug.SetWatch('unit.targetSpeed', unit.targetSpeed);
                    }
                }
            }
        });

    }
});

var socketHandler = new SocketHandler();
