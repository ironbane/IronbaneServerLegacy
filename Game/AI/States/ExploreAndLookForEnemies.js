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


var ExploreAndLookForEnemies = State.extend({
	Init: function() {

        this.walkBackTimeout = 0;

        this.changeToNewPositionTimeout = 0.0;

        this.targetPosition = new THREE.Vector3();

        this.test = true;

        this.minimumExploreTime = 5.0;
	},
	Enter: function(unit) {

        this.targetPosition = unit.position.clone();

        unit.maxSpeed = 2.0;

	},
	Execute: function(unit, dTime) {

        if ( unit.health <= 0 || unit.template.disabled ) return;

        if ( this.walkBackTimeout > 0 ) this.walkBackTimeout -= dTime;
        if ( this.minimumExploreTime > 0 ) this.minimumExploreTime -= dTime;

        if ( this.changeToNewPositionTimeout > 0 ) this.changeToNewPositionTimeout -= dTime;

        if ( this.changeToNewPositionTimeout <= 0.0 ) {
             //var distance = DistanceSq(unit.position, unit.targetPosition);
             //this.targetPosition = unit.position.clone().add(new THREE.Vector3(getRandomInt(-10, 10), getRandomInt(-5, 5), getRandomInt(-10, 10)));
             //this.targetPosition.set(getRandomInt(0, 45), getRandomInt(0, 10), getRandomInt(0, 20));
             this.test = !this.test;
             this.changeToNewPositionTimeout = getRandomFloat(1, 5);

             // Get a random waypoint nearby and travel to it
             if ( unit.connectedNodeList.length === 0 ) {
                // log("[ExploreAndLookForEnemies] No nodes found...");
                 // No nodes found...
                 // Adjust the X and Z things
                 this.targetPosition.x = unit.startPosition.x+getRandomInt(-20,20);
                 this.targetPosition.z = unit.startPosition.z+getRandomInt(-20,20);
            }
            else {
                var randomNode = ChooseRandom(unit.connectedNodeList);
                this.targetPosition = ConvertVector3(randomNode.pos).add(new THREE.Vector3(getRandomFloat(-1, 1), 0, getRandomFloat(-1, 1)));
               // log("[ExploreAndLookForEnemies] Traveling to node "+randomNode.id+"...");
            }
            // unit.maxSpeed = getRandomFloat(2.0, 4.0);


             //this.targetPosition.set(this.test ? 0 : 25, 0, this.test ? 0 : 10);

             // log("[ExploreAndLookForEnemies] New target position: "+this.targetPosition.ToString());
             // log("[ExploreAndLookForEnemies] Current NPC nodepath: "+unit.targetNodePosition.ToString());
        }

        //unit.steeringForce = unit.steeringBehaviour.Wander();
        unit.TravelToPosition(this.targetPosition, true);


        if ( unit.template.spawnguardradius > 0 ) {
            if ( VectorDistance(unit.startPosition, unit.position) > unit.template.spawnguardradius ) this.walkBackTimeout = 3.0;

            if ( unit.walkBackTimeout > 0.0 ) {
                // unit.steeringForce = unit.steeringBehaviour.Seek(unit.startPosition);
                unit.TravelToPosition(unit.startPosition);
            }
        }

        var player = unit.FindNearestTarget(unit.template.aggroradius, true);

        if ( player && player.InRangeOfPosition(unit.position, unit.template.spawnguardradius+unit.template.aggroradius) &&
            this.minimumExploreTime <= 0 &&
            unit.InLineOfSight(player) ) {
            // log("[ExploreAndLookForEnemies] Found enemy!");
            unit.stateMachine.ChangeState(new ChaseEnemy(player));
            //this.steeringForce = this.steeringBehaviour.Arrive(this.targetPosition, Deceleration.FAST);
            //this.steeringForce = this.steeringBehaviour.Pursuit(player);
        }
        else {
            // log("[ExploreAndLookForEnemies] No-one in sight!");
        }

	},
	Exit: function(unit) {

	},
    HandleMessage: function(unit, message, data) {

        switch (message) {
          case "attacked":
            // We're attacked!

            // Change state to ChaseEnemy
            unit.stateMachine.ChangeState(new ChaseEnemy(data.attacker));

            break;
        }

    }
});
