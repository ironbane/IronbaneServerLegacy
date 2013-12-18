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
  * @module snapshots
 **/

var Q = require('q'),
    async = require('async'),
    _ = require('underscore');

/**
  * @class Snapshots
**/ 

var Snapshots = (function() { 

    function send(cached, unit) { 


        _.chain(unit.otherUnits)
           .filter(function(ud) {
               return ud.id !== unit.id;
           })
           .filter(function(ud) {
               return (ud.template.type && 
                       ud.template.type !== UnitTypeEnum.MOVINGOBSTACLE &&
                       ud.template.type !== UnitTypeEnum.ToggleableObstacle) ||
                   _.isUndefined(ud.template);
           })
           .map(function(ud) {
             
               if (!(ud instanceof Player) && (ud instanceof Fighter)) {

                    // Quickly make a rotation number for NPC's (since they only use heading vector while the client uses degrees)
                    ud.rotation.y = Math.atan2(ud.heading.z, ud.heading.x);

                    if (ud.rotation.y < 0) {
                       ud.rotation.y += (Math.PI * 2);
                    }

                    ud.rotation.y = (Math.PI * 2) - ud.rotation.y;

                }

               return ud;

           })
           .map(cached)
           .tap(function(snapshot) { 

             if (snapshot.length > 0) {

                unit.socket.emit('snapshot', snapshot);

             }

           });

    };

    function toPacket(ud) { 

       var id = ud.id;
       var packet = {}; 
   
       var pos = ud.position.Round(2);

       packet.id = id;
       
       packet.p = pos;

       if (ud.standingOnUnitId) {
          packet.u = ud.standingOnUnitId;
          packet.p = ud.localPosition.Round(2);
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

       
       return packet;

   };

   function hash(ud) { 
      return ud.id;
   };

   function cache() {
      return _.memoize(toPacket, hash);
   };

   function broadcast(players) {

      var deferred = Q.defer();

      var cached = cache();
      var sender = send.bind(this, cached);

      var iterator = function(unit, callback) { 
          sender(unit);
          callback(null);
      };

      async.each(players, iterator, deferred.resolve.bind(deferred));

      return deferred.promise;
   };

   return {
      send : send,
      hash : hash,
      toPacket : toPacket,
      cache : cache,
      broadcast : broadcast
   };

})();

//module.exports = Snapshots;
