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
        _ = require('underscore'),
        log = require('util').log;

    var Message = Class.extend({
        init: function(json) {
            _.extend(this, json || {});
        }
    });

    Message.delete = function(messageIds){
        var deferred = Q.defer();
        log(messageIds);
        db.query("SELECT * from bcs_messages where id in ?" , messageIds, function(results){
            log(JSON.stringify(results));
            return deferred.resolve();
        });
        return deferred.promise;
    };

    Message.create = function(message){
        var deferred = Q.defer();
        var toUserQ = "(SELECT id as to_user from bcs_users where name = '" + message.to_user + "' ) ";
        db.query(toUserQ, function(err, results){
            if(err) {
                log("error in getting user id");
                deferred.reject(err);
                return;
            }
            message.to_user = results[0].to_user;
            db.query("INSERT INTO bcs_messages SET ?", message, function(err, results){
                if(err) {
                    deferred.reject(err);
                    return;
                }
                deferred.resolve();

            });
        });
        return deferred.promise;

    };

    Message.getAll = function(userId){
    	var deferred = Q.defer();
        db.query("Select * from bcs_messages where to_user = ?", userId, function(err, results){
            if (err) {
                deferred.reject('error loading messaging data' + err);
                return;
            }

            _.each(results, function(data, i) {
                results[i] = new Message(data);
            });

            deferred.resolve(results);
        });

        return deferred.promise;
    };

    return Message;
};