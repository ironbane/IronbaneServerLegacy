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
var State = require('../state');

var SellMerchandise = State.extend({
    enter: function(unit) {
        this.restockTimer = 300.0;
    },
    execute: function(unit, dTime) {
        this.restockTimer -= dTime;

        if ( this.restockTimer <= 0 ) {
            this.restockTimer = 300.0;
            // Restock a random item
            unit.SetWeaponsAndLoot();

            // unit.Say(ChooseRandom([
            //  "I've got new stuff!",
            //  "Restocked merchandise!",
            //  "New and better deals!"
            // ]));
        }
    }
});

module.exports = SellMerchandise;