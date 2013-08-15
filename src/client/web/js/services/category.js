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
                console.log(cats);
                return cats;
            });
    };

    return Category;
}]);