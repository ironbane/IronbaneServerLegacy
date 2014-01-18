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
    _ = require('underscore'),
    uuid = require('node-uuid');

var DiscussionService = Class.extend({
    getByThread: function(threadId) {
        var deferred = Q.defer();

        db.query('select * from discussions where parent_thread=?', [threadId], function(err, results) {
            if(err) {
                deferred.reject(err);
                return;
            }

            deferred.resolve(results);
        });

        return deferred.promise;
    },
    getById: function(id) {
        var deferred = Q.defer();

        db.query('select * from discussions where id=?', [id], function(err, results) {
            if(err) {
                deferred.reject(err);
                return;
            }

            if(results.length === 0) {
                deferred.reject('not found.');
                return;
            }

            deferred.resolve(results[0]);
        });

        return deferred.promise;
    },
    getThreadsByTags: function(tags) {

    },
    getThreadsByAuthor: function(authorId) {
        var deferred = Q.defer();

        db.query('select * from discussions where parent=null author_id=?', [authorId], function(err, results) {
            if(err) {
                deferred.reject(err);
                return;
            }

            deferred.resolve(results);
        });

        return deferred.promise;
    },
    getByParent: function(parentId, threadId) {

    },
    createThread: function(subject, body, authorId, tags) {
        var deferred = Q.defer(),
            post = {
                id: uuid.v4(),
                subject: subject,
                body: body,
                author_id: authorId,
                created_on: parseInt((new Date()).valueOf() / 1000, 10)
            };

        db.query('insert into discussions set ?', post, function(err, results) {
            if(err) {
                deferred.reject(err);
                return;
            }

            if(tags && tags.length > 0) {
                post.tags = tags;
                // let's just fire and forget here...
                _.each(tags, function(tag) {
                    db.query('insert into discussions_tags set discussion_id=?, tag=?', [post.id, tag], function(err, result) {
                        if(err) {
                            console.error("ERROR adding tag! : ", post.id, tag, err);
                            return;
                        }
                    });
                });
            } else {
                post.tags = [];
            }

            deferred.resolve(post);
        });

        return deferred.promise;
    },
    createReply: function(parent_thread, parent, subject, body, authorId) {
        var deferred = Q.defer(),
            post = {
                id: uuid.v4(),
                subject: subject,
                body: body,
                author_id: authorId,
                created_on: parseInt((new Date()).valueOf() / 1000, 10),
                parent: parent,
                parent_thread: parent_thread
            };

        db.query('insert into discussions set ?', post, function(err, results) {
            if(err) {
                deferred.reject(err);
                return;
            }

            deferred.resolve(post);
        });

        return deferred.promise;
    }
});

var service = new DiscussionService();

module.exports = service;