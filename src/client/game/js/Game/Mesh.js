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
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var meshPath = 'plugins/game/images/meshes/';

var scaleModifierRightBeforeJSONLoader = 0;

var Mesh = Unit.extend({
  Init: function(position, rotation, id, param, metadata) {

    this.metadata = metadata ? metadata : {};

    this.enableShadow = false;

    this.meshData = this.meshData ? this.meshData : (preMeshes[param] ? preMeshes[param] : null);



    this._super(position, rotation, id, 'Mesh', param);


    this.dynamic = false;
    //        this.targetPosition.x = 1.0;
    //        this.targetPosition.z = 1.0;




    this.enableGravity = false;

    this.collider = null;

    // Used for size calculation
    this.meshHeight = 0.0;

    this.boundingBox = null;
    this.boundingSphere = null;

    this.octree = new THREE.Octree();





    // Going to use children to add special properties/effects to meshes
    // A bit hacky, but it's better than creating a ton of classes for each
    // model name. We're just going to check for the model name and do
    // what's necessary.
    this.children = [];










  },
  Decorate: function() {
     this.particleEmitters = [];


    // Initialize events
    switch (this.meshData.name) {
      case "Lantern 1":

        this.particleEmitters.push({
          particle: ParticleTypeEnum.FIRESMALL,
          data: {
            followUnit:this,
            spawnOffset: new THREE.Vector3(0, 1.0, 0)
          }
        });

        this.flickerTime = 0.0;

        var pointLight = new THREE.PointLight(0xdf724c, 1, 20);
        // var pointLight = new THREE.PointLight(0xff0000, 1, 10);
        pointLight.position.set(0, 1.0, 0);
        this.lightsToMaintain.push(pointLight);

        break;
    }

      var me = this;


    _.each(this.lightsToMaintain, function(light) {


      light.startColor = light.color;
      light.startIntensity = light.intensity;
      light.startDistance = light.distance;

      me.object3D.add(light);


      // Update materials that are nearby:

      // Update cells & objects that are nearby



      _.each(terrainHandler.cells, function(cell) {

        if ( cell.mesh ) {
          _.each(cell.mesh.geometry.materials, function(material) {
            material.needsUpdate = true;
          });
        }


        _.each(cell.objects, function(obj) {

          if ( me.InRangeOfPosition(obj.position, light.distance) ) {
            if ( obj.mesh ) {
              if ( ISDEF(obj.mesh.material.needsUpdate) ) {
                obj.mesh.material.needsUpdate = true;
              }

              if ( ISDEF(obj.mesh.geometry.materials) ) {
                _.each(obj.mesh.geometry.materials, function(material) {
                  material.needsUpdate = true;
                });
              }
            }
          }


        }, cell);


      });




    }, this);


    _.each(this.particleEmitters, function(emitter) {
            this.particleEmittersToMaintain.push(
              particleHandler.Add(emitter.particle,
                emitter.data));
    }, this);


  },
  Destroy: function() {

    // Destroy events
    switch (this.meshData.name) {
      case "Lantern 1":

        break;
    }



    this._super();
  },
  Add: function () {

    //console.warn(this.position.x);


    // Get material
    // TODO: delete errors????
    if ( !this.meshData ) {
      this.meshData = {};
      this.drawNameMesh = true;
      this.name = "MODEL ERROR";

      this.meshData = preMeshes[0];
    }

    var filename = (this.meshData['filename'].split("."))[0]+".js";

    var model = meshPath + filename;
    //this.texture = textureHandler.GetTexture( texture, true);


    (function(unit){
      meshHandler.Load(model, function(geometry) {
        unit.BuildMesh( geometry );
      }, unit.meshData['scale']);
    })(this);
    //meshHandler.GetMesh(this.param, this);




    this._super();



  },
  BuildMesh: function(geometry) {


    // Rotate geometry

    var rotationMatrix = new THREE.Matrix4();
    rotationMatrix.setRotationFromEuler(new THREE.Vector3((this.rotation.x).ToRadians(), (this.rotation.y).ToRadians(), (this.rotation.z).ToRadians()));

    for(var v=0;v<geometry.vertices.length;v++) {
      geometry.vertices[v] = rotationMatrix.multiplyVector3(geometry.vertices[v]);
    }

    geometry.computeCentroids();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    geometry.dynamic = true;

    var tiles = [];
    for(var x=1;x<=10;x++){
      if ( ISDEF(this.metadata["t"+x]) ) {
        tiles.push("tiles/"+this.metadata["t"+x]);
      }
      else if ( ISDEF(this.meshData["t"+x]) ) {
        tiles.push(this.meshData["t"+x]);
      }
      else {
        tiles.push(1);
      }
    }

    var uvscale = [];
    for(var x=1;x<=10;x++){
      if ( ISDEF(this.metadata["ts"+x]) ) {
        uvscale.push(new THREE.Vector2(parseFloat(this.metadata["ts"+x]),parseFloat(this.metadata["ts"+x])));
      }
      else if ( ISDEF(this.meshData["ts"+x]) ) {
        uvscale.push(new THREE.Vector2(parseFloat(this.meshData["ts"+x]),parseFloat(this.meshData["ts"+x])));
      }
      else {
        uvscale.push(new THREE.Vector2(1,1));
      }
    }


    var materials = [];

    // Only push materials that are actually inside the materials
    for (var i=0; i<geometry.jsonMaterials.length; i++) {

      // // Check if there's a map inside the material, and if it contains a sourceFile
      // if ( !_.isUndefined(geometry.jsonMaterials[i]["mapDiffuse"]) && tiles[i] === "tiles/1" ) {
      //   // Extract the tile!
      //   tiles[i] = "tiles/"+(geometry.jsonMaterials[i]["mapDiffuse"].split("."))[0];
      // }

      if ( this.drawNameMesh ) {
        materials.push(textureHandler.GetTexture('plugins/game/images/'+tiles[i] + '.png', false, {
          transparent:true,
          opacity:0.5,
          seeThrough:true,
          alphaTest:0.5,
          uvScaleX:uvscale[i].x,
          uvScaleY:uvscale[i].y
        }));
      }
      else {
        materials.push(textureHandler.GetTexture('plugins/game/images/'+tiles[i] + '.png', false, {
          transparent:this.meshData["transparent"] === 1,
          alphaTest:0.1,
          useLighting:true
        }));
      }

      materials[i].shading = THREE.FlatShading;

    //materials.push(new THREE.MeshBasicMaterial({color:Math.random() * 0xffffff}));

    //materials[i].wireframe = true;
    }

    // De-allocate the old materials
    //        _.each(geometry.materials, function(material) {
    //          material.deallocate();
    //          ironbane.renderer.deallocateMaterial( material );
    //        });

    geometry.materials = materials;






//--------




    this.mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial() );
    this.mesh.unit = this;


    this.mesh.castShadow = true;

    this.mesh.geometry.dynamic = true;


    this.mesh.geometry.computeBoundingBox();
    this.boundingBox = this.mesh.geometry.boundingBox;
    this.boundingBox.size = this.boundingBox.max.clone().subSelf(this.boundingBox.min);

    this.mesh.geometry.computeBoundingSphere();
    this.boundingSphere = this.mesh.geometry.boundingSphere;


    //this.mesh.material.side = THREE.DoubleSide;

    ironbane.scene.add(this.mesh);

    if ( socketHandler.inGame )  {
      (function(unit){
        unit.mesh.traverse( function ( object ) {
          unit.octree.add( object, true );
        } );
      })(this);
    }


    // (function(unit){
    //   setTimeout(function() {
    //     unit.Decorate();
    //   }, 10000);
    // })(this);
    this.Decorate();
  //this.UpdateRotation();
  },
  // OnLoad: function(mesh) {
  //   //this.mesh = mesh;
  //   this.mesh = new THREE.Mesh(mesh.geometry, new THREE.MeshFaceMaterial());
  //   ironbane.scene.add(this.mesh);
  //   this.dynamic = false;
  // },

  // Hacky, currently only used by the previewMesh for the level editor
  UpdateRotationByVertices: function() {
    if ( !this.mesh ) return;


      this.mesh.geometry.dynamic = true;
      this.mesh.geometry.verticesNeedUpdate = true;



    if ( !ISDEF(this.startVertices) ) {
      this.startVertices = [];

      _.each(this.mesh.geometry.vertices, function(vertex) {
        this.startVertices.push(vertex.clone());
      }, this);
    }




    var rotationMatrix = new THREE.Matrix4();
    rotationMatrix.setRotationFromEuler(
      new THREE.Vector3(
        (this.rotation.x).ToRadians(),
        (this.rotation.y).ToRadians(),
        (this.rotation.z).ToRadians()));

    for (var i = 0; i < this.mesh.geometry.vertices.length; i++) {
      this.mesh.geometry.vertices[i].copy(this.startVertices[i]);
    }

    _.each(this.mesh.geometry.vertices, function(vertex) {
      rotationMatrix.multiplyVector3(vertex);
    });




    // this.mesh.geometry.computeCentroids();
    // this.mesh.geometry.computeFaceNormals();
    // this.mesh.geometry.computeVertexNormals();

    this.mesh.geometry.computeBoundingBox();
    this.boundingBox = this.mesh.geometry.boundingBox;
    this.boundingBox.size = this.boundingBox.max.clone().subSelf(this.boundingBox.min);
  },
  UpdateRotation: function() {
    if( this.mesh ) {
      this.mesh.rotation.x = (this.rotation.x).ToRadians();
      this.mesh.rotation.y = (this.rotation.y).ToRadians();
      this.mesh.rotation.z = (this.rotation.z).ToRadians();




    //            this.mesh.geometry.computeCentroids();
    //            this.mesh.geometry.computeFaceNormals();
    //            this.mesh.geometry.computeVertexNormals();
    }



  },
  Tick: function(dTime) {


    // Adjust to the time of the day
    _.each(this.lightsToMaintain, function(light) {
        light.distance = light.startDistance;
    });


    switch (this.meshData.name) {
      case "Lantern 1":

        this.flickerTime -= dTime;

        if ( this.flickerTime <= 0 ) {
          // this.lightsToMaintain[0].color.setRGB(1, getRandomFloat(0.5, 0.8), getRandomFloat(0.5, 0.8));
          this.flickerTime = getRandomFloat(0.1, 0.2);
          this.lightsToMaintain[0].intensity =
            this.lightsToMaintain[0].startIntensity + getRandomFloat(-0.1, 0.1);
        }



        break;
    }


    if ( terrainHandler.skybox ) {
      // Adjust to the time of the day
      _.each(this.lightsToMaintain, function(light) {

        var factor = (terrainHandler.skybox.sunVector.y.clamp(-0.2, 0.2) + 0.2) * 0.5;

        factor *= 5;

        if ( factor >= 1.0) {
          light.distance = 0.0;
        }
        else if ( factor <= 0.0) {
          light.distance *= 1.0;
        }
        else {
          light.distance *= 1.0 - factor;
        }

        light.distance = Math.max(light.distance, light.startDistance * 0.1);

      });
    }



    //        if ( ironbane.player && this.mesh ) {
    //
    //            for(var m in this.mesh.geometry.materials) {
    //                //bm("test");
    //                this.mesh.geometry.materials[m].uniforms.camPos.value = terrainHandler.GetReferenceLocationNoClone();
    //                this.mesh.geometry.materials[m].uniforms.meshPos.value = this.position;
    //                //this.mesh.geometry.materials[m].uniformsList[3][0].value = ironbane.player.position
    //            }
    //        }

    this._super(dTime);


  }
});


