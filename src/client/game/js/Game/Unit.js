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
 * A unit is a PhysicsObject that has a spriteset, always faces the camera and adjusts it's UVs to show a sprite dependant on the camera vs rotation angle
 */

var unitFriction = 3;
var unitMaxSpeed = 5;
var unitMaxSpeedBackwards = 3;
var TEXTURE_SHADOW = 'images/misc/shadow.png';

var sizeScalingSpeed = 2;

var Unit = PhysicsObject.extend({
  Init: function(position, rotation, id, name, param, size) {
    this._super(position);
    this.timers = {};
    // Used for network units
    this.fakeVelocity = new THREE.Vector3();

    // What type is this Unit toing to be?
    //this.type = type;

    this.name = name || 'Unnamed';
    this.id = id;

    if ( !_.isUndefined(this.overrideName) ) this.name = this.overrideName;

    // Used to get the image/mesh
    this.param = param;

    this.rotation = rotation || new THREE.Euler();
    this.speed = 0.0;


    this.enableGravity = this.dynamic;



    this.targetPosition = this.position.clone();
    this.targetRotation = this.rotation.clone();

    // Normal size for units, can be larger for bosses/special units
    this.size = size || 1.0;
    this.targetSize = this.size;

    this.steeringBehaviour = new SteeringBehaviour(this);

    this.mesh = null;
    this.debugMesh = null;
    this.nameMesh = null;
    this.shadowMesh = null;
    this.weaponMesh = null;
    this.weaponOrigin = null;


    this.drawNameMesh = !_.isUndefined(this.drawNameMesh) ? this.drawNameMesh : false;

    this.enableShadow = !_.isUndefined(this.enableShadow) ? this.enableShadow : true;


    this.terrainAngle = 0;


    this.renderOffset = new THREE.Vector3();
    this.renderOffsetMultiplier = 0.0;

    this.visible = true;

    this.timers.waterSplashTimeout = 0.0;
    this.timers.waterSplashSoundTimeout = 0.0;

    this.allowRaycastGround = true;
    this.restrictToGround = true;

    this.isTouchingGround = false;

    this.allowJump = true;

    this.groundNormal = new THREE.Vector3();

    this.particleEmittersToMaintain = [];
    this.lightsToMaintain = [];

    (function(unit){
      setTimeout(function() {
        unit.Add();
      }, 0);
    })(this);

    this.rayOffsetList = [new THREE.Vector3(0.0, 0.5, 0.0)];

    this.rayOffsetListPlayer = [new THREE.Vector3(0.1, 0.5, 0.1),new THREE.Vector3(-0.1, 0.5, -0.1)];



  },
  // Taking into account the current camera position and the unit's rotation, get the appropriate vertical sprite index
  getDirectionSpriteIndex: function() {

    // We need a vector from the unit to the camera
    var uc = ironbane.camera.position.clone();
    uc.sub(this.position);
    var rotrad = this.rotation.y;
    // Rotate vector with our own rotation
    var tx = ((uc.x * Math.cos(rotrad)) - (uc.z * Math.sin(rotrad)));
    var tz = ((uc.x * Math.sin(rotrad)) + (uc.z * Math.cos(rotrad)));
    uc.x = tx;
    uc.z = tz;

    var result = Math.atan2(uc.z, uc.x);

    result += Math.PI;



    while ( result < 0 ) result += (Math.PI*2);
    while ( result > (Math.PI*2) ) result -= (Math.PI*2);

    //console.warn(result);

    //debug.setWatch('atan2 result', result);

    var index = 0;

    if ( result >= 0.39 && result <= 1.17 ) {
      index = 7;
    }
    else if ( result > 1.17 && result <= 1.96 ) {
      index = 6;
    }
    else if ( result > 1.96 && result <= 2.74 ) {
      index = 5;
    }
    else if ( result > 2.74 && result <= 3.53 ) {
      index = 4;
    }
    else if ( result > 3.53 && result <= 4.31 ) {
      index = 3;
    }
    else if ( result > 4.31 && result <= 5.10 ) {
      index = 2;
    }
    else if ( result > 5.10 && result <= 5.89 ) {
      index = 1;
    }
    else {
      index = 0;
    }

    return index;
  },
  Add: function() {

    if ( debugging ) {
      var lineGeo = new THREE.Geometry();
      lineGeo.vertices.push(
        v(0, 0, 0), v(1, 0, 0)
        );
      var lineMat = new THREE.LineBasicMaterial({
        color: 0xff00ff,
        lineWidth: 5
      });
      //var line;
      this.debugMesh = new THREE.Line(lineGeo, lineMat);
      this.debugMesh.type = THREE.Lines;

      ironbane.scene.add(this.debugMesh);

    }

    if (this.drawNameMesh) {
        this.renderNameMesh(this.name);
    }

    this.addShadow();
  },
  isPlayer: function(){
    // This only checks if units are networked players
    // The actual Player class is the one which us used to control the main character
    // on the client. This class will also return true for isPlayer
    // If you want to check for the current player (the character of the client) use isMainPlayer
    return this.id > 0;
  },
  isMainPlayer: function() {
    return ironbane.player === this;
  },
  renderNameMesh: function(name) {

      var unit = this,
          c = document.createElement('canvas'),
          ctx = c.getContext('2d'),
          fillText = name;

      c.width= 400;
      c.height= 50;
      ctx.fillStyle= '#FFFFFF';
      ctx.strokeStyle= '#000000';
      ctx.font = '26pt Arial Black';
      ctx.textAlign = 'center';
      ctx.fillText(fillText, c.width/2, 40);
      ctx.strokeText(fillText, c.width/2, 40);

      var tex = new THREE.Texture(c);
      tex.needsUpdate = true;

      // todo: need to cleanup old texture? can replace data instead?
      if(!unit.nameMesh) {
          var mat = new THREE.MeshBasicMaterial({
              map: tex,
              alphaTest: 0.5
          });
          var scale = 0.01 * this.size;
          mat.side = THREE.DoubleSide;

          unit.nameMesh = new THREE.Mesh(new THREE.PlaneGeometry(c.width*scale, c.height*scale), mat);
          ironbane.scene.add(unit.nameMesh);
      } else {
          unit.nameMesh.material.map = tex;
      }
  },
  addShadow: function() {
    if ( this.enableShadow ) {

      this.shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(this.size, this.size, 1, 1),
        ironbane.textureHandler.getTexture(TEXTURE_SHADOW, false, {
          transparent:true,
          alphaTest:0.1
        }));

      this.shadowMesh.rotation.x = -Math.PI/2;

      ironbane.scene.add(this.shadowMesh);

    }
  },
  fullDestroy: function() {
    ironbane.getUnitList().removeUnit(this);
    this.Destroy();
  },
  Destroy: function() {

    _.each(this.lightsToMaintain, function(light){
      this.object3D.remove(light);
    }, this);

    if ( this.mesh ) {

      var me = this;

      if ( this instanceof Mesh) {
        this.mesh.traverse( function ( object ) {
          me.octree.remove( object );
        } );
      }

      releaseMesh(this.mesh);

      ironbane.scene.remove(this.mesh);

    }

    if ( this.debugMesh ) {
      ironbane.scene.remove(this.debugMesh);
      releaseMesh(this.debugMesh);
    }

    if ( this.nameMesh ) {
      ironbane.scene.remove(this.nameMesh);
      releaseMesh(this.nameMesh);
    }

    if ( this.shadowMesh ) {
      ironbane.scene.remove(this.shadowMesh);
      releaseMesh(this.shadowMesh);
    }

    _.each(this.particleEmittersToMaintain, function(pEmitter) {
      pEmitter.removeNextTick = true;
    });

    this._super();

  },
    displayUVFrame: function(indexH, indexV, numberOfSpritesH, numberOfSpritesV, mirror) {
        if (!this.mesh) {
            return;
        }

        // this method is a "shared" method, todo: factor it locally?
        DisplayUVFrame(this.mesh, indexH, indexV, numberOfSpritesH, numberOfSpritesV, mirror);
    },
  tick: function(dTime) {

    _.each(this.timers, function(value, timer) {
      if(value>0){
        this.timers[timer] -= dTime;
      }
    }, this);


    //move this to Player.js
    if ( this instanceof Player &&
      (!ironbane.player.canMove ||
        terrainHandler.transitionState !== transitionStateEnum.END) ) return;

    this._super(dTime);

    // Automatic scaling
    var sizeMod = sizeScalingSpeed * dTime;

    if ( this.size > this.targetSize+sizeMod ) {
      this.size -= sizeMod;
    }
    else if ( this.size < this.targetSize-sizeMod ) {
      this.size += sizeMod;
    }
    else {
      this.size = this.targetSize;
    }



    if ( ironbane.player && this instanceof Fighter) {
      if ( this.isMainPlayer() ) {
        this.unitStandingOn = null;
      }
      else {
        if ( !this.inRangeOfUnit(ironbane.player, 15) ) {
          this.allowRaycastGround = false;
          this.enableGravity = false;
        }
        else {
          this.enableGravity = true;
        }
      }
    }

    if ( this.dynamic
      && socketHandler.readyToReceiveUnits
      && !(this instanceof Mesh)) {


      // For all server-controlled units, simulate their actual position by walking to their targetPosition
      // instead of laggy teleports all the time
      if ( !(this.isMainPlayer()) && !(this instanceof Projectile) ) {

        if ( !(le("mpTransformMode")
            && ironbane.newLevelEditor
            && ironbane.newLevelEditor.selectedObject
            && ironbane.newLevelEditor.selectedObject.unit === this )) {
            this.object3D.position.x = this.object3D.position.x.Lerp(this.targetPosition.x, dTime*2);
            this.object3D.position.z = this.object3D.position.z.Lerp(this.targetPosition.z, dTime*2);

            if ( !this.enableGravity ) {
              this.object3D.position.y = this.object3D.position.y.Lerp(this.targetPosition.y, dTime*2);
            }
        }


      }

      this.rotateTowardsTargetPosition(dTime);

      var cp = WorldToCellCoordinates(this.position.x, this.position.z, cellSize);

      var cellStandingOn = !_.isUndefined(terrainHandler.cells[cp.x+"-"+cp.z]) ? terrainHandler.cells[cp.x+"-"+cp.z] : null;

      if ( this.enableGravity ) {

        var grav = gravity.clone();

        if ( getZoneConfig("enableFluid") && this.position.y < getZoneConfig('fluidLevel')-0.5 ) {
          grav.multiplyScalar(-1);
          if ( this.velocity.y < -0.5 ) {
            this.velocity.add(new THREE.Vector3(0, dTime*15, 0));
            if ( this.timers.waterSplashSoundTimeout >= 0 ) this.timers.waterSplashSoundTimeout -= dTime;
            else {
              this.waterSplashSoundTimeout = 0.5;
              soundHandler.Play("splash", this.position);
            }
          }
        }
        if ( getZoneConfig("enableFluid") && this.position.y < getZoneConfig('fluidLevel') ) {
          if ( this.timers.waterSplashTimeout >= 0 ) this.timers.waterSplashTimeout -= dTime;
          else {
            this.waterSplashTimeout = 0.1;
            particleHandler.Add(getZoneConfig("fluidType") === "lava" ? ParticleTypeEnum.LAVABURN : ParticleTypeEnum.SPLASH, {
              position:this.position.clone()
            });
          }
        }

        if ( !(this instanceof Fighter && this.timers.lastJumpTimer > 0 && this.position.y < getZoneConfig('fluidLevel')) ) {
          if ( !getZoneConfig("enableFluid") || this.position.y < getZoneConfig('fluidLevel')-0.6 || this.position.y > getZoneConfig('fluidLevel')-0.4 ) {
            this.velocity.add(grav.clone().multiplyScalar(dTime));
          }
          else {
            this.velocity.lerp(new THREE.Vector3(this.velocity.x, 0, this.velocity.z), dTime*2);
            soundHandler.Play("stepWater", this.position);
          }
        }
      }
      // Used to align the shadow cast on the ground
      var raycastNormal = null;
      var raycastGroundPosition = null;
      this.isTouchingGround = false;
      if ( this.allowRaycastGround && cellStandingOn ) {
        // Handle collisions

        // Collide against meshes sideways
        // Only for the player to reduce performance
        // NPC's use waypoints and other players should do their own local collision detection
        // Will make cheaters easier to spot
        if ( (this.isMainPlayer()) || (this instanceof Projectile && !this.impactDone) ) {
          var tVel = this.velocity.clone();
          tVel.y = 0;
          tVel.normalize();

          var ray = new THREE.Raycaster( this.position.clone().add(new THREE.Vector3(0, 0.5, 0)), tVel);


          var intersects = terrainHandler.rayTest(ray, {
            testMeshesNearPosition:this.position,
            noTerrain: le("chClimb"),
            unitReference: this,
            unitRayName: "colside"
          });

          if ( intersects.length > 0 && intersects[0].distance < 0.5) {

            raycastNormal = intersects[0].face.normal;
            raycastGroundPosition = intersects[0].point;

            if ( this instanceof Projectile ){
             this.Impact(true);
           }

            var distanceInside = 0.5-intersects[0].distance;

            this.object3D.position.add(raycastNormal.clone().multiplyScalar(distanceInside));

            this.velocity.add(raycastNormal.clone().multiplyScalar(-this.velocity.clone().dot(raycastNormal)));
          }
        }

        // Stand on top of terrain and meshes
        if ( true ) {
          this.terrainAngle = 0;
          // Again, increase by performance for other units by reducing raycasts
          /*var rayList = (this instanceof Player) ? this.rayOffsetList : this.rayOffsetList;*/
          var rayList = this.rayOffsetList;
          if ( !(this instanceof Projectile && this.impactDone) ) {
            for ( var ro=0;ro<rayList.length;ro++ ) {
              var rayCastPos = this.position.clone().add(rayList[ro]);
              //move the THREE.vector3(0, -1, 0) out of the loopscope so it does not get created everytime? it is not being modified anyway
              var ray = new THREE.Raycaster( rayCastPos, new THREE.Vector3(0, -1, 0));
              var normal = new THREE.Vector3();
              var point = new THREE.Vector3();
              var distance = 0;
              var succesfulRays = 0;
              var struckUnit = null;
              var distanceCheck = 0.5;

              var intersects = terrainHandler.rayTest(ray, {
                testMeshesNearPosition:this.position,
                reverseRaySortOrder:true,
                unitReference: this,
                unitRayName: "colground"
              });

              for(var i=0;i<intersects.length;i++){
                normal = intersects[i].face.normal;
                point = intersects[i].point;
                distance = intersects[i].distance.Round(2);
                struckUnit = intersects[i].object.unit;
                raycastNormal = normal;
                raycastGroundPosition = point;

                 if ( (this.isMainPlayer() || this instanceof Projectile) ) {
                   if ( struckUnit instanceof DynamicMesh ) {
                       this.unitStandingOn = struckUnit;
                   }
                 }

                if ( distance <= distanceCheck && this.restrictToGround ) {

                  var distanceInside = distanceCheck-distance;

                  var normalCopy = raycastNormal.clone();

                  var vec = new THREE.Vector3(0, 1, 0);

                  this.terrainAngle = Math.acos(raycastNormal.dot(vec)).ToDegrees();

                  // Prevent false values from players being stuck
                  if ( this.terrainAngle > 89 || this.terrainAngle < 0 ) this.terrainAngle = 0;

                  if ( showEditor && levelEditor.editorGUI.chClimb ) this.terrainAngle = 0;

                  if ( this.terrainAngle < 45 ) {
                    normalCopy.set(0,1,0);
                  }

                  var dvec = normalCopy.clone().multiplyScalar(distanceInside);

                  if ( this.unitStandingOn ) {
                    var rotationMatrix = new THREE.Matrix4();
                    rotationMatrix.extractRotation(this.unitStandingOn.object3D.matrix).transpose();
                    dvec.applyMatrix4(rotationMatrix);
                  }

                  this.object3D.position.add(dvec);

                  if ( !(this instanceof Projectile) ) {
                    this.velocity.sub(normalCopy.multiplyScalar(normalCopy.dot(this.velocity)));
                  }

                  if ( (this instanceof Projectile) && this.type.parabolic ) {
                    this.velocity.set(0,0,0);
                    this.Impact(true);
                  }

                  this.isTouchingGround = true;
                }
              }
            }
          }

          // If nothing is found, check if we are underneath the terrain. There is never a possiblity that
          // we are underneath the terrain
          // 6/9/12: Actually there is, when we build underground meshes.
          // 31/10/12: Removed, as we require raycastGroundPosition anyway.
          // Even when building underground we'll have a valid raycastGroundPosition since we're standing on a mesh
          // 8/6/13: Removed again due to skybox-only approach
          // 6/7/13: Only allow for the main player
          // 28/09/13: removed yet again, because ideally players should never fall through the terrain
          // A failsafe mechanism would be welcome, but due to the nature of our octree coll search mechanism
          // the raycastGroundPosition sometimes returns null even though there is actually terrain below
          // if ( (this instanceof Player) &&
          //   getZoneConfig("enableFluid") && this.position.y <= getZoneConfig('fluidLevel') ) {
          //   if ( !raycastGroundPosition ) {
          //     // We didn't find anything for our shadow
          //     // Reverse a raycast
          //     // Keep casting upwards until we have a match. There should always be a match at some point
          //       ray = new THREE.Raycaster( this.position, new THREE.Vector3(0, 1, 0));

          //       var intersects = terrainHandler.rayTest(ray, {
          //         testMeshesNearPosition:this.position,
          //         unitReference: this,
          //         unitRayName: "colunderneath"
          //       });

          //       if ( (intersects.length > 0 ) ) {
          //         raycastNormal = intersects[0].face.normal;
          //         raycastGroundPosition = intersects[0].point;
          //         //this.position = ConvertVector3(intersects[0].point);
          //         this.object3D.position.y = intersects[0].point.y;
          //       //bm("underneath!");
          //       }
          //   }
          // }
        }



        // Collide against meshes to the top
        // Only for the player
        if ( this.isMainPlayer() || (this instanceof Projectile && !this.impactDone) ) {
          ray = new THREE.Raycaster(this.position.clone().add(new THREE.Vector3(0, 0.8, 0)), new THREE.Vector3(0, 1, 0));

          var intersects = terrainHandler.rayTest(ray, {
            testMeshesNearPosition:this.position,
            unitReference: this,
            unitRayName: "colup"
          });

          if ( intersects.length > 0 && intersects[0].distance < 0.5) {

            var topNormal = intersects[0].face.normal;


            if ( this instanceof Projectile ) this.Impact(true);


            var distanceInside = 0.5-intersects[0].distance;

            this.object3D.position.add(topNormal.clone().multiplyScalar(distanceInside));

            var moveVector = topNormal.clone();

            if ( this.isTouchingGround ) {
              moveVector.add(raycastNormal);
              moveVector.multiplyScalar(2);
            }
            this.velocity.add(moveVector);
          }
        }
      }
      else {
          this.allowRaycastGround = true;
      }
    }
    if ( raycastNormal ) {
      this.groundNormal = raycastNormal;
    }
    var offset = this.renderOffset.clone().multiplyScalar(this.renderOffsetMultiplier);

    // Additional offset for special units (hacky...)

    if ( !(this.isPlayer()) && this.name == "Ghost" ) offset.y += 0.5;


    var renderPosition = this.position.clone().add(offset);


    if ( this.nameMesh ) {
      this.nameMesh.position.x = renderPosition.x;
      this.nameMesh.position.z = renderPosition.z;
      this.nameMesh.position.y = renderPosition.y + (1.5*this.size);

      this.nameMesh.LookFlatAt(ironbane.camera.position);
    }
    if ( this.debugMesh ) {
      this.debugMesh.position.x = renderPosition.x;
      this.debugMesh.position.z = renderPosition.z;
      this.debugMesh.position.y = renderPosition.y + 0.03;
      this.debugMesh.rotation.y = this.rotation.y;
    }
    if ( this.shadowMesh && raycastGroundPosition ) {
      this.shadowMesh.position.x = renderPosition.x;
      this.shadowMesh.position.z = renderPosition.z;
      this.shadowMesh.position.y = raycastGroundPosition.y + 0.1;

      // If the shadowmesh if above our own position, teleport it somewhere out of sight
      if ( this.shadowMesh.position.y > this.position.y+((this.meshHeight)*this.size) ) {
      //this.shadowMesh.position.y = this.position.y;
      }

      if ( raycastNormal ) {
        this.shadowMesh.LookFlatAt(raycastNormal.clone().add(this.shadowMesh.position));
      }

      this.shadowMesh.rotation.z = this.rotation.y;
    }
    else if ( this.shadowMesh && !raycastGroundPosition ) {
      this.shadowMesh.position.y = -1000;
    }

    if ( this.mesh ) {
      // Set our mesh position
      this.mesh.position.x = renderPosition.x;
      this.mesh.position.z = renderPosition.z;

      this.mesh.scale.set(this.size, this.size, this.size);

      // Don't spawn IN the ground
      this.mesh.position.y = renderPosition.y + ((this.meshHeight/2)*this.size) + 0.01;

    //this.mesh.position.y = renderPosition.y;
    }
  },
  inRangeOfUnit: function(unit, range) {
    return this.InRangeOfPosition(unit.position, range);
  },
  InRangeOfPosition: function(position, range) {
    return position.clone().sub(this.position).lengthSq() < range*range;
  },
  rotateTowardsTargetPosition: function(dTime) {
    var side = true;
    if(this.targetRotation.y < this.object3D.rotation.y) {
      side = Math.abs(this.targetRotation.y - this.object3D.rotation.y) < (Math.PI);
    } else {
      side = ((this.targetRotation.y - this.object3D.rotation.y) > (Math.PI));
    }

    var distance = Math.abs(this.targetRotation.y - this.object3D.rotation.y);

    var speed = rotation_speed;

    if ( this.slowWalk ) speed *= 1.5;

    if( distance > 0.03 ) {
      if (side) {
        this.object3D.rotation.y -= (speed * dTime);
      }
      else if (!side) {
        this.object3D.rotation.y += (speed * dTime);
      }
    }

    if(this.object3D.rotation.y < 0) {
      this.object3D.rotation.y = this.object3D.rotation.y + (Math.PI*2);
    } else if(this.object3D.rotation.y > (Math.PI*2)) {
      this.object3D.rotation.y = this.object3D.rotation.y -(Math.PI*2);
    }
  }
});