/*global angular, THREE */
angular.module('Ironbane')
    .factory('Snow', ['TextureHandler',
        function(TextureHandler) {
            function rand(v) {
                return (v * (Math.random() - 0.5));
            }

            var Snow = function(scene) {
                var particleSystemHeight = 100;

                var sprite1 = TextureHandler.getTexture('images/textures/snowflake.png', true);

                var numParticles = 5000,
                    width = 200,
                    height = particleSystemHeight,
                    depth = 200,
                    parameters = {
                        color: 0xFFFFFF,
                        height: particleSystemHeight,
                        radiusX: 2.5,
                        radiusZ: 2.5,
                        size: 100,
                        scale: 4.0,
                        opacity: 0.4,
                        speedH: 1.0,
                        speedV: 1.0
                    },
                    systemGeometry = new THREE.Geometry(),
                    systemMaterial = new THREE.ShaderMaterial({
                        uniforms: {
                            color: {
                                type: 'c',
                                value: new THREE.Color(parameters.color)
                            },
                            height: {
                                type: 'f',
                                value: parameters.height
                            },
                            elapsedTime: {
                                type: 'f',
                                value: 0
                            },
                            radiusX: {
                                type: 'f',
                                value: parameters.radiusX
                            },
                            radiusZ: {
                                type: 'f',
                                value: parameters.radiusZ
                            },
                            size: {
                                type: 'f',
                                value: parameters.size
                            },
                            scale: {
                                type: 'f',
                                value: parameters.scale
                            },
                            opacity: {
                                type: 'f',
                                value: parameters.opacity
                            },
                            texture: {
                                type: 't',
                                value: sprite1
                            },
                            speedH: {
                                type: 'f',
                                value: parameters.speedH
                            },
                            speedV: {
                                type: 'f',
                                value: parameters.speedV
                            }
                        },
                        vertexShader: document.getElementById('snow_vs').textContent,
                        fragmentShader: document.getElementById('snow_fs').textContent,
                        blending: THREE.AdditiveBlending,
                        transparent: true,
                        depthTest: false
                    });

                for (var i = 0; i < numParticles; i++) {
                    var vertex = new THREE.Vector3(
                        rand(width),
                        Math.random() * height,
                        rand(depth)
                    );

                    systemGeometry.vertices.push(vertex);
                }

                this.particleSystem = new THREE.ParticleSystem(systemGeometry, systemMaterial);
                // this.particleSystem.position.y = -height / 2;

                scene.add(this.particleSystem);
            };

            Snow.prototype.tick = function(elapsedTime) {

                var refPos = terrainHandler.GetReferenceLocationNoClone();

                this.particleSystem.material.uniforms.elapsedTime.value = elapsedTime * 10;
                this.particleSystem.position.x = refPos.x;
                this.particleSystem.position.z = refPos.z;
                this.particleSystem.position.y = refPos.y - (ironbane.player ? 5 : 20);

                this.particleSystem.position.x = Math.round(this.particleSystem.position.x/100)*100;
                this.particleSystem.position.z = Math.round(this.particleSystem.position.z/100)*100;

                if ( getZoneConfig("skyboxShader") === "world" ) {
                    if ( ironbane.player ) {
                        this.particleSystem.visible = !ironbane.player.isUnderneathAnObstacle;
                    }
                    else {
                        this.particleSystem.visible = true;
                    }
                }
                else {
                    this.particleSystem.visible = false;
                }

            };

            return Snow;
        }
    ]);