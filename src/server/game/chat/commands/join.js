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
module.exports = function(items, units, worldHandler, chatHandler) {
    return {
        requiresEditor: false,
        action: function(unit, target, params, errorMessage) {
            var room = params[0],
                success = false;

            // for now hard coded room rules
            if (unit.editor) {
                // editors can join whatever they want
                unit.socket.join(room);
                success = true;
            } else if (room === 'mods' || room === 'editors' || room === 'admins' || room === '__nick__') {
                errorMessage = "Insufficient privledges.";
            } else if (room === 'guests' && !unit.isGuest) {
                errorMessage = "Only for guests!";
            } else if (room.indexOf('zone') >= 0 && (parseInt(room.split('zone')[1], 10) !== unit.zone)) {
                errorMessage = "Cannot join a zone you are not in.";
            } else if (chatHandler.listPlayers('').indexOf(room) >= 0 && unit.name !== room) {
                errorMessage = "Not allowed to join another players private message room.";
            } else {
                unit.socket.join(room);
                success = true;
            }

            // todo: instead provide feedback to return object?
            if(success) {
                chatHandler.announcePersonally(unit, "Joined: " + room, "pink");
            }

            return {
                errorMessage: errorMessage
            };
        }
    };
};