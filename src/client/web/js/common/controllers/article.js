// article.js
angular.module('IronbaneApp')
    .controller('ArticleCtrl', ['$scope', 'ArticleData', '$log', '$rootScope',
        function($scope, ArticleData, $log, $rootScope) {
            $scope.article = ArticleData;

            $rootScope.subTitle = $scope.article.title;

            $scope.$on('destroy', function() {
                $rootScope.subTitle = null;
            });
        }
    ]);