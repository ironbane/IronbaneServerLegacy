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
var State = require('../state'),
    Item = require('../../../entity/item'),
    ItemTemplateService = require('../../../services/itemTemplate'),
    _ = require('underscore');

var SellMerchandise = State.extend({
    restock: function(unit, force) {
        //unit.SetWeaponsAndLoot();

        // todo: check through current stock and determine what player items to keep?

        var vendor = this,
            currentStock = unit.loot,
            usedSlots = _.pluck(currentStock, 'slot'),
            needFill = _.difference(_.range(10), usedSlots);

        // force a full restock and clear
        if(force) {
            needFill = _.range(10);
            unit.loot = [];
        }

        _.each(needFill, function(slot) {
            var restocked;

            if(vendor.stock[slot]) {
                restocked = new Item(vendor.stock[slot], {
                    slot: slot,
                    owner: unit.id
                });
                restocked.price = restocked.value;
                if(unit.data && unit.data.sellPercentage) {
                    restocked.price = Math.max(Math.floor(restocked.value * unit.data.sellPercentage), 0.01);
                }

                unit.loot.push(restocked);
            }
        });

        unit.EmitNearby("updateVendor", {id: unit.id, loot: unit.loot}, 20, true);
    },
    enter: function(unit) {
        //console.log('SellMerchandise:enter ', unit.id, unit.data, unit.template);

        var vendor = this,
            loot;

        // if we have JSON loot use that otherwise fall back to template
        if (unit.data && !_.isEmpty(unit.data.loot)) {
            loot = unit.data.loot;
        } else if (!_.isEmpty(unit.template.loot)) {
            loot = unit.template.loot;
        }

        if(loot) {
            loot = loot.split(';');
        } else {
            console.log('WARNING: Vendor with no loot! ', unit.id, unit.template.name);
            loot = [];
        }

        // this will be the item templates that are available for restocking
        this.stock = [];

        _.each(loot, function(templateId) {
            ItemTemplateService.getById(templateId).then(function(template) {
                vendor.stock.push(template);
            });
        });

        if(unit.data && unit.data.restock) {
            this.restockTime = unit.data.restock;
        } else {
            this.restockTime = 300.0;
        }
        this.restockTimer = this.restockTime;
    },
    execute: function(unit, dTime) {
        this.restockTimer -= dTime;

        if (this.restockTimer <= 0) {
            this.restockTimer = this.restockTime;
            this.restock(unit);
        }
    }
});

module.exports = SellMerchandise;