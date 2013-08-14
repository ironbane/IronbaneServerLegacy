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

function TeleportElement(id, to) {
    //Get
    var p = $("#" + to);
    var offset = p.offset();

    //set
    $("#" + id).offset({
        top: offset.top,
        left: offset.left
    });
}

var props = ['skin', 'eyes', 'hair', 'feet', 'body', 'head', 'big'];


var selectedMale = true;
var selectedSkin = 1;
var selectedEyes = 1;
var selectedHair = 1;


var messageFadeTime = 0.2;

var BigMessage = Class.extend({
    Init: function(message, duration) {
        this.message = message;
        this.duration = duration;
        this.timeLeft = duration;
        this.opacity = 1;
    },
    Tick: function(dTime) {
        this.timeLeft -= dTime;

        var opac = 0;

        if (this.timeLeft > this.duration - messageFadeTime) {
            //      4.7 - 4.5 = 0.2
            opac = 1 - ((this.timeLeft - (this.duration - messageFadeTime)) / messageFadeTime);
        } else if (this.timeLeft < messageFadeTime) {
            opac = this.timeLeft / messageFadeTime;
        } else {
            opac = 1;
        }

        this.opacity = opac;
    }
});

var HUDHandler = Class.extend({
    bigMessages: [],
    alertBoxActive: false,
    Init: function() {
        this.allowSound = !_.isUndefined(localStorage.allowSound) ? (localStorage.allowSound === 'true') : true;

        if (Detector.webgl) {
            if (socketHandler.serverOnline) {
                $('#loginContent').show();
            } else {
                setTimeout(function() {
                    hudHandler.MessageAlert('The server is currently offline. Please try again later.', 'nobutton');
                }, 1000);
            }
        } else {
            ironbane.showingGame = true;
            $('#noWebGL').show();

            $('#hquote').html('<h2>' + hquote + '</h2>');
            // Add a solution
            if (startdata.using_ie) {
                $('#webglsolution').html('You seem to be using <b>Internet Explorer</b>.<br>Don\'t worry, there is a solution for you!<div class="spacer"></div><button id="getiewebgl" class="ibutton" style="width:304px">Get IEWebGL</button>');

                $('#getiewebgl').click(function() {
                    window.open('http://iewebgl.com/', 'iewebgl');
                    //window.open('http://www.khronos.org/webgl/wiki_1_15/index.php/Getting_a_WebGL_Implementation','bs')
                });
            } else if (startdata.using_safari) {

                var sol = '';

                sol += 'In Safari, open the <b>Safari menu</b> and select <b>Preferences</b>.<br><br>';
                sol += 'Then, click the <b>Advanced</b> tab in the Preferences window.<br><br>';
                sol += 'Then, at the bottom of the window, check the <b>Show Develop menu in menu bar</b> checkbox.<br><br>';
                sol += 'Then, open the <b>Develop</b> menu in the menu bar and select <b>Enable WebGL</b>.';

                $('#webglsolution').html('You seem to be using <b>Safari</b>.<br>Don\'t worry, there is a solution for you!<div class="spacersmall"></div><div class="insideInfo" style="width:280px;">' + sol + '</div>');

                $('#getiewebgl').click(function() {
                    window.open('http://iewebgl.com/', 'iewebgl');
                    //window.open('http://www.khronos.org/webgl/wiki_1_15/index.php/Getting_a_WebGL_Implementation','bs')
                });
            } else {
                $('#webglsolution').html('<h2>What you can do</h2><div class="spacersmall"></div>Please make sure your <b>browser is up-to-date</b>.<br>Also check if you have the <b>latest video card drivers</b> installed.<div class="spacersmall"></div><button id="moreinfowebgl" class="ibutton" style="width:304px">More information</button>');

                $('#moreinfowebgl').click(function() {
                    //window.open('http://iewebgl.com/','iewebgl');
                    window.open('http://www.khronos.org/webgl/wiki_1_15/index.php/Getting_a_WebGL_Implementation', 'bs');
                });
            }

            $('#webglsolution').append('<div class="spacersmall"></div>If you think this error is false or you are sure your system is able to run WebGL, please contact <a href="mailto:support@ironbane.com">support@ironbane.com</a> with your computer and browser specifications.');
        }

        this.oldButtonClasses = {};

        setTimeout(function() {
            hudHandler.MakeSlotSpace(false);
            hudHandler.MakeSlotSpace(true);

            $('#gameFrame').droppable({
                drop: hudHandler.ItemSwitchEvent
            });

            hudHandler.ShowMainMenuHUD();
        }, 0);

        var clickAction = function() {
            soundHandler.Play("click");
        };

        var handleClick = function(noSound) {
            $("button").unbind('click.sound');

            if (!noSound) {
                clickAction();
            }

            setTimeout(function() {
                $("button").bind('click.sound', function() {
                    handleClick();
                });
            }, 50);
        };

        setTimeout(function() {
            handleClick(true);
        }, 1000);
    },
    MakeSoundButton: function() {
        var checkSoundToggle = function(value) {

            // We can only change the toggle in the main menu, so always stop/play
            // the theme music
            hudHandler.allowSound = value;

            if (value) {
                $("#btnToggleSound").html("&#9834;");
                $("#btnToggleSound").css("color", "");

                soundHandler.Play("music/maintheme");
            } else {
                $("#btnToggleSound").html("<del>&#9834;</del>");
                $("#btnToggleSound").css("color", "red");

                soundHandler.StopAll();
            }

            localStorage.allowSound = value;
        };
        checkSoundToggle(hudHandler.allowSound);
        $("#btnToggleSound").unbind('click');
        $("#btnToggleSound").click(function() {
            checkSoundToggle(!hudHandler.allowSound);
        });
    },
    ShowMainMenuHUD: function() {
        $("#versionNumber, #devNews, #logo, #loadingBar").show();
    },
    MakeSlotSpace: function(isLoot) {
        var HUD = this;
        var div = isLoot ? '#lootBag' : '#itemBar';
        var spaces = isLoot ? 10 : 10;

        $(div).empty();

        for (var x = 0; x < spaces; x++) {
            var name = isLoot ? 'ls' + x : 'is' + x;

            $('#' + name).remove();

            var classname = isLoot ? 'lootBarSlot' : 'itemBarSlot';
            $(div).append('<div id="' + name + '" class="' + classname + '"></div>');
            var n = x + 1;
            if (n === 10) {
                n = 0;
            }
            //n = 9;
            if (!isLoot) {
                $('#' + name).append('<div id="' + name + '_equip" class="unequipped"></div>');
                $('#' + name).append('<div style="width:48px;height:48px;background-image:url(plugins/game/images/misc/key_' + n + '.png);position:absolute"></div>');
            }
            //if ( !isLoot ) $("#"+name).append('<div style="margin-top:18px;margin-left:5px;width:40px;height:40px;color:white;font-size:10px">'+n+'</div>');
            $('#' + name).droppable({
                drop: HUD.ItemSwitchEvent,
                greedy: true
            });
        }
    },
    UpdateEquippedItems: function() {
        for (var x = 0; x < 10; x++) {
            var item = hudHandler.FindItemBySlot(x, false);
            if (item) {
                var template = items[item.template];
                if (item.equipped) {
                    if (template.type === "consumable") {
                        this.SetUsed(x);
                    } else {
                        this.SetEquipped(x);
                    }
                } else {
                    this.SetUnequipped(x);
                }
            } else {
                this.SetUnoccupied(x);
            }
        }
    },
    SetEquipped: function(slot) {
        var name = 'is' + slot;
        $('#' + name + '_equip').attr('class', 'equipped');
    },
    SetUsed: function(slot) {
        var name = 'is' + slot;
        $('#' + name + '_equip').attr('class', 'used');
    },
    SetUnequipped: function(slot) {
        var name = 'is' + slot;
        $('#' + name + '_equip').attr('class', 'unequipped');
    },
    SetUnoccupied: function(slot) {
        var name = 'is' + slot;
        $('#' + name + '_equip').attr('class', 'unoccupied');
    },
    ItemSwitchEvent: function(event, ui) {
        var draggable = ui.draggable;

        // Are we dragging an inventory item?
        var itemID = draggable.attr('id');
        var itemPrefix = itemID.substr(0, 2);
        var itemNumber = parseInt(itemID.substr(2), 10);
        var slotID = $(this).attr('id');
        var slotPrefix = slotID.substr(0, 2);
        var slotNumber = parseInt(slotID.substr(2), 10);
        var startItem, switchItem;

        if (hudHandler.alertBoxActive) {
            startItem = hudHandler.FindItemByID(itemNumber, false);
            TeleportElement(itemID, 'is' + startItem.slot);
            return;
        }

        if (itemPrefix === 'ii') {
            startItem = hudHandler.FindItemByID(itemNumber, false);
            if (slotPrefix === 'is') {
                // Inventory to inventory
                // First check if the target slot is taken, and switch it first
                hudHandler.SwitchItem(slotNumber, startItem, itemID, slotID, false);
            } else if (slotPrefix === 'ls') {
                // Inventory to loot
                switchItem = hudHandler.FindItemBySlot(slotNumber, true);
                if (switchItem) {
                    TeleportElement(itemID, 'is' + startItem.slot);
                    hudHandler.LootItem(startItem, switchItem, startItem.slot, 'is' + startItem.slot);
                } else {
                    hudHandler.PutItem(startItem, slotNumber, slotID);
                }
            } else if (!ironbane.player.canLoot && slotID === 'gameFrame') {
                // Send a request
                hudHandler.DropItem(startItem, itemID, itemNumber);
            } else {
                // Revert
                TeleportElement(itemID, 'is' + startItem.slot);
            }
        } else if (itemPrefix === 'li') {
            startItem = hudHandler.FindItemByID(itemNumber, true);

            if (slotPrefix === 'ls') {
                // loot to loot
                // First check if the target slot is taken, and switch it first

                hudHandler.SwitchItem(slotNumber, startItem, itemID, slotID, true);
            } else if (slotPrefix === 'is') {
                // Loot to inventory
                // Delete the item from the loot array, and add it to the player items
                // If there is an item present at the slot, switch it

                switchItem = hudHandler.FindItemBySlot(slotNumber, false);

                hudHandler.LootItem(switchItem, startItem, slotNumber, slotID);
            } else {
                // Revert
                TeleportElement(itemID, 'ls' + startItem.slot);
            }
        }
    },
    PutItem: function(startItem, slotNumber, slotID, acceptOffer) {
        // We put something from the inventory to the loot
        var data = {
            "npcID": ironbane.player.lootUnit.id,
            "slotNumber": slotNumber,
            "itemID": startItem.id
        };

        if (!_.isUndefined(acceptOffer)) {
            data.acceptOffer = true;
        }
        socketHandler.socket.emit('putItem', data, function(reply) {
            //console.log('putItem reply', reply);
            if (!_.isUndefined(reply.errmsg)) {
                hudHandler.MessageAlert(reply.errmsg);
                // Teleport back!
                TeleportElement('ii' + startItem.id, 'is' + startItem.slot);
                //if ( switchItem ) TeleportElement('li'+switchItem.id, 'ls'+switchItem.slot);
                return;
            }

            if (!_.isUndefined(reply.offeredPrice)) {

                var goldPieces = hudHandler.GetStatContent(1, 'misc/coin_medium', 1, true, true);

                var doReturn = false;

                hudHandler.MessageAlert('I\'d offer <span style="color:rgb(255, 215, 0)">' + reply.offeredPrice + ' x ' + goldPieces + '</span> for yer ' + items[startItem.template].name + '. What do ye think?', 'question', function() {
                    hudHandler.PutItem(startItem, slotNumber, slotID, true);
                }, function() { // Teleport back!
                    TeleportElement('ii' + startItem.id, 'is' + startItem.slot);
                    ironbane.unitList.push(new ChatBubble(ironbane.player.lootUnit, "Then take yer stuff with ye!"));
                });


                return;
            }

            // because money bags may have been adjusted, entire inventory is sync'd up
            if (_.isArray(reply.items)) {
                socketHandler.playerData.items = reply.items;
                hudHandler.ReloadInventory();
                hudHandler.MakeCoinBar(true);

                // Remove the loot bag
                $('#lootBag').hide();

                // Todo: remove the items via UI
                for (var i = 0; i < ironbane.player.lootItems.length; i++) {
                    var lootItem = ironbane.player.lootItems[i];

                    $('#li' + lootItem.id).remove();

                    if (currentHoverDiv === 'li' + lootItem.id) {
                        $('#tooltip').hide();
                    }
                }

                ironbane.player.lootItems = [];
                ironbane.player.canLoot = false;
                ironbane.player.lootUnit = null;
            }

            // Delete from playerData
            socketHandler.playerData.items = _.without(socketHandler.playerData.items, startItem);
            ironbane.player.lootItems.push(startItem);

            // If it was armor, update our appearance
            if (startItem.equipped) {
                if (items[startItem.template].type === 'armor') {
                    ironbane.player.UpdateAppearance();
                }
                if (items[startItem.template].type === 'weapon') {
                    ironbane.player.UpdateWeapon(0);
                }
            }

            startItem.equipped = 0;

            startItem.slot = slotNumber;

            // Adjust the DOM element's name from ii to li
            $('#ii' + startItem.id).attr('id', 'li' + startItem.id);

            // Do the UI actions
            TeleportElement('li' + startItem.id, slotID);

            hudHandler.UpdateEquippedItems();

            soundHandler.Play(ChooseRandom(["bag1"]));

        });
    },
    DropItem: function(startItem, itemID, itemNumber) {
        socketHandler.socket.emit('dropItem', {
            'itemID': itemNumber
        }, function(reply) {

            if (!_.isUndefined(reply.errmsg)) {
                hudHandler.MessageAlert(reply.errmsg);

                // Teleport back!
                TeleportElement('li' + startItem.id, 'ls' + startItem.slot);

                return;
            }

            // Hide the tooltip
            $('#tooltip').hide();

            // If it was armor, update our appearance
            if (startItem.equipped) {
                if (items[startItem.template].type === 'armor') {
                    ironbane.player.UpdateAppearance();
                }
                if (items[startItem.template].type === 'weapon' ||
                    items[startItem.template].type === 'tool') {
                    ironbane.player.UpdateWeapon(0);
                }
            }
            else {
                if(items[startItem.template].type === 'cash') {
                    hudHandler.MakeCoinBar(true);
                }
            }

            if ( reply.items ) {
                socketHandler.playerData.items = reply.items;
            }

            hudHandler.ReloadInventory();
            hudHandler.UpdateEquippedItems();

        });
    },
    SwitchItem: function(slotNumber, startItem, itemID, slotID, inLoot) {
        var data = {
            'slotNumber': slotNumber,
            'itemID': startItem.id
        };

        if (inLoot) {
            data.npcID = ironbane.player.lootUnit.id;
        }

        socketHandler.socket.emit('switchItem', data, function(reply) {
            //console.log('switchItem reply', reply);
            if (reply.errmsg) {
                hudHandler.MessageAlert(reply.errmsg);

                // Teleport back!
                if (inLoot) {
                    TeleportElement('li' + startItem.id, 'ls' + startItem.slot);
                } else {
                    TeleportElement('ii' + startItem.id, 'is' + startItem.slot);
                }

                return;
            }

            if ( reply.items ) {
                socketHandler.playerData.items = reply.items;
            }

            if ( reply.loot ) {
                ironbane.player.lootItems = reply.loot;
            }

            hudHandler.ReloadInventory();
            hudHandler.MakeCoinBar(true);
            hudHandler.UpdateEquippedItems();

        });
    },
    LootItem: function(switchItem, startItem, slotNumber, slotID) {
        var data = {
            'npcID': ironbane.player.lootUnit.id,
            'switchID': switchItem ? switchItem.id : 0,
            'slotNumber': slotNumber,
            'itemID': startItem.id
        };

        socketHandler.socket.emit('lootItem', data, function(reply) {
            if (!_.isUndefined(reply.errmsg)) {
                hudHandler.MessageAlert(reply.errmsg);

                // Teleport back!
                TeleportElement('li' + startItem.id, 'ls' + startItem.slot);
                return;
            }

            if ( reply.items ) {
                socketHandler.playerData.items = reply.items;
            }

            if ( reply.loot ) {
                ironbane.player.lootItems = reply.loot;
            }

            hudHandler.ReloadInventory();
            hudHandler.MakeCoinBar(true);
            hudHandler.UpdateEquippedItems();

            if (switchItem) {
                // If it was armor, update our appearance
                if (switchItem.equipped) {
                    if (items[switchItem.template].type === 'armor') {
                        ironbane.player.UpdateAppearance();
                    }
                    if (items[switchItem.template].type === 'weapon') {
                        ironbane.player.UpdateWeapon(0);
                    }
                }
            }



            soundHandler.Play(ChooseRandom(["bag1"]));

        });
    },
    FindItemBySlot: function(slot, inLoot) {
        var list = inLoot ? ironbane.player.lootItems : socketHandler.playerData.items;
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (item.slot === slot) {
                return item;
            }
        }
        return null;
    },
    FindItemByID: function(id, inLoot) {
        var list = inLoot ? ironbane.player.lootItems : socketHandler.playerData.items;
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            if (item.id === id) {
                return item;
            }
        }
        return null;
    },
    MakeItemHover: function(div, item) {
        var template = items[item.template],
            content = '',
            itemUrl = '',
            itemInfo = '';

        if (template.type === 'armor') {
            itemUrl = [
                    'plugins/game/images/characters/base/',
                template.subtype,
                    '/medium.php?i=',
                template.image
            ].join('');
        } else {
            itemUrl = 'plugins/game/images/items/medium.php?i=' + template.image;
        }

        function infoRow(label, value) {
            return [
                '<tr>',
                '<td style="text-align:right;"><strong>', label, '</strong></td>',
                '<td style="padding-left:10px;">',
                value,
                '</td>',
                '</tr>'].join('');
        }

        // info section
        switch (template.type) {
            case 'weapon':
                itemInfo += infoRow((item.attr1 > 0 ? 'Damage' : 'Heals'), this.GetStatContent(Math.abs(item.attr1), "misc/heart", 0, false, true));
                break;
            case 'armor':
                itemInfo += infoRow('Armor', this.GetStatContent(item.attr1, "misc/armor", 0, false, true));
                break;
            case 'consumable':
                if (template.subtype === 'restorative') {
                    itemInfo += infoRow('Restores', this.GetStatContent(item.attr1, "misc/heart", 0, false, true));
                }
                break;
        }

        // if selling vendor sets price on server...
        if (item.price) {
            var priceHtml = [
                    '<span class="amount" style="color:gold;padding-left: 16px;',
                    'background-image:url(plugins/game/images/misc/coin_full.png);',
                    'background-repeat:no-repeat;">',
                    'x ', item.price,
                    '</span>'
            ].join('');
            itemInfo += infoRow('Price', priceHtml);
        }

        // for now only show cash value
        if(template.type === 'cash') {
            var valueHTML = [
                    '<span class="amount" style="color:gold;padding-left: 16px;',
                    'background-image:url(plugins/game/images/misc/coin_full.png);',
                    'background-repeat:no-repeat;">',
                    'x ', item.value,
                    '</span>'
            ].join('');
            itemInfo += infoRow('Value', valueHTML);
        }

        if (debugging) {
            itemInfo += infoRow('ID', item.id);
            itemInfo += infoRow('Slot', item.slot);
        }

        if (itemInfo !== '') {
            itemInfo = '<hr><table>' + itemInfo + '</table>';
        }

        content = [
                '<div style="min-height:20px;">',
                '<div style="margin-top:-3px;width:33px;height:30px;float:left;">',
                '<img src="', itemUrl, '">',
                '</div>',
                '<div style="margin-top:3px;">', template.name, '</div>',
                '</div>',
            itemInfo
        ].join('');

        MakeHoverBox(div, content);
    },
    MakeSlotItems: function(isLoot) {
        var data = isLoot ? ironbane.player.lootItems : socketHandler.playerData.items;

        if (isLoot) {
            $('div[id^="li"]').remove();
        } else {
            $('div[id^="ii"]').remove();
        }

        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var template = items[item.template];

            var name = isLoot ? 'li' + item.id : 'ii' + item.id;
            $('#gameFrame').append('<div id="' + name + '" class="itemSlot"></div>');

            var targetName = isLoot ? 'ls' + item.slot : 'is' + item.slot;
            TeleportElement(name, targetName);
            this.MakeItemHover(name, item);

            //bm("item:"+item.id+",slot"+item.slot+"");

            var itemurl;
            if (template.type === 'armor') {
                itemurl = 'plugins/game/images/characters/base/' + (template['subtype']) + '/big.php?i=' + (template['image']) + '';
            } else {
                itemurl = 'plugins/game/images/items/big.php?i=' + (template['image']);
            }

            $('#' + name).css('background-image', 'url(' + itemurl + ')');
            //$('#'+name).css('background-color','orange');
            //var hue = 'rgb(' + getRandomInt(50,255) + ',' + getRandomInt(50,255) + ',' + getRandomInt(50,255) + ')';
            //$('#'+name).css('background-color', hue);
            $('#' + name).css('background-repeat', 'no-repeat');
            $('#' + name).css('background-position', 'center');

            // Clicking it uses it!
            // But not dragging!
            //if ( !isLoot ) {
            (function(item) {
                $('#' + name).click(function(e) {
                    if ($(this).hasClass('noclick')) {
                        $(this).removeClass('noclick');
                    } else {
                        if (_.contains(socketHandler.playerData.items, item)) {
                            if(e.shiftKey) {
                                ironbane.player.splitItem(item.slot);
                            } else {
                                ironbane.player.UseItem(item.slot);
                            }
                        }
                    }
                });
            })(item);

            $('#' + name).draggable({
                containment: "#gameFrame",
                start: function(event, ui) {
                    $(this).addClass('noclick');
                }
            });
        }

        hudHandler.UpdateEquippedItems();
    },
    ReloadInventory: function() {
        if (ironbane.player) {
            this.MakeSlotItems(false);
            if (ironbane.player.canLoot) {
                this.MakeSlotItems(true);
            }
        }
    },
    ResizeFrame: function() {
        frameWidth = $(window).width();
        frameHeight = $(window).height();
        $('#gameFrame').css('width', frameWidth);
        $('#gameFrame').css('height', frameHeight);

        this.PositionHud();

        this.ReloadInventory();
        //this.MakeSlotItems(true);

        if (ironbane.stats && ironbane.stats.domElement) {
            ironbane.stats.domElement.style.top = ($(window).height() - 55) + 'px';
        }
    },
    PositionHud: function() {
        var halfWidth = frameWidth * 0.5,
            halfHeight = frameHeight * 0.5;

        $('#chatBox').css({
            width: Math.floor(halfWidth) + 'px',
            left: (Math.floor(halfWidth) - 5) + 'px',
            top: '5px'
        });

        $('#loginBox').css({
            left: (halfWidth - 300) + 'px',
            top: (halfHeight - 300) + 'px'
        });

        $('#soundToggleBox').css({
            left: (frameWidth - 50) + 'px',
            top: '0px'
        });

        $('#debugBox').css('left', (frameWidth - 310) + 'px');
        $('#debugBox').css('top', stealth ? 20 : (frameHeight - 310) + 'px');

        $('#bigMessagesBox').css('width', (frameWidth) + 'px');
        $('#bigMessagesBox').css('left', '0px');
        $('#bigMessagesBox').css('top', (frameHeight / 3) + 'px');

        $('#statBar').css('width', (frameWidth) + 'px');
        $('#statBar').css('left', '20px');
        $('#statBar').css('top', (20) + 'px');

        $('#itemBar').css('left', (halfWidth - 240) + 'px');
        $('#itemBar').css('top', ((frameHeight) - 48) + 'px');

        $('#coinBar').css('left', '22px');
        $('#coinBar').css('top', '72px');

        $('#lootBag').css('left', (halfWidth - 240) + 'px');
        $('#lootBag').css('top', ((frameHeight) - 120) + 'px');

        $('#book').css('left', (halfWidth - 230) + 'px');
        $('#book').css('top', (halfHeight - 210) + 'px');

        $('#map').css('left', (halfWidth - 250) + 'px');
        $('#map').css('top', (halfHeight - 250) + 'px');

        $('#alertBox').css('left', (halfWidth - 250) + 'px');
        $('#alertBox').css('top', (halfHeight - 75) + 'px');
        $('#alertBox').hide();

        $('#chatInputBox').hide();

        $('#devNews').css('left', (halfWidth + 200) + 'px');
        $('#devNews').css('top', (halfHeight - 57) + 'px');
    },
    GetStatContent: function(amount, prefix, fullStat, onlyFull, noMarginSpace) {
        var content = '',
            x = 0;

        fullStat = fullStat || 0;
        onlyFull = onlyFull || false;
        noMarginSpace = noMarginSpace || false;

        if (onlyFull) {
            amount *= 2;
            fullStat *= 2;
        }

        var fullHearts = Math.floor(amount);
        var halfHeart = false;
        if (fullHearts % 2 === 1) {
            fullHearts--;
            halfHeart = true;
        }
        for (x = 0; x < fullHearts / 2; x++) {
            if (fullStat) {
                fullStat -= 2;
            }
            content += '<img src="plugins/game/images/' + prefix + '_full.png" style="' + (!noMarginSpace ? 'margin-right:1px;' : '') + '">';
        }
        // Spawn all the half hearts
        if (halfHeart) {
            if (fullStat) {
                fullStat -= 2;
            }
            content += '<img src="plugins/game/images/' + prefix + '_half.png" style="' + (!noMarginSpace ? 'margin-right:1px;' : '') + '">';
        }

        if (fullStat) {
            for (x = 0; x < fullStat / 2; x++) {
                content += '<img src="plugins/game/images/' + prefix + '_empty.png" style="' + (!noMarginSpace ? 'margin-right:1px;' : '') + '">';
            }
        }

        return content;
    },
    MakeCoinBar: function(flash) {
        var self = this,
            el = $('#coinBar'),
            coins = ironbane.player.getTotalCoins(),
            img = 'misc/coin_medium',
            imgFlash = 'misc/coin_medium_flash',
            src = 'plugins/game/images/' + (flash ? imgFlash : img) + '_full.png';

        // if the element is already been rendered before just use it
        if (el.html() !== '') {
            el.find('.amount').text('x ' + coins).css('background-image', 'url(' + src + ')');
        } else {
            // todo: some of this can be done in the css file instead
            $('<span class="amount" style="color:gold;padding-left: 25px;background-image:url(' + src + ');background-repeat:no-repeat;">x ' + coins + '</span>').appendTo(el);
        }

        // if this was a "flash" run again without flash
        if (flash) {
            setTimeout(function() {
                self.MakeCoinBar(false);
            }, 50);
        }
    },
    MakeHealthBar: function(doFlash) {
        doFlash = doFlash || false;
        var content = this.GetStatContent(ironbane.player.health, doFlash ? 'misc/heart_medium_flash' : 'misc/heart_medium', ironbane.player.healthMax);
        //var content = this.GetStatContent(1, 'misc/heart_medium', 6);
        $('#healthBar').html(content);
        if (doFlash) {
            setTimeout(function() {
                hudHandler.MakeHealthBar();
            }, 50);
        }
    },
    MakeArmorBar: function(doFlash) {
        doFlash = doFlash || false;
        var content = this.GetStatContent(ironbane.player.armor, doFlash ? 'misc/armor_medium_flash' : 'misc/armor_medium', ironbane.player.armorMax);
        $('#armorBar').html(content);
        if (doFlash) setTimeout(function() {
                hudHandler.MakeArmorBar()
            }, 50);
    },
    HideAlert: function() {
        $('#alertBox').hide();
        hudHandler.alertBoxActive = false;

        if (!_.isUndefined(hudHandler.doYes)) hudHandler.doYes = undefined;
        if (!_.isUndefined(hudHandler.doNo)) hudHandler.doNo = undefined;

    },
    MessageAlert: function(message, options, doYes, doNo) {

        var options = options || null;

        this.doYes = doYes;
        this.doNo = doNo;

        this.alertBoxActive = true;

        // Store all document

        $('#btnOK').hide();
        $('#btnNo').hide();

        switch (options) {
            case 'nobutton':
                break;
            case 'question':
                $('#btnOK').show();
                $('#btnNo').show();
                break;
            default:
                $('#btnOK').show();
                break;
        }

        $(document).keydown(function(event) {
            if (event.keyCode == 13) {
                $('#alertBox').hide();
                hudHandler.alertBoxActive = false;
            }
        });


        $('#alertBox').show();
        $('#alertMessage').html(message);
        $('#alertImage').css('height', $('#alertBox').css('height'));
        $('#btnOK').click(function() {
            $('#alertBox').hide();
            hudHandler.alertBoxActive = false;

            if (!_.isUndefined(hudHandler.doYes)) hudHandler.doYes();

            hudHandler.doYes = undefined;
        });

        $('#btnNo').click(function() {
            $('#alertBox').hide();
            hudHandler.alertBoxActive = false;

            if (!_.isUndefined(hudHandler.doNo)) hudHandler.doNo();

            hudHandler.doNo = undefined;
        });
    },
    DisableButtons: function(buttons) {
        for (var b = 0; b < buttons.length; b++) {
            this.oldButtonClasses[buttons[b]] = $('#' + buttons[b]).attr('class');
            $('#' + buttons[b]).attr('class', 'ibutton_disabled');
        }
    },
    EnableButtons: function(buttons) {
        for (var b = 0; b < buttons.length; b++) {
            if (!_.isUndefined(this.oldButtonClasses[buttons[b]])) {
                $('#' + buttons[b]).attr('class', this.oldButtonClasses[buttons[b]]);
            } else {
                $('#' + buttons[b]).attr('class', 'ibutton');
            }
        }
    },
    HideHUD: function() {
        $('#itemBar').hide();
        $('#lootBag').hide();
        $("#coinBar").hide();
        $("#statBar").hide();
        $('div[id^="li"]').hide();
        $('div[id^="ii"]').hide();
        // $('#chatBox').hide();
    },
    ShowHUD: function() {
        $('#itemBar').show();
        // $('#lootBag').show();
        $("#coinBar").show();
        $("#statBar").show();
        $('div[id^="li"]').show();
        $('div[id^="ii"]').show();
        // $('#chatBox').show();
    },
    HideMenuScreen: function() {
        $('#loginBox, #devNews, #sideMenu, #soundToggleBox').hide();
        $('#chatBox, #itemBar, #coinBar, #statBar').show();
        soundHandler.FadeOut("music/maintheme", 5000);
    },
    ShowMenuScreen: function() {
        $('#sideMenu, #loginBox, #devNews, #soundToggleBox').show();
        $('#chatBox, #itemBar, #lootBag, #coinBar, #statBar').hide();
        soundHandler.FadeIn("music/maintheme", 5000);
    },
    MakeCharSelectionScreen: function() {
        var slotsLeft = slotsAvailable - charCount;

        var text = '';
        text += '<div id="charSelect"></div>';

        $('#loginContent').html(text);

        var charSelect = '';
        //var charSelect = '<button id='btnNewChar' class='ibutton'>Make new character</button><div class='spacer'></div>';

        if (startdata.loggedIn) {
            charSelect += '<button class="ibutton_disabled" style="width:180px">' + startdata.name + '</button>';
            charSelect += '<button id="btnLogOut" class="ibutton" style="width:120px">Log out</button>';
            charSelect += '<div class="spacersmall"></div>';
        } else {

            charSelect += '<button id="btnEnterChar" class="ibutton_attention" style="width:305px">Play as Guest</button>';
            charSelect += '<div class="spacer"></div>';
            charSelect += '<button id="btnLogin" class="ibutton" style="width:150px">Log in</button>';
            charSelect += '<button id="btnRegister" class="ibutton" style="width:150px">Register</button>';
            //charSelect += '<div class="spacersmall"></div>';
        }

        var myChar = null;
        for (var c = 0; c < chars.length; c++) {
            if (chars[c].id === startdata.characterUsed) {
                myChar = chars[c];
                break;
            }
        }

        if (startdata.loggedIn) {
            charSelect += '<button id="btnPrevChar" class="ibutton' + (charCount === 0 ? '_disabled' : '') + '" style="float:left;width:40px">←</button>';
        }

        if (startdata.loggedIn) {
            if (startdata.characterUsed === 0) {
                charSelect += '<button id="btnNewChar" class="ibutton' + (slotsLeft === 0 ? '_disabled' : '') + '" style="width:216px">Create Character</button>';
            } else {

                //charSelect += '<button id="btnEnterChar" class="ibutton" style="width:214px">Enter Ironbane</button>';
                charSelect += '<div style="width:220px;height:40px;float:left;text-align:center;padding-top:10px;">' + myChar.name + '</div>';

                charSelect += '<button id="btnDelChar" class="ibutton" style="float:left;width:40px;position:absolute;left:276px;top:120px">&#10006;</button>';
            }
        }

        if (startdata.loggedIn) {
            charSelect += '<button id="btnNextChar" class="ibutton' + (charCount === 0 ? '_disabled' : '') + '" style="width:40px">→</button><br>';
        }

        if (startdata.loggedIn) {

            if (myChar) {
                charSelect += '';

                var head = 0;
                var body = 0;
                var feet = 0;

                if (myChar.equipment !== '') {
                    var charItems = myChar.equipment.split(',');
                    for (var i = 0; i < charItems.length; i++) {
                        var item = items[charItems[i]];
                        if (item.type === 'armor') {

                            switch (item.subtype) {
                                case 'head':
                                    head = item.image;
                                    break;
                                case 'body':
                                    body = item.image;
                                    break;
                                case 'feet':
                                    feet = item.image;
                                    break;
                            }

                        }
                    }
                }

                var tex = getCharacterTexture({
                    skin: myChar.skin,
                    eyes: myChar.eyes,
                    hair: myChar.hair,
                    feet: feet,
                    body: body,
                    head: head,
                    big: 1
                });
                charSelect += '<div id="charPreview"><img id="charImage" src="' + tex + '"></div>';

            } else {

                charSelect += '<div id="charPreview"><div>' + (charCount === 0 ? 'No characters yet' : (slotsLeft === 0 ? "No" : slotsLeft) + ' slot' + (slotsLeft === 1 ? "" : "s") + ' remaining') + '</div></div>';
            }

            charSelect += '<div class="spacersmall"></div>';

            if (myChar) {
                charSelect += '<button id="btnEnterChar" class="ibutton_attention" style="width:305px">Enter Ironbane</button>';
            }
        }

        $('#charSelect').html(charSelect);

        if (startdata.loggedIn) {
            $('#charSelect').css("height", "321px");
        } else {
            $('#charSelect').css("height", "");
        }

        $('#btnPrevChar').click(function() {
            if(window.chars && window.chars.length === 0) {
                return;
            }

            if (startdata.characterUsed === 0) {
                startdata.characterUsed = chars[((chars.length) - 1)].id;
            } else {
                for (var c = 0; c < chars.length; c++) {
                    if (chars[c].id === startdata.characterUsed) {
                        var next = c - 1;
                        if (!_.isUndefined(chars[next])) {
                            startdata.characterUsed = chars[next].id;
                        } else {
                            startdata.characterUsed = 0;
                        }
                        break;
                    }
                }
            }
            hudHandler.MakeCharSelectionScreen();
        });

        $('#btnNextChar').click(function() {
            if(window.chars && window.chars.length === 0) {
                return;
            }

            if (startdata.characterUsed === 0) {
                startdata.characterUsed = chars[0].id;
            } else {
                for (var c = 0; c < chars.length; c++) {
                    if (chars[c].id === startdata.characterUsed) {
                        var next = c + 1;
                        if (!_.isUndefined(chars[next])) {
                            startdata.characterUsed = chars[next].id;
                        } else {
                            startdata.characterUsed = 0;
                        }
                        break;
                    }
                }
            }

            hudHandler.MakeCharSelectionScreen();
        });

        var enterChar = function() {

            if (!socketHandler.serverOnline) return;

            hudHandler.DisableButtons(['btnLogOut', 'btnEnterChar',
                    'btnNextChar', 'btnPrevChar', 'btnDelChar'
            ]);

            function abortConnect() {
                hudHandler.EnableButtons(['btnLogOut', 'btnEnterChar',
                        'btnNextChar', 'btnPrevChar', 'btnDelChar'
                ]);
                $('#gameFrame').animate({
                    opacity: 1.00
                }, 1000);
            }


            $('#gameFrame').animate({
                opacity: 0.00
            }, 1000, function() {
                hudHandler.HideMenuScreen();

                var tryConnect = function() {
                    socketHandler.Connect(abortConnect);
                };

                if (startdata.loggedIn) {
                    tryConnect();
                } else {
                    // Quickly make a character as a guest
                    $.get('/api/guest/characters', function(response) {
                        // should have a more global error handler...
                        // hudHandler.MessageAlert(data.errmsg);

                        window.chars = [response];
                        window.charCount = window.chars.length;
                        window.startdata.characterUsed = response.id;

                        tryConnect();
                    });
                }
            });
        };



        $('#btnEnterChar').click(enterChar);

        $('#btnLogOut').click(function() {
            hudHandler.DisableButtons(['btnLogOut']);

            $.get('/logout')
                .done(function(response) {
                    if (response === 'OK') {
                        chars = [];
                        startdata.loggedIn = false;
                        startdata.characterUsed = 0;

                        hudHandler.MakeCharSelectionScreen();
                    } else {
                        hudHandler.EnableButtons(['btnLogOut']);
                        hudHandler.MessageAlert(response);
                    }
                });
        });

        $('#btnDelChar').click(function() {
            var contents = ['To confirm the deletion of this character, please enter its name exactly.',
                    '<div class="spacersmall"></div>',
                    '<label for="charName">Name</label>',
                    '<div class="spacersmall"></div>',
                    '<input type="charName" id="charName" class="iinput" style="width:305px" />',
                    '<div class="spacersmall"></div>',
                    '<button id="btnConfirmDeletion" class="ibutton_attention" style="width:150px">Delete</button>',
                    '<button id="btnBack" class="ibutton" style="width:150px">Back</button>'
            ].join('');
            $('#charSelect').html(contents);
            $('#charName').focus();

            var delChar = _.find(window.chars, function(c) {
                return c.id === startdata.characterUsed;
            });

            var confirmDeletion = function() {
                hudHandler.DisableButtons(['btnConfirmDeletion', 'btnBack']);

                var confirm = $('#charName').val();
                if(confirm !== delChar.name) {
                    hudHandler.MessageAlert('Name does not match character name!');
                    hudHandler.EnableButtons(['btnConfirmDeletion', 'btnBack']);
                } else {
                    $.ajax({
                        url: '/api/user/' + startdata.user + '/characters/' + startdata.characterUsed,
                        type: 'DELETE'
                    }).done(function(response) {
                        startdata.characterUsed = 0;
                        window.chars = _.without(window.chars, delChar);
                        window.charCount = window.chars.length;
                        hudHandler.MakeCharSelectionScreen();
                    }).fail(function(error) {
                        //console.error('error deleting character!', error);
                        hudHandler.MessageAlert(error.responseText);
                        hudHandler.EnableButtons(['btnConfirmDeletion', 'btnBack']);
                    });
                }
            };

            $('#charSelect').keydown(function(event) {
                if (event.keyCode === 13 && !hudHandler.alertBoxActive) {
                    confirmDeletion();
                }
            });

            $('#btnConfirmDeletion').click(confirmDeletion);

            $('#btnBack').click(function() {
                hudHandler.MakeCharSelectionScreen();
            });
        });

        $('#btnLogin').click(function() {

            if (slotsLeft <= 0) {
                return;
            }

            var newChar = '';
            newChar += '<label for="username">Username</label><div class="spacersmall"></div><input type="text" id="username" class="iinput" style="width:305px"><div class="spacersmall"></div><label for="password">Password</label><div class="spacersmall"></div><input type="password" id="password" class="iinput" style="width:305px"><div class="spacersmall"></div><button id="btnConfirmLogin" class="ibutton_attention" style="width:150px">Log in</button><button id="btnBack" class="ibutton" style="width:150px">Back</button>';
            $('#charSelect').html(newChar);
            $('#username').focus();

            var doLogin = (function() {
                var username = $('#username').val();
                var password = $('#password').val();

                hudHandler.DisableButtons(['btnConfirmLogin', 'btnBack']);

                $.post('/login', {
                    username: username,
                    password: password
                })
                .done(function(user) {
                    startdata.loggedIn = true;
                    startdata.name = user.name;
                    startdata.user = user.id;
                    startdata.characterUsed = user.characterused;
                    window.isEditor = user.editor === 1;

                    // get characters for user
                    $.get('/api/user/' + user.id + '/characters')
                        .done(function(data) {

                            location.reload();

                            // window.chars = data;
                            // window.charCount = window.chars.length;
                            // hudHandler.MakeCharSelectionScreen();
                        })
                        .fail(function(err) {
                            console.error('error getting chars...', err);
                        });
                })
                .fail(function(err) {
                    hudHandler.MessageAlert(err.responseText);
                    hudHandler.EnableButtons(['btnConfirmLogin', 'btnBack']);
                    if(err.responseText === "Invalid username or password!") {
                        $('#password').val("");
                    }
                });
            });

            (function(doLogin) {
                $('#charSelect').keydown(function(event) {
                    if (event.keyCode === 13 && !hudHandler.alertBoxActive) {
                        doLogin();
                    }
                });
            })(doLogin);

            $('#btnConfirmLogin').click(doLogin);

            $('#btnBack').click(function() {
                hudHandler.MakeCharSelectionScreen();
            });
        })

        $('#btnRegister').click(function() {
            if (startdata.loggedIn) {
                return;
            }

            var tmpl = [
                '<label for="username">Username</label>',
                '<div class="spacersmall"></div>',
                '<input type="text" id="username" class="iinput" style="width:305px">',
                '<div class="spacersmall"></div>',
                '<label for="password">Password</label>',
                '<div class="spacersmall"></div>',
                '<input type="password" id="password" class="iinput" style="width:305px">',
                '<div class="spacersmall"></div>',
                '<label for="email">E-mail</label>',
                '<div class="spacersmall"></div>',
                '<input type="text" id="email" class="iinput" style="width:305px">',
                '<input type="text" id="url" style="display:none">',
                '<div class="spacersmall"></div>',
                '<button id="btnConfirmRegister" class="ibutton_attention" style="width:150px">Register</button>',
                '<button id="btnBack" class="ibutton" style="width:150px">Back</button>'
            ].join('');

            $('#charSelect').html(tmpl);
            $('#username').focus();

            var confirmRegister = (function() {
                var username = $('#username').val();
                var password = $('#password').val();
                var email = $('#email').val();
                var url = $('#url').val();

                hudHandler.DisableButtons(['btnConfirmRegister', 'btnBack']);

                $.post('/api/user', {
                    Ux466hj8: username,
                    Ed2h18Ks: password,
                    s8HO5oYe: email,
                    url: url
                })
                .done(function(response) {
                    hudHandler.MessageAlert('Registration successful! Please check your e-mail and click the activation link inside so we know you are a real human!', {}, function () {
                        location.reload();
                    });

                    // startdata.loggedIn = true;
                    // startdata.name = response.name;
                    // startdata.user = response.id;
                    // startdata.characterUsed = 0; // we just registered, so we have no characters
                    // window.chars = [];
                    // window.charCount = 0;
                    // window.isEditor = response.editor === 1;

                    // hudHandler.MakeCharSelectionScreen();


                })
                .fail(function(err) {
                    hudHandler.EnableButtons(['btnConfirmRegister', 'btnBack']);
                    hudHandler.MessageAlert(err.responseText);
                });
            });

            $('#charSelect').keydown(function(event) {
                if (event.keyCode === 13 && !hudHandler.alertBoxActive) {
                    confirmRegister();
                }
            });
            $('#btnConfirmRegister').click(confirmRegister);

            $('#btnBack').click(function() {
                hudHandler.MakeCharSelectionScreen();
            });
        });

        $('#btnNewChar').click(function() {
            if (slotsLeft <= 0) {
                return;
            }

            var layout = [
                '<label for="ncname">Name</label>',
                '<div class="spacersmall"></div>',
                '<input type="text" id="ncname" class="iinput" style="width:305px" maxlength="12" />',
                '<div id="charCustomizationContainer">',
                    '<div id="charCustomizationButtonsLeft"></div>',
                    '<div id="charCustomizationPreview">',
                        '<div id="charSkinLayer"></div>',
                    '</div>',
                    '<div id="charCustomizationButtonsRight"></div>',
                '</div>',
                '<button id="btnConfirmNewChar" class="ibutton_attention" style="width:150px">Create</button>',
                '<button id="btnBackMainChar" class="ibutton" style="width:150px">Cancel</button>'
            ].join('');
            $('#charSelect').html(layout);

            var custButtons = '';
            custButtons += 'Gender<br>';
            custButtons += '<button id="btnGenderChange" class="ibutton" style="width:70px;">Boy</button>';
            custButtons += '<br>';
            custButtons += 'Skin<br>';
            custButtons += '<button id="btnSkinPrev" class="ibutton" style="width:30px;">&#9664;</button>';
            custButtons += '<button id="btnSkinNext" class="ibutton" style="width:30px">&#9654;</button>';
            $('#charCustomizationButtonsLeft').html(custButtons);

            custButtons = '';
            custButtons += 'Hair<br>';
            custButtons += '<button id="btnHairPrev" class="ibutton" style="width:30px;">&#9664;</button>';
            custButtons += '<button id="btnHairNext" class="ibutton" style="width:30px">&#9654;</button>';
            custButtons += 'Eyes<br>';
            custButtons += '<button id="btnEyesPrev" class="ibutton" style="width:30px;">&#9664;</button>';
            custButtons += '<button id="btnEyesNext" class="ibutton" style="width:30px">&#9654;</button>';
            $('#charCustomizationButtonsRight').html(custButtons);

            var custChar = '';
            var constrainCustomizers = function() {
                if (selectedMale) {
                    selectedSkin = Math.min(skinIdMaleEnd, selectedSkin);
                    selectedSkin = Math.max(skinIdMaleStart, selectedSkin);
                    selectedEyes = Math.min(eyesIdMaleEnd, selectedEyes);
                    selectedEyes = Math.max(eyesIdMaleStart, selectedEyes);
                    selectedHair = Math.min(hairIdMaleEnd, selectedHair);
                    selectedHair = Math.max(hairIdMaleStart, selectedHair);
                } else {
                    selectedSkin = Math.min(skinIdFemaleEnd, selectedSkin);
                    selectedSkin = Math.max(skinIdFemaleStart, selectedSkin);
                    selectedEyes = Math.min(eyesIdFemaleEnd, selectedEyes);
                    selectedEyes = Math.max(eyesIdFemaleStart, selectedEyes);
                    selectedHair = Math.min(hairIdFemaleEnd, selectedHair);
                    selectedHair = Math.max(hairIdFemaleStart, selectedHair);
                }
            };

            var refreshChar = function() {
                constrainCustomizers();

                var cachefile = 'plugins/game/images/characters/cache/' +
                    selectedSkin + '_' + selectedEyes + '_' + selectedHair + '_0_0_0_1.png';

                $('#charSkinLayer').css('background-image', 'url(' + cachefile + ')');
            };

            $('#btnGenderChange').click(function() {
                selectedMale = !selectedMale;

                $(this).html(selectedMale ? 'Boy' : 'Girl');
                refreshChar();
            });

            $('#btnSkinNext').click(function() {
                selectedSkin++;
                refreshChar();
            });

            $('#btnSkinPrev').click(function() {
                selectedSkin--;
                refreshChar();
            });

            $('#btnEyesNext').click(function() {
                selectedEyes++;
                refreshChar();
            });

            $('#btnEyesPrev').click(function() {
                selectedEyes--;
                refreshChar();
            });

            $('#btnHairNext').click(function() {
                selectedHair++;
                refreshChar();
            });

            $('#btnHairPrev').click(function() {
                selectedHair--;
                refreshChar();
            });

            refreshChar();

            var confirmNewChar = (function() {
                hudHandler.DisableButtons(['btnConfirmNewChar', 'btnBackMainChar']);

                var ncname = $('#ncname').val();

                $.ajax({
                    type: 'POST',
                    url: '/api/user/' + startdata.user + '/characters',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        name: ncname,
                        skin: selectedSkin,
                        eyes: selectedEyes,
                        hair: selectedHair
                    })
                })
                .done(function(response) {
                    chars.push(response);

                    charCount = chars.length;
                    startdata.characterUsed = response.id;

                    hudHandler.MakeCharSelectionScreen();
                })
                .fail(function(err) {
                    hudHandler.MessageAlert(err.responseText);
                    hudHandler.EnableButtons(['btnConfirmNewChar', 'btnBackMainChar']);
                });
            });

            $('#charSelect').keydown(function(event) {
                if (event.keyCode === 13 && !hudHandler.alertBoxActive) {
                    confirmNewChar();
                }
            });
            $('#btnConfirmNewChar').click(confirmNewChar);

            $('#btnBackMainChar').click(function() {
                hudHandler.MakeCharSelectionScreen();
            });
        });

    },
    Tick: function(dTime) {

        var output = '';

        for (var m = 0; m < this.bigMessages.length; m++) {
            var msg = this.bigMessages[m];

            msg.Tick(dTime);

            if (msg.timeLeft <= 0) {
                this.bigMessages.splice(m, 0);
            } else {
                output += '<div style="opacity:' + msg.opacity + '">' + msg.message + '</div><br>';
            }

        }


        $('#bigMessagesBox').html(output);


    },
    AddBigMessage: function(msg, duration) {
        this.bigMessages.push(new BigMessage(msg, duration));
    },
    ShowMap: function() {

        $("#map").css("background-image", "url(plugins/game/data/" + terrainHandler.zone + "/map.png" + (isEditor ? "?" + (new Date()).getTime() : "") + ")");

        $("#map").show();

    },
    HideMap: function() {
        $("#map").hide();
    },
    ShowBook: function(text, page) {

        //<button id="bookPrevPage" class="ibutton_book" style="width:150px">Previous Page</button>
        //<button id="bookNextPage" class="ibutton_book" style="width:150px">Next Page</button>

        $("#book").show();

        page = page || 0;

        textArray = text.split("|");

        if (!_.isUndefined(textArray[page])) {
            $("#bookPageLeft").html(textArray[page]);
        } else {
            $("#bookPageLeft").empty();
        }
        if (!_.isUndefined(textArray[page + 1])) {
            $("#bookPageRight").html(textArray[page + 1]);
        } else {
            $("#bookPageRight").empty();
        }


        if (!_.isUndefined(textArray[page - 2])) {
            $("#bookFooterLeft").html('<button id="bookPrevPage" class="ibutton_book" style="width:150px">Previous Page</button>');
            $("#bookPrevPage").click(function() {
                hudHandler.ShowBook(text, page - 2);
            });
        } else {
            $("#bookFooterLeft").empty();
        }
        if (!_.isUndefined(textArray[page + 2])) {
            $("#bookFooterRight").html('<button id="bookNextPage" class="ibutton_book" style="width:150px">Next Page</button>');
            $("#bookNextPage").click(function() {
                hudHandler.ShowBook(text, page + 2);
            });
        } else {
            $("#bookFooterRight").empty();
        }
    },
    HideBook: function() {
        $("#book").hide();
    },
    AddChatMessage: function(msg) {
        if (typeof msg === 'string') {
            // wrap it in an object for the template
            msg = {
                message: msg
            };
        }
        $('#chatContent').trigger('onMessage', msg);
    }
});



