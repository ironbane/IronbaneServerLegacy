angular.module('IronbaneApp')
.factory('Topic', ['$log','$http', 'Post', 'User',function($log, $http, Post, User) {
    var Topic = function(json) {
        angular.copy(json || {}, this);
    };

    Topic.getTopics = function(boardId) {
        var promise = $http.get('/api/forum/' + boardId + '/topics')
            .then(function(response) {
                var topics = response.data;

                // upgrade objects
                topics.forEach(function(topic, i) {
                    //post.author = new User(post.author);
                    topics[i] = new Topic(topic);
                });

                return topics;
            });

        return promise;
    };
    return Topic;

}]);