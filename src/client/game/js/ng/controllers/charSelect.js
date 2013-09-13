IronbaneApp
    .controller('CharSelectCtrl', ['$scope', 'Character', '$rootScope', '$log', 'User', '$state',
        function($scope, Character, $rootScope, $log, User, $state) {
            $scope.chars = [];
            $scope.selectedChar = null;
            var index = $scope.$stateParams.startingIndex || 0;

            Character.getAll($rootScope.currentUser.id).then(function(chars) {
                $rootScope.currentUser.activeCharCount = chars.length;

                if(chars.length === 0) {
                    $state.go('mainMenu.charSelectNew');
                } else {
                    $scope.chars = chars;
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
                $state.go('playing');
            };

            $scope.options = function() {
                $state.go('mainMenu.options');
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