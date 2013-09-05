angular.module('IronbaneApp')
.controller('UsersList', ['$scope', 'User', '$log', '$location', '$window', 'utilities',
        function($scope, User, $log, $location, $window, utilities) {
        	User.getAll().then(function(_data){

            var numPerPage = 25;
        		$scope.currentPage = 1;
        		$scope.allData = _data;
        		//$scope.selectPage = utilities.paginator(_data, $scope.currentPage);
            	$scope.data = utilities.paginator(_data, $scope.currentPage, numPerPage);



            $scope.noOfPages = Math.ceil(_data.length / numPerPage);

              $scope.$watch( 'currentPage', utilities.paginator($scope.allData, $scope.currentPage, numPerPage) );
		    
            
        });
    }]);