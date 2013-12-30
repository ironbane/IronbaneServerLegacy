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

var dataPath = clientDir + 'data';

var pathFinder = require(APP_ROOT_PATH + '/src/server/game/pathFinder.js');
pathFinder.setPath(dataPath);

var aabb = require('aabb-3d'),
    test = require('assert-tap').test;

// For when node modules are used: 

// var Q = require('q');
// var THREE = require('three');
// var Snapshots = require('./snapshots.js');
// var Cells = require('./zones.js').Cells;
// var Zones = require('./zones.js').Zones;

var WorldHandler = Class.extend({
    Init: function() {

        this.zones = new Zones();

        this.switches = {};

    },
    Awake: function() {

        // All units ready! Awaken!
        return this.LoopUnits(function(u) {
            u.Awake();
        });

    },
    /** 
     * @method tick
     *
     * @param {Number} elapsed
     * @return {Object} - A promise.
     */
    tick: function(elapsed) {

      var self = this;

      return self.updateUnits(elapsed)
          .then(function() { 
              return self.getPlayers();
          })
          .then(function(players) {
              return Snapshots.broadcast(players);
          });


    },
    updateUnits: function(dTime) {

        return this.LoopUnits(function(unit) {

            if (unit.active) {
                unit.Tick(dTime);
            } 

        });
    },
    
    /**
     * @method getUnits
     * @return {Array} All of the units
     * handled by all cells in the world handler.
     **/
    getUnits : function() {

       var deferred = Q.defer(); 
       
       var allUnits = [];

       this.LoopUnits(function(unit) { 
           allUnits.push(unit);
       }).then(function() {
          deferred.resolve(allUnits); 
       });

       return deferred.promise;
    },
    /** 
     * @method getPlayers
     * @return {Array} - All of the units 
     * that are an instance of player.
     **/
    getPlayers : function() {
      
       return this.getUnits()
          .then(function(units) { 
             return _.filter(units, function(unit) { 
                return (unit instanceof Player);
             });
          });

    },
    /**
     * @method getNPCs
     * @return {Array} - All of the units
     * that are not an instance of player.
     **/
    getNPCs : function() {

       return this.getUnits()
          .then(function(units) { 
             return _.filter(units, function(unit) { 
                return !(unit instanceof Player);
             });
          });
    }, 
    /** 
     * @method autoSave
     * Auto-save all players currently managed by the world handler.
     **/
    autoSave : function() { 

       log('WorldHandler: Auto-saving all players.');
            
       this.getPlayers().then(function(players) {

           players.forEach(function(player) {
              player.Save(); 
           });

       });

    },
    addUnitToCell: function(unit, newCellX, newCellZ) {

        var self = this;

        var isPlayer = unit.id > 0;

        var zone = unit.zone;
        var x = newCellX;
        var z = newCellZ;

        var worldCoords = Cells.toWorldCoordinates(x,z);

        worldCoords.x += Cells.size() / 2;
        worldCoords.z += Cells.size() / 2;
        

        return Q()
            .then(function() { 
                if(isPlayer && unit.editor) { 
                    return self.requireCell(zone, x, z);
                }
            })
            .then(function() {

                return self.zones.emit(zone, 'addUnit', worldCoords, unit);

            })
            .then(function() {

                if(isPlayer) {

                   return self.zones.emitNear(unit.zone, 'activate', worldCoords)

                }

            })
            .fail(function(err) {

                test('WorldHandler -- Add Unit Error', function(t) { 

                    t.fail(err.message);
                    t.end();

                });

            });

    },

    removeUnitFromCell: function(unit, oldCellX, oldCellZ) {

        var self = this;

        var x = oldCellX;
        var z = oldCellZ;

        var isPlayer = unit.id > 0;

        var worldCoords = Cells.toWorldCoordinates(x,z);

        worldCoords.x += Cells.size() / 2;
        worldCoords.z += Cells.size() / 2; 

        return self.zones.emit(unit.zone, 'removeUnit', worldCoords, unit)
            .then(function() { 

                if(isPlayer) { 

                    return self.zones.emitNear(unit.zone, 'deactivate', worldCoords);
                }
    
            });
    },

    loadNavigationNodes: function() {

        console.log('WorldHandler: Loading navigation nodes.');

        return this.zones.selectAll()
            .then(function(zones) {

               _.each(zones, function(zone) {
                   pathFinder.loadZone(zone.id);
               });

              pathFinder.test();

            });

    },
    SaveWorld: function() {
        var self = this; 

        return self.LoopCellsWithIndex(function(z, cx, cz) {
            self.SaveCell(z, cx, cz);
        });
        
    },
    DoFullBackup: function() {
        chatHandler.announceRoom('mods', "Backing up server...", "blue");

        var deploySh = spawn('sh', ['serverbackup.sh'], {
            //cwd: process.env.HOME + '/myProject',
            cwd: '/root',
            env: _.extend(process.env, {
                PATH: process.env.PATH + ':/usr/local/bin'
            })
        });

        deploySh.stderr.on('data', function(data) {
            chatHandler.announceRoom('mods', data, "red");
            //console.log('stderr: ' + data);
        });

        // handle error so server doesn't crash...
        deploySh.on('error', function(err) {
            log('Error doing full backup!', err);
        });

        deploySh.on('exit', function(code) {
            chatHandler.announceRoom('mods', "Backup complete!", "blue");
            //console.log('child process exited with code ' + code);
        });
    },
    CheckWorldStructure: function(zoneId, cx, cz) {
       return !(_.isUndefined(this.zones.getCell(zoneId, cx, cz)));
    },
    requireCell : function(zoneId, cx, cz) {

       var deferred = Q.defer();

       if(!this.CheckWorldStructure(zoneId, cx, cz)) {

           this.GenerateCell(zoneId, cx, cz)
               .then(function() { 
                   deferred.resolve();
               });

       } else {

           deferred.resolve();

       }
    
       return deferred.promise; 

    },
    loadWorld: function() {
        var self = this;
        var total = 0;

        console.log('WorldHandler', 'Loading World.');
            

        return Cells.readInfo().then(function(info) {

            return Q.all(_.map(info, function(i) {
                return self.zones.createCell(i.zoneId, i.cellCoords);
            })).then(function() {

                var compare = info.length;

                var countCells = function() {

                    var count = 0;

                    return self.LoopCells(function() { 
                        count++;
                    }).then(function() { 
                        return count;
                    });

                };

                return countCells().then(function(count) {

                    test('WorldHandler -- Loaded Cells Test', function(t) {

                        t.equal(count, compare, count + '===' + compare);

                        _.each(info, function(i) {

                            var msg = 'Should have cell [ zone: ' + i.zoneId;
                            msg += ', cx: ' + i.cellCoords.x;
                            msg += ', cz: ' + i.cellCoords.z + ']';

                            t.ok(self.CheckWorldStructure(i.zoneId, i.cellCoords.x, i.cellCoords.z), msg);
                        });

                        t.end(); 

                    });

                }); 

            })
            .then(function() { 
                return Q.all(_.map(info, function(i) {

                    //Create all cells first because adding units effects neighbouring cells 
                    return self.loadUnits(i.zoneId, i.cellCoords.x, i.cellCoords.z)

                }));

            });
        })
        .then(function(result) {

            var compareUnits = _.flatten(result);

            test('WorldHandler -- Loaded Units Test', function(t) { 


                self.getNPCs().then(function(npcs) {

                    _.each(compareUnits, function(compareUnit) {

                        var msg = 'NPC ' + compareUnit.id + ' should exist.';

                        var check = _.some(npcs, function(npc) {
                            return npc.id === compareUnit.id;
                        });

                        t.ok(check, msg);

                    });

                    t.equal(compareUnits.length, npcs.length, 'Lengths of unit collections should be equal');

                    t.end();

                });

            }); 

        }).then(function() {
            return self.loadNavigationNodes(); 
        }).fail(function(err) {

            console.error('WorldHandler', err);

        });

    },

    /** 
     * @method LoopUnits
     * Applies fn to each unit in the 
     * world handler.
     **/
    LoopUnits : function(fn) {
       return this.LoopCells(function(cell) { 
           if (!_.isUndefined(cell.fields.units)) {
               _.each(cell.fields.units, function(unit) { 
                   fn(unit);
               });
           }
       }); 
    },
    LoopUnitsNear: function(zone, cellX, cellZ, fn, offset) {
        return this.LoopCellsNear(zone, cellX, cellZ, function(cell) {
            if (!_.isUndefined(cell.fields.units)) {
                _.each(cell.fields.units, function(unit) {
                    fn(unit);
                });
            }
        }, offset);
    },
    /**
     * @method LoopCells
     * Applieds fn to each cell in the world handler.
     **/
    LoopCells: function(fn) {
        
        return this.zones.selectAll()
          .then(function(zones) {
             _.each(zones, function(zone) {
                _.each(zone.cells, fn);
             }); 
          });

    },
    LoopCellsNear: function(zoneId, cellX, cellZ, fn, offset) {

        offset = offset || 1;

        var minX = cellX - offset;
        var maxX = cellX + offset;
        var minZ = cellZ - offset;
        var maxZ = cellZ + offset;

        return this.zones.selectZone(zoneId)
            .then(function(zone) {

                _.chain(zone.cells)
                .filter(function(cell) { 
                    return (
                        cell.getX() >= minX &&
                        cell.getX() <= maxX &&
                        cell.getZ() >= minZ &&
                        cell.getZ() <= maxZ
                        );
                }).each(function(cell) {
                    fn(cell);
                });

            }); 
    },
    LoopCellsWithIndex: function(fn) {
        
        return this.zones.selectAll()
            .then(function(zones) {
               _.each(zones, function(zone) {
                  _.each(zone.cells, function(cell) {
                      fn(zone.id, cell.getX(), cell.getZ());
                  });

               }); 

            });
    },
    LoadSwitches: function() {
        var self = this;
        self.switches = {};

        mysql.query('SELECT * FROM ib_switches', function(err, results) {
            if (err) {
                console.log('DB error loading switches!', err);
                throw err;
            }

            _.each(results, function(switchData) {
                self.switches[switchData.id] = new Switch(switchData.id, switchData.output1, switchData.output2, switchData.output3, switchData.output4);
            });
        });
    },
    loadUnits: function(zone, cellX, cellZ) {

        var self = this;

        var deferred = Q.defer();

        var worldPos = Cells.toWorldCoordinates(cellX, cellZ);

        var halfSize = Cells.size() / 2;

        var dbQuery = 'SELECT * FROM ib_units WHERE zone = ? AND x > ? AND z > ? AND x < ? AND z < ?';

        var x0 = (worldPos.x - halfSize), 
            z0 = (worldPos.z - halfSize),
            x1 = (worldPos.x + halfSize),
            z1 = (worldPos.z + halfSize);
        

        mysql.query(dbQuery, [zone, x0, z0, x1, z1], function(err, results) {

            if (err) {
                console.error('WorldHandler: DB error loading units!', err);
                deferred.reject(err);
            }

            Q.all(_.map(results, function(unitData) {

                var unit = self.MakeUnitFromData(unitData);

                if(unit) { 
                    return unit.load().then(function() {
                        return unit; 
                    });
                }

                return unit; 

            })).then(function(units) {
                deferred.resolve(_.reject(units, _.isUndefined.bind(_))); 
            }).fail(function(err) {
                deferred.reject(err);
            });

        });

        return deferred.promise;
    },
    MakeUnitFromData: function(data) {

        data.id = -data.id;

        if (typeof data.data === "string") {
            data.data = JSON.parse(data.data);
        }

        if (_.isUndefined(dataHandler.units[data.template])) {
            log("Warning! Unit template " + data.template + " not found!");
            log("Cleaning up MySQL...");

            mysql.query('DELETE FROM ib_units WHERE template = ?', [data.template], function(err) {
                if (err) {
                    throw err;
                }
            });

            return null;
        }

        data.template = dataHandler.units[data.template];
        // Depending on the param, load different classes

        // Set the appearance on the NPC so we can customize it later
        data.skin = data.template.skin;
        data.eyes = data.template.eyes;
        data.hair = data.template.hair;
        data.head = data.template.head;
        data.body = data.template.body;
        data.feet = data.template.feet;
        data.displayweapon = data.template.displayweapon;
        // utilize custom respawns from db
        data.respawntime = data.template.respawntime;

        var unit = null;

        switch (data.template.type) {
            case UnitTypeEnum.NPC:
            case UnitTypeEnum.MONSTER:
            case UnitTypeEnum.VENDOR:
            case UnitTypeEnum.TURRET:
            case UnitTypeEnum.TURRET_STRAIGHT:
            case UnitTypeEnum.TURRET_KILLABLE:
            case UnitTypeEnum.WANDERER:
                unit = new NPC(data);
                break;

            case UnitTypeEnum.MOVINGOBSTACLE:
                if (data.data) {
                    // Convert data rotations to regular members
                    data.rotx = data.data.rotX;
                    data.roty = data.data.rotY;
                    data.rotz = data.data.rotZ;
                }

                unit = new MovingObstacle(data);
                break;

            case UnitTypeEnum.TOGGLEABLEOBSTACLE:
                if (data.data) {
                    // Convert data rotations to regular members
                    data.rotx = data.data.rotX;
                    data.roty = data.data.rotY;
                    data.rotz = data.data.rotZ;
                }

                unit = new ToggleableObstacle(data);
                break;

            case UnitTypeEnum.TRAIN:
                if (data.data) {
                    // Convert data rotations to regular members
                    data.rotx = data.data.rotX;
                    data.roty = data.data.rotY;
                    data.rotz = data.data.rotZ;
                } else if (!data || !data.scriptName) {
                    // Can't live without a script!
                    log("Warning: no script found for Train " + data.id);
                    return;
                }

                unit = new Train(data);
                break;

            case UnitTypeEnum.LEVER:
                unit = new Lever(data);
                break;

            case UnitTypeEnum.TELEPORTENTRANCE:
                unit = new TeleportEntrance(data);
                break;

            case UnitTypeEnum.TELEPORTEXIT:
                unit = new TeleportExit(data);
                break;

            case UnitTypeEnum.MUSICPLAYER:
                unit = new MusicPlayer(data);
                break;

            case UnitTypeEnum.SIGN:
                if (data.data) {
                    // Convert data rotations to regular members
                    data.rotx = data.data.rotX;
                    data.roty = data.data.rotY;
                    data.rotz = data.data.rotZ;
                }

                unit = new Sign(data);
                break;

            case UnitTypeEnum.WAYPOINT:
                unit = new Waypoint(data);
                break;

            case UnitTypeEnum.TRIGGER:
                unit = new Trigger(data);
                break;

            case UnitTypeEnum.LOOTABLE:
                if (data.data) {
                    // Convert data rotations to regular members
                    data.rotx = data.data.rotX;
                    data.roty = data.data.rotY;
                    data.rotz = data.data.rotZ;
                }

                unit = new Lootable(data, true);
                break;

            case UnitTypeEnum.HEARTPIECE:
                unit = new HeartPiece(data);
                break;

            case UnitTypeEnum.BANK:
                unit = new Bank(data);
                break;

            default:
                //console.log('loading default Unit for: ', data);
                unit = new Unit(data);
                break;
        }

        return unit;
    },

    clearObjects : function(zoneId, cellX, cellZ) {
       return this.zones.clearObjects(zoneId, cellX, cellZ);
    },

    addObject : function(zoneId, cellX, cellZ, object) {

       return this.zones.getObjects(zoneId, cellX, cellZ)
          .then(function(objects) {
              objects.push(object);
          });

    },

    emitChangeObject : function(zoneId, cellX, cellZ, pushData) {

       return this.zones.getChangeBuffer(zoneId, cellX, cellZ)
           .then(function(changeBuffer) { 
              changeBuffer.push(pushData);
           });

    },

    emitDeleteObject : function(zoneId, cellX, cellZ, object) {

       return this.zones.getDeleteBuffer(zoneId, cellX, cellZ)
           .then(function(deleteBuffer) {
              deleteBuffer.push(object); 
           });

    },
    clearUnits : function(zoneId, cellX, cellZ) {

       var deferred = Q.defer();

       this.zones.getCell(zoneId, cellX, cellZ).units = [];

       deferred.resolve();

       return deferred.promise;

    },
    LoadCell: function(zoneId, cellX, cellZ) {

        var self = this;

        var deferred = Q.defer();

        // Query the entry
        var path = dataPath + "/" + zoneId + "/" + cellX + "/" + cellZ;

        fsi.mkdirSync(path, 0777, true, function(err) {
            if (err) {
                log("Error:" + err);
            } else {
                log('Directory created');
            }
        });

        if (fs.existsSync(path + "/objects.json")) {
            // Load static gameobjects
            try {
                stats = fs.lstatSync(path + "/objects.json");

                if (stats.isFile()) {

                    var objects =  JSON.parse(fs.readFileSync(path + "/objects.json", 'utf8'));

                     self.clearObjects()
                         .then(function() {

                            var promises = _.map(objects, function(object) {
                               return self.addObject(object); 
                            });

                            return Q.all(promises); 

                         })
                         .then(function() {
                            return self.clearUnits(zoneId, cellX, cellZ);
                         })
                         .then(function() {
                            deferred.resolve(); 
                         });

                }
            } catch (e) {

                console.error('WorldHandler.LoadCell:', err);
                deferred.reject(e);

            }
        }

        return deferred.promise;

    },
    GenerateCell: function(zone, cellX, cellZ) {

        var self = this;

        var cellCoords = new THREE.Vector3(cellX, 0, cellZ);

        return this.zones.createCell(zone, new THREE.Vector3(cellX, 0, cellZ))
            .then(function() {

                log("Generated cell (" + cellX + "," + cellZ + ")");

                self.SaveCell(zone, cellX, cellZ, true);

            });
    },
    SaveCell: function(zone, cellX, cellZ, clearObjects) {

        var self = this,
            doClearObjects = clearObjects || false;

        chatHandler.announceRoom('editors', "Saving cell " + cellX + ", " + cellZ + " in zone " + zone + "...");
  
        this.LoadCell(zone, cellX, cellZ)
            .then(function() {

                if (doClearObjects) {

                    return self.zones.clearObjects(); 

                }

            })
            .then(function() {

               var objectsPromise = self.zones.getObjects(zone, cellX, cellZ);
               var changeBufferPromise = self.zones.getChangeBuffer(zone, cellX, cellZ);
               var deleteBufferPromise = self.zones.getDeleteBuffer(zone, cellX, cellZ);


               return [ objectsPromise, changeBufferPromise, deleteBufferPromise ];
            })
            .spread(function(objects, changeBuffer, deleteBuffer) {
        
                objects = JSON.parse(JSON.stringify(objects));
                objects = updateMetadata(changeBuffer, objects); 
                objects = deleteObjects(deleteBuffer, objects);

                return objects;

            })
            .then(function(objects) {

                // Query the entry
                var path = dataPath + "/" + zone + "/" + cellX + "/" + cellZ;

                fsi.mkdirSync(path, 0777, true, function(err) {
                    if (err) {
                        log("Error:" + err);
                    } else {
                        log('Directory created');
                    }
                });

                var str = JSON.stringify(objects, null, 4);
                fs.writeFileSync(path + "/objects.json", str);

                log("Saved cell (" + cellX + "," + cellZ + ") in zone " + zone + "");

                // Clean up
                return self.zones.clearObjects(zone, cellX, cellZ);
                
            });
 

        function updateMetadata(changeBuffer, objects) {

            if (!_.isUndefined(changeBuffer)) {
                _.each(changeBuffer, function(obj) {

                    var pos = ConvertVector3(obj.pos);
                    pos = pos.Round(2);

                    _.each(objects, function(loopObj) {

                        if (pos.x === loopObj.x && 
                            pos.y === loopObj.y && 
                            pos.z === loopObj.z) {

                            if (_.isEmpty(obj.metadata)) {
                                delete loopObj.metadata;
                            } else {

                                if (_.isUndefined(loopObj.metadata)) {
                                    loopObj.metadata = {};
                                }

                                _.extend(loopObj.metadata, obj.metadata);
                            }
                        }
                    });
                });
            }

            return objects;

        }

        function deleteObjects(deleteBuffer, objects) { 

            // Delete the things from the terrain in the deleteBuffer
            if (!_.isUndefined(deleteBuffer)) {

                _.each(deleteBuffer, function(deleteObj) {

                    var deleteObjPos = ConvertVector3(deleteObj).Round(2);

                    _.each(objects, function(loopObj) {

                        var loopObjPos = ConvertVector3(loopObj).Round(2);

                        if (deleteObjPos.x === loopObjPos.x && 
                            deleteObjPos.y === loopObjPos.y && 
                            deleteObjPos.z === loopObjPos.z) {

                            objects = _.without(objects, loopObj);
                            deleteBuffer = _.without(deleteBuffer, deleteObj);
                        }

                    });
                });

            }
            return objects;
        }

    },
    UpdateNearbyUnitsOtherUnitsLists: function(zoneId, cellX, cellZ) {
        
        return this.LoopUnitsNear(zoneId, cellX, cellZ, function(unit) {
            unit.UpdateOtherUnitsList();
        }, 1)
        .fail(function(err) {

            test('WorldHandler -- UpdateNearbyUnitsOtherUnitsLists', function(t) { 
            
                t.fail(err.message);
                t.end();

            });

        });

    },
    FindUnit: function(id) {

        return this.getUnits()
            .then(function(units) {

               // Reject promise when no unit is found
               var err = new Error('WorldHandler: Unit ' + id + ' not found.');

               var found = _.find(units, function(unit) {
                  return unit.id === id; 
               });
                
               if(!_.isUndefined(found)) { 
                   return found;
               }

               throw err;
                
            });
    },

    // get ALL units matching name and in optional zone
    findUnitsByName: function(name, zoneId) {

        return this.getNPCs()
            .then(function(npcs) { 
                return _.chain(npcs)
                .filter(function(unit) { 
                    return !_.isUndefined(zoneId) ?
                    unit.zone === zoneId : true;
                })
                .filter(function(unit) { 

                    return unit.data &&
                    unit.data.name &&
                    unit.data.name === name;

                })
                .value();
            });

    },

    // locate a unit (non-player) by data.name, 
    findUnitByName: function(name, zoneId) {

        return this.getNPCs()
           .then(function(npcs) { 
              return (_.chain(npcs)
                 .filter(function(unit) {
                     return !_.isUndefined(zoneId) ? 
                        unit.zone === zoneId : true;
                })
                .find(function(unit) {

                    return unit.data &&
                    unit.data.name &&
                    unit.data.name === name;

                })
                .value() || null);
          });
    },

    // Only for players!!!!
    FindPlayerByName: function(name) {

        return this.getPlayers()
           .then(function(players) {
              
              return ( _.chain(players)
                 .find(function(unit) {

                   return unit.name &&
                   unit.name === name;

                 })
                 .value() || null);

           });

    },

    FindUnitNear: function(id, nearUnit) {

        var zoneId = nearUnit.zone;
        var cx = nearUnit.cellX;
        var cz = nearUnit.cellZ;

        var nearby = [];

        return this.LoopUnitsNear(zoneId, cx, cz, function(unit) {
            if(unit.id === id) {
               nearby.push(unit);
            }
        }, 1)
        .then(function() {

          return (_.first(nearby) || null); 

        });

    },

    BuildWaypointListFromUnitIds: function(list) {

        var self = this,
            newList = [];

        var promises = _.map(list, function(number) {

           return self.FindUnit(-number)
              .then(function(unit) { 
                  if (unit) {

                      // Passing by reference on purpose, for dynamic waypoints in the future
                      newList.push({
                          id: number,
                          pos: unit.position
                      });

                  }
              });

        });

        return Q.all(promises)
           .then(function() {
               return newList;
           });
    }

});

var worldHandler = new WorldHandler();
