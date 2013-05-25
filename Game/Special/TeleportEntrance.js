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

var TeleportEntrance = Unit.extend({
    Init: function(data) {

        this._super(data);


        // Prevent from being used immediately
        this.useTimeout = 3.0;

    },
    Awake: function() {

      this._super();

      this.FindTargetExit();



    },
    FindTargetExit: function() {


        if (this.data && ISDEF(this.data.targetExit) ) {

            this.data.targetExit = -Math.abs(this.data.targetExit);

            this.targetExit = worldHandler.FindUnit(this.data.targetExit);

            if ( !(this.targetExit instanceof TeleportExit) ) this.targetExit = null;
        }
        else {
            this.targetExit = null;
        }


    },
    Tick: function(dTime) {

        this._super(dTime);

        if ( this.targetExit ) {
            if ( this.useTimeout > 0 ) {
                this.useTimeout -= dTime;
            }
            else {
                var units = worldHandler.world[this.zone][this.cellX][this.cellZ].units;

                for(var u=0;u<units.length;u++) {
                    if ( !(units[u] instanceof Player) ) continue;

                    if ( units[u].InRangeOfUnit(this, 1) ) {

                        log("Teleport!");

                        units[u].TeleportToUnit(this.targetExit);

                        this.useTimeout = 2.0;
                        break;
                    }
                }
            }
        }


    }
});
