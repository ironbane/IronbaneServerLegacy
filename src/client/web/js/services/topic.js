angular.module('IronbaneApp')
.factory('Topic', ['$log','$http', 'Post', 'User', '$q', function($log, $http, Post, User, $q) {
    var Topic = function(json) {
        angular.copy(json || {}, this);
    };

    Topic.getTopics = function(boardId) {
        var deferred = $q.defer();
        $http.get('/api/forum/' + boardId + '/topics')
            .then(function(response) {
                $log.log(response);
                var topics = response.data;

                // upgrade objects
                topics.forEach(function(topic, i) {
                    //post.author = new User(post.author);
                    topics[i] = new Topic(topic);
                });

                deferred.resolve(topics);
            });

        return deferred.promise;
    };
    return Topic;

}]);