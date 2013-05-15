// user.js
angular.module('IronbaneApp')
.factory('User', ['DEFAULT_AVATAR', function(DEFAULT_AVATAR) {
    var User = function(json) {
        angular.copy(json || {}, this);
    };

    // todo: make this a getter?
    User.prototype.$avatar = function() { return this.forum_avatar || DEFAULT_AVATAR; };

    return User;
}]);