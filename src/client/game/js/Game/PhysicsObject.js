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

        // These values are READ-ONLY! Will be written by the object3D world matrix
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

        this.localPosition = this.object3D.position;
        this.localRotation = this.object3D.rotation;
        this.localScale = this.object3D.scale;


        // Pre-calculate to avoid arrows being stuck in the ground
        this.object3D.updateMatrixWorld();
        this.position.getPositionFromMatrix(this.object3D.matrixWorld);



        this.acceleration = new THREE.Vector3();

        // Only applies to the local position!
        this.velocity = (velocity || new THREE.Vector3(0.0, 0.0, 0.0)).clone();

        // Applies to gloval position! Also gets emptied every tick
        this.globalVelocity = new THREE.Vector3();

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
    Tick: function(dTime) {


        this.oldPosition = this.localPosition.clone();


        if ( this.localPosition.y < -100 ) {
            this.localPosition.y = 100;
        }

//        while ( this.rotation.x < 0 ) {
//            this.rotation.x += 360;
//        }
//        while ( this.rotation.x > 360 ) {
//            this.rotation.x -= 360;
//        }
//        while ( this.rotation.y < 0 ) {
//            this.rotation.y += 360;
//        }
//        while ( this.rotation.y > 360 ) {
//            this.rotation.y -= 360;
//        }
//        while ( this.rotation.z < 0 ) {
//            this.rotation.z += 360;
//        }
//        while ( this.rotation.z > 360 ) {
//            this.rotation.z -= 360;
//        }


            if ( this.unitStandingOn != this.lastUnitStandingOn ) {
                // Perspective changed!
                if ( this.lastUnitStandingOn ) {
                    // First remove the old reference
                    this.lastUnitStandingOn.object3D.remove(this.object3D);
                    ironbane.scene.add(this.object3D);


                    this.localPosition.copy(this.position);

                    if ( this instanceof Player ) {
                        // Add the object's rotation to rotY
                        this.localRotationY += this.lastUnitStandingOn.localRotation.y.ToDegrees();
                    }

                }
                if ( this.unitStandingOn ) {

                    var str = "";

                    this.localPosition.copy(this.position.clone().sub(this.unitStandingOn.position));

                    var rotationMatrix = new THREE.Matrix4();
                    rotationMatrix.extractRotation(this.unitStandingOn.object3D.matrix).transpose();


                    this.localPosition.applyMatrix4(rotationMatrix);

                    if ( this instanceof Player ) {
                        // Add the object's rotation to rotY
                        this.localRotationY -= this.unitStandingOn.localRotation.y.ToDegrees();
                    }


                    ironbane.scene.remove(this.object3D);
                    this.unitStandingOn.object3D.add(this.object3D);


                    this.object3D.updateMatrixWorld(true);


                }
            }










        var acceleration = this.steeringForce.multiplyScalar(this.mass);

        this.velocity.add(acceleration.multiplyScalar(dTime));



        this.velocity.Truncate(this.maxSpeed);


        // Add velocity, but relative to our object3D


        var vel = this.velocity.clone();

        if ( this.unitStandingOn ) {

                    var rotationMatrix = new THREE.Matrix4();
                    rotationMatrix.extractRotation(this.unitStandingOn.object3D.matrix).transpose();
                    vel.applyMatrix4(rotationMatrix);
        }


        vel.add(this.globalVelocity);
        this.globalVelocity.set(0,0,0);

        this.localPosition.add(vel.multiplyScalar(dTime));



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

            this.object3D.traverse( function ( object ) {
                if ( object.unit ) {
                    object.unit.position.getPositionFromMatrix(object.matrixWorld);
                }
            });


          if ( this instanceof Mesh && this.mesh ) {
            //this.mesh.rotation.setFromQuaternion(this.object3D.quaternion);
            this.UpdateRotationByVertices();
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
