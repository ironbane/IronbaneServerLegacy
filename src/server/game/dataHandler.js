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

var _ = require('underscore');

module.exports = function(db) {
    var future = {
        items: {},
        units: {}
    };

    db.query('SELECT * FROM ib_item_templates',
        function(err, results, fields) {
            if (err) {
                throw err;
            }

            _.each(results, function(item) {
                future.items[item.id] = item;
            });
        });

    db.query('SELECT * FROM ib_unit_templates',
        function(err, results, fields) {
            if (err) {
                throw err;
            }

            _.each(results, function(unit) {
                future.units[unit.id] = unit;
            });
        });

    return future;
};