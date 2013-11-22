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

var dataPath = assetDir + 'data';

var pathFinder = require(APP_ROOT_PATH + '/src/server/game/pathFinder.js');
pathFinder.setPath(dataPath);

var WorldHandler = Class.extend({
    Init: function() {
        // World structure
        // [zone][cx][cz]
        this.world = {};

        this.switches = {};
        this.awake = false;
        this.hasLoadedWorld = false;



    },
    Awake: function() {

        this.LoadNavigationNodes();

        var self = this;

        // All units ready! Awaken!
        self.LoopUnits(function(u) {
            u.Awake();
        });

        log("World has awaken!");
        self.awake = true;

    },
    Tick: function(dTime) {

        if (!this.hasLoadedWorld) {
            return;
        }

        if (!this.awake) {
            var hasLoadedUnits = true;

            this.LoopCells(function(cell) {
                if (!cell.hasLoadedUnits) {
                    hasLoadedUnits = false;
                }
            });

            if (hasLoadedUnits) {
                this.Awake();
            }
            return;
        }

        this.updateUnits(dTime);
        this.sendoutSnapshots();

    },
    updateUnits: function(dTime) {
        var unitCount = 0;
        var players = 0;
        this.LoopUnits(function(unit) {
            if (unit.active) {
                unitCount++;
                unit.Tick(dTime);
            }
            if (unit instanceof Player) {
                players++;
            }
        });

        // console.log(unitCount + " active units, " + players + " logged in players");

    },
    sendoutSnapshots: function() {
        var snapshotCache = {};
        var cacheCount = 0;
        var calculatedCount = 0;
        this.LoopUnits(function(unit) {
            if (unit instanceof Player) {
                var snapshot = [];
                var otherUnits = unit.otherUnits;
                _.each(otherUnits, function(ud) {
                    if (ud.id !== unit.id) {
                        if ((ud.template &&
                            ud.template.type !== UnitTypeEnum.MOVINGOBSTACLE &&
                            ud.template.type !== UnitTypeEnum.TOGGLEABLEOBSTACLE) || _.isUndefined(ud.template)) {
                            var id = ud.id;
                            var packet = {};
                            if (_.isUndefined(snapshotCache.id)) {
                                calculatedCount++;
                                var pos = ud.position;
                                packet.id = id;
                                packet.p = pos.Round(2);

                                if (ud.standingOnUnitId) {
                                    packet.u = ud.standingOnUnitId;
                                    packet.p = ud.localPosition.Round(2);
                                }

                                if (!(ud instanceof Player) && (ud instanceof Fighter)) {
                                    // Quickly make a rotation number for NPC's (since they only use heading vector while the client uses degrees)
                                    ud.rotation.y = Math.atan2(ud.heading.z, ud.heading.x);

                                    if (ud.rotation.y < 0) {ud.rotation.y += (Math.PI * 2);}
                                    ud.rotation.y = (Math.PI * 2) - ud.rotation.y;

                                }

                                if (ud.sendRotationPacketX) {
                                    packet.rx = ud.rotation.x.Round(2);
                                }
                                if (ud.sendRotationPacketY) {
                                    packet.ry = ud.rotation.y.Round(2);
                                }
                                if (ud.sendRotationPacketZ) {
                                    packet.rz = ud.rotation.z.Round(2);
                                }
                                snapshotCache.id = packet;
                            } else {
                                cacheCount++;
                                packet = snapshotCache.id;
                            }

                            snapshot.push(packet);
                        }
                    }
                });
                if (snapshot.length > 0) {
                    //console.log(cacheCount + " from cache, " + calculatedCount + " calculated");
                    unit.socket.emit("snapshot", snapshot);
                }
            }
        });
    },
    addUnitToCell: function(unit, newCellX, newCellZ) {

        var x = newCellX;
        var z = newCellZ;

        if (worldHandler.CheckWorldStructure(unit.zone, x, z)) {
            worldHandler.world[unit.zone][x][z].units.push(unit);
        } else {
            // We are in a bad cell??? Find a place to spawn! Or DC
            log("Bad cell found for " + unit.id);

            if (unit.id > 0 && unit.editor) {
                log("...but I'm generating one because he's an editor.");
                worldHandler.GenerateCell(unit.zone, x, z);
                worldHandler.world[unit.zone][x][z].units.push(unit);
            }
        }

        if (unit.id > 0) {
            // Active all NPC's that are nearby
            this.LoopUnitsNear(unit.zone, newCellX, newCellZ, function(unit) {
                if (unit.id < 0) {
                    unit.active = true;
                }
            });
        }


    },
    removeUnitFromCell: function(unit, oldCellX, oldCellZ) {

        var x = oldCellX;
        var z = oldCellZ;

        worldHandler.world[unit.zone][x][z].units = _.without(worldHandler.world[unit.zone][x][z].units, unit);

        var me = this;

        if (unit.id > 0) {
            // Active all NPC's that are nearby
            var allCells = [];
            var activeCells = [];
            this.LoopCells(function(cell) {
                allCells.push(cell);
                if (cell.units) {
                    var foundUnit = _.find(cell.units, function(unit) {
                        return unit.id > 0;
                    });
                    if (foundUnit !== undefined) {
                        // Add all nearby cells
                        me.LoopCellsNear(foundUnit.zone, foundUnit.cellX, foundUnit.cellZ, function(cell) {
                            activeCells.push(cell);
                        });
                    }
                }
            });

            var cellsToBeDisabled = _.difference(allCells, activeCells);

            _.each(cellsToBeDisabled, function(cell) {
                if (cell.units) {
                    _.each(cell.units, function(unit) {
                        if (unit.id < 0) {
                            unit.active = false;
                        }
                    });
                }
            });
        }


    },
    buildCellsArray: function() {
        // TODO actually use these for ticking
        var me = this;
        me.allCells = [];
        this.LoopCells(function(cell) {
            me.allCells.push(cell);
        });
    },
    LoadNavigationNodes: function() {

        console.log("Loading navigation nodes...");

        _.each(this.world, function(z, i) {
            pathFinder.loadZone(i);
        });


        pathFinder.test();

    },
    SaveWorld: function() {
        this.LoopCellsWithIndex(function(z, cx, cz) {
            this.SaveCell(z, cx, cz);
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
    CheckWorldStructure: function(zone, cx, cz) {
        if (!_.isUndefined(zone) && _.isUndefined(this.world[zone])) {
            return false;
        }
        if (!_.isUndefined(cx) && _.isUndefined(this.world[zone][cx])) {
            return false;
        }
        if (!_.isUndefined(cz) && _.isUndefined(this.world[zone][cx][cz])) {
            return false;
        }
        return true;
    },
    BuildWorldStructure: function(zone, cx, cz) {
        if (!_.isUndefined(zone) && _.isUndefined(this.world[zone])) {
            this.world[zone] = {};
        }
        if (!_.isUndefined(cx) && _.isUndefined(this.world[zone][cx])) {
            this.world[zone][cx] = {};
        }
        if (!_.isUndefined(cz) && _.isUndefined(this.world[zone][cx][cz])) {
            this.world[zone][cx][cz] = {};
        }
    },
    LoadWorldLight: function() {
        var self = this,
            cellsLoaded = {};

        self.world = {};

        util.walk(dataPath, function(err, results) {
            if (err) {
                throw err;
            }
            var rl = results.length;
            for (var r = 0; r < rl; r++) {
                results[r] = results[r].replace(dataPath + "/", "");

                var data = results[r].split("/");

                //log(data);

                var zone = parseInt(data[0], 10);
                var cx = parseInt(data[1], 10);
                var cz = parseInt(data[2], 10);

                var file = data[3];
                if (!_.isNumber(zone)) {
                    continue;
                }
                if (!_.isNumber(cx)) {
                    continue;
                }
                if (!_.isNumber(cz)) {
                    continue;
                }

                if (file !== "objects.json") {
                    continue;
                }

                self.BuildWorldStructure(zone, cx, cz);

                self.world[zone][cx][cz].objects = [];
                self.world[zone][cx][cz].units = [];
                self.world[zone][cx][cz].hasLoadedUnits = false;

                //log("Loaded cell ("+cx+","+cz+") in zone "+zone);
                if (!cellsLoaded[zone]) {
                    cellsLoaded[zone] = 0;
                }
                cellsLoaded[zone]++;

                self.LoadUnits(zone, cx, cz);
            }

            _.each(cellsLoaded, function(z, v) {
                log("Loaded " + z + " cells in zone " + v);
            });


            // For more performant ticking
            self.buildCellsArray();

            self.hasLoadedWorld = true;

        });
    },
    // all of these loop methods are like forEach
    LoopUnits: function(fn) {
        this.LoopCells(function(cell) {
            if (!_.isUndefined(cell.units)) {
                _.each(cell.units, function(unit) {
                    fn(unit);
                });
            }
        });
    },
    LoopUnitsNear: function(zone, cellX, cellZ, fn, offset) {
        this.LoopCellsNear(zone, cellX, cellZ, function(cell) {
            if (!_.isUndefined(cell.units)) {
                _.each(cell.units, function(unit) {
                    fn(unit);
                });
            }
        }, offset);
    },
    LoopCells: function(fn) {
        _.each(this.world, function(zone) {
            _.each(zone, function(cellX) {
                _.each(cellX, function(cellZ) {
                    fn(cellZ);
                });
            });
        });
    },
    LoopCellsNear: function(zone, cellX, cellZ, fn, offset) {

        offset = offset || 1;

        var self = this;

        for (var x = cellX - offset; x <= cellX + offset; x++) {
            for (var z = cellZ - offset; z <= cellZ + offset; z++) {
                if (self.CheckWorldStructure(zone, x, z)) {
                    fn(self.world[zone][x][z]);
                }
            }
        }
    },
    LoopCellsWithIndex: function(fn) {
        for (var zone in this.world) {
            if (!this.world.hasOwnProperty(zone)) {
                continue;
            }
            for (var cellX in this.world[zone]) {
                if (!this.world[zone].hasOwnProperty(cellX)) {
                    continue;
                }
                for (var cellZ in this.world[zone][cellX]) {
                    if (!this.world[zone][cellX].hasOwnProperty(cellZ)) {
                        continue;
                    }
                    fn(zone, cellX, cellZ);
                }
            }
        }
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
    LoadUnits: function(zone, cellX, cellZ) {
        var worldPos = CellToWorldCoordinates(cellX, cellZ, cellSize),
            self = this;


        mysql.query('SELECT * FROM ib_units WHERE zone = ? AND x > ? AND z > ? AND x < ? AND z < ?', [zone, (worldPos.x - cellSizeHalf), (worldPos.z - cellSizeHalf), (worldPos.x + cellSizeHalf), (worldPos.z + cellSizeHalf)],
            function(err, results) {
                if (err) {
                    console.log('DB error loading units!', err);
                    throw err;
                }

                _.each(results, function(unitData) {
                    self.MakeUnitFromData(unitData);
                });
                self.world[zone][cellX][cellZ].hasLoadedUnits = true;
            });
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
    LoadCell: function(zone, cellX, cellZ) {
        // Query the entry
        var path = dataPath + "/" + zone + "/" + cellX + "/" + cellZ;

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
                    this.world[zone][cellX][cellZ].objects = JSON.parse(fs.readFileSync(path + "/objects.json", 'utf8'));
                }
            } catch (e) {
                throw e;
            }
        }

        this.world[zone][cellX][cellZ].units = [];
    },
    GenerateCell: function(zone, cellX, cellZ) {
        this.BuildWorldStructure(zone, cellX, cellZ);


        this.world[zone][cellX][cellZ].units = [];
        this.world[zone][cellX][cellZ].objects = [];

        log("Generated cell (" + cellX + "," + cellZ + ")");

        this.SaveCell(zone, cellX, cellZ, true);
    },
    SaveCell: function(zone, cellX, cellZ, clearObjects) {
        var self = this,
            doClearObjects = clearObjects || false;

        chatHandler.announceRoom('editors', "Saving cell " + cellX + ", " + cellZ + " in zone " + zone + "...");

        // Instead of saving instantly, we load the cell, overwrite it with the terrain we have, and save it! And empty terrain!
        var buffer_objects = JSON.parse(JSON.stringify(this.world[zone][cellX][cellZ].objects));
        var buffer_units = this.world[zone][cellX][cellZ].units;

        this.LoadCell(zone, cellX, cellZ);

        if (doClearObjects) {
            this.world[zone][cellX][cellZ].objects = [];
            buffer_objects = [];
        }

        this.world[zone][cellX][cellZ].units = buffer_units;

        for (var o = 0; o < buffer_objects.length; o++) {
            this.world[zone][cellX][cellZ].objects.push(buffer_objects[o]);
        }

        if (!_.isUndefined(self.world[zone][cellX][cellZ].changeBuffer)) {
            _.each(self.world[zone][cellX][cellZ].changeBuffer, function(obj) {
                var pos = ConvertVector3(obj.pos);
                pos = pos.Round(2);

                _.each(self.world[zone][cellX][cellZ].objects, function(loopObj) {
                    if (pos.x === loopObj.x && pos.y === loopObj.y && pos.z === loopObj.z) {
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

        // Delete the things from the terrain in the deleteBuffer
        if (!_.isUndefined(self.world[zone][cellX][cellZ].deleteBuffer)) {
            _.each(self.world[zone][cellX][cellZ].deleteBuffer, function(deleteObj) {
                var deleteObjPos = ConvertVector3(deleteObj).Round(2);
                _.each(self.world[zone][cellX][cellZ].objects, function(loopObj) {
                    var loopObjPos = ConvertVector3(loopObj).Round(2);
                    if (deleteObjPos.x === loopObjPos.x && deleteObjPos.y === loopObjPos.y && deleteObjPos.z === loopObjPos.z) {
                        self.world[zone][cellX][cellZ].objects = _.without(self.world[zone][cellX][cellZ].objects, loopObj);
                        self.world[zone][cellX][cellZ].deleteBuffer = _.without(self.world[zone][cellX][cellZ].deleteBuffer, deleteObj);
                    }
                });
            });
        }

        // Query the entry
        var path = dataPath + "/" + zone + "/" + cellX + "/" + cellZ;

        fsi.mkdirSync(path, 0777, true, function(err) {
            if (err) {
                log("Error:" + err);
            } else {
                log('Directory created');
            }
        });

        var str = JSON.stringify(this.world[zone][cellX][cellZ].objects, null, 4);
        fs.writeFileSync(path + "/objects.json", str);

        log("Saved cell (" + cellX + "," + cellZ + ") in zone " + zone + "");

        // Clean up
        this.world[zone][cellX][cellZ].objects = [];
    },
    UpdateNearbyUnitsOtherUnitsLists: function(zone, cellX, cellZ) {
        for (var x = cellX - 1; x <= cellX + 1; x++) {
            for (var z = cellZ - 1; z <= cellZ + 1; z++) {
                if (this.CheckWorldStructure(zone, x, z)) {
                    for (var u = 0; u < this.world[zone][x][z].units.length; u++) {
                        this.world[zone][x][z].units[u].UpdateOtherUnitsList();
                    }
                }
            }
        }
    },
    FindUnit: function(id) {
        var foundUnit = null;

        this.LoopUnits(function(unit) {
            if (foundUnit) {
                return;
            }

            if (unit.id === id) {
                foundUnit = unit;
            }
        });

        return foundUnit;
    },
    // locate a unit (non-player) by data.name, optional zone (will return first or null)
    findUnitByName: function(name, zoneId) {
        var self = this,
            z, cx, cz, u, units;

        if (_.isNumber(zoneId)) {
            for (cx in self.world[zoneId]) {
                for (cz in self.world[zoneId][cx]) {
                    if (!_.isUndefined(self.world[zoneId][cx][cz].units)) {
                        units = self.world[zoneId][cx][cz].units;
                        for (u = 0; u < units.length; u++) {
                            if (units[u].isPlayer()) {
                                continue;
                            }

                            if (!units[u].data || (units[u].data && !units[u].data.hasOwnProperty('name'))) {
                                continue;
                            }

                            if (units[u].data.name === name) {
                                return units[u];
                            }
                        }
                    }
                }
            }
        } else {
            for (z in self.world) {
                for (cx in self.world[z]) {
                    for (cz in self.world[z][cx]) {
                        if (!_.isUndefined(self.world[z][cx][cz].units)) {
                            units = self.world[z][cx][cz].units;
                            for (u = 0; u < units.length; u++) {
                                if (units[u].isPlayer()) {
                                    continue;
                                }

                                if (!units[u].data || (units[u].data && !units[u].data.hasOwnProperty('name'))) {
                                    continue;
                                }

                                if (units[u].data.name === name) {
                                    return units[u];
                                }
                            }
                        }
                    }
                }
            }
        }

        return null;
    },
    // get ALL units matching name and in optional zone
    findUnitsByName: function(name, zoneId) {
        var self = this,
            z, cx, cz, u, units,
            results = [];

        if (_.isNumber(zoneId)) {
            for (cx in self.world[zoneId]) {
                for (cz in self.world[zoneId][cx]) {
                    if (!_.isUndefined(self.world[zoneId][cx][cz].units)) {
                        units = self.world[zoneId][cx][cz].units;
                        for (u = 0; u < units.length; u++) {
                            if (units[u].isPlayer()) {
                                continue;
                            }

                            if (!units[u].data || (units[u].data && !units[u].data.hasOwnProperty('name'))) {
                                continue;
                            }

                            if (units[u].data.name === name) {
                                results.push(units[u]);
                            }
                        }
                    }
                }
            }
        } else {
            for (z in self.world) {
                for (cx in self.world[z]) {
                    for (cz in self.world[z][cx]) {
                        if (!_.isUndefined(self.world[z][cx][cz].units)) {
                            units = self.world[z][cx][cz].units;
                            for (u = 0; u < units.length; u++) {
                                if (units[u].isPlayer()) {
                                    continue;
                                }

                                if (!units[u].data || (units[u].data && !units[u].data.hasOwnProperty('name'))) {
                                    continue;
                                }

                                if (units[u].data.name === name) {
                                    results.push(units[u]);
                                }
                            }
                        }
                    }
                }
            }
        }

        return results;
    },
    BuildWaypointListFromUnitIds: function(list) {
        var self = this,
            newList = [];
        _.each(list, function(number) {
            var unit = self.FindUnit(-number);
            if (unit) {
                // Passing by reference on purpose, for dynamic waypoints in the future
                newList.push({
                    id: number,
                    pos: unit.position
                });
            }
        });
        return newList;
    },
    // Only for players!!!!
    FindPlayerByName: function(name) {



        for (var z in worldHandler.world) {
            for (var cx in worldHandler.world[z]) {
                for (var cz in worldHandler.world[z][cx]) {

                    if (!_.isUndefined(worldHandler.world[z][cx][cz].units)) {

                        var units = worldHandler.world[z][cx][cz].units;

                        for (var u in units) {

                            if (units[u].isPlayer()) {

                                if (units[u].name === name) return units[u];
                            }
                        }
                    }
                }
            }
        }
        return null;
    },
    FindUnitNear: function(id, nearUnit) {
        var zone = nearUnit.zone;
        var cx = nearUnit.cellX;
        var cz = nearUnit.cellZ;

        for (var x = cx - 1; x <= cx + 1; x++) {
            for (var z = cz - 1; z <= cz + 1; z++) {
                if (!this.CheckWorldStructure(zone, x, z)) {
                    continue;
                }

                if (!_.isUndefined(this.world[zone][x][z].units)) {
                    var units = this.world[zone][x][z].units;
                    for (var u = 0; u < units.length; u++) {
                        if (units[u].id === id) {
                            return units[u];
                        }
                    }
                }
            }
        }

        return null;
    },
    DeleteUnit: function(id) {
        for (var z in this.world) {
            for (var cx in this.world[z]) {
                for (var cz in this.world[z][cx]) {
                    if (!_.isUndefined(this.world[z][cx][cz].units)) {
                        var units = this.world[z][cx][cz].units;

                        for (var u = 0; u < units.length; u++) {
                            if (units[u].id === id) {
                                this.world[z][cx][cz].units.splice(u, 1);
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }
});

var worldHandler = new WorldHandler();