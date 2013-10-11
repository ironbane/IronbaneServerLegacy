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
    var _ = require('underscore');

    return {
        requiresEditor: true,
        action: function(unit, target, params, errorMessage) {
            // So, which item?
            var template = -1;

            // Try to convert to integer, if we passed an ID
            var testConvert = parseInt(params[0], 10);
            if (_.isNumber(testConvert) && !_.isNaN(testConvert)) {
                template = items[testConvert];
            } else {
                template = _.where(items, {
                    name: params[0]
                })[0];
            }

            if (template) {
                if (!unit.GiveItem(template)) {
                    errorMessage = 'You have no free space!';
                }
            } else {
                errorMessage = "Item not found!";
            }

            return {
                errorMessage: errorMessage
            };
        }
    };

};
