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
var ParticleHandler = Class.extend({
    Init: function () {

        this.particleEmitters = [];


    },
    Add: function (type, data) {     
        var emitter = new ParticleEmitter(type, data);
        this.particleEmitters.push(emitter);
        return emitter;
    },
    RemoveAll: function() {
        for (var i = 0; i < this.particleEmitters.length; ++i) {
            this.particleEmitters[i].removeNextTick = true;
        }
    },
    tick: function (dTime) {	
        for (var i = 0; i < this.particleEmitters.length; ++i) {
			this.particleEmitters[i].tick(dTime);
		
            if (this.particleEmitters[i].removeNextTick) {
                this.particleEmitters[i].Destroy();
                this.particleEmitters.splice(i--, 1);
            }
        }
    }
});

var particleHandler = new ParticleHandler();
