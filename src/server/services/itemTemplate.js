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
    _ = require('underscore'),
    db = require('../db'),
    ItemTemplate = require('../entity/itemTemplate');

var cache = {};

var Service = Class.extend({
    init: function() {
        // get all from db and cache it
        this.getAll(true);
    },
    getById: function(templateId) {
        var deferred = Q.defer();

        if (cache[templateId]) {
            deferred.resolve(cache[templateId]);
        } else {
            db.query('select * from ib_item_templates where id=?', [templateId], function(err, results) {
                if (err) {
                    return deferred.reject('template not found ' + JSON.stringify(err));
                }

                if (results.length === 0) {
                    return deferred.reject('template not found');
                }

                cache[results[0].id] = new ItemTemplate(results[0]);
                deferred.resolve(cache[results[0].id]);
            });
        }

        return deferred.promise;
    },
    getAll: function(refresh) {
        var deferred = Q.defer();

        if(!refresh && _.keys(cache).length > 0) {
            deferred.resolve(_.map(cache, function(value) { return value; }));
        } else {
            db.query('SELECT * FROM ib_item_templates', function(err, results) {
                if (err) {
                    return deferred.reject('db error', err);
                }

                var templates = [];

                _.each(results, function(data) {
                    cache[data.id] = new ItemTemplate(data);
                    templates.push(cache[data.id]);
                });

                deferred.resolve(templates);
            });
        }

        return deferred.promise;
    }
});

var service = new Service();

// singleton
module.exports = service;