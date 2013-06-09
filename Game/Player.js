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



var KickReason = {
  CHEAT: "Cheating"
};

var Player = Fighter.extend({
    Init: function(data) {

    // Params for players are still unused
    data.param = 0;

    this.readyToReceiveUnits = false;

    // Manual set type for addUnit calls
    this.type = UnitTypeEnum.PLAYER;

    this._super(data);


    this.unitsInLineOfSight = [];



  },
  Attack: function(victim, weapon) {

    // Players can only attack monsters and eachother (for now)
    if ( victim.id < 0 ) {
      if ( victim.template.type !== UnitTypeEnum.MONSTER ) return;
    }
    else {

      // Only in PvP arenas?

    }

    this._super(victim, weapon);

  },
  Delete: function() {


    // Remove the character from the DB
    // We don't need to delete the unit, since the player can't really do
    // anything anymore and will have to leave sooner or later


    mysql.query('DELETE FROM ib_characters WHERE id = ?', [this.id]);

    this.items = [];

    // Delete the items
    mysql.query('DELETE FROM ib_items WHERE owner = ?',[this.id]);


  },
  BigMessage: function(message) {
    this.socket.emit("bigMessage", {message:message});
  },
  Cutscene: function(id) {
    this.socket.emit("cutscene", id);
  },
  Kick: function() {

    this.socket.disconnect();

  },
  Save: function() {
    // No updating for guests
    // Update MYSQL and set the character data
    mysql.query('UPDATE ib_characters SET ' +
      'x = ?,' +
      'y = ?,' +
      'z = ?,' +
      'coins = ?,' +
      'zone = ?,' +
      'roty = ?' +
      ' WHERE id = ?', [
      this.position.x,
      this.position.y,
      this.position.z,
      this.coins,
      this.zone,
      this.rotation.y,
      this.id
      ]);
    //}


    var cx = this.cellX;
    var cz = this.cellZ;
    var zone = this.zone;
    var u = 0;

    // Save the items
    (function(unit){
      mysql.query('DELETE FROM ib_items WHERE owner = ?',[unit.id], function (err, results, fields) {

        for (var i=0;i<unit.items.length;i++) {
          var item = unit.items[i];

          // 20/9/12: Removed  server.GetAValidItemID() for id field as it causes duplication errors
          // Normally it doesn't matter which ID the items gets

          mysql.query('INSERT INTO ib_items (template, attr1, owner, equipped, slot) ' +
            'VALUES(?,?,?,?,?)', [
            item.template,
            item.attr1,
            unit.id,
            item.equipped,
            item.slot
            ]);
        //}
        }

      });
    })(this);

  },
  LeaveGame: function() {

    this.Save();


    chatHandler.LeaveGame(this);



    var cx = this.cellX;
    var cz = this.cellZ;
    var zone = this.zone;
    var u = 0;
    // Remove the unit from the world cells
    if ( worldHandler.CheckWorldStructure(zone, cx, cz) ) {
      var newList = [];
      _.each(worldHandler.world[zone][cx][cz].units, function(unit) {
        if ( unit.id != this.id ) newList.push(unit);
      }, this);
      worldHandler.world[zone][cx][cz].units = newList;
    }

    // Update all players that are nearby
    for(var x=cx-1;x<=cx+1;x++){
      for(var z=cz-1;z<=cz+1;z++){
        if ( worldHandler.CheckWorldStructure(zone, x, z) ) {
          for( u=0;u<worldHandler.world[zone][x][z].units.length;u++) {
            worldHandler.world[zone][x][z].units[u].UpdateOtherUnitsList();
          }
        }
      }
    }



  }
});
