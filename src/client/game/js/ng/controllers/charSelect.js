IronbaneApp
    .controller('CharSelectCtrl', ['$scope', 'Character', '$rootScope', '$log', 'User', '$state',
        function($scope, Character, $rootScope, $log, User, $state) {
            $scope.chars = [];
            $scope.selectedChar = null;
            var index = $state.current.data.startingIndex || 0;

            Character.getAll($rootScope.currentUser.id).then(function(chars) {
                $rootScope.currentUser.activeCharCount = chars.length;

                if(chars.length === 0) {
                    $state.go('mainMenu.charSelectNew');
                } else {
                    angular.forEach(chars, function(c) {
                        $scope.chars.unshift(c);
                    });
                    $scope.selectedChar = chars[0];
                }
            }, function(err) {
                $log.error('error loading characters for current user!', err);
            });

            $scope.next = function() {
                index++;
                if (index > $scope.chars.length - 1) {
                    //index = 0;
                    $state.go('mainMenu.charSelectNew');
                }

                $scope.selectedChar = $scope.chars[index];
            };

            $scope.prev = function() {
                index--;
                if (index < 0) {
                    //index = $scope.chars.length - 1;
                    $state.go('mainMenu.charSelectNew');
                }

                $scope.selectedChar = $scope.chars[index];
            };

            $scope.deleteChar = function() {
                // present delete UI
            };

            $scope.enterGame = function() {
                // go play!
            };

            $scope.logout = function() {
                User.logout().then(function() {
                    $state.go('mainMenu.unauthenticated');
                }, function(err) {
                    $log.error(err);
                });
            };
        }
    ]);