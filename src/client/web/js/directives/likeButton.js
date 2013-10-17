angular.module('IronbaneApp')
.directive('likebutton', [function(){
	return {
    restrict: "E", 
		scope: {
			post: "=",
			likePost: '&like'

		},
		template:
		'<a ng-click="likePost()"><img ng-src="../../images/msg_savebox.gif"/></a>'


	};
	


}]);