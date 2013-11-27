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

// chat command API
// units - unit templates (from datahandler)
// worldHandler - worldHandler reference
// chatHandler - reference to general chat utils
module.exports = function(units, worldHandler, chatHandler) {
    return {
        requiresEditor: false,
        action: function(unit, target, params) {
            var Q = require('q'),
                deferred = Q.defer(),
                room = params[0],
                players = chatHandler.listPlayers(room);

            if(players.length === 0) {
                // if no one is in the room, it doesn't really exist
                deferred.reject('No one is in this room.');
            } else {
                // enhance?: get list of units instead, color names based on rank; display count; display room or "global";
                chatHandler.announcePersonally(unit, players.join(', '), "#97FFFF");
                deferred.resolve();
            }

            return deferred.promise;
        }
    };
};
