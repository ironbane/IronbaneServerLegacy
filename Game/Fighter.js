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

var battleStatusTimeout = 10.0;

var Fighter = Actor.extend({
    attackTimeout: 1,
    Init: function(data) {
        this._super(data);

        this.sendRotationPacketY = true;

        // default for players is 10, mobs are variable, default 30

        if (this.isPlayer()) {
            this._respawnTime = this.respawnTimer = 10;
        } else {

            this._respawnTime = this.respawnTimer = (this.respawntime || 30);
        }

        // NPC's don't really have an items array, but nevertheless...
        if (this.items === undefined) {
            this.items = [];
        }

        // Health and armor are the same values for their maximum, only for bots
        // Initially, their values come from MySQL and are afterwards updated within the server without updating MySQL
        // The template values are used for Maximum values, and should never be changed

        if (!(this.isPlayer())) {
            this.healthMax = this.template.health;
            this.armorMax = this.template.armor;
        } else {
            this.CalculateMaxHealth();
            this.CalculateMaxArmor();
        }

        this.health = this.healthMax;
        this.armor = this.armorMax;

        this.chGodMode = false;
        this.chInvisibleByMonsters = false;
        this.ch999Damage = false;

        this.UpdateAppearance(false);

        this.healthRegenTimeout = 0.0;
        this.healthRegenInterval = 1.0;

        this.armorRegenTimeout = 0.0;
        this.armorRegenInterval = 1.0;

        this.lastBattleActionTimer = 0.0;

        if (this.GetEquippedWeapon()) {
            this.attackTimeout = this.GetEquippedWeapon().$template.delay;
        }
    },
    IsInBattle: function() {
        return this.lastBattleActionTimer > 0;
    },
    ShootProjectile: function(targetPosition, swingWeapon, weaponID, aimError) {

        aimError = !_.isUndefined(aimError) ? aimError : 0;

        var offset = new THREE.Vector3();

        swingWeapon = !_.isUndefined(swingWeapon) ? swingWeapon : true;
        weaponID = weaponID || this.weapon.id;

        this.EmitNearby("addProjectile", {
            s: this.position.clone().Round(2),
            t: targetPosition.clone().add(offset).Round(2),
            o: this.id,
            w: weaponID,
            sw: swingWeapon
        });
    },
    AttemptAttack: function(victim) {
        // log("attempt attack");
        this.handleMessage("attemptAttack", {});
        //if ( this.weapon.subtype == "bow" || this.weapon.subtype == "staff" ) {
        //if ( this.weapon.subtype == "bow" || this.weapon.subtype == "staff"  ) {
        // debugger;
        if (this.template.usebashattack) {
            this.Attack(victim, this.weapon);
            // this.SwingWeapon(victim.position);
        } else {
            //this.Attack(this.enemy, this.weapon);
            this.ShootProjectile(victim.position, true, 0, this.template.aimerror);
        }
    },
    Attack: function(victim, weapon) {
        //console.log("attack weapon tmpl: ", weapon.$template);
        this.lastBattleActionTimer = battleStatusTimeout;

        var damage = this.ch999Damage ? 999 : weapon.attr1,
            hurt = !!(damage > 0);

        if (!victim.chGodMode) {
            if (victim.isPlayer() && hurt === false) {
                victim.health += Math.abs(damage);
                victim.health = Math.min(victim.healthMax, victim.health);

                this.handleMessage("healTarget", {
                    damage: damage
                });
                victim.handleMessage("healed", {
                    attacker: this,
                    damage: damage
                });
            } else {
                //console.log("attack vic tmpl: ", victim.template);
                // 22/12/12 No more PvP... :(
                if (this.isPlayer() && victim.isPlayer()) {
                    return;
                } else {
                    if (hurt === true) { // Only do damage if weapon doesnt heal
                        if (!victim.isPlayer()) {
                            var immune;
                            try {
                                immune = JSON.parse(victim.template.immune); // Parse wich weapons victim is immune too
                            }
                            catch(e) {
                                // failed to parse JSON, but OK
                                immune = {};
                            }
                            if (immune[weapon.$template.subtype] === true) { // Test for immunity
                                return;
                            }
                        }
                        damage = Math.abs(damage);
                        var remaining = damage - victim.armor;
                        victim.armor -= damage;

                        if (remaining > 0) {
                            victim.health -= remaining;
                        }

                        victim.health = Math.max(victim.health, 0);
                        victim.armor = Math.max(victim.armor, 0);

                        this.handleMessage("hurtTarget", {
                            damage: damage
                        });
                        victim.handleMessage("attacked", {
                            attacker: this,
                            damage: damage
                        });
                    }
                }
            }
        }

        victim.EmitNearby("getMeleeHit", {
            victim: victim.id,
            attacker: this.id,
            h: victim.health,
            a: victim.armor
        }, 0, victim.id > 0); // Only send to ourselves when we are a player (id > 0)

        // Only update the timer if we were attacked, not healed
        if (damage > 0) {
            victim.lastBattleActionTimer = battleStatusTimeout;
        }

        // move to apply damage type method?
        if (victim.health <= 0) {
            victim.health = 0;
            victim.Die(this);
        }
    },
    Tick: function(dTime) {
        if (this.attackTimeout > 0) {
            this.attackTimeout -= dTime;
        }

        if (this.lastBattleActionTimer > 0) {
            this.lastBattleActionTimer -= dTime;
        }

        if (this.health <= 0) {
            if (this.respawnTimer > 0.0) {
                this.respawnTimer -= dTime;
            } else {
                this.Respawn();
            }
        } else {
            if (this.healthRegenTimeout > 0) {
                this.healthRegenTimeout -= dTime;
            }

            // only monsters can regen health
            if (this.lastBattleActionTimer <= 0 && this.id < 0) {
                if (this.healthRegenTimeout <= 0) {
                    this.healthRegenTimeout = this.healthRegenInterval;
                    this.SetHealth(this.health + 1);
                }
            }

            // Three seconds without being hit will recharge our armor
            if (this.armorRegenTimeout > 0) {
                this.armorRegenTimeout -= dTime;
            }
            if (this.lastBattleActionTimer <= battleStatusTimeout - 3) {
                if (this.armorRegenTimeout <= 0) {
                    this.armorRegenTimeout = this.armorRegenInterval;
                    this.SetArmor(this.armor + 1);
                }
            }

            // No additional ticking needed for players (physics are done on the client)
            if (this.isPlayer()) {
                return;
            }

            this._super(dTime);
        }
    },
    SetHealth: function(newHealth, noParticles) {
        var oldHealth = this.health;
        noParticles = noParticles || false;

        this.health = newHealth;
        this.health = Math.min(this.healthMax, this.health);

        if (oldHealth !== this.health) {
            var data = {
                id: this.id,
                s: "h",
                h: this.health
            };

            if (noParticles) {
                data.np = true;
            }

            this.EmitNearby("setStat", data, 0, true);
        }
    },
    SetArmor: function(newArmor) {
        var oldArmor = this.armor;

        this.armor = newArmor;

        this.armor = Math.min(this.armorMax, this.armor);


        if (oldArmor !== this.armor) {
            this.EmitNearby("setStat", {
                id: this.id,
                s: "a",
                a: this.armor
            }, 0, true);
        }
    },
    Die: function(killer) {
        var self = this;

        // the dead don't move!
        self.velocity.set(0, 0, 0);

        if (!(self.isPlayer())) {
            //debugger;
            self.handleMessage("killed", {
                killer: killer
            });

            if (self.loot.length > 0) {
                var angle = getRandomFloat(0, 1) * Math.PI * 2;

                //log("spawning lootbag...");
                var bag = new Lootable({
                    id: server.GetAValidNPCID(),
                    x: self.position.x + Math.cos(angle),
                    y: self.position.y,
                    z: self.position.z + Math.sin(angle),
                    zone: self.zone,

                    // Hacky: refers to lootBag ID
                    template: dataHandler.units[lootBagTemplate],

                    roty: 0
                }, false);

                bag.load();

                for (var i = 0; i < self.loot.length; i++) {
                    var item = self.loot[i];

                    item.owner = bag.id;
                    // Add the item to the lootbag

                    // Make a copy of the item, so we don't remove the same item (reference)
                    // when we actually loot it as a player
                    // BS: ^^^ is this actually happening?
                    bag.loot.push(item);
                }
            }
        } else {
            // clear all items except those special ones
            self.items = _.filter(self.items, function(item) {
                return item.data && item.data.permanent === true;
            });

            chatHandler.announceDied(self, killer);
        }
    },
    Respawn: function() {

        var self = this;

        // reset the respawn timer now
        self.respawnTimer = self._respawnTime;

        console.log('respawning: ', self.id, ' ', self.name, ' :: ', self._respawnTime, ' >> ', self.respawntime);

        self.SetHealth(self.healthMax, true);
        self.SetArmor(self.armorMax, true);

        // respawn @ nearest player_spawn_point (or old method if map doesn't have it)
        self.findNearestSpawnPoint().then(function(spawnpoint) {

            if (spawnpoint) {
                return self.TeleportToUnit(spawnpoint);
            } else {
                // deprecated method, fall back to warning server that zone has no spawn point? and/or 0,0,0 ??
                if (self.zone === tutorialSpawnZone) {
                    return self.Teleport(tutorialSpawnZone, tutorialSpawnPosition, true);
                } else {
                    console.log('Teleporting to default', normalSpawnZone, normalSpawnPosition);
                    return self.Teleport(normalSpawnZone, normalSpawnPosition, true);
                }
            }

        }).then(function() {

            if(self.isPlayer()) {

                // need a better "reset"
                self.UpdateAppearance(true);
                self.socket.emit('updateInventory', {
                    items: self.items
                });

            } else {

                if (self instanceof NPC) {
                    self.SetWeaponsAndLoot();
                }
                self.position = self.startPosition.clone();
                self.targetNodePosition = self.position.clone();
                self.handleMessage("respawned", {});
            }


        }).then(function() {

            // log("Respawned "+self.id);

            // Send the client that it's okay to revert back
            self.EmitNearby("respawn", {
                id: self.id,
            p: self.position.clone().Round(2),
            z: self.zone,
            h: self.health
            }, 0, true);

            if (!(self.isPlayer())) {
                self.velocity.set(0, 0, 0);
            }


        });

    },
    // Returns true when the max health changed
    CalculateMaxHealth: function(doEmit) {
        var oldHealthMax = this.healthMax;

        doEmit = doEmit || false;

        //        var healthMax = 20;

        //        for(var i in socketHandler.playerData.items) {
        //            var item = socketHandler.playerData.items[i];
        //
        //            var template = items[item.template];
        //
        //            if ( item.equipped ) {
        //
        //                if ( template.type == "armor" ) {
        //
        //                    healthMax += item.attr1;
        //
        //                }
        //            }
        //        }

        this.healthMax = 20;

        if (doEmit && this.healthMax !== oldHealthMax) {
            this.EmitNearby("setStat", {
                id: this.id,
                s: "hm",
                hm: this.healthMax
            }, 0, true);
        }

        if (this.health > this.healthMax) {
            this.SetHealth(this.healthMax);
        }
    },
    // Returns true when the max armor changed
    CalculateMaxArmor: function(doEmit) {
        doEmit = doEmit || false;

        var oldArmorMax = this.armorMax;
        var armorMax = 0;

        _.each(this.items, function(item) {
            if (item.equipped && item.getType() === 'armor') {
                armorMax += item.attr1;
            }
        });

        this.armorMax = armorMax;

        if (doEmit && this.armorMax !== oldArmorMax) {
            this.EmitNearby("setStat", {
                id: this.id,
                s: "am",
                am: this.armorMax
            }, 0, true);
        }

        if (this.armor > this.armorMax) {
            this.SetArmor(this.armorMax);
        }
    },
    GiveItem: function(template, config) {
        // todo: variable max inv?
        if (this.items.length >= 10) {
            // no free slots
            return false;
        }

        var taken = _.pluck(this.items, 'slot');
        // take first available slot
        var slot = _.difference(_.range(10), taken)[0];

        // config passed in goes to instance
        config = config || {};

        config.owner = this.id;
        config.slot = slot;

        // create new item based off the template
        var item = new Item(template, config);
        this.items.push(item);

        this.socket.emit("receiveItem", item);

        return true;
    },
    addCoins: function(amount) {
        // attempt to auto stack coins
        if (amount <= 0) {
            return false;
        }

        var bags = _.where(this.items, {
            type: 'cash'
        });
        if (bags.length > 0) {
            // for now just add to the first bag,
            // todo: bag limits?
            bags[0].value += amount;
        } else {
            // need to add one if the slot is available
            var template = _.where(dataHandler.items, {
                type: 'cash'
            })[0];
            if (!template) {
                log('server has no cash items!!!');
                return false;
            }

            if (!this.GiveItem(template, {
                value: amount
            })) {
                // no room in inventory for coins!
                return false;
            }
        }

        return true;
    },
    UpdateAppearance: function(sendChanges) {
        var self = this,
            special;

        if (self.id > 0) {
            self.head = 0;
            self.body = 0;
            self.feet = 0;

            for (var i = 0; i < self.items.length; i++) {
                var item = self.items[i];

                if (item.equipped) {
                    // override for magical items like ghost cloak or snowman tophat
                    // if there is more than one item that provides self, you'll end up with the last one
                    if(item.data && item.data.specialSkin) {
                        special = {skin: item.data.specialSkin, eyes: 0, hair: 0, head: 0, body: 0, feet: 0};
                    }
                    if (item.getType() === "armor") {
                        switch (item.getSubType()) {
                            case "head":
                                self.head = item.getImage();
                                break;
                            case "body":
                                self.body = item.getImage();
                                break;
                            case "feet":
                                self.feet = item.getImage();
                                break;
                        }
                    }
                }
            }

            if (sendChanges) {
                // TODO: change this to updateAppearance all the way down?
                self.EmitNearby("updateClothes", {
                    id: self.id,
                    skin: self.skin,
                    eyes: self.eyes,
                    hair: self.hair,
                    head: self.head,
                    body: self.body,
                    feet: self.feet,
                    special: special
                }, 0, true);
            }
        }
    },
    GetEquippedWeapon: function() {
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];

            if (item.equipped && (item.getType() === "weapon" || item.getType() === "tool")) {
                return item;
            }
        }

        return null;
    },
    // swap one item in inventory for another
    // item: name or id
    // replacement: name or id
    // replacementConfig: additional data to pass to replacement (customize)
    replaceItem: function(item, replacement, replacementConfig) {
        var self = this;

        var original = self.getItem(item);
        if (!original) {
            // we don't have the item to swap out
            return false;
        } else {
            var template = _.find(dataHandler.items, function(itemT) {
                return itemT.name === replacement || itemT.id === replacement;
            });
            if (!template) {
                // can't find template to replace item with!
                return false;
            }
            var config = {
                slot: original.slot,
                owner: self.id
            };
            if (_.isObject(replacementConfig)) {
                _.extend(config, replacementConfig);
            }
            var replaced = new Item(template, config);
            self.items.push(replaced);
            self.items = _.without(self.items, original);

            if (original.equipped) {
                // todo: get this logic cleaner somehow
                if (original.getType() === 'armor') {
                    self.UpdateAppearance(true);
                    self.CalculateMaxHealth(true);
                    self.CalculateMaxArmor(true);
                } else {
                    self.EmitNearby("updateWeapon", {
                        id: self.id,
                        // should weapon really be template id?
                        weapon: item.equipped ? item.template : 0
                    });
                }
            }

            // let the client know
            self.socket.emit('updateInventory', {
                items: self.items
            });

            return true;
        }
    },
    // get the FIRST item in inventory by TEMPLATE!
    getItem: function(query) {
        var found;

        if (_.isString(query)) {
            // check by name
            found = _.find(this.items, function(item) {
                return item.$template.name === query;
            });
        } else {
            // assume ID
            found = _.find(this.items, function(item) {
                return item.template === query;
            });
        }

        return found;
    },
    // find a specific instance
    getItemById: function(id) {
        return _.find(this.items, function(item) {
            return item.id === id;
        });
    },
    // add an actual item object reference to their inv
    addItem: function(item, slot) {
        // check slot (todo: support "any available?")
        if (slot < 0 || slot > 9 || _.find(this.items, function(i) {
            return i.slot === slot;
        })) {
            return false;
        }

        item.slot = slot;
        item.equipped = 0;
        item.owner = this.id;

        this.items.push(item);
        this.socket.emit("receiveItem", item);

        return true;
    },
    removeItem: function(item, emit) {
        if(emit !== false) {
            emit = true;
        }

        var self = this;
        self.items = _.without(self.items, item);

        // update client!
        if (item.equipped) {
            // todo: get this logic cleaner somehow
            if (item.getType() === 'armor') {
                self.UpdateAppearance(emit);
                self.CalculateMaxHealth(emit);
                self.CalculateMaxArmor(emit);
            } else {
                if(emit) {
                    self.EmitNearby("updateWeapon", {
                        id: self.id,
                        // should weapon really be template id?
                        weapon: 0
                    });
                }
            }
        }

        // let the client know
        if(emit) {
            self.socket.emit('updateInventory', {
                items: self.items
            });
        }
    },
    // remove a specific item
    removeItemById: function(id, emit) {
        var self = this;
        var item = _.find(self.items, function(i) {
            return i.id === id;
        });

        if (!item) {
            // item not found to remove!
            return false;
        }

        self.removeItem(item, emit);

        return true;
    },
    hasItemEquipped: function(query) {
        var found;

        if (_.isString(query)) {
            // check by name
            found = _.find(this.items, function(item) {
                return item.$template.name === query;
            });
        } else {
            // assume ID
            found = _.find(this.items, function(item) {
                return item.template === query;
            });
        }

        return found && found.equipped;
    },
    getTotalCoins: function() {
        // sum value of cash items in inventory
        return _.reduce(_.pluck(_.where(this.items, {
            type: 'cash'
        }), 'value'), function(memo, num) {
            return memo + num;
        }, 0);
    },
    purchase: function(item) {
        // if player has multiple money bags need to remove them until finished
        var bags = _.where(this.items, {
            type: 'cash'
        }),
            bagIndex = 0,
            available = this.getTotalCoins(),
            remaining = item.price;

        if (!remaining || remaining <= 0) {
            return false; // invalid price! (fallback to value or basevalue?)
        }

        if (available < remaining) {
            return false; // can't afford
        }

        while (remaining > 0) {
            if (bags[bagIndex].value - remaining < 0) {
                remaining -= bags[bagIndex].value;
                this.items = _.without(this.items, bags[bagIndex]);
            } else {
                bags[bagIndex].value -= remaining;
                remaining = 0;
            }

            bagIndex++;
        }

        // purchase successful
        return true;
    },
    InLineOfSight: function(unit, noHeadingCheck) {
        // Experimental: test if its better if the monsters always see the player
        return true;

        var unitToUs = unit.position.clone().sub(this.position);

        noHeadingCheck = noHeadingCheck || false;

        if (!noHeadingCheck && this.heading.dot(unitToUs.normalize()) <= 0) {
            // log("not in the FOV!");
            return false;
        }

        // log("in LOS! LOS:");
        // console.log(unit.unitsInLineOfSight);
        return true;
    },
    FindNearestTarget: function(maxDistance, onlyPlayers, noHeadingCheck) {

        maxDistance = maxDistance || 0;
        onlyPlayers = onlyPlayers || false;
        noHeadingCheck = noHeadingCheck || false;

        var self = this;

        return this.FindNearestUnit(maxDistance).then(function(unit) {

                if (unit &&
                    unit instanceof Fighter &&
                    !(unit === self) &&
                    !(unit.health <= 0) &&
                    !(unit.chInvisibleByMonsters) &&
                    !(onlyPlayers && !(unit.isPlayer())) &&
                    !(!onlyPlayers && !(unit.isPlayer()) && unit.template.friendly === self.template.friendly) &&
                    self.InLineOfSight(unit, noHeadingCheck) &&
                    !(maxDistance > 0 && !self.InRangeOfUnit(unit, maxDistance))) {

                        // console.log('Fighter.js', 'Found nearest target');

                        return unit; // resolve target

                }
        });
    },
    getNameAndRank: function() {
        //guests and users have a positive id, npcs do not
        var name = (this.id > 0) ? this.name : this.template.prefix + ' ' + this.template.name;

        var rank = 'npc';
        if (this.id > 0) {
            rank = this.isGuest ? 'guest' : (this.editor ? 'gm' : 'user');
            if (this.chDevNinja === true) {
                rank = 'user';
            }
        }

        var rv= {};
        if (this.id > 0) {
            rv.id = this.id
        }
        rv.name = name;
        rv.rank = rank;
        return rv;
    }
});
