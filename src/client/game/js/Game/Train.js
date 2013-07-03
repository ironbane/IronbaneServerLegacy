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

        //var newvel = this.targetPosition.clone().subSelf(this.position);

//        var dist = newvel.lengthSq();
//
//        if ( dist > 1.0 ) {
//            this.velocity = newvel.normalize().multiplyScalar(2);
//        }
//        else {
//            this.velocity.
//        }
        this.steeringForce = this.steeringBehaviour.Arrive(this.targetPosition, 1.0);

        // sw("this.targetRotation", this.targetRotation.ToString());
        // sw("this.rotation", this.rotation.ToString());

        this.rotation.lerpSelf(this.targetRotation, dTime*4);

        this._super(dTime);

        //this.UpdateRotation();

    }
});


