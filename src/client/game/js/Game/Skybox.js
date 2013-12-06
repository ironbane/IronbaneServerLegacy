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

var skyboxPath = 'images/skybox/';

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
      fragmentShader : $('#fragment_skybox_'+getZoneConfig("skyboxShader")).text()
    });

    material.side = THREE.BackSide;

    this.skyboxMesh = new THREE.Mesh(geometry, material);

    this.terrainOctree = new THREE.Octree({undeferred: true});

    ironbane.scene.add(this.skyboxMesh);

    // Add a sun
    geometry = new THREE.PlaneGeometry(600, 600, 1, 1);
    this.sunMesh = new THREE.Mesh(geometry, ironbane.textureHandler.getTexture('images/misc/sun.png', false, {
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
    this.ambientLight = new THREE.AmbientLight( 0x333333 );
    ironbane.scene.add( this.ambientLight );

    this.sunLight = new THREE.DirectionalLight( 0xaaaaaa );
    ironbane.scene.add( this.sunLight );

    this.moonLight = new THREE.DirectionalLight( 0xcccccc );
    ironbane.scene.add( this.moonLight );
    // Add terrain
    //if ( zones[terrainHandler.zone]['type'] == ZoneTypeEnum.WORLD ) {
      var model = skyboxPath + terrainHandler.zone+".js";
      //this.texture = textureHandler.getTexture( texture, true);

      var jsonLoader = new THREE.JSONLoader();
      (function(skybox){
        jsonLoader.load( model, function( geometry, jsonMaterials ) {
          skybox.BuildMesh( geometry, jsonMaterials );
        }, null);
      })(this);

    //}

    this.isLoaded = false;

    this._super();
  },
  BuildMesh: function(geometry, jsonMaterials) {

    var result = ironbane.meshHandler.ProcessMesh({
      geometry: geometry,
      jsonMaterials: jsonMaterials
    });

    //THREE.GeometryUtils.triangulateQuads(geometry);

    this.terrainMesh = new THREE.Mesh( result.geometry, new THREE.MeshFaceMaterial(result.materials) );
    this.terrainMesh.receiveShadow = true;

    ironbane.scene.add(this.terrainMesh);

    this.terrainOctree.add( this.terrainMesh, {useFaces:true} );

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
    if ( this.sunLight ) {
      ironbane.scene.remove(this.sunLight);
      releaseMesh(this.sunLight);
    }

    if ( this.moonLight ) {
      ironbane.scene.remove(this.moonLight);
      releaseMesh(this.moonLight);
    }

    this.isLoaded = false;
  },
  tick: function(dTime) {

    var p = terrainHandler.GetReferenceLocationNoClone();

    this.skyboxMesh.position.copy(p);
    this.skyboxMesh.position.y = 0;

    this.sunLight.position.copy( this.sunVector.clone().multiplyScalar(450) );
    this.sunLight.target.position.copy( this.sunVector.clone().multiplyScalar(-450) );

    this.moonLight.position.y = 450;
    this.moonLight.target.position.y = -450;

    ironbane.shadowLight.position.copy( new THREE.Vector3(0, 100, 0) );
    ironbane.shadowLight.target.position.copy( new THREE.Vector3(0, -100, 0) );

    var time = (new Date()).getTime();
    var param = (((time/1000.0))* 3.6 * 100 / dayTime)%360;

    if ( le("chSunOffset") ) {
      param += levelEditor.editorGUI.chSunOffset;
    }

    if ( this.sunMesh ) {
      var rotationMatrix = new THREE.Matrix4();
      rotationMatrix.makeRotationFromEuler(new THREE.Euler((param).ToRadians(), (-30).ToRadians(), 0));


      if ( (showEditor && levelEditor.editorGUI.chForceDay)
        || getZoneConfig("lightSystem") === LightSystemEnum.DAYONLY ) {
        this.sunVector.set(0,1,0);
      }
      else if ( (showEditor && levelEditor.editorGUI.chForceNight)
        || getZoneConfig("lightSystem") === LightSystemEnum.NIGHTONLY
        || getZoneConfig("lightSystem") === LightSystemEnum.DUNGEON ) {
        this.sunVector.set(0,-1,0);
      }
      else {
        this.sunVector.set(0,0,1);
        this.sunVector = this.sunVector.applyMatrix4(rotationMatrix);
      }

      this.skyboxMesh.material.uniforms.vSun.value.copy(this.sunVector);

      var sunDistance = 1950;

      this.sunMesh.position.copy(p.clone().add(this.sunVector.clone().multiplyScalar(sunDistance)));


      this.sunMesh.LookFlatAt(p);

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
          alr += 1.0-mod;
        }
        else {
          alr += 1.0+mod;
        }
      }

      alr = alr.clamp(0,1);

      alg = alg.clamp(0,1);
      alb = alb.clamp(0,1);



      if ( getZoneConfig("lightSystem") === LightSystemEnum.DUNGEON ) {
        this.ambientLight.color.setRGB(0.2, 0.2, 0.3);
        this.sunLight.color.setRGB( 0.0, 0.0, 0.0 );
        this.moonLight.color.setRGB(0.2, 0.2, 0.3);
      }
      else {
        this.sunLight.color.setRGB( str + (alr * 0.6), stg + (alg * 0.6), stb  + (alb * 0.6));

        var moonFactor = al;
        if ( moonFactor > 0 ) moonFactor = 0;
        moonFactor *= -1;

        var moonFactorReverse = 1 - moonFactor;

        this.ambientLight.color.setRGB( 0.4 * moonFactorReverse + 0.2 * moonFactor, 0.4 * moonFactorReverse + 0.2 * moonFactor, 0.4 * moonFactorReverse  + 0.2 * moonFactor);

        // Night
        this.moonLight.color.setRGB(0.2 * moonFactor, 0.2 * moonFactor, 0.9 * moonFactor);
      }


    }

    this._super(dTime);
  }
});
