IronbaneApp
    .controller('RegisterCtrl', ['$scope', '$state', '$log', 'User',
        function($scope, $state, $log, User) {
            $scope.registrationError = null;

            $scope.cancel = function() {
                $state.go('mainMenu.unauthenticated');
            };

            $scope.register = function() {
                if ($scope.registrationForm.$valid) {
                    User.register($scope.reg.username, $scope.reg.password, $scope.reg.email)
                        .then(function(user) {
                            // set current user in rootscope? we should also be signed in now...
                            $state.go('mainMenu.charSelect');
                        }, function(err) {
                            $scope.registrationError = err;
                            $scope.registerClicked = false; // reset to give it another go
                        });
                } else {
                    $scope.registerClicked = false; // reset to give it another go
                }
            };
        }
    ]);