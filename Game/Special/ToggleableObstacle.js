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

var TIMER_KEY_TIME_OUT = 2.0;


var ToggleableObstacle = Unit.extend({
  Init: function(data) {


    this._super(data);

    this.on = !_.isUndefined(this.data.startOpen) ? this.data.startOpen : false;

    this.leverList = [];

    this.keyUseTimeout = 0.0;

  },
  Awake: function() {
    //log("[ToggleableObstacle] Awake, updating leverlist!");
    this._super();

    this.UpdateLeverList();
  },
  UpdateLeverList: function() {
    // Get all levers in the world, and check which ones have a targetUnit that points to us

    this.leverList = [];

    (function(toggleableObstacle){
      worldHandler.LoopUnits(function(unit){
        if ( unit instanceof Lever ) {

          if ( unit.targetUnit == toggleableObstacle ) {
            toggleableObstacle.leverList.push(unit);
          }

        }
      });
    })(this);

  },
  Toggle: function(bool) {

    this.on = bool;

    this.EmitNearby('toggle', {
      id:this.id,
      on:this.on
    });


    // Toggle all levers that point to us! This will keep everything synchronised
    for(var l=0;l<this.leverList.length;l++) {
      this.leverList[l].Toggle(this.on);
    }
  },
  Tick: function(dTime) {

    // Check if there are players nearby, holding a key with an attr1 that points to us
    this._super(dTime);

    if ( this.keyUseTimeout > 0 ) {
       this.keyUseTimeout -= dTime;
    } else {
     
        var self = this;

        worldHandler.LoopUnitsNear(self.zone, self.cellX, self.cellZ, function(unit) { 

            if ( unit.isPlayer() ) {

                if ( unit.InRangeOfUnit(self, 2) ) {

                    // Check the equipped weapon of self unit, and see if it's a key?

                    var item = unit.GetEquippedWeapon();
                    if ( item ) {
                        var template = dataHandler.items[item.template];
                        if ( template.type === "tool" && template.subtype === "key" ) {
                            if ( item.attr1 === -self.id ) {
                                self.Toggle(!self.on);
                                self.keyUseTimeout = TIMER_KEY_TIME_OUT;
                            }
                        }
                    }
                }
            }

        }, 0);

    }
  }
});
