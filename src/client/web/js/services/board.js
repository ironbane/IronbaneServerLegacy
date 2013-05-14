// board.js
angular.module('IronbaneApp')
.factory('Board', ['$log', '$http', function($log, $http) {
    var Board = function(json) {
        // update with config
        angular.copy(json || {}, this);
    };

    Board.query = function() {
        var results = [];

        $http.get('/api/forum').success(function(boards) {
            boards.forEach(function(board, i) {
                boards[i] = new Board(board);
            });
            angular.copy(boards, results);
        });

        return results;
    };

    return Board;
}]);