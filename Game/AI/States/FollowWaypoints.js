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


var FollowWaypoints = State.extend({
    Init: function() {

        this.targetPosition = new THREE.Vector3();

    },
    Enter: function(npc) {

        this.waypointIndex = 0;

        // Build a list of waypoints
        this.targetPosition = npc.waypoints[this.waypointIndex];

        debugger;

        npc.maxSpeed = 2.0;

    },
    Execute: function(npc, dTime) {

        if ( npc.template.disabled ) return;


        if ( VectorDistance(npc.position, this.targetPosition) < 1.0 ) {
            this.waypointIndex++;
            if ( this.waypointIndex >= npc.waypoints.length ) {
                this.waypointIndex = 0;
                // Or do reverse
            }
            this.targetPosition = npc.waypoints[this.waypointIndex];
        }

        //npc.steeringForce = npc.steeringBehaviour.Wander();
        //npc.TravelToPosition(this.targetPosition);
        npc.steeringForce = npc.steeringBehaviour.Arrive(this.targetPosition, Deceleration.FAST);

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
