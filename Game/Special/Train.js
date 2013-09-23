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

        this.waypoints = [];

        this.sendRotationPacketX = true;
        this.sendRotationPacketY = true;
        this.sendRotationPacketZ = true;

        this.waypointIdList = data.data.waypointList.split(",");

	},
    Awake: function() {

        // Build a list of waypoints
        _.each(this.waypointIdList, function(id) {

            var unit = worldHandler.FindUnit(-parseInt(id, 10));

            if ( unit ) {
                // Not using clone() here, so we take the position by reference
                // This way, perhaps in the future we can have dynamic waypoints
                this.waypoints.push(unit.position);
            }

        }, this);

        this._super();
    },
    Tick: function(dTime) {

        this._super(dTime);

        this.rotation.y = (Math.atan2(this.heading.z, this.heading.x)).ToDegrees();

        if ( this.rotation.y < 0 ) this.rotation.y += 360;
        this.rotation.y = 360 - this.rotation.y;

        // this.rotation.x += 10;
        // while ( this.rotation.x < 0 ) this.rotation.x += 360;
        // while ( this.rotation.x > 360 ) this.rotation.x -= 360;

        // this.rotation.z = 50;
        // while ( this.rotation.z < 0 ) this.rotation.z += 360;
        // while ( this.rotation.z > 360 ) this.rotation.z -= 360;

        console.log(this.rotation);


    }
});
