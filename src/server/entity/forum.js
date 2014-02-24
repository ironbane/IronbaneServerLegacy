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
        marked = require('marked'),
        log = require('util').log;

    marked.setOptions({
        renderer: new marked.Renderer(),
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: true,
        smartLists: true,
        smartypants: false
    });

    var Forum = Class.extend({
        init: function(json) {
            _.extend(this, json || {});
        }
    });

    Forum.getStatistics = function() {
        var deferred = Q.defer();
        var postQ = ' (select count(id) from forum_posts) as totalposts,',
            userQ = ' (select count(id) from bcs_users) as totalusers,';

        db.query('SELECT ' + postQ + userQ + 'name as lastregistered from bcs_users  ORDER BY reg_date DESC LIMIT 1', function(err, results) {
            if (err) {
                return deferred.reject(err);

            }
            deferred.resolve(results[0]);
        });
        return deferred.promise;
    };

    Forum.getFrontPage = function() {
        var deferred = Q.defer();

        db.query('SELECT topic.id, topic.title, post.content, users.name as username FROM forum_topics AS topic INNER JOIN forum_posts AS post ON post.`topic_id` = topic.`id` INNER JOIN bcs_users AS users ON users.id = post.user WHERE topic.board_id = 7 AND post.time = (SELECT MIN(forum_posts.time) FROM forum_posts WHERE forum_posts.`topic_id` = topic.id ) ORDER BY post.time DESC', function(err, results) {
            if (err) {
                log('SQL error getting news: ' + err);
                return deferred.reject('Error getting news posts!');

            }
            _.each(results, function(p) {
                p.content = marked(p.content);
            });

            deferred.resolve(results);
        });

        return deferred.promise;
    };

    Forum.getForumView = function() {
        var deferred = Q.defer();
        var topicQ = ' (select count(id) from forum_topics where board_id = fb.id) as topicCount, ',
            postsQ = ' (SELECT COUNT(forum_posts.id) FROM forum_posts INNER JOIN forum_topics ON forum_topics.id = topic_id WHERE board_id = fb.id ) AS postCount, ',
            boardsQ = ' fb.id, fb.name, fb.description, '

        db.query('SELECT ' + topicQ + postsQ + boardsQ + ' fc.name as category FROM forum_boards fb left join forum_cats fc on fb.forumcat=fc.id order by fc.order, fb.order',
            function(err, results) {
                if (err) {
                    deferred.reject(err);
                    return;
                }
                deferred.resolve(results);
            });

        return deferred.promise;
    };

    return Forum;
};