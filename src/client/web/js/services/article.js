// article.js

angular.module('IronbaneApp')
.factory('Article', ['$http', '$log', '$templateCache', '$q', 'Post', function($http, $log, $templateCache, $q, Post) {
    
var Article = function(json) {
        angular.copy(json || {}, this);
    };

    Article.getFrontPage = function(){
        return $http.get('/api/frontpage')
             .then(function(response){
                var posts = []
               angular.forEach(response.data, function(post){
                    posts.push(new Post(post));
                });
                return posts;
             }, function(error){
                return $q.reject('error retrieving frontpage', error);
             });
    };

    Article.get = function(id) {
        return $http.get('/api/article/' + id)
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
}]);