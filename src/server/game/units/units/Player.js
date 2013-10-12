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
var Fighter = require('./Fighter');
var Player = Fighter.extend({
  init: function(data) {

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

  addOtherUnit: function(unit) {
   

      var id = unit.id;


      var packet = {
        id: id,
        position: unit.position,
        rotY: unit.rotation.y,
        param: unit.param
      };


      if (unit instanceof Fighter) {

        packet.health = unit.health;
        packet.armor = unit.armor;
        packet.healthMax = unit.healthMax;
        packet.armorMax = unit.armorMax;

        packet.size = unit.size;

        packet.skin = unit.skin;
        packet.eyes = unit.eyes;
        packet.hair = unit.hair;
        packet.head = unit.head;
        packet.body = unit.body;
        packet.feet = unit.feet;

        if (unit.id > 0) {
          // Add additional data to the packet
          packet.name = unit.name;

          var item = unit.GetEquippedWeapon();
          if (item) {
            packet.weapon = item.template;
          }

        } else {
          if (unit.weapon && unit.displayweapon) {
            packet.weapon = unit.weapon.id;
          }
        }
      }

      if (unit.id < 0) {
        packet.template = unit.template.id;

        if (unit.template.type === UnitTypeEnum.TRAIN ||
          unit.template.type === UnitTypeEnum.MOVINGOBSTACLE ||
          unit.template.type === UnitTypeEnum.TOGGLEABLEOBSTACLE) {
          packet.rotX = unit.rotation.x;
          packet.rotZ = unit.rotation.z;
        }

        if (unit.template.type === UnitTypeEnum.LEVER || unit.template.type === UnitTypeEnum.TOGGLEABLEOBSTACLE) {
          unit.data.on = unit.on;
        }

        if (unit.template.special) {
          packet.metadata = unit.data;
        }



      }

      this._super(unit);
      this.socket.emit("addUnit", packet);

    
  },
  tick: function(dTime) {

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

        chatHandler.announceDiedSpecial(this, "lava");
    }

    this._super(dTime);

  },
  attack: function(victim, weapon) {

    // Players can only attack monsters and eachother (for now)
    if (victim.id < 0) {
      if (victim.template.type !== UnitTypeEnum.MONSTER) return;
    } else {

      // Only in PvP arenas?

    }

    this._super(victim, weapon);

  },
  delete: function() {


    // Remove the character from the DB
    // We don't need to delete the unit, since the player can't really do
    // anything anymore and will have to leave sooner or later
    mysql.query('DELETE FROM ib_characters WHERE id = ?', [this.id]);

    this.items = [];

    // Delete the items
    mysql.query('DELETE FROM ib_items WHERE owner = ?', [this.id]);

  },
  bigMessage: function(message) {
    this.socket.emit("bigMessage", {
      message: message
    });
  },
  cutscene: function(id) {
    this.socket.emit("cutscene", id);
  },
  lightWarn: function() {
    var message = this.name + ': Your behaviour is not tolerated. Stop it.';
    chatHandler.Announce('' + message + '', "yellow");
  },
  seriousWarn: function() {
    var message = this.name + ': Continue like this and you will get banned.<br>You have been warned.';
    chatHandler.Announce('' + message + '', "red");
  },
    kick: function(reason) {
        var me = this,
            message;

        // Immunity
        if (me.editor) {
            chatHandler.announce(me.name + ' has immunity.', "yellow");
            return;
        }

        reason = reason ? "Reason: " + reason : "No reason given";

        message = me.name + ' has been kicked. (' + reason + ')';
        chatHandler.announce(message, "yellow");

        setTimeout(function() {
            me.socket.disconnect();
        }, 1000);
    },
  ban: function(hours, reason) {
    // Immunity
    if (this.editor) {
      chatHandler.announce(this.name + ' has immunity.', "red");
      return;
    }

    var me = this;

    hours = hours || 1;

    var reason = reason ? "Reason: " + reason : "No reason given";

    var until = Math.round((new Date()).getTime() / 1000) +
      (parseInt(hours) * 3600);

    var how = hours ? "permanently banned" : "banned for " + hours + " hours";

    var message = this.name + ' has been ' + how + '. (' + reason + ')';
    chatHandler.announce(message, "red");

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
    save: function() {
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
  leaveGame: function() {

    this.save();

    chatHandler.announceLoginStatus(this, 'leave');

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
module.exports = Player;