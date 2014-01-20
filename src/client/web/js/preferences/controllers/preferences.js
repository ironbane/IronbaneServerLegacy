// preferences.js
angular.module('IronbaneApp')
    .controller('PreferencesCtrl', ['User', '$scope', '$http', '$log', '$rootScope',
        function(User, $scope, $http, $log, $rootScope) {
            $scope.user = angular.copy($rootScope.currentUser);
            $scope.genderOptions = [{
                gender: "male"
            }, {
                gender: "female"
            }];

            $scope.togglePW = false;
            $scope.saveError = false;

            $scope.save = function() {
                $log.debug("save user: ", $scope.user);

                if($scope.user.password_new) {
                    if(!$scope.user.password_old) {
                        $scope.saveError = true;
                        $scope.saveErrorMsg = "You must enter your old password to set a new one.";
                        return;
                    }
                }

                $http.post('/api/user/preferences', $scope.user)
                    .success(function(response) {
                        User.getCurrentUser()
                            .then(function(user) {
                                angular.copy(user, $rootScope.currentUser);
                            });
                        $scope.message = "Update succesful!";
                        setTimeout(function() {
                            $("body").animate({
                                scrollTop: 0
                            }, "slow");
                        }, 1);
                    })
                    .error(function(response) {
                        $log.warn('update error', response);
                    });
            };
        }
    ]);