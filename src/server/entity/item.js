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

var Class = require('../../common/class'),
    _ = require('underscore');

var ID = 0;

var Item = Class.extend({
    equipped: 0,
    slot: 0,
    attr1: 0,
    data: {},
    value: 0,
    init: function(template, config) {
        if(!template) {
            throw "must init using a template!";
        }

        // reference to the entire template object
        this.$template = template;
        // just the ID
        this.template = template.id;

        this.attr1 = template.attr1;
        this.value = template.basevalue || 0;

        // copy for faster searching
        this.type = template.type;
        this.subtype = template.subtype;

        // update any additional properties
        if(config) {
            _.extend(this, config);
        }

        // id is really only useful while the game is running, this id should *not* be persisted
        this.id = ID++;

        // set this so it gets sent down to the client (methods dont)
        this.rarity = this.getRarity();
    },
    // these getters setup so that the item instance could in the future have values
    // not on the template, but in the data JSON
    getType: function() {
        return this.$template.type;
    },
    getSubType: function() {
        return this.$template.subtype;
    },
    getImage: function() {
        return this.$template.image;
    },
    getBaseValue: function() {
        return this.$template.basevalue;
    },
    getRarity: function() {
        var item = this,
            rValue = 0;

        if(item.getType() === 'weapon') {
            rValue = ((item.$template.delay - 1) * -2) + item.$template.attr1 * 0.5;
            //console.log('WEAPON: ', item.$template.name, rValue);
            if(rValue <= 1) {
                return "weak";
            }
            if(rValue > 1 && rValue <= 2) {
                return "normal";
            }
            if(rValue > 2 && rValue <= 3) {
                return "strong";
            }
            if(rValue > 3 && rValue <= 5) {
                return "epic";
            }
            if(rValue > 5) {
                return "legendary";
            }
        }

        if(item.getType() === 'armor') {
            rValue = item.$template.attr1 * (item.getSubType() === 'body' ? 0.5 : 0.75);
            if(rValue <= 2) {
                return "weak";
            }
            if(rValue > 2 && rValue <= 3.5) {
                return "normal";
            }
            if(rValue > 3.5 && rValue <= 5) {
                return "strong";
            }
            if(rValue > 3.5 && rValue <= 6) {
                return "epic";
            }
            if(rValue > 6) {
                return "legendary";
            }
        }

        return 'normal';
    }
});

module.exports = Item;