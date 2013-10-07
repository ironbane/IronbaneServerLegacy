IronbaneApp
.controller('CharCreateCtrl', ['$scope', '$log', '$state', 'Character', function($scope, $log, $state, Character) {
    $scope.character = new Character();

    $scope.create = function() {

    };

    $scope.cancel = function() {
        $state.go('mainMenu.charSelect');
    };

    $scope.prevHair = function() {

    };

    $scope.nextHair = function() {

    };

    $scope.prevEyes = function() {

    };

    $scope.nextEyes = function() {

    };

    $scope.prevSkin = function() {

    };

    $scope.nextSkin = function() {

    };

    $scope.toggleGender = function() {
        if($scope.character.gender === 'Boy') {
            $scope.character.gender = 'Girl';
        } else {
            $scope.character.gender = 'Boy';
        }
    };
}]);