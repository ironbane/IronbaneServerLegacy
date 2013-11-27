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
    var _ = require('underscore');

    return {
        requiresEditor: false,
        action: function(unit, target, params) {
            var Q = require('q'),
                deferred = Q.defer(),
                errorMessage = '';

            if(!_.isString(params[0])) {
                deferred.reject('join target required.');
                return deferred.promise;
            }

            var room = params[0].toLowerCase(),
                success = false,
                rooms = chatHandler.listRooms(),
                exists = _.find(rooms, function(r) {
                    return r.toLowerCase() === room;
                });

            //console.log('joining room: ', exists);

            // for now hard coded room rules
            if (unit.editor || !exists) { // TODO: swear filter on room names?
                console.log('editor or non exists room', exists);
                // editors can join whatever they want or if the room doesn't already exist
                unit.socket.join(exists || room);
                success = true;
            } else if (room === 'mods' || room === 'editors' || room === 'admins' || room === '__nick__') {
                errorMessage = "Insufficient privledges.";
            } else if (room === 'guests' && !unit.isGuest) {
                errorMessage = "Only for guests!";
            } else if (room.indexOf('zone') >= 0 && (parseInt(room.split('zone')[1], 10) !== unit.zone)) {
                errorMessage = "Cannot join a zone you are not in.";
            } else if (chatHandler.listPlayers().indexOf(exists) >= 0 && unit.name !== exists) {
                errorMessage = "Not allowed to join another players private message room.";
            } else {
                console.log('existing room join: ', room, exists);
                unit.socket.join(exists);
                success = true;
            }

            // todo: instead provide feedback to return object?
            if(success) {
                chatHandler.announcePersonally(unit, "Joined: " + room, "pink");
                deferred.resolve();
            } else {
                deferred.reject(errorMessage);
            }

            return deferred.promise;
        }
    };
};