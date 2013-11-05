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
var MAX_LOOTABLE_LIFETIME = 30;

var Lootable = Unit.extend({
    lifeTime: 0,
    Init: function(data, loadItems) {
        this._super(data);

        // HACKY HACKY!!! See NPC
        // Set to the default template values
        if (_.isUndefined(this.param)) {
            this.param = this.template.param;
        }
        // END HACKY


        this.loot = [];

        if (loadItems) {
            if (this.param < 10) {
                this.loadItems();
            } else {
                this.Restock();
            }
        }
    },
    loadItems: function() {
        var self = this;

        return itemService.getAllByOwner(self.id).then(function(items) {
            self.loot = items;
        }, function(err) {
            console.log('error getting items for lootable: ', self.id, ' >> ', err);
            self.loot = [];
        });
    },
    Awake: function() {
        this._super();
    },
    Restock: function() {
        //    log("Restocking...");
        this.loot = [];
        // Load loot from metadata (with percentages!)
        if (!_.isEmpty(this.data.loot)) {
            var lootSplit = this.data.loot.split(";");
            for (var l = 0; l < lootSplit.length; l++) {
                var templateId = null;
                var chanceSplit = lootSplit[l].split(":");

                if (WasLucky100(parseInt(chanceSplit[0], 10))) {
                    templateId = parseInt(chanceSplit[1], 10);
                }

                if (templateId) {
                    if (_.isUndefined(dataHandler.items[templateId])) {
                        log("Warning! item template" + templateId + " not found for Lootable " + this.id + "!");
                        continue;
                    }

                    var item = new Item(dataHandler.items[templateId], {
                        slot: l
                    });
                    this.loot.push(item);
                }
            }
        }
    },
    Tick: function(dTime) {
        this.lifeTime += dTime;

        // Lootbags (<10) are removed while lootable meshes restock
        if (this.param < 10) {
            if (this.lifeTime > MAX_LOOTABLE_LIFETIME) {
                this.Remove();
            }
        } else {
            if (this.lifeTime > this.data.respawnTime) {
                //... restock :)
                this.Restock();
                this.lifeTime = 0;
            }
        }
        this._super(dTime);
    }
});