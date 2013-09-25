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

// Requires nodes!


var Wander = State.extend({
	Init: function() {





            this.targetPosition = new THREE.Vector3();

	},
	Enter: function(unit) {

            this.targetPosition = unit.position.clone();

            unit.maxSpeed = 2.0;

	},
	Execute: function(unit, dTime) {


            if ( unit.health <= 0 || unit.template.disabled ) return;


            if ( VectorDistance(unit.position, this.targetPosition) < 1.0 ) {
            	// TIme to change to a new node!
                 //var distance = DistanceSq(unit.position, unit.targetPosition);
                 //this.targetPosition = unit.position.clone().add(new THREE.Vector3(getRandomInt(-10, 10), getRandomInt(-5, 5), getRandomInt(-10, 10)));
                 //this.targetPosition.set(getRandomInt(0, 45), getRandomInt(0, 10), getRandomInt(0, 20));

                 // Get a random waypoint nearby and travel to it
                 if ( unit.connectedNodeList.length === 0 ) {
                    log("[Wander] Error: No nodes found!");
                }
                else {
                    var randomNode = ChooseRandom(unit.connectedNodeList);
                    this.targetPosition = ConvertVector3(randomNode.pos);
                    log("[Wander] Traveling to node "+randomNode.id+"...");
                }


                unit.maxSpeed = getRandomInt(1, 3);


                 //this.targetPosition.set(this.test ? 0 : 25, 0, this.test ? 0 : 10);

                 log("[Wander] New target position: "+this.targetPosition.ToString());
                 //log("[ExploreAndLookForEnemies] Current NPC nodepath: "+unit.targetNodePosition.ToString());
            }

            //unit.steeringForce = unit.steeringBehaviour.Wander();
            unit.TravelToPosition(this.targetPosition);

	},
	Exit: function(unit) {

	},
    HandleMessage: function(unit, message, data) {

        // switch (message) {
        //   case "attacked":
        //     // We're attacked!

        //     // Change state to ChaseEnemy
        //     unit.stateMachine.ChangeState(new ChaseEnemy(data.attacker));

        //     break;
        // }

    }
});
