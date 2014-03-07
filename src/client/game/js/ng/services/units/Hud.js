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

function getImageUrlForItem(item, width, height) {
    var imageUrl;

    // default to "big"
    if(!width) {
        width = 32;
    }
    if(!height) {
        height = 32;
    }

    if (item.type === 'armor') {
        imageUrl = 'images/characters/base/' + item.subtype + '/' + item.$template.image + '/' + width + '/' + height;
    } else {
        imageUrl = 'images/items/' + item.$template.image + '/' + width + '/' + height;
    }

    return imageUrl;
}

var props = ['skin', 'eyes', 'hair', 'feet', 'body', 'head', 'big'];


var selectedMale = true;
var selectedSkin = 1;
var selectedEyes = 1;
var selectedHair = 1;

var SAFARI_TEXT = 'You seem to be using <b>Safari</b>.<br>Don\'t worry, there is a solution for you!';
var SAFARI_SOLUTION = 'In Safari, open the <b>Safari menu</b> and select <b>Preferences</b>.<br><br>' +
                 'Then, click the <b>Advanced</b> tab in the Preferences window.<br><br>' +
                 'Then, at the bottom of the window, check the <b>Show Develop menu in menu bar</b> checkbox.<br><br>' +
                 'Then, open the <b>Develop</b> menu in the menu bar and select <b>Enable WebGL</b>.';



var messageFadeTime = 0.2;

