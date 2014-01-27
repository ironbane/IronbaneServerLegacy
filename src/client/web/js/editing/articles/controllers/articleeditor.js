// topic.js
angular.module('IronbaneApp')
    .controller('ArticleEditor', ['$scope', 'ResolveData', '$log', '$location',
        function($scope, ResolveData, $log, $location) {
            $scope.article = ResolveData.article;

            $scope.save = function() {
                $scope.saveSuccess = $scope.saveError = false;

                $log.debug('saving article');
                $scope.article.$save()
                    .then(function() {
                        $scope.saveSuccess = true;
                        $scope.saveSuccessMsg = "Article updated.";
                    }, function(err) {
                        $scope.saveError = true;
                        $scope.saveErrorMsg = err;
                    });
            };

            $scope.cancel = function() {
                // just return to article list
                $location.path('/editor/article');
            };
        }
    ]);