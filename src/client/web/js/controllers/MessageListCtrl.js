angular.module('IronbaneApp')
    .controller('MessageListCtrl', ['$scope', 'Article', '$log', '$location', '$window',
        function($scope, Article, $log, $location, $window) {
            $scope.messages = [{'id':1, 'subject': "message"}];

            $scope.$watch('messages', function(messages){
			    $scope.selectedCount = 0;
			    angular.forEach(messages, function(message){
			      if(message.checked){
			        $scope.selectedCount += 1;
			      }
			    })
			  }, true);
                    
        }


    ]);