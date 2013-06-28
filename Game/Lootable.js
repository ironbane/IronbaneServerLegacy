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

var Lootable = Unit.extend({
    lifeTime: 0,
    loot: [],
    Init: function(data, loadItems) {
        this._super(data);

        // HACKY HACKY!!! See NPC
        // Set to the default template values
        if (!ISDEF(this.param)) {
          this.param = this.template.param;
        }
        // END HACKY

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
        mysql.query('SELECT * FROM ib_items WHERE owner = ?', [self.id], function(err, results) {
            if(err) {
                throw 'error fetching items ' + err;
            }

            _.each(results, function(loot) {
                // find a template
                var template = dataHandler.items[loot.template];
                if(template) {
                    if (loot.data) {
                        try {
                            loot.data = JSON.parse(loot.data);
                        } catch (e) {
                            // some error parsing JSON, not valid JSON likely...
                            console.log('error parsing JSON for item data', loot);
                        }
                    }
                    // add new item, DB values take precendence over item's Init
                    self.loot.push(new Item(template, loot));
                } else {
                    log('warning no template found for item: ' + loot.id);
                }
            });
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
                    if (!ISDEF(dataHandler.items[templateId])) {
                        log("Warning! item " + templateId + " not found for Lootable " + this.id + "!");
                        continue;
                    }

                    var item = new Item(dataHandler.items[templateId], {slot: l});
                    this.loot.push(item);
                }
            }
        }
    },
    Tick: function(dTime) {
        this.lifeTime += dTime;

        // Lootbags (<10) are removed while lootable meshes restock
        if (this.param < 10) {
            if (this.lifeTime > 30) {
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