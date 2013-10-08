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
var State = require('../state');

var Wander = State.extend({
    init: function(waypoints, options) {
        this.waypoints = waypoints;
        this.targetPosition = new THREE.Vector3();
        this.options = options || {};
        this.options.minWaitTime = this.options.minWaitTime === undefined ? 1 : this.options.minWaitTime;
        this.options.maxWaitTime = this.options.maxWaitTime === undefined ? 20 : this.options.maxWaitTime;
    },
    enter: function(unit) {
        this.targetPosition = unit.position.clone();
        this.hasReachedWaypoint = false;
    },
    execute: function(unit, dTime) {
        if (unit.health <= 0 || unit.template.disabled) {
            return;
        }

        if (VectorDistance(unit.position, this.targetPosition) < 1.0 && !this.hasReachedWaypoint) {
            this.hasReachedWaypoint = true;
            // Get a random waypoint nearby and travel to it
            if (unit.connectedNodeList.length === 0) {
                // log("[Wander] Error: No nodes found!");
            } else {
                var me = this;
                var newPoint = ChooseRandom(me.waypoints);

                setTimeout(function() {
                    me.targetPosition = newPoint;
                    me.hasReachedWaypoint = false;
                }, getRandomInt(this.options.minWaitTime, this.options.maxWaitTime) * 1000);

                // log("[Wander] Traveling to node "+randomNode.id+"...");
            }
        }

        //unit.steeringForce = unit.steeringBehaviour.Wander();
        unit.TravelToPosition(this.targetPosition);
    }
});

module.exports = Wander;
