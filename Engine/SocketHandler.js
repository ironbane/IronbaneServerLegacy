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

var characterIDCount = 1;

var SocketHandler = Class.extend({
    bans: [],
    onlinePlayers: [],
    Init: function() {
        var me = this;

        this.UpdateBans();

        // temp until service implemented
        function loadCharItems(chardata, callback) {
            chardata.items = [];
            itemService.getAllByOwner(chardata.id).then(function(items) {
                chardata.items = items;
                callback();
            }, function(err) {
                log('error getting items for character: ' + chardata.id + ' >> ' + err);
                callback();
            });
        }

        // another temporary method to reduce code duplication: todo: refactor
        function createPlayer(req, chardata) {
            var socket = req.io.socket; // todo: move this, not supposed to use it directly in express.io

            var unit = new Player(chardata);

            unit.load(); // Asynchronous operation: add player to cell and update nearby units

            // Link the unit with the player ID
            unit.playerID = req.user ? req.user.id : 0; // either authenticated user or guest, don't trust the client data
            unit.isGuest = !!!req.user;
            unit.editor = !!(req.user && req.user.editor === 1);

            // Provide a circular reference
            socket.unit = unit;
            socket.unit.socket = socket;

            // join several rooms / channels by default
            if(unit.isGuest) {
                socket.join('guests');
            }
            if(unit.editor) {
                // todo: split these based on roles?
                socket.join('editors');
                socket.join('mods');
                socket.join('admins');
            }
            // to replace announceNick, tho should just send same to admins instead?
            if(unit.playerID === 1) {
                socket.join('__nick__');
            }
            // join a channel in your own name for private messaging
            // user will take priority over other rooms created prior to their login
            var userRoom = _.find(chatHandler.listRooms(), function(room) {
                return room.toLowerCase() === unit.name.toLowerCase();
            });
            if(userRoom) {
                _.each(io.sockets.clients(userRoom), function(client) {
                    if(client.unit) {
                        chatHandler.announcePersonally(client.unit, "Booted from another user's PM room: " + userRoom);
                    }
                    client.leave(userRoom);
                });
            }
            socket.join(unit.name);

            // join a zone based channel (todo: join/leave on changing zones)
            socket.join('zone_' + unit.zone);
            // cell and/or "nearby" type channels? (to localize chat bubbles)

            // Update us, and all players that are nearby
            var cx = unit.cellX;
            var cz = unit.cellZ;
            // When we make this unit, it should automatically create a otherUnits list
            // When this list is created, each unit that is added must be sent to it's socket if it's a player
            // and also removed when out of range
            // In addition, we need the units that are near this unit, to add this unit to their otherUnits list
            // They will in turn tell their socket to add the unit

            chatHandler.announceLoginStatus(unit, 'join');

            req.io.respond({
                id: unit.id,
                name: unit.name,
                zone: unit.zone,
                position: unit.position,
                rotY: unit.rotation.y,
                editor: unit.editor,
                size: unit.size,
                health: unit.health,
                armor: unit.armor,
                healthMax: unit.healthMax,
                armorMax: unit.armorMax,
                hair: unit.hair,
                eyes: unit.eyes,
                skin: unit.skin,
                items: unit.items
            });

            // just before we're added to the list of online players,
            // announce the others already online
            req.io.emit('chatMessage', {
                type: 'welcome',
                user: unit.getNameAndRank(),
                online: socketHandler.onlinePlayers
            });

            // add us to the online player list
            socketHandler.onlinePlayers.push(
                unit.getNameAndRank()
            );
        }

        // and another temp method...
        function loadCharacterData(id, callback) {
            mysql.query('select * from ib_characters where id=?', [id], function(err, result) {
                if(err) {
                    callback('db error loading char! ' + err);
                    return;
                }

                if(result.length === 0) {
                    callback("Character not found.");
                    return;
                }

                callback(null, result[0]);
            });
        }

        // moving this to express.io (needs refactor) for enhanced security
        io.route('connectServer', function(req) {
            var respond = req.io.respond;

            // first thing check for IP bans
            _.each(me.bans, function(ban) {
                if (ban.ip === req.io.socket.handshake.address.address) {
                    var time = Math.round((new Date()).getTime() / 1000);
                    if (ban.until > time || !ban.until) {
                        respond({errmsg: 'You have been banned.'});
                        return;
                    }
                }
            });

            if(req.data.guest && req.session.passport.user) {
                respond({errmsg: 'Cannot sign in as guest while authenticated, please log out first.'});
                return;
            }

            var character = null;

            if(req.data.guest) {
                // todo: refactor to Character entity/service
                // grab the intended character
                loadCharacterData(req.data.characterID, function(err, data) {
                    if(err) {
                        log('db error loading char! ' + err);
                        respond({errmsg: 'an unexpected error occured, please contact an admin on the forums.'});
                        return;
                    }

                    character = data;

                    if(character.user !== 0) {
                        respond({errmsg: "Character is not allowed for guest use."});
                        return;
                    }

                    // Check if the character is already being used in the server (since they bypassed the member check)
                    worldHandler.FindUnit(character.id).then(function(gu) {
                           respond({
                               errmsg: "There is already a guest playing under your credentials!"
                           });
                       }).fin(function() {

                           loadCharItems(character, function() {
                               // we should be all good now!
                               createPlayer(req, character);
                           });

                       });


                });
            } else {
                if(req.session.passport.user && req.session.passport.user === req.data.id) {
                    // for now use the global ref to passport
                    ioApp.passport.deserializeUser(req.session.passport.user, function(err, user) {
                        if(err) {
                            console.log('error deserializing user in socket', err);
                            respond({errmsg: 'an unexpected error occured, please contact an admin on the forums.'});
                            return;
                        }

                        // pass this along similar to http (todo: middleware)
                        req.user = user;

                        if(user.banned) { // todo IP ban test here or earlier?
                            respond({errmsg: 'You have been banned.'});
                            return;
                        }

                        // go time!
                        loadCharacterData(req.data.characterID, function(err, data) {
                            if(err) {
                                log('db error loading char! ' + err);
                                respond({errmsg: 'an unexpected error occured, please contact an admin on the forums.'});
                                return;
                            }

                            character = data;

                            if(character.user !== user.id) {
                                respond({errmsg: "Character does not belong to you."});
                                return;
                            }

                            // Check if the character is already being used in the server
                            worldHandler.FindUnit(character.id)
                                .then(function(gu) {

                                    // duplicate, remove them from online list and force disconnect
                                    socketHandler.onlinePlayers = _.without(
                                        socketHandler.onlinePlayers,
                                        _.find(socketHandler.onlinePlayers, function(p) {
                                            return p.id === gu.id;
                                        })
                                    );

                                    gu.LeaveGame();
                                    respond({
                                        errmsg: "This character is already logged in!"
                                    });
                                    return;
                                })
                                .fin(function() {

                                    loadCharItems(character, function() {
                                        // we should be all good now!
                                        createPlayer(req, character);
                                    });

                                });

                        });
                    });
                } else {
                    console.log('failed session', req.session, req.data);
                    respond({errmsg: 'Please login first.'});
                }
            }
        });

        io.sockets.on("connection", function (socket) {
            socket.ip = socket.handshake.address.address;

            socket.unit = null;

            socket.on("backToMainMenu", function(data, reply) {
                if (!_.isFunction(reply)) {
                    log('backToMainMenu no callback defined!');
                    return;
                }
                if (socket.unit) {
                    if (socket.unit.health <= 0) {
                        reply({
                            errmsg: "Please wait until you respawn!"
                        });
                        return;
                    }
                    socketHandler.onlinePlayers = _.without(socketHandler.onlinePlayers, _.find(socketHandler.onlinePlayers, function(p) {
                        return p.id === socket.unit.id;
                    }));
                    socket.unit.LeaveGame();
                    reply("OK");

                    log(socket.unit.name + " is back at the Main Menu.");
                }

                socket.unit = null;
            });

            // chatMessage is the user input processor
            socket.on("chatMessage", function(data) {
                if (!socket.unit) {
                    return;
                }

                if (!_.isString(data.message)) {
                    chatHandler.announceRoom('__nick__', "Warning: Hacked client in " +
                        "[chatMessage]<br>User " + socket.unit.name + "", "red");
                    return;
                }

                // should trunc + add ellipses?
                data.message = data.message.substr(0, 100);

                // No empty messages
                if (!data.message || data.message.length <= 0) {
                    return;
                }

                if (!socket.unit.editor && socket.unit.lastChatTime > (new Date()).getTime() - 2000) {
                    chatHandler.announcePersonally(socket.unit, "Please don't spam the server.", "yellow");
                    return;
                }
                socket.unit.lastChatTime = (new Date()).getTime();

                log(socket.unit.name + ': ' + data.message);
                chatHandler.processInput(socket.unit, data.message);
            });

            socket.on("doJump", function (data) {
                if (!socket.unit) {
                    return;
                }

                socket.unit.EmitNearby("doJump", {
                    id:socket.unit.id
                });
            });

            socket.on("readyToReceiveUnits", function (bool) {

                if ( !socket.unit ) return;

                if ( !_.isBoolean(bool) ) return;

                if ( socket.unit ) {
                    socket.unit.readyToReceiveUnits = bool;
                    socket.unit.UpdateOtherUnitsList();

                    if ( bool ) {
                        // Check for new players
                        var currentTime = parseInt((new Date()).getTime()/1000.0, 10);

                        if ( socket.unit.zone === 1
                            && currentTime < socket.unit.creationtime + 1000
                            && !socket.unit.hasSeenStartCutscene ) {
                            socket.unit.hasSeenStartCutscene = true;

                            //socket.unit.Cutscene("FindIronbane");
                        }
                    }

                }

            });

            socket.on("addProjectile", function (data, reply) {

                if (!socket.unit) {
                    return;
                }

                if (!_.isFunction(reply)) {
                    log('addProjectile no callback defined!');
                    return;
                }

                // check server's attack timeout not client
                var weapon = socket.unit.GetEquippedWeapon();
                if (!weapon) {
                    reply({
                        errmsg: 'No Equipped Weapon!'
                    });
                    return;
                }
                if (socket.unit.attackTimeout > 0.2) {
                    //console.log('attackTimeout not in sync', socket.unit.attackTimeout);
                    // send the real delay, even non cheating players will be slightly out of sync
                    // every now and then because of the server vs. client loops
                    reply({
                        delay: socket.unit.attackTimeout
                    });
                    return;
                } else { // update the attack timer using server's value
                    if (weapon) {
                        socket.unit.attackTimeout = weapon.$template.delay;
                    } else {
                        socket.unit.attackTimeout = 1;
                    }
                }


                if (!CheckData(data, ["t", "w"])) {
                    reply({
                        errmsg: "Corrupt projectile data"
                    });
                    return;
                }

                if (!CheckVector(data.t)) {
                    reply({
                        errmsg: "Corrupt target vector for addProjectile"
                    });
                    return;
                }

                data.t = ConvertVector3(data.t);
                data.t = data.t.Round(2);

                // Convert the weapon ID to a template ID
                var item = _.find(socket.unit.items, function(i) {
                    return i.id === data.w;
                });

                if (_.isUndefined(item)) {
                    reply({
                        errmsg: "No item found for addProjectile!"
                    });
                    return;
                }

                if (socket.unit) {
                    socket.unit.EmitNearby("addProjectile", {
                        s: socket.unit.position.clone().Round(2),
                        t: data.t,
                        w: item.template,
                        o: socket.unit.id,
                        sw: true
                    });
                }

                // need to let the local client know it's OK
                reply('OK');

            });

            socket.on("useItem", function (barIndex, reply) {
                if (!_.isFunction(reply)) {
                    log('useItem no callback defined!');
                    return;
                }

                if (!socket.unit) {
                    reply({
                        errmsg: 'no unit!'
                    });
                    return;
                }

                var player = socket.unit;

                var item = _.find(player.items, function(i) {
                    return i.slot === barIndex;
                });

                if (_.isUndefined(item)) {
                    reply({
                        errmsg: "No item found!"
                    });
                    return;
                }

                //console.log('useItem', player.items, item);

                switch (item.getType()) {
                    case 'consumable':
                        // Remove the item
                        player.items = _.without(player.items, item);

                        // What kind of consumable?
                        switch (item.getSubType()) {
                            case 'restorative':
                                // Increase our health
                                player.SetHealth(player.health + item.attr1);

                                // Spawn particles
                                player.EmitNearby("addParticle", {
                                    p: item.$template.particle,
                                    fu: player.id
                                }, 0, true);

                                break;
                        }

                        // It's possible that item increases the maximum health
                        player.CalculateMaxHealth(true);

                        // Client should automatically remove the item

                        break;
                    case 'armor':
                        // Unequip all armor for this subtype
                        _.each(player.items, function(i) {
                            if (i.getType() === 'armor' && i.getSubType() === item.getSubType() && i !== item) {
                                i.equipped = 0;
                            }
                        });

                        // Set to equipped
                        item.equipped = +!item.equipped;

                        // Send a request to equipment
                        // Other players will update the view
                        player.UpdateAppearance(true);

                        // It's possible that armor increases the maximum health
                        player.CalculateMaxHealth(true);

                        // And obviously, the armor itself
                        player.CalculateMaxArmor(true);

                        break;
                    case 'weapon':
                    case 'tool':
                        // Unequip all weapons we already have equipped
                        //  (since we can have only one active)
                        _.each(player.items, function(i) {
                            if ((i.getType() === 'weapon' || i.getType() === 'tool') && i !== item) {
                                i.equipped = 0;
                            }
                        });

                        // Set to equipped
                        item.equipped = +!item.equipped;

                        player.EmitNearby("updateWeapon", {
                            id: player.id,
                            // should weapon really be template id?
                            weapon: item.equipped ? item.template : 0
                        });

                        break;
                }
            });

            // BANKING
            socket.on('bankStoreItem', function(data, reply) {
                console.log('bankStoreItem', data);

                var player = socket.unit;
                if(!player) {
                    reply({errmsg: 'bad socket unit.'});
                    return;
                }

                worldHandler.FindUnit(data.id)
                    .then(function(bank) {

                        // in this case data.slot refers to target bank slot
                        var result = bank.storeItem(data.item, player, data.slot);
                        if(_.isString(result)) {
                            reply({errmsg: result});
                        } else {
                            // if it's not a string, it'll be the modified item data (see bank)
                            reply(result);
                        }

                    })
                    .fail(function(err) {
                        reply({errmsg: 'bank not found!'});
                    });
            });

            socket.on('bankTakeItem', function(data, reply) {
                console.log('bankTakeItem', data);

                var player = socket.unit;
                if(!player) {
                    reply({errmsg: 'bad socket unit.'});
                    return;
                }

                worldHandler.FindUnit(data.id)
                   .then(function(bank) {

                       // in this case data.slot refers to target player slot
                       var result = bank.takeItem(data.item, player, data.slot);
                       if(_.isString(result)) {
                           reply({errmsg: result});
                       } else {
                           // if it's not a string, it'll be the modified item data (see bank)
                           reply(result);
                       }

                   })
                   .fail(function(err) {
                       reply({errmsg: 'bank not found!'});
                   });
            });

            // BANKING

            // this is inv to inv slot swap only
            socket.on('updateItemSlot', function(data, reply) {
                if (!_.isFunction(reply)) {
                    log('updateItemSlot no callback defined!');
                    return;
                }

                var player = socket.unit;

                if(!player) {
                    reply({errmsg: 'Invalid player for socket!'});
                    return;
                }

                var item = _.find(player.items, function(i) {
                    return i.id === data.id;
                });

                if(!item) {
                    reply({errmsg: 'Item to swap not found!'});
                    return;
                }

                // check if there is an item already in destination slot
                var occupied = _.find(player.items, function(i) {
                    return i.slot === data.slot;
                });

                if(occupied) {
                    // swap the slots
                    occupied.slot = item.slot;
                }
                item.slot = data.slot;

                reply('success');
            });

            // player is dropping stackable item on a stackable item
            socket.on('stackItemSlot', function(data, reply) {
                if (!_.isFunction(reply)) {
                    log('updateItemSlot no callback defined!');
                    return;
                }

                var player = socket.unit;

                if(!player) {
                    reply({errmsg: 'Invalid player for socket!'});
                    return;
                }

                var item,
                    itemId = data.id,
                    targetSlot = data.slot,
                    bagId = data.bag; // optional bag for if we're coming from loot / vendor

                // check if there is an item already in destination slot
                var occupied = _.find(player.items, function(i) {
                    return i.slot === targetSlot;
                });

                if(!occupied) {
                    reply({errmsg: 'Nothing to stack onto!'});
                    return;
                }

                var replyItem = function(bag) {

                    if(!item) {
                        reply({errmsg: 'Item to swap not found!'});
                        return;
                    }

                    // now we've got both items, ready to stack (currently only cash supported)
                    if(item.type === 'cash' && occupied.type === 'cash') {
                        occupied.value += item.value;
                        // now destroy the original
                        if(bag) {
                            bag.loot = _.without(bag.loot, item);
                            // Check if the bag is now empty
                            // If so, remove it from the world
                            if (bag.template.type === UnitTypeEnum.LOOTABLE) {
                                if (bag.loot.length === 0) {
                                    if (bag.param < 10) {
                                        bag.Remove();
                                    }
                                } else {
                                    // Renew the lifetimer so it doesn't suddenly disappear
                                    bag.lifeTime = 0.0;
                                }
                            }

                            // No need to refresh if the bag is not empty anymore, since it'll get deleted anyway on the client
                            // They will receive a BAG NOT FOUND error otherwise
                            if (bag.loot.length > 0) {
                                player.EmitNearby("lootFromBag", {bag: bag.id, loot: bag.loot}, 20, true);
                            }
                        } else {
                            player.items = _.without(player.items, item);
                        }
                    } else {
                        reply({errmsg: 'items are not stackable together!'});
                        return;
                    }

                    // return the updated (stacked) item
                    reply({item: occupied, loot: (bag && bag.loot)});

                };

                if(_.isUndefined(bagId)) {


                    // we are looking for the item that is being dropped in player inv
                    item = _.find(player.items, function(i) {
                        return i.id === itemId;
                    });

                    replyItem();

                } else {
                    // we are looking for the item being dropped in loot / vendor inv
                    worldHandler.FindUnitNear(bagId, player)
                       .then(function(bag) {

                           if (!bag) {
                               reply({
                                   errmsg: "Bag not found (too far?)"
                               });
                               return;
                           }

                           if (bag.template.type !== UnitTypeEnum.LOOTABLE && bag.template.type !== UnitTypeEnum.VENDOR) {
                               reply({
                                   errmsg: "Wrong NPC type for loot!"
                               });
                               return;
                           }

                           item = _.find(bag.loot, function(i) {
                               return i.id === itemId;
                           });

                           replyItem(bag);

                       });

                }


            });

            // this is for dropping an inv item on the ground
            socket.on("dropItem", function (data, reply) {
                if (!_.isFunction(reply)) {
                    log('dropItem no callback defined!');
                    return;
                }

                if (!socket.unit) {
                    reply({
                        errmsg: 'no unit!'
                    });
                    return;
                }

                var player = socket.unit;

                // Add a new unit and give it the loot item
                var item = _.find(player.items, function(i) {
                    return i.id === data.itemID;
                });

                if (_.isUndefined(item)) {
                    // Not found, so return
                    reply({
                        errmsg: "Item not found in player items!"
                    });
                    return;
                }

                player.items = _.without(player.items, item);

                // If it was equipped and type was armor/weapon, update the appearance
                if (item.equipped) {
                    if (item.getType() === 'armor') {
                        player.UpdateAppearance(true);

                        // It's possible that armor increases the maximum health
                        player.CalculateMaxHealth(true);

                        // And obviously, the armor itself
                        player.CalculateMaxArmor(true);
                    }
                    if (item.getType() === 'weapon' || item.getType() === 'tool') {
                        player.EmitNearby("updateWeapon", {
                            id: player.id,
                            weapon: 0
                        });
                    }
                }
                item.equipped = 0;

                var spawnPos = player.position.clone().add(player.heading);
                // todo: add to existing bag if near one?
                var bag = new Lootable({
                    id: server.GetAValidNPCID(),
                    x: spawnPos.x,
                    y: spawnPos.y,
                    z: spawnPos.z,
                    zone: player.zone,

                    // Hacky: refers to lootBag ID
                    template: dataHandler.units[lootBagTemplate],
                    data: {
                        droppedBy: player.id
                    },
                    roty: 0
                }, false);

                bag.load(); //Add unit to a cell

                item.owner = bag.id;

                // Add the item to the lootbag
                bag.loot.push(item);

                reply({
                    items: player.items
                });
            });

            // specific method for buying items from vendors
            socket.on('buyItem', function(data, reply) {
                if(!_.isFunction(reply)) {
                    log('buyItem: no callback!');
                    return;
                }

                var player = socket.unit;
                if(!player) {
                    reply({errmsg: 'invalid player!!'});
                    return;
                }

                var vendorId = data.vendorId,
                    itemId = data.itemId,
                    targetSlot = data.slot;

                if(_.find(player.items, function(i) {
                    return i.slot === targetSlot;
                })) {
                    reply({errmsg: 'target slot not empty!'});
                    return;
                }

                worldHandler.FindUnitNear(vendorId, player)
                    .then(function(vendor) {

                        if(!vendor) {
                            reply({errmsg: 'vendor has gone away!'});
                            return;
                        }

                        // todo: remove this check to allow other types of "shops"??
                        if(vendor.template.type !== UnitTypeEnum.VENDOR) {
                            reply({errmsg: 'unit is not a vendor!'});
                            return;
                        }

                        var item = _.find(vendor.loot, function(i) {
                            return i.id === itemId;
                        });

                        if(!item) {
                            reply({errmsg: 'item to buy not found!'});
                            return;
                        }

                        // ready to attempt purchase!
                        if (item.price > 0 && player.getTotalCoins() < item.price) {
                            reply({
                                // todo: move these messages to script
                                errmsg: _.sample(["Ye got no money, bum!", "Show me some gold coins!", "Where's the gold?"])
                            });
                            return;
                        }

                        // ok, made it this far, go ahead and buy!
                        // Update the money
                        player.purchase(item);
                        vendor.Say(_.sample(["Another satisfied customer!", "Hope ye kick some butt!", "Come again soon!", "Is that all ye buyin'?"]));
                        // It's now our property, so remove the price tag
                        delete item.price;
                        item.owner = player.id;
                        item.slot = targetSlot;

                        // move the item
                        vendor.loot = _.without(vendor.loot, item);
                        player.items.push(item);

                        // update everyone around who might also be looking
                        player.EmitNearby("updateVendor", {id: vendor.id, loot: vendor.loot}, 20, true);

                        // reply with full player item list as gold may have changed (todo: optimize delta?)
                        reply({items: player.items});

                    });


            });

            socket.on('sellItem', function(data, reply) {

                if(!_.isFunction(reply)) {
                    log('sellItem: no callback!');
                    return;
                }

                var player = socket.unit;
                if(!player) {
                    reply({errmsg: 'invalid player!!'});
                    return;
                }

                var vendorId = data.vendorId,
                    itemId = data.itemId,
                    targetSlot = data.slot;

                worldHandler.FindUnitNear(vendorId, player)
                    .then(function(vendor) {

                        if(!vendor) {
                            reply({errmsg: 'vendor has gone away!'});
                            return;
                        }

                        if(_.find(vendor.loot, function(i) {
                            return i.slot === targetSlot;
                        })) {
                            reply({errmsg: 'target slot not empty!'});
                            return;
                        }

                        // todo: remove this check to allow other types of "shops"??
                        if(vendor.template.type !== UnitTypeEnum.VENDOR) {
                            reply({errmsg: 'unit is not a vendor!'});
                            return;
                        }

                        var item = _.find(player.items, function(i) {
                            return i.id === itemId;
                        });

                        if(!item) {
                            reply({errmsg: 'item to sell not found!'});
                            return;
                        }

                        if(item.value <= 0 || item.type === 'cash') {
                            reply({errmsg: 'I don\'t buy that!'});
                            return;
                        }

                        var offeredPrice = Math.max(Math.floor(item.value * 0.5), 1);
                        if(vendor.data && vendor.data.buyPercentage) {
                            offeredPrice = Math.max(Math.floor(item.value * vendor.data.buyPercentage), 1);
                        }

                        // proceed with the selling!
                        item.owner = vendor.id;
                        item.slot = targetSlot;

                        // If it was equipped and type was armor/weapon, update the appearance
                        if (item.equipped) {
                            if (item.getType() === 'armor') {
                                player.UpdateAppearance(true);
                            }
                            if (item.getType() === 'weapon' || item.getType() === 'tool') {
                                player.EmitNearby("updateWeapon", {
                                    id: player.id,
                                    weapon: 0
                                });
                            }
                        }
                        item.equipped = 0;

                        // we need to remove the item first or else the player might not have room for money bag
                        vendor.loot.push(item);
                        player.items = _.without(player.items, item);

                        // Give the player the original price
                        player.addCoins(offeredPrice);

                        // adjust item price for selling back to the public
                        item.price = item.value;
                        if(vendor.data && vendor.data.sellPercentage) {
                            item.price = Math.max(Math.floor(item.value * vendor.data.sellPercentage), 0.01);
                        }

                        //console.log('buying: ', item, ' for ', offeredPrice);
                        vendor.Say(_.sample(["A pleasure doing business!", "Ye got a good deal!", "'Tis most splendid!"]));

                        // update everyone around who might also be looking
                        player.EmitNearby("updateVendor", {id: vendor.id, loot: vendor.loot}, 20, true);

                        // reply with full player item list as gold may have changed (todo: optimize delta?)
                        reply({items: player.items});

                });
            });

            socket.on("lootItem", function (data, reply) {
                if (!_.isFunction(reply)) {
                    log('lootItem no callback defined!');
                    return;
                }

                if (!socket.unit) {
                    reply({
                        errmsg: 'no unit!'
                    });
                    return;
                }

                worldHandler.FindUnitNear(data.npcID, socket.unit)
                    .then(function(bag) {

                        if (!bag) {
                            reply({
                                errmsg: "Bag not found (too far?)"
                            });
                            return;
                        }

                        if (bag.template.type !== UnitTypeEnum.LOOTABLE && bag.template.type !== UnitTypeEnum.VENDOR) {
                            reply({
                                errmsg: "Wrong NPC type for loot!"
                            });
                            return;
                        }

                        // Do the change
                        var item = _.find(bag.loot, function(i) {
                            return i.id === data.itemID;
                        });

                        if (!item) {
                            reply({
                                errmsg: "Item to buy not found!"
                            });
                            return;
                        }

                        var player = socket.unit;

                        // If we are a vendor, check if the player as enough money to buy it!
                        if (bag.template.type === UnitTypeEnum.VENDOR) {
                            if (item.price > 0 && player.getTotalCoins() < item.price) {
                                reply({
                                    errmsg: _.sample(["Ye got no money, bum!", "Show me some gold coins!", "Wher's the gold?"])
                                });
                                return;
                            }
                        }

                        var switchItem = null;
                        if (data.switchID > 0) {
                            if (bag.template.type === UnitTypeEnum.VENDOR) {
                                reply({
                                    errmsg: "I don't got space over there!"
                                });
                                return;
                            }

                            switchItem = _.find(player.items, function(i) {
                                return i.id === data.switchID;
                            });

                            if (_.isUndefined(switchItem)) {
                                // Not found, so return
                                reply({
                                    errmsg: "SwitchItem not found in player items!"
                                });
                                return;
                            }

                            // Overwrite the slotNumber anyway, because we don't trust the player
                            data.slotNumber = switchItem.slot;
                        }

                        if (!switchItem) {
                            // Only a test when we're not switching items,
                            // because only then can you give slotNumbers (otherwise it's overwritten)
                            var slotTest = _.find(player.items, function(i) {
                                return i.slot === data.slotNumber;
                            });

                            if (!_.isUndefined(slotTest)) {
                                // We found an item :O, that means there is already an item with this slotNumber!
                                reply({
                                    errmsg: "Bad slotNumber"
                                });
                                return;
                            }

                            // Check if the slotNumber is within the bag's limits
                            if (!_.isNumber(data.slotNumber) || data.slotNumber < 0 || data.slotNumber > 9) {
                                reply({
                                    errmsg: "Invalid slotNumber"
                                });
                                return;
                            }
                        }

                        // Add the item to the player, and remove it from the bag
                        player.items.push(item);
                        bag.loot = _.without(bag.loot, item);

                        // Check if the bag is now empty
                        // If so, remove it from the world
                        if (bag.template.type === UnitTypeEnum.LOOTABLE) {
                            if (bag.loot.length === 0 && !switchItem) {
                                if (bag.param < 10) {
                                    bag.Remove();
                                }
                            } else {
                                // Renew the lifetimer so it doesn't suddenly disappear
                                bag.lifeTime = 0.0;
                            }
                        }

                        // Set the owner to the player
                        item.owner = player.id;

                        var oldSlot = item.slot;
                        item.slot = data.slotNumber;

                        if (switchItem) {
                            //log("switching!");
                            bag.loot.push(switchItem);
                            player.items = _.without(player.items, switchItem);

                            // Set the owner to the bag
                            switchItem.owner = bag.id;
                            switchItem.slot = oldSlot;

                            // If it was equipped and type was armor/weapon, update the appearance
                            if (switchItem.equipped) {
                                if (switchItem.getType() === 'armor') {
                                    player.UpdateAppearance(true);
                                }
                                if (switchItem.getType()  === 'weapon' || switchItem.getType() === 'tool') {
                                    player.EmitNearby("updateWeapon", {
                                        id: player.id,
                                        weapon: 0
                                    });
                                }
                            }
                            switchItem.equipped = 0;
                        }

                        // No need to refresh if the bag is not empty anymore, since it'll get deleted anyway on the client
                        // They will receive a BAG NOT FOUND error otherwise
                        if (bag.loot.length > 0) {
                            player.EmitNearby("lootFromBag", {bag: data.npcID, loot: bag.loot}, 20, true);
                        }

                        if (bag.template.type === UnitTypeEnum.VENDOR) {
                            // Update the money
                            player.purchase(item);

                            bag.Say(_.sample(["Another satisfied customer!", "Hope ye kick some butt!", "Come again soon!", "Is that all ye buyin'?"]));

                            // It's now our property, so remove the price tag
                            delete item.price;
                        }

                        // HACK HACK HACK for halloween 1/11/2013
                        // Quick fix to teleport people out of the mansion when they loot from the chest
                        // in the treasure room
                        if ( bag.id === -2112 ) {

                            worldHandler.FindUnit(-2085)
                                .then(function(exit) {
                                    player.TeleportToUnit(exit);
                                });

                        }

                        reply({
                            items: player.items,
                        loot: bag.loot
                        });

                    });



            });

            socket.on("putItem", function (data, reply) {
                if (!_.isFunction(reply)) {
                    log('putItem no callback defined!');
                    return;
                }

                if (!socket.unit) {
                    reply({
                        errmsg: 'no unit!'
                    });
                    return;
                }

                worldHandler.FindUnitNear(data.npcID, socket.unit)
                    .then(function(bag) {

                        if (!bag) {
                            reply({
                                errmsg: "Bag not found (too far?)"
                            });
                            return;
                        }

                        if (bag.template.type !== UnitTypeEnum.LOOTABLE && bag.template.type !== UnitTypeEnum.VENDOR) {
                            reply({
                                errmsg: "Wrong NPC type for loot!"
                            });
                            return;
                        }

                        var player = socket.unit;

                        // Do the change
                        var item = _.find(player.items, function(i) {
                            return i.id === data.itemID;
                        });

                        if (_.isUndefined(item)) {
                            // Not found, so return
                            reply({
                                errmsg: "Item not found in player items!"
                            });
                            return;
                        }

                        // Check if the target slot is available
                        var slotTest = _.find(bag.loot, function(i) {
                            return i.slot === data.slotNumber;
                        });

                        if (!_.isUndefined(slotTest)) {
                            reply({
                                errmsg: "slotNumber is already taken"
                            });
                            return;
                        }

                        // Check if the slotNumber is within the bag's limits
                        if (!_.isNumber(data.slotNumber) || data.slotNumber < 0 || data.slotNumber > 9) {
                            reply({
                                errmsg: "Invalid slotNumber"
                            });
                            return;
                        }

                        if (bag.template.type === UnitTypeEnum.VENDOR) {
                            var offeredPrice = (item.value / 2).Round();
                            offeredPrice = Math.max(offeredPrice, 0);

                            if (!data.acceptOffer) {
                                if (offeredPrice > 0) {
                                    reply({
                                        offeredPrice: offeredPrice
                                    });
                                } else {
                                    reply({
                                        errmsg: ChooseRandom(["Take yer stuff with ye!", "Haven't ye got better items?", "Me thinks that is not worth the trouble!"])
                                    });
                                }
                                return;
                            } else {
                                // Put the price tag back (x2 :P)
                                item.price = offeredPrice * 2;

                                // we need to remove the item first or else the player might not have room for money bag
                                bag.loot.push(item);
                                player.items = _.without(player.items, item);

                                // Give the player the original price
                                player.addCoins(offeredPrice);

                                bag.Say(ChooseRandom(["A pleasure doing business!", "Ye got a good deal!", "'Tis most splendid!"]));
                            }
                        }

                        if (bag.template.type === UnitTypeEnum.LOOTABLE) {
                            // Renew the lifetimer so it doesn't suddenly disappear
                            bag.lifeTime = 0.0;

                            // repeating this because of vendor logic above...
                            bag.loot.push(item);
                            player.items = _.without(player.items, item);
                        }

                        // Set the owner to the bag
                        item.owner = bag.id;

                        item.slot = data.slotNumber;

                        // If it was equipped and type was armor/weapon, update the appearance
                        if (item.equipped) {
                            if (item.getType() === 'armor') {
                                player.UpdateAppearance(true);
                            }
                            if (item.getType() === 'weapon' || item.getType() === 'tool') {
                                player.EmitNearby("updateWeapon", {
                                    id: player.id,
                                    weapon: 0
                                });
                            }
                        }
                        item.equipped = 0;

                        player.EmitNearby("lootFromBag", {bag: data.npcID, loot: bag.loot}, 20, true);

                        reply({
                            // we may have received a new money bag
                            items: player.items,
                            loot: bag.loot
                        });

                    });
            });

            // swapping items, which also will handle combining/stacking
            socket.on("switchItem", function(data, reply) {
                if (!_.isFunction(reply)) {
                    log('switchItem no callback defined!');
                    return;
                }

                if (!socket.unit) {
                    reply({
                        errmsg: 'no unit!'
                    });
                    return;
                }

                // Check if the slotNumber is within the bag's limits
                if (!_.isNumber(data.slotNumber) || data.slotNumber < 0 || data.slotNumber > 9) {
                    reply({
                        errmsg: "Invalid slotNumber"
                    });
                    return;
                }

                var player = socket.unit;

                // switching within our own inventory
                if (_.isUndefined(data.npcID)) {
                    // Make sure we have the item we want to switch
                    var item = _.find(player.items, function(i) {
                        return i.id === data.itemID;
                    });

                    if (_.isUndefined(item)) {
                        // Not found, so return
                        reply({
                            errmsg: "Item not found in player items!"
                        });
                        return;
                    }

                    var switchItem = _.find(player.items, function(i) {
                        return i.slot === data.slotNumber;
                    });


                    if (!_.isUndefined(switchItem)) {

                        // Do nothing if the target is the same as the start item
                        if ( item.slot === switchItem.slot ) {
                            reply({});
                            return;
                        }

                        // stackables
                        if(switchItem.getType() === 'cash' && item.getType() === 'cash') {
                            item.value += switchItem.value;
                            player.items = _.without(player.items, switchItem);
                        } else {
                            // We found an item, so prepare for a full switch, not just a movement
                            switchItem.slot = item.slot;
                        }
                    }
                    item.slot = data.slotNumber;

                    reply({
                        items: player.items
                    });

                } else {

                    worldHandler.FindUnitNear(data.npcID, player)
                        .then(function(bag) {

                            if (!bag) {
                                reply({
                                    errmsg: "Bag not found (too far?)"
                                });
                                return;
                            } else if (bag.template.type !== UnitTypeEnum.LOOTABLE && bag.template.type !== UnitTypeEnum.VENDOR) {
                                reply({
                                    errmsg: "Wrong NPC type for loot!"
                                });
                                return;
                            }

                            if (bag.template.type === UnitTypeEnum.VENDOR) {
                                reply({
                                    errmsg: ChooseRandom(["Dareth not touch my stuff!", "What do you think yer doing?"])
                                });
                                return;
                            }

                            // Make sure we have the item we want to switch
                            var item = _.find(bag.loot, function(i) {
                                return i.id === data.itemID;
                            });

                            if (_.isUndefined(item)) {
                                // Not found, so return
                                reply({
                                    errmsg: "Item not found in loot bag!"
                                });
                                return;
                            }

                            if (bag.template.type === UnitTypeEnum.LOOTABLE) {
                                // Renew the lifetimer so it doesn't suddenly disappear
                                bag.lifeTime = 0.0;
                            }

                            var switchItem = _.find(bag.loot, function(i) {
                                return i.slot === data.slotNumber;
                            });

                            if (!_.isUndefined(switchItem)) {
                                // stackables
                                if(switchItem.getType() === 'cash' && item.getType() === 'cash') {
                                    item.value += switchItem.value;
                                    socket.unit.items = _.without(socket.unit.items, switchItem);
                                } else {
                                    // We found an item, so prepare for a full switch, not just a movement
                                    switchItem.slot = item.slot;
                                }
                            }
                            item.slot = data.slotNumber;

                            socket.unit.EmitNearby("lootFromBag", {bag: data.npcID, loot: bag.loot}, 20, true);

                            reply({
                                items: player.items,
                                loot: bag.loot
                            });

                        });

                }

            });

            socket.on("loot", function(npcID, reply) {

                if (!_.isFunction(reply)) {
                    log('switchItem no callback defined!');
                    return;
                }

                if (!socket.unit) {
                    reply({
                        errmsg: 'no unit!'
                    });
                    return;
                }

                var player = socket.unit;

                // todo: check if NPC is nearby
                worldHandler.FindUnitNear(npcID, player)
                   .then(function(bag) {

                       if (!bag) {

                           reply({
                               errmsg: "Bag not found (too far?)"
                           });

                           return;
                       } else if (bag.template.type !== UnitTypeEnum.LOOTABLE &&
                                  bag.template.type !== UnitTypeEnum.VENDOR) {

                           reply({
                               errmsg: "Wrong NPC type for loot!"
                           });

                           return;

                       } else {

                           reply(bag.loot);

                       }

                       if (bag.template.type === UnitTypeEnum.LOOTABLE) {

                           // Renew the lifetimer so it doesn't suddenly disappear
                           bag.lifeTime = 0.0;

                       }

                 });
            });


            socket.on("hit", function (data, reply) {

                if ( !socket.unit ) return;

                if (!_.isFunction(reply)) {
                    log('hit no callback defined!');
                    return;
                }


                if ( !CheckData(data, ["l","w"]) ) {
                    reply({
                        errmsg:"Corrupt hit data"
                    });
                    return;
                }

                if ( !data.l instanceof Array ) {
                    reply({
                        errmsg:"Corrupt data"
                    });
                    return;
                }

                if ( !_.isNumber(data.w) ) {
                    reply({
                        errmsg:"Corrupt data"
                    });
                    return;
                }

                var weapon = null;
                for(var i=0;i<socket.unit.items.length;i++) {
                    var item = socket.unit.items[i];

                    if ( item.id == data.w ) {
                        weapon = item;
                    }
                }

                if ( !weapon ) {
                    // reply({
                    //   errmsg:"No weapon found for hit!"
                    // });
                    return;
                }

                var template = dataHandler.items[weapon.template];

                if ( template.type !== "weapon" ) {
                    if ( !weapon ) {
                        reply({
                            errmsg:"Item is not a weapon!"
                        });
                        return;
                    }
                }

                _.each(data.l, function(id) {


                    if ( !_.isNumber(id) ) {
                        reply({
                            errmsg:"Corrupt data"
                        });
                        return;
                    }

                    // Not ourselves!
                    if ( id === socket.unit.id ) return;

                    worldHandler.FindUnitNear(id, socket.unit)
                        .then(function(targetUnit) {
                            if ( !targetUnit ) {
                                reply({
                                    errmsg:"No targetUnit found for hit!"
                                });
                                return;
                            }

                            // Silent return...
                            if ( targetUnit.health <= 0 ) {
                                return;
                            }

                            socket.unit.Attack(targetUnit, weapon);

                        });

                });

            });

            socket.on("ghit", function (data, reply) {

                if ( !socket.unit ) return;

                if (!_.isFunction(reply)) {
                    log('ghit no callback defined!');
                    return;
                }


                if ( !CheckData(data, ["w","o"]) ) {
                    reply({
                        errmsg:"Corrupt hit data"
                    });
                    return;
                }

                if ( !_.isNumber(data.w) || !_.isNumber(data.o) || data.o > 0) {
                    reply({
                        errmsg:"Corrupt data"
                    });
                    return;
                }

                worldHandler.FindUnitNear(data.o, socket.unit)
                    .then(function(owner) {

                        if ( !owner || !(owner instanceof NPC) ) {

                            reply({
                                errmsg: "Bad unit type for ghit"
                            });

                            return;
                        }

                        var weapon = null;

                        for(var i=0;i<owner.weapons.length;i++) {
                            var item = owner.weapons[i];

                            if ( item.id == data.w ) {
                                weapon = item;
                            }
                        }

                        if ( !weapon ) {

                            reply({
                                errmsg: "No weapon found for ghit!"
                            });

                            return;

                        }

                        // Silent return...
                        if ( socket.unit.health <= 0 ) {
                            return;
                        }

                        owner.Attack(socket.unit, weapon);

                    });

            });

            socket.on("getStartData", function (data, reply) {

                if (!_.isFunction(reply)) {
                    log('getStartData no callback defined!');
                    return;
                }

                var response = {
                    "numberOfPlayersOnline" : io.sockets.clients().length
                };

                reply(response);
            });

            socket.on("shutdown", function (value) {
                if ( !socket.unit || socket.unit.editor === false ) return;

                log("Shutting down by user request ("+socket.unit.id+")");

                chatHandler.announce("Server will restart in 5 seconds...", "red");

                setTimeout(function() {process.exit();}, 5000);
            });

            socket.on("backup", function () {
                if ( !socket.unit || socket.unit.editor === false ) return;

                log("Backing up server by user request ("+socket.unit.id+")");

                worldHandler.DoFullBackup();
            });

            socket.on("chGodMode", function (value) {
                if ( !socket.unit || socket.unit.editor === false ) return;
                socket.unit.chGodMode = value;
            });
            socket.on("chInvisibleByMonsters", function (value) {
                if ( !socket.unit || socket.unit.editor === false ) return;
                socket.unit.chInvisibleByMonsters = value;
            });
            socket.on("ch999Damage", function (value) {
                if ( !socket.unit || socket.unit.editor === false ) return;
                socket.unit.ch999Damage = value;
            });
            socket.on("chDevNinja", function (value) {
                if ( !socket.unit || socket.unit.editor === false ) return;
                socket.unit.chDevNinja = value;
            });
            socket.on("opReloadData", function (data) {
                if ( !socket.unit || socket.unit.editor === false ) return;

                dataHandler.Load();

                setTimeout(function(){
                    chatHandler.announce("Reloaded NPC & Item templates", "white");
                }, 1000);
            });

            socket.on("pmManage", function (data) {
                if ( !socket.unit || socket.unit.editor === false ) return;
                if ( !CheckData(data, ["action", "characterName", "reason", "hours"]) ) {
                    reply({
                        errmsg:"Corrupt pmManage data"
                    });
                    return;
                }

                worldHandler.FindPlayerByName(data.characterName)
                    .then(function(foundUnit) {

                        if ( !foundUnit ) {
                            reply({
                                errmsg:"Player '"+data.characterName+"' not found!"
                            });
                            return;
                        }

                        var reason = data.reason ? data.reason : "";

                        switch (parseInt(data.action)) {
                            case UserManagementTypeEnum.LIGHTWARN:
                                foundUnit.LightWarn();
                                break;
                            case UserManagementTypeEnum.SERIOUSWARN:
                                foundUnit.SeriousWarn();
                                break;
                            case UserManagementTypeEnum.KICK:
                                foundUnit.Kick(reason);
                                break;
                            case UserManagementTypeEnum.BAN:
                                foundUnit.Ban(data.hours, reason);
                                break;
                        }

                    });



            });

            socket.on("teleport", function (data, reply) {
                if ( !socket.unit || socket.unit.editor === false ) return;

                if (!_.isFunction(reply)) {
                    log('teleport no callback defined!');
                    return;
                }

                if ( !CheckData(data, ["pos", "zone", "name", "targetName"]) ) {
                    reply({
                        errmsg:"Corrupt teleport data"
                    });
                    return;
                }

                var promises = [
                    worldHandler.FindPlayerByName(data.name),
                    worldHandler.FindPlayerByName(data.targetName)
                ];

                   Q.all(promises).spread(function(unit, targetUnit) {

                       var zone = parseInt(data.zone, 10);
                       var pos = targetUnit ? targetUnit.position : ConvertVector3(data.pos);

                       if ( unit ) {
                           unit.Teleport(zone, pos);
                       } else {
                           chatHandler.announcePersonally(socket.unit, "Could not find player "+data.name+"!", "red");
                       }

                  });

            });

            socket.on("deleteNPC", function (id) {

                // Later report them!
                if ( !socket.unit || socket.unit.editor === false ) return;


                worldHandler.FindUnit(id)
                    .then(function(unit) {

                        var zone = unit.zone;

                        var cx = unit.cellX;
                        var cz = unit.cellZ;

                        return [zone, cx, cz, worldHandler.removeUnitFromCell(unit, cx, cz)];

                    })
                    .spread(function(zone, cx, cz) {
                        return worldHandler.UpdateNearbyUnitsOtherUnitsLists(zone, cx, cz);
                    })
                    .then(function() {

                        mysql.query('DELETE FROM ib_units WHERE ?', {
                            id:-id
                        }, function (err, result) {
                            if ( err ) throw(err);
                        });

                    });

            });

            socket.on("generateCell", function (data, reply) {
                if ( !socket.unit || socket.unit.editor === false ) return;

                if (!_.isFunction(reply)) {
                    log('generateCell no callback defined!');
                    return;
                }
                // debugger;

                var cellPos = Cells.toCellCoordinates(data.pos.x, data.pos.z);

                socket.unit.UpdateCellPosition();

                worldHandler.GenerateCell(
                    socket.unit.zone,
                    cellPos.x,
                    cellPos.z,
                    parseInt(data.octaves, 10),
                    parseInt(data.persistence, 10),
                    parseFloat(data.scale),
                    parseInt(data.tile, 10),
                    parseInt(data.heightOffset, 10)
                ).then(function() {
                    reply("OK");
                });


            });

            // this should prolly just be "addUnit"
            socket.on("addNPC", function(data) {
                // Later report them!
                if (!socket.unit || socket.unit.editor === false) {
                    return;
                }

                data.position = ConvertVector3(data.position);
                data.position = data.position.Round(2);

                var zone = socket.unit.zone;
                var cellPos = Cells.toCellCoordinates(data.position.x, data.position.z);

                worldHandler.requireCell(zone, cellPos.x, cellPos.z)
                    .then(function() {

                        data.x = data.position.x;
                        data.y = data.position.y;
                        data.z = data.position.z;
                        data.zone = zone;

                        if (_.isUndefined(data.param)) {
                            data.param = 0;
                        }
                        data.param = parseInt(data.param, 10);

                        if (_.isUndefined(data.data)) {
                            data.data = null;
                        }

                        data.id = -server.GetAValidNPCID();

                        mysql.query('INSERT INTO ib_units SET ?', {
                            id: data.id,
                            zone: data.zone,
                            x: data.x,
                            y: data.y,
                            z: data.z,
                            template: data.template,
                            roty: data.roty,
                            param: data.param,
                            data: JSON.stringify(data.data)
                        },
                        function(err, result) {
                            if (err) {
                                throw err;
                            }

                            var unit = worldHandler.MakeUnitFromData(data);
                            if (unit) {

                                unit.load().then(function() {
                                    unit.Awake();
                                });

                            }
                        });

                });
            });

            socket.on("moveNPC", function (data) {

                // Later report them!
                if ( !socket.unit || socket.unit.editor === false ) return;

                data.position = ConvertVector3(data.position);
                data.position = data.position.Round(2);

                worldHandler.FindUnit(parseInt(data.id, 10))
                    .then(function(unit) {

                        var zone = unit.zone;

                        var cellPos = Cells.toCellCoordinates(data.position.x, data.position.z);

                        worldHandler.requireCell(zone, cellPos.x, cellPos.z)
                            .then(function() {

                                mysql.query('UPDATE ib_units SET'+
                                    ' x = ?,'+
                                    ' y = ?,'+
                                    ' z = ?'+
                                    ' WHERE id = ?',
                                    [
                                    data.position.x,
                                    data.position.y,
                                    data.position.z,
                                    Math.abs(unit.id)
                                    ]);

                                unit.position.copy(data.position);

                            });

                    });

            });

            socket.on("paintModel", function (data) {

                console.log('SocketHandler:paintModel', data);

                //data.pos, data.metadata;

                // Later report them!
                if ( !socket.unit || socket.unit.editor === false ) return;

                var pos = ConvertVector3(data.pos);
                pos = pos.Round(2);

                var zone = socket.unit.zone;

                var cellPos = Cells.toCellCoordinates(pos.x, pos.z);

                var changeData = JSON.parse(JSON.stringify(data));

                if ( data.global ) {
                    changeData.metadata = {};
                }

                worldHandler.requireCell(zone, cellPos.x, cellPos.z).then(function() {
                      return worldHandler.SaveCell(zone, cellPos.x, cellPos.z, false, [], [changeData], []);
                   }).then(function() {

                       console.log('SocketHandler onPaint', 'Painted model');

                       if ( data.global ) {

                           _.each(data.metadata, function(value, key, list) {
                               mysql.query('UPDATE ib_meshes SET '+key+' = ? WHERE id = ?', ["tiles/"+value,data.id]);

                               data.metadata[key] = "tiles/"+value;
                           });


                           chatHandler.announcePersonally(socket.unit,
                               "The server needs to restart before you will see that texture change applied to all models!.", "cyan");
                       }

                       socket.unit.EmitNearby("paintModel", data, 0, true);

                   });

            });

            socket.on("deleteModel", function (data, reply) {

                // Later report them!
                if ( !socket.unit || socket.unit.editor === false ) return;

                if (!_.isFunction(reply)) {
                    log('deleteModel no callback defined!');
                    return;
                }


                data = ConvertVector3(data);
                data = data.Round(2);

                var zone = socket.unit.zone;

                var cellPos = Cells.toCellCoordinates(data.x, data.z);

                worldHandler.requireCell(zone, cellPos.x, cellPos.z).then(function() {

                    // Set a timer to auto save this cell
                    // If we set the height again, reset the timer
                    return worldHandler.SaveCell(zone, cellPos.x, cellPos.z, false, [], [], [data]);

                }).then(function() {

                    console.log('Deleted model');

                    socket.unit.EmitNearby("deleteModel", data, 0, true);

                    reply(true);

                });

            });

            socket.on("addModel", function (data, reply) {

                // Later report them!
                if ( !socket.unit || socket.unit.editor === false ) return;

                if (!_.isFunction(reply)) {
                    log('addModel no callback defined!');
                    return;
                }

                data.position = ConvertVector3(data.position);
                data.position = data.position.Round(2);

                var zone = socket.unit.zone;

                var cellPos = Cells.toCellCoordinates(data.position.x, data.position.z);

                // Just add the object, and save it. Clients should automatically add it
                var addObject = {
                    x : data.position.x,
                    y : data.position.y,
                    z : data.position.z,
                    t : data.type,
                    p : data.param,
                    rX : data.rX,
                    rY : data.rY,
                    rZ : data.rZ
                };

                worldHandler.requireCell(zone, cellPos.x, cellPos.z).then(function() {
                    return worldHandler.SaveCell(zone, cellPos.x, cellPos.z, false, [addObject], [], []);
                }).then(function() {
                    socket.unit.EmitNearby("addModel", data, 0, true);

                    reply(true);
                });
            });

            socket.on("disconnect", function (data) {
                if (socket.unit) {
                    log(socket.unit.name + " disconnected.");
                    socketHandler.onlinePlayers = _.without(socketHandler.onlinePlayers, _.find(socketHandler.onlinePlayers, function(p) {
                        return p.id === socket.unit.id;
                    }));
                    socket.unit.LeaveGame();
                }
            });

            socket.on("playerdata", function (data) {

                if ( socket.unit ) {

                    if ( !CheckData(data, ["p","r"]) ) {
                        return;
                    }

                    if ( !CheckVector(data.p) ) return;

                    if ( !_.isNumber(data.r) ) return;

                    var p = ConvertVector3(data.p);

                    var radians = socket.unit.rotation.y + (Math.PI/2);

                    socket.unit.heading.x = Math.sin(radians);
                    socket.unit.heading.y = 0;
                    socket.unit.heading.z = Math.cos(radians);
                    socket.unit.heading.normalize();

                    socket.unit.side = socket.unit.heading.clone().Perp();


                    socket.unit.rotation.y = parseInt(data.r, 10);

                    // Check if the teleports are way off
                    var errorMargin = 20;

                    var checkCell = function () {

                        // Calculate cell X and Z, and check if they differ
                        // If they do, remove us from that cell's unitList and add ourselves to the new cell's Unitlist
                        // In addition, recalculate the unitlist for some units
                        // Which ones?
                        var cellPos = Cells.toCellCoordinates(socket.unit.position.x, socket.unit.position.z);
                        if ( cellPos.x != socket.unit.cellX || cellPos.z != socket.unit.cellZ ) {
                            return socket.unit.ChangeCell(cellPos.x, cellPos.z);
                        }

                    };

                    if ( !_.isUndefined(data.u) ) {
                        socket.unit.localPosition.copy(p);
                        socket.unit.standingOnUnitId = data.u;

                        // Find the unit, and get their position
                        // THIS will be our real position, otherwise we will give them false
                        // information, like who is around us
                        worldHandler.FindUnit(data.u)
                           .then(function(train) {
                              socket.unit.position.copy(train.position);
                              return checkCell();
                           });

                    } else {
                        var checkPos = p.clone().setY(socket.unit.position.y);
                        if ( !socket.unit.InRangeOfPosition(checkPos, errorMargin) ) {
                            return;
                        }

                        socket.unit.position.copy(p);
                        socket.unit.standingOnUnitId = 0;

                        checkCell();
                    }



                }
            });
        });
    },
    UpdateBans: function() {
        var me = this;

        mysql.query('SELECT * FROM ib_bans', function (err, results, fields) {
            me.bans = results;
        });
    },
    IsLoggedIn: function(socket) {

        return !_.isUndefined(socket.unit);

    }
});

var socketHandler = new SocketHandler();
