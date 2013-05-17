// register.js
angular.module('IronbaneApp')
.controller('RegisterCtrl', ['$scope', '$http', '$log', function($scope, $http, $log) {
    // for now just make the request, todo: move to user service
    $scope.register = function() {
        if ($scope.registerForm.$valid) {
            $http.post('/api/user', $scope.user)
                .success(function(response) {
                    $log.log('registration success', response);
                })
                .error(function(response) {
                    $log.warn('registration error', response);
                });
        } else {
            $log.warn('form\'s not valid buddy...');
        }
    };
}]);