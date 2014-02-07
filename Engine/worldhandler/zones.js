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
   along with Ironbane MMO. If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * @module zones
 **/
var aabb = require('aabb-3d'),
    spatial = require('spatial-events'),
    Q = require('q'),
    Ticker = require('./Engine/worldhandler/ticker.js');

// var util = require('../util');

/**
 * @method listens
 * Test whether or not a SpatialEventEmitter listens
 * for an event at a particular location.
 *
 * @param event {String}
 * @param bbox {AABB}
 * @return {Boolean}
 **/
spatial.prototype.listens = function(event, bbox) {


    //support point emitting
    if('0' in bbox) {
         bbox = aabb(bbox, [0, 0, 0]);
    }

    var treeListens = function(node, event, bbox) {

        var nodeListens = false;
        var childListens = false;

        for(var i = 0; i < node.children.length; ++i) {
            if(bbox.intersects(node.children[i].bbox)) {
                childListens = treeListens(node.children[i], event, bbox);
                break;
            }
        }

        var list = node.listeners[event];

        if(list) {

            for(var i = 0, len = list.length; i < len; ++i) {
                if(list[i].bbox.intersects(bbox)) {
                    nodeListens = true;
                    break;
                }
            }

        }

        return nodeListens || childListens;

    };

    if(this.root) {
       if(treeListens(this.root, event, bbox)) {
            return true;
        }
    }

    if(!this.infinites[event]) {
        return false;
    }

    var list = this.infinites[event].slice();
        for(var i = 0, len = list.length; i < len; ++i) {
            if(list[i].bbox.intersects(bbox)) {
                return true;
            }
        }

    return false;
};


/**
 *
 * @class CellHandler
 *
 * @constructor
 *
 * @param bbox {AABB} - The bounding box, in  world coordinates,
 * for which the cellhandler listens for events within.
 *
 * @param cellCoords {Object} - An object containing numeric
 * properties x and z.
 **/
