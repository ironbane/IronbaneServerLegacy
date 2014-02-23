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
var logger = require('../logging/winston');

module.exports = function(db) {
    var Q = require('q'),
        _ = require('underscore'),
        log = require('util').log,
        Topic = require('./topic');

    var Board = Class.extend({
        init: function(json) {
            _.extend(this, json || {});
        }
    });

    Board.getView = function(boardId, mintime){
        log('getting topics for ' +boardId);

        var minimumtime = parseInt(mintime,10) || 0;
        var deferred = Q.defer();
        var recentUserQuery = "(SELECT bcs_users.name FROM bcs_users INNER JOIN forum_posts ON forum_posts.user = bcs_users.id WHERE forum_posts.topic_id = forum_topics.id ORDER BY forum_posts.time DESC LIMIT 1) as lastuser, "
        db.query('SELECT ' + recentUserQuery + ' forum_topics.sticky, forum_topics.locked, forum_topics.id, forum_topics.views as viewcount, MIN(forum_posts.time) AS firstposttime, MAX(forum_posts.time) as lastposttime, (COUNT(forum_posts.id) - 1 ) as postcount, bcs_users.name AS username, forum_topics.title FROM forum_topics INNER JOIN forum_posts ON forum_topics.id = forum_posts.topic_id INNER JOIN bcs_users ON forum_posts.user = bcs_users.id WHERE forum_topics.private = 0 and board_id = ? and forum_topics.time >= ? GROUP BY forum_topics.id', [boardId, minimumtime], function(err, results) {
            if (err) {
                logger.error('error in Board.getView ' + err);
                deferred.reject(err);
                return;
            }
            if(results.length === 0) {
                return deferred.resolve([]);
            }
            deferred.resolve(results);
        });
        return deferred.promise;
    };

    Board.getRecent = function() {
        var minimumtime = Math.round((new Date()).getTime() / 1000) - 86400 * 7;
        var deferred = Q.defer();
        var recentUserQuery = "(SELECT bcs_users.name FROM bcs_users INNER JOIN forum_posts ON forum_posts.user = bcs_users.id WHERE forum_posts.topic_id = forum_topics.id ORDER BY forum_posts.time DESC LIMIT 1) as lastuser, "
        db.query('SELECT ' + recentUserQuery + ' forum_topics.sticky, forum_topics.locked, forum_topics.id, forum_topics.board_id, forum_topics.views as viewcount, MIN(forum_posts.time) AS firstposttime, MAX(forum_posts.time) as lastposttime, (COUNT(forum_posts.id) - 1 ) as postcount, bcs_users.name AS username, forum_topics.title FROM forum_topics INNER JOIN forum_posts ON forum_topics.id = forum_posts.topic_id INNER JOIN bcs_users ON forum_posts.user = bcs_users.id WHERE forum_topics.private = 0 and forum_topics.time >= ? GROUP BY forum_topics.id ORDER BY lastposttime DESC', [minimumtime], function(err, results) {
            if (err) {
                logger.error('error in Board.getRecent ' + err);
                deferred.reject(err);
                return;
            }
            if(results.length === 0) {
                return deferred.resolve([]);
            }
            deferred.resolve(results);
        });
        return deferred.promise;
    };

    Board.get = function(boardId) {
        var deferred = Q.defer();

        db.query('select * from forum_boards where id=?', [boardId], function(err, results) {
            if(err) {
                logger.error('error in Board.get ' + err);
                deferred.reject(err);
                return;
            }

            if(results.length === 0) {
                deferred.reject('Board not found.');
                return;
            }

            deferred.resolve(new Board(results[0]));
        });

        return deferred.promise;
    };

    return Board;
};