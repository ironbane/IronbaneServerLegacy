angular.module('IronbaneApp')
.controller('LoginCtrl', ['$scope', '$http', '$log', function($scope, $http, $log) {
    $scope.login = function() {
        $http.post('/login', {username: $scope.username, password: $scope.password})
            .success(function(response) {
                $log.log('login success', response);
            })
            .error(function(response) {
                $log.warn('login error', response);
            });
    };
}]);