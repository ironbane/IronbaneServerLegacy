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

var Turret = State.extend({
    init: function() {
        this.attackTimeout = 0.0;
    },
    enter: function(unit) {
        this.originalMaxSpeed = unit.maxSpeed;
        unit.maxSpeed = 0.0;
    },
    attack: function(unit, victim) {
        //log("[Turret] Attempting attack!");
        unit.AttemptAttack(victim);
    },
    execute: function(unit, dTime) {

        var self = this;

        if (self.attackTimeout > 0) {
            self.attackTimeout -= dTime;
        }

        unit.FindNearestTarget(unit.template.aggroradius, true, true).then(function(player) { 
        
            if (player) {
                if (self.attackTimeout <= 0) {
                    self.attackTimeout = unit.weapon.delay;

                    self.attack(unit, player);
                }
            }

        });
    },
    exit: function(unit) {
        unit.maxSpeed = this.originalMaxSpeed;
    }
});

module.exports = Turret;
