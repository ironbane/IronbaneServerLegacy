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
    getByName: function(templateName) {
        var deferred = Q.defer();

        var cached = _.findWhere(cache, {name: templateName});
        if (cached) {
            deferred.resolve(cached);
        } else {
            db.query('select * from ib_item_templates where name=?', [templateName], function(err, results) {
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
    },
    getAllByType: function(type) {
        return this.getAll().then(function(templates) {
            return _.filter(templates, function(template) {
                return template.type === type;
            });
        }, function(err) {
            return Q.reject(err);
        });
    },
    getItemsUsingTemplate: function(templateId) {
        var deferred = Q.defer();

        db.query('SELECT count(*) FROM ib_items where template=?', [templateId], function(err, result) {
            if(err) {
                return deferred.reject('db error', err);
            }

            deferred.resolve(result[0]['count(*)']);
        });

        return deferred.promise;
    },
    getUnitsUsingTemplateAsLoot: function(templateId) {
        var deferred = Q.defer();

        db.query('SELECT count(*) FROM ib_unit_templates where loot like "' + templateId + ';%" OR loot like "%;' + templateId + ';%"', [], function(err, result) {
            if(err) {
                return deferred.reject('db error', err);
            }

            deferred.resolve(result[0]['count(*)']);
        });

        return deferred.promise;
    },
    getUsageAnalysis: function(templateId) {
        return Q.all([this.getItemsUsingTemplate(templateId), this.getUnitsUsingTemplateAsLoot(templateId)])
            .then(function(results) {
                return {
                    items: results[0],
                    loots: results[1]
                };
            }, function(err) {
                return Q.reject(err);
            });
    },
    create: function(config) {
        // name, image, type, subtype, attr1, delay, particle, basevalue
        var deferred = Q.defer();

        db.query('INSERT INTO ib_item_templates SET ?', config, function(err, result) {
            if(err) {
                return deferred.reject('db error: ' + JSON.stringify(err));
            }

            config.id = result.insertId;
            cache[config.id] = new ItemTemplate(config);
            deferred.resolve(cache[config.id]);
        });

        return deferred.promise;
    },
    remove: function(templateId) {
        var deferred = Q.defer();

        db.query('DELETE FROM ib_item_templates WHERE id = ?', [templateId], function(err, result) {
            if(err) {
                return deferred.reject('db error', err);
            }

            // remove from cache
            if(cache[templateId]) {
                delete cache[templateId];
            }
            deferred.resolve('removed!');
        });

        return deferred.promise;
    },
    update: function(template) {
        var deferred = Q.defer(),
            templateId = parseInt(template.id, 10),
            // create new update obj to not pollute it with possible other in memory items
            data = {
                name: template.name,
                image: template.image,
                type: template.type,
                subtype: template.subtype,
                attr1: template.attr1,
                delay: template.delay,
                particle: template.particle,
                basevalue: template.basevalue || template.baseValue || 0
            };

        db.query('UPDATE ib_item_templates SET ? WHERE id = ?', [data, templateId], function(err, results) {
            if(err) {
                return deferred.reject('db error: ' + JSON.stringify(err));
            }

            // should just keep the reference instead??
            cache[templateId] = new ItemTemplate(data);
            deferred.resolve(cache[templateId]);
        });

        return deferred.promise;
    }
});

var service = new Service();

// singleton
module.exports = service;