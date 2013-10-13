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
var Class = require('resig-class');
module.exports = function(db) {
    var Q = require('q'),
        _ = require('underscore'),
        log = require('util').log;

    var ItemTemplate = Class.extend({
        init: function(json) {
            _.extend(this, json || {});

            // convert baseValue to camelcase from DB
            this.baseValue = this.basevalue;
        }
    });

    ItemTemplate.getAll = function() {
        var deferred = Q.defer();
        log("getting templates");
        db.query('select * from ib_item_templates', [], function(err, results) {
            if (err) {
                deferred.reject('error loading item template data' + err);
                return;
            }
            var templates = [];
            _.each(results, function(row) {
                templates.push(new ItemTemplate(row));
            });

            deferred.resolve(templates);
        });

        return deferred.promise;
    };


    ItemTemplate.get = function(templateId) {
        var deferred = Q.defer();
        log("getting template " + templateId);
        db.query('select * from ib_item_templates where id = ?', [templateId], function(err, results) {
            if (err) {
                deferred.reject('error loading item template data' + err);
                return;
            }

            log(JSON.stringify(results));

            deferred.resolve(new ItemTemplate(results[0]));
        });

        return deferred.promise;
    };


    return ItemTemplate;
};