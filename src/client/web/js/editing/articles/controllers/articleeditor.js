// topic.js
angular.module('IronbaneApp')
.controller('ArticleEditor', ['$scope', 'ResolveData', '$log', function($scope, ResolveData, $log) {
    $scope.article = ResolveData.article;
    $scope.save = function(){
        $scope.article.save();
    };
}]);