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

    var UnitTemplate = Class.extend({
        init: function(json) {
            _.extend(this, json || {});
        }
    });

    var getById = function(templateId) {
        var deferred = Q.defer();

        // get all! todo: support where clause?
        db.query('select * from ib_unit_templates where id=?', [templateId], function(err, results) {
            if(err) {
                deferred.reject(err);
                return;
            }

            if(results.length === 0) {
                deferred.reject({code: 404, msg: 'no template found with id ' + templateId});
                return;
            }

            deferred.resolve(new UnitTemplate(results[0]));
        });

        return deferred.promise;
    };

    var getAll = function(query) {
        var deferred = Q.defer();

        // get all! todo: support where clause?
        db.query('select ' + (query.$fields ? query.$fields.join(',') : '*') + ' from ib_unit_templates', function(err, results) {
            if(err) {
                deferred.reject(err);
                return;
            }

            _.each(results, function(data, i) {
                results[i] = new UnitTemplate(data);
            });
            deferred.resolve(results);
        });

        return deferred.promise;
    };

    UnitTemplate.get = function(query) {
        if(_.isString(query)) {
            // assume id
            return getById(query);
        } else {
            return getAll(query);
        }
    };

    return UnitTemplate;
};