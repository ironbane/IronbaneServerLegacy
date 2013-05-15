// forum.js
angular.module('IronbaneApp')
.controller('ForumCtrl', ['$scope', 'ForumCategory', function($scope, ForumCategory) {
    $scope.cats = ForumCategory.getAllWithBoards();
}]);