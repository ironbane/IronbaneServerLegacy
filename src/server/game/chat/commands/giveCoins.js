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
    var _ = require('underscore'),
        Q = require('q'),
        ItemTemplateSvc = require('../../../services/itemTemplate');

    return {
        requiresEditor: true,
        action: function(unit, target, params) {
            var amount = parseInt(params[0], 10),
                deferred = Q.defer();

            ItemTemplateSvc.getAllByType('cash').then(function(templates) {
                var moneybag = _.sample(templates);
                if (moneybag) {
                    if (!unit.GiveItem(moneybag, {
                        value: amount
                    })) {
                        deferred.reject('You have no free space!');
                    } else {
                        deferred.resolve();
                    }
                } else {
                    deferred.reject('no cash items found!');
                }
            });

            return deferred.promise;
        }
    };

};