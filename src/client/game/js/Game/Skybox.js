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

var skyboxPath = 'plugins/game/images/skybox/';

var Skybox = PhysicsObject.extend({
  Init: function(onReady) {

    var p = terrainHandler.GetReferenceLocation();

    this._super(p);

    this.onReady = onReady;

    this.sunVector = new THREE.Vector3(0, 1, 0);

    var size = 3000;

    var geometry = new THREE.SphereGeometry(size);

    var uniforms = {
      vSun : {
        type: 'v3',
        value: this.sunVector
      }
    };

    var material = new THREE.ShaderMaterial({
      uniforms : uniforms,
      vertexShader : $('#vertex_skybox').text(),
      fragmentShader : $('#fragment_skybox_'+GetZoneConfig("skyboxShader")).text()
    });

    material.side = THREE.BackSide;

    this.skyboxMesh = new THREE.Mesh(geometry, material);

    this.terrainOctree = new THREE.Octree();

    ironbane.scene.add(this.skyboxMesh);

    // Add a sun
    geometry = new THREE.PlaneGeometry(600, 600, 1, 1);
    this.sunMesh = new THREE.Mesh(geometry, textureHandler.GetTexture('plugins/game/images/misc/sun.png', false, {
      transparent:true,
      alphaTest:0.01
    }));
    this.sunMesh.material.side = THREE.DoubleSide
    ;
    ironbane.scene.add(this.sunMesh);

    if ( zones[terrainHandler.zone].type == ZoneTypeEnum.DUNGEON ) {
      this.sunMesh.visible = false;
    }

    // Add an ambient light
    this.ambientLight = new THREE.AmbientLight( 0x444444 );
    ironbane.scene.add( this.ambientLight );

    this.directionalLight = new THREE.DirectionalLight( 0xcccccc );
    ironbane.scene.add( this.directionalLight );

    this.shadowLight = new THREE.DirectionalLight( 0x000000 );
    this.shadowLight.onlyShadow = true;
    this.shadowLight.shadowMapWidth = 2048;
    this.shadowLight.shadowMapHeight = 2048;
    this.shadowLight.shadowCameraNear		= 5.1;
    this.shadowLight.castShadow		= true;
    this.shadowLight.shadowDarkness		= 0.3;
    ironbane.scene.add( this.shadowLight );

    // Add terrain
    //if ( zones[terrainHandler.zone]['type'] == ZoneTypeEnum.WORLD ) {
      var model = skyboxPath + terrainHandler.zone+".js";
      //this.texture = textureHandler.GetTexture( texture, true);

      var jsonLoader = new THREE.JSONLoader();
      (function(skybox){
        jsonLoader.load( model, function( geometry ) {
          skybox.BuildMesh( geometry );
        }, null, 300);
      })(this);

    //}

    this.isLoaded = false;

    this._super();
  },
  BuildMesh: function(geometry) {

    // Only push materials that are actually inside the materials
    var textures = [];

    // Only push materials that are actually inside the materials
    _.each(geometry.jsonMaterials, function(material) {

      // Check if there's a map inside the material, and if it contains a sourceFile
      if ( !_.isUndefined(material.mapDiffuse)) {
        // Extract the tile!
        textures.push("images/tiles/"+(material.mapDiffuse.split("."))[0]);
      }
    });

    // Check if there's a map inside the material, and if it contains a sourceFile
    _.each(textures, function(texture) {
      var mat = textureHandler.GetTexture('plugins/game/'+texture + '.png', false, {
        transparent:false,
        alphaTest:0.1,
        useLighting:true
      });
      mat.side = THREE.DoubleSide;
      geometry.materials.push(mat);
    });

    // _.each(geometry.materials, function(m) {
    //   m.wireframe = true;
    // });

    THREE.GeometryUtils.triangulateQuads(geometry);

    geometry.computeCentroids();
    geometry.computeFaceNormals();

    this.terrainMesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
    this.terrainMesh.receiveShadow = true;

    ironbane.scene.add(this.terrainMesh);

    this.terrainOctree.add( this.terrainMesh, true );

    if ( this.onReady ) this.onReady();


    terrainHandler.RebuildOctree();

  },
  Destroy: function() {
    if ( this.skyboxMesh ) {
      ironbane.scene.remove(this.skyboxMesh);
      releaseMesh(this.skyboxMesh);
    }
    if ( this.sunMesh ) {
      ironbane.scene.remove(this.sunMesh);
      releaseMesh(this.sunMesh);
    }
    if ( this.terrainMesh ) {
      this.terrainOctree.remove( this.terrainMesh );
      ironbane.scene.remove(this.terrainMesh);
      releaseMesh(this.terrainMesh);
      terrainHandler.RebuildOctree();
    }
    if ( this.ambientLight ) {
      ironbane.scene.remove(this.ambientLight);
      releaseMesh(this.ambientLight);
    }
    if ( this.directionalLight ) {
      ironbane.scene.remove(this.directionalLight);
      releaseMesh(this.directionalLight);
    }
    if ( this.shadowLight ) {
      ironbane.scene.remove(this.shadowLight);
      releaseMesh(this.shadowLight);
    }

    this.isLoaded = false;
  },
  Tick: function(dTime) {

    var p = terrainHandler.GetReferenceLocationNoClone();

    this.skyboxMesh.position.copy(p);
    this.skyboxMesh.position.y = 0;

    this.directionalLight.position.copy( this.sunVector.clone().multiplyScalar(450) );

    this.directionalLight.target.position.copy( this.sunVector.clone().multiplyScalar(-450) );

    this.shadowLight.position.copy( new THREE.Vector3(0, 100, 0) );
    this.shadowLight.target.position.copy( new THREE.Vector3(0, -100, 0) );

    var time = (new Date()).getTime();
    var param = (((time/1000.0))* 3.6 * 100 / dayTime)%360;

    if ( le("chSunOffset") ) {
      param += levelEditor.editorGUI.chSunOffset;
    }

    if ( this.sunMesh ) {
      var rotationMatrix = new THREE.Matrix4();
      rotationMatrix.setRotationFromEuler(new THREE.Vector3((param).ToRadians(), (-30).ToRadians(), 0));


      if ( showEditor && levelEditor.editorGUI.chForceDay ) {
        this.sunVector.set(0,1,0);
      }
      else if ( (showEditor && levelEditor.editorGUI.chForceNight)
        || zones[terrainHandler.zone]['type'] == ZoneTypeEnum.DUNGEON ) {
        this.sunVector.set(0,-1,0);
      }
      else {
        this.sunVector.set(0,0,1);
        this.sunVector = rotationMatrix.multiplyVector3(this.sunVector);
      }

      this.skyboxMesh.material.uniforms.vSun.value.copy(this.sunVector);

      var sunDistance = 1950;

      this.sunMesh.position.copy(p.clone().addSelf(this.sunVector.clone().multiplyScalar(sunDistance)));


      this.sunMesh.LookAt(p);

      var al = this.sunMesh.position.y/sunDistance;

      var alr = al;
      var alg = al;
      var alb = al;

      var str = 0;
      var stg = 0;
      var stb = 0;

      if ( alr > -0.3 && alr < 0.3 ) {
        var mod = alr / 0.3;
        if ( mod > 0 ) {
          alr += 1.0-mod
        }
        else {
          alr += 1.0+mod;
        }
      }

      alr = alr.clamp(0,1);

      alg = alg.clamp(0,1);
      alb = alb.clamp(0,1);

      this.ambientLight.color.setRGB( 0.4, 0.4, 0.4);
      this.directionalLight.color.setRGB( str + (alr * 0.6), stg + (alg * 0.6), stb  + (alb * 0.6));

    }

    this._super(dTime);
  }
});