//setTimeout(function(){hudHandler.ShowBook('Saturn is the sixth planet from the Sun and the second largest planet in the Solar System, after Jupiter. Named after the Roman god Saturn, its astronomical symbol (?) represents the god\'s sickle.|Saturn is a gas giant with an average radius about nine times that of Earth.[12][13] While only one-eighth the average density of Earth, with its larger volume Saturn is just over 95 times as massive as Earth.[14][15][16] Saturn\'s interior is probably composed of a core of iron, nickel and rock (silicon and oxygen compounds), surrounded by a deep layer of metallic hydrogen, an intermediate layer of liquid hydrogen and liquid helium and an outer gaseous layer.[17]| The planet exhibits a pale yellow hue due to ammonia crystals in its upper atmosphere. Electrical current within the metallic hydrogen layer is thought to give rise to Saturn\'s planetary magnetic field, which is slightly weaker than Earth\'s and around one-twentieth the strength of Jupiter\'s.[18]| The outer atmosphere is generally bland and lacking in contrast, although long-lived features can appear. Wind speeds on Saturn can reach 1,800 km/h (1,100 mph), faster than on Jupiter, but not as fast as those on Neptune.[19] Saturn has a prominent ring system that consists of nine continuous main rings and three discontinuous arcs, composed mostly of ice particles with a smaller amount of rocky debris and dust. |Sixty-two[20] known moons orbit the planet; fifty-three are officially named. This does not include the hundreds of "moonlets" within the rings.| Titan, Saturn\'s largest and the Solar System\'s second largest moon, is larger than the planet Mercury and is the only moon in the Solar System to retain a substantial atmosphere.[21]')}, 1000);

var hudHandler = new HUDHandler();
