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

var Train = Actor.extend({
    Init: function(data) {
        this._super(data);

        this.sendRotationPacketX = true;
        this.sendRotationPacketY = true;
        this.sendRotationPacketZ = true;
    },
    Tick: function(dTime) {
        this._super(dTime);

        this.rotation.y = (Math.atan2(this.heading.z, this.heading.x));

        if (this.rotation.y < 0) {
            this.rotation.y += (Math.PI * 2);
        }

        this.rotation.y = (Math.PI * 2) - this.rotation.y;

        while (this.rotation.x < 0) {
            this.rotation.x += (Math.PI * 2);
        }

        while (this.rotation.x > (Math.PI * 2)) {
            this.rotation.x -= (Math.PI * 2);
        }

        while (this.rotation.z < 0) {
            this.rotation.z += (Math.PI * 2);
        }

        while (this.rotation.z > (Math.PI * 2)) {
            this.rotation.z -= (Math.PI * 2);
        }
    }
});
