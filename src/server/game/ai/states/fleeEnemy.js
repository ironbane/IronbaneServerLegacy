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
var State = require('../state'),
    ChaseEnemy = require('./chaseEnemy');

var FleeEnemy = State.extend({
    init: function(enemy, waypoints) {
        this.enemy = enemy;
        this.waypoints = waypoints;
    },
    enter: function(unit) {
        this.fleePosition = unit.position.clone();
    },
    refreshFleePosition: function(unit) {
        if (this.waypoints.length) {
            var me = this;
            var sorted = _.sortBy(this.waypoints, function(wp) {
                return -VectorDistance(wp, me.enemy.position);
            });
            this.fleePosition.copy(sorted[0]);
        }
    },
    execute: function(unit, dTime) {
        var beingChased = this.enemy.stateMachine.currentState instanceof ChaseEnemy && this.enemy.stateMachine.currentState.enemy === unit;

        if (!beingChased) {
            // log("[FleeEnemy] Enemy gave up!");
            unit.handleMessage("stopFlee");
        } else {
            // log("[FleeEnemy] Too close, running!");
            if (unit.InRangeOfPosition(this.fleePosition, 1)) {
                this.RefreshFleePosition(unit);
            }

            unit.TravelToPosition(this.fleePosition, {
                useSeek: true,
                dynamicTarget: true
            });
        }
    }
});

module.exports = FleeEnemy;
