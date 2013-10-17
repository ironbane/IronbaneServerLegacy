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
        Post = require('./post'),
        bbcode = require('bbcode'),
        log = require('util').log;

    var Topic = Class.extend({
        init: function(json) {
            _.extend(this, json || {});
        }
    });

    Topic.unlock = function(topicId) {
        var deferred = Q.defer();
        db.query("UPDATE forum_topics set locked = 0 WHERE id = ? ", topicId, function(err, result) {
            if(err) {
                deferred.reject(err);
                return;
            }
            deferred.resolve(Topic.get(topicId));
        });
        return deferred.promise;
    };

    Topic.lock = function(topicId) {
        var deferred = Q.defer();
        db.query("UPDATE forum_topics set locked = 1 WHERE id = ? ", topicId, function(err, result) {
            if(err) {
                deferred.reject(err);
                return;
            }
            deferred.resolve(Topic.get(topicId));
        });
        return deferred.promise;
    };

    Topic.unsticky = function(topicId) {
        var deferred = Q.defer();
        db.query("UPDATE forum_topics set sticky = 0 WHERE id = ? ", topicId, function(err, result) {
            if(err) {
                deferred.reject(err);
                return;
            }
            deferred.resolve(Topic.get(topicId));
        });
        return deferred.promise;

    };

    Topic.sticky = function(topicId) {
        var deferred = Q.defer();
        db.query("UPDATE forum_topics set sticky = 1 WHERE id = ? ", topicId, function(err, result) {
            if(err) {
                deferred.reject(err);
                return;
            }
            deferred.resolve(Topic.get(topicId));
        });
        return deferred.promise;
    };

    Topic.newPost = function(params) {
        params.time = (new Date()).valueOf() / 1000; // convert to mysql unix_timestamp
        log(JSON.stringify(params));
        var deferred = Q.defer();
        db.query('insert into forum_topics set board_id = ?, time = ?, title = ?', [params.boardId, params.time, params.title], function(err, topicResult) {
            if (err) {
                deferred.reject(err);
                log("something went wrong here "+err);
                return;
            }

            var topicId = topicResult.insertId,
                post = {
                    topic_id: topicId,
                    content: params.content,
                    time: params.time,
                    
                    user: params.user
                };

            db.query('insert into forum_posts set ?', [post], function(err, result) {
                if (err) {
                    deferred.reject(err);
                    log(err + ' while inserting post');
                    return;
                }
                deferred.resolve(params.time);
            });
        });

        return deferred.promise;
    };

    Topic.getPostsView = function(topicId, mintime) {
        var deferred = Q.defer();
        var minimumtime = parseInt(mintime,10) || 0;
        log("getting view for " + topicId + " with minimumtime "  + minimumtime);

        var postsQ = ' (select count(id) from forum_posts where user = us.id) as postcount, ';
        var likesQ = ' (select name from forum_posts_likes  INNER JOIN bcs_users on bcs_users.id = forum_posts_likes.from_user where to_post = fp.id) as likes, ';
        db.query('SELECT ' + postsQ + likesQ + 'fp.content, fp.id, fp.time, us.name, us.forum_avatar, us.forum_sig FROM forum_posts AS fp  INNER JOIN bcs_users AS us ON us.id = fp.user WHERE fp.topic_id = ? and time >= ?', [topicId, minimumtime], function(err, results) {
            if (err) {
                log(err);
                deferred.reject(err);
                return;
            }

            if (results.length === 0) {
                deferred.reject(results);
                return;
            }
            _.each(results, function(p) {
                bbcode.parse(p.content, function(html) {
                    p.content = html;
                });
                p.user = {name: p.name, avatar : p.forum_avatar, sig:p.forum_sig, postcount: p.postcount};
                delete p.postcount;
                delete p.name;
                delete p.forum_sig;
                delete p.forum_avatar;
            });
            db.query('UPDATE forum_topics set views = views + 1 where id = ?', [topicId], function(results) {

            });
            deferred.resolve(results);
        });

        return deferred.promise;
    };

    Topic.get = function(topicId) {
        var deferred = Q.defer();

        db.query('select * from forum_topics where id=?', [topicId], function(err, results) {
            if (err) {
                deferred.reject(err);
                return;
            }

            if (results.length === 0) {
                deferred.reject('Topic not found.');
                return;
            }

            deferred.resolve(new Topic(results[0]));
        });

        return deferred.promise;
    };

    return Topic;
};