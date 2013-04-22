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


var dataPath = clientDir+'plugins/game/data';

var WorldHandler = Class.extend({
  Init: function() {


    // World structure
    // [zone][cx][cz]
    this.world = {};

    this.switches = {};

    this.LoadWorldLight();

    this.awake = false;
    this.hasLoadedWorld = false;


  },
  Awake: function() {


    this.BuildZoneWaypoints();



    // All units ready! Awaken!
    worldHandler.LoopUnits(function(u){
      u.Awake()
    });

    log("World has awaken!");
    this.awake = true;

  //worldHandler.LoadSwitches();
  },
  BuildZoneWaypoints: function() {
    // Load all waypoints!


    var count = 0;
    for(var z in this.world) {
      var subcount = 0;

      // Every zone has their own set of nodes
      this.world[z]["allNodes"] = {};

      for(var cx in this.world[z]) {
        for(var cz in this.world[z][cx]) {
          if ( this.world[z][cx][cz] === undefined ) continue;
          if ( this.world[z][cx][cz]['graph'] === undefined ) continue;
          if ( this.world[z][cx][cz]['graph']['nodes'] === undefined ) continue;

          //this.allNodes = worldHandler.world[this.zone][cx][cz]['graph']['nodes'].concat(this.allNodes);
          for(var x=0;x<this.world[z][cx][cz]['graph']['nodes'].length;x++){
            var node = this.world[z][cx][cz]['graph']['nodes'][x];
            this.world[z]["allNodes"][node['id']] = node;
            count++;
            subcount++;
          }

        }
      }

      log("Loaded "+subcount+" waypoints for zone "+z+"");

    }

    worldHandler.LoopUnits(function(u){
      if ( u instanceof Actor ) {
        u.BuildWaypoints();
      }
    });

    log("Loaded "+count+" waypoints in total");

  },
  Tick: function(dTime) {

    if ( !this.hasLoadedWorld ) return;

    if ( !this.awake ) {
      var hasLoadedUnits = true;
      for(var z in this.world) {
        for(var cx in this.world[z]) {
          for(var cz in this.world[z][cx]) {
            if ( !worldHandler.world[z][cx][cz]["hasLoadedUnits"] ) hasLoadedUnits = false;
          }
        }
      }

      if ( hasLoadedUnits ) this.Awake();
    }

  },
  SaveWorld: function() {


    for(var z in this.world) {
      for(var cx in this.world[z]) {
        for(var cz in this.world[z][cx]) {
          this.SaveCell(z, cx, cz);


        }
      }
    }

  },
  DoFullBackup: function() {
    chatHandler.AnnounceMods("Backing up server...", "blue");

    var deploySh = spawn('sh', [ 'serverbackup.sh' ], {
      //cwd: process.env.HOME + '/myProject',
      cwd: '/root',
      env:_.extend(process.env, {
        PATH: process.env.PATH + ':/usr/local/bin'
      })
    });

    deploySh.stderr.on('data', function (data) {
      chatHandler.AnnounceMods(data, "red");
      //console.log('stderr: ' + data);
    });

    deploySh.on('exit', function (code) {
      chatHandler.AnnounceMods("Backup complete!", "blue");
      //console.log('child process exited with code ' + code);
    });
  },
  CheckWorldStructure: function(zone, cx, cz, checkterrain, tx, tz) {
    if ( ISDEF(zone) && !ISDEF(worldHandler.world[zone]) ) return false;
    if ( ISDEF(cx) && !ISDEF(worldHandler.world[zone][cx]) ) return false;
    if ( ISDEF(cz) && !ISDEF(worldHandler.world[zone][cx][cz]) ) return false;

    if ( ISDEF(checkterrain) && !ISDEF(worldHandler.world[zone][cx][cz]["terrain"]) ) return false;
    if ( ISDEF(tx) && !ISDEF(worldHandler.world[zone][cx][cz]["terrain"][tx]) ) return false;
    if ( ISDEF(tz) && !ISDEF(worldHandler.world[zone][cx][cz]["terrain"][tx][tz]) ) return false;
    return true;
  },
  BuildWorldStructure: function(zone, cx, cz, checkterrain, tx, tz) {
    if ( ISDEF(zone) && !ISDEF(worldHandler.world[zone]) ) worldHandler.world[zone] = {};
    if ( ISDEF(cx) && !ISDEF(worldHandler.world[zone][cx]) ) worldHandler.world[zone][cx] = {};
    if ( ISDEF(cz) && !ISDEF(worldHandler.world[zone][cx][cz]) ) worldHandler.world[zone][cx][cz] = {};
    if ( ISDEF(checkterrain) && !ISDEF(worldHandler.world[zone][cx][cz]["terrain"]) ) worldHandler.world[zone][cx][cz]["terrain"] = {};
    if ( ISDEF(tx) && !ISDEF(worldHandler.world[zone][cx][cz]["terrain"][tx]) ) worldHandler.world[zone][cx][cz]["terrain"][tx] = {};
    if ( ISDEF(tz) && !ISDEF(worldHandler.world[zone][cx][cz]["terrain"][tx][tz]) ) worldHandler.world[zone][cx][cz]["terrain"][tx][tz] = {};
  },
  LoadWorldLight: function() {

    this.world = {};

    walk(dataPath, function(err, results) {
      if (err) throw err;

      for (var r=0;r<results.length;r++) {
        results[r] = results[r].replace(dataPath+"/", "");

        var data = results[r].split("/");

        //log(data);

        var zone = data[0];
        var cx = data[1];
        var cz = data[2];

        var file = data[3];

        if ( !isNumber(zone) ) continue;
        if ( !isNumber(cx) ) continue;
        if ( !isNumber(cz) ) continue;


        worldHandler.BuildWorldStructure(zone, cx, cz);

        // Load navigation graph, even in a light world because we need it
        if ( file == "graph.json" ) {
          try {
            var path = dataPath+"/"+zone+"/"+cx+"/"+cz;
            var stats = fs.lstatSync(path+"/graph.json");

            if (stats.isFile()) {

              worldHandler.world[zone][cx][cz]["graph"] = JSON.parse(fs.readFileSync(path+"/graph.json", 'utf8'));


            }
          }
          catch (e) {
            throw e;
          }
        }


        if ( file != "terrain.dat" ) continue;


        worldHandler.world[zone][cx][cz]["terrain"] = {};
        worldHandler.world[zone][cx][cz]["objects"] = [];
        worldHandler.world[zone][cx][cz]["units"] = [];
        worldHandler.world[zone][cx][cz]["hasLoadedUnits"] = false;


        log("Loaded cell ("+cx+","+cz+") in zone "+zone);


        worldHandler.LoadUnits(zone, cx, cz);
      }


      worldHandler.hasLoadedWorld = true;


    });



  },
  LoopUnits: function(fn) {
    for(var z in worldHandler.world) {
      for(var cx in worldHandler.world[z]) {
        for(var cz in worldHandler.world[z][cx]) {

          if ( ISDEF(worldHandler.world[z][cx][cz]["units"]) ) {

            var units = worldHandler.world[z][cx][cz]["units"];

            for(var u=0;u<units.length;u++) {

              fn(units[u]);

            }

          }
        }
      }
    }
  },
  LoadSwitches: function() {

    this.switches = {};

    mysql.query('SELECT * FROM ib_switches',
      function (err, results, fields) {

        if (err) throw err;

        for(var u=0;u<results.length;u++) {

          var switchdata = results[u];


          this.switches[switchdata.id] = new Switch(switchdata.id, switchdata.output1, switchdata.output2, switchdata.output3, switchdata.output4);

        }

      });



  },
  LoadUnits: function(zone, cellX, cellZ) {


    var worldPos = CellToWorldCoordinates(cellX, cellZ, cellSize);






    (function(zone,cellX,cellZ){
      mysql.query('SELECT * FROM ib_units WHERE zone = ? AND x > ? AND z > ? AND x < ? AND z < ?',
        [zone,(worldPos.x-cellSizeHalf),(worldPos.z-cellSizeHalf),(worldPos.x+cellSizeHalf),(worldPos.z+cellSizeHalf)],
        function (err, results, fields) {

          if (err) throw err;


          for(var u=0;u<results.length;u++) {


            var unitdata = results[u];


            worldHandler.MakeUnitFromData(unitdata);


          }

          worldHandler.world[zone][cellX][cellZ]["hasLoadedUnits"] = true;

        });
    })(zone, cellX, cellZ);




  },
  MakeUnitFromData: function(data) {
    data["id"] = -data["id"];



    if ( typeof data.data == "string" ) {
      data.data = JSON.parse(data.data);
    }

    if ( !ISDEF(dataHandler.units[data.template]) ) {
      log("Warning! Unit template "+data.template+" not found!");
      log("Cleaning up MySQL...");

      mysql.query('DELETE FROM ib_units WHERE template = ?', [data.template], function (err) {
        if (err) throw err;
      });

      return;
    }

    data.template = dataHandler.units[data.template];
    // Depending on the param, load different classes


    var unit = null;

    switch(data.template.type) {
      case UnitTypeEnum.NPC:
      case UnitTypeEnum.MONSTER:
      case UnitTypeEnum.VENDOR:
      case UnitTypeEnum.TURRET:
      case UnitTypeEnum.TURRET_STRAIGHT:
      case UnitTypeEnum.TURRET_KILLABLE:
      case UnitTypeEnum.WANDERER:
        unit = new NPC(data);
        break;
      case UnitTypeEnum.MOVINGOBSTACLE:

        // Convert data rotations to regular members
        data.rotx = data.data.rotX;
        data.roty = data.data.rotY;
        data.rotz = data.data.rotZ;

        unit = new MovingObstacle(data);
        break;
      case UnitTypeEnum.TOGGLEABLEOBSTACLE:

        // Convert data rotations to regular members
        data.rotx = data.data.rotX;
        data.roty = data.data.rotY;
        data.rotz = data.data.rotZ;

        unit = new ToggleableObstacle(data);
        break;
      case UnitTypeEnum.TRAIN:
        unit = new Train(data);
        break;
      case UnitTypeEnum.LEVER:
        unit = new Lever(data);
        break;
      case UnitTypeEnum.TELEPORTENTRANCE:
        unit = new TeleportEntrance(data);
        break;
      case UnitTypeEnum.TELEPORTEXIT:
        unit = new TeleportExit(data);
        break;
      case UnitTypeEnum.MUSICPLAYER:
        unit = new MusicPlayer(data);
        break;
      case UnitTypeEnum.SIGN:

        // Convert data rotations to regular members
        data.rotx = data.data.rotX;
        data.roty = data.data.rotY;
        data.rotz = data.data.rotZ;

        unit = new Sign(data);
        break;
      case UnitTypeEnum.LOOTABLE:

        // Convert data rotations to regular members
        data.rotx = data.data.rotX;
        data.roty = data.data.rotY;
        data.rotz = data.data.rotZ;

        unit = new Lootable(data, true);
        break;
      case UnitTypeEnum.HEARTPIECE:
        unit = new HeartPiece(data);
        break;
      default:
        unit = new Unit(data);
        break;
    }

    return unit;
  },
  LoadCell: function(zone, cellX, cellZ) {
    // Query the entry
    var path = dataPath+"/"+zone+"/"+cellX+"/"+cellZ;

    fsi.mkdirSync(path, 0777, true, function (err) {
      if (err) {
        log("Error:" +err);
      } else {
        log('Directory created');
      }
    });


    if ( fs.existsSync(path+"/terrain.dat") ) {
      try {

        stats = fs.lstatSync(path+"/terrain.dat");


        if (stats.isFile()) {
          var terrain = fs.readFileSync(path+"/terrain.dat", 'utf8');

          var coordsToWorld = CellToWorldCoordinates(cellX, cellZ, cellSize);
          var offset_x = coordsToWorld["x"];
          var offset_z = coordsToWorld["z"];
          var ar = terrain.split(";");

          var count = 0;


          this.world[zone][cellX][cellZ]["terrain"] = {};
          for(var x = offset_x-cellSizeHalf;x<offset_x+cellSizeHalf;x+=worldScale){
            if ( !ISDEF(this.world[zone][cellX][cellZ]["terrain"][x]) ) this.world[zone][cellX][cellZ]["terrain"][x] = {};
            for(var z = offset_z-cellSizeHalf;z<offset_z+cellSizeHalf;z+=worldScale){
              var info = ar[count].split(",");
              this.world[zone][cellX][cellZ]["terrain"][x][z] = {
                t:info[0],
                y:info[1]
              };
              count++;
            }
          }

        }
        else {
          log("Terrain file not found! "+path);
        }

      }
      catch (e) {
        throw e;
      }

      // Load static gameobjects
      try {
        stats = fs.lstatSync(path+"/objects.json");

        if (stats.isFile()) {
          this.world[zone][cellX][cellZ]["objects"] = JSON.parse(fs.readFileSync(path+"/objects.json", 'utf8'));

        }
      }
      catch (e) {
        throw e;
      }

      // Load navigation graph
      try {
        stats = fs.lstatSync(path+"/graph.json");

        if (stats.isFile()) {
          this.world[zone][cellX][cellZ]["graph"] = JSON.parse(fs.readFileSync(path+"/graph.json", 'utf8'));

        }
      }
      catch (e) {
        throw e;
      }

    }


    // Outside of terrain, there are other objects that populate the world
    //
    // Textures that always face the camera
    // Textures that change depending on the angle (Unit-like)
    // Textures that always face the camera and that have multiple sprites to play
    // Textures that are animated (rotating, some vertices moving (grass))
    // Textures that are double-sided but don't face the camera
    // Textures that are single-sided (most simply)
    //
    // 3D objects
    //
    // Particle emitters
    //
    //
    //

    // Maintain a unit list for each cell, for both players and NPC's

    // Preload all NPC's, players come later
    // NPC's should always have static cell positions, players however can change
    // We should check once in a while for players if they changed cell coordinates

    this.world[zone][cellX][cellZ]["units"] = [];

  },
  // <octaves>,<persistence> some discovered values:
  // 1,4, 1-5, 2-2, 4-1, 5-1 -> small hills
  // 2,5 mountains
  // 2,3 somewhat more hillish
  // 3,2 very rough, volcano
  // 3-3 Very mountaneous, hard to navigate
  // 3-4, 3-5, icepeaks :D
  // 4-3 super sharp peaks
  GenerateCell: function(zone, cellX, cellZ, octaves, persistence, scale, tile, heightOffset) {

    tile = tile || 11;
    heightOffset = heightOffset || 0;


    var coordsToWorld = CellToWorldCoordinates(cellX, cellZ, cellSize);

    var offset_x = coordsToWorld["x"];
    var offset_z = coordsToWorld["z"];

    // Generate a cell inside a zone and save it

    var perlin = new ImprovedNoise();
    var quality = 1;
    var r = 1;

    scale = scale | 1.0;



    var halfSize = cellSizeHalf;

    var startTime = (new Date()).getTime();

    // [cell][x][z]
    var cell = {};

    var perlinOffset = 7199254740992;



    for(var x = offset_x-halfSize;x<offset_x+halfSize;x+=worldScale){



      cell[x+''] = {};
      for(var z = offset_z-halfSize;z<offset_z+halfSize;z+=worldScale){

        var h = roundNumber(Noise2D(((x)/(10*scale))+perlinOffset, ((z)/(10*scale))+perlinOffset, octaves, persistence), 2)*scale;
        h += heightOffset;
        worldHandler.BuildWorldStructure(zone, cellX, cellZ, true, x, z);

        this.world[zone][cellX][cellZ]["terrain"][x][z] = {
          t: tile,
          y : h
        };
      }


    }

    this.world[zone][cellX][cellZ]["units"] = [];
    this.world[zone][cellX][cellZ]["objects"] = [];
    this.world[zone][cellX][cellZ]["graph"] = {};


    var endTime = (new Date()).getTime() - startTime;

    log("Generated cell ("+cellX+","+cellZ+") in "+endTime/1000+" seconds");


    this.SaveCell(zone, cellX, cellZ, true);

  },
  SaveCell: function(zone, cellX, cellZ, clearObjects) {


    var doClearObjects = clearObjects || false;

    chatHandler.AnnounceMods("Saving cell "+cellX+", "+cellZ+" in zone "+zone+"...");

    // Instead of saving instantly, we load the cell, overwrite it with the terrain we have, and save it! And empty terrain!

    var buffer_terrain = JSON.parse(JSON.stringify(this.world[zone][cellX][cellZ]["terrain"]));
    var buffer_objects = JSON.parse(JSON.stringify(this.world[zone][cellX][cellZ]["objects"]));
    var buffer_graph = JSON.parse(JSON.stringify(this.world[zone][cellX][cellZ]["graph"]));
    var buffer_units = this.world[zone][cellX][cellZ]["units"];

    this.LoadCell(zone, cellX, cellZ);

    if ( doClearObjects ) {
      this.world[zone][cellX][cellZ]["objects"] = [];
      buffer_objects = [];
    }

    this.world[zone][cellX][cellZ]["graph"] = buffer_graph;
    this.world[zone][cellX][cellZ]["units"] = buffer_units;


    for(var xt in buffer_terrain) {
      for(var zt in buffer_terrain[xt]) {
        if ( !ISDEF( this.world[zone][cellX][cellZ]["terrain"][xt]) ) log("terrain xt undefined");


        if ( ISDEF(buffer_terrain[xt][zt].t) ) {
          this.world[zone][cellX][cellZ]["terrain"][xt][zt].t = buffer_terrain[xt][zt].t;
        }
        if ( ISDEF(buffer_terrain[xt][zt].y) ) {
          this.world[zone][cellX][cellZ]["terrain"][xt][zt].y = buffer_terrain[xt][zt].y;
        }
      }
    }


    for(var o=0;o<buffer_objects.length;o++) {
      this.world[zone][cellX][cellZ]["objects"].push(buffer_objects[o]);
    }

    if ( ISDEF(worldHandler.world[zone][cellX][cellZ]["changeBuffer"]) ) {

      for(var d=0;d<worldHandler.world[zone][cellX][cellZ]["changeBuffer"].length;d++) {

        var obj = worldHandler.world[zone][cellX][cellZ]["changeBuffer"][d];


        var pos = ConvertVector3(obj.pos);
        pos = pos.Round(2);


        var found = false;

        for(var o=0;o<worldHandler.world[zone][cellX][cellZ]["objects"].length;o++) {
          var loopObj = worldHandler.world[zone][cellX][cellZ]["objects"][o];

          if ( pos.x == loopObj.x && pos.y == loopObj.y && pos.z == loopObj.z ) {



            if ( _.isEmpty(obj.metadata) ) {
              delete worldHandler.world[zone][cellX][cellZ]["objects"][o].metadata;
            }
            else {

              if ( _.isUndefined(worldHandler.world[zone][cellX][cellZ]["objects"][o].metadata) ) {
                worldHandler.world[zone][cellX][cellZ]["objects"][o].metadata = {};
              }

              _.extend(worldHandler.world[zone][cellX][cellZ]["objects"][o].metadata, obj.metadata);
            }

            found = true;
            break;
          }
        }


        if ( !found ) {
          log("Could not find object in changeBuffer!");
        }
        else {
          log("Found object in changeBuffer!");
        }



      }
    }

    // Delete the things from the terrain in the deleteBuffer
    if ( ISDEF(worldHandler.world[zone][cellX][cellZ]["deleteBuffer"]) ) {



      for(var d=0;d<worldHandler.world[zone][cellX][cellZ]["deleteBuffer"].length;d++) {

        var data = worldHandler.world[zone][cellX][cellZ]["deleteBuffer"][d];


        data = ConvertVector3(data);
        data = data.Round(2);



        var found = false;

        for(var o=0;o<worldHandler.world[zone][cellX][cellZ]["objects"].length;o++) {
          var obj = worldHandler.world[zone][cellX][cellZ]["objects"][o];


          obj = ConvertVector3(obj);
          obj = obj.Round(2);

          if ( data.x == obj.x && data.y == obj.y && data.z == obj.z ) {
            worldHandler.world[zone][cellX][cellZ]["objects"].splice(o--, 1);
            worldHandler.world[zone][cellX][cellZ]["deleteBuffer"].splice(d--, 1);
            found = true;
            break;
          }
        }


        if ( !found ) {
          log("Could not find object in deleteBuffer!");
        }
        else {
          log("Found object in deleteBuffer!");
        }



      }
    }

    // Query the entry
    var path = dataPath+"/"+zone+"/"+cellX+"/"+cellZ;

    fsi.mkdirSync(path, 0777, true, function (err) {
      if (err) {
        log("Error:" +err);
      } else {
        log('Directory created');
      }
    });

    var coordsToWorld = CellToWorldCoordinates(cellX, cellZ, cellSize);
    var offset_x = coordsToWorld["x"];
    var offset_z = coordsToWorld["z"];
    var ar = []
    for(var x = offset_x-cellSizeHalf;x<offset_x+cellSizeHalf;x+=worldScale){
      for(var z = offset_z-cellSizeHalf;z<offset_z+cellSizeHalf;z+=worldScale){
        var info = this.world[zone][cellX][cellZ]["terrain"][x][z];
        ar.push(info.t+","+info.y);
      }
    }
    var str = ar.join(";");

    fs.writeFileSync(path+"/terrain.dat", str);

    str = JSON.stringify(this.world[zone][cellX][cellZ]["objects"]);
    fs.writeFileSync(path+"/objects.json", str);


    // Clean up the nodes first
    astar.cleanUp(this.world[zone][cellX][cellZ]["graph"]);

    // Rebuild the zone waypoints
    worldHandler.BuildZoneWaypoints();

    str = JSON.stringify(this.world[zone][cellX][cellZ]["graph"]);
    fs.writeFileSync(path+"/graph.json", str);

    log("Saved cell ("+cellX+","+cellZ+") in zone "+zone+"");





    // Clean up
    this.world[zone][cellX][cellZ]["terrain"] = {};
    this.world[zone][cellX][cellZ]["objects"] = [];


  },
  UpdateNearbyUnitsOtherUnitsLists: function(zone, cellX, cellZ) {
    for(var x=cellX-1;x<=cellX+1;x++){
      for(var z=cellZ-1;z<=cellZ+1;z++){
        if ( worldHandler.CheckWorldStructure(zone, x, z) ) {
          for(var u=0;u<worldHandler.world[zone][x][z]["units"].length;u++) {
            worldHandler.world[zone][x][z]["units"][u].UpdateOtherUnitsList();
          }
        }
      }
    }
  },
  FindUnit: function(id) {

    for(var z in worldHandler.world) {
      for(var cx in worldHandler.world[z]) {
        for(var cz in worldHandler.world[z][cx]) {

          if ( ISDEF(worldHandler.world[z][cx][cz]["units"]) ) {

            var units = worldHandler.world[z][cx][cz]["units"];
            for(var u=0;u<units.length;u++) {
              if ( units[u].id == id ) return units[u];
            }
          }
        }
      }
    }
    return null;
  },
  // Only for players!!!!
  FindPlayerByName: function(name) {

    for(var z in worldHandler.world) {
      for(var cx in worldHandler.world[z]) {
        for(var cz in worldHandler.world[z][cx]) {

          if ( ISDEF(worldHandler.world[z][cx][cz]["units"]) ) {

            var units = worldHandler.world[z][cx][cz]["units"];

            for(var u in units) {

              if ( units[u].id < 0 ) continue;

              if ( units[u].name == name ) return units[u];
            }
          }
        }
      }
    }
    return null;
  },
  FindUnitNear: function(id, nearUnit) {

    var zone = nearUnit.zone;
    var cx = nearUnit.cellX;
    var cz = nearUnit.cellZ;


    for(var x=cx-1;x<=cx+1;x++){
      for(var z=cz-1;z<=cz+1;z++){
        if ( !worldHandler.CheckWorldStructure(zone, x, z) ) continue;

        if ( ISDEF(worldHandler.world[zone][x][z]["units"]) ) {

          var units = worldHandler.world[zone][x][z]["units"];

          for(var u=0;u<units.length;u++) {
            if ( units[u].id == id ) return units[u];
          }
        }
      }
    }

    return null;
  },
  DeleteUnit: function(id) {

    for(var z in worldHandler.world) {
      for(var cx in worldHandler.world[z]) {
        for(var cz in worldHandler.world[z][cx]) {

          if ( ISDEF(worldHandler.world[z][cx][cz]["units"]) ) {

            var units = worldHandler.world[z][cx][cz]["units"];

            for(var u=0;u<units.length;u++) {
              if ( units[u].id == id ) {
                worldHandler.world[z][cx][cz]["units"].splice(u, 1);
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  } ,
  GetUnitCell: function(id) {
    for(var z in worldHandler.world) {
      for(var cx in worldHandler.world[z]) {
        for(var cz in worldHandler.world[z][cx]) {

          if ( ISDEF(worldHandler.world[z][cx][cz]["units"]) ) {

            var units = worldHandler.world[z][cx][cz]["units"];

            for(var u=0;u<units.length;u++) {
              if ( units[u].id == id ) {
                return {
                  zone:z,
                  x:cx,
                  z:cz
                };
              }
            }

          }
        }
      }
    }
    return null;
  },
  AutoSaveCell: function(zone, x, z) {
    // Set a timer to auto save this cell
    // If we set the height again, reset the timer
    if ( ISDEF(worldHandler.world[zone][x][z].saveTimer) ) {
      //log("clearTimer");
      clearTimeout(worldHandler.world[zone][x][z].saveTimer);
    }
    worldHandler.world[zone][x][z].saveTimer = setTimeout(
      (function(zone, cx, cz) {
        return function() {
          worldHandler.SaveCell(zone, cx, cz);
        };
      })(zone, x, z), 5000);
  },
  GetWaypointID: function(zone) {
    if ( worldHandler.world[zone] === undefined ) return -1;
    if ( worldHandler.world[zone]["waypointIDCount"] === undefined || worldHandler.world[zone]["waypointIDCount"] < 100) {
      worldHandler.world[zone]["waypointIDCount"] = 0;
      for(var cx in worldHandler.world[zone]) {
        for(var cz in worldHandler.world[zone][cx]) {
          if ( worldHandler.world[zone][cx][cz]['graph'] !== undefined ) {
            if ( worldHandler.world[zone][cx][cz]['graph']['nodes'] !== undefined ) {
              for(var n=0;n<worldHandler.world[zone][cx][cz]['graph']['nodes'].length;n++) {
                if ( worldHandler.world[zone][cx][cz]['graph']['nodes'][n]['id'] > worldHandler.world[zone]["waypointIDCount"] ) {
                  worldHandler.world[zone]["waypointIDCount"] = worldHandler.world[zone][cx][cz]['graph']['nodes'][n]['id'];
                }
              }
            }
          }
        }
      }
    }
    return ++worldHandler.world[zone]["waypointIDCount"];
  }
});

var worldHandler = new WorldHandler();

