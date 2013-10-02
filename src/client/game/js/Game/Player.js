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

var CameraStatusEnum = {
    ThirdPerson: "ThirdPerson",
    ThirdPersonToFirstPersonTransition: "ThirdPersonToFirstPersonTransition",
    FirstPerson: "FirstPerson"
};

var Player = Fighter.extend({
    Init: function(position, rotation, id, name) {
        this._super(position, rotation, id, name, 0,
            socketHandler.playerData.size, socketHandler.playerData.health, socketHandler.playerData.armor,
            socketHandler.playerData.healthMax, socketHandler.playerData.armorMax);
        this.template = {};
        this.template.type = UnitTypeEnum.PLAYER;

        this.drawNameMesh = false;
        this.originalThirdPersonReference = new THREE.Vector3(0, 2.5, -4);
        ironbane.camera.position.copy(position.clone().add(new THREE.Vector3(0, 1, 0)));
        this.thirdPersonReference = this.originalThirdPersonReference.clone();
        this.targetSize = socketHandler.playerData.size;
        this.sendDataTimeout = 0.0;
        this.canMove = true;
        this.canLoot = false;
        this.lootItems = [];
        this.lootUnit = null;
        this.cameraStatus = CameraStatusEnum.ThirdPerson;

        (function(unit) {
            setTimeout(function() {
                hudHandler.MakeHealthBar();
                hudHandler.MakeArmorBar();
                hudHandler.MakeCoinBar();
            }, 0);
        })(this);

        this.CheckForItemsBeforeMakingImage();

        // Reddish glow that follows the mouse
        this.aimTexture = "";
        this.targetAimTexture = "";
        this.aimMesh = null;
        this.aimMeshPosition = new THREE.Vector3();

        // Secondary helper
        this.aimHelperTexture = "";
        // this.targetAimHelperTexture = "";
        this.aimHelperMesh = null;
        this.aimHelperMeshPosition = new THREE.Vector3();

        this.currentZoneMusic = null;

        if ( showEditor ) {
            this.enableGravity = !levelEditor.editorGUI.chFlyMode;
        }

        this.mouseRayCastCheckTimeout = 0.0;

        this.isLookingAround = false;

        this.onChangeZone(terrainHandler.zone);

        this.lastFoundLootBag = null;

        this.lookAtPosition = new THREE.Vector3();

        this.pathFinder = IB.PathFinder();
    },
    getTotalCoins: function() {
        //console.log('getTotalCoins', socketHandler.playerData.items);

        // sum value of cash items in inventory
        return _.reduce(_.pluck(_.where(socketHandler.playerData.items, {
            type: 'cash'
        }), 'value'), function(memo, num) {
            return memo + num;
        }, 0);
    },
    CheckForItemsBeforeMakingImage: function() {
        if (socketHandler.playerData.items === null) {
            setTimeout(function() {
                ironbane.player.CheckForItemsBeforeMakingImage();
            }, 1000);
        } else {
            this.UpdateAppearance();
            var weapon = this.GetEquippedWeapon();

            if (weapon) {
                var template = items[weapon.template];
                this.UpdateWeapon(template.id);
            }
        }
    },
    Destroy: function() {
        //$('#loadingBar').show();
        this.DestroyAimMesh();
        this.DestroyAimHelperMesh();

        this._super();
    },
  DestroyAimMesh: function() {
    if ( this.aimMesh ) {
      releaseMesh(this.aimMesh, {removeMaterials:false});

      ironbane.scene.remove(this.aimMesh);

    }
  },
  DestroyAimHelperMesh: function() {
    if ( this.aimHelperMesh ) {
      releaseMesh(this.aimHelperMesh, {removeMaterials:false});

      ironbane.scene.remove(this.aimHelperMesh);
    }
  },
  onChangeZone: function(newZone) {

    // Hack for Ironbane's Chamber "spooky cam"
    if ( newZone === 7 ) {
      this.originalThirdPersonReference.set(0, 0.8, -4).multiplyScalar(1.5);
      this.thirdPersonReference
        .copy(this.originalThirdPersonReference);
    }
    else {
      this.originalThirdPersonReference.set(0, 2.5, -4);
    }

  },
  Tick: function(dTime) {

    this.sendDataTimeout -= dTime;

    this.pathFinder.tick(dTime);


    if ( this.mouseRayCastCheckTimeout > 0 ) this.mouseRayCastCheckTimeout -= dTime;




    // Check for loot bags, chests, and vendors nearby
    var found = false;
    for(var u=0;u<ironbane.unitList.length;u++) {
      var lootBag = ironbane.unitList[u];

      if ( lootBag == this ) continue;

      if ( lootBag instanceof Fighter && lootBag.id < 0 ) {
        if ( lootBag.template.type != UnitTypeEnum.VENDOR ) continue;
      }
      else if ( !((lootBag instanceof LootBag) || (lootBag instanceof LootableMesh)) ) continue;


      if ( this.InRangeOfUnit(lootBag, (lootBag instanceof LootableMesh) ? 2.0 : 1.0) ) {
        found = lootBag;
      }
    }

    if ( this.canLoot ) {
      if ( !found ) {
        // Remove the loot bag
        $('#lootBag').hide();


        // Todo: remove the items via UI
        for(var i=0;i<this.lootItems.length;i++){
          var lootItem = this.lootItems[i];

          $('#li'+lootItem.id).remove();

          if ( currentHoverDiv == 'li'+lootItem.id ) $('#tooltip').hide();
        }

        this.lootItems = [];

        this.canLoot = false;

        this.lootUnit = null;

        if ( hudHandler.alertBoxActive ) {
          hudHandler.ReloadInventory();
          hudHandler.HideAlert();
        }

        if ( this.lastFoundLootBag && this.lastFoundLootBag.id === -267 ) {
          this.HideTutorial(1);
        }
      }
    }
    else {
      if ( found ) {
        // Show the loot bag
        $('#lootBag').show();

        // Check for tutorial #1
        if ( found.id === -267 ) {
          this.ShowTutorial(1);
        }


        // Make a request for the items and update the UI when we receive them
        socketHandler.socket.emit('loot', found.id, function (reply) {



          if ( !_.isUndefined(reply.errmsg) ) {
            hudHandler.MessageAlert(reply.errmsg);
            return;
          }

          //if ( !socketHandler.loggedIn ) return;
          ironbane.player.lootItems = reply;
          hudHandler.MakeSlotItems(true);

          if ( found.template.type == UnitTypeEnum.VENDOR ) {
            $('div[id^="ls"]').attr("class","buyBarSlot");
          }
          else {
            $('div[id^="ls"]').attr("class","lootBarSlot");
          }
        });

        this.canLoot = true;

        this.lootUnit = found;
      }
    }





    this.lastFoundLootBag = found;




    var rotrad = ((Math.PI*1.5)-this.rotation.y);
    //rotrad = 0;

    var uc = this.thirdPersonReference.clone();


    uc.multiplyScalar(0.5+(this.size*0.5));









    var tx = ((uc.x * Math.cos(rotrad)) - (uc.z * Math.sin(rotrad)));
    var tz = ((uc.x * Math.sin(rotrad)) + (uc.z * Math.cos(rotrad)));

    uc.x = tx;
    uc.z = tz;

    var preTarget = this.position.clone().add(uc);


    //        if ( this.mouseRayCastCheckTimeout <= 0 ) {
    this.UpdateMouseProjectedPosition();
    //            this.mouseRayCastCheckTimeout = 0.1;
    //        }

    var doCameraCheck = true;
    if ( le("globalEnable") || le("chFlyMode") ) {
      doCameraCheck = false;
    }

    if ( le("globalEnable") ) {
      this.cameraStatus = CameraStatusEnum.FirstPerson;
    }

    if ( doCameraCheck && !cinema.IsPlaying()) {


      var needFirstPersonMode = false;


      var ray = new THREE.Raycaster(this.position.clone().add(new THREE.Vector3(0, 0.5, 0)), preTarget.clone().sub(this.position.clone()).normalize());


      var intersects = terrainHandler.RayTest(ray, {
        testMeshesNearPosition:ironbane.camera.position,
        unitReference: this,
        unitRayName: "camera"
      });

      if ( intersects.length > 0 ) {

        var relativeDifference = intersects[0].distance;
        //

        //debug.SetWatch("camera col!", relativeDifference);
        if ( !this.isLookingAround ) {
          if ( relativeDifference < 2.5 ) {
            //manualLerp = true;
            //ironbane.camera.position.lerp(this.position.clone().add(new THREE.Vector3(0, 2, 0)), dTime*3);
            //ironbane.camera.position.y = this.position.y + 2;

            needFirstPersonMode = true;

            switch(this.cameraStatus) {
              case CameraStatusEnum.ThirdPerson:
                this.cameraStatus = CameraStatusEnum.ThirdPersonToFirstPersonTransition;
                break;
            }

          }
          else {
            this.thirdPersonReference.lerp(this.originalThirdPersonReference, dTime*10);
          }
        }

        var bufferSpace = relativeDifference <= this.originalThirdPersonReference.length() ? 1.0 : 0;

        relativeDifference = Math.min(relativeDifference, this.originalThirdPersonReference.length());

        uc.normalize();

        uc.multiplyScalar(relativeDifference-bufferSpace);

      }
      if ( !needFirstPersonMode ) {
        switch(this.cameraStatus) {
          case CameraStatusEnum.FirstPerson:
          case CameraStatusEnum.ThirdPersonToFirstPersonTransition:
            this.cameraStatus = CameraStatusEnum.ThirdPerson;
            break;
        }
      }


    }

    var target = this.position.clone().add(uc);



    //debug.SetWatch("target", target.ToString());
    //debug.SetWatch("manualLerp ", manualLerp );


    var radians = (this.rotation.y + (Math.PI/2));



    if ( !cinema.IsPlaying() ) {
      // Set our position behind the playe
      var firstPersonTarget = this.position.clone().add(new THREE.Vector3(-Math.sin(radians)*0.001, 0, -Math.cos(radians)*0.001));
      firstPersonTarget.y += 1;

      switch(this.cameraStatus) {
        case CameraStatusEnum.FirstPerson:
          ironbane.camera.position.copy(firstPersonTarget);

          break;
        case CameraStatusEnum.ThirdPersonToFirstPersonTransition:
          ironbane.camera.position.lerp(firstPersonTarget, dTime*10);

          if ( (ironbane.camera.position.clone().sub(firstPersonTarget)).length() < 0.01 ) {
            this.cameraStatus = CameraStatusEnum.FirstPerson;
          }
          break;
        case CameraStatusEnum.ThirdPerson:
          if ( this.unitStandingOn ) {
            ironbane.camera.position.copy(target);
          }
          else {
            ironbane.camera.position.lerp(target, dTime*3);
          }


          break;
      }

      //debug.SetWatch("this.cameraStatus", this.cameraStatus);

      var lookAtTarget = null;
      if ( this.cameraStatus != CameraStatusEnum.ThirdPerson ) {
        lookAtTarget = this.position.clone().add(new THREE.Vector3(Math.sin(radians), 1, Math.cos(radians)));
      }
      else {
        lookAtTarget = this.position.clone().add(new THREE.Vector3(0, 1, 0));

      }
      if ( this.unitStandingOn ) {
        this.lookAtPosition.copy(lookAtTarget);
      }
      else {
        this.lookAtPosition.lerp(lookAtTarget, dTime * 10);
      }


      ironbane.camera.lookAt(this.lookAtPosition);
    }
    //var factor = 6 / Math.max(Math.max(Math.abs(this.speed), 6), 0.1);



    //        this.targetPosition.x = this.position.x + (Math.sin(radians) * this.speed) * dTime;
    //        this.targetPosition.z = this.position.z + (Math.cos(radians) * this.speed) * dTime;
    //        this.targetPosition.x += (Math.sin(radians) * this.speed) * dTime;
    //        this.targetPosition.z += (Math.cos(radians) * this.speed) * dTime;


    //        this.velocity.x = (Math.sin(radians) * this.speed);
    //        this.velocity.z = (Math.cos(radians) * this.speed);

    //        this.velocity.x += (Math.sin(radians) * this.speed) * dTime;
    //        this.velocity.z += (Math.cos(radians) * this.speed) * dTime;

    //        this.velocity.normalize();
    //        this.velocity.multiplyScalar(this.speed);
    this.slowWalk = false;
    if( keyTracker[16] ){
      this.slowWalk = true;
    }

    var rotSpeed = rotation_speed;

    if ( this.slowWalk ) rotSpeed *= 1.5;

    if ( this.canMove ) {
      if(keyTracker[37]||keyTracker[65]){
        this.object3D.rotation.y += (rotSpeed * dTime);
      }
      if(keyTracker[39]||keyTracker[68]){
        this.object3D.rotation.y -= (rotSpeed * dTime);
      }//
    }

    // if ( this.unitStandingOn ) {
    //   this.targetRotation.y = this.object3D.rotationY + this.unitStandingOn.object3D.rotation.y;
    //   //sw("this.unitStandingOn.rotation.y.ToDegrees()", this.unitStandingOn.object3D.rotationY.y;
    // }
    // else {
      this.targetRotation.y = this.object3D.rotation.y;
    // }

    while ( this.targetRotation.y < 0 ) {
      this.targetRotation.y += (Math.PI*2);
    }
    while ( this.targetRotation.y > (Math.PI*2) ) {
      this.targetRotation.y -= (Math.PI*2);
    }

    // if ( !this.unitStandingOn ) {
    //   this.object3D.rotation.y = this.targetRotation.y;
    // }

    // sw("o.rotation.y", this.object3D.rotation.y);
    // sw("targetRotation.y", this.targetRotation.y);
    // sw("rotation.y", this.rotation.y);



    //if ( !this.freeFall ) {

    var additionalCanMove = true;

    if ( this.terrainAngle > 45 && this.position.y > GetZoneConfig('fluidLevel') ) additionalCanMove = false;


    var inputVelocity = new THREE.Vector3();

    if ( this.canMove && additionalCanMove ) {
      if(keyTracker[38]||keyTracker[87]){
        inputVelocity.x += (Math.sin(radians) * unitAcceleration) * dTime;
        inputVelocity.z += (Math.cos(radians) * unitAcceleration) * dTime;
      }
      if(keyTracker[40]||keyTracker[83]){
        inputVelocity.x += (Math.sin(radians) * -unitAcceleration) * dTime;
        inputVelocity.z += (Math.cos(radians) * -unitAcceleration) * dTime;
      }
      if(keyTracker[81]){
        inputVelocity.x -= (Math.sin(radians+(Math.PI/2)) * -unitAcceleration) * dTime;
        inputVelocity.z -= (Math.cos(radians+(Math.PI/2)) * -unitAcceleration) * dTime;
      }
      if(keyTracker[69]){
        inputVelocity.x += (Math.sin(radians+(Math.PI/2)) * -unitAcceleration) * dTime;
        inputVelocity.z += (Math.cos(radians+(Math.PI/2)) * -unitAcceleration) * dTime;
      }
    }


    this.velocity.add(inputVelocity);


    if ( this.canMove ) {
      if(keyTracker[32]){

        if ( showEditor && levelEditor.editorGUI.chFlyMode ) {
          this.object3D.position.y += dTime * 5;
        }
        else if ( this.lastJumpTimer <= 0 &&
          (this.isTouchingGround ||
            (this.position.y < GetZoneConfig('fluidLevel')
              && this.position.y > GetZoneConfig('fluidLevel') - 0.5 ) ) ) {

          if ( this.position.y < GetZoneConfig('fluidLevel') ) {
            //this.position.y = GetZoneConfig('fluidLevel');

            this.lastJumpTimer = 1.0;
          }

          this.Jump();
          socketHandler.socket.emit('doJump', {});


        }

      }
      if(keyTracker[16]){

        if ( showEditor && levelEditor.editorGUI.chFlyMode ) {
          this.object3D.position.y -= dTime * 5;
        }
      }

    }


    var oldvy = this.velocity.y;

    this.velocity.y = 0;
    var vlength =  this.velocity.length();

    var frictionLength = 16.5;

    if ( inputVelocity.lengthSq() > 0.1 ) {
      frictionLength = 2.5;
    }

    frictionLength *= dTime;

    var rotTest = this.heading.dot(this.velocity.clone().normalize());
    //debug.SetWatch("rotTest", rotTest);

    var maxSpeed = rotTest < -0.2 ? unitMaxSpeedBackwards : unitMaxSpeed;

    if ( this.slowWalk ) maxSpeed = 2;

    if ( le("chSpeed") ) maxSpeed *= 10;


    //if ( zones[terrainHandler.zone]['enableFluid'] ) {
    if ( GetZoneConfig('enableFluid') ) {
      // Make some water splashes when we're moving under the fluidLevel

      if ( this.position.y < GetZoneConfig('fluidLevel')  ) {


        var waterFrictionVector = this.velocity.clone().normalize().multiplyScalar(dTime*10);

        //if ( vlength > 3 ) {
        this.velocity.sub(waterFrictionVector);
        //}

        maxSpeed -= (GetZoneConfig('fluidLevel')-this.position.y)*4;
        maxSpeed = Math.max(2, maxSpeed);

      }

    }

    // Apply slope speed
    // var factor = Math.cos((this.slopeAngle).clamp(0,90).ToRadians());

    // frictionLength *= factor;

    // Apply friction
    var frictionVector = this.velocity.clone().normalize().multiplyScalar(frictionLength);

    if ( vlength > frictionLength ) {
      this.velocity.sub(frictionVector);
    }
    else {
      this.velocity.x = 0;
      this.velocity.z = 0;
    }

    // Limit velocity
    if ( vlength > maxSpeed ) {
      this.velocity.normalize();
      this.velocity.multiplyScalar(maxSpeed);
    }

    this.speed = this.velocity.length();

    if ( this.speed <= 0.1 ) {
      this.speed = 0;
    }

    this.velocity.y = oldvy;






    //
    debug.SetWatch('player.speed', this.speed);
    debug.SetWatch('player.rotation', this.rotation.ToString());
    debug.SetWatch('player.position', this.position.ToString());
    debug.SetWatch('player.velocity', this.velocity.ToString());
    //



    if ( socketHandler.serverOnline ) {
      if ( this.sendDataTimeout <= 0.0 ) {
        this.sendDataTimeout = 0.25;
        this.SendData();
      }
    }



    //        if ( !_.isUndefined(ironbane.unitList[0]) ) {
    //            var npc = ironbane.unitList[0];
    //
    //            this.position = npc.position;
    //            this.rotation.y = npc.rotation.y;
    //        }




    // this.targetAimHelperTexture = "";


    // Move the reddish aim mesh
    if ( currentMouseToWorldData ) {

      var point = ConvertVector3(currentMouseToWorldData.point);


      // Check the aim range
      var weapon = this.GetEquippedWeapon();
      if ( weapon ) {
        var template = items[weapon.template];
        var range = WeaponRanges[template.subtype];
        var playerToPoint = point.clone().sub(this.position);


          if ( template.type == 'weapon') {
            if ( template.subtype == 'bow' || template.subtype == 'staff' ) {
              this.targetAimTexture = "aim_bow";
            }
            else {
              this.targetAimTexture = "aim_bow";
            }
          }



        var inFOV = this.heading.dot(playerToPoint.clone().normalize()) > -0.5;

        if ( !(inFOV && range*range > playerToPoint.lengthSq()) ) {
          // Forbidden, but add a helper nevertheless
          if ( inFOV ) {
            // this.targetAimHelperTexture = this.targetAimTexture;
            this.aimHelperMeshPosition = this.position.clone()
              .add(playerToPoint.normalize().multiplyScalar(range));
            this.aimHelperMeshPosition.setY(this.aimHelperMeshPosition.y + 0.1);


            // _.each(ironbane.unitList, function(u){
            //   if ( u instanceof Fighter && u != ironbane.player
            //     && u.InRangeOfPosition(ironbane.player.aimHelperMeshPosition, 1)
            //     && u.id < 0
            //     && !u.template.friendly
            //     && u.health > 0 ){
            //     if ( ironbane.player.attackTimeout > 0.2 ) {
            //       ironbane.player.targetAimHelperTexture = "aim_close";
            //     }
            //     else {
            //       ironbane.player.targetAimHelperTexture = "aim_close";
            //     }
            //   }
            // });
          }

          this.targetAimTexture = "aim_forbidden";



        }
        else {

          _.each(ironbane.unitList, function(u){
            if ( u instanceof Fighter
              && u != ironbane.player
              && u.InRangeOfPosition(point, 1)
              && u.id < 0
              && !u.template.friendly
              && u.health > 0 ){
              // if ( ironbane.player.attackTimeout > 0.2 ) {
                ironbane.player.targetAimTexture = "aim_close";
              // }
              // else {
              //   ironbane.player.targetAimTexture = "aim_close";
              // }
            }
          });

        }

        if ( this.attackTimeout > 0.5) {
          // if ( this.targetAimHelperTexture === "aim_close" ) {
          //   this.targetAimHelperTexture = "aim_close_fire";
          // }
          // if ( this.targetAimHelperTexture === "aim_bow" ) {
          //   this.targetAimHelperTexture = "aim_bow_fire";
          // }
          if ( this.targetAimTexture === "aim_close" ) {
            this.targetAimTexture = "aim_close_fire";
          }
          if ( this.targetAimTexture === "aim_bow" ) {
            this.targetAimTexture = "aim_bow_fire";
          }
        }

      }
      else {
        this.targetAimTexture = "redglow";
      }

      if ( le("globalEnable") ) {
        this.targetAimTexture = "aim_editor";
        // this.targetAimHelperTexture = "";
      }

    }

    if ( isHoveringHud || this.health <= 0 ) this.targetAimTexture = "blank";

     if ( this.aimTexture != this.targetAimTexture ) {

      this.DestroyAimMesh();

      this.aimTexture = this.targetAimTexture;

      if ( this.aimTexture !== "" ) {
        this.aimMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1),
          textureHandler.GetTexture('images/misc/'+this.aimTexture+'.png', false, {
            transparent:true,
            alphaTest:0.1
          }));
        //this.shadowMesh.geometry.dynamic = true;

        this.aimMesh.rotation.x = -Math.PI/2;

        this.aimMesh.position.copy(this.aimMeshPosition);

        ironbane.scene.add(this.aimMesh);
      }
    }

    if ( this.aimMesh && currentMouseToWorldData ) {
      //this.aimMesh.position = point.add(currentMouseToWorldData.face.normal.clone().normalize().multiplyScalar(0.05));
      this.aimMeshPosition.lerp(point.add(currentMouseToWorldData.face.normal.clone().normalize().multiplyScalar(0.05)), dTime*20);
      this.aimMesh.position.copy(this.aimMeshPosition);
      this.aimMesh.LookFlatAt(currentMouseToWorldData.face.normalWithRotations.clone().add(this.aimMesh.position));
    }





    // Helper
    // if ( this.aimHelperTexture != this.targetAimHelperTexture ) {

    //   this.DestroyAimHelperMesh();

    //   this.aimHelperTexture = this.targetAimHelperTexture;

    //   if ( this.aimHelperTexture !== "" ) {
    //     this.aimHelperMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1),
    //       textureHandler.GetTexture('images/misc/'+this.aimHelperTexture+'.png', false, {
    //         transparent:true,
    //         alphaTest:0.1
    //       }));
    //     //this.shadowMesh.geometry.dynamic = true;

    //     this.aimHelperMesh.rotation.x = -Math.PI/2;

    //     this.aimHelperMesh.position.copy(this.aimHelperMeshPosition);

    //     ironbane.scene.add(this.aimHelperMesh);
    //   }
    // }

    if ( this.aimHelperMesh && currentMouseToWorldData ) {
      //this.aimHelperMesh.position = point.add(currentMouseToWorldData.face.normal.clone().normalize().multiplyScalar(0.05));
      this.aimHelperMesh.position.copy(this.aimHelperMeshPosition);
      //this.aimHelperMesh.LookFlatAt(new THREE.Vector3(0,1,0));
    }


    if ( showEditor && levelEditor.editorGUI.chFlyMode ) {
      this.allowRaycastGround = false;
    }


    this._super(dTime);

  },
  SendData: function() {

    // Don't send heavy packets

    // Make a list of all NPC's in line of sight
    var npcLOS = [];

    var ourpos = ironbane.player.position.clone().add(new THREE.Vector3(0, 0.5, 0));

    // Do a raycast for each NPC
    for(var u=0;u<ironbane.unitList.length;u++) {
      var unit = ironbane.unitList[u];

      if ( unit instanceof Fighter && unit.InRangeOfUnit(ironbane.player, 30) && unit.id < 0 ) {



        var dir = unit.position.clone().add(new THREE.Vector3(0, 0.5, 0)).sub( ourpos );
        // With a small offset to account for NPCs stuck in walls
        var distance = dir.length() - 0.5;
        var ray = new THREE.Raycaster( ourpos, dir.clone().normalize(), 0, distance );


        var intersects = terrainHandler.RayTest(ray, {
          testMeshesNearPosition: unit.position,
          extraRange: distance,
          unitReference: this,
          unitRayName: "los"
        });

        if (intersects.length === 0) {
          // In line of sight!
          npcLOS.push(unit.id);
        }

      }
    }

    var data = {
      p: this.object3D.position.clone().Round(2),
      r: this.targetRotation.y.Round(2),
      //s: this.speed.Round(2),
      los: npcLOS
    };

    if ( this.unitStandingOn ) data.u = this.unitStandingOn.id;

    socketHandler.socket.emit('playerdata', data);


  },
  AttemptAttack: function(position) {
    var player = this;

    if (player.attackTimeout > 0.0) {
      return;
    }

    var rotTest = player.heading.dot(ConvertVector3(position).sub(player.position).normalize());
    if (rotTest < -0.5) {
      return;
    }

    var weapon = player.GetEquippedWeapon();

    if (weapon) {
      var template = items[weapon.template];
      if (template.type === 'weapon') {
        // Don't return if out of range, instead adjust the position where we're
        // shooting at
        if (DistanceSq(position, player.position) > Math.pow(WeaponRanges[template.subtype], 2)) {
          var playerToPoint = position.clone().sub(player.position);
          playerToPoint.normalize().multiplyScalar(WeaponRanges[template.subtype]);
          position = player.position.clone().add(playerToPoint);
        }

        var newDelay = template.delay;
        // Send the projectile
        socketHandler.socket.emit('addProjectile', {
          s: player.position.clone().Round(2),
          t: position.clone().Round(2),
          w: weapon.id,
          o: player.id,
          sw: true
        }, function(reply) {
          //console.log('addProjectile reply', reply);
          if (!_.isUndefined(reply.errmsg)) {
            hudHandler.MessageAlert(reply.errmsg);
            // hudHandler.ShowMenuScreen();
            return;
          }

          if(reply.delay) {
            newDelay = reply.delay;
          } else {
            //console.log('shoot dammit');
            // don't actually fire the projectile locally until OK'd
            var particle = template.particle;
            var proj = new Projectile(player.position.clone().add(player.side.clone().multiplyScalar(0.4)), position.clone(), player);
            proj.velocity.add(player.velocity);
            ironbane.unitList.push(proj);
            player.SwingWeapon(null, template);
          }

          // either way wait to set delay until after reply
          player.attackTimeout = newDelay;
        });
      }
    }
  },
  UseItem: function(barIndex) {

    if ( this.health <= 0 ) {
      bm("You are dead!");
      return;
    }

    // Check if an item is present
    var item = hudHandler.FindItemBySlot(barIndex, false);
    if ( item ) {

      var template = items[item.template];

      switch (template.type) {
        case 'consumable':
          // Set to equipped
          item.equipped = item.equipped ? 0 : 1;



          // Send a request to equipment
          // Other players will update the view
          //this.UpdateAppearance();

          // Remove the consumable
          socketHandler.playerData.items = _.without(socketHandler.playerData.items, item);


          // Update the HUD
          (function(item, template){
            $('#ii'+item.id).animate({
              width:2,
              height:2,
              top:'+=25',
              left:'+=25'
            }, 400, function() {


              if ( currentHoverDiv == 'ii'+item.id ) {
                $('#tooltip').hide();
                setTimeout(function(){
                  $('#tooltip').hide();
                }, 500);
              }

              $('#ii'+item.id).remove();



              switch (template.subtype) {
                 case 'cash':
            soundHandler.Play(ChooseRandom(["getCoin1","getCoin2", "getCoin3"]), this.position);
            break;
                case "restorative":
                  soundHandler.Play(ChooseRandom(["bubble1", "bubble2", "bubble3"]));
                  break;
              }

            });
          })(item, template);

          break;
        case 'armor':

          _.each(socketHandler.playerData.items, function(i) {
            if ( items[i.template].type == 'armor' &&
              items[i.template].subtype == items[item.template].subtype
              && i != item) {
              i.equipped = 0;
            }
          });

          // Set to equipped
          item.equipped = item.equipped ? 0 : 1;

          soundHandler.Play(item.equipped ? "equip/equip1" : "equip/equip2");

          // Send a request to equipment
          // Other players will update the view
          this.UpdateAppearance();

          break;
        case 'weapon':
        case 'tool':

          // Unequip all weapons we already have equipped (since we can have only one active)
          _.each(socketHandler.playerData.items, function(i) {
            if ( (items[i.template].type == 'weapon' || items[i.template].type == 'tool') && i != item) {
              i.equipped = 0;

              if ( items[i.template].subtype == 'book' ) hudHandler.HideBook();

              if ( items[i.template].subtype == 'map' ) hudHandler.HideMap();

            }
          });

          // Set to equipped
          item.equipped = item.equipped ? 0 : 1;


          soundHandler.Play(item.equipped ? "equip/equip1" : "equip/equip2");

          switch (template.subtype) {
            case 'sword':
            case 'dagger':
            case 'axe':
              // soundHandler.Play(item.equipped ? ChooseRandom(["equipSword1","equipSword2","equipSword3"]) : "equip2");
              break;

            case 'book':

              if (item.equipped) {
                $.get('/api/books/' + item.attr1)
                  .done(function(response) {
                    if (!item.equipped) {
                      return;
                    }

                    hudHandler.ShowBook(response.text);
                  })
                  .fail(function(err) {
                    hudHandler.MessageAlert(err.responseText);
                  });
              } else {
                hudHandler.HideBook();
              }

              // soundHandler.Play(item.equipped ? "equip1" : "equip2");

              break;
            case 'map':

              if ( item.equipped ) {
                  hudHandler.ShowMap();
              }
              else {
                hudHandler.HideMap();
              }

              // soundHandler.Play(item.equipped ? "equip1" : "equip2");

              break;

            default:
              // soundHandler.Play(item.equipped ? "equip1" : "equip2");
              break;
          }

          // Update the weapon we are carrying
          this.UpdateWeapon(item.equipped ? template.id : 0);

          break;
      }


      hudHandler.UpdateEquippedItems();

      socketHandler.socket.emit('useItem', barIndex, function (reply) {

        if ( !_.isUndefined(reply.errmsg) ) {
          hudHandler.ReloadInventory();
          hudHandler.MessageAlert(reply.errmsg);
          return;
        }

      });

    }



  },
  GetEquippedWeapon: function() {

    for(var i=0;i<socketHandler.playerData.items.length;i++) {
      var item = socketHandler.playerData.items[i];

      var template = items[item.template];

      if ( item.equipped && (template.type == 'weapon' || template.type == 'tool')) {
        return item;
      }
    }

    return null;
  },
  UpdateAppearance: function() {

    this.appearance.skin = socketHandler.playerData.skin;
    this.appearance.eyes = socketHandler.playerData.eyes;
    this.appearance.hair = socketHandler.playerData.hair;
    this.appearance.head = 0;
    this.appearance.body = 0;
    this.appearance.feet = 0;

    for(var i=0;i<socketHandler.playerData.items.length;i++) {
      var item = socketHandler.playerData.items[i];

      var template = items[item.template];

      if ( item.equipped ) {

        if ( template.type == 'armor' ) {

          switch (template.subtype) {
            case 'head':
              this.appearance.head = template.image;
              break;
            case 'body':
              this.appearance.body = template.image;
              break;
            case 'feet':
              this.appearance.feet = template.image;
              break;
          }

        }
      }
    }

    this.UpdateClothes();

  },
  UpdateMouseProjectedPosition: function() {
    if ( !ironbane.player ) return;

    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
    ironbane.projector.unprojectVector( vector, ironbane.camera );

    var ray = new THREE.Raycaster( ironbane.camera.position, vector.sub( ironbane.camera.position ).normalize() );

    var intersects = terrainHandler.RayTest(ray, {
      testMeshesNearPosition:this.position,
      extraRange: 20,
      allowBillboards: true,
      unitReference: this,
      unitRayName: "mouse"
    });

    lastMouseToWorldData = currentMouseToWorldData;

    if (intersects.length > 0) {
      currentMouseToWorldData = intersects[0];
    }
    else {
      currentMouseToWorldData = null;
    }


    //            if ( currentMouseToWorldData ) {
    //
    //                debug.DrawVector(currentMouseToWorldData.face.normal, currentMouseToWorldData.point, 0xFF00FF);
    //
    //
    //
    //            sw("currentMouseToWorldData.point", currentMouseToWorldData.point);
    //            }

    if ( le("globalEnable") && lastMouseToWorldData != currentMouseToWorldData ) {
      levelEditor.BuildPreviewBuildMesh();
    }

  },
  ShowTutorial:function(id) {
    $(".ib-tutorial").addClass("tut"+id);
  },
  HideTutorial:function(id) {
    $(".ib-tutorial").removeClass("tut"+id);
  }
});
