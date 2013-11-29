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
    .factory('TextureHandler', ['$window',function($window) {

        function loadTexture( path, textureOnly, options) {
          textureOnly = textureOnly || false;
          options = options || {};

          options.seeThrough = options.seeThrough === undefined ? false : options.seeThrough;
          options.opacity = options.opacity === undefined ? 0.5 : options.opacity;
          options.vertexShader = options.vertexShader === undefined ? "vertex" : options.vertexShader;
          options.uvScaleX = options.uvScaleX === undefined ? 1 : options.uvScaleX;
          options.uvScaleY = options.uvScaleY === undefined ? 1 : options.uvScaleY;
          options.transparent = options.transparent === undefined ? false : options.transparent;
          options.alphaTest = options.alphaTest === undefined ? 0.5 : options.alphaTest;
          options.doubleSided = options.doubleSided === undefined ? false : options.doubleSided;
          options.useLighting = options.useLighting === undefined ? false : options.useLighting;
          options.spriteMaterial = options.spriteMaterial === undefined ? false : options.spriteMaterial;


          var image = new Image();



          image.src = path;



          var texture  = new THREE.Texture( image,
            new THREE.UVMapping(),
            THREE.RepeatWrapping,
            THREE.RepeatWrapping,
            THREE.NearestFilter,
            THREE.NearestMipMapLinearFilter );


          image.onload = function () {
            texture.needsUpdate = true;
          };


          if ( textureOnly ) return texture;

          //return new THREE.MeshBasicMaterial({color:Math.random() * 0xffffff});


          if ( options.useLighting ) {

            var config = {
              map : texture
            };

            if ( options.transparent ) config.transparent = options.transparent;

            // var mat = new THREE.MeshPhongMaterial( config );
            // mat.perPixel = true;
            var mat = new THREE.MeshLambertMaterial( config );

            return mat;

          }

          if ( options.spriteMaterial ) {

            var mat = new THREE.SpriteMaterial({
                  color: ColorEnum.WHITE,
                  map: texture,
                  useScreenCoordinates: false,
                  transparent: true
                  //alphaTest: 0.5
              });

            return mat;

          }

          //        return new THREE.MeshLambertMaterial( {
          //            map: texture,
          //            ambient: 0xffffff
          //        } );

          var uniforms = {
            uvScale : {
              type: 'v2',
              value: new THREE.Vector2(options.uvScaleX,options.uvScaleY)
            },
            texture1 : {
              type: 't',
              //                value: 0,
              //                texture:texture
              // r50->r51
              value:texture
            }
          };

          if ( options.seeThrough ) {
            uniforms.opacity = {
              type: 'f',
              value: options.opacity
            };
          }

          if ( options.vertexShader == "vertex_world" ) {
            uniforms.camPos = {
              type: 'v3',
              value: ironbane.camera.position.clone()
            };
          }

          return new THREE.ShaderMaterial({
            uniforms : uniforms,
            vertexShader : $('#'+options.vertexShader).text(),
            fragmentShader : $("#"+(options.seeThrough ? 'fragment_opacity' : 'fragment_fullbright')).text(),
            transparent:options.transparent,
            alphaTest: options.alphaTest,
            side: options.doubleSided ? THREE.DoubleSide : THREE.FrontSide
          });

        }

        function TextureHandler(){
          this.textures = {};
          console.log("making texturehandler");
          
        };

        TextureHandler.prototype.getTexture = function (path, textureOnly, options) {
              var key = path;
              key += ","+textureOnly;
              for(var o in options) key += ","+options[o];

              if ( !this.textures[key] ) {
                  this.textures[key] = loadTexture(path, textureOnly, options);
              }

              return this.textures[key];
          };
          TextureHandler.prototype.GetFreshTexture = function (path, textureOnly, options) {
              return loadTexture(path, textureOnly, options);
          };

        var textureHandler =  new TextureHandler();
        //global hack for non angular classes
        $window.textureHandler = textureHandler;
        return textureHandler;
    }]);