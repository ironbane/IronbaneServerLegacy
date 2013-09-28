IronbaneApp
.controller('OptionsCtrl', ['$scope', '$log', '$state', 'authenticated', 'storage', 'AudioManager', function($scope, $log, $state, authenticated, storage, AudioManager) {
    $scope.back = function() {
        if(authenticated) {
            $state.go('mainMenu.charSelect', {startingIndex: 0}); // todo: starting index based on last used char
        } else {
            $state.go('mainMenu.unauthenticated');
        }
    };

    $scope.toggleFullScreen = function() {

    };

    // bind the value to local storage
    storage.bind($scope, 'audioEnabled', {defaultValue: true, storeName: 'allowSound'});
    storage.bind($scope, 'volume', {defaultValue: {master: 80, music: 80, effects: 80}});

    $scope.$watch('volume.master', function(volume) {
        if ($scope.volume.music > volume) {
            $scope.volume.music = volume;
        }
        if ($scope.volume.effects > volume) {
            $scope.volume.effects = volume;
        }

        // trigger immediate volume adjustment
        AudioManager.setVolume($scope.volume.master, $scope.volume.music, $scope.volume.effects);
    });

    $scope.$watch('audioEnabled', function(enabled) {
        AudioManager.enabled = enabled;

        if(enabled) {
            AudioManager.playMusic('music/maintheme');
        } else {
            AudioManager.stopAll();
        }
    });

}]);