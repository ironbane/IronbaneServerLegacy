// board.js
angular.module('IronbaneApp')
    .factory('Board', ['$log', '$http', '$q',
        function($log, $http, $q) {
            var Board = function(json) {
                // update with config
                angular.copy(json || {}, this);

                if (!this.icon) {
                    // todo: some fallback in the css?
                    this.$setIcon(this.name.toLowerCase().replace(/ /g, '_'));
                } else {
                    this.$setIcon(this.icon);
                }
            };

            Board.prototype.$setIcon = function(icon) {
                this.icon = icon;
                this.iconStyle = {
                    'background-image': 'url(/images/icons/boards/' + icon + '.png)'
                };
            };

            // get a single board
            Board.get = function(boardId) {
                // cache this call, unlikely board will change during a session
                return $http.get('/api/forum/' + boardId, {
                    cache: true
                })
                    .then(function(response) {
                        return response.data;
                    }, function(err) {
                        $log.error('Error getting board from server', err);
                        return $q.reject(err);
                    });

            };

            Board.getAll = function() {
                return $http.get('/api/forum').then(function(response) {
                    var boards = [];
                    angular.forEach(response.data, function(board) {
                        boards.push(new Board(board));
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
        }
    ]);