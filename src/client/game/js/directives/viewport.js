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
.directive('viewport', ['$window', function($window) {
    return {
        restrict: 'AE',
        scope: {
            engine: '='
        },
        link: function(scope, el, attrs) {
            scope.engine.start(el);

            $window.addEventListener('resize', function() {
                // notify the renderer of the size change
                scope.engine.renderer.setSize($window.innerWidth, $window.innerHeight);
                // update the camera
                scope.engine.camera.aspect = $window.innerWidth / $window.innerHeight;
                scope.engine.camera.updateProjectionMatrix();
            });
        }
    };
}]);