var BigMessage = Class.extend({
    Init: function(message, duration) {
        this.message = message;
        this.duration = duration;
        this.timeLeft = duration;
        this.opacity = 1;
    },
    tick: function(dTime) {
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
    screenshotMode: false,
    Init: function() {
        var HUD = this;

        this.allowSound = !_.isUndefined(localStorage.allowSound) ? (localStorage.allowSound === 'true') : true;

        if (Detector.webgl) {
            if (socketHandler.serverOnline) {
                $('#loginContent').show();
                $('#chatContent').hide().trigger('hide');
            } else {
                setTimeout(function() {
                    hudHandler.messageAlert('The server is currently offline. Please try again later.', 'nobutton');
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
                $('#webglsolution').html(SAFARI_TEXT+'<div class="spacersmall"></div><div class="insideInfo" style="width:280px;">' + SAFARI_SOLUTION + '</div>');

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
            $('#gameFrame').droppable({
                accept: '.invSlotItem', // can only drop things from your own inv (not from bank or other)
                drop: function(e, ui) {
                    _.partial(HUD.onDropItem, e, ui, HUD)();
                },
            });

            HUD.ShowMainMenuHUD();
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
    toggleScreenShotMode: function(){
        this.screenshotMode = !this.screenshotMode;
        if(this.screenshotMode === true){
            $('#statBar').hide();
            $('#itemBar').hide();
            $('#coinBar').hide();
            $('#debugBox').hide();
            $('#editorControls').hide();
            if(ironbane.stats && ironbane.stats.domElement) {
                ironbane.stats.domElement.style.visibility = "hidden";
            }
        }
        else{
             $('#statBar').show();
            $('#itemBar').show();
            $('#coinBar').show();
             $('#debugBox').show();
             $('#editorControls').show();
             if(ironbane.stats && ironbane.stats.domElement) {
                ironbane.stats.domElement.style.visibility = "visible";
            }

        }
        var me = this;
        $('#chatContent').scope().$apply(function(scope) {
            scope.showChatWindow = !me.screenshotMode;
        });
    },
    MakeSoundButton: function() {
        var checkSoundToggle = function(value) {

            if (!gotFlashInstalled) {
                value = false;
                hudHandler.messageAlert("Flash was not detected.<br><br>Sound effects are disabled.");
            }

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
    makeInventorySlots: function(num) {
        var HUD = this,
            container = $('#itemBar'),
            spaces = num;

        var dropFunction = function(e, ui) {
                    _.partial(HUD.onInvSlotDrop, e, ui, HUD)();
                };
        var clickFunction = function(e) {
                var $slot = $(this),
                    $item = $slot.children().data('item'); // there should only ever be 1 or 0 (null)

                // handle use based on child data
                console.log($slot.attr('id') + " clicked!", $item);

                if ($item) {
                    if (e.shiftKey && $item.stackable) {
                        ironbane.player.splitItem($item.slot);
                    } else {
                        ironbane.player.useItem($item.slot);
                    }
                }
            };

        container.empty();
        for (var x = 0; x < spaces; x++) {
            var slot = $('<div id="is' + x + '" class="dragon-slot itemBarSlot"></div>');
            slot.data('slot', x);
            container.append(slot);
            slot.droppable({
                drop: dropFunction,
                greedy: true,
                tolerance: 'pointer',
                hoverClass: 'dragon-hover'
            });
            slot.click(clickFunction);
        }
    },
    fillInvSlot: function(item) {
        var HUD = this,
            imageUrl = getImageUrlForItem(item);

        var slotSelector = '#is' + item.slot;
        $(slotSelector).addClass('occupied');
        if (item.equipped === 1) {
            $(slotSelector).addClass('equipped');
        }

        var itemImg = $('<img src="' + imageUrl + '" class="dragon-item invSlotItem" />');
        itemImg.data('item', item);
        $(slotSelector).append(itemImg);
        if (item.type !== 'cash') {
            // with the exception of gold bags, we only allow INV to INV drops (if we aren't blank)
            $(slotSelector).droppable({ accept: ".invSlotItem" });
        }

        HUD.makeItemHover(itemImg, item);

        itemImg.draggable({
            containment: '#gameFrame',
            revert: 'invalid',
            zIndex: 110,
            helper: 'clone',
            appendTo: 'body',
            start: function(e, ui) {
                ui.helper.data('item', item);
            }
        });
    },
    clearInvSlot: function(slotNum) {
        $('#is' + slotNum).empty().removeClass('occupied equipped used').droppable({accept: '*'});
    },
    updateInvSlotStatus: function(slotNum, status) {
        var $slot = $('#is' + slotNum);

        if (status === 'equipped') {
            $slot.addClass(status);
        } else {
            $slot.removeClass('equipped');
        }

        if (status === 'used') {
            $slot.addClass(status);
            // todo: better animation?
            setTimeout(function() {
                $slot.removeClass('used');
            }, 500);
        }
    },
    showInv: function(data) {
        var HUD = this;
        HUD.makeInventorySlots(data.slots);
        $('#itemBar').show();

        _.each(data.items, function(invItem) {
            HUD.fillInvSlot(invItem);
        });

        // any time we show the inventory, we should update the gold
        HUD.makeCoinBar();
    },
    hideInv: function() {
        $('#itemBar').removeData().empty().hide();
    },
    onInvSlotDrop: function(e, ui, HUD) {
        // we can drop onto inventory from a vendor, loot, or bank (currently) OR itself
        var slot = $(e.target),
            dropped = $(e.toElement),
            item = dropped.data('item'),
            occupied = slot.children().data('item');

        function revert() {
            // prolly a more elegant way to write this...
            if(dropped.hasClass('lootSlotItem')) {
                HUD.clearLootSlot(item.slot);
                HUD.fillLootSlot(item);
            }
            if(dropped.hasClass('invSlotItem')) {
                HUD.clearInvSlot(item.slot);
                HUD.fillInvSlot(item);
            }
            if(dropped.hasClass('vendorSlotItem')) {
                HUD.clearVendorSlot(item.slot);
                HUD.fillVendorSlot(item);
            }
            if(dropped.hasClass('bankSlotItem')) {
                HUD.clearBankSlot(item.slot);
                HUD.fillBankSlot(item);
            }
        }

        if (dropped.hasClass('lootSlotItem')) {
            var bag = $('#lootBar').data('bag');
            if(occupied) {
                if(item.type === 'cash') {
                    socketHandler.socket.emit('stackItemSlot', {id: item.id, slot: slot.data('slot'), bag: bag.id}, function(response) {
                        if(response.errmsg) {
                            console.error('error stackItemSlot', response.errmsg);
                            // revert!
                            revert();
                        }
                        // otherwise we're successful
                        console.log('loot cash success!', response, item, occupied);
                        HUD.clearLootSlot(item.slot);
                        HUD.clearInvSlot(occupied.slot);
                        HUD.fillInvSlot(response.item); // item should be updated with new "stacked" amount
                        // update playerData (todo: make class methods, like player.getLoot)
                        socketHandler.getPlayerData().items = _.filter(socketHandler.getPlayerData().items, function(i) {
                            return i.slot !== occupied.slot;
                        });
                        socketHandler.getPlayerData().items.push(response.item);
                        HUD.makeCoinBar(true);

                        if (response.loot) {
                            ironbane.player.lootItems = response.loot;
                        }
                    });
                    return;
                } else {
                    // should be blocked already from drag rules...
                    // revert if not?
                }
            } else {
                socketHandler.socket.emit('lootItem', {npcID: ironbane.player.lootUnit.id, switchID: 0, slotNumber: slot.data('slot'), itemID: item.id}, function(reply) {
                    if (!_.isUndefined(reply.errmsg)) {
                        hudHandler.messageAlert(reply.errmsg);

                        // revert transaction!
                        revert();
                        return;
                    }

                    if (reply.items) {
                        socketHandler.getPlayerData().items = reply.items;
                    }

                    if (reply.loot) {
                        ironbane.player.lootItems = reply.loot;
                    }

                    // gotta update the bag too...? or is that being handled by lootFromBag?

                    // redo the whole inv, shouldn't be necessary... punting for now
                    HUD.showInv({slots: 10, items: reply.items});
                    HUD.makeCoinBar(true);

                    soundHandler.Play(_.sample(["bag1"]));
                });
            }
        }

        if (dropped.hasClass('bankSlotItem')) {
            var bank = $('#bankBar').data('bank');
            if (!bank) {
                console.error('bank has gone away!');
                return;
            }
            var bankSlot = item.slot; // before it gets changed
            socketHandler.socket.emit('bankTakeItem', {
                id: bank.id,
                item: item.id,
                slot: slot.data('slot')
            }, function(response) {
                if (response.errmsg) {
                    console.error(response.errmsg);
                    revert();
                } else {
                    // success
                    HUD.clearBankSlot(bankSlot);
                    //the bank is actually going to post receiveItem so no need for further action here
                }
            });
        }

        if (dropped.hasClass('vendorSlotItem')) {
            // here we are buying an item (or trying to) (todo: get price on client side for pre-check)
            var vendor = $('#vendorBar').data('vendor');
            if(!vendor) {
                // we've moved too far or some other reason the vendor left
                console.error('vendor has gone away!');
                // revert!
                revert();
                return;
            }

            socketHandler.socket.emit('buyItem', {vendorId: vendor.id, itemId: item.id, slot: slot.data('slot')}, function(response) {
                if(response.errmsg) {
                    HUD.messageAlert(response.errmsg);
                    // revert! - error message is most likely lack of funds
                    revert();
                    return;
                }

                // success! - all items sent because gold bags will get auto adjusted
                socketHandler.getPlayerData().items = response.items; // todo: factor elsewhere
                HUD.showInv({slots: 10, items: response.items});
                // vendor should be updated
                HUD.clearVendorSlot(item.slot);
                HUD.makeCoinBar(true);
            });
        }

        if (dropped.hasClass('invSlotItem')) {
            // dropping inv on inv means you either are swapping or stacking (gold)
            if(occupied) {
                if(item.type === 'cash' && occupied.type === 'cash') { // later do other stackables
                    HUD.clearInvSlot(item.slot);
                    socketHandler.socket.emit('stackItemSlot', {id: item.id, slot: slot.data('slot')}, function(response) {
                        if(response.errmsg) {
                            console.error('error stackItemSlot', response.errmsg);
                            // revert!
                            revert();
                        }
                        // otherwise we're successful
                        HUD.clearInvSlot(occupied.slot);
                        HUD.fillInvSlot(response.item); // item should be updated with new "stacked" amount
                        HUD.makeCoinBar(true);
                    });
                    return;
                }
                occupied.slot = item.slot;
                item.slot = slot.data('slot');
                HUD.clearInvSlot(item.slot);
                HUD.clearInvSlot(occupied.slot);
                HUD.fillInvSlot(item);
                HUD.fillInvSlot(occupied);
            } else {
                HUD.clearInvSlot(item.slot);
                item.slot = slot.data('slot');
                HUD.fillInvSlot(item);
            }
            // notify server of change
            socketHandler.socket.emit('updateItemSlot', {id: item.id, slot: item.slot}, function(response) {
                if(response.errmsg) {
                    console.error('error updateItemSlot', response.errmsg);
                    // revert!
                    revert();
                }
                // otherwise we're successful and we dont care
            });
        }
    },
    makeLootSlots: function(num) {
        var HUD = this,
            container = $('#lootBar'),
            spaces = num;
        var clickFunction = function() {
                // handle use based on child data
                console.log($(this).attr('id') + " clicked!");
            };
        container.empty();
        for (var x = 0; x < spaces; x++) {
            var slot = $('<div id="ls' + x + '" class="dragon-slot lootBarSlot"></div>');
            slot.data('slot', x);
            container.append(slot);
            // loot is NOT droppable! you may only take it
            slot.click(clickFunction);
        }
    },
    fillLootSlot: function(item) {
        var HUD = this,
            imageUrl = getImageUrlForItem(item);

        var slotSelector = '#ls' + item.slot;
        var itemImg = $('<img src="' + imageUrl + '" class="dragon-item lootSlotItem" />');
        itemImg.data('item', item);
        $(slotSelector).append(itemImg);

        HUD.makeItemHover(itemImg, item);

        itemImg.draggable({
            containment: '#gameFrame',
            revert: 'invalid'
        });
    },
    clearLootSlot: function(slotNum) {
        $('#ls' + slotNum).empty();
    },
    // this happens when someone else nearby loots an item from something you might have open
    updateLoot: function(data) {
        var HUD = this,
            bag = $('#lootBar').data('bag');

        if(bag && bag.id === data.bag) {
            HUD.showLoot({id: data.bag, slots: data.loot.length, items: data.loot});
        }

        if (ironbane.player.canLoot) {
            ironbane.player.lootItems = data.loot;
        }
    },
    showLoot: function(data) {
        //console.log('showLoot', data);
        var HUD = this;
        HUD.makeLootSlots(data.slots);
        $('#lootBar').data('bag', data).show();

        _.each(data.items, function(invItem, index) {
            // set the slot so that it's not the one we dropped it from
            invItem.slot = index;
            HUD.fillLootSlot(invItem);
        });
    },
    hideLoot: function() {
        $('#lootBar').removeData().empty().hide();
    },
    makeVendorSlots: function(num) {
        var HUD = this,
            container = $('#vendorBar'),
            spaces = num;
        var dropFunction = function(e, ui) {
                    _.partial(HUD.onVendorSlotDrop, e, ui, HUD)();
                };
        var dblClickFunction = function() {
                // handle use based on child data
                console.log($(this).attr('id') + " clicked!");
            };
        container.empty();
        for (var x = 0; x < spaces; x++) {
            var slot = $('<div id="vs' + x + '" class="dragon-slot vendorBarSlot"></div>');
            slot.data('slot', x);
            container.append(slot);
            slot.droppable({
                drop: dropFunction,
                greedy: true,
                hoverClass: 'dragon-hover',
                tolerance: 'pointer',
                accept: '.invSlotItem' // only allow inv for sales, no vendor rearranging
            });
            slot.on('dblclick', dblClickFunction);
        }
    },
    fillVendorSlot: function(item) {
        var HUD = this,
            imageUrl = getImageUrlForItem(item);

        var slotSelector = '#vs' + item.slot;
        var itemImg = $('<img src="' + imageUrl + '" class="dragon-item vendorSlotItem" />');
        itemImg.data('item', item);
        $(slotSelector).droppable('disable').append(itemImg);

        HUD.makeItemHover(itemImg, item);

        itemImg.draggable({
            containment: '#gameFrame',
            revert: 'invalid'
        });
    },
    showVendor: function(data) {
        var HUD = this;
        HUD.makeVendorSlots(data.slots);
        $('#vendorBar').data('vendor', data).show();

        _.each(data.items, function(item) {
            HUD.fillVendorSlot(item);
        });
    },
    hideVendor: function() {
        $('#vendorBar').removeData().empty().hide();
    },
    clearVendorSlot: function(slotNum) {
        $('#vs' + slotNum).empty().droppable('enable');
    },
    updateVendor: function(data) {
        var HUD = this,
            vendor = $('#vendorBar').data('vendor');

        if(!vendor) {
            return;
        }

        if(vendor.id === data.id) {
            HUD.showVendor({id: data.id, slots: 10, items: data.loot});
        }

        // not sure if this is necessary
        if(ironbane.player.canLoot) {
            ironbane.player.lootItems = data.loot;
        }
    },
    onVendorSlotDrop: function(e, ui, HUD) {
        // this should be when we are trying to sell something only
        var slot = $(e.target),
            dropped = $(e.toElement),
            item = dropped.data('item'),
            vendor = $("#vendorBar").data('vendor');

        var data = {
            vendorId: vendor.id,
            itemId: item.id,
            slot: slot.data('slot')
        };

        //console.log('onVendorSlotDrop', slot, dropped, item, vendor, data);

        if(item.type === 'cash') {
            HUD.messageAlert('I don\'t want your blood money!');
            // revert! todo: better way to revert
            HUD.clearInvSlot(item.slot);
            HUD.fillInvSlot(item);
            return;
        }

        socketHandler.socket.emit('sellItem', data, function(response) {
            if(response.errmsg) {
                HUD.messageAlert(response.errmsg);
            } else {
                // success!

                // delete the old draggable node
                HUD.clearInvSlot(item.slot);

                if (item.equipped) {
                    if (item.type === 'armor') {
                        ironbane.player.updateAppearance();
                        HUD.makeArmorBar();
                    }
                    if (item.type === 'weapon' || item.type === 'tool') {
                        ironbane.player.updateWeapon(0);
                    }
                }

                // create the item in the vendor
                item.slot = slot.data('slot');
                item.equipped = 0;
                item.owner = vendor.id;
                HUD.fillVendorSlot(item);

                // success! - all items sent because gold bags will get auto adjusted
                HUD.showInv({slots: 10, items: response.items});
                socketHandler.getPlayerData().items = response.items;
                HUD.makeCoinBar(true);
            }
        });
    },
    makeBankSlots: function(num) {
        var HUD = this,
            container = $('#bankBar'),
            spaces = num;

        container.empty();
        var bankDropFunction = function(e, ui) {
                    _.partial(HUD.onBankSlotDrop, e, ui, HUD)();
                };
        var slotClickFunction = function() {
                console.log($(this).attr('id') + " clicked!");
            };
        for (var x = 0; x < spaces; x++) {
            var slot = $('<div id="bs' + x + '" class="dragon-slot bankBarSlot"></div>');
            slot.data('slot', x);
            container.append(slot);
            slot.droppable({
                drop: bankDropFunction,
                greedy: true,
                accept: '.invSlotItem', // only accept items from the item bar
                tolerance: 'pointer',
                hoverClass: 'dragon-hover'
            });
            slot.click(slotClickFunction);
        }
    },
    fillBankSlot: function(item) {
        var HUD = this,
            imageUrl = getImageUrlForItem(item);

        var slotSelector = '#bs' + item.slot;
        var itemImg = $('<img src="' + imageUrl + '" class="dragon-item bankSlotItem" />');
        itemImg.data('item', item);
        $(slotSelector).droppable('disable').append(itemImg);

        HUD.makeItemHover(itemImg, item);

        itemImg.draggable({
            containment: '#gameFrame',
            revert: 'invalid'
        });
    },
    showBank: function(data) {
        var HUD = this;
        HUD.makeBankSlots(data.slots);
        $('#bankBar').data('bank', data).show();

        _.each(data.items, function(vaultItem) {
            HUD.fillBankSlot(vaultItem);
        });
    },
    hideBank: function() {
        $('#bankBar').removeData().empty().hide();
    },
    clearBankSlot: function(slotNum) {
        $('#bs' + slotNum).empty().droppable('enable');
    },
    onBankSlotDrop: function(e, ui, HUD) {
        var slot = $(e.target),
            dropped = $(e.toElement),
            item = dropped.data('item'),
            bank = $("#bankBar").data('bank');

        //console.log('onBankSlotDrop', e, bank, slot, item);

        socketHandler.socket.emit('bankStoreItem', {
            id: bank.id,
            item: item.id,
            slot: slot.data('slot')
        }, function(response) {
            if (response.errmsg) {
                console.error(response.errmsg);
            } else {
                // success!
                // create the item in the bank
                HUD.fillBankSlot(response);
                // delete the old draggable node
                HUD.clearInvSlot(item.slot);
                if (item.equipped) {
                    if (item.type === 'armor') {
                        ironbane.player.updateAppearance();
                        HUD.makeArmorBar();
                    }
                    if (item.type === 'weapon' || item.type === 'tool') {
                        ironbane.player.updateWeapon(0);
                    }
                }
            }
        });
    },
    // when you drop an item on the ground / gameFrame
    onDropItem: function(e, ui, HUD) {
        var dropped = $(e.toElement),
            item = dropped.data('item');

        ironbane.player.dropItem(item);
        HUD.clearInvSlot(item.slot);
        if (item.equipped) {
            if (item.type === 'armor') {
                ironbane.player.updateAppearance();
                HUD.makeArmorBar();
            }
            if (item.type === 'weapon' || item.type === 'tool') {
                ironbane.player.updateWeapon(0);
            }
        }
        if(item.type === 'cash') {
            HUD.makeCoinBar(true);
        }
    },
    makeItemHover: function(targetEl, item) {
        var template = items[item.template],
            content = '',
            itemUrl = getImageUrlForItem(item, 24, 24),
            itemInfo = '';

        function infoRow(label, value) {
            return [
                '<tr class="info-row">',
                    '<td class="label"><strong>', label, '</strong></td>',
                    '<td class="value">', value, '</td>',
                '</tr>'
            ].join('');
        }

        // info section
        switch (template.type) {
            case 'weapon':
                itemInfo += infoRow((item.attr1 > 0 ? 'Damage' : 'Heals'), this.GetStatContent(Math.abs(item.attr1), "misc/heart", 0, false, true));
                itemInfo += infoRow('Attackspeed', template.delay + " seconds");
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
                '<span class="gold-value"> x ', item.price, '</span>'
            ].join('');
            itemInfo += infoRow('Price', priceHtml);
        }

        // for now only show cash value
        if (template.type === 'cash' || debugging) {
            var valueHTML = [
                '<span class="gold-value"> x ', item.value, '</span>'
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
            '<div class="item-info-box">',
                '<div class="item-image-container">',
                    '<img src="', itemUrl, '">',
                '</div>',
                '<div class="item-name ' + item.type + ' ' + item.subtype + ' ' + item.rarity + '" style="margin-top:3px;">', template.name, '</div>',
                itemInfo,
            '</div>'
        ].join('');

        targetEl
            .on('mouseenter', function(e) {
                $("#tooltip").html(content).show()
                    .position({
                        my: 'left bottom',
                        at: 'left-20 top-10',
                        of: targetEl
                    });
            })
            .on('mouseleave', function(e) {
                $("#tooltip").hide();
            });
    },
    ResizeFrame: function() {
        frameWidth = $(window).width();
        frameHeight = $(window).height();
        $('#gameFrame').css('width', frameWidth);
        $('#gameFrame').css('height', frameHeight);

        this.PositionHud();

        if (ironbane.stats && ironbane.stats.domElement) {
            ironbane.stats.domElement.style.top = ($(window).height() - 55) + 'px';
        }
    },
    PositionHud: function() {
        var halfWidth = frameWidth * 0.5,
            halfHeight = frameHeight * 0.5;

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

        // todo: move these to their respective "show" methods
        $('#lootBar, #bankBar, #vendorBar').css('left', (halfWidth - 240) + 'px');
        $('#lootBar, #bankBar, #vendorBar').css('top', ((frameHeight) - 120) + 'px');

        $('#coinBar').css('left', '22px');
        $('#coinBar').css('top', '72px');

        $('#book').css('left', (halfWidth - 230) + 'px');
        $('#book').css('top', (halfHeight - 210) + 'px');

        $('#map').css('left', (halfWidth - 250) + 'px');
        $('#map').css('top', (halfHeight - 250) + 'px');

        $('#alertBox').css('left', (halfWidth - 250) + 'px');
        $('#alertBox').css('top', (halfHeight - 75) + 'px');
        $('#alertBox').hide();

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
            content += '<img src="images/' + prefix + '_full.png" style="' + (!noMarginSpace ? 'margin-right:1px;' : '') + '">';
        }
        // Spawn all the half hearts
        if (halfHeart) {
            if (fullStat) {
                fullStat -= 2;
            }
            content += '<img src="images/' + prefix + '_half.png" style="' + (!noMarginSpace ? 'margin-right:1px;' : '') + '">';
        }

        if (fullStat) {
            for (x = 0; x < fullStat / 2; x++) {
                content += '<img src="images/' + prefix + '_empty.png" style="' + (!noMarginSpace ? 'margin-right:1px;' : '') + '">';
            }
        }

        return content;
    },
    makeCoinBar: function(flash) {
        var self = this,
            el = $('#coinBar'),
            coins = ironbane.player.getTotalCoins(),
            img = 'misc/coin_medium',
            imgFlash = 'misc/coin_medium_flash',
            src = 'images/' + (flash ? imgFlash : img) + '_full.png';

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
                self.makeCoinBar(false);
            }, 50);
        }
    },
    makeHealthBar: function(doFlash) {
        var HUD = this;
        doFlash = doFlash || false;
        var content = this.GetStatContent(ironbane.player.health, doFlash ? 'misc/heart_medium_flash' : 'misc/heart_medium', ironbane.player.healthMax);
        //var content = this.GetStatContent(1, 'misc/heart_medium', 6);
        $('#healthBar').html(content);
        if (doFlash) {
            setTimeout(function() {
                HUD.makeHealthBar();
            }, 50);
        }
    },
    makeArmorBar: function(doFlash) {
        var HUD = this;

        doFlash = doFlash || false;
        var content = this.GetStatContent(ironbane.player.armor, doFlash ? 'misc/armor_medium_flash' : 'misc/armor_medium', ironbane.player.armorMax);
        $('#armorBar').html(content);
        if (doFlash) {
            setTimeout(function() {
                HUD.makeArmorBar();
            }, 50);
        }
    },
    hideAlert: function() {
        var HUD = this;
        $('#alertBox').hide();
        HUD.alertBoxActive = false;

        if (!_.isUndefined(HUD.doYes)) {
            HUD.doYes = undefined;
        }
        if (!_.isUndefined(HUD.doNo)) {
            HUD.doNo = undefined;
        }
    },
    messageAlert: function(message, options, doYes, doNo) {

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
    hideHUD: function() {
        this.hideInv();

        $("#coinBar").hide();
        $("#statBar").hide();
    },
    ShowHUD: function() {
        this.showInv({
            slots: 10,
            items: socketHandler.getPlayerData().items
        });
        hudHandler.makeHealthBar(true);
        $("#coinBar").show();
        $("#statBar").show();
        $('#chatContent').show().trigger('show');
    },
    HideMenuScreen: function() {
        $('#loginBox, #devNews, #sideMenu, #soundToggleBox').hide();
        soundHandler.FadeOut("music/maintheme", 5000);
    },
    ShowMenuScreen: function() {
        $('#sideMenu, #loginBox, #devNews, #soundToggleBox').show();
        $('.dragon-bar, #coinBar, #statBar').hide();
        $('#chatContent').hide().trigger('hide');
        $('#chatContent').scope().$apply(function(scope) {
            scope.messages = [];
        });
        soundHandler.FadeIn("music/maintheme", 5000);
    },
    GetLastCharacterPlayed: function() {
        var lastChar = 0;
        var lastTimeFound = 0;
        _.each(chars, function(character) {
            if (character.lastplayed > lastTimeFound) {
                lastTimeFound = character.lastplayed;
                lastChar = character.id;
            }
        });
        return lastChar;
    },
    MakeCharSelectionScreen: function() {
        var slotsLeft = slotsAvailable - charCount;

        var text = '';
        text += '<div id="charSelect" class="dialog"></div>';

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

        var myChar = _.find(chars, function(_char){
            return _char.id === startdata.characterUsed;
        });

        if (startdata.loggedIn) {
            charSelect += '<button id="btnPrevChar" class="ibutton' + (charCount === 0 ? '_disabled' : '') + '" style="float:left;width:40px">←</button>';
        }

        if (startdata.loggedIn) {
            if (startdata.characterUsed === 0) {
                charSelect += '<button id="btnNewChar" class="ibutton' + (slotsLeft === 0 ? '_disabled' : '') + '" style="width:216px">Create Character</button>';
            } else {

                //charSelect += '<button id="btnEnterChar" class="ibutton" style="width:214px">Enter Ironbane</button>';
                charSelect += '<div style="width:220px;height:40px;float:left;text-align:center;padding-top:10px;">' + myChar.name + '</div>';

                charSelect += '<button id="btnDelChar" class="ibutton" style="float:left;width:40px;position:absolute;left:266px;top:120px">&#10006;</button>';
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
                        if(!_.isUndefined(item)){
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

        $('#btnPrevChar').click(function() {
            if (window.chars && window.chars.length === 0) {
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
            if (window.chars && window.chars.length === 0) {
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
            if (!socketHandler.serverOnline) {
                return;
            }

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
                $('#chatContent').show();
                if (startdata.loggedIn) {
                    tryConnect();
                } else {
                    // Quickly make a character as a guest
                    $.get('/api/guest/characters', function(response) {
                        // should have a more global error handler...
                        // hudHandler.messageAlert(data.errmsg);

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
                        hudHandler.messageAlert(response);
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
                if (confirm !== delChar.name) {
                    hudHandler.messageAlert('Name does not match character name!');
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
                        hudHandler.messageAlert(error.responseText);
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
                        hudHandler.messageAlert(err.responseText);
                        hudHandler.EnableButtons(['btnConfirmLogin', 'btnBack']);
                        if (err.responseText === "Invalid username or password!") {
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
        });

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
                        hudHandler.messageAlert('Registration successful! Please check your e-mail and click the activation link inside so we know you are a real human!', {}, function() {
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
                        hudHandler.messageAlert(err.responseText);
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
            custButtons += '<button id="btnSkinPrev" class="ibutton" style="width:30px;">←</button>';
            custButtons += '<button id="btnSkinNext" class="ibutton" style="width:30px">→</button>';
            $('#charCustomizationButtonsLeft').html(custButtons);

            custButtons = '';
            custButtons += 'Hair<br>';
            custButtons += '<button id="btnHairPrev" class="ibutton" style="width:30px;">←</button>';
            custButtons += '<button id="btnHairNext" class="ibutton" style="width:30px">→</button>';
            custButtons += 'Eyes<br>';
            custButtons += '<button id="btnEyesPrev" class="ibutton" style="width:30px;">←</button>';
            custButtons += '<button id="btnEyesNext" class="ibutton" style="width:30px">→</button>';
            $('#charCustomizationButtonsRight').html(custButtons);

            var custChar = '';
            var constrainCustomizers = function() {
                if (selectedMale) {
                    if (selectedSkin > skinIdMaleEnd) {
                        selectedSkin = skinIdMaleStart;
                    }
                    if (selectedSkin < skinIdMaleStart) {
                        selectedSkin = skinIdMaleEnd;
                    }

                    if (selectedEyes > eyesIdMaleEnd) {
                        selectedEyes = eyesIdMaleStart;
                    }
                    if (selectedEyes < eyesIdMaleStart) {
                        selectedEyes = eyesIdMaleEnd;
                    }

                    if (selectedHair > hairIdMaleEnd) {
                        selectedHair = hairIdMaleStart;
                    }
                    if (selectedHair < hairIdMaleStart) {
                        selectedHair = hairIdMaleEnd;
                    }

                } else {
                    if (selectedSkin > skinIdFemaleEnd) {
                        selectedSkin = skinIdFemaleStart;
                    }
                    if (selectedSkin < skinIdFemaleStart) {
                        selectedSkin = skinIdFemaleEnd;
                    }

                    if (selectedEyes > eyesIdFemaleEnd) {
                        selectedEyes = eyesIdFemaleStart;
                    }
                    if (selectedEyes < eyesIdFemaleStart) {
                        selectedEyes = eyesIdFemaleEnd;
                    }

                    if (selectedHair > hairIdFemaleEnd) {
                        selectedHair = hairIdFemaleStart;
                    }
                    if (selectedHair < hairIdFemaleStart) {
                        selectedHair = hairIdFemaleEnd;
                    }

                }
            };

            var randomizeAppearance = function() {
                if (selectedMale) {
                    selectedSkin = getRandomInt(skinIdMaleStart, skinIdMaleEnd);
                    selectedHair = getRandomInt(hairIdMaleStart, hairIdMaleEnd);
                    selectedEyes = getRandomInt(eyesIdMaleStart, eyesIdMaleEnd);
                } else {
                    selectedSkin = getRandomInt(skinIdFemaleStart, skinIdFemaleEnd);
                    selectedHair = getRandomInt(hairIdFemaleStart, hairIdFemaleEnd);
                    selectedEyes = getRandomInt(eyesIdFemaleStart, eyesIdFemaleEnd);
                }
            };

            var refreshChar = function() {
                constrainCustomizers();

                var cachefile = 'images/characters/cache/' +
                    selectedSkin + '_' + selectedEyes + '_' + selectedHair + '_0_0_0_1.png';

                $('#charSkinLayer').css('background-image', 'url(' + cachefile + ')');
            };

            $('#btnGenderChange').click(function() {
                selectedMale = !selectedMale;

                randomizeAppearance();

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

            randomizeAppearance();

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
                        hudHandler.messageAlert(err.responseText);
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
    tick: function(dTime) {
        var output = '';

        for (var m = 0; m < this.bigMessages.length; m++) {
            var msg = this.bigMessages[m];

            msg.tick(dTime);

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
    showMap: function() {
        $("#map").css("background-image", "url(data/" + terrainHandler.zone + "/map.png" + (isEditor ? "?" + (new Date()).getTime() : "") + ")");
        $("#map").show();
    },
    hideMap: function() {
        $("#map").hide();
    },
    showBook: function(text, page) {

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
                hudHandler.showBook(text, page - 2);
            });
        } else {
            $("#bookFooterLeft").empty();
        }
        if (!_.isUndefined(textArray[page + 2])) {
            $("#bookFooterRight").html('<button id="bookNextPage" class="ibutton_book" style="width:150px">Next Page</button>');
            $("#bookNextPage").click(function() {
                hudHandler.showBook(text, page + 2);
            });
        } else {
            $("#bookFooterRight").empty();
        }
    },
    hideBook: function() {
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