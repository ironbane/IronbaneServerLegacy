angular.module('IronbaneApp')
.factory('Post', ['$log', '$http', 'User', function($log, $http, User) {
    var Post = function(json) {
        angular.copy(json || {}, this);
    };

    Post.prototype.$save = function(boardId, topicId) {
        var url = '/api/forum/' + boardId + '/topics';

        if(topicId && topicId > 0) {
            url = '/api/forum/'+boardId+'topics/' + topicId;
        }

        var promise = $http.post(url, this)
            .then(function(response) {
                // update post object with id, topic_id etc...
                $log.log('success saving post!', response.data);
            }, function(err) {
                $log.error('error saving post', err);
            });

        return promise;
    };

    return Post;
}]);