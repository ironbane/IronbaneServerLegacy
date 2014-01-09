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
                name = params[0],
                db = require("../../../db");
            
            worldHandler.FindPlayerByName(name)
                .then(function(player) { 

                    if (player) {
                        db.query("SELECT `name` FROM `ib_zones` WHERE `id` = ?;", player.zone, function(err, result) {
                            if (err) {
                                deferred.reject('SQL error: ' + JSON.stringify(err))
                            } else {
                                if (result.length < 1 || result[0].name === null) {
                                    deferred.reject('player not found.');
                                } else {
                                    var message = player.name + " is now in " + result[0].name;
                                    chatHandler.announcePersonally(unit, message, "yellow");
                                    deferred.resolve();
                                }
                            }
                        });
                    } else {
                        deferred.reject('player not found.');
                    }

                });

            return deferred.promise;
        }
    };
};
