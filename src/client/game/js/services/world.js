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
    .factory('World', ['$log', '$q', 'Shader', 'VECTOR_UNITY',
    function($log, $q, Shader, VECTOR_UNITY) {
        var World = Class.extend({
            lights: {},
            sky: {},
            init: function(settings) {
                angular.copy(settings || {}, this);
            },
            createSkySphere: function() {
                // TODO: move to own class?
                var deferred = $q.defer(),
                    self = this;

                self.sky.sunVector = VECTOR_UNITY.clone();

                var geometry = new THREE.SphereGeometry(3000);
                var uniforms = {
                    vSun: {
                        type: 'v3',
                        value: self.sky.sunVector
                    }
                };

                Shader.get('skybox_world')
                    .then(function(shader) {
                        var material = new THREE.ShaderMaterial({
                            uniforms: uniforms,
                            vertexShader: shader.vertex,
                            fragmentShader: shader.fragment
                        });
                        material.side = THREE.BackSide;

                        self.sky.mesh = new THREE.Mesh(geometry, material);

                        deferred.resolve(self.sky);
                    });

                return deferred.promise;
            },
            setupLights: function() {
                this.lights.ambient = new THREE.AmbientLight(0x444444);

                this.lights.directional = new THREE.DirectionalLight(0xcccccc);

                var shadowLight = new THREE.DirectionalLight(0x000000);
                shadowLight.onlyShadow = true;
                shadowLight.shadowMapWidth = 2048;
                shadowLight.shadowMapHeight = 2048;
                shadowLight.shadowCameraNear = 5.1;
                shadowLight.castShadow = true;
                shadowLight.shadowDarkness = 0.3;
                this.lights.shadow = shadowLight;
            },
            load: function() {
                var deferred = $q.defer();

                $q.all([$q.when(this.setupLights), this.createSkySphere()])
                    .then(function(results) {
                    $log.log('world load success', results);
                    deferred.resolve();
                }, function(err) {
                    $log.error('world load fail', err);
                    deferred.reject(err);
                });

                return deferred.promise;
            },
            addToScene: function(scene) {
                var world = this;

                // make sure we're ready and loaded first...
                return world.load()
                    .then(function() {
                        scene.add(world.sky.mesh);
                        //scene.add(world.sun);
                        scene.add(world.lights.ambient);
                        scene.add(world.lights.directional);
                        scene.add(world.lights.shadow);
                        //scene.add(world.terrain);
                    });
            }
        });

        return World;
    }
]);