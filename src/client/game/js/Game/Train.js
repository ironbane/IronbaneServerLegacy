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
    Tick: function(dTime) {

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

        this.localPosition.x = this.localPosition.x.Lerp(this.targetPosition.x, dTime*2);
        this.localPosition.z = this.localPosition.z.Lerp(this.targetPosition.z, dTime*2);
        this.localPosition.y = this.localPosition.y.Lerp(this.targetPosition.y, dTime*2);

        if ( (this.targetRotation.x-this.localRotation.x) > Math.PI ) {
            this.localRotation.x += Math.PI*2;
        }
        if ( (this.targetRotation.y-this.localRotation.y) > Math.PI ) {
            this.localRotation.y += Math.PI*2;
        }
        if ( (this.targetRotation.z-this.localRotation.z) > Math.PI ) {
            this.localRotation.z += Math.PI*2;
        }

        if ( (this.localRotation.x-this.targetRotation.x) > Math.PI ) {
            this.localRotation.x -= Math.PI*2;
        }
        if ( (this.localRotation.y-this.targetRotation.y) > Math.PI ) {
            this.localRotation.y -= Math.PI*2;
        }
        if ( (this.localRotation.z-this.targetRotation.z) > Math.PI ) {
            this.localRotation.z -= Math.PI*2;
        }

        this.localRotation.x = this.localRotation.x.Lerp(this.targetRotation.x, dTime*2);
        this.localRotation.z = this.localRotation.z.Lerp(this.targetRotation.z, dTime*2);
        this.localRotation.y = this.localRotation.y.Lerp(this.targetRotation.y, dTime*2);

        sw("this.targetRotation", this.targetRotation.ToString());
        sw("this.rotation", this.rotation.ToString());

        //this.localRotation.lerp(this.targetRotation, dTime*4);

        this._super(dTime);

        //this.UpdateRotation();

    }
});


