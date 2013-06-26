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
    Init: function() {


        this.bans = [];

        var me = this;

        this.UpdateBans();



        io.sockets.on("connection", function (socket) {

            socket.ip = socket.handshake.address.address;

            // Check if we're banned
            socket.banned = false;
            _.each(me.bans, function(ban) {
                if ( ban.ip === socket.ip ) {
                    var time = Math.round((new Date()).getTime()/1000);
                    if ( ban.until > time || !ban.until ) socket.banned = true;
                }
            });

            socket.unit = null;

            socket.on("connectServer", function (data, reply) {

                if ( _.isUndefined(reply) || !_.isFunction(reply) ) return;

                if ( socket.unit === null ) {
                    // log("unit still null, so OK!");
                }
                else {
                    log("unit already exists!");
                    return;
                }

                if ( !CheckData(data, ["guest"]) ) {
                    reply({
                        errmsg:"Corrupt data"
                    });
                    return;
                }

                if ( shuttingDown ) {
                    reply({
                        errmsg:"The server is currently updating to a new version. Please refresh the page in a few seconds."
                    });
                    return;
                }



                //socket.unitID = characterIDCount++;

                // characterIDCount will become id from db
                // If no guest, all we need is an ironbane id & password (md5 future)
                // In addition, we need to know which player they will use, so a player ID
                // also check if the player ID is available to them

                var unit;

                if ( data.guest ) {
                    data.id = 0;

                    //data.characterID = 1;
                    data.pass = "";
                }


                if ( !CheckData(data, ["id","pass","characterID"]) ) {
                    reply({
                        errmsg:"Corrupt player data"
                    });
                    return;
                }


                log("Client "+data.id +" connecting...");


                // TODO: closure ok?
                (function(socket, data, reply) {
                    mysql.query('SELECT pass, editor, banned FROM bcs_users WHERE id = ?', [data.id],
                        function (err, results, fields) {

                            //log("Initiating connection for ");

                            if (err) throw err;

                            //return;

                            if ( results.length === 0 ) {
                                reply({
                                    errmsg:"User does not exist!"
                                });
                                return;
                            }

                            //                            log("inter");


                            // Check if the passwords match
                            // Check the password
                            var userdata = results[0];

                            if ( userdata.pass !== data.pass ) {
                                reply({
                                    errmsg:"Password is incorrect!"
                                });
                                return;
                            }

                            if ( userdata.banned || socket.banned ) {
                                reply({
                                    errmsg:"You have been banned."
                                });
                                return;
                            }


                            data.editor = userdata.editor;



                            // Check if there is already a character logged in from this account
                            for(var z in worldHandler.world) {
                                for(var cx in worldHandler.world[z]) {
                                    for(var cz in worldHandler.world[z][cx]) {

                                        if ( ISDEF(worldHandler.world[z][cx][cz].units) ) {

                                            var units = worldHandler.world[z][cx][cz].units;

                                            //log(units);

                                            for(var u=0;u<units.length;u++) {

                                                if ( !(units[u] instanceof Player) ) continue;


                                                // Check for corrupt units...
                                                if ( !units[u].socket || units[u].socket.disconnected ) {
                                                    log("Error: corrupt player found in-game!");
                                                    log("Begin unit data");
                                                    console.log(units[u].id);
                                                    console.log(units[u].name);
                                                    log("End unit data");
                                                    log("Forcing disconnect...");
                                                    units[u].LeaveGame();
                                                    continue;
                                                }

                                                // Except for guests, of course
                                                if ( units[u].playerID === 0 ) continue;

                                                if ( units[u].playerID === data.id ) {
                                                    log("Duplicate character found!");
                                                    log("Begin unit data");
                                                    console.log(units[u].id);
                                                    console.log(units[u].name);
                                                    log("End unit data");
                                                    reply({
                                                        errmsg:"You can only play with one character at a time!"
                                                    });
                                                    return;
                                                }


                                            }
                                        }
                                    }
                                }
                            }

                            // Query data and DC if it's not valid
                            (function(socket, data, reply) {
                                mysql.query(
                                    'SELECT * FROM ib_characters WHERE id = ?', [data.characterID],
                                    function selectCb(err, results, fields) {
                                        if (err) throw err;

                                        if ( results.length === 0 ) {
                                            reply({
                                                errmsg:"No character with ID " + data.characterID+ " found!"
                                            });

                                            return;
                                        }

                                        //log("Got character data...");



                                        // All set! The player wlll use this character's data.
                                        var chardata = results[0];

                                        // Check if the character belongs to us

                                        if ( chardata.user !== data.id ) {
                                            reply({
                                                errmsg:"Character's user ID does not match player ID"
                                            });
                                            return;
                                        }

                                        if ( data.guest ) {
                                            if ( chardata.user !== 0 ) {
                                                reply({
                                                    errmsg:"Character is not allowed for guest use"
                                                });
                                                return;
                                            }

                                            // Check if the character is already being used in the server (since they bypassed the member check)
                                            var gu = worldHandler.FindUnit(chardata.id);

                                            if ( gu ) {
                                                reply({
                                                    errmsg:"There is already a guest playing under your credentials!"
                                                });
                                                return;
                                            }

                                        }


                                        if ( !data.guest ) {
                                            mysql.query('UPDATE bcs_users SET characterused = ? WHERE id = ?', [data.characterID,data.id]);
                                        }

                                        (function(socket, data, reply, chardata) {
                                            mysql.query(
                                                'SELECT * FROM ib_items WHERE owner = ?', [data.characterID],
                                                function selectCb(err, results, fields) {
                                                    if (err) throw err;

                                                    // parse the metadata
                                                    results.forEach(function(item) {
                                                        if(item.data) {
                                                            try {
                                                                item.data = JSON.parse(item.data);
                                                            } catch(e) {
                                                                // invalid json?
                                                            }
                                                        }
                                                    });

                                                    // It's possible that the items are empty!
                                                    chardata.items = results;

                                                    chardata.editor = data.editor;

                                                    var unit = new Player(chardata);


                                                    // Link the unit with the player ID
                                                    unit.playerID = data.id;

                                                    unit.isGuest = data.guest;

                                                    socket.unit = unit;

                                                    // Provide a circular reference
                                                    socket.unit.socket = socket;

                                                    socket.unit.editor = data.editor === 1;

                                                    // Update us, and all players that are nearby
                                                    var cx = unit.cellX;
                                                    var cz = unit.cellZ;

                                                    // When we make this unit, it should automatically create a otherUnits list
                                                    // When this list is created, each unit that is added must be sent to it's socket if it's a player
                                                    // and also removed when out of range

                                                    // In addition, we need the units that are near this unit, to add this unit to their otherUnits list
                                                    // They will in turn tell their socket to add the unit


                                                    chatHandler.JoinGame(socket.unit);


                                                    reply({
                                                        id: socket.unit.id,
                                                        name: socket.unit.name,
                                                        zone: socket.unit.zone,
                                                        position: socket.unit.position,
                                                        rotY: socket.unit.rotation.y,
                                                        editor: socket.unit.editor,
                                                        size: socket.unit.size,
                                                        health: socket.unit.health,
                                                        armor: socket.unit.armor,
                                                        coins: socket.unit.coins,
                                                        healthMax: socket.unit.healthMax,
                                                        armorMax: socket.unit.armorMax,
                                                        hair: socket.unit.hair,
                                                        eyes: socket.unit.eyes,
                                                        skin: socket.unit.skin,
                                                        items: socket.unit.items,
                                                        heartPieces: socket.unit.heartpieces
                                                    });

                                                    var playerList = [];
                                                    for(var z in worldHandler.world) {
                                                        for(var cx in worldHandler.world[z]) {
                                                            for(var cz in worldHandler.world[z][cx]) {
                                                                if ( ISDEF(worldHandler.world[z][cx][cz].units) ) {
                                                                    var units = worldHandler.world[z][cx][cz].units;
                                                                    for(var u=0;u<units.length;u++) {
                                                                        if ( units[u].id < 0 || units[u] === socket.unit ) continue;

                                                                        var name = '<div style="display:inline;color:'+chatHandler.GetChatColor(units[u])+'">'+units[u].name + '</div>';
                                                                        playerList.push(name);
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }

                                                    if (playerList.length === 0) playerList.push("None");

                                                    chatHandler.AnnouncePersonally(socket.unit, "Hey there, "+socket.unit.name+"!<br>Players online: "+playerList.join(", "), "#01ff46");


                                                });
                                        })(socket, data, reply, chardata);

                                    });
                            })(socket, data, reply);


                        });
                })(socket, data, reply);



            });

            socket.on("backToMainMenu", function (data, reply) {

                if ( socket.unit ) {

                    if ( socket.unit.health <= 0 ) {
                        reply({
                            errmsg:"Please wait until you respawn!"
                        });
                        return;
                    }

                    socket.unit.LeaveGame();
                    reply("OK");

                    log(socket.unit.name+" is back at the Main Menu.");
                }

                socket.unit = null;
            });

            // Send to everyone!
            socket.on("chatMessage", function (data) {
                if ( !socket.unit ) return;

                if ( !_.isString(data.message) ) {
                    chatHandler.AnnounceNick("Warning: Hacked client in "+
                        "[chatMessage]<br>User "+socket.unit.name+"", "red");
                    return;
                }

                data.message = data.message.substr(0, 100);

                // No empty messages
                if ( !data.message ) return;

                if ( !socket.unit.editor && socket.unit.lastChatTime > (new Date()).getTime()-2000 ) {
                    chatHandler.AnnouncePersonally(socket.unit,
                        "Please don't spam the server.", "yellow");
                    return;
                }

                socket.unit.lastChatTime = (new Date()).getTime();


                if ( data.message.length <= 0 ) return;

                log(socket.unit.name + ': '+data.message);

                chatHandler.Say(socket.unit, data.message);
            });

            socket.on("doJump", function (data) {
                if ( !socket.unit ) return;

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

                if ( !socket.unit ) return;

                if ( _.isUndefined(reply) || !_.isFunction(reply) ) return;

                if ( !CheckData(data, ["s","t","w","o","sw"]) ) {
                    reply({
                        errmsg:"Corrupt projectile data"
                    });
                    return;
                }

                if ( !CheckVector(data.s) ) {
                    reply({
                        errmsg:"Corrupt start vector for addProjectile"
                    });
                    return;
                }

                if ( !CheckVector(data.t) ) {
                    reply({
                        errmsg:"Corrupt target vector for addProjectile"
                    });
                    return;
                }

                data.s = ConvertVector3(data.s);
                data.s = data.s.Round(2);

                data.t = ConvertVector3(data.t);
                data.t = data.t.Round(2);

                data.sw = data.sw ? true : false;


                // Convert the weapon ID to a template ID
                var item = _.find(socket.unit.items, function(i){
                    return i.id === data.w;
                });

                if ( _.isUndefined(item) ) {
                    reply({
                        errmsg:"No item found for addProjectile!"
                    });
                    return;
                }


                var unit = worldHandler.FindUnitNear(data.o, socket.unit);

                if (!unit ) {
                    reply({
                        errmsg:"Unit not found for addProjectile!"
                    });
                    return;
                }

                if ( socket.unit ) {
                    socket.unit.EmitNearby("addProjectile", {
                        s:data.s,
                        t:data.t,
                        w:item.template,
                        o:data.o,
                        sw:data.sw
                    });
                }
            });

            socket.on("useItem", function (barIndex, reply) {

                if ( !socket.unit ) return;

                if ( _.isUndefined(reply) || !_.isFunction(reply) ) return;


                var item = _.find(socket.unit.items, function(i){
                    return i.slot == barIndex;
                });

                if ( _.isUndefined(item) ) {

                    reply({
                        errmsg:"No item found!"
                    });
                    return;
                }

                var template = dataHandler.items[item.template];

                switch (template.type) {
                    case 'consumable':

                        // Remove the item
                        socket.unit.items = _.without(socket.unit.items, item);

                        // What kind of consumable?
                        switch (template.subtype) {
                            case 'restorative':

                                    // Increase our health
                                socket.unit.SetHealth(socket.unit.health+item.attr1);


                                // Spawn particles
                             socket.unit.EmitNearby("addParticle", {p:template.particle, fu:socket.unit.id}, 0, true);

                                break;
                        }

                        // It's possible that item increases the maximum health
                        socket.unit.CalculateMaxHealth(true);

                        // Client should automatically remove the item

                        break;
                    case 'armor':

                        // Unequip all armor for this subtype
                        _.each(socket.unit.items, function(i) {
                            if ( dataHandler.items[i.template].type == 'armor' &&
                                dataHandler.items[i.template].subtype == dataHandler.items[item.template].subtype
                                && i != item) {
                                i.equipped = 0;
                            }
                        });

                        // Set to equipped
                        item.equipped = item.equipped ? 0 : 1;

                        // Send a request to equipment
                        // Other players will update the view
                        socket.unit.UpdateAppearance(true);

                        // It's possible that armor increases the maximum health
                        socket.unit.CalculateMaxHealth(true);

                        // And obviously, the armor itself
                        socket.unit.CalculateMaxArmor(true);

                        break;
                    case 'weapon':
                    case 'tool':

                        // Unequip all weapons we already have equipped
                        //  (since we can have only one active)
                        _.each(socket.unit.items, function(i) {
                            if ( (dataHandler.items[i.template].type == 'weapon'
                                || dataHandler.items[i.template].type == 'tool')
                            && i != item) {
                                i.equipped = 0;
                            }
                        });

                        // Set to equipped
                        item.equipped = item.equipped ? 0 : 1;

                        socket.unit.EmitNearby("updateWeapon", {
                            id:socket.unit.id,
                            weapon:item.equipped ? template.id : 0
                        });

                        break;
                }


            });

            socket.on("dropItem", function (data, reply) {

                if ( !socket.unit ) return;

                if ( _.isUndefined(reply) || !_.isFunction(reply) ) return;


                // Add a new unit and give it the loot item

                var item = _.find(socket.unit.items, function(i){
                    return i.id === data.itemID;
                });

                if ( _.isUndefined(item) ) {
                    // Not found, so return
                    reply({
                        errmsg:"Item not found in player items!"
                    });
                    return;
                }



                socket.unit.items = _.without(socket.unit.items, item);


                // If it was equipped and type was armor/weapon, update the appearance
                if ( item.equipped ) {
                    if ( dataHandler.items[item.template].type === 'armor' ) {
                        socket.unit.UpdateAppearance(true);

                        // It's possible that armor increases the maximum health
                        socket.unit.CalculateMaxHealth(true);

                        // And obviously, the armor itself
                        socket.unit.CalculateMaxArmor(true);
                    }
                    if ( dataHandler.items[item.template].type == 'weapon'
                        || dataHandler.items[item.template].type == 'tool') {
                        socket.unit.EmitNearby("updateWeapon", {
                            id:socket.unit.id,
                            weapon:0
                        });
                    }
                }
                item.equipped = 0;

                var spawnPos = socket.unit.position.clone().addSelf(socket.unit.heading);

                var bag = new Lootable({
                    id: server.GetAValidNPCID(),
                    x:spawnPos.x,
                    y:spawnPos.y,
                    z:spawnPos.z,
                    zone:socket.unit.zone,

                    // Hacky: refers to lootBag ID
                    template:dataHandler.units[lootBagTemplate],

                    roty:0
                }, false);



                item.owner = bag.id;

                // Add the item to the lootbag
                bag.loot.push(item);


                reply("OK");
            });

            socket.on("lootItem", function (data, reply) {

                if ( !socket.unit ) return;

                if ( _.isUndefined(reply) || !_.isFunction(reply) ) return;

                var bag = worldHandler.FindUnitNear(data.npcID, socket.unit);

                if (!bag ) {
                    reply({
                        errmsg:"Bag not found (too far?)"
                    });
                    return;
                }

                if ( bag.template.type != UnitTypeEnum.LOOTABLE
                    && bag.template.type != UnitTypeEnum.VENDOR
                    ) {

                    reply({
                        errmsg:"Wrong NPC type for loot!"
                    });
                    return;
                }

                // Do the change
                var item = _.find(bag.loot, function(i){
                    return i.id == data.itemID;
                });

                if ( !item ) {
                    reply({
                        errmsg:"Item to buy not found!"
                    });
                    return;
                }

                // If we are a vendor, check if the player as enough money to buy it!
                if ( bag.template.type == UnitTypeEnum.VENDOR ) {
                    if ( item.price > 0 && socket.unit.coins < item.price ) {
                        reply({
                            errmsg:ChooseRandom(["Ye got no money, bum!","Show me some gold coins!","Wher's the gold?"])
                        });
                        return;
                    }
                }

                if ( _.isUndefined(item) ) {
                    // Not found, so return
                    reply({
                        errmsg:"Item not found in bag!"
                    });
                    return;
                }

                var switchItem = null;

                if ( data.switchID > 0 ) {

                    if (bag.template.type == UnitTypeEnum.VENDOR ) {
                        reply({
                            errmsg:"I don't got space over there!"
                        });
                        return;
                    }

                    switchItem = _.find(socket.unit.items, function(i){
                        return i.id == data.switchID;
                    });

                    if ( _.isUndefined(switchItem) ) {
                        // Not found, so return
                        reply({
                            errmsg:"SwitchItem not found in player items!"
                        });
                        return;
                    }

                    // Overwrite the slotNumber anyway, because we don't trust the player
                    data.slotNumber = switchItem.slot;
                }


                if ( !switchItem ) {
                    //  Only a test when we're not switching items, because only then can you give slotNumbers (otherwise it's overwritten)
                    var slotTest = _.find(socket.unit.items, function(i){
                        return i.slot == data.slotNumber;
                    });

                    if ( !_.isUndefined(slotTest) ) {
                        // We found an item :O, that means there is already an item with this slotNumber!
                        reply({
                            errmsg:"Bad slotNumber"
                        });
                        return;
                    }

                    // Check if the slotNumber is within the bag's limits
                    if ( !_.isNumber(data.slotNumber) || data.slotNumber < 0 || data.slotNumber > 9 ) {
                        reply({
                            errmsg:"Invalid slotNumber"
                        });
                        return;
                    }
                }

                // Add the item to the player, and remove it from the bag
                socket.unit.items.push(item);
                bag.loot = _.without(bag.loot, item);


                // Check if the bag is now empty
                // If so, remove it from the world
                if ( bag.template.type == UnitTypeEnum.LOOTABLE ) {
                    if ( bag.loot.length === 0 && !switchItem ) {
                        if ( bag.param < 10 ) {
                            bag.Remove();
                        }
                    }
                    else {
                        // Renew the lifetimer so it doesn't suddenly disappear
                        bag.lifeTime = 0.0;
                    }
                }


                // Set the owner to the player
                item.owner = socket.unit.id;

                var oldSlot = item.slot;
                item.slot = data.slotNumber;

                if ( switchItem ) {
                    //log("switching!");
                    bag.loot.push(switchItem);
                    socket.unit.items = _.without(socket.unit.items, switchItem);

                    // Set the owner to the bag
                    switchItem.owner = bag.id;
                    switchItem.slot = oldSlot;

                    // If it was equipped and type was armor/weapon, update the appearance
                    if ( switchItem.equipped ) {
                        if ( dataHandler.items[switchItem.template].type === 'armor' ) {
                            socket.unit.UpdateAppearance(true);
                        }
                        if ( dataHandler.items[switchItem.template].type === 'weapon'
                            || dataHandler.items[switchItem.template].type === 'tool') {
                            socket.unit.EmitNearby("updateWeapon", {
                                id:socket.unit.id,
                                weapon:0
                            });
                        }
                    }
                    switchItem.equipped = 0;
                }

                // No need to refresh if the bag is not empty anymore, since it'll get deleted anyway on the client
                // They will receive a BAG NOT FOUND error otherwise
                if ( bag.loot.length > 0 ) {
                    socket.unit.EmitNearby("lootFromBag", data.npcID, 20);
                }


                if ( bag.template.type === UnitTypeEnum.VENDOR ) {
                    // Update the money
                    socket.unit.coins -= item.price;

                    bag.Say(ChooseRandom(["Another satisfied customer!","Hope ye kick some butt!","Come again soon!","Is that all ye buyin'?"]));

                    // It's now our property, so remove the price tag
                    delete item.price;

                    reply({
                        newCoins:socket.unit.coins
                        });
                }
                else {
                    reply("OK");
                }

            });

            socket.on("putItem", function (data, reply) {

                if ( !socket.unit ) return;

                if ( _.isUndefined(reply) || !_.isFunction(reply) ) return;

                var bag = worldHandler.FindUnitNear(data.npcID, socket.unit);

                data.acceptOffer = ISDEF(data.acceptOffer) ? true : false;


                if (!bag ) {
                    reply({
                        errmsg:"Bag not found (too far?)"
                    });
                    return;
                }

                if ( bag.template.type != UnitTypeEnum.LOOTABLE
                    && bag.template.type != UnitTypeEnum.VENDOR
                    ) {
                    reply({
                        errmsg:"Wrong NPC type for loot!"
                    });
                    return;
                }

                // Do the change
                var item = _.find(socket.unit.items, function(i){
                    return i.id == data.itemID;
                });

                if ( _.isUndefined(item) ) {
                    // Not found, so return
                    reply({
                        errmsg:"Item not found in player items!"
                    });
                    return;
                }

                // Check if the target slot is available
                var slotTest = _.find(bag.loot, function(i){
                    return i.slot == data.slotNumber;
                });

                if ( !_.isUndefined(slotTest) ) {
                    // We found an item :O, that means there is already an item with this slotNumber!
                    reply({
                        errmsg:"slotNumber is already taken"
                    });
                    return;
                }

                // Check if the slotNumber is within the bag's limits
                if ( !_.isNumber(data.slotNumber) || data.slotNumber < 0 || data.slotNumber > 9 ) {
                    reply({
                        errmsg:"Invalid slotNumber"
                    });
                    return;
                }

                if ( bag.template.type == UnitTypeEnum.VENDOR ) {

                    var offeredPrice = (CalculateItemPrice(item) / 2).Round();
                    offeredPrice = Math.max(offeredPrice, 0);

                    if ( !data.acceptOffer ) {

                        if ( offeredPrice > 0 ) {
                            reply({
                                offeredPrice:offeredPrice
                            });
                            return;
                        }
                        else {
                            reply({
                                errmsg:ChooseRandom(["Take yer stuff with ye!","Haven't ye got better items?","Me thinks that is not worth the trouble!"])
                            });
                            return;
                        }
                        return;
                    }
                    else {

                        // Put the price tag back (x2 :P)
                        item.price = offeredPrice * 2;

                        // Give the player the original price
                        socket.unit.coins += offeredPrice;

                        bag.Say(ChooseRandom(["A pleasure doing business!","Ye got a good deal!","'Tis most splendid!"]));

                    }
                }


                if ( bag.template.type == UnitTypeEnum.LOOTABLE ) {
                    // Renew the lifetimer so it doesn't suddenly disappear
                    bag.lifeTime = 0.0;
                }

                // Add the item to the player, and remove it from the bag
                bag.loot.push(item);
                socket.unit.items = _.without(socket.unit.items, item);

                // Set the owner to the player
                item.owner = bag.id;

                item.slot = data.slotNumber;

                // If it was equipped and type was armor/weapon, update the appearance
                if ( item.equipped ) {
                    if ( dataHandler.items[item.template].type == 'armor' ) {
                        socket.unit.UpdateAppearance(true);
                    }
                    if ( dataHandler.items[item.template].type == 'weapon' ||
                        dataHandler.items[item.template].type == 'tool') {
                        socket.unit.EmitNearby("updateWeapon", {
                            id:socket.unit.id,
                            weapon:0
                        });
                    }
                }
                item.equipped = 0;

                socket.unit.EmitNearby("lootFromBag", data.npcID, 20);


                if ( data.acceptOffer ) {
                    reply({
                        newCoins:socket.unit.coins
                        });
                }
                else {
                    reply("OK");
                }


            });

            // swapping items, which also will handle combining/stacking
            socket.on("switchItem", function(data, reply) {
                if (_.isUndefined(reply) || !_.isFunction(reply)) {
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

                // switching within our own inventory
                if (_.isUndefined(data.npcID)) {
                    // Make sure we have the item we want to switch
                    var item = _.find(socket.unit.items, function(i) {
                        return i.id === data.itemID;
                    });

                    if (_.isUndefined(item)) {
                        // Not found, so return
                        reply({
                            errmsg: "Item not found in player items!"
                        });
                        return;
                    }

                    var switchItem = _.find(socket.unit.items, function(i) {
                        return i.slot == data.slotNumber;
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

                } else {

                    var bag = worldHandler.FindUnitNear(data.npcID, socket.unit);

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
                        return i.id == data.itemID;
                    });

                    if (_.isUndefined(item)) {
                        // Not found, so return
                        reply({
                            errmsg: "Item not found in loot bag!"
                        });
                        return;
                    }

                    if (bag.template.type == UnitTypeEnum.LOOTABLE) {
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

                    socket.unit.EmitNearby("lootFromBag", data.npcID, 20);
                }

                reply("OK");
            });

            socket.on("loot", function (npcID, reply) {

                if ( !socket.unit ) return;

                if ( _.isUndefined(reply) || !_.isFunction(reply) ) return;

                // todo: check if NPC is nearby


                var bag = worldHandler.FindUnitNear(npcID, socket.unit);

                if (!bag ) {
                    reply({
                        errmsg:"Bag not found (too far?)"
                    });
                    return;
                }
                else if ( bag.template.type != UnitTypeEnum.LOOTABLE
                    && bag.template.type != UnitTypeEnum.VENDOR
                    ) {
                    reply({
                        errmsg:"Wrong NPC type for loot!"
                    });
                    return;
                }
                else {
                    reply(bag.loot);
                }


                if ( bag.template.type == UnitTypeEnum.LOOTABLE ) {
                    // Renew the lifetimer so it doesn't suddenly disappear
                    bag.lifeTime = 0.0;
                }


                switch(bag.template.type) {
                    case UnitTypeEnum.LOOTABLE:
                    case UnitTypeEnum.VENDOR:
                        reply(bag.loot);
                        break;
                    default:
                        reply({
                            errmsg:"Wrong NPC type for loot!"
                        });
                        break;
                }


            });


            socket.on("hit", function (data, reply) {

                if ( !socket.unit ) return;

                if ( _.isUndefined(reply) || !_.isFunction(reply) ) return;


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

                    var targetUnit = worldHandler.FindUnitNear(id, socket.unit);

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

            socket.on("ghit", function (data, reply) {

                if ( !socket.unit ) return;

                if ( _.isUndefined(reply) || !_.isFunction(reply) ) return;


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

                var owner = worldHandler.FindUnitNear(data.o, socket.unit);
                if ( !owner || !(owner instanceof NPC) ) {
                    reply({
                        errmsg:"Bad unit type for ghit"
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
                        errmsg:"No weapon found for ghit!"
                    });
                    return;
                }

                // Silent return...
                if ( socket.unit.health <= 0 ) {
                    return;
                }

                owner.Attack(socket.unit, weapon);

            });

            socket.on("getStartData", function (data, reply) {

                if ( _.isUndefined(reply) || !_.isFunction(reply) ) return;

                var response = {
                    "numberOfPlayersOnline" : io.sockets.clients().length
                };

                reply(response);
            });

            socket.on("shutdown", function (value) {
                if ( !socket.unit || socket.unit.editor === false ) return;

                log("Shutting down by user request ("+socket.unit.id+")");

                chatHandler.Announce("Server will restart in 5 seconds...", "red");

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

            socket.on("opReloadData", function (data) {
                if ( !socket.unit || socket.unit.editor === false ) return;

                dataHandler.Load();

                setTimeout(function(){
                    chatHandler.Announce("Reloaded NPC & Item templates", "white");
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

                // Check that the user exists
                var foundUnit = null;
                worldHandler.LoopUnits(function(unit) {
                    if ( unit instanceof Player && unit.name === data.characterName ) {
                        foundUnit = unit;
                    }
                });

                if ( !foundUnit ) {
                    reply({
                        errmsg:"Player '"+data.characterName+"' not found!"
                    });
                    return;
                }



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

            socket.on("teleport", function (data, reply) {
                if ( !socket.unit || socket.unit.editor === false ) return;
                if ( _.isUndefined(reply) || !_.isFunction(reply) ) return;

                if ( !CheckData(data, ["pos", "zone", "name", "targetName"]) ) {
                    reply({
                        errmsg:"Corrupt teleport data"
                    });
                    return;
                }


                var unit = worldHandler.FindPlayerByName(data.name);

                var targetUnit = worldHandler.FindPlayerByName(data.targetName);

                var zone = parseInt(data.zone, 10);
                var pos = targetUnit ? targetUnit.position : ConvertVector3(data.pos);


                if ( unit ) {
                    unit.Teleport(zone, pos);
                }
                else {
                    chatHandler.AnnouncePersonally(socket.unit, "Could not find player "+data.name+"!", "red");
                }

            });

            socket.on("deleteNPC", function (id) {

                // Later report them!
                if ( !socket.unit || socket.unit.editor === false ) return;

                var unit = worldHandler.FindUnit(id);

                var zone = socket.unit.zone;

                // We only need an ID
                if ( !unit ) {
                    log("Unit not found for deleteNPC: "+id);
                    return;
                }

                var cx = unit.cellX;
                var cz = unit.cellZ;

                worldHandler.world[zone][cx][cz].units =
                    _.without(worldHandler.world[zone][cx][cz].units, unit);

                worldHandler.LoopUnitsNear(zone, cx, cz, function(unit) {
                    unit.UpdateOtherUnitsList();
                });

                mysql.query('DELETE FROM ib_units WHERE ?',
                {
                    id:-id
                },
                function (err, result) {
                    if ( err ) throw(err);
                });


            });

            socket.on("generateCell", function (data, reply) {
                if ( !socket.unit || socket.unit.editor === false ) return;

                // debugger;

                var cellPos = WorldToCellCoordinates(data.pos.x, data.pos.z, cellSize);

                socket.unit.UpdateCellPosition();


                worldHandler.GenerateCell( socket.unit.zone, cellPos.x, cellPos.z, parseInt(data.octaves, 10), parseInt(data.persistence, 10), parseFloat(data.scale), parseInt(data.tile, 10), parseInt(data.heightOffset, 10));

                reply("OK");

            });

            socket.on("addNPC", function (data) {

                // Later report them!
                if ( !socket.unit || socket.unit.editor === false ) return;

                data.position = ConvertVector3(data.position);
                data.position = data.position.Round(2);

                var zone = socket.unit.zone;

                var cellPos = WorldToCellCoordinates(data.position.x, data.position.z, cellSize);


                if ( !ISDEF(worldHandler.world[zone]) ) return;
                if ( !ISDEF(worldHandler.world[zone][cellPos.x]) ) return;
                if ( !ISDEF(worldHandler.world[zone][cellPos.x][cellPos.z]) ) return;


                data.x = data.position.x;
                data.y = data.position.y;
                data.z = data.position.z;
                data.zone = zone;



                if ( !ISDEF(data.param) ) data.param = 0;


                data.param = parseInt(data.param, 10);


                if ( !ISDEF(data.data) ) {
                    data.data = null;
                }


                data.id = -server.GetAValidNPCID();

                mysql.query('INSERT INTO ib_units SET ?',
                {
                    id:data.id,
                    zone:data.zone,
                    x:data.x,
                    y:data.y,
                    z:data.z,
                    template:data.template,
                    roty:data.roty,
                    param:data.param,
                    data:JSON.stringify(data.data)
                },
                function (err, result) {

                    if (err) throw err;

                    var unit = worldHandler.MakeUnitFromData(data);
                    if ( unit ) unit.Awake();

                });

            });

            socket.on("paintModel", function (data) {

                //data.pos, data.metadata;



                // Later report them!
                if ( !socket.unit || socket.unit.editor === false ) return;



                var pos = ConvertVector3(data.pos);
                pos = pos.Round(2);

                var zone = socket.unit.zone;

                var cellPos = WorldToCellCoordinates(pos.x, pos.z, cellSize);


                if ( !ISDEF(worldHandler.world[zone]) ) return;
                if ( !ISDEF(worldHandler.world[zone][cellPos.x]) ) return;
                if ( !ISDEF(worldHandler.world[zone][cellPos.x][cellPos.z]) ) return;

                if ( !ISDEF(worldHandler.world[zone][cellPos.x][cellPos.z].changeBuffer) ) {
                    worldHandler.world[zone][cellPos.x][cellPos.z].changeBuffer = [];
                }


                pushData = JSON.parse(JSON.stringify(data));

                if ( data.global ) {
                    pushData.metadata = {};
                }

                worldHandler.world[zone][cellPos.x][cellPos.z].changeBuffer.push(pushData);



                // Parse to make sure the reference doesn't get updated afterwards
                // (no more tiles/... saved)
                // data = JSON.parse(JSON.stringify(data));

                // Set a timer to auto save this cell
                // If we set the height again, reset the timer
                worldHandler.AutoSaveCell(zone, cellPos.x, cellPos.z);

                if ( data.global ) {
                    _.each(data.metadata, function(value, key, list) {
                        mysql.query('UPDATE ib_meshes SET '+key+' = ? WHERE id = ?', ["tiles/"+value,data.id]);

                        data.metadata[key] = "tiles/"+value;
                    });
                }



                socket.unit.EmitNearby("paintModel", data, 0, true);

            });

            socket.on("deleteModel", function (data) {

                // Later report them!
                if ( !socket.unit || socket.unit.editor === false ) return;



                data = ConvertVector3(data);
                data = data.Round(2);


                var zone = socket.unit.zone;

                var cellPos = WorldToCellCoordinates(data.x, data.z, cellSize);


                if ( !ISDEF(worldHandler.world[zone]) ) return;
                if ( !ISDEF(worldHandler.world[zone][cellPos.x]) ) return;
                if ( !ISDEF(worldHandler.world[zone][cellPos.x][cellPos.z]) ) return;


                var foundOnBuffer = false;
                for(var o=0;o<worldHandler.world[zone][cellPos.x][cellPos.z].objects.length;o++) {
                    var obj = worldHandler.world[zone][cellPos.x][cellPos.z].objects[o];

                    obj = ConvertVector3(obj);
                    obj = obj.Round(2);

                    if ( data.x === obj.x && data.y === obj.y && data.z === obj.z ) {
                        // Found it on the buffer, so we added something and deleted it back before the save
                        // Just delete it from the buffer, don't add to the deleteBuffer
                        foundOnBuffer = true;
                        worldHandler.world[zone][cellPos.x][cellPos.z].objects.splice(o, 1);
                        break;
                    }
                }

                if ( !foundOnBuffer ) {
                    if ( !ISDEF(worldHandler.world[zone][cellPos.x][cellPos.z].deleteBuffer) ) {
                        worldHandler.world[zone][cellPos.x][cellPos.z].deleteBuffer = [];
                    }
                    worldHandler.world[zone][cellPos.x][cellPos.z].deleteBuffer.push(data);
                }


                // Set a timer to auto save this cell
                // If we set the height again, reset the timer
                worldHandler.AutoSaveCell(zone, cellPos.x, cellPos.z);


                socket.unit.EmitNearby("deleteModel", data, 0, true);

            });

            socket.on("addModel", function (data) {

                // Later report them!
                if ( !socket.unit || socket.unit.editor === false ) return;

                data.position = ConvertVector3(data.position);
                data.position = data.position.Round(2);

                var zone = socket.unit.zone;

                var cellPos = WorldToCellCoordinates(data.position.x, data.position.z, cellSize);

                if ( !worldHandler.CheckWorldStructure(zone, cellPos.x, cellPos.z) ) {
                    worldHandler.GenerateCell(zone, cellPos.x, cellPos.z);
                }

                if ( !ISDEF(worldHandler.world[zone]) ) return;
                if ( !ISDEF(worldHandler.world[zone][cellPos.x]) ) return;
                if ( !ISDEF(worldHandler.world[zone][cellPos.x][cellPos.z]) ) return;

                // Just add the object, and save it. Clients should automatically add it
                worldHandler.world[zone][cellPos.x][cellPos.z].objects.push({
                    x:data.position.x,
                    y:data.position.y,
                    z:data.position.z,
                    t:data.type,
                    p:data.param,
                    rX:data.rX,
                    rY:data.rY,
                    rZ:data.rZ
                });

                // Set a timer to auto save this cell
                // If we set the height again, reset the timer
                worldHandler.AutoSaveCell(zone, cellPos.x, cellPos.z);

                socket.unit.EmitNearby("addModel", data, 0, true);
            });

            socket.on("ppAddNode", function (position, reply) {

                if ( !socket.unit || socket.unit.editor === false ) return;

                position = ConvertVector3(position).Round(2);

                var zone = socket.unit.zone;

                // Check if there is a node at this position
                var existingNode = false;
                _.each(worldHandler.world[zone], function(cx) {
                    _.each(cx, function(cz) {
                        if ( cz.graph === undefined ) return;
                        if ( cz.graph.nodes === undefined ) return;
                        _.each(cz.graph.nodes, function(node) {
                            if ( VectorDistanceSq(ConvertVector3(node.pos), position) < 1 ) {
                                existingNode = true;
                            }
                        });
                    });
                });

                if ( existingNode ) return;


                var newNodeID = worldHandler.GetWaypointID(zone);

                nodeHandler.AddNode(zone, newNodeID, position);

                var cellPos = WorldToCellCoordinates(position.x, position.z, cellSize);
                worldHandler.AutoSaveCell(zone, cellPos.x, cellPos.z);

                socket.unit.EmitNearby("ppAddNode", {
                    id: newNodeID,
                    pos: position
                }, 0, true);

                reply({
                    newNodeID:newNodeID
                });
            });

            socket.on("ppAddEdge", function (data, reply) {

                // Later report them!
                if ( !socket.unit || socket.unit.editor === false ) return;

                if ( !CheckData(data, ["from","to","twoway"]) ) {
                    reply({
                        errmsg:"Corrupt AddEdge data"
                    });
                    return;
                }

                var zone = socket.unit.zone;

                nodeHandler.AddEdge(zone, data.from, data.to, data.twoway);

                var position = nodeHandler.GetNodePosition(zone, data.from);

                var cellPos = WorldToCellCoordinates(position.x, position.z, cellSize);
                worldHandler.AutoSaveCell(zone, cellPos.x, cellPos.z);

                socket.unit.EmitNearby("ppAddEdge", data, 0, true);

            });


            socket.on("ppDeleteNode", function (data, reply) {

                // Later report them!
                if ( !socket.unit || socket.unit.editor === false ) return;

                if ( !CheckData(data, ["id"]) ) {
                    reply({
                        errmsg:"Corrupt node data"
                    });
                    return;
                }

                var zone = socket.unit.zone;

                // Check if the node is there
                var nodeInfo = nodeHandler.GetNodeArrayIndex(zone, data.id);
                if ( !nodeInfo ) return;

                var position = nodeHandler.GetNodePosition(zone, data.id);

                var cellPos = WorldToCellCoordinates(position.x, position.z, cellSize);
                worldHandler.AutoSaveCell(zone, cellPos.x, cellPos.z);


                nodeHandler.DeleteNode(zone, data.id);





                socket.unit.EmitNearby("ppDeleteNode", data, 0, true);
            });

            socket.on("addGameObject", function (data) {

                // Later report them!
                if ( !socket.unit || socket.unit.editor === false ) return;

                data.position = ConvertVector3(data.position);
                data.position = data.position.Round(2);

                var zone = socket.unit.zone;

                var cellPos = WorldToCellCoordinates(data.position.x, data.position.z, cellSize);


                if ( !ISDEF(worldHandler.world[zone]) ) return;
                if ( !ISDEF(worldHandler.world[zone][cellPos.x]) ) return;
                if ( !ISDEF(worldHandler.world[zone][cellPos.x][cellPos.z]) ) return;

                // Just add the object, and save it. Clients should automatically add it
                worldHandler.world[zone][cellPos.x][cellPos.z].objects.push({
                    x:data.position.x,
                    y:data.position.y,
                    z:data.position.z,
                    t:data.type,
                    p:data.param
                });

                worldHandler.AutoSaveCell(zone, cellPos.x, cellPos.z);

            });

            socket.on("disconnect", function (data) {


                if ( socket.unit ) {
                    log(socket.unit.name+" disconnected.");
                    socket.unit.LeaveGame();

                }

            });

            socket.on("playerdata", function (data) {

                if ( socket.unit ) {

                    if ( !CheckData(data, ["p","r","los"]) ) {
                        return;
                    }

                    if ( !CheckVector(data.p) ) return;

                    if ( !_.isNumber(data.r) ) return;

                    if ( !_.isArray(data.los) ) return;

                    for(var x=0;x<data.los.length;x++) {
                        if ( !_.isNumber(data.los[x]) ) return;
                    }


                    var p = ConvertVector3(data.p);

                    var radians = (socket.unit.rotation.y + 90) * (Math.PI/180);

                    socket.unit.heading.x = Math.sin(radians);
                    socket.unit.heading.y = 0;
                    socket.unit.heading.z = Math.cos(radians);
                    socket.unit.heading.normalize();

                    if ( !_.isArray(data.los) ) {
                        socket.unit.Kick(KickReason.CHEAT);
                        return;
                    }

                    for(var u=0;u<data.los.length;u++) {
                        var n = data.los[u];
                        if ( !_.isNumber(n) || n >= 0 ) {
                            socket.unit.Kick(KickReason.CHEAT);
                            return;
                        }
                    }

                    socket.unit.unitsInLineOfSight = data.los;

                    socket.unit.side = socket.unit.heading.clone().Perp();


                    socket.unit.rotation.y = parseInt(data.r, 10);

                    if ( ISDEF(data.u) ) {
                        socket.unit.localPosition.copy(p);
                        socket.unit.standingOnUnitId = data.u;


                        // Find the unit, and get their position
                        // THIS will be our real position, otherwise we will give them false
                        // information, like who is around us
                        var train = worldHandler.FindUnit(data.u);

                        socket.unit.position.copy(train.position);

                    }
                    else {
                        socket.unit.position.copy(p);
                        socket.unit.standingOnUnitId = 0;
                    }

                    // Calculate cell X and Z, and check if they differ
                    // If they do, remove us from that cell's unitList and add ourselves to the new cell's Unitlist
                    // In addition, recalculate the unitlist for some units
                    // Which ones?
                    var cellPos = WorldToCellCoordinates(socket.unit.position.x, socket.unit.position.z, cellSize);
                    if ( cellPos.x !== socket.unit.cellX || cellPos.z !== socket.unit.cellZ ) {
                        socket.unit.ChangeCell(cellPos.x, cellPos.z);
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

        return ISDEF(socket.unit);

    }
});

var socketHandler = new SocketHandler();
