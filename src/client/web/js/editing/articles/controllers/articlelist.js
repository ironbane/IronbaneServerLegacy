// controllers - home.js
angular.module('IronbaneApp')
    .controller('ArticleList', ['$scope', 'articles', '$log',
        function($scope, articles, $log) {
            $scope.articles = articles;
        }
    ]);