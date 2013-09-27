IronbaneApp
.controller('OptionsCtrl', ['$scope', '$log', '$state', 'authenticated', function($scope, $log, $state, authenticated) {
    $scope.back = function() {
        if(authenticated) {
            $state.go('mainMenu.charSelect', {startingIndex: 0}); // todo: starting index based on last used char
        } else {
            $state.go('mainMenu.unauthenticated');
        }
    };

    $scope.toggleAudio = function() {
        $log.log('toggle audio!');
    };
}]);