// register.js
angular.module('IronbaneApp')
.controller('RegisterCtrl', ['$scope', 'User','$http', '$log', function($scope, User, $http, $log) {
    // for now just make the request, todo: move to user service
    $scope.register = function() {
        if ($scope.registerForm.$valid) {
           User.register($scope.username, $scope.password)
            .then(function() {
                $log.log('login success?');
            }, function(err) {
                $log.warn('login error!', err);
                if(err === 'usernametaken')
                // greater detail?
                $scope.usernameTaken = true;
            });
    }
         else {
            $log.warn('form\'s not valid buddy...');
        }
    };
}]);