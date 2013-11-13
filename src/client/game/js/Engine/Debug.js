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




var Debugger = Class.extend({
    Init: function() {
        this.on = true;

        this.watches = [];

        this.arrowHelpers = [];

        setTimeout(function(){debug.Clear()}, 0);
    },
    setWatch: function(name, variable, show) {
        // if ( !showEditor) return;

        show = _.isUndefined(show) ? debugging : showEditor;

        if ( !show ) return;

        // if ( !le("globalEnable") ) return;

        variable = variable instanceof THREE.Vector3 ? variable.ToString() : variable;

            this.watches.push({ name: name, variable: variable });
    },
    tick: function(dTime) {
        // if ( !showEditor ) return;

            var text = '';
            for(var x=0;x<this.watches.length;x++){
                    text += this.watches[x].name+': '+this.watches[x].variable+'<br>';
            }

            $('#debugBox').html(text);

            this.watches = [];

    },
    Clear: function() {
        for(var h=0;h<this.arrowHelpers.length;h++) {
            ironbane.scene.remove(this.arrowHelpers[h]);
            releaseMesh(this.arrowHelpers[h]);
        }
        this.arrowHelpers = [];
    },
    DrawVector: function(vector, origin, color) {

        color = color || 0x0000FF;
        origin = origin || new THREE.Vector3(0,0,0);

        var aH = new THREE.ArrowHelper(vector, origin, vector.length(), color);
        this.arrowHelpers.push(aH);
        ironbane.scene.add(aH);
    }
});

var debug = new Debugger();
