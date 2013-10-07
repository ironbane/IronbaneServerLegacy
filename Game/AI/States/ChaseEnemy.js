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
        // unit.EmitNearby("addParticle", {
        //   p:"ENEMYINSIGHT",
        //   pfu:unit.id
        //   });

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




        if ( (
            (
                (this.enemy.id > 0 && (this.enemy.socket.disconnected || this.enemy.chInvisibleByMonsters) )
                || this.enemy.health <= 0
                || (unit.template.spawnguardradius > 0 && VectorDistance(unit.startPosition, unit.position) > unit.template.spawnguardradius)
            )
            && this.minimumChaseTime <= 0)
            ) {

            // log("[ChaseEnemy] Stopping chase!");

            unit.HandleMessage("stopChase");
        }
        else if ( distance < Math.pow(WeaponRanges[unit.weapon.subtype], 2) ) {

            //this.chaseTimeBeforeGivingUp = 8;

            if ( unit.InLineOfSight(this.enemy) ) {
                // log("[ChaseEnemy] Attacking!");

                if ( this.attackTimeout <= 0 ) {
                    this.attackTimeout = unit.weapon.delay;

                    unit.AttemptAttack(this.enemy);

                }

                unit.steeringForce = new THREE.Vector3();
            }

            // log("[ChaseEnemy] Moving towards enemy!");

            var direction = unit.position.clone().sub(this.enemy.position).normalize();
            var target = this.enemy.position.clone().add(direction);

            var distanceToTarget = DistanceSq(target, unit.position);

            unit.heading.copy(direction.clone().multiplyScalar(-1));

            unit.velocity.set(0,0,0);

        }
        else {

            // log("[ChaseEnemy] Within aggro range, moving closer...");

            var direction = unit.position.clone().sub(this.enemy.position).normalize().multiplyScalar(0.5);
            unit.TravelToPosition(this.enemy.position, true);

        }

    },
    Exit: function(unit) {

    },
    HandleMessage: function(unit, message, data) {


    }
});
