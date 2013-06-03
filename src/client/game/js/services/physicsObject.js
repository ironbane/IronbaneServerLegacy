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
angular.module('IronbaneGame')
    .constant('GRAVITY', new THREE.Vector3(0, -9.81, 0))
    .factory('PhysicsObject', ['VECTOR_UNIT',
    function(UnitVector) {
        var PhysicsObject = Class.extend({
            enableGravity: true,
            dynamic: true,
            initialStaticUpdateDone: false,
            mass: 1.0,
            maxSpeed: 20.0,
            maxForce: 10.0,
            maxTurnRate: 0.5,
            init: function(position, rotation, scale, velocity) {
                this.position = position ? position.clone() : new THREE.Vector3();
                this.rotation = rotation ? rotation.clone() : new THREE.Vector3();
                this.scale = (scale || UnitVector).clone();

                // Keep track of old velocities so we can calculate the velocity
                this.oldPosition = new THREE.Vector3();

                this.startPosition = this.position.clone();
                this.startRotation = this.rotation.clone();

                // Always local! Can be in reference to the world or another object3D!
                this.object3D = new THREE.Object3D();
                this.object3D.unit = this;
                // Can be written to!
                this.object3D.position = this.position.clone();
                this.object3D.rotation = this.rotation.clone();
                this.object3D.scale = this.scale.clone();

                this.localPosition = this.object3D.position;
                this.localRotation = this.object3D.rotation;
                this.localScale = this.object3D.scale;

                // Pre-calculate to avoid arrows being stuck in the ground
                this.object3D.updateMatrixWorld();
                this.position.getPositionFromMatrix(this.object3D.matrixWorld);

                this.acceleration = new THREE.Vector3();

                // Only applies to the local position!
                this.velocity = velocity ? velocity.clone() : new THREE.Vector3();

                // Applies to gloval position! Also gets emptied every tick
                this.globalVelocity = new THREE.Vector3();

                this.steeringForce = new THREE.Vector3();

                // a normalized vector pointing in the direction the entity is heading.
                this.heading = new THREE.Vector3();

                //a vector perpendicular to the heading vector
                this.side = new THREE.Vector3();

                this.lastUnitStandingOn = null;
                this.unitStandingOn = null;
            },
            destroy: function() {

            },
            tick: function(dTime) {

            }
        });

        return PhysicsObject;
    }
]);