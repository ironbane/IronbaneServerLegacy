// article.js

angular.module('IronbaneApp')
    .factory('Article', ['$http', '$log', '$templateCache', '$q', 'Post',
        function($http, $log, $templateCache, $q, Post) {

            var Article = function(json) {
                angular.copy(json || {}, this);
            };

            Article.getFrontPage = function() {
                return $http.get('/api/frontpage')
                    .then(function(response) {
                        var posts = [];
                        angular.forEach(response.data, function(post) {
                            posts.push(new Post(post));
                        });
                        return posts;
                    }, function(error) {
                        return $q.reject('error retrieving frontpage', error);
                    });
            };

            Article.prototype.$save = function() {
                return $http.post('/api/article/' + this.articleId, {
                    title: this.title,
                    body: this.body
                }).then(function(response) {
                    return response.data;
                }, function(error) {
                    return $q.reject("error saving article");
                });
            };

            Article.getAll = function() {
                return $http.get('/api/article')
                    .then(function(response) {
                        var articles = [];
                        angular.forEach(response.data, function(article) {
                            articles.push(new Article(article));
                        });
                        return articles;
                    }, function(error) {
                        return $q.reject();
                    });
            };

            Article.get = function(id, rendered) {
                // default to getting the rendered version, editing shouldn't
                if (rendered !== false) {
                    rendered = true;
                }

                var params = {};
                if (!rendered) {
                    params.params = {
                        rendered: false
                    };
                }

                return $http.get('/api/article/' + id, params)
                    .then(function(response) {
                        var article = new Article(response.data);
                        // setup a cacheUrl for template include
                        article.cacheUrl = '__articleCache/' + id;
                        // fake the contents in cache
                        $templateCache.put(article.cacheUrl, article.body);

                        return article;
                    }, function(err) {
                        $log.error('error retreiving article', err);

                        return $q.reject('error retreiving article', err);
                    });
            };

            return Article;
        }
    ]);