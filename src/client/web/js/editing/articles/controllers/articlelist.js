// controllers - home.js
angular.module('IronbaneApp')
    .controller('ArticleList', ['$scope', 'Article', '$log', '$location', '$window',
        function($scope, Article, $log, $location, $window) {
                    $scope.articles = Article.getAll();
                    
        }
    ]);