var CellHandler = function(bbox, zoneId, cellCoords) {

    this.fields = {
        bbox : bbox,
        zoneId : zoneId,
        cellCoords : cellCoords,
        units : []
    };

    /**
     * @method getX
     * @return {Number} - This cell's x value in cell coordinates.
     **/
    function getX() {
       return this.fields.cellCoords.x;
    }

    /**
     * @method getZ
     * @return {Number} - This cell's z value in cell coordinates.
     **/
    function getZ() {
       return this.fields.cellCoords.z;
    }

    /**
     * @method addUnit
     * @param deferred {Object} - A Q deferred object,
     * needing to be resolved or rejected within this method's
     * execution.
     * @param unit {Unit} - The unit to add and be handled.
     * by this cell.
     **/
    function addUnit(deferred, unit) {

       if(!_.contains(this.fields.units, unit)) {
          this.fields.units.push(unit);

          deferred.resolve();

       } else {

           deferred.reject(new Error('CellHandler: Cannot add unit! ' + unit.isPlayer()));

       }

    }

    /**
     * @method removeUnit
     * @param deferred {Object} - A Q deferred object.
     * @param unit {Unit} - The unit to be removed from this cell.
     **/
    function removeUnit(deferred, unit)  {

        this.fields.units = _.without(this.fields.units, unit);

        deferred.resolve();
    }

    /**
     * @method changeActivity
     * Abstracts the code shared by deactivate and activate methods.
     * Sets the property 'active' of all NPCs handled by this cell to
     * either true or false.
     *
     * @param val {Boolean}
     *
     **/
    function changeActivity(val) {

        var isNPC = function(unit) { return !(unit instanceof Player); };

        _.chain(this.fields.units)
            .filter(isNPC)
            .each(function(unit) {
                unit.active = val;
            });

    }

    /**
     * @method deactivate
     *
     * @param deferred {Object} - A Q deferred object.
     *
     **/
    function deactivate(deferred) {

        var hasPlayer = _.some(this.fields.units, function(unit) {
            return unit.isPlayer();
        });

        if(!hasPlayer) {

            console.log('CellHandler.deactivate', this.fields.zoneId, this.fields.cellCoords);

            this.changeActivity(false);
            this.stopTicking();

        }

        deferred.resolve();

    }

    /**
     * @method activate
     *
     * @param deferred {Object} - A Q deferred object.
     **/
    function activate(deferred) {

        this.changeActivity(true);
        this.startTicking();

        deferred.resolve();
    }

    /**
     * @method awake
     * @return {Array} - An array of promises.
     **/
    function awake() {

        return Q.all(_.map(this.fields.units, function(unit) {
            return unit.Awake();
        }));

    }

    /**
     * @method tick
     * @param elapsed {Number}
     * @return {Promise}
     **/
    function tick(elapsed) {

        var players = _.filter(this.fields.units, function(unit) {
            return unit.isPlayer();
        });

        return Q.all(_.map(this.fields.units, function(unit) {

            if(unit.active) {
                unit.Tick(elapsed);
            }

        })).then(function() {

            return Snapshots.broadcast(players);

        }, function(err) {
            return Q.reject(err);
        });

    }

    /**
     * @method startTicking
     **/
    function startTicking() {
        Ticker.add(this);
    }

    /**
     * @method stopTicking
     **/
    function stopTicking() {
        Ticker.remove(this);
    }

    /**
     * @method loadObjects
     * @return {Array} - An array of existing objects in this cell.
     **/
    function loadObjects() {

        var self = this;

        var cellX = this.fields.cellCoords.x,
            cellZ = this.fields.cellCoords.z,
            zoneId = this.fields.zoneId;

        var objects = [];

        // Query the entry
        var path = dataPath + '/' + zoneId + '/' + cellX + '/' + cellZ;

        fsi.mkdirSync(path, 0777, true, function(err) {
            if (err) {
                log('Error:' + err);
            } else {
                log('Directory created');
            }
        });

        try {

            if (fs.existsSync(path + '/objects.json')) {
                // Load static gameobjects
                stats = fs.lstatSync(path + '/objects.json');

                if (stats.isFile()) {

                    objects = JSON.parse(fs.readFileSync(path + '/objects.json', 'utf8'));

                }

            }

        } catch (err) {

            console.error('CellHandler.loadObjects', err);

        }

        return objects;

    }

    /**
     * @method saveObjects
     * @param objects {Array} - Overwrite the objects in this cell.
     **/
    function saveObjects(objects) {

        var cellX = this.fields.cellCoords.x,
            cellZ = this.fields.cellCoords.z,
            zone =  this.fields.zoneId;

        if(chatHandler) {

            chatHandler.announceRoom('editors', 'Saving cell ' + cellX + ', ' + cellZ + ' in zone ' + zone + '...');

        }

        // Query the entry
        var path = dataPath + '/' + zone + '/' + cellX + '/' + cellZ;

        fsi.mkdirSync(path, 0777, true, function(err) {
            if (err) {
                log('Error:' + err);
            } else {
                log('Directory created');
            }
        });

        var str = JSON.stringify(objects, null, 4);
        fs.writeFileSync(path + '/objects.json', str);

        log('CellHandler.saveObjects: wrote ' + path + '/objects.json');

    }

    /**
     * @method edit
     *
     * @param deferred {Object}
     * @param objects {Array}
     * @param changes {Array}
     * @param deletes {Array}
     *
     **/
    function edit(deferred, shouldClear, addObjects, changes, deletes) {

        var objects = [];

        if(!shouldClear) {

            objects = this.loadObjects().concat(addObjects);

            objects = updateMetadata(changes, objects);

            objects = deleteObjects(deletes, objects);

        }

       this.saveObjects(objects);

       deferred.resolve();

       function updateMetadata(changeBuffer, objects) {

           if (_.isArray(changeBuffer)) {
               _.each(changeBuffer, function(changedObject) {

                   var pos = ConvertVector3(changedObject.pos);
                   pos = pos.Round(2);

                   _.each(objects, function(loopObj) {

                       if (pos.x === loopObj.x &&
                           pos.y === loopObj.y &&
                           pos.z === loopObj.z) {

                           if (_.isEmpty(changedObject.metadata)) {
                               delete loopObj.metadata;
                           } else {

                               if (_.isUndefined(loopObj.metadata)) {
                                   loopObj.metadata = {};
                               }

                               _.extend(loopObj.metadata, changedObject.metadata);
                           }
                       }
                   });
               });
           }

           return objects;

       }

       function deleteObjects(deleteBuffer, objects) {

           // Delete the things from the terrain in the deleteBuffer
           if (_.isArray(deleteBuffer)) {

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

    }

    this.getX = getX;
    this.getZ = getZ;
    this.addUnit = addUnit;
    this.removeUnit = removeUnit;
    this.changeActivity = changeActivity;
    this.activate = activate;
    this.deactivate = deactivate;
    this.awake = awake;
    this.tick = tick;
    this.startTicking = startTicking;
    this.stopTicking = stopTicking;
    this.loadObjects = loadObjects;
    this.saveObjects = saveObjects;
    this.edit = edit;

};

/**
 * @class Cells
 *
 * Provides static utility methods for working with cells.
 **/
var Cells = (function() {

    /**
     * @method size
     * @return {Number}
     **/
    function size() {
       return cellSize || 20;
    }

    /**
     * @method toCellCoordinates
     * @param x {Number}
     * @param z {Number}
     * @return {Object} - Containing x and z properties.
     **/
    function toCellCoordinates(x, z)  {
        return WorldToCellCoordinates(x, z, size());

    }

    /**
     * @method toWorldCoordinates
     * @param x {Number}
     * @param z {Number}
     * @return {Object} - Containing x and z properties.
     **/
    function toWorldCoordinates(cellX, cellZ) {
       return CellToWorldCoordinates(cellX, cellZ, size());
    }

    /**
     * @method point
     * @param cellCoords {Object} - Containing x and z properties.
     * @return {AABB} - A point representation of the cell coordinates.
     **/
    function point(cellCoords) {

        var begin = [cellCoords.x, 0, cellCoords.z];
        var dimensions = [0, 0, 0];

        return aabb(begin, dimensions);

    }

    /**
     * @method center
     * @param cellX {Number}
     * @param cellZ {Number}
     * @return {Object} - Containing x and z properties.
     **/
    function center(cellX, cellZ) {
       return (function(xz) {
           return new THREE.Vector3(xz.x, 0, xz.z);
       })(toWorldCoordinates(cellX, cellZ));
    }

    /**
     * @method readInfo
     * @return {Array} - Collection of objects in
     * the form { zoneId : Number, cellCoords : Object }.
     **/
    function readInfo() {

        var cellsLoaded = {};

        var deferred = Q.defer();

        var info = [];

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

                //log("Loaded cell ("+cx+","+cz+") in zone "+zone);
                if (!cellsLoaded[zone]) {
                    cellsLoaded[zone] = 0;
                }

                cellsLoaded[zone]++;

                info.push({
                    zoneId : zone,
                    cellCoords: new THREE.Vector3(cx, 0, cz)
                });
            }

            _.each(cellsLoaded, function(z, v) {
                log("Loaded " + z + " cells in zone " + v);
            });

            deferred.resolve(info);

        });

        return deferred.promise;
    }

    return {
        size: size,
        toCellCoordinates : toCellCoordinates,
        toWorldCoordinates : toWorldCoordinates,
        point : point,
        center  : center,
        readInfo : readInfo
    };

})();

