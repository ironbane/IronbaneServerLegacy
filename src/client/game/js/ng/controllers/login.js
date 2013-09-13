IronbaneApp
// TODO: convert this to shared directive with web, pass in success handler
.controller('LoginCtrl', ['$scope', 'User', '$log', '$state', function($scope, User, $log, $state) {
    $scope.loginError = false;
    $scope.loginErrorMsg = 'oh noes! somethings went wrong!';

    $scope.login = function() {
        // clear for each attempt
        $scope.loginError = false;

        User.login($scope.username, $scope.password)
            .then(function() {
                $state.go('mainMenu.charSelect');
            }, function(err) {
                $log.warn('login error!', err);
                // greater detail?
                $scope.loginError = true;
                $scope.loginErrorMsg = err.data;
            });
    };

    $scope.cancel = function() {
        // back we go!
        $state.go('mainMenu.unauthenticated');
    };
}]);