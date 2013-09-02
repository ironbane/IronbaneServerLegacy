// controllers - home.js
angular.module('IronbaneApp')
    .controller('ItemTemplate', ['$scope', 'Item', '$log', '$location', '$window',
        function($scope, Item, $log, $location, $window) {
            $scope.getList = function() {
                    $scope.items = Item.getAll();
             

            };

            $scope.save = function() {

            };
        }
    ]);