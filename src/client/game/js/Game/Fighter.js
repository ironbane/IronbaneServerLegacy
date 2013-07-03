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


var charactersSpritePath = 'plugins/game/images/characters/';
var NPCSpritePath = 'plugins/game/images/npcs/';


var rotation_speed = 100;

var fighterAcceleration = 20;
var fighterFriction = 3;
var fighterMaxSpeed = 5;

var attackSwingTime = 0.5;
var walkSoundTime = 0.4;
var meleeTime = 0.3;

var Fighter = Unit.extend({
  Init: function(position, rotation, id, name, param, size, health, armor, healthMax, armorMax) {
    this.npctype = name;
    health = health || 0;
    healthMax = healthMax || 0;
    armor = armor || 0;
    armorMax = armorMax || 0;


    this.drawNameMesh = id > 0 && !(this instanceof Player) ? true : false;


    if ( id < 0 && showEditor && levelEditor.editorGUI.opShowDebug ) {
        this.drawNameMesh = true;
        this.overrideName = Math.abs(id);
    }

//    if ( local && debugging ) {
//      this.drawNameMesh = true;
//      name = name+": "+id;
//    }

    this._super(position, rotation, id, name, param, size);

    this.SpriteStatusEnum = {
      STAND : 0,
      WALK : 1,
      FIGHT : 2,
      CAST : 3
    };

    this.spriteStatus = this.SpriteStatusEnum.STAND;
    this.spriteForward = true;

this.walkSoundTimer = 0.0;


    this.spriteStep = 0;
    this.walkSpriteTimer = 0.0;


    this.attackStateTimer = 0.0;
    this.attackTimeout = 0.0;

    this.targetFactor = 0;

    this.meleeHitTimer = 0.0;
    this.meleeHitPosition = new THREE.Vector3();

    this.meleeAttackTimer = 0.0;
    this.meleeAttackPosition = new THREE.Vector3();


    this.deathTimer = 0.0;
    this.dead = false;

    this.health = health;
    this.healthMax = healthMax;
    this.armor = armor;
    this.armorMax = armorMax;

    this.appearance = {};
    this.appearance.skin = 0;
    this.appearance.hair = 0;
    this.appearance.head = 0;
    this.appearance.body = 0;
    this.appearance.feet = 0;



    // Used for size calculation
    this.meshHeight = 1.0;

    this.lastJumpTimer = 0;


    this.spriteIndex = 0;

    (function(unit){
      setTimeout(function(){
        if ( unit.health <= 0 ) unit.Die(true);
      }, 0);
    })(this);
  },
  Add: function() {




    //this.UpdateWeapon();
    //this.UpdateClothes();

    this._super();



  },
  Destroy: function() {


    //        if ( this.weaponMesh ) {
    //            ironbane.scene.remove(this.weaponMesh);
    //        }

    if ( this.weaponOrigin ) {
      ironbane.scene.remove(this.weaponOrigin);
    }

    this._super();

  },
  UpdateClothes: function() {


    // Check if we're a player
    //        if ( this.id > 0 ) {

      var me = this;



    getCharacterTexture(me.appearance, function(texture) {

      var directionSpriteIndex = me.GetDirectionSpriteIndex();


    //        }
    //        else  {
    //            texture = NPCSpritePath + ''+this.param+'.png';
    //        }


      if ( me.mesh ) {
        ironbane.scene.remove(me.mesh);
        me.mesh = null;
      }

      var planeGeo = new THREE.PlaneGeometry(1.0, 1.0, 1, 1);

      me.meshHeight = 1.0;

      // Assign material
      //
      //        // Clear UV
      //        planeGeo.faceUvs = [[]];
      //        planeGeo.faceVertexUvs = [[]];

      // planeGeo.faceUvs[0].push(new THREE.UV(0,1));
      // planeGeo.faceVertexUvs[0].push(faceuv);

      var uniforms = {
        uvScale : {
          type: 'v2',
          value: new THREE.Vector2(1,1)
        },
        size : {
          type: 'v2',
          value: new THREE.Vector2(1,1)
        },
        hue : {
          type: 'v3',
          value: new THREE.Vector3(1,1,1)
        },
        vSun : {
          type: 'v3',
          value: new THREE.Vector3(0,0,0)
        },
        texture1 : {
          type: 't',
          value: textureHandler.GetFreshTexture( texture, true )
        }
      };

      var shaderMaterial = new THREE.ShaderMaterial({
        uniforms : uniforms,
        vertexShader : $('#vertex').text(),
        fragmentShader : $('#fragment').text(),
        //transparent : true,
        alphaTest: 0.5
      });

      //shaderMaterial = new THREE.MeshBasicMaterial( { map: textureHandler.GetTexture( texture ), alphaTest: 0.5, transparent: true } );

      if ( stealth ) shaderMaterial.wireframe = true;

      //shaderMaterial.wireframe = true;

      //        planeGeo.materials = [shaderMaterial];
      //        planeGeo.faces[0].materialIndex = 0;





      me.mesh = new THREE.Mesh(planeGeo, shaderMaterial);

      me.mesh.material.side = THREE.DoubleSide;

      me.mesh.unit = me;


      me.mesh.geometry.dynamic = true;

      ironbane.scene.add(me.mesh);

    });





  },
  UpdateWeapon: function(weapon) {




    if ( this.weaponOrigin ) {
      // Possible memory leak..which one to delete?
      ironbane.scene.remove(this.weaponOrigin);
      this.weaponOrigin = null;
      this.weaponMesh = null;
      this.weaponTemplate = null;
    }

    // Unequip?
    if ( weapon === 0 ) return;

    this.weaponTemplate = items[weapon];

    var imgWeapon = this.weaponTemplate.image;

    var texture = 'plugins/game/images/items/' + imgWeapon + '.png';


    planeGeo = new THREE.PlaneGeometry(0.6, 0.6, 1, 1);

    uniforms = {
      uvScale : {
        type: 'v2',
        value: new THREE.Vector2(1,1)
      },
      size : {
        type: 'v2',
        value: new THREE.Vector2(1,1)
      },
      hue : {
        type: 'v3',
        value: new THREE.Vector3(1,1,1)
      },
      vSun : {
        type: 'v3',
        value: new THREE.Vector3(0,1,0)
      },
      texture1 : {
        type: 't',
        value: textureHandler.GetTexture( texture, true )
      }
    };

    shaderMaterial = new THREE.ShaderMaterial({
      uniforms : uniforms,
      vertexShader : $('#vertex').text(),
      fragmentShader : $('#fragment').text(),
      //transparent : true,
      alphaTest: 0.5
    });

    if ( stealth ) shaderMaterial.wireframe = true;

    shaderMaterial.side = THREE.DoubleSide;
    //shaderMaterial.wireframe = true;

    //shaderMaterial = new THREE.MeshBasicMaterial( { map: textureHandler.GetTexture( texture ) , alphaTest: 0.5, transparent: true } );

    this.weaponMesh = new THREE.Mesh(planeGeo, shaderMaterial);




    //        this.weaponMesh.position.y = 0.3;
    //        this.weaponMesh.position.x = -0.3;

    this.weaponMesh.geometry.dynamic = true;

    this.weaponOrigin = new THREE.Object3D();

    this.weaponPivot = new THREE.Object3D();

    this.weaponOrigin.add(this.weaponPivot);

    this.weaponPivot.add(this.weaponMesh);

    ironbane.scene.add(this.weaponOrigin);

  },
  Tick: function(dTime) {


    // When are we allowed to jump?
    if ( this.lastJumpTimer > 0 ) this.lastJumpTimer -= dTime;

    // Update speed (used for walking animations
    if ( !(this instanceof Player) ) {
      //            var targetVelX = (this.targetPosition.x-this.localPosition.x)/dTime/10;
      //            var targetVelZ = (this.targetPosition.z-this.localPosition.z)/dTime/10;
      //this.speed = this.fakeVelocity.length();

      //this.speed = (new THREE.Vector3(targetVelX, 0, targetVelZ)).length();

      var bogusVelocity = this.oldPosition.clone().subSelf(this.localPosition).divideScalar(dTime);

      this.fakeVelocity.copy(bogusVelocity);
      this.fakeVelocity.multiplyScalar(-1);

      bogusVelocity.y = 0;

      this.speed = bogusVelocity.length();



    //sw("TEST speed", this.speed);
    }





    if ( this.attackStateTimer > 0.0 ) this.attackStateTimer -= dTime;
    if ( this.meleeHitTimer > 0.0 ) this.meleeHitTimer -= dTime;
    if ( this.meleeAttackTimer > 0.0 ) this.meleeAttackTimer -= dTime;
    if ( this.attackTimeout > 0.0 ) this.attackTimeout -= dTime;
    if (this.walkSoundTimer > 0.0 ) this.walkSoundTimer -= dTime;

    //        debug.SetWatch('speed', this.speed);
    //        debug.SetWatch(this.id+': name', this.name);
    //debug.SetWatch(this.id+': speed', this.speed);
    //        debug.SetWatch(this.id+': targetSpeed', this.targetSpeed);
    //debug.SetWatch(this.id+': targetPosition', this.targetPosition.ToString());
    //debug.SetWatch(this.id+': velocity', this.velocity.ToString());



    if ( this.meleeHitTimer <= 0 && this.meleeAttackTimer <= 0 ) {
      // Reset position
      if ( !this.renderOffset.isZero() ) {
        this.renderOffset.set(0,0,0);
      }
    }
    else {

      if ( this.meleeHitTimer > 0 ) {
        this.renderOffsetMultiplier = this.meleeHitTimer/meleeTime;
      }
      if ( this.meleeAttackTimer > 0 ) {
        this.renderOffsetMultiplier = this.meleeAttackTimer/(meleeTime*1);
      }


      if ( this.renderOffsetMultiplier > 1 ) this.renderOffsetMultiplier = 1-(this.renderOffsetMultiplier-1);

      this.renderOffsetMultiplier = Math.sin(this.renderOffsetMultiplier*Math.PI);
    }


    this.lastSpriteIndex = this.spriteIndex;
    this.spriteIndex = this.GetDirectionSpriteIndex();



    if ( this.mesh ) {
      this.mesh.LookAt(ironbane.camera.position, 0, 0, 0, true);



      this.mesh.material.uniforms.hue.value.set(1,1,1);

      if ( this.meleeHitTimer > 0 ) {
        this.mesh.material.uniforms.hue.value.y -= (this.meleeHitTimer/meleeTime);
        this.mesh.material.uniforms.hue.value.z -= (this.meleeHitTimer/meleeTime);
      }

      if ( this.meleeAttackTimer > 0 ) {
        //this.mesh.material.uniforms.hue.value.y -= (this.meleeAttackTimer/meleeTime)/2*2.0;
        this.mesh.material.uniforms.hue.value.y -= (this.meleeAttackTimer/(meleeTime*1))*1.0;
        this.mesh.material.uniforms.hue.value.z -= (this.meleeAttackTimer/(meleeTime*1))*2.0;
      }

      if ( terrainHandler.skybox ) this.mesh.material.uniforms.vSun.value.copy(terrainHandler.skybox.sunVector);

      var max = parseInt(this.healthMax/3, 10);

      if ( this.health < max ) {

        var mp = 0.5+(Math.cos(new Date().getTime()/1000*(5))/2);

        //debug.SetWatch('mp', mp.Round(2));


        this.mesh.material.uniforms.hue.value.y = mp;
        this.mesh.material.uniforms.hue.value.z = mp;
      }
    }


    //        this.health -= dTime * 0.1;
    //
    //        if ( this.health < 0 ) this.health = 1.00;

    if ( this.health > 0 ) {
      this._super(dTime);

      var radians = (this.rotation.y + 90) * (Math.PI/180);
      this.heading.x = Math.sin(radians);
      this.heading.z = Math.cos(radians);
      this.side = this.heading.clone().Perp();
    }


    if ( this.weaponMesh ) {

      var firstPerson = (this instanceof Player) && this.cameraStatus == CameraStatusEnum.FirstPerson;

      var offset = new THREE.Vector3(0.0, firstPerson ? 0.25 : 0, firstPerson ? -0.5 : 0);
      var front = true;

      var holdingDistance = 0.0;
      var holdingHeight = 0.0;

      var targetWalkAngleZ1 = 45;
      var targetWalkAngleZ3 = 20;

      var targetWalkOffsetX1 = 0;
      var targetWalkOffsetX3 = 0;

      var scaleX = 1.0;
      var scaleY = 1.0;

      var rotateX = 0.0;
      var rotateY = 0.0;
      var rotateZ = 0.0;

      var pivotX = 0.25;
      var pivotY = 0.25;

      var time = (new Date()).getTime()/1000.0;

      var swingXamount = 0;
      var swingYamount = 0;
      var swingZamount = 0;

      var weaponSpriteIndex = this.spriteIndex;

      if ( firstPerson ) weaponSpriteIndex = 0;

      var pointDirection = null;
      if ( this instanceof Player && currentMouseToWorldData) {
        pointDirection = ConvertVector3(currentMouseToWorldData.point).subSelf(this.position).normalize();
      }

      switch(weaponSpriteIndex) {
        case 0:
          holdingDistance = 0.28;
          holdingHeight = 0.25;
          front = false;
          scaleX = 0.7;
          //                    scaleY = 0.8;

          var rotTest = pointDirection && this.heading.dot(pointDirection) > 0 ? this.side.dot(pointDirection) : 0;
          rotateZ = -rotTest*20;

          swingXamount = -120;
          break;
        case 1:
          holdingDistance = 0.30;
          holdingHeight = 0.22;
          front = false;
          scaleY = 0.85;
          scaleX = 0.85;
          rotateY = 40;
          targetWalkAngleZ1 = 30;
          targetWalkAngleZ3 = -30;
          targetWalkOffsetX1 = 0.0;
          targetWalkOffsetX3 = -0.15;
          swingZamount = -90;

          var rotTest = pointDirection && this.heading.dot(pointDirection) > 0 ? this.side.dot(pointDirection) : 0;
          rotateY = 40-rotTest*20;
          break;
        case 2:
          holdingDistance = -0.06;
          holdingHeight = 0.22;
          front = true;

          targetWalkAngleZ1 = -30;
          targetWalkAngleZ3 = 30;

          rotateY = -10;
          rotateX = 10;

          offset.z = -0.015;

          targetWalkOffsetX1 = 0.05;
          targetWalkOffsetX3 = -0.15;
          swingZamount = -90;


          break;
        case 3:
          holdingDistance = -0.06;
          holdingHeight = 0.22;

          front = true;

          rotateY = -40;
          rotateX = 0;

          offset.z = -0.005

          targetWalkAngleZ1 = -30;
          targetWalkAngleZ3 = 30;

          targetWalkOffsetX1 = -0.25;
          targetWalkOffsetX3 = 0.05;

          swingZamount = -90;
          break;
        case 4:
          holdingDistance = -0.35;
          holdingHeight = 0.3;
          front = true;
          scaleX = 0.7;
          rotateX = 20;
          targetWalkAngleZ1 = 45;
          targetWalkAngleZ3 = 20;

          pivotX = 0.15;
          pivotY = 0.15;

          swingXamount = 90;
          break;
        case 5:
          holdingDistance = -0.2;
          holdingHeight = 0.28;
          front = false;
          scaleX = 0.85;
          rotateY = 220;

          targetWalkAngleZ1 = 30;
          targetWalkAngleZ3 = -30;

          swingZamount = -90;
          break;
        case 6:
          holdingDistance = -0.04;
          holdingHeight = 0.22;
          front = false;

          targetWalkAngleZ1 = -30;
          targetWalkAngleZ3 = 30;

          rotateY = 170;
          rotateX = 0;


          targetWalkOffsetX1 = -0.05
          targetWalkOffsetX3 = 0.05;

          swingZamount = -90;
          break;
        case 7:
          holdingDistance = 0.20;
          holdingHeight = 0.22;
          front = false;
          scaleY = 0.85;
          scaleX = 0.85;
          rotateY = 170;
          targetWalkAngleZ1 = 30;
          targetWalkAngleZ3 = -30;
          targetWalkOffsetX1 = -0.05;
          targetWalkOffsetX3 = -0.15;
          offset.z -= 0.1;

          swingZamount = -90;

          var rotTest = pointDirection && this.heading.dot(pointDirection) > 0 ? this.side.dot(pointDirection) : 0;
          rotateY += -20-rotTest*20;
          break;
      }


      holdingHeight *= this.size;
      holdingDistance *= this.size;

      scaleX *= this.size;
      scaleY *= this.size;

      // offset.multiplyScalar(this.size);


      var targetWalkAngleZ2 = (targetWalkAngleZ1 + targetWalkAngleZ3)/2;
      var targetWalkOffsetX2 = (targetWalkOffsetX1 + targetWalkOffsetX3)/2;


      var targetWalkOffsetX = 0;
      var targetWalkAngleZ = 0;
      switch (this.spriteStep) {
        case 0:
          targetWalkAngleZ = targetWalkAngleZ1;
          targetWalkOffsetX = targetWalkOffsetX1;
          break;
        case 1:
          targetWalkAngleZ = targetWalkAngleZ2;
          targetWalkOffsetX = targetWalkOffsetX2;
          break;
        case 2:
          targetWalkAngleZ = targetWalkAngleZ3;
          targetWalkOffsetX = targetWalkOffsetX3;
          break;
      }







      var roffset = this.renderOffset.clone().multiplyScalar(this.renderOffsetMultiplier);
      var renderPosition = this.position.clone().addSelf(roffset);






      // For dynamic effect



          //.subSelf(weaponLocation);

      // if ( this.attackStateTimer < 0 ) this.attackStateTimer = 0;

      // var weaponSwingDistance = (this.attackStateTimer/attackSwingTime)*2;

      // if ( weaponSwingDistance > 1 ) weaponSwingDistance = 2 - weaponSwingDistance;

      // sw("weaponSwingDistance ", weaponSwingDistance );




      // this.weaponOrigin.position = renderPosition.lerpSelf(this.meleeHitPosition, weaponSwingDistance);

      this.weaponOrigin.position = renderPosition;


      //this.weaponMesh.material.uniforms.hue.value.x = 1+(this.attackStateTimer/attackSwingTime);
      this.weaponMesh.material.uniforms.hue.value.y = 1-(this.attackStateTimer/attackSwingTime);
      this.weaponMesh.material.uniforms.hue.value.z = 1-(this.attackStateTimer/attackSwingTime);

      if ( terrainHandler.skybox ) this.weaponMesh.material.uniforms.vSun.value.copy(terrainHandler.skybox.sunVector);

      //debug.SetWatch("targetWalkAngleZ", targetWalkAngleZ);


      DisplayUVFrame(this.weaponMesh, 0, 0, 1, 1, false);


      //this.weaponPivot.rotation.z = Math.cos(time);

      var direct = false;

      var speed = 8;
      if ( this.lastSpriteIndex != this.spriteIndex ) direct = true;

      //if ( firstPerson ) direct = true;


      var swingRotation = (this.attackStateTimer*2)/attackSwingTime;
      if ( swingRotation > 1 ) swingRotation = 2 - swingRotation;
      if ( swingRotation <= 0 ) swingRotation = 0;
      //debug.SetWatch("swingRotation", swingRotation);

      this.weaponPivot.rotation.x = ((swingRotation*swingXamount)+rotateX).ToRadians();
      this.weaponPivot.rotation.y = ((swingRotation*swingYamount)+rotateY).ToRadians();

      var offsetMultiplier = 1.0;

      if (this.id < 0) offsetMultiplier = this.template.weaponoffsetmultiplier;

      var zPosition = ((front ? 0.02 : -0.02)*this.size*offsetMultiplier)+offset.z;

      if ( direct ) {
        this.weaponPivot.rotation.z = ((swingRotation*swingZamount)+rotateZ+targetWalkAngleZ).ToRadians();

        this.weaponPivot.position.x = holdingDistance+targetWalkOffsetX+offset.x;
        this.weaponPivot.position.y = holdingHeight+offset.y;
        this.weaponPivot.position.z = zPosition+offset.z;
      }
      else {
        this.weaponPivot.rotation.z = (this.weaponPivot.rotation.z.Lerp(((swingRotation*swingZamount)+rotateZ+targetWalkAngleZ).ToRadians(), dTime*speed));

        this.weaponPivot.position.x = this.weaponPivot.position.x.Lerp(holdingDistance+targetWalkOffsetX+offset.x, dTime*speed);
        this.weaponPivot.position.y = this.weaponPivot.position.y.Lerp(holdingHeight+offset.y, dTime*speed);
        this.weaponPivot.position.z = this.weaponPivot.position.z.Lerp(zPosition, dTime*speed);
      }

      this.weaponMesh.rotation.x = 0;
      this.weaponMesh.rotation.y = 0;
      this.weaponMesh.rotation.z = 0;

      this.weaponMesh.position.x = pivotX;
      this.weaponMesh.position.y = pivotY;
      this.weaponMesh.position.z = 0;

      this.weaponMesh.scale.x = scaleX;
      this.weaponMesh.scale.y = scaleY;

      this.weaponOrigin.LookAt(ironbane.camera.position, 0, 0, 0, true);

    }





    //        if ( this.lastJumpTimer <= 0 ) {
    //            this.lastJumpTimer = 3;
    //            this.SwingWeapon(null);
    //        }


    // this needs partly be moved to Player.js for slight performance improvements

    if ( this.speed > 0.1 ) {
      this.spriteStatus = this.SpriteStatusEnum.WALK;
      if(this.walkSoundTimer <= 0 ) {
        if(this instanceof Player) {
          //soundHandler.Play("Footsteps");
      }
      this.walkSoundTimer = walkSoundTime;
    }
    }
    else {
      this.spriteStatus = this.SpriteStatusEnum.STAND;
    }

    //        this.spriteStatus = this.SpriteStatusEnum.WALK;
    //        var tempSpeed = 0.5;

    //var oldSpriteIndex = this.spriteStep;

    this.walkSpriteTimer += dTime / this.size;

    //        this.speed = 2.0;
    //        this.spriteStatus = this.SpriteStatusEnum.WALK;

    if ( this.spriteStatus == this.SpriteStatusEnum.WALK && Math.abs(this.speed) > 0.1) {
      var stepFactor = (parseFloat(Math.abs(this.speed))/5.0);


      //            stepFactor = Math.max(stepFactor, 0.1);
      stepFactor = Math.min(stepFactor, 1.0);
      stepFactor = 1.0 - stepFactor;
      stepFactor = Math.max(stepFactor, 0.1);

      //debug.SetWatch('stepFactor', stepFactor);

      if ( this.walkSpriteTimer > stepFactor ) {
        this.walkSpriteTimer = 0.0;
        if ( this.spriteForward ) {
          this.spriteStep++;
          if ( this.spriteStep >= 2 ) this.spriteForward = false;
        }
        else if ( !this.spriteForward ) {
          this.spriteStep--;
          if ( this.spriteStep <= 0 ) this.spriteForward = true;
        }
      }
    }
    else if ( this.spriteStatus == this.SpriteStatusEnum.STAND ) {
      this.spriteStep = 1;
    }

    if ( this.mesh ) {
      this.DisplayUVFrame(this.spriteStep, this.spriteIndex, 3, 8);
    }
  //debug.SetWatch('spriteStep', this.spriteStep);
  },
  SwingWeapon: function(pos, weapon) {



    //        if ( !pos ) pos = this.position;
    //pos = null;



    if ( this.attackStateTimer > 0 ) return;

    this.meleeHitPosition = null;

    if ( !this.weaponMesh ) {
      this.DoMeleeHitAnimation(pos, 0.5);
    }
    // else {
    //   this.DoMeleeHitAnimation(this.position.clone().addSelf(this.heading), 0.5);
    // }


    if ( weapon ) {



      switch (weapon.subtype) {
        case 'bow':
          soundHandler.Play("battle/fireArrow", this.position);
          break;
        case 'staff':
          soundHandler.Play("battle/fireStaff", this.position);
          break;
        default:
          soundHandler.Play("battle/swing", this.position);
          break;
      }
    }

    // this.meleeHitPosition = pos;
    // this.meleeHitPosition.y += 0.5;

    //        if ( pos ) {
    //            this.meleeHitPosition = pos.clone();
    //        }
    //        else {
    //            this.meleeHitPosition.set(0, 0, 0);
    //        }

    this.attackStateTimer = attackSwingTime;

  },
  Jump: function() {

    if ( this.terrainAngle > 45 && this.position.y > GetZoneConfig('fluidLevel') ) return;

    this.velocity.y = 5;
    if(this.position.y < GetZoneConfig('fluidLevel')) {
      this.velocity.y = 2;
    }

    this.lastJumpTimer = 1.0;

    this.allowCheckGround = false;

    this.allowJump = false;

    // if(this.template.type !== UnitTypeEnum.PLAYER) {
    //   soundHandler.Play(this.npctype + "/jump", this.position);
    // }
    // else
    // {
    //   soundHandler.Play("player/jump/", this.position);
    // }

    soundHandler.Play("jump", this.position);
  },
  DoMeleeHitAnimation: function(position, power) {

    power = power || 0.3;

    this.meleeAttackTimer = meleeTime * (0.5 + (power / 2)) * 1;

    var force = this.position.clone().subSelf(position).normalize().multiplyScalar(-power);
//    force.y  = power;

    this.renderOffset = force;

  },
  GetMeleeHit: function(attacker, power) {


    if ( attacker ) {
      // Don't get hit by healing spells
      if ( attacker.id > 0 && this.id > 0 ) return;


      // We can't hit dead people
      if ( this.dead ) return;


      attacker.SwingWeapon(this.position, attacker.weaponTemplate);


      power = power || 0.3;

      //this.noPositionUpdateTimer = 0.1;
      //this.isTouchingGround = false;

      this.meleeHitTimer = meleeTime * (0.5 + (power / 2));

      var force = this.position.clone().subSelf(attacker.position).normalize().multiplyScalar(power);
      force.y  = power;

      this.renderOffset = force;


      // if ( this.armor > 0 ) {
      //   soundHandler.Play("hit1", this.position);
      // }
      // else {
      //   soundHandler.Play("hit2", this.position);
      // }

      //        if ( attacker != ironbane.player && pos ) {
      //            attacker.SwingWeapon(pos);
      //        }
      //
    }

    if ( this.health <= 0 ) {

      this.playSound("die");

      this.Die();

    }
    else {
      this.playSound("hit");
    }


  },

  playSound: function(sound) {

    soundHandler.Play(sound, this.position);

    // if(this.template.type !== UnitTypeEnum.PLAYER) {
    //   soundHandler.Play("npcs/" +this.npctype + "/" + sound, this.position);
    // }
    // else
    // {
    //   soundHandler.Play("player/" + sound, this.position);
    // }

  },
  Die: function(noParticle) {
    noParticle = noParticle || false;

    this.mesh.visible = false;

    if ( this.weaponMesh ) {
      this.weaponMesh.visible = false;
    }

    if ( this.nameMesh ) {
      this.nameMesh.visible = false;
    }

    this.shadowMesh.visible = false;

    if ( !noParticle ) {
      particleHandler.Add(ParticleTypeEnum.DEATH, {
        followUnit:this
      });
    }

    this.dead = true;
    this.canMove = false;



    if ( this === ironbane.player ) {
      bm('<span style="color:red">You died.</span>');
      // setTimeout(function(){
      //   bm('<span style="color:lightgreen">Press Escape to go back to the main menu.</span>');
      // }, 6000);

      socketHandler.playerData.items = [];

      hudHandler.ReloadInventory();

      hudHandler.HideHUD();
    }



  },
  Respawn: function() {


    this.mesh.visible = true;

    if ( this.weaponMesh ) {
      this.weaponMesh.visible = true;
    }

    if ( this.nameMesh ) {
      this.nameMesh.visible = true;
    }

    if ( this.shadowMesh ) {
      this.shadowMesh.visible = true;
    }


  },
  SetHealth: function(newHealth, noParticles) {

    var damage = this.health - newHealth;
    this.health = newHealth;

    noParticles = noParticles || false;


    if ( !noParticles ) {

      var heal = false;

      if ( damage < 0 ) {
        heal = true;
      }

      damage = Math.abs(damage);

      var delay = 0;
      // Spawn all the normal hearts
      var fullHearts = Math.floor(damage);
      var halfHeart = false;
      if ( fullHearts % 2 == 1 ) {
        fullHearts--;
        halfHeart = true;
      }

      // Don't go too crazy
      fullHearts = Math.min(fullHearts, 100);

      for(var x=0;x<fullHearts/2;x++){
        (function(victim){
          setTimeout(function(){
            particleHandler.Add(heal ? ParticleTypeEnum.HEAL2 : ParticleTypeEnum.DAMAGE2, {
              followUnit:victim
            });
          }, delay)
          })(this);
        delay += 100;
        delay -= fullHearts * 2;

        delay = Math.max(delay, 10);
      }
      // Spawn all the half hearts
      if ( halfHeart ) {
        (function(victim){
          setTimeout(function(){
            particleHandler.Add(heal ? ParticleTypeEnum.HEAL1 : ParticleTypeEnum.DAMAGE1, {
              followUnit:victim
            });
          }, delay)
          })(this);
      }

    }


    if ( this == ironbane.player && damage > 0 ) {
      hudHandler.MakeHealthBar(true);
      setTimeout(function(){
        hudHandler.MakeHealthBar(true);
      },100);
    }
  },
  SetArmor: function(newArmor, noParticles) {

    var damage = this.armor - newArmor;
    this.armor = newArmor;

    noParticles = noParticles || false;


    if ( !noParticles ) {

      var heal = false;

      if ( damage < 0 ) {
        heal = true;
      }

      damage = Math.abs(damage);

      var delay = 0;
      // Spawn all the normal hearts
      var fullHearts = Math.floor(damage);
      var halfHeart = false;
      if ( fullHearts % 2 == 1 ) {
        fullHearts--;
        halfHeart = true;
      }

      // Don't go too crazy
      fullHearts = Math.min(fullHearts, 100);

      for(var x=0;x<fullHearts/2;x++){
        (function(victim){
          setTimeout(function(){
            particleHandler.Add(heal ? ParticleTypeEnum.ARMORHEAL2 : ParticleTypeEnum.ARMORHIT2, {
              followUnit:victim
            });
          }, delay)
          })(this);
        delay += 100;
        delay -= fullHearts * 2;

        delay = Math.max(delay, 10);
      }
      // Spawn all the half hearts
      if ( halfHeart ) {
        (function(victim){
          setTimeout(function(){
            particleHandler.Add(heal ? ParticleTypeEnum.ARMORHEAL1 : ParticleTypeEnum.ARMORHIT1, {
              followUnit:victim
            });
          }, delay)
          })(this);
      }



      if ( this == ironbane.player && damage > 0) {
        hudHandler.MakeArmorBar(true);
        setTimeout(function(){
          hudHandler.MakeArmorBar(true);
        },100);
      }
    }
  }
});





