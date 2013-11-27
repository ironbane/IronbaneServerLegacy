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
        requiresEditor: true,
        action: function(unit, target, params) {
            var Q = require('q'),
                message = '/announce "message" (announce)<br>/warn player (warn)<br>/seriouswarn player (seriouswarn)<br>/kick player "reason" (kick from server)<br>/ban player hours "reason" (ban from server)<br>/unstuck player (unstuck, like /stuck)<br>/whois player (get player info)';

            chatHandler.announcePersonally(unit, message, "yellow");

            return Q();
        }
    };
};
