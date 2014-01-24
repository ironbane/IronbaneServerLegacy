// topic.js
angular.module('IronbaneApp')
    .controller('ArticleEditor', ['$scope', 'ResolveData', '$log',
        function($scope, ResolveData, $log) {
            $scope.article = ResolveData.article;

            $scope.save = function() {
                $scope.saveSuccess = $scope.saveError = false;

                $log.debug('saving article');
                $scope.article.$save()
                    .then(function() {
                        $scope.saveSuccess = true;
                        $scope.saveSuccessMsg = "Article updated."
                    }, function(err) {
                        $scope.saveError = true;
                        $scope.saveErrorMsg = err;
                    });
            };
        }
    ]);