/**
 * @class ZoneHandler
 *
 * @constructor
 * @param id - {Number}
 **/
var ZoneHandler = function(id) {

    this.spatial = new spatial();
    this.spatial.size = 1;

    this.cells = [];
    this.id = id;

    /**
     * @method contains
     *
     * Test whether two cells would overlap,
     * if a cell were created with bbox.
     *
     * @param bbox {AABB}
     *
     * @return {Boolean}
     *
     **/
    function contains(bbox) {

        return _.some(this.cells, function(cell) { // overlaps?

            return !bbox.touches(cell.fields.bbox) &&
                   bbox.intersects(cell.fields.bbox);

        });
    }

    this.contains = contains;

};

/**
 * @class Zones
 * Maintains a hashtable with zone ids as keys,
 * and Zone objects as values (for constant time lookup).
 **/
var Zones = function() {

    this.table = {};

    /**
     * @method getCell
     * @param zoneId {Number}
     * @param cellX {Number}
     * @param cellZ {Number}
     * @return {CellHandler}
     **/
    function getCell(zoneId, cellX, cellZ) {
        return  _.find(this.table[zoneId].cells, function(cell) {
           return (cell.getX() === cellX &&
                   cell.getZ() === cellZ);
        });
    }

    /**
     * @method getUnits
     * @param zoneId {Number}
     * @param cellX {Number}
     * @param cellZ {Number}
     * @return {Array}
     **/
    function getUnits(zoneId, cellX, cellZ) {
        return this.getCell(zoneId, cellX, cellZ).fields.units;
    }

    /**
     * @method emit
     * @param zoneId {Number}
     * @param name {String}
     * @param vec {Vector3}
     * @return {Promise}
     **/
    function emit(zoneId, name, vec) {


        var args = Array.prototype.slice.call(arguments, 3);

        var deferred = Q.defer();

        var point = [vec.x, vec.y, vec.z];

        args = [name, point, deferred].concat(args);


        if(_.isUndefined(zoneId)) {

            deferred.reject(new Error('Zones', 'emit: zoneId is undefined!'));

        } else if (_.isUndefined(this.table[zoneId])) {

            deferred.reject(new Error('Zones', 'emit: ' + zoneId + ' not found!'));

        } else {


            var s = this.table[zoneId].spatial;

            if(s.listens(name, point)) {

               s.emit.apply(s, args);
               deferred.resolve();

            } else {

               deferred.reject(new Error('No listener for ' + name + ', ' + point));

            }

        }

        return deferred.promise;

    }

    /**
     * @method emitNear
     *
     * Try to emit events for neighbouring cells
     * around the cell containing the world coordinates of 'vec'.
     *
     * @param zoneId {Number}
     * @param name {String}
     * @param vec {Vector3}
     * @param radius {Number}
     * @return {Array} - An array of promises for
     * when all emissions complete.
     **/
    function emitNear(zoneId, name, vec, radius) {

        radius = radius || 1;

        var self = this;

        var args = Array.prototype.slice.call(arguments, 4);

        var offsets = _.range(-radius, radius + 1, 1);

        var positions = _.chain(offsets)
            .map(function(x) {
                return _.map(offsets, function(z) {
                    return new THREE.Vector3(x, 0, z);
                });
            })
            .flatten()
            .map(function(v) {
               v.x += vec.x;
               v.z += vec.z;
               return v;
            })
            .value();


        var promises = _.map(positions, function(nearVec) {

           var emitArgs = [zoneId, name, nearVec].concat(args);

           return self.emit.apply(self, emitArgs).fail(function(err) {
               console.error('Zones.emitNear', err);
           });

        });

        return Q.all(promises);

    }

    /**
     * @method selectAll
     * @return {Promise}
     **/
    function selectAll() {

       var deferred = Q.defer();

       deferred.resolve(_.values(this.table));

       return deferred.promise;

    }

    /**
     * @method selectZone
     * @param zoneId {Number}
     * @return {Promise}
     **/
    function selectZone(zoneId) {

        var deferred = Q.defer();

        if (_.isUndefined(zoneId)) {

            deferred.reject(new Error('Zones: Failed to select undefined zone!'));

        } else {

            if(_.isUndefined(this.table[zoneId])) {

                this.table[zoneId] = new ZoneHandler(zoneId);

            }

            deferred.resolve(this.table[zoneId]);

        }

        return deferred.promise;
    }

    /**
     * @method createCell
     * @param zoneId {Number}
     * @param cellCoords {Object} - Containing properties x and z.
     * @return {Promise}
     **/
    function createCell(zoneId, cellCoords) {

        return this.selectZone(zoneId).then(function(zone) {

                var deferred = Q.defer();

                var bbox = Cells.point(cellCoords);

                if(!zone.contains(bbox)) {

                    var cell = new CellHandler(bbox, zoneId, cellCoords);

                    zone.spatial.on('addUnit', bbox, cell.addUnit.bind(cell));
                    zone.spatial.on('removeUnit', bbox, cell.removeUnit.bind(cell));
                    zone.spatial.on('activate', bbox, cell.activate.bind(cell));
                    zone.spatial.on('deactivate', bbox, cell.deactivate.bind(cell));
                    zone.spatial.on('edit', bbox, cell.edit.bind(cell));

                    zone.cells.push(cell);

                    deferred.resolve(cell);

                } else { // Reject promise

                    deferred.reject(new Error('Zones: Cell already exists!'));

                }

                return deferred.promise;

            });

        // Note:
        // No rejection handler passes errors down the method chain.
        // Add fail to the chain after returning to handle error messages.
    }


    this.emit = emit;
    this.emitNear = emitNear;
    this.selectAll = selectAll;
    this.selectZone = selectZone;
    this.createCell = createCell;
    this.getCell = getCell;

};

// module.exports.Cells = Cells;
// module.exports.Zones = Zones;
