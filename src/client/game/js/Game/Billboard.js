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
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var billboardSpritePath = 'plugins/game/images/billboards/';
 
var Billboard = Unit.extend({
    Init: function(position, rotY, id, param, customPath, customName) {	
        
        this.customPath = customPath || false;
        
        customName = ISDEF(customName) ? customName : "Billboard";
        
        this._super(position, rotY, id, customName, param);
        
        //        this.targetPosition.x = 1.0;
        //        this.targetPosition.z = 1.0;
        
        
        
        
        this.dynamic = false;
        this.enableGravity = false;

        this.collider = null;
		
    },
    Add: function () {

    //console.warn(this.position.x);


    // Get material


        var texture = this.customPath ? 'plugins/game/images/'  + this.param+'.png' : billboardSpritePath + ''+this.param+'.png';
        this.texture = textureHandler.GetTexture( texture, true);

        this.TryToBuildMesh();;


        this._super();
    },
    TryToBuildMesh: function() {
        if ( this.texture.image.width === 0 ) {
            (function(unit){setTimeout(function(){unit.TryToBuildMesh()}, 1000)})(this);
        }
        else {
            this.BuildMesh();
        }
    },
    BuildMesh: function() {
        var planeGeo = new THREE.PlaneGeometry(this.size * (this.texture.image.width/16), this.size * (this.texture.image.height/16), 1, 1);
		
                
        this.meshHeight = (this.texture.image.height/16);
                
        // Assign material
//
//        // Clear UV
//        planeGeo.faceUvs = [[]];
//        planeGeo.faceVertexUvs = [[]];		
	
        // planeGeo.faceUvs[0].push(new THREE.UV(0,1));
        // planeGeo.faceVertexUvs[0].push(faceuv);
		
        var uniforms = {
            uvScale : { type: 'f', value: 1.0 },
            size : { type: 'v2', value: new THREE.Vector2(1,1) },
            hue : { type: 'v3', value: new THREE.Vector3(1,1,1) },
            texture1 : { type: 't', value: this.texture }
        };		

        var shaderMaterial = new THREE.ShaderMaterial({
            uniforms : uniforms,
            vertexShader : $('#vertex').text(),
            fragmentShader : $('#fragment').text(),
            //transparent : true, 
            alphaTest: 0.5
        });	
		
		//if ( stealth ) shaderMaterial.wireframe = true;		

//        planeGeo.materials = [shaderMaterial];
//        planeGeo.faces[0].materialIndex = 0;

        

        this.mesh = new THREE.Mesh(planeGeo, shaderMaterial);		
        
        this.mesh.material.side = THREE.DoubleSide;

        this.mesh.unit = this;
	
        this.mesh.geometry.dynamic = true;

        ironbane.scene.add(this.mesh);
        
        
        // Build a collider
       //this.collider = new THREE.SphereCollider(this.position, 1); 
       
    },
    Tick: function(dTime) {

        this._super(dTime);
		
        if ( this.mesh ) {
            this.mesh.LookAt(ironbane.camera.position, 0, 0, 0, true);
        }
    }
});



