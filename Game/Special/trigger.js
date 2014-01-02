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

// a trigger is an entity that fires a custom script when other units enter and exit

var Trigger = Unit.extend({
    Init: function(data) {
        this._super(data);

        // default to right on top of it
        this.range = (this.data && this.data.range) ? this.data.range : 1;
        this.triggerInterval = (this.data && this.data.triggerInterval) ? this.data.triggerInterval : 10;
        this.triggerTimeout = this.triggerInterval;

        // array of current units inside range
        this.guests = [];
    },
    Tick: function(dTime) {
        var trigger = this,
            promises = [];

        trigger._super(dTime);

        if(trigger.triggerTimeout > 0) {
            trigger.triggerTimeout -= dTime;
            return;
        }

        // check guests to see if still present
        promises = _.map(trigger.guests, function(unit) {

            // make sure we are still in the world and near the chest
            // TODO: faster / better than FindUnit??
            return worldHandler.FindUnit(unit.id).then(function(unit) {

                   if(unit.InRangeOfUnit(trigger, trigger.range)) {
                       // still in range, maybe get a pulse
                       if(trigger.triggerTimeout <= 0) {
                           trigger.onTick(unit);
                       }
                   } else {
                       console.log('quitter!', unit.id);

                       trigger.guests = _.reject(trigger.guests, function(guest) { 
                           return guest.id === unit.id;
                       });

                       trigger.onExit(unit);
                   }

               }).fail(function(err) {
                   console.error('Game/Special/trigger.js', err); 
               });

        });

        Q.all(promises)
         .then(function() { 

             // dont reset tick trigger timer until whole loop done
             if(trigger.triggerTimeout <= 0) {
                 trigger.triggerTimeout = trigger.triggerInterval;
             }


             // check area for new guests
             return worldHandler.LoopUnitsNear(trigger.zone, trigger.cellX, trigger.cellZ, function(unit) {
                 if(unit.id !== trigger.id && unit.InRangeOfUnit(trigger, trigger.range)) {
                     trigger.addGuest(unit);
                 }
             });
         });

    },
    addGuest: function(unit) {
        var current = _.pluck(this.guests, 'id');
        //console.log('trigger add guest: ', unit.id);
        if(!_.contains(current, unit.id)) {
            this.guests.push(_.clone(unit));
            this.onEnter(unit);
        }
    },
    onEnter: function(unit) {
        //console.log(this.id, ' :: trigger onEnter :: ', unit.id, ' ', unit.name);
        var trigger = this;

        // make sure we have a script to execute
        if(!trigger.data || !trigger.data.script) {
            return;
        }

        // make sure that we've loaded the required script and it has the required method
        if(actorScripts.hasOwnProperty(trigger.data.script) && _.isFunction(actorScripts[trigger.data.script].onEnter)) {
            actorScripts[trigger.data.script].onEnter.call(trigger, unit);
        } else {
            //console.warn("Script (enter) not loaded for trigger! " + trigger.data.script);
        }
    },
    onExit: function(unit) {
        //console.log(this.id, ' :: trigger onExit :: ', unit.id, ' ', unit.name);
        var trigger = this;

        // make sure we have a script to execute
        if(!trigger.data || !trigger.data.script) {
            return;
        }

        // make sure that we've loaded the required script and it has the required method
        if(actorScripts.hasOwnProperty(trigger.data.script) && _.isFunction(actorScripts[trigger.data.script].onExit)) {
            actorScripts[trigger.data.script].onExit.call(trigger, unit);
        } else {
            //console.warn("Script (exit) not loaded for trigger! " + trigger.data.script);
        }
    },
    onTick: function(unit) {
        //console.log(this.id, ' :: trigger onTick :: ', unit.id, ' ', unit.name);
        var trigger = this;

        // make sure we have a script to execute
        if(!trigger.data || !trigger.data.script) {
            return;
        }

        // make sure that we've loaded the required script and it has the required method
        if(actorScripts.hasOwnProperty(trigger.data.script) && _.isFunction(actorScripts[trigger.data.script].onTick)) {
            actorScripts[trigger.data.script].onTick.call(trigger, unit);
        } else {
            //console.warn("Script (tick) not loaded for trigger! " + trigger.data.script);
        }
    }
});
