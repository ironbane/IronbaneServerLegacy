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
    Init: function(position, id, metadata) {

        if ( !isProduction ) {
            this.drawNameMesh = true;
            this.overrideName = Math.abs(id);
        }

        this._super(position, null, id, 'Teleport Entrance', 1.0);

        this.metadata = metadata;

        this.dynamic = false;

    },
    Add: function() {
        this._super();

        if ( this.metadata && this.metadata.invisible ) return;

        (function(unit){
        setTimeout(function(){
            unit.particleEmittersToMaintain.push(particleHandler.Add(ParticleTypeEnum.TELEPORTENTRANCE, {followUnit:unit}));
            unit.particleEmittersToMaintain.push(particleHandler.Add(ParticleTypeEnum.TELEPORTENTRANCECIRCLES, {followUnit:unit}));
        }, 0);
        })(this);

    },
    tick: function(dTime) {

        this._super(dTime);

    }
});
