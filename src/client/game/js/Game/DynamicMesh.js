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




var DynamicMesh = Mesh.extend({
    Init: function(position, rotation, id, param, metadata) {
        this._super(position, rotation, id, param, metadata);
        this.dynamic = true;


        this.startRotation = rotation.clone();

        this.changeRotation = false;

        if ( !_.isUndefined(this.metadata.movementType) ) this.movementType = parseInt(this.metadata.movementType, 10);
        if ( !_.isUndefined(this.metadata.speedMultiplier) ) this.speedMultiplier = parseFloat(this.metadata.speedMultiplier);
        if ( !_.isUndefined(this.metadata.distanceMultiplier) ) this.distanceMultiplier = parseFloat(this.metadata.distanceMultiplier);

    },
//     BuildMesh: function(geometry, jsonMaterials) {

//         this._super(geometry, jsonMaterials);

//         // Let's keep everything at rotation 0,0,0 from the start
//         this.startVertices = [];
//         for(var v=0;v<this.mesh.geometry.vertices.length;v++) {
//             this.startVertices.push(this.mesh.geometry.vertices[v].clone());
//         }

// //        this.rotation.copy(this.startRotation);
// //        this.RotateVertices();
//     },
    tick: function(dTime) {

        // if ( this.changeRotation ) {

        //     this.RotateVertices();
        //     this.changeRotation = false;
        // }

        //this.object3D.setRotationFromEuler(this.rotation);
        //this.object3D.rotation.setFromQuaternion(this.object3D.quaternion);
        this.object3D.quaternion.setFromEuler(this.object3D.rotation);

        this._super(dTime);

    }
    // RotateVertices: function() {

    //     if ( !this.mesh ) return;

    //     var rotationMatrix = new THREE.Matrix4();
    //     var rot = new THREE.Euler(this.rotation.x, this.rotation.y, this.rotation.z);
    //     // sw("rot", rot.ToString());
    //     rotationMatrix.makeRotationFromEuler(rot);

    //     for(var v=0;v<this.mesh.geometry.vertices.length;v++) {
    //         this.mesh.geometry.vertices[v].copy(this.startVertices[v]);
    //         this.mesh.geometry.vertices[v].applyMatrix4(rotationMatrix);
    //     }

    //     //this.object3D.matrixWorld.makeRotationFromEuler(rot);
    //     this.object3D.rotation.copy(rot);
    //     //this.mesh.rotation.copy(rot);

    //     this.mesh.geometry.verticesNeedUpdate = true;

    //     this.mesh.geometry.computeCentroids();
    //     this.mesh.geometry.computeFaceNormals();
    //     //this.mesh.geometry.computeVertexNormals();
    // }
});
