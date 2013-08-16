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
        bbcode = require('bbcode'),
        log = require('util').log,
        Topic = require('./topic');

    var Board = Class.extend({
        init: function(json) {
            _.extend(this, json || {});
        }
    });

    Board.getTopics = function(boardId){
        log('getting topics for ' +boardId);
        var deferred = Q.defer();
        db.query('SELECT forum_topics.id, MIN(forum_posts.time) AS firstposttime, (COUNT(forum_posts.id) - 1 ) as postcount, bcs_users.name AS username, forum_topics.title FROM forum_topics INNER JOIN forum_posts ON forum_topics.id = forum_posts.topic_id INNER JOIN bcs_users ON forum_posts.user = bcs_users.id WHERE forum_topics.private = 0 and board_id = ? GROUP BY forum_topics.id ', [boardId], function(err, results) {
            if (err) {
                log('error getting topics');
                deferred.reject(err);
                return;
            }

            if(results.length === 0) {
                log('no topics found');
                deferred.resolve([]);
            }
            var topics = []
           _.each(results, function(data) {
                topics.push(data);
            });

            // loop through topics and grab the titles of the first posts
            
            deferred.resolve(topics);
        });
        return deferred.promise;
    };
            /*

            // better with a join?
            db.query('select * from forum_posts where topic_id in (?) group by topic_id order by time', [topicIds], function(err, pResults) {
                if(err) {
                deferred.reject(err);
                    return;
                }

                // skip authors phase if there aren't any results
                if(pResults.length === 0) {
                    deferred.resolve([]);
                    return;
                }

                var authors = [];

                posts = pResults;

                posts.forEach(function(post) {
                    authors.push(post.user);
                    post.bbcontent = post.content;
                    bbcode.parse(post.content, function(html) {
                        post.content = html;
                    });
                });

                // grab author details to populate
                db.query('select * from bcs_users where id in (?)', [authors], function(err, users) {
                    if(err) {
                        deferred.reject(err);
                        return;
                    }

                    // loop through posts and nest author
                    posts.forEach(function(post) {
                        for(var i=0;i<users.length;i++) {
                            if(post.user === users[i].id) {
                                post.author = users[i];
                                // don't send password or activationkey
                                delete post.author.pass;
                                delete post.author.activationkey;
                                break;
                            }
                        }
                    });

                });
            });

        });
        return deferred.promise;
    };
*/
    Board.get = function(boardId) {
        var deferred = Q.defer();

        db.query('select * from forum_boards where id=?', [defer], function(err, results) {
            if(err) {
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