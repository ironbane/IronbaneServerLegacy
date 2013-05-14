// forum.js
angular.module('IronbaneApp')
.controller('ForumCtrl', ['$scope', 'Board', function($scope, Board) {
    $scope.boards = Board.query();
}]);