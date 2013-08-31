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


var Switch = Class.extend({
	Init: function(id, output1, output2, output3, output4) {

            this.id = id;

            this.outputs = [];

            if ( !_.isUndefined(output1) ) this.outputs.push(output1);
            if ( !_.isUndefined(output2) ) this.outputs.push(output2);
            if ( !_.isUndefined(output3) ) this.outputs.push(output3);
            if ( !_.isUndefined(output4) ) this.outputs.push(output4);

	},
    Trigger: function() {




    }
});
