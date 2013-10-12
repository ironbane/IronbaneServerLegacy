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
var _ = require('underscore');
var THREE = require('../../../../common/three');
var VectorDistance = THREE.VectorDistance;

// Requires nodes!
var Patrol = State.extend({
    init: function(waypoints, options) {
        this.waypoints = waypoints;
        this.options = options || {};
        this.options.pause = this.options.pause || 0;
        this.options.seek = this.options.seek || false;
        this.options.navMode = this.options.navMode === undefined ? "circuit" : this.options.navMode;
        this.options.firstWaypoint = this.options.firstWaypoint === undefined ? this.waypoints[0] : this.options.firstWaypoint;
        this.sentTimeout = false;
    },
    enter: function(unit) {
        this.waypointIndex = 0;

        _.each(this.waypoints, function(w, i) {
            if (w.id === this.options.firstWaypoint) {
                this.waypointIndex = i;
            }
        }, this);

        this.targetPosition = this.waypoints[this.waypointIndex].pos;

        if (this.options.navMode === "line") {
            this.forward = true;
        }
    },
    execute: function(unit, dTime) {
        if (VectorDistance(unit.position, this.targetPosition) < 1.0 * unit.mass && !this.sentTimeout) {
            if (this.options.navMode === "line") {
                if (this.forward) {
                    this.waypointIndex++;

                    if (this.waypointIndex >= this.waypoints.length) {
                        this.waypointIndex = this.waypoints.length - 2;
                        this.forward = false;
                    }
                } else {
                    this.waypointIndex--;

                    if (this.waypointIndex < 0) {
                        this.waypointIndex = 1;
                        this.forward = true;
                    }
                }
            }

            if (this.options.navMode === "circuit") {
                this.waypointIndex++;
                if (this.waypointIndex >= this.waypoints.length) {
                    this.waypointIndex = 0;
                }
            }

            var me = this;
            setTimeout(function() {
                var newWaypoint = me.waypoints[me.waypointIndex];

                me.targetPosition = newWaypoint.pos;

                unit.HandleMessage("changeWaypoint", newWaypoint);

                me.sentTimeout = false;
            }, this.options.pause);
            this.sentTimeout = true;
        }

        if (this.options.seek) {
            unit.steeringForce = unit.steeringBehaviour.Seek(this.targetPosition);
        } else {
            unit.steeringForce = unit.steeringBehaviour.Arrive(this.targetPosition, unit.mass);
        }
    }
});

module.exports = Patrol;
