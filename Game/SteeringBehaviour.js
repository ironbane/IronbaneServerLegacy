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

var Deceleration = {
    SLOW:3,
    NORMAL:2,
    FAST:1
};

var SteeringBehaviour = Class.extend({
    Init: function(unit) {
        this.unit = unit;


        this.targetUnit = null;

        this.steeringForce = new THREE.Vector3();


		// Wander
		this.wanderRadius = 5.2;
		this.wanderDistance = 2.0;
		this.wanderJitter = 180.0;
		this.wanderTarget = new THREE.Vector3();
    },
    Calculate: function() {
        this.steeringForce.set(0,0,0);
    },
    Seek: function(targetPos) {
        var desiredVelocity = targetPos.clone().subSelf(this.unit.position).normalize().multiplyScalar(this.unit.maxSpeed);
        return desiredVelocity.subSelf(this.unit.velocity);
    },
    Flee: function(targetPos) {

        var desiredVelocity = this.unit.position.clone().subSelf(targetPos).normalize().multiplyScalar(this.unit.maxSpeed);
        return desiredVelocity.subSelf(this.unit.velocity);
    },
    Arrive: function(targetPos, deceleration) {
        var ToTarget = targetPos.clone().subSelf(this.unit.position);

		//calculate the distance to the target position
        var dist = ToTarget.length();

        if ( dist > 0 ) {


            var decelerationTweaker = 0.3;

            var speed = dist / (deceleration / decelerationTweaker);


            speed = Math.min(speed, this.unit.maxSpeed);


            var desiredVelocity = ToTarget.multiplyScalar(speed/dist);

            return desiredVelocity.subSelf(this.unit.velocity);

        }

        return new THREE.Vector3();
    },
	Pursuit: function(evader) {

        var toEvader = evader.position.clone().subSelf(this.unit.position);

		var relativeHeading = this.unit.heading.dot(evader.heading);

		if ( toEvader.dot(this.unit.heading) > 0 && relativeHeading < -0.95 ) {
			return this.Seek(evader.position);
		}

		var lookAheadTime = toEvader.length() / (this.unit.maxSpeed + evader.velocity.length());

        var seek = evader.position.clone().addSelf(evader.velocity.clone().multiplyScalar(lookAheadTime));

		return this.Seek(seek);
	},
	Evade: function(pursuer) {
        var toPursuer = pursuer.position.clone().subSelf(this.unit.position);

		var lookAheadTime = toPursuer.length() / (this.unit.maxSpeed + pursuer.velocity.length());

		return this.Flee(pursuer.position.clone().addSelf(pursuer.velocity.clone().multiplyScalar(lookAheadTime)));
	},
	TurnaroundTime: function(unit, targetPos) {
		var toTarget = targetPos.clone().subSelf(unit.position);

		var dot = unit.heading.dot(toTarget);

		var coefficient = 0.5;

		return (dot - 1.0) * -coefficient;
	},
    ResetWander: function() {
        this.wanderTarget = new THREE.Vector3();
    },
	Wander: function() {

		this.wanderTarget.addSelf(new THREE.Vector3(RandomClamped() * this.wanderJitter,
		0,
		RandomClamped() * this.wanderJitter));

		this.wanderTarget.normalize().multiplyScalar(this.wanderRadius);

		var offset = this.unit.heading.clone().multiplyScalar(this.wanderDistance);
		return offset.addSelf(this.wanderTarget);
	},
	Interpose: function(unitA, unitB) {

		var midPoint = unitA.position.clone().addSelf(unitB.position).multiplyScalar(0.5);

		var timeToReachMidPoint = this.unit.position.clone().subSelf(midPoint).length() / this.unit.maxSpeed;

		var posA = unitA.position.clone().addSelf(unitA.velocity.clone.multiplyScalar(timeToReachMidPoint));
		var posB = unitB.position.clone().addSelf(unitB.velocity.clone.multiplyScalar(timeToReachMidPoint));

		midPoint = posA.addSelf(posB).multiplyScalar(0.5);

		return Arrive(midPoint, Deceleration.FAST);
	}
});
