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
        log = require('util').log,
        _ = require('underscore');

    var Post = Class.extend({
        init: function(json) {
            _.extend(this, json || {});
        }
    });

    Post.prototype.$save = function() {
        var deferred = Q.defer(),
            post = this;
            post.time = parseInt((new Date()).valueOf() / 1000,10); // convert to mysql unix_timestamp


        if(post.id) {
            // update post
            var uObj = {
                content: post.content,
                lastedit_time: post.lastedit_time,
                lastedit_author: post.lastedit_author
            };

            db.query('update forum_posts set content=?, lastedit_time=?, lastedit_count=lastedit_count+1, lastedit_author=? WHERE id=' + post.id, uObj, function(err, result) {
                if(err) {
                    deferred.reject('error updating post: ' + err.code);
                    return;
                }

                deferred.resolve(post);
            });
        } else {
            // create new post
            db.query('insert into forum_posts set ?', post, function(err, result) {
                if(err) {
                    deferred.reject('error creating post: ' + err.code);
                    return;
                }

                // return new ID of post
                post.id = result.insertId;
                deferred.resolve(post);
            });
        }

        return deferred.promise;
    };

    Post.save = function(post) {
        var deferred = Q.defer();
        db.query('insert into forum_posts set ?', post, function(err, result) {
            if(err) {
                deferred.reject('error creating post: ' + err.code);
                return;
            }

            // return new ID of post
            deferred.resolve(result.insertId);
        });
        return deferred.promise;
    };

    Post.like = function(postId, userId){
        var deferred = Q.defer();

        db.query("insert into forum_posts_likes set ?", {from_user : userId, to_post:postId}, function(err, results){
            if(err){
                return deferred.reject(err);
            }
            deferred.resolve();
        });
        return deferred.promise;
    }

    Post.get = function(postId) {
        var deferred = Q.defer();

        db.query('select * from forum_posts where id=?', [postId], function(err, results) {
            if(err) {
                deferred.reject(err);
                return;
            }

            if(results.length === 0) {
                deferred.reject('post not found.');
                return;
            }

            deferred.resolve(new Post(results[0]));
        });

        return deferred.promise;
    };

    return Post;
};