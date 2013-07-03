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

var multiboardSpritePath = 'plugins/game/images/multiboards/';
 
var Multiboard = Unit.extend({
    Init: function(position, rotY, id, param) {	
        this._super(position, rotY, id, 'Multiboard', param);
        
        //        this.targetPosition.x = 1.0;
        //        this.targetPosition.z = 1.0;
        
        this.dynamic = false;
        this.enableGravity = false;

		
    },
	Add: function () {
	
        //console.warn(this.position.x);
    
        var directionSpriteIndex = this.GetDirectionSpriteIndex();

        // Get material


        var texture = multiboardSpritePath + ''+this.param+'.png';


        var planeMat = textureHandler.GetTexture( texture );
		
        // Todo: add other layers on top (clothes, weapons)
		
        if ( stealth ) {
            planeMat.wireframe = true;
        }
		
        planeMat.transparent = true;        
        planeMat.wrapT = planeMat.wrapS = THREE.RepeatWrapping;

		
        var planeGeo = new THREE.PlaneGeometry(this.size, this.size, 1, 1);
		
        // Assign material
        planeGeo.materials = [planeMat];
        planeGeo.faces[0].materialIndex = 0;	
//
//        // Clear UV
//        planeGeo.faceUvs = [[]];
//        planeGeo.faceVertexUvs = [[]];		

        // planeGeo.faceUvs[0].push(new THREE.UV(0,1));
        // planeGeo.faceVertexUvs[0].push(faceuv);
		
		// var uniforms = {
		  // time : { type: 'f', value: 1.0 },
		  // size : { type: 'v2', value: new THREE.Vector2(width,height) }
		// };		
		
		// var shaderMaterial = new THREE.ShaderMaterial({
		  // uniforms : uniforms,
		  // vertexShader : $('#vertex').text(),
		  // fragmentShader : $('#fragment').text()
		// });		

        this.mesh = new THREE.Mesh(planeGeo, new THREE.MeshFaceMaterial());		

//        //this.mesh.doubleSided = true;
	
        this.mesh.geometry.dynamic = true;

		ironbane.scene.add(this.mesh);

	},
    Tick: function(dTime) {

        this._super(dTime);
		
		this.DisplayUVFrame(0, this.GetDirectionSpriteIndex(), 1, 8);		

    }
});


