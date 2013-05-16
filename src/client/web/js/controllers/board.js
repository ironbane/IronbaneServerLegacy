// board.js
angular.module('IronbaneApp')
.controller('BoardCtrl', ['$scope', 'ResolveData', '$location', function($scope, ResolveData, $location) {
    $scope.board = ResolveData.board;
    $scope.posts = ResolveData.posts;

    $scope.newTopic = function() {
        $location.path('/forum/' + $scope.board.id + '/post');
    };

}]);