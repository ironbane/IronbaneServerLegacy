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
.constant('VECTOR_UNIT', new THREE.Vector3(1, 1, 1))
.constant('VECTOR_UNITX', new THREE.Vector3(1, 0, 0))
.constant('VECTOR_UNITY', new THREE.Vector3(0, 1, 0))
.constant('VECTOR_UNITZ', new THREE.Vector3(0, 0, 1))
    .factory('GameEngine', ['$window',
    function($window) {
        var animate = function(game) {
            requestAnimationFrame(function() {
                animate(game);
            });

            game.tick();
            game.render();
        };

        var Engine = Class.extend({
            init: function() {

            },
            start: function(el) {
                this.scene = new THREE.Scene();

                this.octree = new THREE.Octree();

                this.camera = new THREE.PerspectiveCamera(75, $window.innerWidth / $window.innerHeight, 0.1, 100000);
                this.camera.position.set(0, 3, 0);

                this.scene.add(this.camera);

                this.clock = new THREE.Clock();

                this.projector = new THREE.Projector();

                this.renderer = new THREE.WebGLRenderer({
                    antialias: false,
                    clearColor: '#000',
                    clearAlpha: 1,
                    maxLights: 20
                });

                this.renderer.setSize($window.innerWidth, $window.innerHeight);
                el.append(this.renderer.domElement);

                animate(this);
            },
            tick: function() {
                var dTime = this.clock.getDelta();

            },
            render: function() {
                this.renderer.render(this.scene, this.camera);
            }
        });

        return Engine;
    }
]);