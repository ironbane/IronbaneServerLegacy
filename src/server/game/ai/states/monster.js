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
    _ = require('underscore'),
    THREE = require('../../../../common/three'),
    ConvertVector3 = THREE.ConvertVector3,
    VectorDistance = THREE.VectorDistance,
    Wander = require('./wander'),
    ChaseEnemy = require('./chaseEnemy');

var outsideSpawnGuardRadius = function(unit) {
    return unit.template.spawnguardradius > 0 && VectorDistance(unit.startPosition, unit.position) > unit.template.spawnguardradius;
};

var MonsterState = State.extend({
    init: function() {
        this.wanderRange = 10;
        this.chaseSpeed = 5;
        this.walkSpeed = 2;
        this.threatTable = [];
        this.wanderConfig = {
            minWaitTime: 3,
            maxWaitTime: 10
        };
    },
    enter: function(unit) {
        var me = this;

        unit.maxSpeed = me.walkSpeed;
        me.waypointList = [];
        _.each(unit.connectedNodeList, function(node) {
            var pos = ConvertVector3(node.pos);
            if (unit.InRangeOfPosition(pos, me.wanderRange)) {
                me.waypointList.push(pos);
            }
        });

        // If we can't move, don't try
        if (!me.waypointList.length) {
            return;
        }

        unit.stateMachine.changeState(new Wander(me.waypointList, me.wanderConfig));
    },
    execute: function(unit, dTime) {
        if (!(unit.stateMachine.currentState instanceof ChaseEnemy)) {
            var target = unit.FindNearestTarget(unit.template.aggroradius, true);

            if (target && !outsideSpawnGuardRadius(unit) && unit.InLineOfSight(target)) {
                unit.maxSpeed = this.chaseSpeed;
                // log("[MonsterState] Found enemy!");
                unit.stateMachine.changeState(new ChaseEnemy(target));
            }
        }
    },
    evaluateThreat: function(unit) {
        // Check if there is a better target for us suited
        var sorted = _.sortBy(this.threatTable, function(e) {
            return -e.threat;
        });
        unit.maxSpeed = this.chaseSpeed;
        unit.stateMachine.changeState(new ChaseEnemy(sorted[0].attacker));
    },
    handleMessage: function(unit, message, data) {

        switch (message) {
            case "attacked":
                var threat = _.find(this.threatTable, function(e) {
                    if (e.attacker === data.attacker) {
                        return e;
                    }
                });

                if (!threat) {
                    this.threatTable.push({
                        threat: data.damage,
                        attacker: data.attacker
                    });
                } else {
                    threat.threat += data.damage;
                }

                this.evaluateThreat(unit);

                break;
            case "stopChase":
            case "respawned":
                // If we can't move, don't try
                if (!this.waypointList.length) {
                    return;
                }

                // We lost the enemy or gave  up

                // Go back to wandering
                unit.stateMachine.changeState(new Wander(this.waypointList, this.wanderConfig));
                unit.maxSpeed = this.walkSpeed;
                this.threatTable = [];
                break;
        }
    }
});

module.exports = MonsterState;
