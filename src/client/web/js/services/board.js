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
    Board.get = function(id) {
        // cache this call, unlikely board will change during a session
        var promise = $http.get('/api/forum/' + id, {cache: true})
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
.factory('Post', ['$log', '$http', 'User', function($log, $http, User) {
    var Post = function(json) {
        angular.copy(json || {}, this);
    };

    Post.prototype.$save = function(boardId, topicId) {
        var url = '/api/forum/' + boardId + '/topics';

        if(topicId && topicId > 0) {
            url = '/api/forum/topics/' + topicId;
        }

        var promise = $http.post(url, this)
            .then(function(response) {
                // update post object with id, topic_id etc...
                $log.log('success saving post!', response.data);
            }, function(err) {
                $log.error('error saving post', err);
            });

        return promise;
    };

    // get just the topics for a board
    Post.getTopics = function(boardId) {
        var promise = $http.get('/api/forum/' + boardId + '/topics')
            .then(function(response) {
                var posts = response.data;

                // upgrade objects
                posts.forEach(function(post, i) {
                    post.author = new User(post.author);
                    posts[i] = new Post(post);
                });

                return posts;
            });

        return promise;
    };

    // get an entire thread
    Post.getTopic = function(topicId) {
        var promise = $http.get('/api/forum/topics/' + topicId)
            .then(function(response) {
                var posts = response.data;

                // upgrade objects
                posts.forEach(function(post, i) {
                    post.author = new User(post.author);
                    posts[i] = new Post(post);
                });

                return posts;
            }, function(err) {
                $log.log('error getting topic', topicId, err);
            });

        return promise;
    };

    return Post;
}]);