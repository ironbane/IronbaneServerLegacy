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
    .constant('DAY_TIME', 60 * 15)
    .factory('World', ['$log', '$q', 'Shader', 'VECTOR_UNITY', 'DAY_TIME',
    function($log, $q, Shader, VECTOR_UNITY, dayTime) {
        var World = Class.extend({
            lights: {},
            sky: {},
            isReady: false,
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

                Shader.get('skybox_world', 'skybox_world')
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
            createSun: function() {
                var world = this,
                    deferred = $q.defer();

                THREE.ImageUtils.loadTexture('/game/data/images/misc/sun.png', new THREE.UVMapping(), function(texture) {
                    Shader.get('vertex', 'full_bright')
                        .then(function(shaders) {
                            var uniforms = {
                                uvScale: {
                                    type: 'v2',
                                    value: new THREE.Vector2(1, 1)
                                },
                                texture1: {
                                    type: 't',
                                    value: texture
                                }
                            };

                            var material = new THREE.ShaderMaterial({
                                uniforms: uniforms,
                                vertexShader: shaders.vertex,
                                fragmentShader: shaders.fragment,
                                transparent: true,
                                alphaTest: 0.01,
                                side: THREE.DoubleSide
                            });
                            var geometry = new THREE.PlaneGeometry(600, 600, 1, 1);

                            world.sun = new THREE.Mesh(geometry, material);

                            deferred.resolve(world.sun);
                        });
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

                $q.all([$q.when(this.setupLights()), this.createSkySphere(), this.createSun()])
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
                        scene.add(world.sun);
                        scene.add(world.lights.ambient);
                        scene.add(world.lights.directional);
                        scene.add(world.lights.shadow);
                        //scene.add(world.terrain);

                        world.isReady = true;
                    });
            },
            tick: function(dTime) {
                if(!this.isReady) {
                    return;
                }

                // was previewLocation for now...
                var p = new THREE.Vector3(0, 10, 0);

                this.sky.mesh.position.copy(p);
                this.sky.mesh.position.y = 0;

                //$log.log('lights', this.lights);

                this.lights.directional.position.copy(this.sky.sunVector.clone().multiplyScalar(450));

                this.lights.directional.target.position.copy(this.sky.sunVector.clone().multiplyScalar(-450));

                this.lights.shadow.position.copy(new THREE.Vector3(0, 100, 0));
                this.lights.shadow.target.position.copy(new THREE.Vector3(0, -100, 0));

                var time = Date.now();
                var param = (((time / 1000.0)) * 3.6 * 100 / dayTime) % 360;

                if (this.sun) {
                    var rotationMatrix = new THREE.Matrix4();
                    rotationMatrix.makeRotationFromEuler(new THREE.Vector3(THREE.Math.degToRad(param), THREE.Math.degToRad(-30), 0));

                    this.sky.sunVector.set(0, 0, 1);
                    this.sky.sunVector = this.sky.sunVector.applyProjection(rotationMatrix);

                    this.sky.mesh.material.uniforms.vSun.value.copy(this.sky.sunVector);

                    var sunDistance = 1950;
                    this.sun.position.copy(p.clone().add(this.sky.sunVector.clone().multiplyScalar(sunDistance)));
                    this.sun.lookAt(p);

                    var al = this.sun.position.y / sunDistance;

                    var alr = al;
                    var alg = al;
                    var alb = al;

                    var str = 0;
                    var stg = 0;
                    var stb = 0;

                    if (alr > -0.3 && alr < 0.3) {
                        var mod = alr / 0.3;
                        if (mod > 0) {
                            alr += 1.0 - mod;
                        } else {
                            alr += 1.0 + mod;
                        }
                    }

                    alr = THREE.Math.clamp(alr, 0, 1);
                    alg = THREE.Math.clamp(alr, 0, 1);
                    alb = THREE.Math.clamp(alr, 0, 1);

                    this.lights.ambient.color.setRGB(0.4, 0.4, 0.4);
                    this.lights.directional.color.setRGB(str + (alr * 0.6), stg + (alg * 0.6), stb + (alb * 0.6));
                }
            }
        });

        return World;
    }
]);