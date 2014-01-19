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
  * Hosts a collection of static methods,
  * faciliating the broadcasting of snapshots once per
  * server tick.
**/
var Snapshots = (function() {

    /**
     * @method send
     * Builds and sends a snapshot to one player.
     * @param {Function} cached - The memoized, toPacket function, for snapshot caching.
     * @param {Player} player - The player to send the snapshot to.
     **/
    function send(cached, unit) {

        if(!unit.readyToReceiveUnits) { return; }

        _.chain(unit.otherUnits)
           .filter(function(ud) {
               return ud.id !== unit.id;
           })
           .filter(function(ud) {
               return _.isUndefined(ud.template) ||
                      (ud.template.type &&
                       ud.template.type !== UnitTypeEnum.MOVINGOBSTACLE &&
                       ud.template.type !== UnitTypeEnum.ToggleableObstacle);
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

    /**
     * @method toPacket
     * Transform a unit into an element
     * for a collection of packets, a snapshot,
     * to be sent to a player.
     * @param {Unit} ud - The unit to transform.
     * @return {Object} - The packet.
     **/
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

   /**
    * @method hash
    * The hash function to lookup an
    * already computed result for one of
    * a snapshot's packets.
    * @param {Unit} - A unit to create a bucket for.
    * @return {Number} - The unit's unique id.
    **/
   function hash(ud) {
      return ud.id;
   };

   /**
    * @method cache
    * Makes a new cache function, to be used once per tick
    * when snapshots are broadcasted to player.
    * Use the cache function as toPacket normally would
    * be used. Increases the performance of computing
    * snapshot packets.
    * @return {Function}
    **/
   function cache() {
      return _.memoize(toPacket, hash);
   };

   /**
    * @method broadcast
    * @param {Array} players - All players to broadcast
    * snapshots to once per tick.
    * @param {Object} - A promise.
    **/
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
