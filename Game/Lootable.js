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
  Init: function(data, loadItems) {

    this.lifeTime = 0.0;

    this._super(data);

    // HACKY HACKY!!! See NPC

    // Set to the default template values
    if( !ISDEF(this.param) ) this.param = this.template.param;


    // END HACKY

    this.loot = [];

    if ( loadItems ) {
      if ( this.param < 10 ) {
        (function(unit) {
          mysql.query(
            'SELECT * FROM ib_items WHERE owner = ?', [unit.id],
            function selectCb(err, results, fields) {
              if (err) throw err;

              // Link the items collection to the bag
              unit.loot = results;
              unit.loot.forEach(function(loot) {
                if(loot.data) {
                  try {
                    loot.data = JSON.parse(loot.data);
                  } catch(e) {
                    // some error parsing JSON, not valid JSON likely...
                    console.log('error parsing JSON for item data', loot);
                  }
                }
              });
            //console.log(results);
            });
        })(this);
      }
      else {
        this.Restock();
      }
    }
  },
  Awake: function() {
    this._super();

  },
  // Hacky....should have its own class
  Restock: function() {
//    log("Restocking...");
    this.loot = [];
    // Load loot from metadata (with percentages!)
    if ( !_.isEmpty(this.data.loot) ) {
      var lootSplit = this.data.loot.split(";");
      for(var l=0;l<lootSplit.length;l++) {
        var item = null;

        var chanceSplit = lootSplit[l].split(":");

        if ( WasLucky100(parseInt(chanceSplit[0], 10) )) {
          item = parseInt(chanceSplit[1], 10);
        }


        if ( item ) {

          if ( !ISDEF(dataHandler.items[item]) ) {
            log("Warning! item "+item+" not found for Lootable "+this.id+"!");
            continue;
          }

          var temp = {
            id: server.GetAValidItemID(),
            template : item,
            slot:l,
            attr1: dataHandler.items[item].attr1,
            equipped: 0
          };

          this.loot.push(temp);
        }
      }
    }

  },
  Tick: function(dTime) {



    this.lifeTime += dTime;

    // Lootbags (<10) are removed while lootable meshes restock
    if ( this.param < 10 ) {
      if ( this.lifeTime > 30 ) {
        this.Remove();
      }
    }
    else {
      if ( this.lifeTime > this.data.respawnTime ) {
        //... restock :)
        this.Restock();
        this.lifeTime = 0;
      }


    }


    this._super(dTime);

  }
});
