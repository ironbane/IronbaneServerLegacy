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



var Lever = Unit.extend({
	Init: function(data) {
	

            this._super(data);
             
             
            this.useTimeout = 0.0;

            this.on = false;
            


             
	},
        Awake: function() {
            if ( !this.data.switchNumber ) {
                log("Bad switch number for "+this.id);
                this.targetUnit = null;
            }
            else {                                        

                this.data.switchNumber = -Math.abs(this.data.switchNumber);

                this.targetUnit = worldHandler.FindUnit(this.data.switchNumber);
                
                
            }


            if ( !(this.targetUnit instanceof ToggleableObstacle) ) this.targetUnit = null;            
            
            if ( this.targetUnit ) {
                this.targetUnit.UpdateLeverList();
                this.Toggle(this.targetUnit.on);
            }    
            
            
            this._super();
        },
        Toggle: function(bool) {
            
            log("[Lever] "+this.id+" toggled "+(bool?"on":"off"));
            
            this.on = bool;

            this.EmitNearby('toggle', {id:this.id,on:this.on});

            this.useTimeout = 2.0;
    
        },
        Tick: function(dTime) {
            
            this._super(dTime);
            
            if ( this.useTimeout > 0 ) {
                this.useTimeout -= dTime;
            }
            else {
                var units = worldHandler.world[this.zone][this.cellX][this.cellZ]["units"];
                
                for(var u=0;u<units.length;u++) {
                    if ( !(units[u] instanceof Player) ) continue;

                    if ( units[u].InRangeOfUnit(this, 1) ) {

                        if ( this.targetUnit ) {
                            this.targetUnit.Toggle(!this.on);
                        }


                        break;
                    }
                }
            }
            
        }
});


                
