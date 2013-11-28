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

var meshPath = 'images/meshes/';
var LIGHT_VISIBILITY_DISTANCE_THRESHOLD = 2500;

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

    this.octree = new THREE.Octree({undeferred: true});


    // Going to use children to add special properties/effects to meshes
    // A bit hacky, but it's better than creating a ton of classes for each
    // model name. We're just going to check for the model name and do
    // what's necessary.
    this.children = [];

    this.object3D.setRotationFromEuler(this.rotation);
    this.object3D.rotation.copy(this.rotation);
    //this.object3D.rotation.setFromQuaternion(this.object3D.quaternion);
    //this.object3D.rotation.Round()




  },
  Decorate: function() {
     this.particleEmitters = [];

     var useCollision = true;

    // Initialize events
    switch (this.meshData.name) {
      case "Dungeon Light Small":
        this.timers.flickerTime = 0.0;

        var pointLight = new THREE.PointLight(0xdf724c, 1, 20);
        // var pointLight = new THREE.PointLight(0xff0000, 1, 10);
        pointLight.position.set(0, 0, 0);
        this.lightsToMaintain.push(pointLight);

        if ( !le("globalEnable") ) {
          useCollision = false;
          this.mesh.visible = false;
        }

        break;
      case "Dungeon Light Big":
        this.timers.flickerTime = 0.0;

        if ( !le("globalEnable") ) {
          useCollision = false;
          this.mesh.visible = false;
        }

        var pointLight = new THREE.PointLight(0xdf724c, 1, 40);
        // var pointLight = new THREE.PointLight(0xff0000, 1, 10);
        pointLight.position.set(0, 0, 0);
        this.lightsToMaintain.push(pointLight);
        break;
      case "Dungeon Light Huge":
        this.timers.flickerTime = 0.0;

        if ( !le("globalEnable") ) {
          useCollision = false;
          this.mesh.visible = false;
        }

        var pointLight = new THREE.PointLight(0xdf724c, 1, 100);
        // var pointLight = new THREE.PointLight(0xff0000, 1, 10);
        pointLight.position.set(0, 0, 0);
        this.lightsToMaintain.push(pointLight);
        break;
      case "Lantern 1":
        this.particleEmitters.push({
          particle: ParticleTypeEnum.FIRESMALL,
          data: {
            followUnit:this,
            spawnOffset: new THREE.Vector3(0, 1.0, 0)
          }
        });
        break;
      case "Torch":
        this.particleEmitters.push({
          particle: ParticleTypeEnum.FIRESMALL,
          data: {
            followUnit:this,
            spawnOffset: new THREE.Vector3(0.0, 1.0, 0.5)
          }
        });
        break;
      case "Campfire":
        this.particleEmitters.push({
          particle: ParticleTypeEnum.FIREMEDIUM,
          data: {
            followUnit:this,
            spawnOffset: new THREE.Vector3(0, 1.0, 0)
          }
        });
        break;
      case "Fountain":
        this.particleEmitters.push({
          particle: ParticleTypeEnum.FOUNTAINSIDE,
          data: {
            followUnit:this,
            spawnOffset: new THREE.Vector3(0.0, 1.5, 0.5)
          }
        });
        break;
    }

      var me = this;


    _.each(this.lightsToMaintain, function(light) {

      light.startColor = light.color;
      light.startIntensity = light.intensity;
      light.startDistance = light.distance;

      me.object3D.add(light);

    }, this);

    _.each(this.particleEmitters, function(emitter) {
            this.particleEmittersToMaintain.push(
              particleHandler.Add(emitter.particle,
                emitter.data));
    }, this);

    if ( useCollision ) {
      var me = this;

      this.mesh.traverse( function ( object ) {
        me.octree.add( object, {useFaces:true} );
      });
    }

  },
  UpdateLighting: function() {
      var cell = terrainHandler.GetCellByWorldPosition(this.position);

      setTimeout(function() {

          if ( cell.modelMesh ) {
            // TODO am I allowed to update them like this? Are they references?
            // Or do I need to dig into the mesh and update the facematerial?
            _.each(cell.totalMaterials, function(material) {
              material.needsUpdate = true;
            });
          }


          _.each(cell.objects, function(obj) {

              if ( obj.mesh ) {

                if ( obj.mesh.material instanceof THREE.MeshFaceMaterial ) {
                  _.each(obj.mesh.material.materials, function(material) {
                    material.needsUpdate = true;
                  });
                }
                else {
                  obj.mesh.material.needsUpdate = true;
                }
                // TODO I only updated the facematerial, is that enough?

              }

          }, cell);



          _.each(terrainHandler.skybox.terrainMesh.material.materials, function(material) {
            material.needsUpdate = true;
          });


      }, 1);
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
    //this.texture = textureHandler.getTexture( texture, true);


    var me = this;

    ironbane.meshHandler.Load(model, function(geometry, jsonMaterials) {
      me.BuildMesh( geometry, jsonMaterials );
    }, true);

    //meshHandler.GetMesh(this.param, this);




    this._super();



  },
  BuildMesh: function(geometry, jsonMaterials) {

    var result = ironbane.meshHandler.ProcessMesh({
      geometry: geometry,
      jsonMaterials: jsonMaterials,
      // No rotaion passed here! We do things manually to circumvent the raycast bug
      metadata: this.metadata,
      meshData: this.meshData
    });

    this.mesh = new THREE.Mesh( result.geometry, new THREE.MeshFaceMaterial(result.materials) );
    this.mesh.unit = this;

    if ( !(this instanceof DynamicMesh) ) {
      this.mesh.castShadow = true;
    }


    this.mesh.geometry.dynamic = true;

    this.mesh.geometry.computeBoundingBox();
    this.boundingBox = this.mesh.geometry.boundingBox;
    this.boundingBox.size = this.boundingBox.max.clone().sub(this.boundingBox.min);

    this.mesh.geometry.computeBoundingSphere();
    this.boundingSphere = this.mesh.geometry.boundingSphere;

    _.each(this.mesh.material.materials, function(mat) {
      mat.side = THREE.DoubleSide;
    });

    // Because of a bug with the raycaster, rotations are not taken into account
    // when casting rays. We need to rotate the geometry of the mesh instead.
    // We therefore need the starting rotations of all the vertices here
    // so we can do a manual rotation for each vertex later in Tick()
    this.startVertices = [];

    _.each(this.mesh.geometry.vertices, function(vertex) {
      this.startVertices.push(vertex.clone());
    }, this);


    ironbane.scene.add(this.mesh);

    this.Decorate();

    this.UpdateLighting();

    // Rotate atleast once to set things up
    this.changeRotationNextTick = true;

  },
  UpdateRotationByVertices: function() {

    if ( !this.mesh || !this.changeRotationNextTick ) return;

    this.mesh.geometry.dynamic = true;
    this.mesh.geometry.verticesNeedUpdate = true;

    for (var i = 0; i < this.mesh.geometry.vertices.length; i++) {
      this.mesh.geometry.vertices[i].copy(this.startVertices[i]);
    }

    var me = this;
    _.each(this.mesh.geometry.vertices, function(vertex) {
      vertex.applyEuler(me.object3D.rotation);
    });

    // this.mesh.geometry.computeCentroids();
    // this.mesh.geometry.computeFaceNormals();
    // this.mesh.geometry.computeVertexNormals();

    this.mesh.geometry.computeBoundingBox();
    this.boundingBox = this.mesh.geometry.boundingBox;
    this.boundingBox.size = this.boundingBox.max.clone().sub(this.boundingBox.min);


    this.changeRotationNextTick = false;

  },
  tick: function(dTime) {

    // Adjust to the time of the day
    _.each(this.lightsToMaintain, function(light) {
        light.distance = light.startDistance;
    });

    switch (this.meshData.name) {
      case "Dungeon Light Small":
      case "Dungeon Light Big":
      case "Dungeon Light Huge":


        if ( this.timers.flickerTime <= 0 ) {
          // this.lightsToMaintain[0].color.setRGB(1, getRandomFloat(0.5, 0.8), getRandomFloat(0.5, 0.8));
          this.timers.flickerTime = getRandomFloat(0.1, 0.2);
          this.lightsToMaintain[0].intensity =
            this.lightsToMaintain[0].startIntensity + getRandomFloat(-0.1, 0.1);
        }

        break;
      case "Item Billboard":
        if ( this.mesh ) {
            this.mesh.LookFlatAt(ironbane.camera.position, true);
        }
        break;
    }

    var p = terrainHandler.GetReferenceLocationNoClone();

    // Disable lights if they are too far
    _.each(this.lightsToMaintain, function(light) {

      //if ( !ironbane.player.InRangeOfPosition(light.parent.position, 30) ) {
      if ( light.parent && VectorDistanceSq(p, light.parent.position) > LIGHT_VISIBILITY_DISTANCE_THRESHOLD ) {
        light.visible = false;
      }
      else {
        light.visible = true;
      }

    }, this);


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

    this._super(dTime);


  }
});


