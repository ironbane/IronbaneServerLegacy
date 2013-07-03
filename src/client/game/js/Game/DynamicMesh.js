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

        if ( ISDEF(this.metadata.movementType) ) this.movementType = parseInt(this.metadata.movementType, 10);
        if ( ISDEF(this.metadata.speedMultiplier) ) this.speedMultiplier = parseFloat(this.metadata.speedMultiplier);
        if ( ISDEF(this.metadata.distanceMultiplier) ) this.distanceMultiplier = parseFloat(this.metadata.distanceMultiplier);

    },
    BuildMesh: function(geometry) {

        this._super(geometry);

        // Let's keep everything at rotation 0,0,0 from the start
        this.startVertices = [];
        for(var v=0;v<this.mesh.geometry.vertices.length;v++) {
            this.startVertices.push(this.mesh.geometry.vertices[v].clone());
        }

//        this.rotation.copy(this.startRotation);
//        this.RotateVertices();
    },
    Tick: function(dTime) {

        if ( this.changeRotation ) {

            this.RotateVertices();
            this.changeRotation = false;
        }

        this._super(dTime);

    },
    RotateVertices: function() {

        if ( !this.mesh ) return;

        var rotationMatrix = new THREE.Matrix4();
        var rot = new THREE.Vector3((this.rotation.x).ToRadians(), (this.rotation.y).ToRadians(), (this.rotation.z).ToRadians());
        // sw("rot", rot.ToString());
        rotationMatrix.setRotationFromEuler(rot);

        for(var v=0;v<this.mesh.geometry.vertices.length;v++) {
            this.mesh.geometry.vertices[v].copy(this.startVertices[v]);
            rotationMatrix.multiplyVector3(this.mesh.geometry.vertices[v]);
        }

        //this.object3D.matrixWorld.setRotationFromEuler(rot);
        this.localRotation.copy(rot);
        //this.mesh.rotation.copy(rot);

        this.mesh.geometry.verticesNeedUpdate = true;

        this.mesh.geometry.computeCentroids();
        this.mesh.geometry.computeFaceNormals();
        //this.mesh.geometry.computeVertexNormals();
    }
});
