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
    db = require('../db'),
    Item = require('../entity/item'),
    ItemTemplateService = require('./itemTemplate');

var buildItemFromData = function(itemData) {
    var deferred = Q.defer();
    console.log("building data for " + JSON.stringify(itemData));

    // move db id to separate property, db id doesn't really matter for anything other than db indexing
    itemData._persistID = itemData.id;

    // if there is custom instance JSON data use it
    if (itemData.data) {
        try {
            itemData.data = JSON.parse(itemData.data);
        } catch (e) {
            // invalid json? prolly safe to ignore...
            console.log('warning: invalid JSON data for itemData ', itemdata.id);
            itemData.data = {};
        }
    }

    ItemTemplateService.getById(itemData.template).then(function(template) {
        var item = new Item(template, itemData);

        deferred.resolve(item);
    }, function(err) {
        deferred.reject('error getting template: ' + err);
    });

    return deferred.promise;
};

var ItemService = Class.extend({
    getAllByOwner: function(ownerId) {
        var deferred = Q.defer();

        db.query('SELECT * FROM ib_items WHERE owner = ?', [ownerId], function(err, results) {
            if (err) {
                return deferred.reject('error getting items for owner ' + ownerId + ': ' + JSON.stringify(err));
            }

            var items = [],
                promises = [];

            // still need to resolve the promise
            if(results.length === 0) {
                return deferred.resolve(items);
            }

            results.forEach(function(result) {
                promises.push(buildItemFromData(result).then(function(item) {
                    items.push(item);
                }));
            });

            Q.all(promises).then(function() {
                console.log("all items retrieved");
                deferred.resolve(items);
            }, function(error){
                console.log("all: an error occurred: " + error);
                console.log("items length: " + items.length);
                deferred.resolve(items);
            });
        });

        return deferred.promise;
    },
    deleteAllByOwner: function(ownerId) {
        var deferred = Q.defer();

        db.query('DELETE FROM ib_items WHERE owner = ?', [ownerId], function(err, result) {
            if (err) {
                return deferred.reject('error deleting items for owner ' + ownerId + ': ' + JSON.stringify(err));
            }

            deferred.resolve('success');
        });

        return deferred.promise;
    },
    // save object to db, upsert
    persist: function(item) {
        var deferred = Q.defer();

        // there might be other memory properties on an object,
        // build one we need for the database
        var upData = {
            template: item.template,
            attr1: item.attr1,
            owner: item.owner,
            equipped: item.equipped,
            slot: item.slot,
            value: item.value || 0,
            data: JSON.stringify(item.data)
        };

        if(item._persistID) {
            // update
            db.query('update ib_items set ? where id=?', [upData, item._persistID], function(err, results) {
                if(err) {
                    return deferred.reject('db error during item update: ', err);
                }

                deferred.resolve(item);
            });
        } else {
            // insert
            db.query('insert into ib_items set ?', upData, function(err, results) {
                if(err) {
                    return deferred.reject('db error during item insert: ', err);
                }

                item._persistID = results.insertId;
                deferred.resolve(item);
            });
        }

        return deferred.promise;
    }
});

var service = new ItemService();

// singleton
module.exports = service;