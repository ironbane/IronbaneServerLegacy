// forum.js
angular.module('IronbaneApp')
.controller('FaqCtrl', ['$scope', 'Article','$log', function($scope, Article, $log) {
    Article.get('faq').then(function(FAQ) { 
	    $scope.faq = FAQ;
	});
        
}]);