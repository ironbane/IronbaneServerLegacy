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
    Q = require('q');

// var util = require('./util');

spatial.prototype.listens = function(name, bbox) {

    //support point emitting
    if('0' in bbox) {
         bbox = aabb(bbox, [0, 0, 0]) 
    }

    var treeListens = function(node, event, bbox) { 
       
        var nodeListens,
            childListens = false;

        for(var i = 0; i < node.children.length; ++i) {
            if(bbox.intersects(node.children[i].bbox)) {
                childListens = nodeListens(node.children[i], event, bbox);
                break;
            }
        }  

        var list = this.listeners[event];

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
        if(treeListens(root, event, bbox)) {
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

var CellHandler = function(bbox, cellCoords) {

    this.fields = {
        bbox : bbox,
        cellCoords : cellCoords,
        units : [],
        objects : [],
        changeBuffer : [],
        deleteBuffer : []
    }; 

    function getX() { 
       return cellCoords.x;
    }

    function getZ() {
       return cellCoords.z;
    }

    function loadCell() { }
    function loadUnits() { }

    function addUnit(deferred, unit) {

       if(!_.isUndefined(unit) &&
          !_.isUndefined(unit.id) &&
          !_.some(this.fields.units, function(u) { 
             return u.id === unit.id; })) {

          this.fields.units[unit.id] = unit; 

       } else { 
          
           console.error('CellHandler: Cannot add unit!');

       }

       deferred.resolve();
    }

    function removeUnit(deferred, unit)  {

       if(!_.isUndefined(unit) &&
          !_.isUndefined(unit.id)) { 
      
           delete this.fields.units[unit.id]; 
       }

       deferred.resolve();
    }

    function changeActivity(val) { 

        var isNPC = function(unit) { return !(unit.id > 0); };

        if(_.every(this.fields.units, isNPC)) { 

           _.each(this.fields.units, function(unit) { 
               unit.active = val;
           }); 

        }

    }

    function deactivate(deferred) {

        changeActivity(false);

        deferred.resolve();
    }

    function activate(deferred) {

        changeActivity(true);

        deferred.resolve();
    }

    this.getX = getX;
    this.getZ = getZ;
    this.loadCell = loadCell;
    this.loadUnits = loadUnits;
    this.addUnit = addUnit;
    this.removeUnit = removeUnit;
    this.activate = activate;
    this.deactivate = deactivate;

};

var Cells = (function() {

    function size() {
       return cellSize || 20;
    }

    function toCellCoordinates(x, z)  {
        return WorldToCellCoordinates(x, z, size());
    }

    function toWorldCoordinates(cellX, cellZ) {
       return CellToWorldCoordinates(cellX, cellZ, size()); 
    }

    function nearest(cellCoords) {

        var xz = toWorldCoordinates(cellCoords.x, cellCoords.z); // from Shared/Util.js

        var begin = [xz.x, 0, xz.z];
        var dimensions = [size(), size(), size()];

        return aabb(begin, dimensions); 

    }

    function center(cellX, cellZ) {
       return (function(xz) { 
           return new THREE.Vector3(xz.x, 0, xz.z);
       })(toWorldCoordinates(cellX, cellZ));
    }

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
        nearest : nearest,
        center  : center,
        readInfo : readInfo
    }; 

})();

/** 
 * @class Zone
 **/
var Zone = function(id) {

    this.spatial = new spatial();
    this.spatial.size = Cells.size();

    this.cells = []; 
    this.id = id; 

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

    function getCell(zoneId, cellX, cellZ) {
        return  _.find(this.table[zoneId].cells, function(cell) {
           return (cell.getX() === cellX &&
                   cell.getZ() === cellZ);
        });
    }

    function getUnits(zoneId, cellX, cellZ) { 
        return this.getCell(zoneId, cellX, cellZ).fields.units;
    }

    function clearObjects(zoneId, cellX, cellZ) {

        var deferred = Q.defer();

        this.getCell(zoneId, cellX, cellZ).fields.objects = [];

        deferred.resolve();

        return deferred.promise;
    }

    function getObjects(zoneId, cellX, cellZ) {

        var deferred = Q.defer();

        deferred.resolve(this.getCell(zoneId, cellX, cellZ).fields.objects);

        return deferred.promise;

    }

    function getChangeBuffer(zoneId, cellX, cellZ) {

        var deferred = Q.defer(); 

        deferred.resolve(this.getCell(zoneId, cellX, cellZ).fields.changeBuffer);

        return deferred.promise;
    }


    function getDeleteBuffer(zoneId, cellX, cellZ) {

        var deferred = Q.defer();

        deferred.resolve(this.getCell(zoneId, cellX, cellZ).fields.deleteBuffer);

        return deferred.promise;
    }

    function emit(zoneId, name, vec) {

        var args = Array.prototype.slice.call(arguments, 3);

        var deferred = Q.defer(); 

        var point = [vec.x, vec.y, vec.z];

        args = [name, point, deferred].concat(args);

        if(_.isUndefined(zoneId)) {

            console.error('Zones', 'emit: zoneId is undefined!');

        } else if (_.isUndefined(this.table[zoneId])) {

            console.error('Zones', 'emit: ' + zoneId + ' not found!');

        } else {

            var spatial = this.table[zoneId].spatial;

            if(spatial.listens(name, point)) {

               console.log('spatial listens'); 

               spatial.emit.apply(spatial, args);

            } else {

               deferred.reject(new Error(''));

            }

        }

        return deferred.promise;

    }

    function emitNear(zoneId, name, vec, radius) {

        radius = radius || 1;

        var self = this;

        var args = Array.prototype.slice.call(arguments, 4);

        var offsets = _.range(-radius, radius + 1, -1);

        var positions = _.chain(offsets)
            .map(function(x) { 
                return _.map(offsets, function(z) {
                    return new THREE.Vector3(x, 0, z);
                });
            })
            .flatten()
            .map(function(v) { 
                return v.addScalar(Cells.size());
            })
            .map(function(v) { 
               return v.addSelf(vec);
            })
            .value();


        var promises = _.map(positions, function(nearVec) { 

           var emitArgs = [zoneId, name, nearVec].concat(args);

           return self.emit.apply(self, emitArgs);

        });

        return Q.all(promises);

    }

    function selectAll() { 

       var deferred = Q.defer();

       deferred.resolve(_.values(this.table));

       return deferred.promise;

    }

    function selectZone(zoneId) { 

        var deferred = Q.defer();

        if (_.isUndefined(zoneId)) {

            deferred.reject(new Error('Zones: Failed to select undefined zone!'));

        } else {

            if(_.isUndefined(this.table[zoneId])) { 

                this.table[zoneId] = new Zone(zoneId);

            }

            deferred.resolve(this.table[zoneId]);

        }

        return deferred.promise;
    }

    function createCell(zoneId, cellCoords) {

        return this.selectZone(zoneId)
            .then(function(zone) {

                var deferred = Q.defer();

                var bbox = Cells.nearest(cellCoords);

                if(!zone.contains(bbox)) { 

                    var cell = new CellHandler(bbox, cellCoords);

                    zone.spatial.on('loadCell', bbox, cell.loadCell.bind(cell)); 
                    zone.spatial.on('loadUnits', bbox, cell.loadUnits.bind(cell));
                    zone.spatial.on('addUnit', bbox, cell.addUnit.bind(cell));
                    zone.spatial.on('removeUnit', bbox, cell.removeUnit.bind(cell));
                    zone.spatial.on('activate', bbox, cell.activate.bind(cell));
                    zone.spatial.on('deactivate', bbox, cell.deactivate.bind(cell));

                    zone.cells.push(cell);

                    deferred.resolve(cell);

                } else { // Reject promise

                    throw new Error('Zones: Cell already exists!');

                }

                return deferred.promise; 

            }); 

        // Note:
        // No rejection handler passes errors down the method chain.
        // Add fail to the chain after returning to handle error messages.
    }

    this.emit = emit;
    this.selectAll = selectAll;
    this.selectZone = selectZone;
    this.createCell = createCell;
    this.getCell = getCell;
    this.clearObjects = clearObjects;
    this.getObjects = getObjects;
    this.getChangeBuffer = getChangeBuffer;
    this.getDeleteBuffer = getDeleteBuffer;

};

// module.exports.Cells = Cells;
// module.exports.Zones = Zones;
