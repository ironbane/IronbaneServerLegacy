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

var Bank = Trigger.extend({
    Init: function(data) {
        this._super(data);

        this.vault = [];

        // this should prolly be super fast,
        // however maybe there is a chance that we won't have loaded by the time someone requests the bank?
        this.loadItems();

        this.range = 2; // right on top of it?

        // default to a 10 slotter
        this.slots = (this.data && this.data.slots) ? this.data.slots : 10;
    },
    // the bank will hold all items for all players as the owner
    loadItems: function() {
        var self = this;

        return itemService.getAllByOwner(self.id).then(function(items) {
            self.vault = items;
        }, function(err) {
            console.log('error getting items for bank: ', self.id, ' >> ', err);
            self.vault = [];
        });
    },
    getItemsForPlayer: function(playerId) {
        return _.filter(this.vault, function(item) {
            return item.data.actualOwner === playerId;
        });
    },
    storeItem: function(itemId, player, slot) {
        if(_.isUndefined(slot)) {
            slot = -1;
        }

        var bank = this;

        // make sure the player is AT the bank!
        if(!_.find(bank.guests, function(guest) {
            return guest.id === player.id;
        })) {
            return 'player not at the bank!!';
        }

        // slot validation
        if(slot > bank.slots - 1 || slot < 0) {
            return 'invalid slot!';
        }

        if(_.find(bank.getItemsForPlayer(player.id), function(i) {
            return i.slot === slot;
        })) {
            return 'slot not available!';
        }

        var item = player.getItemById(itemId);
        if(item) {
            // first get this out of the player's array
            player.removeItem(item);

            item.owner = bank.id;
            item.equipped = 0;
            item.slot = slot;
            if(!item.data) {
                item.data = {};
            }
            item.data.actualOwner = player.id;

            bank.vault.push(item);

            // save to DB
            itemService.persist(item);

            return item; // todo: dont send _persistID
        } else {
            // player doesn't have the item?
            return 'item not in player inventory!';
        }
    },
    takeItem: function(itemId, player, slot) {
        var bank = this;
        var item = _.find(bank.vault, function(i) {
            return i.id === itemId;
        });

        if(item) {
            if(item.data.actualOwner !== player.id) {
                // trying to jack another player's items!!
                return 'not owner!';
            }

            // actually add item to player's inv
            if(player.addItem(item, slot) !== true) {
                return 'no free slots on player!';
            }

            item.owner = player.id;
            delete item.data.actualOwner;

            bank.vault = _.without(bank.vault, item);

            // save the item to db
            itemService.persist(item);

            return item;
        } else {
            // bank doesn't have this item, why did the client request it?
            return 'item not found in bank!';
        }
    },
    onEnter: function(unit) {
        var bank = this;

        console.log('bank onEnter!: ', unit.id, ' ', unit.isPlayer());

        if(!unit.isPlayer()) {
            return;
        }

        if(!unit.socket) {
            console.warn('player like unit with no socket!!!', unit.id);
        } else {
            unit.socket.emit('openBank', {
                id: bank.id,
                slots: bank.slots,
                items: bank.getItemsForPlayer(unit.id)
            });
        }
    },
    onExit: function(unit) {
        var bank = this;

        if(!unit.socket) {
            if(unit.isPlayer()) {
                console.warn('player like unit with no socket!!!', unit.id);
            }
        } else {
            unit.socket.emit('closeBank', {
                id: bank.id
            });
        }
    },
    onTick: function(unit) {
        // do nothing, but we still need to override the trigger's method
        return;
    }
});