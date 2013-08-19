// board.js
angular.module('IronbaneApp')
.factory('Board', ['$log', '$http', function($log, $http) {
    var Board = function(json) {
        // update with config
        angular.copy(json || {}, this);

        // todo: fill these
        this.url = '/forum/' + this.id;

        if(!this.icon) {
            this.$setIcon('beer-stein');
        } else {
            this.$setIcon(this.icon);
        }
    };

    Board.prototype.$setIcon = function(icon) {
        this.icon = icon;
        this.iconStyle = {
            'background-image': 'url("/images/icons/svg/'+ icon + '.svg")',
            'background-size': '32px 32px'
        };
    };

    // get a single board
    Board.get = function(boardId) {
        // cache this call, unlikely board will change during a session
        return $http.get('/api/forum/' + boardId, {cache: true})
            .then(function(response) {
                return new Board(response.data);

            }, function(err) {
                $log.error('Error getting board from server', err);
                return $q.reject(err);
            });

    };

    Board.getAll = function() {
        return $http.get('/api/forum').then(function(response) {
            var boards = response.data;

            boards.forEach(function(board, i) {
                boards[i] = new Board(board);
            });

            return boards;
        }, function(err) {
            $log.error('Error getting boards from server', err);
            return $q.reject(err);
        });

    };

    // return all boards for a specific category
    Board.getAllByCategory = function(categoryId) {

    };

    return Board;
}]);