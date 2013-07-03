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



var Sign = Mesh.extend({
  Init: function(position, rotation, id, param, metadata) {

    this.signType = param;

    // Mesh ID of the sign to use
    switch(param) {
      case SignTypeEnum.DIRECTION:
        param = 16;
        break;
      case SignTypeEnum.NORMAL:
        param = 14;
        break;
      case SignTypeEnum.HUGE:
        param = 15;
        break;
    }

    this._super(position, rotation, id, param, metadata);


    this.dynamic = false;

  },
  BuildMesh: function(geometry) {

    this._super(geometry);



    var c = document.createElement('canvas');
    var ctx = c.getContext('2d');
    var fillText = this.metadata['text'];

    c.width= 500;
    c.height= 500;
    ctx.fillStyle='#FFFFFF';
    ctx.strokeStyle='#000000';

    //this.metadata['fontSize'] = 29;

    ctx.font = this.metadata.fontSize+'pt Arial';


    //fillText = 'It was a dark and stormy night.\nWe had just begin cleaning\nup the room when we suddenly\nheard this big BANG!'
    //this.metadata['fontSize']+'
    ctx.textAlign = 'center'
    var dim = ctx.measureText(fillText);


    //c.getContext('2d').textAlign= 'center';

    var lines = fillText.split('|');
    var lineheight = this.metadata['fontSize']*1.5;

    for (var i = 0; i<lines.length; i++) {
      var total = lines.length * lineheight;
      ctx.fillText(lines[i], c.width/2, 10+(this.metadata['fontSize']*0.8) + c.height/2 - (total / 2) + (i * lineheight));
      //ctx.strokeText(lines[i], c.width/2, c.height/2 - (total / 2) + (i * lineheight));
    }

    var tex = new THREE.Texture(c);
    tex.needsUpdate = true;

    var mat = new THREE.MeshBasicMaterial({
      map: tex,
      //transparent : true,
      alphaTest: 0.5
    });
    //mat.transparent = true;

    var scale = 0.01 * this.size;

    this.textMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(c.width*scale, c.height*scale),
      mat
      );



    var ypos = 0;

    switch(this.signType) {
      case SignTypeEnum.DIRECTION:
        ypos = 1.95;
        break;
      case SignTypeEnum.NORMAL:
        ypos = 1.7;
        break;
      case SignTypeEnum.HUGE:
        ypos = 2.45;
        break;
    }

    this.textMesh.position.z = 0.1;
    this.textMesh.position.y = ypos;

    this.localRotation.copy(this.rotation.clone().ToRadians());


    //this.textMesh.doubleSided = true;

    this.object3D.add(this.textMesh);

    this.textMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(c.width*scale, c.height*scale),
      mat
      );

    this.textMesh.position.z = -0.1;
    this.textMesh.position.y = ypos;

    this.textMesh.rotation.y = Math.PI;

    //this.textMesh.doubleSided = true;

    this.object3D.add(this.textMesh);
  },
  Tick: function(dTime) {


    this._super(dTime);


  }
});
