// article.js
angular.module('IronbaneApp')
.factory('Article', ['$http', '$log', function($http, $log) {
    var Article = function(json) {
        angular.copy(json || {}, this);
    };

    Article.get = function(id) {
        return $http.get('/api/article/' + id)
            .then(function(response) {
                return new Article(response.data);
            }, function(err) {
                $log.error('error retreiving article', err);
            });
    };

    return Article;
}]);