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

    /**
     * @ngdoc service
     * @name entity.Friend
     * @description service for interacting with user friends db table
    */
    var Friend = Class.extend({
        init: function(json) {
            _.extend(this, json || {});
        }
    });

    Friend.get = function(friendId) {
        var deferred = Q.defer();

        db.query('select * from users_friends where id=?', [friendId], function(err, results) {
            if(err) {
                deferred.reject(err);
                return;
            }

            if(results.length === 0) {
                deferred.reject('Friend record not found.');
                return;
            }

            deferred.resolve(new Friend(results[0]));
        });

        return deferred.promise;
    };

    Friend.getForUser = function(userId) {

    };

    // add a friend record, tags is an optional string array
    Friend.add = function(userId, friendId, tags) {
        var deferred = Q.defer();

        var obj = {
            user_id: userId,
            friend_id: friendId,
            date_added: (new Date()).valueOf() / 1000
        };

        // tags should be an array
        if(tags) {
            obj.tags = JSON.stringify(tags);
        }

        db.query('insert into users_friends SET ?', obj, function(err, results) {
            if(err) {
                deferred.reject(err);
                return;
            }

            var record = new Friend(obj);
            record.id = results.insertId;

            deferred.resolve(record);
        });

        return deferred.promise;
    };

    return Friend;
};