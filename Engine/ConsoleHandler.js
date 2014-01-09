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

// var Cells = require('./zones').Cells;

var ConsoleHandler = Class.extend({
  Init: function() {
    this.AccessLevel = {
      GUEST : 0,
      PLAYER : 1,
      EDITOR : 2,
      ADMIN : 3
    };

    this.ResetAccess();

    this.commands = {};

    this.InitCommands();
  },
  InitCommands: function() {
    this.AddCommand(this.AccessLevel.GUEST, ["generatecell","gc"], "Generates a cell inside a zone", "zone cellX cellZ", "1 0 0", function (params) {

      worldHandler.GenerateCell(params[0], params[1], params[2]);
    });
    this.AddCommand(this.AccessLevel.GUEST, ["sw","saveworld"], "Save the world", "", "", function (params) {

      worldHandler.SaveWorld();
    });
    this.AddCommand(this.AccessLevel.GUEST, ["generatecellrange","gcr"], "Generates a cell range inside a zone, starting from (0,0)", "zone range octaves persistence scale", "1 0 2 5 1.0", function (params) {

        var startTime = (new Date()).getTime();

        var promises = []; 
        for(var x=-params[1];x<=params[1];x++){
            for(var z=-params[1];z<=params[1];z++){
                promises.push(worldHandler.GenerateCell(params[0], x, z, params[2], params[3], params[4]));
            }
        }

        Q.all(promises).then(function() { 

            var endTime = (new Date()).getTime() - startTime;

            log("Cell range generation complete! Took "+endTime/1000+" seconds");

        });


    });

    this.AddCommand(this.AccessLevel.GUEST, ["clearcharacterimages","cci"], "Clear character images", "", "", function (params) {

      log("Starting characters cleanup...");
      var charPath = clientDir+'images/characters';

      // Read the directory
      fs.readdir(charPath, function (err, list) {
        // Return the error if something went wrong
        if (err) throw err;

        // For every file in the list
        list.forEach(function (file) {
          // Full path of that file
          var path = charPath + "/" + file;
          // Get the file's stats
          if ( file != "base" ) {
            log(file);
            //fs.rmdirSync(path);
            // Recursively delete the entire sub-tree of a directory, then kill the directory
            wrench.rmdirSyncRecursive(path, function(err){
              if(err)throw err;
            });
          //fs.rmdirSync(file);
          }



        // fs.rmdirSync(path);
        });
      });

      mysql.query('TRUNCATE TABLE ib_characters');

      log("All characters cleared!");
    });

    this.AddCommand(this.AccessLevel.GUEST, ["clearzonedata","czd"], "Clear zone data", "", "", function (params) {

      if ( !params[0] ) {
        log("Need zone!");
        return;
      }

      log("Starting zone cleanup...");
      var charPath = clientDir+'data/'+params[0];


      // Read the directory
      fs.readdir(charPath, function (err, list) {
        // Return the error if something went wrong
        if (err) throw err;

        // For every file in the list
        list.forEach(function (file) {
          // Full path of that file
          var path = charPath + "/" + file;
          // Get the file's stats

          log(file);

          // Recursively delete the entire sub-tree of a directory, then kill the directory
          wrench.rmdirSyncRecursive(path, function(err){
            if(err)throw err;
          });

        });
      });

      log("Zone data cleared!");
    });


    this.AddCommand(this.AccessLevel.GUEST, ["log"], "Log variable", "string", "", function(params) {
      if (!params) {
        log('log what?');
      } else {
        log(eval(params[0]));
      }
    });

    this.AddCommand(this.AccessLevel.GUEST, ["items"], "Log variable", "string", "", function (params) {

      worldHandler.getNPCs()
          .then(function(npcs) {

              _.each(npcs, function(unit) {

                  if(!_.isUndefined(unit.loot)) {

                      log('Loot of ' + unit.template.name);
                      console.log(unit.loot);

                  }

              });

              return worldHandler.getPlayers();

          })
          .then(function(players) {

              _.each(players, function(unit) {

                  log('Items of ' + unit.name);
                  console.log(unit.items);

              });
              
          });

    });

    this.AddCommand(this.AccessLevel.GUEST, ["uss"], "Unit stress test", "", "", function (params) {

      // Stress unit test ;)


      for(var x=0;x<10000;x++){

        var unitdata = {
          id:(x+1000),
          name:"Bot"+x,
          x:getRandomInt(-50, 50),
          y:0,
          z:getRandomInt(-50, 50),
          zone:1,
          type:1,
          param:0,
          size:1.0
        };

        // Load negative ID's
        unitdata.id = -unitdata.id;

        //y
        //log(unitdata);

        var unit = new NPC(unitdata);
      }

    });
    //
    // Forum & site maintenance
    //

    this.AddCommand(this.AccessLevel.GUEST, ["cfb"], "Clear forum board", "boardId time", "", function (params) {

      console.log(params);
      mysql.query('SELECT * FROM forum_boards WHERE id = ?', [params[0]],
        function (err, results, fields) {
          if (err) throw err;



          _.each(results, function(result) {


            mysql.query('SELECT * FROM forum_topics WHERE board_id = ? AND time < ?', [result.id,params[1]],
              function (err, results, fields) {
                if (err) throw err;


                _.each(results, function(result) {

                  mysql.query('DELETE FROM forum_topics WHERE id = ?', [result.id],
                    function (err, results, fields) {
                      if (err) throw err;

                    });

                  mysql.query('DELETE FROM forum_posts WHERE topic_id = ?', [result.id],
                    function (err, results, fields) {
                      if (err) throw err;

                    });

                });

            });
          });
        });


    });


    this.AddCommand(this.AccessLevel.GUEST, ["status"], "Server status", "string", "", function (params) {

      var sockets = io.sockets.clients();
      log("Players connected: "+sockets.length);

      var count = 0;
      for(var s=0;s<sockets.length;s++) {
        count++;
        log(""+count+": "+(sockets[s].unit?"Unit attached":"No unit attached")+"");
      }

      worldHandler.getUnits()
         .then(function(units) {

             var unitsLoaded = units.length;
             var zonesLoaded = _.pluck(units, 'zone').length;

             var cellsLoaded = _.chain(units)
                 .map(function(unit) {
                     return Cells.toCellCoordinates(unit.position.x, unit.position.z); 
                 })
                 .reduce(function(coord, memo) { //remove duplicates
                     return _.filter(memo, function(coordCompare) {
                        return coord.x !== coordCompare.x &&
                               coord.z !== coordCompare.z;
                     });
                 }, [])
                 .value()
                 .length;
                    

             log('Zones loaded: '+zonesLoaded);
             log('Cells loaded: '+cellsLoaded);
             log('Units loaded: '+unitsLoaded);
             log('Average ticktime: '+endTime);

         }); 

    });

  //log(this.commands);
  },
  AddCommand: function(accessLevel, name, description, paramsyntax, paramdefaults, command) {
    //this.commands.push(new Command(accessLevel, name, description, paramsyntax, command));
    for(var c=0;c<name.length;c++) {
      this.commands[name[c]] = new ConsoleCommand(accessLevel, name[c], description, paramsyntax, paramdefaults, command);
    }

  },
  SetAccess: function(level) {
    this.accessLevel = level;
  },
  ResetAccess: function() {
    this.accessLevel = this.AccessLevel.GUEST;
  },
  exec: function(string) {
    var params = string.split(/(".*?")/);

    var realparams = [];
    for (var p = 0; p < params.length; p++) {
      var param = params[p];

      param = param.trim();

      if (param === '') continue;


      if (param.indexOf('"') === 0) {
        realparams = realparams.concat([param.replace(/\"/g, '')]);
      } else {
        realparams = realparams.concat(param.split(' '));
      }

    }

    var command = realparams[0];

    realparams.shift();

    if (command in this.commands) {
      this.commands[command].Exec(realparams);
    } else {
      console.log("That command does not exist!");
    }

    this.ResetAccess();
  }
});

var consoleHandler = new ConsoleHandler();
