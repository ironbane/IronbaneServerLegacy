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



            this.hasReachedWaypoint = false;
	},
	Execute: function(unit, dTime) {


            if ( unit.health <= 0 || unit.template.disabled ) return;


            if ( VectorDistance(unit.position, this.targetPosition) < 1.0 &&
                !this.hasReachedWaypoint ) {

                this.hasReachedWaypoint = true;
                 // Get a random waypoint nearby and travel to it
                 if ( unit.connectedNodeList.length === 0 ) {
                    // log("[Wander] Error: No nodes found!");
                }
                else {

                    var me = this;

                    setTimeout(function() {
                        var randomNode = ChooseRandom(unit.connectedNodeList);
                        me.targetPosition = ConvertVector3(randomNode.pos);
                        me.hasReachedWaypoint = false;
                    }, getRandomInt(1,60) * 1000);

                    // log("[Wander] Traveling to node "+randomNode.id+"...");
                }

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
