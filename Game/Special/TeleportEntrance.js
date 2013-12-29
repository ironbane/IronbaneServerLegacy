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

        var self = this;

        if (self.data && !_.isUndefined(self.data.targetExit)) {

            self.data.targetExit = -Math.abs(self.data.targetExit);

            worldHandler.FindUnit(self.data.targetExit)
               .then(function(exit) {

                   if (exit instanceof TeleportExit) {
                       self.targetExit = exit;
                   }

               });

        } else {
            self.targetExit = null;
        }
    },
    Tick: function(dTime) {
        this._super(dTime);

        if (this.targetExit) {
            if (this.useTimeout > 0) {
                this.useTimeout -= dTime;
            } else {

                var self = this,
                    shouldContinue = true;


                worldHandler.LoopUnitsNear(self.zone, self.cellX, self.cellZ, function(unit) { 

                    if(!shouldContinue) {
                        return;
                    }

                    if (!(unit.isPlayer())) {
                        return;
                    }

                    if (unit.InRangeOfUnit(self, 1)) {

                        log('Game/Special/TeleportEntrance: Teleport to ' + self.targetExit.position);

                        unit.TeleportToUnit(self.targetExit);

                        self.useTimeout = 2.0;

                        shouldContinue = false;
                    }
                }, 0);
            }
        }
    }
});
