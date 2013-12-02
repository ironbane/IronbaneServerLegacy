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

var billboardSpritePath = 'images/billboards/';

var Billboard = Unit.extend({
    Init: function(position, rotY, id, param, customPath, customName) {

        this.customPath = customPath || false;

        customName = !_.isUndefined(customName) ? customName : "Billboard";

        this._super(position, rotY, id, customName, param);

        this.dynamic = false;
        this.enableGravity = false;

        this.canSelectWithEditor = true;

    },
    Add: function() {
        var texture = this.customPath ? 'images/' + this.param + '.png' : billboardSpritePath + '' + this.param + '.png';
        this.texture = ironbane.textureHandler.getTexture(texture, true);

        this.TryToBuildMesh();

        this._super();
    },
    TryToBuildMesh: function() {
        if (this.texture.image.width === 0) {
            (function(unit) {
                setTimeout(function() {
                    unit.TryToBuildMesh();
                }, 1000);
            })(this);
        } else {
            this.BuildMesh();
        }
    },
    BuildMesh: function() {
        var planeGeo = new THREE.PlaneGeometry(this.size * (this.texture.image.width / 16), this.size * (this.texture.image.height / 16), 1, 1);

        this.meshHeight = (this.texture.image.height / 16);

        var uniforms = {
            uvScale: {
                type: 'v2',
                value: new THREE.Vector2(1, 1)
            },
            size: {
                type: 'v2',
                value: new THREE.Vector2(1, 1)
            },
            hue: {
                type: 'v3',
                value: new THREE.Vector3(1, 1, 1)
            },
            vSun: {
                type: 'v3',
                value: new THREE.Vector3(0, 1, 0)
            },
            texture1: {
                type: 't',
                value: this.texture
            }
        };

        var shaderMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: $('#vertex').text(),
            fragmentShader: $('#fragment').text(),
            //transparent : true,
            alphaTest: 0.5
        });


        this.mesh = new THREE.Mesh(planeGeo, shaderMaterial);

        this.mesh.material.side = THREE.DoubleSide;

        this.mesh.unit = this;

        this.mesh.geometry.dynamic = true;

        // Because of a bug with the raycaster, rotations are not taken into account
        // when casting rays. We need to rotate the geometry of the mesh instead.
        // We therefore need the starting rotations of all the vertices here
        // so we can do a manual rotation for each vertex later in Tick()
        this.startVertices = [];

        _.each(this.mesh.geometry.vertices, function(vertex) {
            this.startVertices.push(vertex.clone());
        }, this);


        ironbane.scene.add(this.mesh);
    },
    tick: function(dTime) {
        this._super(dTime);

        if (this.mesh) {
            this.mesh.LookFlatAt(ironbane.camera.position, true);
        }
    }
});