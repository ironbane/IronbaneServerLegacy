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

var battleStatusTimeout = 10.0;



var Fighter = Actor.extend({
  Init: function(data) {

    this._super(data);

    this.sendRotationPacketY = true;

    this.respawnTimer = 0.0;

    // NPC's don't really have an items array, but nevertheless...
    if ( this.items === undefined ) this.items = [];

    // Health and armor are the same values for their maximum, only for bots
    // Initially, their values come from MySQL and are afterwards updated within the server without updating MySQL
    // The template values are used for Maximum values, and should never be changed

    if ( this.id < 0 ) {
      this.healthMax = this.template.health;
      this.armorMax = this.template.armor;
    }
    else {
      this.CalculateMaxHealth();
      this.CalculateMaxArmor();
    }

    this.health = this.healthMax;
    this.armor = this.armorMax;

    this.chGodMode = false;
    this.chInvisibleByMonsters = false;
    this.ch999Damage = false;



    this.UpdateAppearance(false);

    this.healthRegenTimeout = 0.0;
    this.healthRegenInterval = 1.0;

    this.armorRegenTimeout = 0.0;
    this.armorRegenInterval = 1.0;


    this.lastBattleActionTimer = 0.0;



  },
  IsInBattle: function() {
    return this.lastBattleActionTimer > 0;
  },
  ShootProjectile: function(targetPosition, swingWeapon, weaponID, aimError) {

      aimError = ISDEF(aimError) ? aimError : 0;

      // var offset = victim.velocity.clone().multiplyScalar(0.6);
      // var angle = getRandomFloat(0,getRandomFloat(0,1)) * Math.PI * 2;
      // offset.addSelf(new THREE.Vector3(Math.cos(angle)*aimError,
      //  0, Math.sin(angle)*aimError));

      var offset = new THREE.Vector3();
      // var angle = getRandomFloat(0,getRandomFloat(0,1)) * Math.PI * 2;
      // offset.addSelf(new THREE.Vector3(Math.cos(angle)*aimError,
      //  0, Math.sin(angle)*aimError));

      swingWeapon = ISDEF(swingWeapon) ? swingWeapon : true;
      weaponID = weaponID || this.weapon.id;

      this.EmitNearby("addProjectile", {
        s:this.position.clone().Round(2),
        t:targetPosition.clone().addSelf(offset).Round(2),
        o:this.id,
        w:weaponID,
        sw:swingWeapon
      });
  },
  AttemptAttack: function(victim) {

    // log("attempt attack");

    this.HandleMessage("attemptAttack", {});
    //if ( this.weapon.subtype == "bow" || this.weapon.subtype == "staff" ) {
    //if ( this.weapon.subtype == "bow" || this.weapon.subtype == "staff"  ) {
      // debugger;
    if ( this.template.usebashattack ) {
      this.Attack(victim, this.weapon);
      // this.SwingWeapon(victim.position);
    }
    else {
      //this.Attack(this.enemy, this.weapon);
      this.ShootProjectile(victim.position, true, 0, this.template.aimerror);

    }


  },
  Attack: function(victim, weapon) {

    this.lastBattleActionTimer = battleStatusTimeout;




    // Do damage
    //        if ( this.id > 0 ) {
    //            var template = dataHandler.items[weapon.template];
    //
    //        }

    var damage = this.ch999Damage ? 999 : weapon.attr1;

    if ( !victim.chGodMode ) {

      if ( damage > 0 ) {

        // 22/12/12 No more PvP... :(
        if ( this.id > 0 && victim.id > 0 ) return;


        var remaining = damage - victim.armor;
        victim.armor -= damage;

        if ( remaining > 0 ) {
          victim.health -= remaining;
        }

        victim.health = Math.max(victim.health, 0);
        victim.armor = Math.max(victim.armor, 0);

        this.HandleMessage("hurtTarget", {damage:damage});
      }
      else {
        victim.health += Math.abs(damage);

        victim.health = Math.min(victim.healthMax, victim.health);


        this.HandleMessage("healTarget", {damage:damage});
      }
    }


    victim.HandleMessage("attacked", {attacker:this});

    victim.EmitNearby("getMeleeHit", {
      victim:victim.id,
      attacker:this.id,
      h:victim.health,
      a:victim.armor
    }, 0, victim.id > 0); // Only send to ourselves when we are a player (id > 0)


    // Only update the timer if we were attacked, not healed
    if ( damage > 0 ) {
      victim.lastBattleActionTimer = battleStatusTimeout;
    }

    if ( victim.health <= 0 && victim.respawnTimer <= 0) {
      //victim.health = 20;
      victim.health = 0;

      // Reset NPC velocities, as they would otherwise keep going and change cells
      if ( victim.id < 0 ) {
        victim.velocity.set(0,0,0);
      }

      victim.Die(this);
      victim.respawnTimer = victim.id > 0 ? 10.0 : 30.0;


      // 22/12/12 Permadeath, no more respawning for players
      // if ( victim.id > 0 )  {

      //   victim.Delete();



      // }

    }

  },
  Tick: function(dTime) {

    if ( this.lastBattleActionTimer > 0 ) this.lastBattleActionTimer -= dTime;


    if ( this.health <= 0 ) {
      if ( this.respawnTimer > 0.0 ) {
        this.respawnTimer -= dTime;
      }

      if ( this.respawnTimer <= 0.0 ) {
        // 22/12/12: Permadeath for players
        // if ( this.id < 0 ) {
          this.Respawn();
        // }
      }
    }
    else {
      if ( this.healthRegenTimeout > 0 ) this.healthRegenTimeout -= dTime;

      if ( this.lastBattleActionTimer <= 0 ) {
        if ( this.healthRegenTimeout <= 0 ) {
          if ( this.healthRegenTimeout <= 0 ) {
            this.healthRegenTimeout = this.healthRegenInterval;
            this.SetHealth(this.health+1);
          }
        }
      }
      // Three seconds without being hit will recharge our armor
      if ( this.armorRegenTimeout > 0 ) this.armorRegenTimeout -= dTime;
      if ( this.lastBattleActionTimer <= battleStatusTimeout-3 ) {
        if ( this.armorRegenTimeout <= 0 ) {
          this.armorRegenTimeout = this.armorRegenInterval;
          this.SetArmor(this.armor+1);
        }
      }
    }

    //        log("Tick: "+this.id);
    //
    //        console.log(this.socket);

    // No additional ticking needed for players (physics are done on the client)
    if ( this.id > 0 ) return;


    this._super(dTime);

  },
  SetHealth: function(newHealth, noParticles) {
    var oldHealth = this.health;

    noParticles = noParticles || false;

    this.health = newHealth;

    this.health = Math.min(this.healthMax, this.health);


    if ( oldHealth != this.health ) {
      var data ={
        id:this.id,
        s:"h",
        h:this.health
        };
        if ( noParticles ) data.np = true;
      this.EmitNearby("setStat", data, 0, true);
    }
  },
  SetArmor: function(newArmor) {
    var oldArmor = this.armor;

    this.armor = newArmor;

    this.armor = Math.min(this.armorMax, this.armor);


    if ( oldArmor != this.armor ) {
      this.EmitNearby("setStat", {
        id:this.id,
        s:"a",
        a:this.armor
        }, 0, true);
    }
  },
  Die: function(killer) {

    if ( this.id < 0 ) {
      debugger;
      this.HandleMessage("killed", {killer:killer});

      if ( this.loot.length > 0 ) {
        var angle = getRandomFloat(0,1) * Math.PI * 2;

        log("spawning lootbag...");


        var bag = new Lootable({
          id: server.GetAValidNPCID(),
          x:this.position.x+Math.cos(angle),
          y:this.position.y,
          z:this.position.z+Math.sin(angle),
          zone:this.zone,

          // Hacky: refers to lootBag ID
          template:dataHandler.units[lootBagTemplate],

          roty:0
        }, false);

        for(var i=0;i<this.loot.length;i++) {
          var item = this.loot[i];

          item.owner = bag.id;
          // Add the item to the lootbag


//          // Make a copy of the item, so we don't remove the same item (reference)
//          // when we actually loot it as a player
          bag.loot.push(item);
        }

        console.log(bag);
      }


    }
    else {

      // Remove their items
      this.items = [];





      chatHandler.Died(this, killer);
    }


  },
  Respawn: function() {


    this.SetHealth(this.healthMax, true);
    this.SetArmor(this.armorMax, true);

    if ( this.id > 0 ) {
//      this.position = new THREE.Vector3(0, 0, 0);
//      this.zone = 1;
      //debugger;

      // People who die in the tutorial need to do it again
      if ( this.zone === 3 ) {
        this.Teleport(3, new THREE.Vector3(-8, 1, -14), true);
      }
      else {
        this.Teleport(1, new THREE.Vector3(0, 0, 0), true);
      }
    }
    else {
      if ( this instanceof NPC ) {
        this.SetWeaponsAndLoot();
      }
      this.position = this.startPosition.clone();


      this.HandleMessage("respawned", {});
    }

    log("Respawned "+this.id);

    // Send the client that it's okay to revert back
    this.EmitNearby("respawn", {
      id:this.id,
      p:this.position.clone().Round(2),
      z:this.zone,
      h:this.health
      }, 0, true);

    if ( this.id > 0 ) {
      // Give dull sword
      template = dataHandler.items[1];
      this.GiveItem(template);
    }

    if ( this.id < 0 ) {
      this.velocity.set(0,0,0);


    }


  },
  // Returns true when the max health changed
  CalculateMaxHealth: function(doEmit) {
    var oldHealthMax = this.healthMax;

    doEmit = doEmit || false;

    //        var healthMax = 20;

    //        for(var i in socketHandler.playerData.items) {
    //            var item = socketHandler.playerData.items[i];
    //
    //            var template = items[item.template];
    //
    //            if ( item.equipped ) {
    //
    //                if ( template.type == "armor" ) {
    //
    //                    healthMax += item.attr1;
    //
    //                }
    //            }
    //        }

    this.healthMax = 20;

    if ( doEmit && this.healthMax != oldHealthMax ) {
      this.EmitNearby("setStat", {
        id:this.id,
        s:"hm",
        hm:this.healthMax
        }, 0, true);
    }

    if ( this.health > this.healthMax ) {
      this.SetHealth(this.healthMax);
    }
  },
  // Returns true when the max armor changed
  CalculateMaxArmor: function(doEmit) {


    doEmit = doEmit || false;

    var oldArmorMax = this.armorMax;

    var armorMax = 0;

    for(var i=0;i<this.items.length;i++) {
      var item = this.items[i];

      var template = dataHandler.items[item.template];

      if ( item.equipped ) {

        if ( template.type == "armor" ) {

          armorMax += item.attr1;

        }
      }
    }

    this.armorMax = armorMax;

    if ( doEmit && this.armorMax != oldArmorMax ) {
      this.EmitNearby("setStat", {
        id:this.id,
        s:"am",
        am:this.armorMax
        }, 0, true);
    }

    if ( this.armor > this.armorMax ) {
      this.SetArmor(this.armorMax);
    }
  },
  GiveItem: function(template) {

    // Find a free slot
    var slot = -1;

    // Loop over 10 slots, and check if we have an item that matches that
    // slot
    for (var i = 0; i < 10; i++) {
      var found = false;

      _.each(this.items, function(item) {
        if ( item.slot === i ) found = true;
      });

      if ( !found ) {
        slot = i;
        break;
      }

    }


    if ( slot === -1 ) {
      return;
    }

    var item = {
      attr1: template.attr1,
      equipped: 0,
      id: server.GetAValidItemID(),
      owner: this.id,
      slot: slot,
      template: template.id
    };

    // console.log(item);

    this.items.push(item);

    this.socket.emit("receiveItem", item);
  },
  UpdateAppearance: function(sendChanges) {



    this.head = 0;
    this.body = 0;
    this.feet = 0;

    //for(var i in this.items) {
    for(var i=0;i<this.items.length;i++) {
      var item = this.items[i];

      var template = dataHandler.items[item.template];

      if ( item.equipped ) {

        if ( template.type == "armor" ) {

          switch (template.subtype) {
            case "head":
              this.head = template.image;
              break;
            case "body":
              this.body = template.image;
              break;
            case "feet":
              this.feet = template.image;
              break;
          }

        }
      }
    }

    if ( sendChanges ) {
      this.EmitNearby("updateClothes", {
        id:this.id,
        head:this.head,
        body:this.body,
        feet:this.feet
      });
    }
  },
  // SwingWeapon: function(pos) {
  //   // Only for NPC's

  //   //if ( this.id > 0 ) return;
  //   var data = {
  //     id:this.id,
  //     p:pos
  //   };

  //   if ( this.weapon ) {
  //     data.w = this.weapon.id;
  //   }

  //   this.EmitNearby("swingWeapon", data, 0, false);

  // },
  GetEquippedWeapon: function() {

    for(var i=0;i<this.items.length;i++) {
      var item = this.items[i];

      var template = dataHandler.items[item.template];

      if ( item.equipped &&
        (template.type == "weapon" || template.type == "tool")) {
        return item;
      }
    }

    return null;
  },
  InLineOfSight: function(unit, noHeadingCheck) {
    var unitToUs = unit.position.clone().subSelf(this.position);

    noHeadingCheck = noHeadingCheck || false;

    if ( !noHeadingCheck && this.heading.dot(unitToUs.normalize()) <= 0 ) {
      // log("not in the FOV!");
      return false;
    }

    if ( unit.id > 0 ) {
      // Check the LOS array
      if ( !_.contains(unit.unitsInLineOfSight, this.id) ) {
        // log("not found in los list!");
        return false;
      }
    }

    // log("in LOS! LOS:");
    // console.log(unit.unitsInLineOfSight);
    return true;
  },
  FindNearestTarget: function(maxDistance, onlyPlayers, noHeadingCheck) {
    maxDistance = maxDistance || 0;
    onlyPlayers = onlyPlayers || false;

    var cx = this.cellX;
    var cz = this.cellZ;

    //log("FindNearestTarget, maxDistance "+maxDistance+", onlyPlayers "+(onlyPlayers?"true":"false")+"");

    for(var x=cx-1;x<=cx+1;x++){
      for(var z=cz-1;z<=cz+1;z++){
        if ( worldHandler.CheckWorldStructure(this.zone, x, z) ) {
          for(var u=0;u<worldHandler.world[this.zone][x][z].units.length;u++) {
            var unit = worldHandler.world[this.zone][x][z].units[u];

            if ( unit == this ) {
              continue;
            }

            if ( unit instanceof Fighter ) {

              //debugger;

              if ( unit.health <= 0 ) {
                //log("unit.health <= 0");
                continue;
              }

              if ( unit.chInvisibleByMonsters ) {
                //log("unit.chInvisibleByMonsters");
                continue;
              }

              if ( onlyPlayers && unit.id < 0 ) {
                //log("onlyPlayers && unit.id < 0");
                continue;
              }

              // Check if we are looking at the target
              if ( !this.InLineOfSight(unit, noHeadingCheck) ) {
                //log("not in line of sight!");
                continue;
              }


            }
            else {
              continue;
            }

            if ( maxDistance > 0 && !this.InRangeOfUnit(unit, maxDistance) ) {
              //log("too far away!");
              continue;
            }

            //if ( maxDistance > 0 && !unit.InRangeOfPosition(this.startPosition, maxDistance) ) continue;


            return unit;

          }
        }
      }
    }
    return null;
  }
});
