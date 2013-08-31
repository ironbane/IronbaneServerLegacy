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
	Enter: function(npc) {

            this.targetPosition = npc.position.clone();

            npc.maxSpeed = 2.0;

	},
	Execute: function(npc, dTime) {


            if ( npc.health <= 0 || npc.template.disabled ) return;


            if ( VectorDistance(npc.position, this.targetPosition) < 1.0 ) {
            	// TIme to change to a new node!
                 //var distance = DistanceSq(npc.position, npc.targetPosition);
                 //this.targetPosition = npc.position.clone().add(new THREE.Vector3(getRandomInt(-10, 10), getRandomInt(-5, 5), getRandomInt(-10, 10)));
                 //this.targetPosition.set(getRandomInt(0, 45), getRandomInt(0, 10), getRandomInt(0, 20));

                 // Get a random waypoint nearby and travel to it
                 if ( npc.connectedNodeList.length === 0 ) {
                    log("[Wander] Error: No nodes found!");
                }
                else {
                    var randomNode = ChooseRandom(npc.connectedNodeList);
                    this.targetPosition = ConvertVector3(randomNode.pos);
                    log("[Wander] Traveling to node "+randomNode.id+"...");
                }


                npc.maxSpeed = getRandomInt(1, 3);


                 //this.targetPosition.set(this.test ? 0 : 25, 0, this.test ? 0 : 10);

                 log("[Wander] New target position: "+this.targetPosition.ToString());
                 //log("[ExploreAndLookForEnemies] Current NPC nodepath: "+npc.targetNodePosition.ToString());
            }

            //npc.steeringForce = npc.steeringBehaviour.Wander();
            npc.TravelToPosition(this.targetPosition);

	},
	Exit: function(npc) {

	},
    HandleMessage: function(npc, message, data) {

        // switch (message) {
        //   case "attacked":
        //     // We're attacked!

        //     // Change state to ChaseEnemy
        //     npc.stateMachine.ChangeState(new ChaseEnemy(data.attacker));

        //     break;
        // }

    }
});
