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


var TurretStraight = State.extend({
  Init: function() {

    this.attackTimeout = 0.0;
  },
  Enter: function(npc) {

    npc.maxSpeed = 0.0;



  },
  Execute: function(npc, dTime) {

    // log("state "+npc.rotation.y);

    if ( this.attackTimeout > 0 ) this.attackTimeout -= dTime;

    var player = npc.FindNearestTarget(npc.template.aggroradius, true, true);


    if ( player ) {


//      log("[Turret] Attacking!");

      if ( this.attackTimeout <= 0 ) {

        this.attackTimeout = npc.weapon.delay;

        //log("[Turret] Attempting attack!");

        // npc.AttemptAttack(player);

        // console.log(npc.rotation);

        var angle = npc.rotation.y.ToRadians();


        npc.ShootProjectile(npc.position.clone()
          .addSelf(npc.heading.clone().multiplyScalar(5)), false);


      // Attack!

      }
    }
//    else {
//      log("[Turret] No-one in sight!");
//    }

  },
  Exit: function(unit) {

  }
});
