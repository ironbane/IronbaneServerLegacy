IronbaneApp
.controller('OptionsCtrl', ['$scope', '$log', '$state', function($scope, $log, $state) {
    $scope.back = function() {
        $state.go('mainMenu');
    };

    $scope.toggleAudio = function() {
        $log.log('toggle audio!');
    };
}]);