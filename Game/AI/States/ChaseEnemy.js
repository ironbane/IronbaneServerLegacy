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
  Enter: function(unit) {

    // We want to outrun them still...
    unit.maxSpeed = 4.0;



    // unit.EmitNearby("addParticle", {
    //   p:"ENEMYINSIGHT",
    //   pfu:unit.id
    //   });


    this.chaseTimeBeforeGivingUp = 8;
    // this.chaseTimeBeforeGivingUp = 10;


    this.minimumChaseTime = 5.0;


  },
  Execute: function(unit, dTime) {


    if ( this.minimumChaseTime > 0 ) this.minimumChaseTime -= dTime;

    if ( unit.health <= 0 || unit.template.disabled ) return;

    if ( !unit.weapon ) {
      return;
    }


    if ( this.attackTimeout > 0 ) this.attackTimeout -= dTime;



    var distance = DistanceSq(this.enemy.position, unit.position);

    if ( (((this.enemy.id > 0 && (this.enemy.socket.disconnected || this.enemy.chInvisibleByMonsters) ) ||
      this.enemy.health <= 0 ||
      this.chaseTimeBeforeGivingUp <= 0 || (unit.template.spawnguardradius > 0 && VectorDistance(unit.startPosition, unit.position) > unit.template.spawnguardradius))
      && this.minimumChaseTime <= 0)
       ) {

      // debugger;
      //                log("this.enemy.id: "+this.enemy.id)
      //                log("this.enemy.socket.disconnected: "+this.enemy.socket.disconnected)
      //                log("this.enemy.health: "+this.enemy.health)
      //                log("distance: "+distance+" > "+Math.pow(unit.template.aggroradius, 2))

      unit.stateMachine.ChangeState(new ExploreAndLookForEnemies());
    }
    else if ( distance < Math.pow(WeaponRanges[unit.weapon.subtype], 2) ) {
    // else if ( distance < 9 ) {

      this.chaseTimeBeforeGivingUp = 8;

      if ( unit.InLineOfSight(this.enemy) ) {
        // log("[ChaseEnemy] Attacking!");

        if ( this.attackTimeout <= 0 ) {

          this.attackTimeout = unit.weapon.delay;


          //if ( getRandomInt(0, 10) == 1 ) unit.Say(ChooseRandom(["Show me what you got!","Eat this!","I love a good fight!"]));

          unit.AttemptAttack(this.enemy);


        // Attack!

        }

        unit.steeringForce = new THREE.Vector3();
      }


      // log("[ChaseEnemy] Moving towards enemy!");
      // unit.TravelToPosition(this.enemy.position);
      var direction = unit.position.clone().sub(this.enemy.position).normalize();
      var target = this.enemy.position.clone().add(direction);

      var distanceToTarget = DistanceSq(target, unit.position);

      // console.log(distanceToTarget);

      //if ( distanceToTarget < 0.5 ) {
        // Look at me!
        unit.heading.copy(direction.clone().multiplyScalar(-1));
      //}

      //unit.steeringForce = unit.steeringBehaviour.Arrive(target, Deceleration.FAST);
      //var direction = unit.position.clone().sub(this.enemy.position).normalize().multiplyScalar(0.5);
      //unit.TravelToPosition(this.enemy.position.clone().add(direction), true);
      unit.velocity.set(0,0,0);

    //if ( this.jumpTimeout <= 0 && getRandomInt(0, 50) == 1 ) this.Jump();
    }
    else {

      if ( this.chaseTimeBeforeGivingUp > 0 ) this.chaseTimeBeforeGivingUp -= dTime;

      // log("[ChaseEnemy] Within aggro range, moving closer...");

      var direction = unit.position.clone().sub(this.enemy.position).normalize().multiplyScalar(0.5);
      unit.TravelToPosition(this.enemy.position, true);

    }

  },
  Exit: function(unit) {

//     if ( this.enemy.health > 0 ) {
//       unit.EmitNearby("addParticle", {
//         p:"ENEMYOUTOFSIGHT",
//         pfu:unit.id
//         });
//     }
//     else {

// //      switch(getRandomInt(0,2)){
// //        case 0:
// //          unit.Say("Got you, "+this.enemy.name+"!");
// //          break;
// //        case 1:
// //          unit.Say("Is that all you got?");
// //          break;
// //        case 2:
// //          unit.Say("Whahahaha! Rookie!");
// //          break;
// //      }

//     }

  },
  HandleMessage: function(unit, message, data) {


  }
});
