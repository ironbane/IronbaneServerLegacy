angular.module('IronbaneApp')
    .controller('LoginCtrl', ['$scope', 'User', '$log', '$location',
        function($scope, User, $log, $location) {
            $scope.loginError = false;
            $scope.loginErrorMsg = 'oh noes! somethings went wrong!';

            $scope.login = function() {
                // clear for each attempt
                $scope.loginError = false;

                User.login($scope.username, $scope.password)
                    .then(function() {
                        $log.log('login success?');
                        $location.path('/');
                    }, function(err) {
                        $log.warn('login error!', err);
                        // greater detail?
                        $scope.loginError = true;
                        $scope.loginErrorMsg = err.data;
                    });
            };
        }
    ]);