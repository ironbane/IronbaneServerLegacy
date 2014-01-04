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


var Q = require('q');

var Unit = Class.extend({

  Init: function(data) {

        _.extend(this, data);

        // When things die or otherwise shut off this will disable AI and other processes
        this.active = this.id > 0 ? true : false;

        // Whether the unit has a custom script attached
        this.isScripted = false;

        // Physics...
        //

        this.mass = 0.5;

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

        this.startPosition = this.position.clone();
        this.startRotation = this.rotation.clone();

        this.navigationMeshGroup = null;

        this.isChanging = false;

        this.load(); 

      },
      load: function() {

         var self = this; 

         if(_.isUndefined(self.loadDeferred)) {

             self.loadDeferred = Q.defer();

             return self.UpdateNearbyUnitsOtherUnitsLists().then(function() {

                return worldHandler.addUnitToCell(self, self.cellX, self.cellZ);

             }).fin(function() {

                self.loadDeferred.resolve(); 

             });

         }

         return self.loadDeferred.promise;

      },
      isPlayer: function() {
        return this instanceof Player;
      },
      isA: function(type) {
          var self = this;
          return eval('self instanceof ' + type);
      },
      Awake: function() {
        // log(this.id+" is awake!");
        // For fast searching, we need to precompute what group of nodes
        // from the navigation mesh we are going to search in
        this.navigationMeshGroup = pathFinder.getGroup(this.zone, this.position);
      },
      TeleportToUnit: function(unit, noEmit) {
        return this.Teleport(unit.zone, unit.position, noEmit);
      },
      Teleport: function(zone, position, noEmit) {

        var self = this;

        noEmit = noEmit || false;

        // Prevent all stuff from spawning under the ground, etc
        this.readyToReceiveUnits = false;

        return worldHandler.requireCell(self.zone, self.cellX, self.cellZ)
            .then(function() { 
               return worldHandler.removeUnitFromCell(self, self.cellX, self.cellZ);
            })
            .then(function() {
               return self.UpdateNearbyUnitsOtherUnitsLists();
            })
            .then(function() {

                self.socket.leave('zone_'+self.zone);
                self.zone = zone;
                // copy instead of clone so that self can be a plain obj
                self.position.copy(position);
                self.UpdateCellPosition();

                return worldHandler.requireCell(self.zone, self.cellX, self.cellZ); 

            })
            .then(function() {
               return worldHandler.addUnitToCell(self, self.cellX, self.cellZ);
            })
            .then(function() { 
               return self.UpdateNearbyUnitsOtherUnitsLists();
            })
            .then(function() {

                if (self.isPlayer() && !noEmit) {
                    self.socket.emit('teleport', {
                        zone: zone,
                        pos: position
                    });
                    self.socket.join('zone_'+zone);
                }

            });
      },
      UpdateNearbyUnitsOtherUnitsLists: function() {
        return worldHandler.UpdateNearbyUnitsOtherUnitsLists(this.zone, this.cellX, this.cellZ);
      },
      UpdateCellPosition: function() {

        var cellPos = WorldToCellCoordinates(this.position.x, this.position.z, cellSize);

        // Maintain a cell position
        this.cellX = cellPos.x;
        this.cellZ = cellPos.z;

      },
      AddOtherUnit: function(unit) {
        var specialAppearance;

        // Auto send AddUnit if we're a player
        this.otherUnits.push(unit);

        // Add the unit to ourselves clientside (only if WE are a player)
        if (this.isPlayer()) {

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

            // special appearance items check (TODO: consolidate into method somewhere?)
            _.each(unit.items, function(item) {
                if(item.equipped) {
                    if(item.data && item.data.specialSkin) {
                        specialAppearance = {skin: item.data.specialSkin, eyes: 0, hair: 0, head: 0, body: 0, feet: 0};
                    }
                }
            });

            if(specialAppearance) {
                packet.skin = specialAppearance.skin;
                packet.eyes = specialAppearance.eyes;
                packet.hair = specialAppearance.hair;
                packet.head = specialAppearance.head;
                packet.body = specialAppearance.body;
                packet.feet = specialAppearance.feet;
            } else {
                packet.skin = unit.skin;
                packet.eyes = unit.eyes;
                packet.hair = unit.hair;
                packet.head = unit.head;
                packet.body = unit.body;
                packet.feet = unit.feet;
            }

            if (unit.isPlayer()) {
              // Add additional data to the packet
              packet.name = unit.name;

              var item = unit.GetEquippedWeapon();
              if (item) {
                packet.weapon = item.template;
              }

            }
            else {
              if (unit.weapon && unit.displayweapon) {
                packet.weapon = unit.weapon.id;
              }
            }
          }

          if (!(unit.isPlayer())) {
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

        this.otherUnits = _.reject(this.otherUnits, function(other) { 
            return other.id === unit.id;
        });

        // Add the unit to ourselves clientside (only if WE are a player)
        if (this.isPlayer()) {
          this.socket.emit("removeUnit", {
            id: unit.id
          });
        }
      },
      UpdateOtherUnitsList: function() {

        var self = this;

        // If we are a player, only do so if we're ready to receive data
        if (self.isPlayer() && !self.readyToReceiveUnits) return;

        // We have two lists
        // There is a list of units we currently have, and a list that we will have once we recalculate
        // If an item is in the first list, but no longer in the second list, do RemoveOtherUnit
        // If an item is in the first & second list, don't do anything
        // If an item is only in the last list, do AddOtherUnit
        var firstList = self.otherUnits;
        var secondList = [];

        // Loop over the world cells nearby and add all units
        var cx = self.cellX;
        var cz = self.cellZ;

        return worldHandler.LoopUnitsNear(self.zone, self.cellX, self.cellZ, function(unit) {

            if(unit !== self) {
                secondList.push(unit);
            }

        }).then(function() { 

            for (var i = 0; i < firstList.length; i++) {
                if (secondList.indexOf(firstList[i]) == -1) {
                    // Not found in the second list, so remove it
                    self.RemoveOtherUnit(firstList[i]);
                }
            }

            for (var i = 0; i < secondList.length; i++) {
                if (firstList.indexOf(secondList[i]) == -1) {
                    // Not found in the first list, so add it
                    self.AddOtherUnit(secondList[i]);
                }
            }

        }); 

      },
      FindNearestUnit: function(maxDistance) {

        var deferred = Q.defer();

        maxDistance = maxDistance || 0;

        var self = this;

        var cx = self.cellX;
        var cz = self.cellZ;
        var nearestUnit = null;

        worldHandler.LoopUnitsNear(self.zone, cx, cz, function(unit) {

            if (unit !== self) {
                if (unit instanceof Fighter && unit.health > 0) {

                    var pos = self.position;

                    if (maxDistance > 0 &&
                        DistanceBetweenPoints(pos.x, pos.z, unit.position.x, unit.position.z) <= maxDistance) {
                        nearestUnit = unit;
                    }
                }
            }

        }).fin(function() { 
           deferred.resolve(nearestUnit);
        });

        return deferred.promise;

      },
      findNearestSpawnPoint: function() {

        var unit = this;

        return worldHandler.findUnitsByName('player_spawn_point', unit.zone).then(function(spawns) {

                var spawn = null; 

                if (spawns.length === 0) {
                    return null;
                }

                if (spawns.length === 1) {
                    spawn = spawns[0];
                }

                var distance = Number.MAX_VALUE;
                _.each(spawns, function(point) {
                    var d = DistanceBetweenPoints(unit.position.x, unit.position.z, point.position.x, point.position.z);
                    if (d < distance) {
                        spawn = point;
                        distance = d;
                    }
                });

                return spawn;

            });
      },
      ChangeCell: function(newCellX, newCellZ) {

        var self = this;



        // Make sure we generate adjacent cells if they don't exist
        var cx = this.cellX;
        var cz = this.cellZ;
        var zone = this.zone;


        var cellPos = {
          x: newCellX,
          z: newCellZ
        };

        if (cellPos.x != this.cellX || cellPos.z != this.cellZ) {

            self.isChanging = self.isChanging || false;

            if(self.isChanging) { 

                return Q(); 

            } 

            self.isChanging = true;


            return worldHandler.requireCell(zone, cx, cz).then(function() { 
                return worldHandler.removeUnitFromCell(self, cx, cz);
            }).then(function() { 
                return worldHandler.addUnitToCell(self, newCellX, newCellZ);
            }).then(function() {

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

                var promises = [];

                return Q.all(_.map(firstList, function(firstListItem) {

                    if (secondList.indexOf(firstListItem) == -1) {
                        // Not found in the secondlist, so recalculate all units inside
                        return worldHandler.requireCell(zone, firstListItem.x, firstListItem.z).then(function() { 

                            return worldHandler.LoopUnitsNear(zone, firstListItem.x, firstListItem.z, function(sunit) { 
                                promises.push(sunit.UpdateOtherUnitsList());
                            }, 0);

                        });
                    }

                })).then(function() {


                    return Q.all(_.map(secondList, function(secondListItem) {

                        if (firstList.indexOf(secondListItem) == -1) {
                            // Not found in the firstlist, so recalculate all units inside
                            return worldHandler.requireCell(zone, secondListItem.x, secondListItem.z).then(function() { 

                                return worldHandler.LoopUnitsNear(zone, secondListItem.x, secondListItem.z, function(funit) { 
                                    promises.push(funit.UpdateOtherUnitsList());
                                }, 0);

                            });
                        }

                    }));

                }).then(function() {

                    return Q.all(promises);

                }).then(function() {

                    self.cellX = cellPos.x;
                    self.cellZ = cellPos.z;

                    return self.UpdateOtherUnitsList();

                }).then(function() {

                    self.isChanging = false;

                });


            });

        } 

      return Q();

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

    var self = this;

    var zone = this.zone;
    var cx = this.cellX;
    var cz = this.cellZ;

    worldHandler.removeUnitFromCell(self, cx, cz).then(function() { 
        return self.UpdateNearbyUnitsOtherUnitsLists();
    });

  },
  EmitNearby: function(event, data, maxDistance, allowSelf) {

    allowSelf = allowSelf || false;
    maxDistance = maxDistance || 0;

    var self = this;

    var zone = this.zone;

    var cx = this.cellX;
    var cz = this.cellZ;

    return worldHandler.LoopUnitsNear(zone, cx, cz, function(unit) {

        if (unit.isPlayer()) {

            // Don't send to ourselves...?
            if (!allowSelf && unit == self) {
                return;
            }

            var distance = DistanceBetweenPoints(self.position.x, self.position.z, unit.position.x, unit.position.z);
            // Check if the unit is too far from us
            if (maxDistance > 0 && distance > maxDistance) return;

            unit.socket.emit(event, data);
        }

    }, 1);

  },
  CalculatePath: function(targetPosition) {

    if (this.navigationMeshGroup !== null) {
      var paths = pathFinder.findPath(this.position,
        targetPosition,
        this.zone,
        this.navigationMeshGroup);

      if ( paths ) {
        while (paths[0] && paths[0].distanceToSquared(this.targetNodePosition) < 0.5) {
          paths.shift();
        }
      }

      if (paths && paths[0]) {
        // console.log("[CalculatePath] Path found! Going to", paths[0]);
        this.targetNodePosition.copy(paths[0]);
      }
      else {
        // No match found! Let our state machine know that we can't reach the target
        // console.log("[CalculatePath] targetUnreachable!");
        this.handleMessage("targetUnreachable");
        this.targetNodePosition.copy(this.position);
      }
    }
    else {
      // With no navigation data, stay here!
      // console.log("[CalculatePath] no navigation data! Group: "+this.navigationMeshGroup);
      this.targetNodePosition.copy(this.position);
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
