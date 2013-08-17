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
var Class = require('../../common/class');

module.exports = function(db) {
    var Q = require('q'),
        _ = require('underscore');

    var ItemTemplate = Class.extend({
        init: function(json) {
            _.extend(this, json || {});

            // convert baseValue to camelcase from DB
            this.baseValue = this.basevalue;
        }
    });

    ItemTemplate.getAll = function() {
        var deferred = Q.defer();

        db.query('select * from ib_item_templates', [], function(err, results) {
            if (err) {
                deferred.reject('error loading item template data' + err);
                return;
            }

            _.each(results, function(row, i) {
                results[i] = new ItemTemplate(row);
            });
            deferred.resolve(results);
        });

        return deferred.promise;
    };

    return ItemTemplate;
};