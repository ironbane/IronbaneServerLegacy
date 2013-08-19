angular.module('IronbaneApp')
.directive('userpost', [function(){
	return {
    restrict: "E", 
		scope: {
			content: "@"

		},
		template:
		 XBBCODE.process({text: '{{content}}'} ).html 


	};
	


}]);