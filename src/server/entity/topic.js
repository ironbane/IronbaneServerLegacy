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

    Topic.newPost = function(params) {
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
            log("topic id :" + post.topic_id);
            log("content : " + post.content);
            log("time : " + post.time);
            log("user : " + post.user);

            db.query('insert into forum_posts set ?', [post], function(err, result) {
                if (err) {
                    deferred.reject(err);
                    log(err + ' while inserting post');
                    return;
                }
                deferred.resolve(result);
            });
        });

        return deferred.promise;
    };

    Topic.getPostsView = function(topicId) {
        var deferred = Q.defer();

        var postsQ = ' (select count(id) from forum_posts where user = us.id) as postcount, ';
        db.query('SELECT ' + postsQ + 'fp.content, fp.time, us.name, us.forum_avatar, us.forum_sig FROM forum_posts AS fp  INNER JOIN bcs_users AS us ON us.id = fp.user WHERE fp.topic_id = ?', [topicId], function(err, results) {
            if (err) {
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
                p.postcount = undefined;
                p.name = undefined;
                p.forum_sig = undefined;
                p.forum_avatar = undefined;
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