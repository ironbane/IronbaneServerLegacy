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
    Constants = require('../../../../common/constants'),
    WeaponRanges = Constants.WeaponRanges,
    THREE = require(global.APP_ROOT_PATH + '/src/client/game/lib/three/three.js');

// some shortcuts for readable code
var isDead = function(unit) {
    return unit.health <= 0;
};

var isInvalidPlayer = function(unit) {
    return unit.id > 0 && (unit.socket.disconnected || unit.chInvisibleByMonsters);
};

var outsideSpawnGuardRadius = function(unit) {
    return unit.template.spawnguardradius > 0 && unit.startPosition.distanceToSquared(unit.position) > Math.pow(unit.template.spawnguardradius, 2);
};

var ChaseEnemy = State.extend({
    init: function(enemy) {
        this.enemy = enemy;
        this.attackTimeout = 0;
    },
    enter: function(unit) {
        this.minimumChaseTime = 5.0;
    },
    execute: function(unit, dTime) {
        if (this.minimumChaseTime > 0) {
            this.minimumChaseTime -= dTime;
        }

        // another case of Fighter?
        if (unit.health <= 0 || unit.template.disabled) {
            return;
        }

        if (!unit.weapon) {
            return;
        }

        // seems like this should be on the unit
        if (this.attackTimeout > 0) {
            this.attackTimeout -= dTime;
        }

        var distance = this.enemy.position.distanceToSquared(unit.position);
        var direction;

        if (isInvalidPlayer(this.enemy) || isDead(this.enemy) || outsideSpawnGuardRadius(unit) && this.minimumChaseTime <= 0) {
            // log("[ChaseEnemy] Stopping chase!");
            // should we not transition to another state? like previous?
            unit.handleMessage("stopChase");
        } else if (distance < Math.pow(WeaponRanges[unit.weapon.subtype], 2)) {
            // should this transition to "attack" state instead?
            //this.chaseTimeBeforeGivingUp = 8;
            if (unit.InLineOfSight(this.enemy)) {
                // log("[ChaseEnemy] Attacking!");
                if (this.attackTimeout <= 0) {
                    this.attackTimeout = unit.weapon.delay;
                    unit.AttemptAttack(this.enemy);
                }

                unit.steeringForce = new THREE.Vector3();
            }
            // log("[ChaseEnemy] Moving towards enemy!");

            direction = unit.position.clone().sub(this.enemy.position).normalize();
            var target = this.enemy.position.clone().add(direction);
            var distanceToTarget = target.distanceToSquared(unit.position);

            unit.heading.copy(direction.clone().multiplyScalar(-1));

            unit.velocity.set(0, 0, 0);
        } else {
            // this is the actual chase behavior
            // log("[ChaseEnemy] Within aggro range, moving closer...");
            direction = unit.position.clone().sub(this.enemy.position).normalize().multiplyScalar(0.5);
            unit.TravelToPosition(this.enemy.position, {
                useSeek: true,
                dynamicTarget: true
            });
        }
    },
    handleMessage: function(unit, message, data) {
        switch (message) {
            case "targetUnreachable":
                // If the pathfinder can't guide us, stop chasing
                unit.handleMessage("stopChase");
                break;
        }
    }
});

module.exports = ChaseEnemy;
