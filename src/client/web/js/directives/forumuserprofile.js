angular.module('IronbaneApp')
.directive('forumuserprofile', [function(){
	return {
    restrict: "E", 
		scope: {
			user: "@"

		},
		template:
		 '<span class="forumuserprofile"> ' +
		 '<userlink name="{{user.name}}"/>" <br> {{user.posts}} <br> {{user.rank}} <br> <img src="{{user.avatar}}"/> </span>'


	};
	


}]);