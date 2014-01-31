// controllers - home.js
angular.module('IronbaneApp')
    .controller('ArticleList', ['$scope', 'articles', '$log', '$location',
        function($scope, articles, $log, $location) {
            $scope.articles = articles;

            $scope.loadArticle = function(article) {
                $location.path('/editor/article/' + article.articleId);
            };
        }
    ]);