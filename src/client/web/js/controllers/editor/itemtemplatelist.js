// controllers - home.js
angular.module('IronbaneApp')
    .controller('ItemTemplateList', ['$scope', 'Item', '$log', '$location', '$window',
        function($scope, Item, $log, $location, $window) {
                    $scope.templates = Item.getAll();
                    
        }
    ]);