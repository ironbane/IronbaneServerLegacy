// board.js
angular.module('IronbaneApp')
    .factory('Forum', ['$http', 'Board', 'Category', '$log', '$q',
        function($http, Board, Category, $log, $q) {
            var Forum = function(json) {
                angular.copy(json || {}, this);
            };

            // get an array of forum categories with the boards sorted
            Forum.getAllWithBoards = function() {
                var cats = [];

                return Board.getAll()
                    .then(function(boards) {
                        var cat = null;
                        boards.forEach(function(board) {
                            if (cat === null || cat.name !== board.category) {
                                if (cat) {
                                    cats.push(cat);
                                }
                                cat = new Category({
                                    name: board.category,
                                    id: board.forumcat,
                                    boards: []
                                });
                            }
                            cat.boards.push(board);
                        });
                        // push the last cat, meow!
                        cats.push(cat);
                        return cats;
                    });
            };

            Forum.getStatistics = function() {
                return $http.get('/api/statistics')
                    .then(function(response) {
                        return response.data;
                    }, function(err) {
                        $log.error('Error getting statistics from the server', err);
                        $q.reject(err);
                    });
            };

            Forum.getLatestOnlineUsers = function() {

                return $http.get('/api/onlineusers')
                    .then(function(response) {
                        return response.data;
                    }, function(err) {
                        $log.error('Error getting board from server', err);
                        $q.reject(err);
                    });

            };

            return Forum;
        }
    ]);