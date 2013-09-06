angular.module('Friends')
.service('FriendService', ['$log', '$q', '$http', function($log, $q, $http) {
    // currently only supports CHARACTER friends, not USER friends (in-game only)
    this.get = function(userId, characterId) {
        return $http.get('/api/user/' + userId + '/characters/' + characterId + '/friends')
            .then(function(response) {
                return response.data;
            }, function(err) {
                return $q.reject(err);
            });
    };
}]);
