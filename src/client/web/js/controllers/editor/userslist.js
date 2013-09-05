angular.module('IronbaneApp')
.controller('UsersList', ['$scope', 'User', '$log', '$location', '$window', 'utilities',
        function($scope, User, $log, $location, $window, utilities) {
        	User.getAll().then(function(_data){
        		$scope.currentPage = 1;
        		$scope.allData = _data;
        		$scope.selectPage = utilities.paginator(_data, $scope.currentPage);
            	$scope.data = utilities.paginator(_data, $scope.currentPage);

              $scope.$watch( 'currentPage', utilities.paginator($scope.allData, $scope.currentPage) );
		    
            
        });
    }]);