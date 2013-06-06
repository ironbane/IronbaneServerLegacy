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
.constant('TERRAIN_STATUS', {
    INIT: 1,
    LOADING: 1,
    LOADED: 2,
    DESTROYED: 3
})
.factory('Terrain', ['$log', 'TERRAIN_STATUS', function($log, TERRAIN_STATUS) {
    var Terrain = Class.extend({
        cells: {},
        waterMesh: null,
        skybox: null,
        previewZone: 1,
        init: function() {
            this.zone = this.previewZone;
            this.lastOctreeBuildPosition = new THREE.Vector3(0, 1000000000, 0);

            // better as events?
            this.status = TERRAIN_STATUS.INIT;
        },
        destroy: function() {
            angular.forEach(this.cells, function(cell) {
                cell.removeMesh();
            });

            this.cells = {};
            this.world = {};

            this.zone = this.previewZone;

            if (this.skybox) {
                this.skybox.destroy();
                this.skybox = null;
            }

            // todo: move this?
            particleHandler.removeAll();

            this.status = TERRAIN_STATUS.DESTROYED;
        }
    });


    return Terrain;
}]);