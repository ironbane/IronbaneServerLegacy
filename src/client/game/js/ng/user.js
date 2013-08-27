// user.js - for now mostly duplicated from the website
angular.module('User', []) // separate module for later sharing with web
.constant('DEFAULT_AVATAR', '/images/noavatar.png')
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

    User.getByName = function(username) {
        $log.log("getting user");
        return $http.get('/api/user/' + username)
            .then(function(response) {
                return response;
            }, function(err) {
                $log.error('error retreiving user', err);

                return $q.reject('error retreiving user', err);
            });
    };


    // get currently signed in user if exists or guest account
    User.getCurrentUser = function() {

        return $http.get('/api/session/user')
            .then(function(response) {
                $log.log('get user success', response);

                var user = new User(response.data);
                user.authenticated = true; // todo: move to server?
                return user;
            }, function(err) {
                if(err.status === 404) {
                    // this just means not logged in
                    var user = new User({
                        id: 0,
                        username: 'guest',
                        authenticated: false
                    });

                    return user;
                } else {
                    //$log.error('error retreiving user session', err);
                    $q.reject(err);
                }
            });

    };

    return User;
}]);
