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


var PatrolLine = State.extend({
    Init: function(waypoints) {
        this.waypoints = waypoints;
    },
    Enter: function(unit) {

        this.waypointIndex = 0;

        this.targetPosition = this.waypoints[this.waypointIndex].pos;

        this.forward = true;

    },
    Execute: function(unit, dTime) {

        if ( VectorDistance(unit.position, this.targetPosition) < 1.0 ) {

            if ( this.forward ) {
                this.waypointIndex++;

                if ( this.waypointIndex >= this.waypoints.length ) {
                    this.waypointIndex = this.waypoints.length - 2;
                    this.forward = false;
                }
            }
            else {
                this.waypointIndex--;

                if ( this.waypointIndex < 0 ) {
                    this.waypointIndex = 1;
                    this.forward = true;
                }
            }

            var newWaypoint = this.waypoints[this.waypointIndex];

            this.targetPosition = newWaypoint.pos;

            unit.HandleMessage("changeWaypoint", newWaypoint);
        }

        unit.steeringForce = unit.steeringBehaviour.Arrive(this.targetPosition, Deceleration.FAST);

    },
    Exit: function(unit) {

    },
    HandleMessage: function(unit, message, data) {

    }
});
