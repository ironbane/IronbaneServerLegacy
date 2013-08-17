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

    var Mesh = Class.extend({
        init: function(json) {
            _.extend(this, json || {});
        }
    });

    var getAll = function(query) {
        var deferred = Q.defer();

        // TODO: remove hard coded ordering in favor of query.$orderBy structure?, add query.$fields support

        db.query('SELECT * FROM ib_meshes ORDER BY category, name', [], function(err, results) {
            if (err) {
                deferred.reject('error loading mesh data' + err);
                return;
            }

            _.each(results, function(data, i) {
                results[i] = new Mesh(data);
            });

            deferred.resolve(results);
        });

        return deferred.promise;
    };

    Mesh.get = function(query) {
        if(_.isString(query)) {
            // get single ID
            return getById(query);
        } else {
            return getAll(query);
        }
    };

    return Mesh;
};