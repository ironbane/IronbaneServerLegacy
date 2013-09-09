angular.module('IronbaneApp')
.directive('forumuserprofile', [function(){
	return {
    restrict: "E", 
		scope: {
			user: "="

		},
		template:
		 '<span class="forumuserprofile"> ' +
		 '<userlink name="{{user.name}}"/> <br> posts: {{user.posts}} <br> rank:{{user.rank}} <br> <img ng-src="{{user.avatar}}"/> </span>'
	};
	


}]);