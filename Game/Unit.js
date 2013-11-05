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


var Unit = Class.extend({
  Init: function(data) {
    _.extend(this, data);

    this.active = true; // when things die or otherwise shut off this will disable AI and other processes

    // Physics...
    //

    this.mass = 0.1;

    // Server-side velocity, is not sent to the client
    this.velocity = new THREE.Vector3();

    // a normalized vector pointing in the direction the entity is heading.
    this.heading = new THREE.Vector3();

    //a vector perpendicular to the heading vector
    this.side = new THREE.Vector3();

    //the maximum speed at which this entity may travel.
    this.maxSpeed = 5.0;


    // A list of other units that this unit can see, updated by the server
    // Used by the server to inform each clients which units are nearby, and which need full/light updates
    this.otherUnits = [];

    // The fields of this unit that will be sent on the next snapshot
    // We should only send fields that have changed since last snapshot, or when we initially send all data
    this.updatedFields = {};


    // Make additional properties

    this.position = new THREE.Vector3(this.x, this.y, this.z);
    this.localPosition = new THREE.Vector3();

    this.rotx = this.rotx === undefined ? 0 : this.rotx;
    this.roty = this.roty === undefined ? 0 : this.roty;
    this.rotz = this.rotz === undefined ? 0 : this.rotz;

    this.rotation = new THREE.Vector3(this.rotx, this.roty, this.rotz);

    // Convert zone to int
    this.zone = parseInt(this.zone, 10);


    // Update the heading based on the rotation
    var radians = (this.rotation.y + (Math.PI / 2));

    this.heading.x = Math.sin(radians);
    this.heading.y = 0;
    this.heading.z = Math.cos(radians);
    this.heading.normalize();



    this.sendRotationPacketX = false;
    this.sendRotationPacketY = false;
    this.sendRotationPacketZ = false;

    this.UpdateCellPosition();

    this.closestNode = null;



    this.standingOnUnitId = 0;

    if (worldHandler.CheckWorldStructure(this.zone, this.cellX, this.cellZ)) {
      worldHandler.world[this.zone][this.cellX][this.cellZ].units.push(this);
    } else {
      // We are in a bad cell??? Find a place to spawn! Or DC
      log("Bad cell found for " + this.id);

      if (this.id > 0 && this.editor) {
        log("...but I'm generating one because he's an editor.");
        worldHandler.GenerateCell(this.zone, this.cellX, this.cellZ);
        worldHandler.world[this.zone][this.cellX][this.cellZ].units.push(this);
      }
    }

    this.startPosition = this.position.clone();
    this.startRotation = this.rotation.clone();


    (function(unit) {
      setTimeout(function() {
        unit.UpdateNearbyUnitsOtherUnitsLists();
      }, 0);
    })(this);



  },
  Awake: function() {
    //log(this.id+" is awake!");
  },
  TeleportToUnit: function(unit, noEmit) {
    this.Teleport(unit.zone, unit.position, noEmit);
  },
  Teleport: function(zone, position, noEmit) {


    noEmit = noEmit || false;

    // Prevent all stuff from spawning under the ground, etc
    this.readyToReceiveUnits = false;

    if (worldHandler.CheckWorldStructure(this.zone, this.cellX, this.cellZ)) {
      worldHandler.world[this.zone][this.cellX][this.cellZ].units = _.without(worldHandler.world[this.zone][this.cellX][this.cellZ].units, this);
    }

    this.UpdateNearbyUnitsOtherUnitsLists();

    this.zone = zone;
    // copy instead of clone so that this can be a plain obj
    this.position.copy(position);
    this.UpdateCellPosition();

    if (worldHandler.CheckWorldStructure(this.zone, this.cellX, this.cellZ)) {
      worldHandler.world[this.zone][this.cellX][this.cellZ].units.push(this);
    } else {
      log("[Teleport] Cell does not exist for unit #" +
        this.id + " (" + this.cellX + ", " + this.cellZ + ")");
      if (this.id > 0 && this.editor) {
        log("[Teleport] Generating cell because he's an editor.");
        worldHandler.GenerateCell(this.zone, this.cellX, this.cellZ);
        worldHandler.world[this.zone][this.cellX][this.cellZ].units.push(this);
      }
    }

    this.UpdateNearbyUnitsOtherUnitsLists();


    if (this instanceof Player && !noEmit) {
      this.socket.emit('teleport', {
        zone: zone,
        pos: position
      });
    }
  },
  UpdateNearbyUnitsOtherUnitsLists: function() {
    worldHandler.UpdateNearbyUnitsOtherUnitsLists(this.zone, this.cellX, this.cellZ);
  },
  UpdateCellPosition: function() {

    var cellPos = WorldToCellCoordinates(this.position.x, this.position.z, cellSize);

    // Maintain a cell position
    this.cellX = cellPos.x;
    this.cellZ = cellPos.z;

  },
  AddOtherUnit: function(unit) {
    // Auto send AddUnit if we're a player
    this.otherUnits.push(unit);

    // Add the unit to ourselves clientside (only if WE are a player)
    if ((this instanceof Player)) {

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


      this.socket.emit("addUnit", packet);

    }


  },
  RemoveOtherUnit: function(unit) {
    // Auto send AddUnit if we're a player

    this.otherUnits = _.without(this.otherUnits, unit);


    // Add the unit to ourselves clientside (only if WE are a player)
    if ((this instanceof Player)) {
      this.socket.emit("removeUnit", {
        id: unit.id
      });
    }


  },
  UpdateOtherUnitsList: function() {

    // If we are a player, only do so if we're ready to receive data
    if (this.id > 0 && !this.readyToReceiveUnits) return;

    // We have two lists
    // There is a list of units we currently have, and a list that we will have once we recalculate
    // If an item is in the first list, but no longer in the second list, do RemoveOtherUnit
    // If an item is in the first & second list, don't do anything
    // If an item is only in the last list, do AddOtherUnit
    var firstList = this.otherUnits;
    var secondList = [];

    // Loop over the world cells nearby and add all units
    var cx = this.cellX;
    var cz = this.cellZ;



    for (var x = cx - 1; x <= cx + 1; x++) {
      for (var z = cz - 1; z <= cz + 1; z++) {
        if (worldHandler.CheckWorldStructure(this.zone, x, z)) {
          _.each(worldHandler.world[this.zone][x][z].units, function(unit) {
            if (unit !== this) secondList.push(unit);
          }, this);
        }
      }
    }

    for (var i = 0; i < firstList.length; i++) {
      if (secondList.indexOf(firstList[i]) == -1) {
        // Not found in the second list, so remove it
        this.RemoveOtherUnit(firstList[i]);
      }
    }
    for (var i = 0; i < secondList.length; i++) {
      if (firstList.indexOf(secondList[i]) == -1) {
        // Not found in the first list, so add it
        this.AddOtherUnit(secondList[i]);
      }
    }

  },
  FindNearestUnit: function(maxDistance) {
    maxDistance = maxDistance || 0;
    var cx = this.cellX;
    var cz = this.cellZ;
    var nearestUnit = null
    for (var x = cx - 1; x <= cx + 1; x++) {
      for (var z = cz - 1; z <= cz + 1; z++) {
        if (worldHandler.CheckWorldStructure(this.zone, x, z)) {
          nearestUnit = _.find(worldHandler.world[this.zone][x][z].units, function(unit) {

            if (unit !== this) {
              if (unit instanceof Fighter && unit.health > 0) {
                if (maxDistance > 0 && DistanceBetweenPoints(this.position.x, this.position.z, unit.position.x, unit.position.z) <= maxDistance) {
                  return unit;
                }
              }
            }
          }, this);
        }
      }
    }
    return nearestUnit;
  },
    findNearestSpawnPoint: function() {
        var unit = this,
            spawn = null,
            spawns = worldHandler.findUnitsByName('player_spawn_point');

        if(spawns.length === 0) {
            return spawn;
        }

        if(spawns.length === 1) {
            spawn = spawns[0];
        }

        var distance = Number.MAX_VALUE;
        _.each(spawns, function(point) {
            var d = DistanceBetweenPoints(unit.position.x, unit.position.z, point.position.x, point.position.z);
            if(d < distance) {
                spawn = point;
                distance = d;
            }
        });

        return spawn;
    },
  ChangeCell: function(newCellX, newCellZ) {



    // Make sure we generate adjacent cells if they don't exist
    var cx = this.cellX;
    var cz = this.cellZ;
    var zone = this.zone;


    var cellPos = {
      x: newCellX,
      z: newCellZ
    };
    if (cellPos.x != this.cellX || cellPos.z != this.cellZ) {


      // First, remove us from our world cell and add ourselves to the right cell
      // Remove the unit from the world cells
      if (worldHandler.CheckWorldStructure(zone, cx, cz)) {
        var units = worldHandler.world[zone][cx][cz].units;
        var removeUnit = _.find(units, function(unit) {
          return unit.id == this.id;
        }, this);
        worldHandler.world[zone][cx][cz].units = _.without(units, removeUnit);
      }


      // Add to the new cell
      // What if the cell doesn't exist? Don't add?
      if (worldHandler.CheckWorldStructure(zone, cellPos.x, cellPos.z)) {
        worldHandler.world[zone][cellPos.x][cellPos.z].units.push(this);
      } else {
        log("[ChangeCell] Cell does not exist for unit #" +
          this.id + " (" + cellPos.x + ", " + cellPos.z + ")");
        if (this.id > 0 && this.editor) {
          log("[ChangeCell] Generating cell because he's an editor.");
          worldHandler.GenerateCell(zone, cellPos.x, cellPos.z);
          worldHandler.world[zone][cellPos.x][cellPos.z].units.push(this);
        }
      }

      var cellsToRecalculate = [];
      // Build two lists, and recalculate all units inside that are not in both lists at the same time
      var firstList = [];
      var secondList = [];


      for (var x = cx - 1; x <= cx + 1; x++) {
        for (var z = cz - 1; z <= cz + 1; z++) {
          firstList.push({
            x: x,
            z: z
          });

        }
      }

      cx = cellPos.x;
      cz = cellPos.z;

      for (var x = cx - 1; x <= cx + 1; x++) {
        for (var z = cz - 1; z <= cz + 1; z++) {
          secondList.push({
            x: x,
            z: z
          });

        }
      }

      _.each(firstList, function(firstListItem) {
        if (secondList.indexOf(firstListItem) == -1) {
          // Not found in the secondlist, so recalculate all units inside
          if (worldHandler.CheckWorldStructure(zone, firstListItem.x, firstListItem.z)) {
            _.each(worldHandler.world[zone][firstListItem.x][firstListItem.z].units, function(sunit) {
              sunit.UpdateOtherUnitsList();
            });
          }
        }
      });


      _.each(secondList, function(secondListItem) {
        if (firstList.indexOf(secondListItem) == -1) {
          // Not found in the firstlist, so recalculate all units inside
          if (worldHandler.CheckWorldStructure(zone, secondListItem.x, secondListItem.z)) {
            _.each(worldHandler.world[zone][secondListItem.x][secondListItem.z].units, function(funit) {
              funit.UpdateOtherUnitsList();
            });
          }
        }
      });
      this.cellX = cellPos.x;
      this.cellZ = cellPos.z;


      // Of course, update for ourselves too!
      this.UpdateOtherUnitsList();
    }

  },
  Tick: function(dTime) {


  },
  InRangeOfUnit: function(unit, range) {
    return this.InRangeOfPosition(unit.position, range);
  },
  InRangeOfPosition: function(position, range) {
    return position.clone().sub(this.position).lengthSq() < range * range;
  },
  Remove: function() {

    var zone = this.zone;
    var cx = this.cellX;
    var cz = this.cellZ;


    worldHandler.world[zone][cx][cz].units = _.without(worldHandler.world[zone][cx][cz].units, this);

    for (var x = cx - 1; x <= cx + 1; x++) {
      for (var z = cz - 1; z <= cz + 1; z++) {
        if (worldHandler.CheckWorldStructure(zone, x, z)) {
          _.each(worldHandler.world[zone][x][z].units, function(unit) {
            unit.UpdateOtherUnitsList();
          });
        }
      }
    }

  },
  EmitNearby: function(event, data, maxDistance, allowSelf) {

    allowSelf = allowSelf || false;
    maxDistance = maxDistance || 0;

    var zone = this.zone;

    var cx = this.cellX;
    var cz = this.cellZ;

    for (var x = cx - 1; x <= cx + 1; x++) {
      for (var z = cz - 1; z <= cz + 1; z++) {
        if (!worldHandler.CheckWorldStructure(zone, x, z)) continue;

        if (!_.isUndefined(worldHandler.world[zone][x][z].units)) {

          var units = worldHandler.world[zone][x][z].units;

          for (var u = 0; u < units.length; u++) {
            if (!(units[u] instanceof Player)) continue;

            // Don't send to ourselves...?
            if (!allowSelf && units[u] == this) {
              continue;
            }

            var distance = DistanceBetweenPoints(this.position.x, this.position.z, units[u].position.x, units[u].position.z);
            // Check if the unit is too far from us
            if (maxDistance > 0 && distance > maxDistance) continue;

            units[u].socket.emit(event, data);

          }
        }
      }
    }


  },
  CalculatePath: function(targetPosition) {


    var allNodes = this.connectedNodeList;

    var closestNode = null;
    var distance = Math.pow(50, 2);

    _.each(allNodes, function(node) {
      var measuredDistance = DistanceSq(node.pos, this.position);
      if (measuredDistance < distance) {
        closestNode = node;
        distance = measuredDistance;
      }
    }, this);

    // Store the closest node
    this.closestNode = closestNode;



    var farthestNode = null;
    distance = Math.pow(50, 2);
    //for(var x=0;x<allNodes.length;x++){

    _.each(allNodes, function(node) {
      var measuredDistance = DistanceSq(node.pos, targetPosition);
      if (measuredDistance < distance) {
        farthestNode = node;
        distance = measuredDistance;
      }
    }, this);

    // If we can't find any node, just go straight to the target
    if (!closestNode || !farthestNode) {
      //this.targetNodePosition = targetPosition.clone();
      return;
    }

    var paths = astar.search(allNodes, closestNode, farthestNode);


    // If the path is empty, go straight for the target
    if (paths.length === 0) {
      //this.targetNodePosition = targetPosition.clone();
      // log("[CalculatePath] No path found, going straight for the target! new targetNodePosition: "+this.targetNodePosition.ToString());
    } else {
      // Go for the first node in the list
      this.targetNodePosition = ConvertVector3(paths[0].pos);
      // log("[CalculatePath] Path found, going for the first in the list! new targetNodePosition: "+this.targetNodePosition.ToString());
      // log("[CalculatePath] First node ID: "+paths[0].id);
    }

  },
  Say: function(text) {
    this.EmitNearby("say", {
      id: this.id,
      message: text
    }, 0, true);
  },
  DebugLocationString: function() {
    return "zone " + this.zone + ", pos " + this.position.Round().ToString();
  }
});