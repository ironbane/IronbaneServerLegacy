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





var HeartPiece = Billboard.extend({
    Init: function(position, id) {	        
                
        
        var texture = "misc/heartpiece";

        if ( showEditor && levelEditor.editorGUI.opShowDebug ) {
            this.drawNameMesh = true;
            this.overrideName = Math.abs(id);
        }        

        this._super(position, 0, id, texture, true);
        
                this.renderOffsetMultiplier = 1.0;      
                
    },
    Add: function() {
        this._super();

        (function(unit){
        setTimeout(function(){
            //unit.particleEmittersToMaintain.push(particleHandler.Add(ParticleTypeEnum.TELEPORTENTRANCE, {followUnit:unit}));
            unit.particleEmittersToMaintain.push(particleHandler.Add(ParticleTypeEnum.TELEPORTEXIT, {followUnit:unit}));
        }, 0);
        })(this);
        
    },
    Tick: function(dTime) {
      
        this.renderOffset = new THREE.Vector3(0, 0.5 + (Math.cos((new Date()).getTime()/1000.0)*0.25), 0);        

          
        this._super(dTime);
                
    }
});
