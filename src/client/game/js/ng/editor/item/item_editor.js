IronbaneApp
.directive('itemEditor', ['$log', function($log) {
    return {
        scope: true,
        templateUrl: '/game/templates/item_editor.html',
        restrict: 'EA',
        controller: ['$scope', '$log', 'ItemTemplateSvc', function($scope, $log, ItemTemplateSvc) {
            $scope.templates = [];

            ItemTemplateSvc.getAll().then(function(templates) {
                $scope.templates = templates;
            }, function(err) {
                $log.error('Error loading unit templates!', err);
            });

            $scope.$watch('item.image', function(image) {
                if(!image || !$scope.item) {
                    return;
                }

                if ($scope.item.type === 'armor') {
                    $scope.imageUrl = 'images/characters/base/' + $scope.item.subtype + '/big.php?i=' + image + '';
                } else {
                    $scope.imageUrl = 'images/items/big.php?i=' + image;
                }
            });

            $scope.doNew = function() {
                $scope.item = {};
            };

            $scope.doDuplicate = function() {
                $scope.item = angular.copy($scope.item);
                delete $scope.item.id;
            };

            $scope.giveItem = function() {
                if(!$scope.item || !$scope.item.id) {
                    // can't give a non-final item (yet!)
                    return;
                }

                // todo: wrap this in a service!
                socketHandler.socket.emit('chatMessage', {
                  message: '/giveitem ' + $scope.item.id
                });
            };

            $scope.showAnalysis = function() {
                if(!$scope.item || !$scope.item.id) {
                    // can't give a non-final item (yet!)
                    return;
                }

                ItemTemplateSvc.getAnalysis($scope.item.id).then(function(result) {
                    var report = "This item is found " + result.items + " times in inventories.<br>";
                    report += "It is in the loot of " + result.loots + " units.";

                    hudHandler.messageAlert(report);
                }, function(err) {
                    hudHandler.messageAlert('Error' + err);
                });
            };
        }],
        link: function(scope, el, attrs) {

        }
    };
}]);