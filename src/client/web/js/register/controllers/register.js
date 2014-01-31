// register.js
angular.module('IronbaneApp')
    .controller('RegisterCtrl', ['User', '$scope', '$http', '$log', '$location',
        function(User, $scope, $http, $log, $location) {
            // for now just make the request, todo: move to user service
            $scope.register = function() {
                if ($scope.registerForm.$valid) {
                    User.register($scope.user.username, $scope.user.password, $scope.user.email)
                        .then(function(response) {
                            //$log.log('registration success', response);
                            $location.path('/');
                        }, function(response) {
                            $log.warn('registration error', response);
                        });
                } else {
                    $log.warn('form\'s not valid buddy...');
                }
            };
        }
    ]);