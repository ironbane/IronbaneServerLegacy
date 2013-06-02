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

var World = Class.extend({
    world: {},
    init: function() {

    },
    buildWorldStructure: function(zone, cx, cz, checkterrain, tx, tz) {
        if (!_.isUndefined(zone) && _.isUndefined(this.world[zone])) {
            this.world[zone] = {};
        }
        if (!_.isUndefined(cx) && _.isUndefined(this.world[zone][cx])) {
            this.world[zone][cx] = {};
        }
        if (!_.isUndefined(cz) && _.isUndefined(this.world[zone][cx][cz])) {
            this.world[zone][cx][cz] = {};
        }
        if (!_.isUndefined(checkterrain) && _.isUndefined(this.world[zone][cx][cz].terrain)) {
            this.world[zone][cx][cz].terrain = {};
        }
        if (!_.isUndefined(tx) && _.isUndefined(this.world[zone][cx][cz].terrain[tx])) {
            this.world[zone][cx][cz].terrain[tx] = {};
        }
        if (!_.isUndefined(tz) && _.isUndefined(this.world[zone][cx][cz].terrain[tx][tz])) {
            this.world[zone][cx][cz].terrain[tx][tz] = {};
        }
    }
});

module.exports = World;