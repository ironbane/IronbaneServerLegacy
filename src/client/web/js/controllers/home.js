// controllers - home.js
angular.module('IronbaneApp')
.controller('HomeCtrl', ['$scope','Article','$log', function($scope, Article, $log) {
    Article.getFrontPage()
    .then(function(results){
    	$scope.posts = results;
    }, function(error) {
    	$log.log('error getting frontpage ' + error);
    });
}]);