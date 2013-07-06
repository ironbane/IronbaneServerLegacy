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
    getName = require('../../common/namegen');

// for now just sticking this here, todo: get from config or something
var skinIdMaleStart = 1000;
var skinIdMaleEnd = 1004;

var skinIdFemaleStart = 1010;
var skinIdFemaleEnd = 1014;

var hairIdMaleStart = 1000;
var hairIdMaleEnd = 1009;

var hairIdFemaleStart = 1010;
var hairIdFemaleEnd = 1019;

var eyesIdMaleStart = 1000;
var eyesIdMaleEnd = 1009;

var eyesIdFemaleStart = 1010;
var eyesIdFemaleEnd = 1019;

function rnd(minv, maxv) {
    if (maxv < minv) {
        return 0;
    }
    return Math.floor(Math.random() * (maxv - minv + 1)) + minv;
}

module.exports = function(db) {
    var Q = require('q'),
        _ = require('underscore');

    var Character = Class.extend({
        init: function(json) {
            this.equipment = "";

            _.extend(this, json || {});
        }
    });

    Character.prototype.$create = function() {
        var self = this,
            deferred = Q.defer(),
            createObj = {
                name: self.name,
                user: self.user || 0, // all characters must have a user, reject based on this instead?
                creationtime: (new Date()).valueOf() / 1000,
                skin: self.skin,
                eyes: self.eyes,
                hair: self.hair
            };

        db.query('insert into ib_characters set ?', createObj, function(err, result) {
             if(err) {
                deferred.reject(err);
                return;
            }

            // result will contain id
            self.id = result.insertId;
            deferred.resolve(self);
        });

        return deferred.promise;
    };

    // get single by id
    Character.get = function(charId) {
        var deferred = Q.defer();

        db.query('select * from ib_characters where id=?', [charId], function(err, results) {
            if(err) {
                deferred.reject(err);
                return;
            }

            if(results.length === 0) {
                deferred.reject('not found');
                return;
            }

            deferred.resolve(new Character(results[0]));
        });

        return deferred.promise;
    };

    Character.getAllForUser = function(userId) {
        var deferred = Q.defer();

        db.query('select * from ib_characters where user=?', [userId], function(err, results) {
            if(err) {
                deferred.reject(err);
                return;
            }

            if(results.length === 0) {
                deferred.resolve([]);
                return;
            }

            // convert results into objects
            results.forEach(function(result, i) {
                results[i] = new Character(result);
            });
            deferred.resolve(results);
        });

        return deferred.promise;
    };

    Character.getRandom = function(userId) {
        var deferred = Q.defer(),
            character = new Character({
                user: userId || 0, // all characters must be tied to a user
                name: getName(4, 8, '', '')
            });

        // boy or girl
        if(rnd(1, 100) > 50) {
            // boy
            character.skin = rnd(skinIdMaleStart, skinIdMaleEnd);
            character.eyes = rnd(eyesIdMaleStart, eyesIdMaleEnd);
            character.hair = rnd(hairIdMaleStart, hairIdMaleEnd);
        } else {
            // girl
            character.skin = rnd(skinIdFemaleStart, skinIdFemaleEnd);
            character.eyes = rnd(eyesIdFemaleStart, eyesIdFemaleEnd);
            character.hair = rnd(hairIdFemaleStart, hairIdFemaleEnd);
        }

        // save to db to get ID
        character.$create().then(function() {
            deferred.resolve(character);
        }, function(err) {
            deferred.reject('error saving new random character!' + err);
        });

        return deferred.promise;
    };

    return Character;
};