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
// items - item templates (from datahandler)
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
                success = false,
                errorMessage = '';

            // for now hard coded room rules
            if (chatHandler.listRoomsPlayer(unit).indexOf(room) < 0) {
                errorMessage = "You are not in a room called: " + room;
            } else if (unit.editor) {
                // editors can leave whatever they want (that they are in)
                unit.socket.leave(room);
                success = true;
            } else if (room === unit.name) {
                errorMessage = "Can't leave your PM room.";
            } else if (room === 'guests' && unit.isGuest) {
                errorMessage = "You are a guest, can't leave the guests room.";
            } else if (room === 'zone_' + unit.zone) {
                errorMessage = "Can't leave the zone you are in.";
            } else {
                unit.socket.leave(room);
                success = true;
            }

            // todo: instead provide feedback to return object?
            if(success) {
                chatHandler.announcePersonally(unit, "Left: " + room, "pink");
                deferred.resolve();
            } else {
                deferred.reject(errorMessage);
            }

            return Q();
        }
    };
};
