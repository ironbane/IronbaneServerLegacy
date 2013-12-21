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

/** 
 * @module zones 
 **/
var aabb = require('aabb-3d'),
    spatial = require('spatial-events'),
    q = require('q');


var CellHandler = function(bbox) {
             
   this.fields = {
       bbox : bbox,
       units : [],
       objects : []
   }; 

   function loadCell() { }
   function loadUnits() { }
   function addUnit() { }
   function removeUnit()  { }

   this.loadCell = loadCell;
   this.loadUnits = loadUnits;
   this.addUnit = addUnit;
   this.removeUnit = removeUnit;

};


var Cells = (function() {

  function nearest(cellCoords) {

     // cellSize from common/constants.js 
     var args = [cellCoords.x, cellCoords.z, cellSize]; 
     var xz = CellToWorldCoordinates.apply(null, args); // from Shared/Util.js
     var begin = [xz.x, 0, xz.z];
     var end = begin.map(function(i) { return i + cellSize; });

     return aabb(begin, end); 

  } 
  
  return { 
     nearest : nearest 
  }; 
 
})();

/** 
 * @class Zone
 **/
var Zone = function(id) {

   this.spatial = new spatial();
   this.bboxes = []; 
   this.id = id; 

   function contains(bbox) {
      return !_.every(this.bboxes, function(bboxCompare) { 
         return bboxCompare.contains(bbox);
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

   function emit(zoneId, name, vec, args) { 
      
      var point = [vec.x, vec.y, vec.z];

      if(_.isUndefined(zoneId)) {

          console.error('Zones', 'emit: zoneId is undefined!');

      } else if (_.isUndefined(this.table[zoneId])) {

          console.error('Zones', 'emit: ' + zoneId + ' not found!');

      } else {

          var spatial = this.table[zoneId].spatial;
          
          spatial.emit(name, point, args);

      }
   
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

           //if(!zone.contains(bbox)) { 

              var cell = new CellHandler(bbox); 
               
              zone.spatial.on('loadCell', bbox, cell.loadCell.bind(cell)); 
              zone.spatial.on('loadUnits', bbox, cell.loadUnits.bind(cell));
              zone.spatial.on('addUnit', bbox, cell.addUnit.bind(cell));
              zone.spatial.on('removeUnit', bbox, cell.removeUnit.bind(cell));

              zone.bboxes.push(bbox);

              deferred.resolve(bbox);

          //} else { // Reject promise
              
            // throw new Error('Zones: Cell already exists!');

          //}

           return deferred.promise; 

         }); 

         // Note:
         // No rejection handler passes errors down the method chain.
         // Add fail to the chain after returning to handle error messages.
   }

   this.emit = emit;
   this.selectZone = selectZone;
   this.createCell = createCell;

};



// module.exports.Zones = Zones;
