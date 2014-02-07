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

var aabb = require('aabb-3d');

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

    /**
     * @method getCells
     * @return {Array} - A list of promises, for all cells in all zones.
     **/
    getCells: function() {

        var promises = [];

        return this.LoopCells(function(cell) {
            promises.push(cell);
        }).then(function() {
            return promises;
        }, function(err) {
            return Q.reject(err);
        });

    },

    Awake: function() {
        log("Awakening world");
        return this.getCells().then(function(cells) {
            return Q.all(_.map(cells, function(cell) {
                return cell.awake();
            }));

        }).then(function() {
            log("World has awaken!");
        }).fail(function(err) {
            console.log(err.stack);
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
    getUnits: function() {

        var deferred = Q.defer();

        var allUnits = [];

        this.LoopUnits(function(unit) {
            allUnits.push(unit);
        }).then(function() {
            deferred.resolve(allUnits);
        }).fail(function(error) {
            deferred.reject(error);
        });

        return deferred.promise;
    },
    /**
     * @method getPlayers
     * @return {Array} - All of the units
     * that are an instance of player.
     **/
    getPlayers: function() {

        return this.getUnits()
            .then(function(units) {
                return _.filter(units, function(unit) {
                    return (unit instanceof Player);
                });
            }, function(err) {
                return Q.reject(err);
            });

    },
    /**
     * @method getNPCs
     * @return {Array} - All of the units
     * that are not an instance of player.
     **/
    getNPCs: function() {

        return this.getUnits()
            .then(function(units) {
                return _.filter(units, function(unit) {
                    return !(unit instanceof Player);
                });
            }, function(err) {
                return Q.reject(err);
            });
    },
    /**
     * @method autoSave
     * Auto-save all players currently managed by the world handler.
     **/
    autoSave: function() {

        log('WorldHandler: Auto-saving all players.');

        this.getPlayers().then(function(players) {
            players.forEach(function(player) {
                player.Save();
            });
        })
            .fail(function(err) {
                console.log(err.stack);
            });

    },
    addUnitToCell: function(unit, newCellX, newCellZ) {

        var self = this;

        var isPlayer = unit.id > 0;

        var zone = unit.zone;
        var x = newCellX;
        var z = newCellZ;

        var cellCoords = new THREE.Vector3(x, 0, z);


        return Q().then(function() {

            if (isPlayer && unit.editor) {
                return self.requireCell(zone, x, z);
            }

        }).then(function() {

            return self.zones.emit(zone, 'addUnit', cellCoords, unit);

        }).then(function() {

            if (isPlayer) {

                return self.zones.emitNear(unit.zone, 'activate', cellCoords);

            }

        }).fail(function(err) {

            console.error('WorldHandler -- Add Unit Error', err);

        });

    },

    removeUnitFromCell: function(unit, oldCellX, oldCellZ) {

        var self = this;

        var x = oldCellX;
        var z = oldCellZ;

        var isPlayer = unit.id > 0;

        var cellCoords = new THREE.Vector3(x, 0, z);

        return self.zones.emit(unit.zone, 'removeUnit', cellCoords, unit).then(function() {

            if (isPlayer) {

                return self.zones.emitNear(unit.zone, 'deactivate', cellCoords);
            }

        }).fail(function(err) {

            console.err('WorldHandler.removeUnitFromCell', err);

        });
    },

    loadNavigationNodes: function() {

        console.log('WorldHandler: Loading navigation nodes.');

        return this.zones.selectAll().then(function(zones) {

            _.each(zones, function(zone) {
                pathFinder.loadZone(zone.id);
            });

            pathFinder.test();

        })
            .fail(function(err) {
                console.error(err.stack);
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
    requireCell: function(zoneId, cx, cz) {

        var deferred = Q.defer();

        if (!this.CheckWorldStructure(zoneId, cx, cz)) {

            this.GenerateCell(zoneId, cx, cz).then(function() {
                deferred.resolve();
            }, function(err) {
                deferred.reject(err);
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

                return Q.all(_.map(info, function(i) {

                    //Create all cells first because adding units effects neighbouring cells
                    return self.loadUnits(i.zoneId, i.cellCoords.x, i.cellCoords.z)

                }));

            }, function(err) {
                return Q.reject(err);
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
    LoopUnits: function(fn) {
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
            }, function(err) {
                return Q.reject(err);
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

            }, function(err) {
                return Q.reject(err);
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

            }, function(err) {
                return Q.reject(err);
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
                return deferred.reject(err);
            }

            Q.all(_.map(results, function(unitData) {

                var unit = self.MakeUnitFromData(unitData);

                if (unit) {
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

    GenerateCell: function(zone, cellX, cellZ) {

        var self = this;

        var cellCoords = new THREE.Vector3(cellX, 0, cellZ);

        return this.zones.createCell(zone, new THREE.Vector3(cellX, 0, cellZ))
            .then(function() {

                log('Generated cell (' + cellX + ',' + cellZ + ')');

                self.SaveCell(zone, cellX, cellZ, true, [], [], []);

            }, function(err) {
                return Q.reject(err);
            });
    },
    SaveCell: function(zoneId, cellX, cellZ, shouldClear, objects, changes, deletes) {

        var cellCoords = new THREE.Vector3(cellX, 0, cellZ);

        return this.zones.emit(zoneId, 'edit', cellCoords, shouldClear, objects, changes, deletes);

    },
    UpdateNearbyUnitsOtherUnitsLists: function(zoneId, cellX, cellZ) {

        return this.LoopUnitsNear(zoneId, cellX, cellZ, function(unit) {
            unit.UpdateOtherUnitsList();
        }, 1).fail(function(err) {
            console.error('WorldHandler.UpdateOtherUnitsList', err);
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

                if (!_.isUndefined(found)) {
                    return found;
                }

                throw err;

            }, function(err) {
                return Q.reject(err);
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
            }, function(err) {
                return Q.reject(err);
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
            }, function(err) {
                return Q.reject(err);
            });
    },

    // Only for players!!!!
    FindPlayerByName: function(name) {

        return this.getPlayers()
            .then(function(players) {

                return (_.chain(players)
                    .find(function(unit) {

                        return unit.name &&
                            unit.name === name;

                    })
                    .value() || null);

            }, function(err) {
                return Q.reject(err);
            });

    },

    FindUnitNear: function(id, nearUnit) {

        var zoneId = nearUnit.zone;
        var cx = nearUnit.cellX;
        var cz = nearUnit.cellZ;

        var nearby = [];

        return this.LoopUnitsNear(zoneId, cx, cz, function(unit) {
            if (unit.id === id) {
                nearby.push(unit);
            }
        }, 1)
            .then(function() {

                return (_.first(nearby) || null);

            }, function(err) {
                return Q.reject(err);
            });

    },

    BuildWaypointListFromUnitIds: function(list) {

        var self = this;

        var promises = _.map(list, function(number) {

            return self.FindUnit(-number).then(function(unit) {

                // Passing by reference on purpose, for dynamic waypoints in the future
                return {
                    id: number,
                    pos: unit.position
                };

            }).fail(function(err) {
                console.error('WorldHandler.BuildWaypointListFromUnitIds', err);
                /** Unit not found **/
            });

        });

        return Q.all(promises).then(function(waypoints) {
            return _.reject(waypoints, function(waypoint) {
                return !waypoint;
            });
        }, function(err) {
                return Q.reject(err);
            });
    }

});

var worldHandler = new WorldHandler();