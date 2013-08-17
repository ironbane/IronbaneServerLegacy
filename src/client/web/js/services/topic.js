angular.module('IronbaneApp')
.factory('Topic', ['$log','$http', 'Post', 'User', '$q', function($log, $http, Post, User, $q) {
    var Topic = function(json) {
        angular.copy(json || {}, this);
    };

    Topic.getTopic = function(topidId){
        return $http.get('/api/forum/topics/'+topidId)
            .then(function(response) {
                $log.log(response);
                
                return new Topic(response.data);
            }, function(error){
                return $q.reject(error);
            });

    };

    Topic.getTopics = function(boardId) {
        return $http.get('/api/forum/' + boardId + '/topics')
            .then(function(response) {
                $log.log(response.data);
                var topics = [];

                // upgrade objects
                angular.forEach(response.data,function(topic) {
                    //post.author = new User(post.author);
                    topics.push(new Topic(topic));
                });
                return topics;

            }, function(error){
                return $q.reject(error);
            });

    };
    return Topic;

}]);