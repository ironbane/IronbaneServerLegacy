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

var TEXTURE_WAYPOINT = "misc/waypoint";
var TEXTURE_TRIGGER = "misc/trigger";

var Waypoint = Billboard.extend({
    Init: function(position, id) {
        this.drawNameMesh = !isProduction;
        this._super(position, 0, id, TEXTURE_WAYPOINT, true, -id);
        this.enableGravity = false;
        this.dynamic = true;
        this.enableShadow = false;
    }
});

var Trigger = Billboard.extend({
    Init: function(position, id) {
        this.drawNameMesh = !isProduction;
        this._super(position, 0, id, TEXTURE_TRIGGER, true, -id);
        this.enableGravity = false;
        this.dynamic = true;
        this.enableShadow = false;
    },
    tick: function(dTime) {
        if(this.mesh) {
            if(le('globalEnable')) {
                this.mesh.visible = true;
            } else {
                this.mesh.visible = false;
            }
        }

        this._super(dTime);
    }
});
