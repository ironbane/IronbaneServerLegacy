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


var Lever = ToggleableObstacle.extend({
  Init: function(position, id, metadata) {
    this._super(position, new THREE.Euler(), id, 17, {
      'movementType':4,
      'rotY':0,
      'on':metadata.on
      });
  },
  BuildMesh: function(geometry, jsonMaterials) {

    this._super(geometry, jsonMaterials);

    var mp = this.on ? 1 : 0;

    this.targetRotation.x = this.startRotation.x + Math.PI/2 * mp;

    this.changeRotation = true;


  },
  Toggle: function(on) {
    this.on = on;

    var mp = this.on ? 1 : 0;

    this.targetRotation.x = this.startRotation.x + Math.PI/2 * mp;


    soundHandler.Play("misc/switch");

  },
  tick: function(dTime) {

    this.changeRotation = true;
    this._super(dTime);

  }
});
