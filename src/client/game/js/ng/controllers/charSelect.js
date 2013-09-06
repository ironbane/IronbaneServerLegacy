IronbaneApp
    .controller('CharSelectCtrl', ['$scope', 'Character', '$rootScope',
        function($scope, Character, $rootScope) {
            $scope.chars = [new Character({
                name: 'Create Character'
            })];
            $scope.selectedChar = null;
            $scope.remainingSlots = 3; // todo: constant? or what

            var index = 0;

            Character.getAll($rootScope.currentUser.id).then(function(chars) {
                angular.forEach(chars, function(c) {
                    $scope.chars.unshift(c);
                });
                $scope.remainingSlots -= chars.length;
                $scope.selectedChar = chars[0];
            }, function(err) {
                $log.error('error loading characters for current user!', err);
            });

            $scope.next = function() {
                index++;
                if (index > $scope.chars.length - 1) {
                    index = 0;
                }

                $scope.selectedChar = $scope.chars[index];
            };

            $scope.prev = function() {
                index--;
                if (index < 0) {
                    index = $scope.chars.length - 1;
                }

                $scope.selectedChar = $scope.chars[index];
            };

            $scope.deleteChar = function() {
                // present delete UI
            };

            $scope.enterGame = function() {
                // go play!
            };
        }
    ]);