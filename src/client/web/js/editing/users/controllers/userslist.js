angular.module('IronbaneApp')
    .controller('UsersList', ['$scope', 'User', '$log', '$location', '$window', 'utilities',
        function($scope, User, $log, $location, $window, utilities) {
            User.getAll().then(function(_data) {

                var numPerPage = 25;
                $scope.currentPage = 1;
                $scope.users = _data;

                $scope.noOfPages = Math.ceil(_data.length / numPerPage);

                $scope.$watch('currentPage', function() {
                    $scope.data = utilities.paginator($scope.users, $scope.currentPage, numPerPage);
                });

            });
        }
    ]);