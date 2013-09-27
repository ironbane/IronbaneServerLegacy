IronbaneApp
.controller('OptionsCtrl', ['$scope', '$log', '$state', 'authenticated', function($scope, $log, $state, authenticated) {
    $scope.back = function() {
        if(authenticated) {
            $state.go('mainMenu.charSelect', {startingIndex: 0}); // todo: starting index based on last used char
        } else {
            $state.go('mainMenu.unauthenticated');
        }
    };

    $scope.toggleFullScreen = function() {

    };

    $scope.audioEnabled = true;

    $scope.volume = {
        master: 80,
        music: 80,
        effects: 80
    };

    $scope.$watch('volume.master', function(volume) {
        $scope.volume.music = volume;
        $scope.volume.effects = volume;
    });
}]);