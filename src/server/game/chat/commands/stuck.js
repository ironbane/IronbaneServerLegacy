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
// Hell == zone 41

module.exports = function(units, worldHandler, chatHandler) {
    var constants = require('../../../../common/constants');

    return {
        requiresEditor: false,
        action: function(unit, target, params) {
            return  worldHandler.FindPlayerByName(unit.name)
               .then(function(player) {

                   if (player) {
                       if (player.zone === 41) {
                           chatHandler.announcePersonally(unit, "Hell no!! You can't stuck away from Hell.<br>What did you expect? Muhahahaha", "red");
                       } else {
                           unit.Teleport(constants.normalSpawnZone, constants.normalSpawnPosition);
                           chatHandler.announcePersonally(unit, "You were teleported back to town.", "lightgreen");
                       }
                   }

               });
        }
    };
};
