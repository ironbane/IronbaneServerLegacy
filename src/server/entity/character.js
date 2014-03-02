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
    getName = require('../../common/namegen'),
    log = require('util').log,
    ItemService = require('../services/item');

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



module.exports = function(db) {
    var Q = require('q'),
        _ = require('underscore');

    var Character = Class.extend({
        init: function(json) {
            this.equipment = "";

            _.extend(this, json || {});
        },
        $addFriend: function(friendId, tags) {
            var deferred = Q.defer();

            var obj = {
                character_id: this.id,
                friend_id: friendId,
                date_added: (new Date()).valueOf() / 1000
            };

            // tags should be an array
            if(tags) {
                obj.tags = JSON.stringify(tags);
            }

            db.query('insert into characters_friends SET ?', obj, function(err, results) {
                if(err) {
                    deferred.reject(err);
                    return;
                }

                // modify the input for the output
                obj.id = results.insertId;

                deferred.resolve(obj);
            });

            return deferred.promise;
        },
        $removeFriend: function(friendId) {
            var deferred = Q.defer();

            db.query('delete from characters_friends where character_id = ? and friend_id = ?', [this.id, friendId], function(err, results) {
                if(err) {
                    deferred.reject(err);
                    return;
                }

                deferred.resolve(results);
            });

            return deferred.promise;
        },
        $getFriends: function() {
            var deferred = Q.defer();

            db.query('select * from characters_friends where character_id = ?', [this.id], function(err, friends) {
                if(err) {
                    deferred.reject(err);
                    return;
                }

                if(friends.length < 1) {
                    deferred.resolve([]);
                    return; // no friends!
                }

                // add more columns? for characters prolly can send almost everything? location, clothes (render pic), etc.
                db.query("select id, name from ib_characters WHERE id IN (" + _.pluck(friends, 'friend_id').join(',') + ")", function(err, results) {
                    if(err) {
                        deferred.reject(err);
                        return;
                    }

                    _.each(results, function(friend) {
                        var f = _.findWhere(friends, {friend_id: friend.id});
                        if(f) {
                            f.name = friend.name;
                        }
                    });

                    deferred.resolve(friends);
                });
            });

            return deferred.promise;
        }
    });

    function checkBadName(name) {
        var deferred = Q.defer();
        var ironbot = require(APP_ROOT_PATH + '/src/server/game/ironbot/ironbot');
        var validator = require('validator');
        if(ironbot.detectBadwords(name)) {
            deferred.reject('Choose a better name.');
	} else {
        if(validator.isAlpha(name)){
            deferred.resolve();
        }
        else{
            deferred.reject('Only alphabetical characters are allowed');
        }
        }
        return deferred.promise;
    }

    function checkDuplicateName(name) {
        var deferred = Q.defer();

        db.query('select count(*) as count from ib_characters where LOWER(name)=?', [name.toLowerCase()], function(err, result) {
            if(err) {
                log('create char error checking for duplicate name: ' + err);
            }

            if(result[0].count === 0) {
                deferred.resolve();
            } else {
                deferred.reject('a character with that name already exists');
            }
        });

        return deferred.promise;
    }

    function checkValidName(name) {
        var deferred = Q.defer();

        // min length
        if(name.length < 2) {
            deferred.reject('minimum 2 char length');
            return deferred.promise;
        }

        if(name.length > 12) {
            deferred.reject('max 12 char length');
            return deferred.promise;
        }

        // note doesn't allow international, do we want to globalize someday?
        var alphaNum = /^([a-zA-Z0-9_-]+)$/;
        if(alphaNum.test(name) === false) {
            deferred.reject('Use alphanumeric characters, - and _ in names only');
            return deferred.promise;
        }

        deferred.resolve('valid name');

        return deferred.promise;
    }

    Character.prototype.$create = function() {
        var self = this,
            deferred = Q.defer(),
            createObj = {
                name: self.name,
                user: self.user || 0, // all characters must have a user, reject based on this instead?
                creationtime: Math.round(new Date().getTime() / 1000),
                skin: self.skin,
                eyes: self.eyes,
                hair: self.hair,
                lastplayed: Math.round(new Date().getTime() / 1000)
            };

        // validation (todo: skin, hair, eyes, max characters)
        Q.all([checkValidName(createObj.name), checkDuplicateName(createObj.name), checkBadName(createObj.name)])
            .then(function() {
                // all validations passed
                db.query('insert into ib_characters set ?', createObj, function(err, result) {
                     if(err) {
                        deferred.reject(err);
                        return;
                    }

                    // result will contain id
                    self.id = result.insertId;
                    deferred.resolve(self);
                });
            }, function(err) {
                console.log('create character validation failed! ', err, createObj);
                deferred.reject('Character name error: ' + err);
            });

        return deferred.promise;
    };

    Character.prototype.$delete = function() {
        var self = this,
            deferred = Q.defer();

        // todo: make more asyncy
        db.query('delete from ib_characters where id=?', [self.id], function(err, result) {
            if(err) {
                deferred.reject('error deleting character: ' + err);
                return;
            }

            ItemService.deleteAllByOwner(self.id).then(function() {
                deferred.resolve('success');
            });
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

            var outChar = new Character(results[0]);
            // get equipment, for char select
            db.query('select template from ib_items where owner=? and equipped=1', [outChar.id], function(err, results) {
                if(err) {
                    log('error getting equipment for character: ' + outChar.id);
                }

                // for the UI it's a comma delim string currently
                if(_.isArray(results)) {
                    outChar.equipment = _.pluck(results, 'template').join(',');
                }

                // either way we need to return the character, failed equipment might not be fatal
                deferred.resolve(outChar);
            });
        });

        return deferred.promise;
    };

    Character.getAllForUser = function(userId) {
        var deferred = Q.defer();

        // todo: move this to item or characters service/entity??
        var getEquipmentCB = function(character) {
            return function() {
                var eqDeferred = Q.defer();

                db.query('select template from ib_items where owner=? and equipped=1', [character.id], function(err, results) {
                    if(err) {
                        log('error getting equipment for character: ' + character.id + ' >> ' + err);
                    }

                    // for the UI it's a comma delim string currently
                    if(_.isArray(results)) {
                        character.equipment = _.pluck(results, 'template').join(',');
                    }

                    // either way we need to return the character, failed equipment might not be fatal
                    eqDeferred.resolve(character);
                });

                return eqDeferred.promise;
            };
        };

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
            var equipped = [];
            results.forEach(function(result, i) {
                results[i] = new Character(result);
                equipped.push(getEquipmentCB(results[i])());
            });

            // only when all characters have finished loading equipment are we done
            Q.all(equipped).then(function() {
                deferred.resolve(results);
            }, function(err) {
                deferred.reject('all rejection!');
            });
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
        if(_.random(1, 100) > 50) {
            // boy
            character.skin = _.random(skinIdMaleStart, skinIdMaleEnd);
            character.eyes = _.random(eyesIdMaleStart, eyesIdMaleEnd);
            character.hair = _.random(hairIdMaleStart, hairIdMaleEnd);
        } else {
            // girl
            character.skin = _.random(skinIdFemaleStart, skinIdFemaleEnd);
            character.eyes = _.random(eyesIdFemaleStart, eyesIdFemaleEnd);
            character.hair = _.random(hairIdFemaleStart, hairIdFemaleEnd);
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
