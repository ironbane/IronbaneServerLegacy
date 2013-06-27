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

// instance of an item template
var Item = Class.extend({
    equipped: 0,
    slot: 0,
    attr1: 0,
    data: {},
    value: 0,
    Init: function(template, config) {
        if(!template) {
            throw "must init using a template!";
        }

        // todo: deglobalization
        this.id = server.GetAValidItemID();

        // reference to the entire template object
        this.$template = template;
        // just the ID
        this.template = template.id;

        this.attr1 = template.attr1;
        this.value = template.basevalue;

        // copy for faster searching
        this.type = template.type;
        this.subtype = template.subtype;

        // update any additional properties
        if(config) {
            _.extend(this, config);
        }
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
    }
});