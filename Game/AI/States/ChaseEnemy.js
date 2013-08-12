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


var ChaseEnemy = State.extend({
  Init: function(enemy) {

    this.enemy = enemy;

    this.attackTimeout = 0;




  },
  Enter: function(npc) {

    // We want to outrun them still...
    npc.maxSpeed = 4.0;



    npc.EmitNearby("addParticle", {
      p:"ENEMYINSIGHT",
      pfu:npc.id
      });


    this.chaseTimeBeforeGivingUp = 8;
    // this.chaseTimeBeforeGivingUp = 10;


    this.minimumChaseTime = 5.0;


  },
  Execute: function(npc, dTime) {


    if ( this.minimumChaseTime > 0 ) this.minimumChaseTime -= dTime;

    if ( npc.health <= 0 || npc.template.disabled ) return;

    if ( !npc.weapon ) {
      return;
    }


    if ( this.attackTimeout > 0 ) this.attackTimeout -= dTime;



    var distance = DistanceSq(this.enemy.position, npc.position);

    if ( (((this.enemy.id > 0 && (this.enemy.socket.disconnected || this.enemy.chInvisibleByMonsters) ) ||
      this.enemy.health <= 0 ||
      this.chaseTimeBeforeGivingUp <= 0 || (npc.template.spawnguardradius > 0 && VectorDistance(npc.startPosition, npc.position) > npc.template.spawnguardradius))
      && this.minimumChaseTime <= 0)
       ) {

      // debugger;
      //                log("this.enemy.id: "+this.enemy.id)
      //                log("this.enemy.socket.disconnected: "+this.enemy.socket.disconnected)
      //                log("this.enemy.health: "+this.enemy.health)
      //                log("distance: "+distance+" > "+Math.pow(npc.template.aggroradius, 2))

      npc.stateMachine.ChangeState(new ExploreAndLookForEnemies());
    }
    else if ( distance < Math.pow(WeaponRanges[npc.weapon.subtype], 2) ) {
    // else if ( distance < 9 ) {

      this.chaseTimeBeforeGivingUp = 8;

      if ( npc.InLineOfSight(this.enemy) ) {
        // log("[ChaseEnemy] Attacking!");

        if ( this.attackTimeout <= 0 ) {

          this.attackTimeout = npc.weapon.delay;


          //if ( getRandomInt(0, 10) == 1 ) npc.Say(ChooseRandom(["Show me what you got!","Eat this!","I love a good fight!"]));

          npc.AttemptAttack(this.enemy);


        // Attack!

        }

        npc.steeringForce = new THREE.Vector3();
      }


      // log("[ChaseEnemy] Moving towards enemy!");
      // npc.TravelToPosition(this.enemy.position);
      var direction = npc.position.clone().subSelf(this.enemy.position).normalize().multiplyScalar(1);
      var target = this.enemy.position.clone().addSelf(direction);

      var distanceToTarget = DistanceSq(target, npc.position);

      // console.log(distanceToTarget);

      if ( distanceToTarget < 0.5 ) {
        // Look at me!
        npc.heading.copy(direction.clone().multiplyScalar(-1));
      }

      npc.steeringForce = npc.steeringBehaviour.Arrive(target, Deceleration.FAST);

    //if ( this.jumpTimeout <= 0 && getRandomInt(0, 50) == 1 ) this.Jump();
    }
    else {

      if ( this.chaseTimeBeforeGivingUp > 0 ) this.chaseTimeBeforeGivingUp -= dTime;

      // log("[ChaseEnemy] Within aggro range, moving closer...");

      var direction = npc.position.clone().subSelf(this.enemy.position).normalize().multiplyScalar(2);
      npc.TravelToPosition(this.enemy.position.clone().addSelf(direction), true);

    }

  },
  Exit: function(npc) {

    if ( this.enemy.health > 0 ) {
      npc.EmitNearby("addParticle", {
        p:"ENEMYOUTOFSIGHT",
        pfu:npc.id
        });
    }
    else {

//      switch(getRandomInt(0,2)){
//        case 0:
//          npc.Say("Got you, "+this.enemy.name+"!");
//          break;
//        case 1:
//          npc.Say("Is that all you got?");
//          break;
//        case 2:
//          npc.Say("Whahahaha! Rookie!");
//          break;
//      }

    }

  },
  HandleMessage: function(unit, message, data) {


  }
});
