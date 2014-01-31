// board.js
angular.module('IronbaneApp')
    .controller('ProfileCtrl', ['$scope', 'ResolveData', '$location',
        function($scope, ResolveData, $location) {
            $scope.profile = ResolveData.profile;

            $scope.profile.info_gender = $scope.profile.info_gender === 0 ? 'male' : 'female';
        }
    ]);