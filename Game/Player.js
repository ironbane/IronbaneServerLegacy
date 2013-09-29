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


    // Prevent spammers
    this.lastChatTime = 0;

  },
  Tick: function(dTime) {

    // console.log("this.zone: "+this.zone);
    // console.log("this.position: "+this.position.ToString());
    // console.log("this.respawnTimer: "+this.respawnTimer);
    // console.log("this.health: "+this.health);

    if ( !this.chGodMode &&
      this.health > 0 &&
      this.zone === 4 &&
      this.position.y <= 0.1 ) {

        this.SetHealth(0);

        // Remove their items
        this.items = [];

        this.EmitNearby("getMeleeHit", {
          victim:this.id,
          attacker:0,
          h:0,
          a:0
        }, 0, true);

        this.respawnTimer = 10.0;

        chatHandler.DiedSpecial(this, "lava");
    }

    this._super(dTime);

  },
  Attack: function(victim, weapon) {

    // Players can only attack monsters and eachother (for now)
    if (victim.id < 0) {
      if (victim.template.type !== UnitTypeEnum.MONSTER) return;
    } else {

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
    mysql.query('DELETE FROM ib_items WHERE owner = ?', [this.id]);

  },
  BigMessage: function(message) {
    this.socket.emit("bigMessage", {
      message: message
    });
  },
  Cutscene: function(id) {
    this.socket.emit("cutscene", id);
  },
  LightWarn: function() {
    var message = this.name + ': Your behaviour is not tolerated. Stop it.';
    chatHandler.Announce('' + message + '', "yellow");
  },
  SeriousWarn: function() {
    var message = this.name + ': Continue like this and you will get banned.<br>You have been warned.';
    chatHandler.Announce('' + message + '', "red");
  },
  Kick: function(reason) {
    // Immunity
    if (this.editor) {
      chatHandler.Announce(this.name + ' has immunity.', "yellow");
      return;
    }

    var reason = reason ? "Reason: " + reason : "No reason given";

    var me = this;

    var message = this.name + ' has been kicked. (' + reason + ')';
    chatHandler.Announce(message, "yellow");

    setTimeout(function() {
      me.socket.disconnect();
    }, 1000);

  },
  Ban: function(hours, reason) {
    // Immunity
    if (this.editor) {
      chatHandler.Announce(this.name + ' has immunity.', "red");
      return;
    }

    var me = this;

    hours = hours || 1;

    var reason = reason ? "Reason: " + reason : "No reason given";

    var until = Math.round((new Date()).getTime() / 1000) +
      (parseInt(hours) * 3600);

    var how = hours ? "permanently banned" : "banned for " + hours + " hours";

    var message = this.name + ' has been ' + how + '. (' + reason + ')';
    chatHandler.Announce(message, "red");

    mysql.query('INSERT INTO ib_bans SET ?', {
      ip: me.socket.ip,
      account: this.playerID,
      until: until
    }, function() {
      socketHandler.UpdateBans();
    });

    if (!this.isGuest) {
      mysql.query('UPDATE bcs_users SET banned = 1 WHERE id = ?', [this.playerID]);
    }

    setTimeout(function() {
      me.socket.disconnect();
    }, 1000);
  },
    Save: function() {
        // No updating for guests
        // Update MYSQL and set the character data
        mysql.query('UPDATE ib_characters SET ' +
            'lastplayed = ?,' +
            'x = ?,' +
            'y = ?,' +
            'z = ?,' +
            'zone = ?,' +
            'roty = ?' +
            ' WHERE id = ?', [
            Math.round(new Date().getTime() / 1000),
            this.position.x,
            this.position.y,
            this.position.z,
            this.zone,
            this.rotation.y,
            this.id
        ]);

        // Save the items
        (function(unit) {
            mysql.query('DELETE FROM ib_items WHERE owner = ?', [unit.id], function(err, results, fields) {
                for (var i = 0; i < unit.items.length; i++) {
                    var item = unit.items[i];

                    // 20/9/12: Removed  server.GetAValidItemID() for id field as it causes duplication errors
                    // Normally it doesn't matter which ID the items gets
                    mysql.query('INSERT INTO ib_items (template, attr1, owner, equipped, slot, value, data) ' +
                        'VALUES(?,?,?,?,?,?,?)', [
                        item.template,
                        item.attr1,
                        unit.id,
                        item.equipped,
                        item.slot,
                        item.value || 0,
                        JSON.stringify(item.data)
                    ]);
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
    if (worldHandler.CheckWorldStructure(zone, cx, cz)) {
      var newList = [];
      _.each(worldHandler.world[zone][cx][cz].units, function(unit) {
        if (unit.id != this.id) newList.push(unit);
      }, this);
      worldHandler.world[zone][cx][cz].units = newList;
    }

    // Update all players that are nearby
    for (var x = cx - 1; x <= cx + 1; x++) {
      for (var z = cz - 1; z <= cz + 1; z++) {
        if (worldHandler.CheckWorldStructure(zone, x, z)) {
          for (u = 0; u < worldHandler.world[zone][x][z].units.length; u++) {
            worldHandler.world[zone][x][z].units[u].UpdateOtherUnitsList();
          }
        }
      }
    }


  }
});