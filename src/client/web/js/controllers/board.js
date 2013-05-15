// board.js
angular.module('IronbaneApp')
.controller('BoardCtrl', ['$scope', 'ResolveData', function($scope, ResolveData) {
    $scope.board = ResolveData.board;
    $scope.posts = ResolveData.posts;
}]);