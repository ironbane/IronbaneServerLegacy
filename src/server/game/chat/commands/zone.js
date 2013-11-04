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
		var name = params[0],
			db = require("../../../db"),
	                player = worldHandler.FindPlayerByName(name);

            if (player) {
		db.query("SELECT `name` FROM `ib_zones` WHERE `id` = ?;", player.zone, function(err, result) {
			if (err) {
				console.log('SQL error during whois: ' + JSON.stringify(err));
				deferred.reject('SQL error');					}

			if(result.length < 1) {
				errorMessage = "Player not found";
				chatHandler.announcePersonally(unit, errorMessage, "yellow");
			} else {
				if(result[0].name === null) {
					errorMessage = "Player not found";
					chatHandler.announcePersonally(unit, errorMessage, "yellow");
				} else {
					var message = player.name + " is now in " + result[0].name;
					chatHandler.announcePersonally(unit, message, "yellow");
				}
			}
		});
		console.log(player.zone);
            }

            return {
                errorMessage: errorMessage
            };
        }
    };
};
