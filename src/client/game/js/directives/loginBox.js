/*
    This file is part of Ironbane MMO.

    Ironbane MMO is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Ironbane MMO is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Ironbane MMO.  If not, see <http://www.gnu.org/licenses/>.
*/
angular.module('IronbaneGame')
.directive('loginBox', ['$log', function($log) {
    return {
        templateUrl: '/game/partials/loginBox',
        replace: true,
        restrict: 'AE',
        controller: ['$scope', function($scope) {
            $scope.stage = 1;
        }],
        link: function(scope, el, attrs) {
            scope.stage = 1;
        }
    };
}]);