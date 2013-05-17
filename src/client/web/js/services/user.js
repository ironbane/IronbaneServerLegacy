// user.js
angular.module('IronbaneApp')
.factory('User', ['DEFAULT_AVATAR', '$http', '$log', '$q', function(DEFAULT_AVATAR, $http, $log, $q) {
    var User = function(json) {
        angular.copy(json || {}, this);
    };

    // todo: make this a getter?
    User.prototype.$avatar = function() { return this.forum_avatar || DEFAULT_AVATAR; };

    // get currently signed in user if exists or guest account
    User.getCurrentUser = function() {
        var deferred = $q.defer();

        $http.get('/api/session/user')
            .then(function(response) {
                $log.log('get user success', response);

                var user = new User(response.data);
                user.authenticated = true; // todo: move to server?
                deferred.resolve(user);
            }, function(err) {
                if(err.status === 404) {
                    // this just means not logged in
                    var user = new User({
                        id: 0,
                        username: 'guest',
                        authenticated: false
                    });

                    deferred.resolve(user);
                } else {
                    //$log.error('error retreiving user session', err);
                    deferred.reject(err);
                }
            });

        return deferred.promise;
    };

    return User;
}]);