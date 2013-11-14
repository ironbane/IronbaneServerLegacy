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
var Class = require('../../common/class'),
    Q = require('q'),
    db = require('../db');

var UnitService = Class.extend({
    getById: function(unitId) {
        var deferred = Q.defer();

        db.query('select * from ib_units where id=?', [unitId], function(err, results) {
            if(err) {
                // db error via log only?
                return deferred.reject({code: 500, message: JSON.stringify(err)});
            }

            if(results.length === 0) {
                return deferred.reject({code: 404, message: 'unit id: ' + unitId + ' not found!'});
            }

            //todo: coerce into obj?
            var unit = results[0];
            deferred.resolve(unit);
        });

        return deferred.promise;
    }
});

// service singleton
var instance = new UnitService();

module.exports = instance;