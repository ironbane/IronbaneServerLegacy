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




var rotation_speed = 100;

var unitFriction = 3;
var unitMaxSpeed = 5;
var unitMaxSpeedBackwards = 3;

var sizeScalingSpeed = 2;

var Unit = PhysicsObject.extend({
  Init: function(position, rotation, id, name, param, size) {

    this._super(position);

    // Used for network units
    this.fakeVelocity = new THREE.Vector3();

    // What type is this Unit toing to be?
    //this.type = type;

    this.name = name || 'Unnamed';
    this.id = id;

    if ( ISDEF(this.overrideName) ) this.name = this.overrideName;

    // Used to get the image/mesh
    this.param = param;

    this.rotation = rotation || new THREE.Vector3();
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


    this.drawNameMesh = ISDEF(this.drawNameMesh) ? this.drawNameMesh : false;

    this.enableShadow = ISDEF(this.enableShadow) ? this.enableShadow : true;


    this.terrainAngle = 0;


    this.spriteStep = 0;
    this.walkSpriteTimer = 0.0;

    this.renderOffset = new THREE.Vector3();
    this.renderOffsetMultiplier = 0.0;

    this.visible = true;

    this.waterSplashTimeout = 0.0;

    this.allowCheckGround = true;

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
  GetDirectionSpriteIndex: function() {

    // We need a vector from the unit to the camera
    var uc = ironbane.camera.position.clone();
    uc.subSelf(this.position);
    var rotrad = this.rotation.y * (Math.PI/180);
    // Rotate vector with our own rotation
    var tx = ((uc.x * Math.cos(rotrad)) - (uc.z * Math.sin(rotrad)));
    var tz = ((uc.x * Math.sin(rotrad)) + (uc.z * Math.cos(rotrad)));
    uc.x = tx;
    uc.z = tz;

    var result = parseInt(Math.atan2(uc.z, uc.x) * (180/Math.PI), 10);

    result += 180;



    while ( result < 0 ) result += 360;
    while ( result > 360 ) result -= 360;

    //console.warn(result);

    //debug.SetWatch('atan2 result', result);

    var index = 0;

    if ( result >= 22.5 && result <= 67.5 ) {
      index = 7;
    }
    else if ( result > 67.5 && result <= 112.5 ) {
      index = 6;
    }
    else if ( result > 112.5 && result <= 157.5 ) {
      index = 5;
    }
    else if ( result > 157.5 && result <= 202.5 ) {
      index = 4;
    }
    else if ( result > 202.5 && result <= 247.5 ) {
      index = 3;
    }
    else if ( result > 247.5 && result <= 292.5 ) {
      index = 2;
    }
    else if ( result > 292.5 && result <= 337.5 ) {
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
      var line;
      this.debugMesh = new THREE.Line(lineGeo, lineMat);
      this.debugMesh.type = THREE.Lines;


      ironbane.scene.add(this.debugMesh);

    }

    //if ( ((this instanceof Fighter) && !(this instanceof Player) && this.id > 0) ) {
    if (this.drawNameMesh) {
        this.renderNameMesh(this.name);
    }


    // Add lights
    // for (var i = this.lightsToMaintain.length - 1; i >= 0; i--) {
    //   this.object3D.add(this.lightsToMaintain[i]);
    // }




    // (function(unit){
    //   setTimeout(function(){
    //     unit.AddShadow();
    //   },0);
    // })(this);

  //        this.renderOffset.y += 1.5;
  //        this.renderOffsetMultiplier = 1.0;

    this.AddShadow();
  },
  renderNameMesh: function(name) {

      var unit = this,
          c = document.createElement('canvas');
          ctx = c.getContext('2d');
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
  AddShadow: function() {
    if ( this.enableShadow ) {
      //            var map = textureHandler.GetTexture('plugins/game/images/misc/shadow.png', true );
      //
      //            var planeGeo = new THREE.PlaneGeometry(this.size, this.size, 1, 1);
      //
      //
      //            var uniforms = {
      //                uvScale : {
      //                    type: 'v2',
      //                    value: new THREE.Vector2(1,1)
      //                },
      //                texture1 : {
      //                    type: 't',
      //                    value: 0,
      //                    texture: map
      //                }
      //            };
      //
      //            var shaderMaterial = new THREE.ShaderMaterial({
      //                uniforms : uniforms,
      //                vertexShader : $('#vertex').text(),
      //                fragmentShader : $('#fragment_fullbright').text(),
      //                transparent: true,
      //                alphaTest: 0.1
      //            //depthWrite: false,
      //            //depthTest: false
      //            });


      //            this.shadowMesh = new THREE.Mesh(planeGeo, shaderMaterial);

      this.shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(this.size, this.size, 1, 1),
        textureHandler.GetTexture('plugins/game/images/misc/shadow.png', false, {
          transparent:true,
          alphaTest:0.1
        }));
      //this.shadowMesh.geometry.dynamic = true;

      this.shadowMesh.rotation.x = -Math.PI/2;

      ironbane.scene.add(this.shadowMesh);

    }
  },
  FullDestroy: function() {
    ironbane.unitList = _.without(ironbane.unitList, this);
    this.Destroy();
  },
  Destroy: function() {

    _.each(this.lightsToMaintain, function(light){
      this.object3D.remove(light);
    }, this);

    if ( this.mesh ) {

      if (!(this instanceof Mesh)) {

        this.mesh.traverse( function ( object ) {


          //object.material.deallocate();

          if ( !_.isUndefined(object.geometry) ) {
            _.each(object.geometry.materials, function(material) {
              material.deallocate();
            });

            object.geometry.deallocate();
          }

          if ( !_.isUndefined(object.material) ) {
            if ( !(object.material instanceof THREE.MeshFaceMaterial) ) {
              object.material.deallocate();
            }
          }

          object.deallocate();

          ironbane.renderer.deallocateObject( object );
        } );

      }
      else {
        var me = this;

        this.mesh.traverse( function ( object ) {
          me.octree.remove( object );
        } );

      }

      ironbane.scene.remove(this.mesh);
      this.mesh.deallocate();

    }

    if ( this.debugMesh ) {
      ironbane.scene.remove(this.debugMesh);
      this.debugMesh.deallocate();
      this.debugMesh.geometry.deallocate();
      this.debugMesh.material.deallocate();
      ironbane.renderer.deallocateObject( this.debugMesh );
    }

    if ( this.nameMesh ) {
      ironbane.scene.remove(this.nameMesh);
      this.nameMesh.deallocate();
      ironbane.renderer.deallocateObject( this.nameMesh );
    }

    if ( this.shadowMesh ) {
      ironbane.scene.remove(this.shadowMesh);
      this.shadowMesh.deallocate();
      this.shadowMesh.geometry.deallocate();
      ironbane.renderer.deallocateObject( this.shadowMesh );
    }

    _.each(this.particleEmittersToMaintain, function(pEmitter) {
      pEmitter.removeNextTick = true;
    });



    this._super();

  },
  DisplayUVFrame: function(indexH, indexV, numberOfSpritesH, numberOfSpritesV, mirror) {
    if  ( !this.mesh ) return;
    DisplayUVFrame(this.mesh, indexH, indexV, numberOfSpritesH, numberOfSpritesV, mirror);
  },
  Tick: function(dTime) {


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

    //var radians = (this.rotation.y + 90) * (Math.PI/180);

    if ( ironbane.player ) {
      if ( this instanceof Player ) {
        this.unitStandingOn = null;
      }
      else {
        if ( !this.InRangeOfUnit(ironbane.player, 15) ) {
          this.allowCheckGround = false;
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
      if ( !(this instanceof Player) && !(this instanceof Projectile) ) {

        this.localPosition.x = this.localPosition.x.Lerp(this.targetPosition.x, dTime*2);
        this.localPosition.z = this.localPosition.z.Lerp(this.targetPosition.z, dTime*2);

        if ( !this.enableGravity ) {
          this.localPosition.y = this.localPosition.y.Lerp(this.targetPosition.y, dTime*2);
        }
      }

      this.RotateTowardsTargetPosition(dTime);

      var cp = WorldToCellCoordinates(this.position.x, this.position.z, cellSize);

      var cellStandingOn = ISDEF(terrainHandler.cells[cp.x+"-"+cp.z]) ? terrainHandler.cells[cp.x+"-"+cp.z] : null;

      if ( this.enableGravity ) {

        var grav = gravity.clone();

        if ( GetZoneConfig("enableFluid") && this.position.y < GetZoneConfig('fluidLevel')-0.5 ) {
          grav.multiplyScalar(-1);
          if ( this.velocity.y < -0.5 ) {
            this.velocity.addSelf(new THREE.Vector3(0, dTime*15, 0));

            soundHandler.Play("splash", this.position);

          }


        }
        if ( GetZoneConfig("enableFluid") && this.position.y < GetZoneConfig('fluidLevel') ) {
          if ( this.waterSplashTimeout >= 0 ) this.waterSplashTimeout -= dTime;
          else {
            this.waterSplashTimeout = 0.1;
            particleHandler.Add(GetZoneConfig("fluidType") === "lava" ? ParticleTypeEnum.LAVABURN : ParticleTypeEnum.SPLASH, {
              position:this.position.clone()
            });
          }
        }

        if ( !GetZoneConfig("enableFluid") || this.position.y < GetZoneConfig('fluidLevel')-0.6 || this.position.y > GetZoneConfig('fluidLevel')-0.4 ) {
          this.velocity.addSelf(grav.clone().multiplyScalar(dTime));
        }
        else {
          this.velocity.lerpSelf(new THREE.Vector3(this.velocity.x, 0, this.velocity.z), dTime*2);

          soundHandler.Play("stepWater", this.position);
        }


      }



      // Used to align the shadow cast on the ground
      var raycastNormal = null;
      var raycastGroundPosition = null;
      this.isTouchingGround = false;



      if ( this.allowCheckGround && cellStandingOn ) {
        // Handle collisions

        var isSimpleProjectile = (this instanceof Projectile) && !this.type.parabolic;


        // Collide against meshes sideways
        // Only for the player to reduce performance
        // NPC's use waypoints and other players should do their own local collisiond detection
        // Will make cheaters easier to spot
        if ( (this instanceof Player) || (this instanceof Projectile) ) {
          var tVel = this.velocity.clone();
          tVel.y = 0;
          tVel.normalize();

          var ray = new THREE.Ray( this.position.clone().addSelf(new THREE.Vector3(0, 0.5, 0)), tVel);


          var intersects = terrainHandler.RayTest(ray, {
            testMeshesNearPosition:this.position,
            noTerrain: le("chClimb"),
            unitReference: this,
            unitRayName: "colside"
          });


          if ( intersects.length > 0 && intersects[0].distance < 0.5) {

            //debug.SetWatch("collision distance", intersects[0].distance);

            raycastNormal = intersects[0].face.normal;
            raycastGroundPosition = intersects[0].point;

            //                        this.position.y += intersects[0].distance;
            //                        this.velocity.y = 0;

            if ( this instanceof Projectile ) this.Impact(true);



            var distanceInside = 0.5-intersects[0].distance;

            this.localPosition.addSelf(raycastNormal.clone().multiplyScalar(distanceInside));

            this.velocity.addSelf(raycastNormal.clone().multiplyScalar(-this.velocity.clone().dot(raycastNormal)));

          //this.isTouchingGround = true;
          }
        //          }
        }

        // We don't like to cast rays when we're at 0,0, causes glitches
        if ( this.position.x % 1 === 0 ) this.localPosition.x += 0.001;
        if ( this.position.z % 1 === 0 ) this.localPosition.z += 0.001;


        // Stand on top of terrain and meshes
        if ( !isSimpleProjectile ) {



          this.terrainAngle = 0;


          // Again, increase by performance for other units by reducing raycasts
          var rayList = (this instanceof Player) ? this.rayOffsetList : this.rayOffsetList;

          for ( var ro=0;ro<rayList.length;ro++ ) {

            //if ( GetZoneConfig("enableFluid") && this.position.y < GetZoneConfig('fluidLevel')-0.5 ) continue;

            var rayCastPos = this.position.clone().addSelf(rayList[ro]);

            var ray = new THREE.Ray( rayCastPos, new THREE.Vector3(0, -1, 0));
            var normal = new THREE.Vector3();
            var point = new THREE.Vector3();
            var distance = 0;
            var succesfulRays = 0;
            var struckUnit = null;

              var distanceCheck = 0.5;


            var intersects = terrainHandler.RayTest(ray, {
              testMeshesNearPosition:this.position,
              reverseRaySortOrder:true,
              unitReference: this,
              unitRayName: "colground"
            });



            //if ( intersects.length > 0 ) {
            for(var i=0;i<intersects.length;i++){
              normal = intersects[i].face.normal;
              point = intersects[i].point;
              distance = intersects[i].distance;
              //                succesfulRays++;
              struckUnit = intersects[i].object.unit;
              //              }
              //            //}
              //
              //
              //            if ( succesfulRays > 0 ) {
              //debug.SetWatch("collision distance", intersects[0].distance);

              raycastNormal = normal;
              raycastGroundPosition = point;

              //sw("raycastGroundPosition", raycastGroundPosition);

             // raycastNormal = normal.divideScalar(succesfulRays);
             // raycastGroundPosition = point.divideScalar(succesfulRays);
             // distance = distance / succesfulRays;

             //  debug.DrawVector(raycastNormal, raycastGroundPosition, 0xFF0099);
             //                         this.position.y += intersects[0].distance;
             //                         this.velocity.y = 0;

               if ( (this instanceof Player || this instanceof Projectile) ) {
                 if ( struckUnit instanceof DynamicMesh ) {

                     //bm("unitStandingOn to struckUnit");
                     this.unitStandingOn = struckUnit;

                 }
               }



              distance = distance.Round(2);

              // 0.4 <= 0.5
              if ( distance <= distanceCheck ) {

                // 0.5 - 0.4
                // 0.1
                var distanceInside = distanceCheck-distance;

                var normalCopy = raycastNormal.clone();

                var vec = new THREE.Vector3(0, 1, 0);

                this.terrainAngle = Math.acos(raycastNormal.dot(vec)).ToDegrees();

                //debug.SetWatch("SET this.terrainAngle", this.terrainAngle);

                if ( showEditor && levelEditor.editorGUI.chClimb ) this.terrainAngle = 0;

                if ( this.terrainAngle < 45 ) {
                  normalCopy.set(0,1,0);
                }


                var dvec = normalCopy.clone().multiplyScalar(distanceInside);

                if ( this.unitStandingOn ) {
                  var rotationMatrix = new THREE.Matrix4();
                  rotationMatrix.extractRotation(this.unitStandingOn.object3D.matrix).transpose();
                  rotationMatrix.multiplyVector3(dvec);
                }

                this.localPosition.addSelf(dvec);


                if ( !(this instanceof Projectile) ) {
                  this.velocity.subSelf(normalCopy.multiplyScalar(normalCopy.dot(this.velocity)));
                }

                if ( (this instanceof Projectile) && this.type.parabolic ) {
                  this.Impact(true);
                }

                this.isTouchingGround = true;


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
          if ( (this instanceof Player) &&
            GetZoneConfig("enableFluid") && this.position.y <= GetZoneConfig('fluidLevel') ) {
            if ( !raycastGroundPosition ) {
              // We didn't find anything for our shadow
              // Reverse a raycast
              ray = new THREE.Ray( this.position, new THREE.Vector3(0, 1, 0));

              var intersects = terrainHandler.RayTest(ray, {
                testMeshesNearPosition:this.position,
                unitReference: this,
                unitRayName: "colunderneath"
              });

              if ( (intersects.length > 0 ) ) {
                raycastNormal = intersects[0].face.normal;
                raycastGroundPosition = intersects[0].point;
                //this.position = ConvertVector3(intersects[0].point);
                this.localPosition.y = intersects[0].point.y;
              //bm("underneath!");
              }
            }
          }
        }

        //debug.SetWatch("this.terrainAngle", this.terrainAngle);


        // Collide against meshes to the top
        // Only for the player
        if ( (this instanceof Player) || (this instanceof Projectile) ) {
          ray = new THREE.Ray(this.position.clone().addSelf(new THREE.Vector3(0, 0.8, 0)), new THREE.Vector3(0, 1, 0));

          var intersects = terrainHandler.RayTest(ray, {
            testMeshesNearPosition:this.position,
            unitReference: this,
            unitRayName: "colup"
          });

          if ( intersects.length > 0 && intersects[0].distance < 0.5) {

            //debug.SetWatch("collision distance", intersects[0].distance);

            var topNormal = intersects[0].face.normal;


            //raycastGroundPosition = intersects[0].point;

            //                        this.position.y += intersects[0].distance;
            //                        this.velocity.y = 0;

            if ( this instanceof Projectile ) this.Impact(true);


            //                        ba(topNormal.ToString());

            var distanceInside = 0.5-intersects[0].distance;

            this.localPosition.addSelf(topNormal.clone().multiplyScalar(distanceInside));

            var moveVector = topNormal.clone();

            if ( this.isTouchingGround ) {
              moveVector.addSelf(raycastNormal);
              moveVector.multiplyScalar(2);
            }


            //                        this.velocity.addSelf(topNormal.clone().multiplyScalar(-this.velocity.clone().dot(topNormal)));
            this.velocity.addSelf(moveVector);

          //bm(this.velocity.ToString());

          //this.isTouchingGround = true;
          }

        }


      //                // Server controlled units don't have Y coordinate, so update it manually
      //                if ( !(this instanceof Projectile) && raycastGroundPosition ) {
      //                    this.targetPosition.y = raycastGroundPosition.y;
      //                }

      // Todo cast a reversed ray from down to up (only for terrain)




      }
      else {
        this.allowCheckGround = true;
      }



      // sw("this.position", this.position);
      // sw("this.velocity", this.velocity);

    // Check collisions with Billboards
    //      for(var u=0;u<ironbane.unitList.length;u++) {
    //        var unit = ironbane.unitList[u];
    //
    //        if ( !(unit instanceof Billboard) ) continue;
    //        if ( (unit instanceof Waypoint) ) continue;
    //
    //        if ( unit == this ) continue;
    //
    //        if ( unit.InRangeOfUnit(this, 0.5) ) {
    //
    //          var normal = this.position.clone().subSelf(unit.position);
    //
    //          var distanceInside = 0.5-normal.length();
    //          normal.normalize();
    //
    //          this.localPosition.addSelf(normal.clone().multiplyScalar(distanceInside));
    //
    //          this.velocity.addSelf(normal.clone().multiplyScalar(-this.velocity.clone().dot(normal)));
    //        }
    //
    //      }


    }



    if ( raycastNormal ) {
      this.groundNormal = raycastNormal;
    }


    var offset = this.renderOffset.clone().multiplyScalar(this.renderOffsetMultiplier);



    // Additional offset for special units (hacky...)

    if ( this.id < 0 && this.name == "Ghost" ) offset.y += 0.5;




    var renderPosition = this.position.clone().addSelf(offset);


    if ( this.nameMesh ) {
      this.nameMesh.position.x = renderPosition.x;
      this.nameMesh.position.z = renderPosition.z;
      this.nameMesh.position.y = renderPosition.y + (1.5*this.size);

      this.nameMesh.LookAt(ironbane.camera.position);
    }
    if ( this.debugMesh ) {
      this.debugMesh.position.x = renderPosition.x;
      this.debugMesh.position.z = renderPosition.z;
      this.debugMesh.position.y = renderPosition.y + 0.03;
      this.debugMesh.rotation.y = this.rotation.y * (Math.PI/180);
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
        this.shadowMesh.LookAt(raycastNormal.clone().addSelf(this.shadowMesh.position));
      }

      this.shadowMesh.rotation.z = this.rotation.y * (Math.PI/180);
    //this.shadowMesh.LookAt(ironbane.camera.position, 0);
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
  InRangeOfUnit: function(unit, range) {
    return this.InRangeOfPosition(unit.position, range);
  },
  InRangeOfPosition: function(position, range) {
    return position.clone().subSelf(this.position).lengthSq() < range*range;
  },
  RotateTowardsTargetPosition: function(dTime) {
    var side = true;
    if(this.targetRotation.y < this.rotation.y) {
      side = Math.abs(this.targetRotation.y - this.rotation.y) < 180;
    } else {
      side = ((this.targetRotation.y - this.rotation.y) > 180);
    }

    var distance = Math.abs(this.targetRotation.y - this.rotation.y);

    var speed = rotation_speed;

    if ( this.slowWalk ) speed *= 1.5;

    if( distance > 2 ) {
      if (side) {
        this.rotation.y -= (speed * dTime);
      }
      else if (!side) {
        this.rotation.y += (speed * dTime);
      }
    }

    if(this.rotation.y < 0) {
      this.rotation.y = this.rotation.y + 360;
    } else if(this.rotation.y > 360) {
      this.rotation.y = this.rotation.y -360;
    }
  }
});




