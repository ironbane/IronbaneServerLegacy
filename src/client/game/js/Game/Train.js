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




var Train = DynamicMesh.extend({
    Init: function(position, rotation, id, param, metadata) {


        this._super(position, rotation, id, param, metadata);



    },
    tick: function(dTime) {

        //var newvel = this.targetPosition.clone().sub(this.position);

//        var dist = newvel.lengthSq();
//
//        if ( dist > 1.0 ) {
//            this.velocity = newvel.normalize().multiplyScalar(2);
//        }
//        else {
//            this.velocity.
//        }
        this.changeRotationNextTick = true;

        this.steeringForce = this.steeringBehaviour.Arrive(this.targetPosition, 1.0);

        this.object3D.position.x = this.object3D.position.x.Lerp(this.targetPosition.x, dTime*2);
        this.object3D.position.z = this.object3D.position.z.Lerp(this.targetPosition.z, dTime*2);
        this.object3D.position.y = this.object3D.position.y.Lerp(this.targetPosition.y, dTime*2);

        if ( (this.targetRotation.x-this.object3D.rotation.x) > Math.PI ) {
            this.object3D.rotation.x += Math.PI*2;
        }
        if ( (this.targetRotation.y-this.object3D.rotation.y) > Math.PI ) {
            this.object3D.rotation.y += Math.PI*2;
        }
        if ( (this.targetRotation.z-this.object3D.rotation.z) > Math.PI ) {
            this.object3D.rotation.z += Math.PI*2;
        }

        if ( (this.object3D.rotation.x-this.targetRotation.x) > Math.PI ) {
            this.object3D.rotation.x -= Math.PI*2;
        }
        if ( (this.object3D.rotation.y-this.targetRotation.y) > Math.PI ) {
            this.object3D.rotation.y -= Math.PI*2;
        }
        if ( (this.object3D.rotation.z-this.targetRotation.z) > Math.PI ) {
            this.object3D.rotation.z -= Math.PI*2;
        }

        this.object3D.rotation.x = this.object3D.rotation.x.Lerp(this.targetRotation.x, dTime*2);
        this.object3D.rotation.z = this.object3D.rotation.z.Lerp(this.targetRotation.z, dTime*2);
        this.object3D.rotation.y = this.object3D.rotation.y.Lerp(this.targetRotation.y, dTime*2);

        //this.object3D.rotation.lerp(this.targetRotation, dTime*4);

        this._super(dTime);

        //this.UpdateRotation();

    }
});


