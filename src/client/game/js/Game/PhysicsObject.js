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

var PhysicsObject = Class.extend({
    Init: function(position, rotation, scale, velocity) {

       this.enableGravity = true;

       // this.enableCollisionDetection = false;
       // this.hasCollision = false;

        // These values are READ-ONLY! Will be written by the object3D world matrix
        this.position = (position || new THREE.Vector3(0.0, 0.0, 0.0)).clone();
        this.rotation = rotation || new THREE.Vector3(0.0, 0.0, 0.0);
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
        this.object3D.rotation = rotation || new THREE.Vector3(0.0, 0.0, 0.0);
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

        this.object3D.deallocate();

        ironbane.renderer.deallocateObject( this.object3D );
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
                        this.localRotationY += this.lastUnitStandingOn.rotation.y;
                    }

                }
                if ( this.unitStandingOn ) {

                    var str = "";

//                    str += "localPosition was: "+this.localPosition.ToString();

                    // Change the local position!
                    this.localPosition.copy(this.position.clone().subSelf(this.unitStandingOn.position));

                    var rotationMatrix = new THREE.Matrix4();
                    rotationMatrix.extractRotation(this.unitStandingOn.object3D.matrix).transpose();
//                    var rot = new THREE.Vector3((this.unitStandingOn.rotation.x).ToRadians(),
//                    (this.unitStandingOn.rotation.y).ToRadians(), (this.unitStandingOn.rotation.z).ToRadians()).multiplyScalar(-1);
//                    rotationMatrix.setRotationFromEuler(rot);

                    rotationMatrix.multiplyVector3(this.localPosition);

                    if ( this instanceof Player ) {
                        // Add the object's rotation to rotY
                        this.localRotationY -= this.unitStandingOn.rotation.y;
                    }


//                    str += "<br>localPosition is now: "+this.localPosition.ToString();

                    //this.object3D.updateMatrixWorld();

                    ironbane.scene.remove(this.object3D);
                    this.unitStandingOn.object3D.add(this.object3D);


//                    str += "<br><br>position was: "+this.position.ToString();

                    this.object3D.updateMatrixWorld(true);


//                    this.position.getPositionFromMatrix(this.object3D.matrixWorld);

//                    str += "<br>position is now: "+this.position.ToString();
//
//                    ba(str);
//
//                    bm("changed to "+this.unitStandingOn.id);

//this.test = true;
                }
            }


        if ( this.dynamic || !this.initialStaticUpdateDone ) {
          this.position.getPositionFromMatrix(this.object3D.matrixWorld);
          this.initialStaticUpdateDone = true;
        }



//        // Update our children too!
//        for(var c=0;c<this.object3D.children.length;c++){
////              this.object3D.children[c].unit.position.getPositionFromMatrix(this.object3D.children[c].matrixWorld);
//        }

//        debug.DrawVector(this.position, new THREE.Vector3(), 0xFF0000);
//
//
//
//
//        if ( this.unitStandingOn ) {
//            debug.DrawVector(this.localPosition, this.unitStandingOn.position, 0x00FF00);
//        }

//        if ( this.localPosition.equals(this.position) ) sw("equals", true);


//        if ( this == ironbane.player ) {
//            sw("P local", this.localPosition.ToString());
//            sw("P global", this.position.ToString());
//        }
//        else {
//            sw("local", this.localPosition.ToString());
//            sw("global", this.position.ToString());
//        }
//
//        if ( this.unitStandingOn != null ) {
//            sw("unitStandingOn", true);
//        }




        var acceleration = this.steeringForce.multiplyScalar(this.mass);

        this.velocity.addSelf(acceleration.multiplyScalar(dTime));



        this.velocity.Truncate(this.maxSpeed);


        // Add velocity, but relative to our object3D


        var vel = this.velocity.clone();

        if ( this.unitStandingOn ) {
//            var rotationMatrix = new THREE.Matrix4();
//            var rot = new THREE.Vector3((this.unitStandingOn.rotation.x).ToRadians(),
//            (this.unitStandingOn.rotation.y).ToRadians(), (this.unitStandingOn.rotation.z).ToRadians()).multiplyScalar(-1);
//            rotationMatrix.setRotationFromEuler(rot);
//            rotationMatrix.multiplyVector3(vel);

                    var rotationMatrix = new THREE.Matrix4();
                    rotationMatrix.extractRotation(this.unitStandingOn.object3D.matrix).transpose();
                    rotationMatrix.multiplyVector3(vel);
        }


        vel.addSelf(this.globalVelocity);
        this.globalVelocity.set(0,0,0);

        this.localPosition.addSelf(vel.multiplyScalar(dTime));



        if ( this.velocity.length() > 0.01 ) {
            if ( !(this instanceof Fighter) ) {
                this.heading = this.velocity.clone().normalize();
                this.side = this.heading.clone().Perp();
            }
        }

//        debug.DrawVector(this.heading, this.position, 0x0000FF);

        this.lastUnitStandingOn = this.unitStandingOn;

        // Copy the matrix into a vector
        //this.object3D.updateMatrixWorld(true);
//        this.position.getPositionFromMatrix(this.object3D.matrixWorld);


    },
    GetCellStandingOn: function() {
      var cp = WorldToCellCoordinates(this.position.x, this.position.z, cellSize);

      var cellStandingOn = ISDEF(terrainHandler.cells[cp.x+"-"+cp.z]) ? terrainHandler.cells[cp.x+"-"+cp.z] : null;

      return cellStandingOn;
    }
});
