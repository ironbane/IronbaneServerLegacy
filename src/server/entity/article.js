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

var Class = require('resig-class');

module.exports = function(db) {
    var Q = require('q'),
        _ = require('underscore'),
        log = require('util').log,
        marked = require('marked'),
        User = require('./user');
        
    var getById = function(articleId) {
        var deferred = Q.defer();

        db.query('select * from bcs_articles where articleId = ?', [articleId], function(err, result) {
            if(err) {
                deferred.reject(err);
                return;
            }

            if(result.length === 0) {
                deferred.reject({code: 404, msg: 'no article found with id ' + articleId});
                return;
            }

            // found it, return the json
            var article = new Article(result[0]);
            // convert body into html
            article.body = marked(article.body);
            // convert dates to JS
            article.created *= 1000;

            if(article.author === 0) {
                // system author
                article.authorName = 'Ironbane';
                deferred.resolve(article);
            } else {
                // grab author name from db
                User.getById(article.author).then(function(author) {
                    article.authorName = author.name;
                    deferred.resolve(article);
                }, function(err) {
                    // error here won't block the article
                    article.authorName = 'Unknown';
                    deferred.resolve(article);
                });
            }
        });

        return deferred.promise;
    };

    // search and filter list
    var getAll = function(query) {
        var deferred = Q.defer();

        // get all! todo: support where clause?
        db.query('select ' + (query.$fields ? query.$fields.join(',') : '*') + ' from bcs_articles', function(err, results) {
            if(err) {
                deferred.reject(err);
                return;
            }

            _.each(results, function(data, i) {
                results[i] = new Article(data);
            });
            deferred.resolve(results);
        });

        return deferred.promise;
    };
/*
@class MyClass
@constructor
*/
    var Article = Class.extend({
        init: function(json) {
            _.extend(this, json || {});
        }
    });

    // get only the db schema elements from this instance
    Article.prototype.$schema = function() {
        return {
            articleId: this.articleId,
            title: this.title,
            body: this.body, // TODO: careful this might have been converted from .get below, fix that
            author: this.author,
            created: this.created,
            views: this.views
        };
    };

    Article.create = function(json) {
        var deferred = Q.defer(),
            article = new Article(json);

        db.query('insert into bcs_articles set ?', article.$schema(), function(err, result) {
            if(err) {
                deferred.reject(err);
                return;
            }

            // update article with new ID?
            deferred.resolve(article);
        });

        return deferred.promise;
    };

    Article.get = function(query) {
        if(_.isString(query)) {
            // assume it's an ID
            return getById(query);
        } else {
            return getAll(query);
        }
    };

    Article.getFrontPage = function(){
        var deferred = Q.defer();
        db.query('Select * from forum_topics where board_id = 7 order by time desc', function(err, results){
            if(err){
                deferred.reject(err);
                return;
            }
            deferred.resolve(results);
        });
        return deferred.promise;
    }

    return Article;
};