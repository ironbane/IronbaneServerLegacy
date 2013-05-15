// board.js
angular.module('IronbaneApp')
.factory('ForumCategory', ['$http', 'Board', '$log', function($http, Board, $log) {
    var Category = function(json) {
        angular.copy(json || {}, this);
    };

    // get all categories by themselves
    Category.getAll = function() {
        var promise = $http.get('/api/forum/cats')
            .then(function(response) {
                var cats = response.data;
                cats.forEach(function(cat, i) {
                    cats[i] = new Category(cats[i]);
                });

                return cats;
            }, function(err) {
                $log.error('Error retreiving categories from server.', err);
            });

        return promise;
    };

    // get an array of forum categories with the boards sorted
    Category.getAllWithBoards = function() {
        var cats = [];

        return Board.getAll()
            .then(function(boards) {
                var cat = null;
                boards.forEach(function(board) {
                    if(cat === null || cat.name !== board.category) {
                        if(cat) { cats.push(cat); }
                        cat = new Category({name: board.category, id: board.forumcat, boards: []});
                    }
                    cat.boards.push(board);
                });
                // push the last cat, meow!
                cats.push(cat);

                return cats;
            });
    };

    return Category;
}])
.factory('Board', ['$log', '$http', function($log, $http) {
    var Board = function(json) {
        // update with config
        angular.copy(json || {}, this);

        // todo: fill these
        this.url = '/forum/' + this.id;

        this.postCount = 0;
        this.topicCount = 0;
    };

    // get a single board
    Board.get = function(id) {
        var promise = $http.get('/api/forum/' + id)
            .then(function(response) {
                var board = new Board(response.data);

                return board;
            }, function(err) {
                $log.error('Error getting board from server', err);
            });

        return promise;
    };

    Board.getAll = function() {
        var promise = $http.get('/api/forum').then(function(response) {
            var boards = response.data;

            boards.forEach(function(board, i) {
                boards[i] = new Board(board);
            });

            return boards;
        }, function(err) {
            $log.error('Error getting boards from server', err);
        });

        return promise;
    };

    // return all boards for a specific category
    Board.getAllByCategory = function() {

    };

    return Board;
}])
.factory('Post', ['$log', '$http', function($log, $http) {
    var Post = function(json) {
        angular.copy(json || {}, this);
    };

    // get just the topics for a board
    Post.getTopics = function(boardId) {
        var promise = $http.get('/api/forum/' + boardId + '/topics')
            .then(function(response) {
                var posts = response.data;

                posts.forEach(function(post, i) {
                    posts[i] = new Post(post);
                });

                return posts;
            });

        return promise;
    };

    return Post;
}]);