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
/*
 * PhysicsObject is the basis of all entities ingame and should not be instantiated.
 */

var gravity = new THREE.Vector3(0, -9.81, 0);

var tempMatrix = new THREE.Matrix4();

var PhysicsObject = Class.extend({
    Init: function(position, rotation, scale, velocity) {

       this.enableGravity = true;

       // this.enableCollisionDetection = false;
       // this.hasCollision = false;

        // These values are global, not local and are READ-ONLY!
        // They will be written by the object3D world matrix
        // To change these change the values of the object3D member
        this.position = (position || new THREE.Vector3(0.0, 0.0, 0.0)).clone();
        this.rotation = rotation || new THREE.Euler(0.0, 0.0, 0.0);
        this.scale = (scale || new THREE.Vector3(1.0, 1.0, 1.0)).clone();


        // Keep track of old velocities so we can calculate the velocity
        this.oldPosition = new THREE.Vector3();


        this.startPosition = this.position.clone();
        this.startRotation = this.rotation.clone();


        this.dynamic = true;
        this.initialStaticUpdateDone = false;


        // Always local! Can be in reference to the world or another object3D!
        this.object3D = new THREE.Object3D();

        this.object3D.unit = this;

        ironbane.scene.add(this.object3D);


        // Can be written to!
        this.object3D.position = (position || new THREE.Vector3(0.0, 0.0, 0.0)).clone();
        this.object3D.rotation = rotation || new THREE.Euler(0.0, 0.0, 0.0);
        this.object3D.scale = (scale || new THREE.Vector3(1.0, 1.0, 1.0)).clone();

        // Pre-calculate to avoid arrows being stuck in the ground
        this.object3D.updateMatrixWorld();
        this.position.getPositionFromMatrix(this.object3D.matrixWorld);



        this.acceleration = new THREE.Vector3();

        // Only applies to the local position!
        this.velocity = (velocity || new THREE.Vector3(0.0, 0.0, 0.0)).clone();

        this.steeringForce = new THREE.Vector3();

        // a normalized vector pointing in the direction the entity is heading.
        this.heading = new THREE.Vector3();

        //a vector perpendicular to the heading vector
        this.side = new THREE.Vector3();

        this.mass = 1.0;

        this.maxSpeed = 20.0;
        this.maxForce = 10.0;
        this.maxTurnRate = 0.5;



        this.lastUnitStandingOn = null;
        this.unitStandingOn = null;


    },
    Destroy: function() {
        if ( !this.unitStandingOn ) {
            ironbane.scene.remove(this.object3D);
        }

        releaseMesh(this.object3D);
    },
    tick: function(dTime) {


        this.oldPosition = this.object3D.position.clone();
            if ( this.unitStandingOn != this.lastUnitStandingOn ) {
                // Perspective changed!
                if ( this.lastUnitStandingOn ) {
                    // First remove the old reference
                    this.lastUnitStandingOn.object3D.remove(this.object3D);
                    ironbane.scene.add(this.object3D);
                    this.object3D.position.copy(this.position);

                    if ( this.isMainPlayer()) {
                        // Add the object's rotation to rotY
                        this.object3D.rotation.y += this.lastUnitStandingOn.object3D.rotation.y;
                    }

                }
                if ( this.unitStandingOn ) {

                    var str = "";

                    this.object3D.position.copy(this.position.clone().sub(this.unitStandingOn.position));

                    var rotationMatrix = new THREE.Matrix4();
                    rotationMatrix.extractRotation(this.unitStandingOn.object3D.matrix).transpose();


                    this.object3D.position.applyMatrix4(rotationMatrix);

                    if ( this.isMainPlayer() ) {
                        // Add the object's rotation to rotY
                        this.object3D.rotation.y -= this.unitStandingOn.object3D.rotation.y;
                    }


                    ironbane.scene.remove(this.object3D);
                    this.unitStandingOn.object3D.add(this.object3D);


                    this.object3D.updateMatrixWorld(true);


                }
            }
        var acceleration = this.steeringForce.multiplyScalar(this.mass);

        this.velocity.add(acceleration.multiplyScalar(dTime));



        this.velocity.Truncate(this.maxSpeed);
        this.velocity.y = this.velocity.y.clamp(-10, 10);


        // Add velocity, but relative to our object3D


        var vel = this.velocity.clone();

        if ( this.unitStandingOn ) {
            var rotationMatrix = new THREE.Matrix4();
            rotationMatrix.extractRotation(this.unitStandingOn.object3D.matrix).transpose();
            vel.applyMatrix4(rotationMatrix);
        }

        this.object3D.position.add(vel.multiplyScalar(dTime));

        if ( this.velocity.length() > 0.01 ) {
            if ( !(this instanceof Fighter) ) {
                this.heading = this.velocity.clone().normalize();
                this.side = this.heading.clone().Perp();
            }
        }

//        debug.DrawVector(this.heading, this.position, 0x0000FF);

        this.lastUnitStandingOn = this.unitStandingOn;

        if ( this.dynamic || !this.initialStaticUpdateDone ) {

            this.position.getPositionFromMatrix(this.object3D.matrixWorld);

            var me = this;


            if ( this instanceof Mesh && this.mesh ) {
                this.object3D.updateMatrixWorld(true);
            }

            this.object3D.traverse( function ( object ) {
                if ( object.unit && object.unit instanceof Fighter ) {
                    object.unit.position.getPositionFromMatrix(object.matrixWorld);
                    object.unit.rotation.copy(me.object3D.rotation);
                    //object.unit.rotation.x += object.unit.object3D.rotation.x;
                    object.unit.rotation.y += object.unit.object3D.rotation.y;
                    //object.unit.rotation.z += object.unit.object3D.rotation.z;
                }
            });


            if ( this instanceof Mesh && this.mesh ) {
                this.UpdateRotationByVertices();
            }
            if ( this instanceof Fighter || this instanceof Billboard ) {
                // this.object3D.quaternion.setFromEuler(this.object3D.rotation);
                // this.object3D.updateMatrixWorld(true);
                // var rotationMatrix = (new THREE.Matrix4()).extractRotation(this.object3D.matrixWorld);
                // this.rotation.setFromRotationMatrix(rotationMatrix);
                if ( !this.unitStandingOn ) {
                    this.rotation.copy(this.object3D.rotation);
                }


                // if ( this.unitStandingOn ) {
                //     this.rotation.x += this.unitStandingOn.object3D.rotation.x;
                //     this.rotation.y += this.unitStandingOn.object3D.rotation.y;
                //     this.rotation.z += this.unitStandingOn.object3D.rotation.z;
                // }
            }
            //
            this.initialStaticUpdateDone = true;
        }

        // Copy the matrix into a vector
        //this.object3D.updateMatrixWorld(true);
//        this.position.getPositionFromMatrix(this.object3D.matrixWorld);


    },
    GetCellStandingOn: function() {
      var cp = WorldToCellCoordinates(this.position.x, this.position.z, cellSize);

      var cellStandingOn = !_.isUndefined(terrainHandler.cells[cp.x+"-"+cp.z]) ? terrainHandler.cells[cp.x+"-"+cp.z] : null;

      return cellStandingOn;
    }
});
