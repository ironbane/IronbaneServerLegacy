// user.js
angular.module('IronbaneApp')
.factory('User', ['DEFAULT_AVATAR', '$http', '$log', '$q', '$rootScope', function(DEFAULT_AVATAR, $http, $log, $q, $rootScope) {
    var User = function(json) {
        angular.copy(json || {}, this);
    };

    User.prototype.roles = [];

    // todo: make this a getter?
    User.prototype.$avatar = function() { return this.forum_avatar || DEFAULT_AVATAR; };

    User.prototype.$hasRole = function(role) {
        return this.roles.indexOf(role) >= 0;
    };

    // login user, sets currentUser
    User.login = function(username, password) {
        return $http.post('/login', {username: username, password: password})
            .then(function(response) {
                // should be new reference? hmmm
                $rootScope.currentUser = new User(response.data);
                //angular.copy(response.data, $rootScope.currentUser);

                return true;
            }, function(err) {
                //$log.log('User service login error', err);
                return $q.reject(err);
            });
    };

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