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

THREE.PixelationShader = {

	uniforms: {

		"tColor":   { type: "t", value: null },
		"pixelWidth":    { type: "f", value: 10.0 },
		"pixelHeight":   { type: "f", value: 10.0 },
		"screenWidth":    { type: "f", value: 0.0 },
		"screenHeight":   { type: "f", value: 0.0 }                

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"varying vec2 vUv;",

		"uniform sampler2D tColor;",
                "uniform float pixelWidth;",
                "uniform float pixelHeight;",
                "uniform float screenWidth;",
                "uniform float screenHeight;",

		"void main() {",

			"vec4 col = vec4( 0.0 );",

			
                        
                        "vec3 tc = vec3(1.0, 0.0, 0.0);",

                        "float dx = pixelWidth*(1./screenWidth);",
                        "float dy = pixelHeight*(1./screenHeight);",
                        "vec2 coord = vec2(dx*floor(vUv.x/dx), dy*floor(vUv.y/dy));",
                                                                    
                     
                        "col += texture2D( tColor, coord );",
                        
			"gl_FragColor = col;",
			"gl_FragColor.a = 1.0;",                        

		"}"

	].join("\n")

};
