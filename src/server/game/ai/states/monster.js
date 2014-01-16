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
    THREE = require(global.APP_ROOT_PATH + '/src/client/game/lib/three/three.js'),
    Wander = require('./wander'),
    ChaseEnemy = require('./chaseEnemy');

var pathFinder = require(APP_ROOT_PATH + '/src/server/game/pathFinder.js');

var outsideSpawnGuardRadius = function(unit) {
    return unit.template.spawnguardradius > 0 && unit.startPosition.distanceToSquared(unit.position) > Math.pow(unit.template.spawnguardradius, 2);
};

var MonsterState = State.extend({
    init: function() {
        this.wanderRange = 10;
        this.chaseSpeed = 4;
        this.walkSpeed = 2;
        this.threatTable = [];
        this.wanderConfig = {
            minWaitTime: 3,
            maxWaitTime: 10
        };

        this.cantReachTable = {};
    },
    enter: function(unit) {
        var me = this;

        unit.maxSpeed = me.walkSpeed;

        unit.stateMachine.changeState(new Wander(me.wanderConfig));
    },
    execute: function(unit, dTime) {
        if (!(unit.stateMachine.currentState instanceof ChaseEnemy)) {

            var me = this;

            unit.FindNearestTarget(unit.template.aggroradius, true).then(function(target) {

                if (target &&
                    !outsideSpawnGuardRadius(unit) &&
                    unit.InLineOfSight(target) ) {


                    if ( !me.cantReachTable[target.id] )  {
                        if (unit.navigationMeshGroup != null) {
                            var paths = pathFinder.findPath(unit.position,
                                target.position,
                                unit.zone,
                                unit.navigationMeshGroup);
                            if ( paths ) {
                                unit.maxSpeed = me.chaseSpeed;
                                // log("[MonsterState] Found enemy!");
                                unit.stateMachine.changeState(new ChaseEnemy(target));
                            }
                            else {
                                me.cantReachTable[target.id] = true;

                                setTimeout(function() {
                                    delete me.cantReachTable[target.id];
                                }, 2000);
                            }
                        }
                    }


                }

            });
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

                // We lost the enemy or gave  up

                // Go back to wandering
                unit.stateMachine.changeState(new Wander(this.wanderConfig));
                unit.maxSpeed = this.walkSpeed;
                this.threatTable = [];
                break;
        }
    }
});

module.exports = MonsterState;
