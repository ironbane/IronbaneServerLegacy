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

var ChatBubble = PhysicsObject.extend({
    Init: function(unit, text) {

        this.unit = unit;
        this.lifeTime = 10.0;

        this._super(unit.position.clone());

        this.textMesh = null;

        this.MakeTextMesh(ironbane.mouthwash(text));

        this.text = text;

        this.size = 1.0;

    },
    MakeTextMesh: function(text) {

            var c = document.createElement('canvas');
            var ctx = c.getContext('2d');
            var fillText = text;

            c.width = 1200;
            c.height = 70;

            ctx.font = '26pt Arial Black';
            ctx.textAlign = 'center';

            var dim = ctx.measureText(fillText);


            ctx.fillStyle = "rgba(123, 103, 163, 0.4)";
            ctx.fillRect(c.width/2-(dim.width/2)-10, 10, dim.width+20,38);

            ctx.strokeStyle='#000000';
            ctx.strokeRect(c.width/2-(dim.width/2)-10, 10, dim.width+20,38);

            ctx.fillStyle='#07382b';
            ctx.strokeStyle='#13a67e';

            ctx.beginPath();
            ctx.moveTo((c.width/2)-10,48);
            ctx.lineTo((c.width/2)+10,48);
            ctx.lineTo((c.width/2),58);
            ctx.fill();

            ctx.fillText(fillText, c.width/2, 40);
            ctx.strokeText(fillText, c.width/2, 40);

            var tex = new THREE.Texture(c);
            tex.needsUpdate = true;

            var mat = new THREE.MeshBasicMaterial({
                map: tex,
                transparent : true
            });
            mat.transparent = true;

            var scale = 0.01;

            mat.side = THREE.DoubleSide;

            this.textMesh = new THREE.Mesh(
                new THREE.PlaneGeometry(c.width*scale, c.height*scale),
                mat
                );

            this.textMesh.doubleSided = true;

            ironbane.scene.add(this.textMesh);

    },
    Destroy: function() {

        ironbane.getUnitList().removeUnit(this);

        if ( this.textMesh ) {
            ironbane.scene.remove(this.textMesh);
        }

    },
    tick: function(dTime) {
        // Count the amount of bubbles that are on top of the player
        var me = this;
        var foundOurselves = false;
        var count = ironbane.getUnitList().findUnits(function(unit){
            if ( unit === me ) foundOurselves = true;
            if ( !foundOurselves ) return false;
            return unit instanceof ChatBubble &&
            unit.unit === me.unit;
        }).length;

        var offset = ((this.unit === ironbane.player || this.unit.id < 0) ? 1.5 : 2.0) + (count * 0.6);

        this.object3D.position = this.unit.position.clone().add(new THREE.Vector3(0, offset, 0));

        this.lifeTime -= dTime;

        this._super(dTime);

        if ( this.textMesh ) {
            this.textMesh.position.copy(this.object3D.position);
            this.textMesh.LookFlatAt(ironbane.camera.position);
        }

        if ( this.lifeTime <= 0 ) this.Destroy();
    }
});


