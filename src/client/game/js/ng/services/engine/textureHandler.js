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
IronbaneApp
    .service('TextureHandler', ['$log', '$window',
        function($log, $window) {
            var _textureCache = {};

            function loadTexture(path, textureOnly, options) {
                textureOnly = !! textureOnly;
                options = options || {};

                options.seeThrough = options.seeThrough === undefined ? false : options.seeThrough;
                options.opacity = options.opacity === undefined ? 0.5 : options.opacity;
                options.vertexShader = options.vertexShader === undefined ? 'vertex' : options.vertexShader;
                options.uvScaleX = options.uvScaleX === undefined ? 1 : options.uvScaleX;
                options.uvScaleY = options.uvScaleY === undefined ? 1 : options.uvScaleY;
                options.transparent = options.transparent === undefined ? false : options.transparent;
                options.alphaTest = options.alphaTest === undefined ? 0.5 : options.alphaTest;
                options.doubleSided = options.doubleSided === undefined ? false : options.doubleSided;
                options.useLighting = options.useLighting === undefined ? false : options.useLighting;
                options.spriteMaterial = options.spriteMaterial === undefined ? false : options.spriteMaterial;

                var image = new $window.Image();
                image.src = path;

                // todo: wrap three in angular module
                var texture = new $window.THREE.Texture(image,
                    new $window.THREE.UVMapping(),
                    $window.THREE.RepeatWrapping,
                    $window.THREE.RepeatWrapping,
                    $window.THREE.NearestFilter,
                    $window.THREE.NearestMipMapLinearFilter);

                image.onload = function() {
                    texture.needsUpdate = true;
                };

                if (textureOnly) {
                    return texture;
                }

                var mat;

                if (options.useLighting) {
                    var config = {
                        map: texture
                    };

                    if (options.transparent) {
                        config.transparent = options.transparent;
                    }

                    mat = new $window.THREE.MeshLambertMaterial(config);

                    return mat;
                }

                if (options.spriteMaterial) {
                    mat = new $window.THREE.SpriteMaterial({
                        color: $window.ColorEnum.WHITE,
                        map: texture,
                        useScreenCoordinates: false,
                        transparent: true
                        //alphaTest: 0.5
                    });

                    return mat;
                }

                var uniforms = {
                    uvScale: {
                        type: 'v2',
                        value: new $window.THREE.Vector2(options.uvScaleX, options.uvScaleY)
                    },
                    texture1: {
                        type: 't',
                        value: texture
                    }
                };

                if (options.seeThrough) {
                    uniforms.opacity = {
                        type: 'f',
                        value: options.opacity
                    };
                }

                if (options.vertexShader === 'vertex_world') {
                    uniforms.camPos = {
                        type: 'v3',
                        value: ironbane.camera.position.clone()
                    };
                }

                return new $window.THREE.ShaderMaterial({
                    uniforms: uniforms,
                    vertexShader: $('#' + options.vertexShader).text(),
                    fragmentShader: $('#' + (options.seeThrough ? 'fragment_opacity' : 'fragment_fullbright')).text(),
                    transparent: options.transparent,
                    alphaTest: options.alphaTest,
                    side: options.doubleSided ? $window.THREE.DoubleSide : $window.THREE.FrontSide
                });
            }

            this.getTexture = function(path, textureOnly, options) {
                var key = path;
                key += ',' + textureOnly;
                for (var o in options) {
                    key += ',' + options[o];
                }

                if (!_textureCache[key]) {
                    _textureCache[key] = loadTexture(path, textureOnly, options);
                }

                return _textureCache[key];
            };

            this.GetFreshTexture = function(path, textureOnly, options) {
                return loadTexture(path, textureOnly, options);
            };
        }
    ]);