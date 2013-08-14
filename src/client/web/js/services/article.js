// article.js
angular.module('IronbaneApp')
.factory('Article', ['$http', '$log', '$templateCache', '$q', function($http, $log, $templateCache, $q) {
    var Article = function(json) {
        angular.copy(json || {}, this);
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