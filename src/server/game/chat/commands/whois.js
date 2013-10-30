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
		requiresEditor: true,
		action: function(unit, target, params, errorMessage) {
			var name = params[0],
			db = require("../../../db");

			if(!name) {
				return {
					errorMessage: "Enter a character name!!"
				};
			}

			db.query("SET @charName = ?",name, function(err, result) {
				if (err) {
					console.log('SQL error during whois: ' + JSON.stringify(err));
					return;
				}
			});

			db.query("SELECT @userID := ib_characters.`user` FROM ib_characters WHERE ib_characters.`name` = @charName", function(err, result) {
				if (err) {
					console.log('SQL error during whois: ' + JSON.stringify(err));
					return;
				}
			});
			db.query("SELECT @characters := GROUP_CONCAT(ib_characters.`name`) FROM ib_characters WHERE ib_characters.`user` = @userID", function(err, result) {
				if (err) {
					console.log('SQL error during whois: ' + JSON.stringify(err));
					return;
				}
			});
			db.query("SELECT @userName := bcs_users.`name` AS `username`, NULL FROM bcs_users WHERE bcs_users.`id` = @userID", function(err, result) {
				if (err) {
					console.log('SQL error during whois: ' + JSON.stringify(err));
					return;
				}
			});
			db.query("SELECT @userID as `id`, @userName as `name`, @characters as `characters`", name, function(err, result) {
				if (err) {
					console.log('SQL error during whois: ' + JSON.stringify(err));
					return;
				}

				if(result.length < 1) {
					errorMessage = "Player not found";
					chatHandler.announcePersonally(unit, errorMessage, "yellow");
				} else {
					if(result[0].id == 0) {
						errorMessage = "Player not found";
						chatHandler.announcePersonally(unit, errorMessage, "yellow");
					} else {
						var message = "id: " + result[0].id + "<br>" + "forumname: " + result[0].name + "<br>" + "characters: " + result[0].characters;
						chatHandler.announcePersonally(unit, message, "yellow");
					}
				}
			});
			db.query("SET @charName = '', @userID = '', @characters = '', @userName = ''", function(err, result) {
				if (err) {
					console.log('SQL error during whois: ' + JSON.stringify(err));
					return;
				}
			});

			return {
				errorMessage: errorMessage
			};
		}
	}
}
