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
/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var ObjectPlacerModeEnum = {
  PLACE : 0,
  DELETE : 1
};


var EditorGUI = function() {

  this.globalEnable = !_.isUndefined(localStorage.globalEnable) ? (localStorage.globalEnable === 'true') : false;
  this.globalEnable = false;


  // Cheats
  this.chFlyMode = !_.isUndefined(localStorage.chFlyMode) ? (localStorage.chFlyMode === 'true') : false;
  this.chClimb = !_.isUndefined(localStorage.chClimb) ? (localStorage.chClimb === 'true') : false;
  this.chSpeed = !_.isUndefined(localStorage.chSpeed) ? (localStorage.chSpeed === 'true') : false;
  this.chGodMode = !_.isUndefined(localStorage.chGodMode) ? (localStorage.chGodMode === 'true') : false;
  this.chInvisibleByMonsters = !_.isUndefined(localStorage.chInvisibleByMonsters) ? (localStorage.chInvisibleByMonsters === 'true') : false;
  this.ch999Damage = !_.isUndefined(localStorage.ch999Damage) ? (localStorage.ch999Damage === 'true') : false;
  this.chDevNinja = !_.isUndefined(localStorage.chDevNinja) ? (localStorage.chDevNinja === 'true') : false;
  this.chForceDay = !_.isUndefined(localStorage.chForceDay) ? (localStorage.chForceDay === 'true') : false;
  this.chForceNight = !_.isUndefined(localStorage.chForceNight) ? (localStorage.chForceNight === 'true') : false;
  this.chSunOffset = 0;
  this.chFOV = 75;


  this.itemCollection = _.pluck(items, 'name').sort();
  this.chItemName = this.itemCollection[0];
  this.chGiveItem = function() {
    socketHandler.socket.emit('chatMessage', {
      message: '/giveitem "' + levelEditor.editorGUI.chItemName + '"'
    });
  };

  this.chGiveCoins = function() {
    socketHandler.socket.emit('chatMessage', {
      message: '/givecoins 100'
    });
  };

  this.opShowDebug = !_.isUndefined(localStorage.opShowDebug) ? (localStorage.opShowDebug === 'true') : true;

  this.opRestartServer = function() {
    socketHandler.socket.emit('shutdown');

    setTimeout(function(){location.reload();}, 7000);
  };

  this.opBackupServer = function() {
    socketHandler.socket.emit('backup');
  };

  this.opReloadData = function() {
    socketHandler.socket.emit('opReloadData');
  };

  this.pmCharacterName = "";
  this.pmAction = 0;
  this.pmHours = 1;
  this.pmReason = "";

  this.pmExecute = function() {
    socketHandler.socket.emit('pmManage', {
      action: parseInt(levelEditor.editorGUI.pmAction, 10),
      characterName: levelEditor.editorGUI.pmCharacterName,
      reason: levelEditor.editorGUI.pmReason,
      hours: levelEditor.editorGUI.pmHours
    });
  };

  setTimeout(function(){
    socketHandler.socket.emit('chGodMode', levelEditor.editorGUI.chGodMode);
    socketHandler.socket.emit('chInvisibleByMonsters', levelEditor.editorGUI.chInvisibleByMonsters);
    socketHandler.socket.emit('ch999Damage', levelEditor.editorGUI.ch999Damage);
  }, 2000);

  this.enableWorldPainter = false;

  this.selectedTile = 1;

  // Object placer mode
  this.opMode = ObjectPlacerModeEnum.PLACE;

  // Model placer mode
  this.mpTransformMode = false;
  this.selectModel = firstOfObject(ModelEnum);
  this.mpRotX = 0;
  this.mpRotY = 0;
  this.mpRotZ = 0;
  this.mpIgnoreOtherModels = false;
  this.mpIgnoreBoundingBox = false;
  this.mpGridSnap = true;

  // Entity placer mode
  this.epmoMesh = firstOfObject(ModelEnum);
  this.epmoMovementType = firstOfObject(MovingObstacleMovementTypeEnum);
  this.epmoSpeedMultiplier = 1.0;
  this.epmoDistanceMultiplier = 1.0;
  this.epmoAdd = function() {
    socketHandler.socket.emit('addNPC', {
      position: ironbane.player.position,
      template: movingObstacleTemplate,
      param: levelEditor.editorGUI.epmoMesh,
      data: {
        movementType:parseInt(levelEditor.editorGUI.epmoMovementType, 10),
        speedMultiplier:parseFloat(levelEditor.editorGUI.epmoSpeedMultiplier),
        distanceMultiplier:parseFloat(levelEditor.editorGUI.epmoDistanceMultiplier),
        rotY: ironbane.player.rotation.y
      }
    });
  };

  this.eptoMesh = firstOfObject(ModelEnum);
  this.eptoMovementType = firstOfObject(ToggleableObstacleMovementTypeEnum);
  this.eptoStartOpen = false;
  this.eptoSpeedMultiplier = 1.0;
  this.eptoDistanceMultiplier = 1.0;
  this.eptoAdd = function() {
    socketHandler.socket.emit('addNPC', {
      position: ironbane.player.position,
      template: toggleableObstacleTemplate,
      param: levelEditor.editorGUI.eptoMesh,
      data: {
        movementType:parseInt(levelEditor.editorGUI.eptoMovementType, 10),
        speedMultiplier:parseFloat(levelEditor.editorGUI.eptoSpeedMultiplier),
        distanceMultiplier:parseFloat(levelEditor.editorGUI.eptoDistanceMultiplier),
        rotY: ironbane.player.rotation.y,
        startOpen : levelEditor.editorGUI.eptoStartOpen
      }
    });
  };

  this.eptrMesh = firstOfObject(ModelEnum);
  this.eptrScriptName = "";
  this.eptrAdd = function() {
    // Location doesn't matter, will auto teleport to first waypoint
    socketHandler.socket.emit('addNPC', {
      position: ironbane.player.position,
      template: trainTemplate,
      param: levelEditor.editorGUI.eptrMesh,
      data: {
        scriptName:levelEditor.editorGUI.eptrScriptName
      }
    });
  };

  this.eptAddExit = function() {
    socketHandler.socket.emit('addNPC', {
      position: ironbane.player.position,
      template: teleportExitTemplate,
      data: {
        invisible: levelEditor.editorGUI.eptInvisible
      }
    });
  };

  this.eptTargetExit = 0;
  this.eptInvisible = false;
  this.eptAddEntrance = function() {
    socketHandler.socket.emit('addNPC', {
      position: ironbane.player.position,
      template: teleportEntranceTemplate,
      data: {
        targetExit: levelEditor.editorGUI.eptTargetExit,
        invisible: levelEditor.editorGUI.eptInvisible
      }
    });
  };

  this.eplSwitchNumber = 0;
  this.eplAdd = function() {
    socketHandler.socket.emit('addNPC', {
      position: ironbane.player.position,
      template: leverTemplate,
      data: {
        switchNumber: parseInt(levelEditor.editorGUI.eplSwitchNumber, 10)
      }
    });
  };

  this.ephpAdd = function() {
    socketHandler.socket.emit('addNPC', {
      position: ironbane.player.position,
      template: heartPieceTemplate
    });
  };

  this.epsType = firstOfObject(SignTypeEnum);
  this.epsText = "";
  this.epsFontSize = 20;
  this.epsAdd = function() {
    socketHandler.socket.emit('addNPC', {
      position: ironbane.player.position,
      template: signTemplate,
      param: levelEditor.editorGUI.epsType,
      data: {
        text: levelEditor.editorGUI.epsText,
        fontSize: levelEditor.editorGUI.epsFontSize,
        rotY: ironbane.player.rotation.y
      }
    });
  };

  this.epWaypointName = 'waypoint';
  this.epwAdd = function() {
      socketHandler.socket.emit('addNPC', {
          position: ironbane.player.position,
          template: waypointTemplate,
          data: {
              name: levelEditor.editorGUI.epWaypointName
          }
      });
  };

  this.epTriggerName = 'trigger';
  this.epTriggerScript = '';
  this.epTriggerRange = 5;
  this.epTriggerInterval = 3;
  this.epTriggerAdd = function() {
      socketHandler.socket.emit('addNPC', {
          position: ironbane.player.position,
          template: triggerTemplate,
          data: {
              name: levelEditor.editorGUI.epTriggerName,
              script: levelEditor.editorGUI.epTriggerScript,
              range: levelEditor.editorGUI.epTriggerRange,
              triggerInterval: levelEditor.editorGUI.epTriggerInterval
          }
      });
  };

    // CONFIGURE BANK UNIT
    this.epBankName = 'bank';
    this.epBankSlots = 10;
    this.epBankMesh = firstOfObject(ModelEnum);
    this.epBankAdd = function() {
        socketHandler.socket.emit('addNPC', {
            position: ironbane.player.position,
            template: bankTemplateId,
            data: {
                name: levelEditor.editorGUI.epBankName,
                slots: levelEditor.editorGUI.epBankSlots,
                mesh: levelEditor.editorGUI.epBankMesh,
                rotY: ironbane.player.rotation.y
            }
        });
    };

    this.eplmMesh = firstOfObject(ModelEnum);
    this.eplmLootItems = "";
    this.eplmRespawnTime = 300;
    this.eplmAdd = function() {
        socketHandler.socket.emit('addNPC', {
            position: ironbane.player.position,
            template: lootableMeshTemplate,
            param: levelEditor.editorGUI.eplmMesh,
            data: {
                loot: levelEditor.editorGUI.eplmLootItems,
                respawnTime: levelEditor.editorGUI.eplmRespawnTime,
                rotY: ironbane.player.rotation.y
            }
        });
    };


  this.epmpMusicPiece = "";
  this.epmpRange = 100;
  this.epmpAdd = function() {
    socketHandler.socket.emit('addNPC', {
      position: ironbane.player.position,
      template: musicPlayerTemplate,
      param: 0,
      data: {
        musicPiece:levelEditor.editorGUI.epmpMusicPiece,
        range: levelEditor.editorGUI.epmpRange
      }
    });
  };


  // NPC editor mode
  this.neDeleteMode = false;


  // Model placer
  this.enableModelPlacer = false;

  // Model painter
  this.enableModelPainter = false;
  this.mpClearMode = false;

  // NPC editor
  this.enableNPCEditor = false;


  this.npcID = 0;

  this.npcTemplate = (function(){
      var first = null;
      _.each(unitTemplates, function(val, key){
        if ( !first ) first = key;
      });
      return first;
    })();

  this.npcParam = 0;


  this.tpPlayerName = socketHandler.getPlayerData().name;
  this.tpZone = terrainHandler.zone;
  this.tpTargetPosX = 0;
  this.tpTargetPosY = 0;
  this.tpTargetPosZ = 0;
  this.tpTargetPlayerName = "";

  this.tpSetCurrentPos = function() {

    levelEditor.editorGUI.tpTargetPosX = ironbane.player.position.x;
    levelEditor.editorGUI.tpTargetPosY = ironbane.player.position.y;
    levelEditor.editorGUI.tpTargetPosZ = ironbane.player.position.z;

    for (var i=0;i<levelEditor.editorGUI.gui.__folders['Teleport'].__controllers.length;i++) {
      levelEditor.editorGUI.gui.__folders['Teleport'].__controllers[i].updateDisplay();
    }

  };

  this.tpTeleport = function() {

    socketHandler.socket.emit('teleport', {
      pos: new THREE.Vector3(levelEditor.editorGUI.tpTargetPosX, levelEditor.editorGUI.tpTargetPosY, levelEditor.editorGUI.tpTargetPosZ),
      name: levelEditor.editorGUI.tpPlayerName,
      targetName: levelEditor.editorGUI.tpTargetPlayerName,
      zone: levelEditor.editorGUI.tpZone
    }, function(reply) {
      if ( !_.isUndefined(reply.errmsg) ) {
        hudHandler.messageAlert(reply.errmsg);
        return;
      }
    });

  };

  this.addNPC = function() {
    // Send a request to add an NPC on our position with our rotation
    // As well as all the editor data
    // Add locally

    socketHandler.socket.emit('addNPC', {
      position: ironbane.player.position,
      roty: ironbane.player.rotation.y,
      template: unitTemplates[levelEditor.editorGUI.npcTemplate],
      param: levelEditor.editorGUI.npcParam
    });

  };

    // launch the npc editor dialog
    this.npcShowEditor = function() {
        $('#NPCEditor').scope().$apply(function(scope) {
            scope.showNpcEditor = true;
        });
    };

    this.itemEditor = function() {
        $('#ItemEditor').scope().$apply(function(scope) {
            scope.showItemEditor = true;
            window.disableGameControls = true;
        });
    };


  this.selectTile = function() {

    if ( !levelEditor.terrainMode ) $('#tileList').html('');

    if ( this.showTileSelectBox && !levelEditor.terrainMode ) {

    }
    else {
      this.showTileSelectBox = !this.showTileSelectBox;
    }

    levelEditor.terrainMode = true;

    levelEditor.ShowSelectionScreen(this.showTileSelectBox);
  };

  this.selectObject = function() {

    if ( levelEditor.terrainMode ) $('#tileList').html('');


    if ( this.showTileSelectBox && levelEditor.terrainMode ) {

    }
    else {
      this.showTileSelectBox = !this.showTileSelectBox;
    }



    levelEditor.terrainMode = false;


    levelEditor.ShowSelectionScreen(this.showTileSelectBox);
  };


    var ar = [37, 38, 39, 40];
var disableArrowKeys = function(e) {
      if ($.inArray(e.keyCode, ar)>=0) {
        e.preventDefault();
      }
    };

  // Disable the input keys on the editor dropdowns
  setTimeout(function(){
    
    $(":input").focus(function(){
      $(document).keydown(disableArrowKeys);
    });

    $(":input").blur(function(){
      $(document).unbind('keydown', disableArrowKeys);
    });

  },1000);


// Define render logic ...
};



var LevelEditor = Class.extend({
  Init: function() {

    this.isShowingTileIDs = false;
    this.isPaddingTileIDs = true;
    this.currentCat = -1;

    this.terrainMode = true;

    this.cats = {};
    var me = this;
    $.get('/game/images/tiles', function(data){
          me.cats.Tiles = { tilelist:data};
        });
    $.get('/game/images/items', function(data){
          me.cats.Items = { tilelist:data};
        });
    

    this.ready = false;

    this.previewMesh = null;
    this.previewBuildMesh = null;

    this.setTileHeightBuffer = [];
    this.setTileHeightTimer = 0;



    this.selectedNode = null;

  },
  BuildPreviewBuildMesh: function() {

    if ( this.previewBuildMesh ) {
        releaseMesh(this.previewBuildMesh);
    }

    if ( !currentMouseToWorldData ) return;

    this.previewBuildMesh = new THREE.Object3D();


    this.previewBuildMesh.position.y = ConvertVector3(currentMouseToWorldData.face.centroid).y;


    ironbane.scene.add(this.previewBuildMesh);

  },
  AddPreviewSquareToMesh: function(x, z, h, absoluteheight, color) {

    var lineGeoX = new THREE.Geometry();
    lineGeoX.vertices.push( v(-0.5*worldScale, 0.01, -0.5*worldScale), v(-0.5*worldScale, 0.01, 0.5*worldScale));
    lineGeoX.vertices.push( v(-0.5*worldScale, 0.01, -0.5*worldScale), v(0.5*worldScale, 0.01, -0.5*worldScale));
    lineGeoX.vertices.push( v(-0.5*worldScale, 0.01, 0.5*worldScale), v(0.5*worldScale, 0.01, 0.5*worldScale));
    lineGeoX.vertices.push( v(0.5*worldScale, 0.01, -0.5*worldScale), v(0.5*worldScale, 0.01, 0.5*worldScale));
    var lineMatX = new THREE.LineBasicMaterial({
      color: color,
      lineWidth: 5
    });

    var line = new THREE.Line(lineGeoX, lineMatX);
    line.type = THREE.Lines;


    line.position.x = x;
    line.position.z = z;
    line.position.y = (absoluteheight ? h : line.position.y + h)+0.1;

    this.previewBuildMesh.add(line);
  },
  AddPreviewCircleToMesh: function(x, z, radius, color) {

    var lineGeoX = new THREE.CircleGeometry(radius, 16);
    var lineMatX = new THREE.LineBasicMaterial({
      color: color,
      lineWidth: 5
    });

    var line = new THREE.Line(lineGeoX, lineMatX);
    line.type = THREE.Lines;

    line.position.x = x;
    line.position.z = z;
    line.position.y = 0.1;

    this.previewBuildMesh.add(line);
  },
  SetPreviewMesh: function(id) {

      levelEditor.editorGUI.mpRotX = 0;
      levelEditor.editorGUI.mpRotY = 0;
      levelEditor.editorGUI.mpRotZ = 0;

      for (var i=0;i<levelEditor.editorGUI.gui.__folders['Model Placer'].__controllers.length;i++) {
        levelEditor.editorGUI.gui.__folders['Model Placer'].__controllers[i].updateDisplay();
      }

    if ( this.previewMesh ) {
      this.previewMesh.Destroy();
    }

    if ( id ) {
      this.previewMesh = new Mesh(new THREE.Vector3(), new THREE.Euler(), 0, id);
    }



  },
  ShowSelectionScreen: function(show) {
    if ( show ) {
      $('#tileSelectBox').show();

      // Build tiles
      levelEditor.UpdateCatLinks();

      levelEditor.LoadCat(0);


    }
    else {
      $('#tileSelectBox').hide();
    }
  },
  PaddingTileIDs: function() {
    this.isPaddingTileIDs = !this.isPaddingTileIDs;
    this.LoadCat(this.currentCat);
  },
  ShowTileIDs: function() {
    this.isShowingTileIDs = !this.isShowingTileIDs;
    if ( this.isShowingTileIDs ) {
      $('.tileid').show();
    }
    else {
      $('.tileid').hide();
    }
  },
  LoadCat: function(theCat) {
    if(theCat === 0){
      this.currentCat = "Tiles";
    }
    else {
      this.currentCat = theCat;
    }
    console.log("loading category " + this.currentCat);
    var cat = this.cats[this.currentCat];    

    this.UpdateCatLinks();

    var result = '';
    var first;

    var amountoftilesperline = 10;
    var width = 0;
    if ( this.isPaddingTileIDs ) {
      width = ((amountoftilesperline * 33) + 40);
    }
    else {
      width = ((amountoftilesperline * 32) + 40);
    }

    $('#tileSelectBox').css('width', width+'px');

    for (var i = 0; i < cat.tilelist.length; i++) {
      var tile = cat.tilelist[i];

      result += '<div id="tiletype'+tile+'" class=tile onclick="levelEditor.SetTile(\''+tile+'\')"><div class=tileid style=display:none>'+tile+'</div></div>';

    }

    result += '<div style="clear:both"></div>';

    $('#tileList').html(result);

    for (var i = 0; i < cat.tilelist.length; i++) {

      var tile = cat.tilelist[i];

      var uid = tile;

      $('#tiletype'+uid).css('width', 32+'px');
      $('#tiletype'+uid).css('height', 32+'px');



      if (this.currentCat == "Tiles") {
        $('#tiletype'+uid).css('background-image', 'url('+tilesPath+'medium.php?i='+tile+')');
      }
      else {
        $('#tiletype'+uid).css('background-image', 'url('+itemsPath+'medium.php?i='+tile+')');
      }


      $('#tiletype'+uid).css('background-position', 'center');
      $('#tiletype'+uid).css('background-repeat', 'no-repeat');

      $('#tiletype'+uid).css('float', 'left');

      if ( this.isPaddingTileIDs ) $('#tiletype'+uid).css('margin', '1px 1px 0px 0px');

      $('#tiletype'+uid).css('outline', '1px solid orange');

    }


    this.SetTile(first);

  },
  SetTile: function(tile) {
    var tileList = this.cats[this.currentCat].tilelist;    

    for (var j = 0; j < tileList.length; j++) {
      $('#tiletype'+tileList[j]).css('outline-style', 'none');
    }
    $('#tiletype'+tile).css('outline-style', 'solid');

    levelEditor.editorGUI.selectedTile = tile;
  },
  UpdateCatLinks: function() {

    $('#selectRange').html('');
    $('#selectRange').append('Choose a category:<br>');
    console.log(this.cats);
    _.each(_.keys(this.cats), function(title){
      console.log(title);
      console.log(this.currentCat);
      if ( title == this.currentCat ) {
        $('#selectRange').append('[<b>'+title+'</b>] ');
      }
      else {
        $('#selectRange').append('<span onclick="levelEditor.LoadCat(\''+title+'\');return false;">'+title+'</span> ');
      }

    }, this);
    $('#selectRange').append('<hr>');

  },
  Start: function() {


    this.ready = true;

    this.editorGUI = new EditorGUI();

    this.editorGUI.gui = new dat.GUI({
      autoPlace: false
    });




    var guiControls = {};

    guiControls['globalEnable'] = this.editorGUI.gui.add(this.editorGUI,'globalEnable');

    guiControls['itemEditor'] = this.editorGUI.gui.add(this.editorGUI, 'itemEditor');

    //var fObjectPlacer = this.editorGUI.gui.addFolder('Object Placer');
    var fModelPlacer = this.editorGUI.gui.addFolder('Model Placer');
    var fModelPainter = this.editorGUI.gui.addFolder('Model Painter');
    var fNPCEditor = this.editorGUI.gui.addFolder('NPC Editor');

    var fEntityPlacer = this.editorGUI.gui.addFolder('Entity Placer');

    var fTeleport = this.editorGUI.gui.addFolder('Teleport');

    var fCheats = this.editorGUI.gui.addFolder('Cheats');
    var fOptions = this.editorGUI.gui.addFolder('Options');

    var fPlayerManagement = this.editorGUI.gui.addFolder('Player Management');



    guiControls['enableModelPlacer'] = fModelPlacer.add(this.editorGUI, 'enableModelPlacer');

    guiControls['mpTransformMode'] = fModelPlacer.add(this.editorGUI, 'mpTransformMode');

    guiControls['selectModel'] = fModelPlacer.add(this.editorGUI, 'selectModel', ModelEnum);
    guiControls['mpRotX'] = fModelPlacer.add(this.editorGUI, 'mpRotX', 0, 359);
    guiControls['mpRotY'] = fModelPlacer.add(this.editorGUI, 'mpRotY', 0, 359);
    guiControls['mpRotZ'] = fModelPlacer.add(this.editorGUI, 'mpRotZ', 0, 359);
    guiControls['mpIgnoreOtherModels'] = fModelPlacer.add(this.editorGUI, 'mpIgnoreOtherModels');
    guiControls['mpIgnoreBoundingBox'] = fModelPlacer.add(this.editorGUI, 'mpIgnoreBoundingBox');
    guiControls['mpGridSnap'] = fModelPlacer.add(this.editorGUI, 'mpGridSnap');

    guiControls['enableModelPainter'] = fModelPainter.add(this.editorGUI, 'enableModelPainter');
    guiControls['mpClearMode'] = fModelPainter.add(this.editorGUI, 'mpClearMode');

    fModelPainter.add(this.editorGUI, 'selectTile');

    //var fTeleport = fEntityPlacer.addFolder('Teleport');
    var fMovingObstacle = fEntityPlacer.addFolder('Moving Obstacle');
    guiControls['epmoMesh'] = fMovingObstacle.add(this.editorGUI, 'epmoMesh', ModelEnum);
    guiControls['epmoMovementType'] = fMovingObstacle.add(this.editorGUI, 'epmoMovementType', MovingObstacleMovementTypeEnum);
    guiControls['epmoSpeedMultiplier'] = fMovingObstacle.add(this.editorGUI, 'epmoSpeedMultiplier');
    guiControls['epmoDistanceMultiplier'] = fMovingObstacle.add(this.editorGUI, 'epmoDistanceMultiplier');
    guiControls['epmoAdd'] = fMovingObstacle.add(this.editorGUI, 'epmoAdd');


    var fToggleableObstacle = fEntityPlacer.addFolder('Toggleable Obstacle');
    guiControls['eptoMesh'] = fToggleableObstacle.add(this.editorGUI, 'eptoMesh', ModelEnum);
    guiControls['eptoMovementType'] = fToggleableObstacle.add(this.editorGUI, 'eptoMovementType', ToggleableObstacleMovementTypeEnum);
    guiControls['eptoStartOpen'] = fToggleableObstacle.add(this.editorGUI, 'eptoStartOpen');
    guiControls['eptoSpeedMultiplier'] = fToggleableObstacle.add(this.editorGUI, 'eptoSpeedMultiplier');
    guiControls['eptoDistanceMultiplier'] = fToggleableObstacle.add(this.editorGUI, 'eptoDistanceMultiplier');
    guiControls['eptoAdd'] = fToggleableObstacle.add(this.editorGUI, 'eptoAdd');

    var fLever = fEntityPlacer.addFolder('Lever');
    fLever.addFolder('Note: Enter a valid Toggleable Obstacle ID');
    guiControls['eplSwitchNumber'] = fLever.add(this.editorGUI, 'eplSwitchNumber');
    guiControls['eplAdd'] = fLever.add(this.editorGUI, 'eplAdd');

    var fTeleports = fEntityPlacer.addFolder('Teleports');
    fTeleports.addFolder('Note: Add an Exit first, then the Entrance!');
    guiControls['eptAddExit'] = fTeleports.add(this.editorGUI, 'eptAddExit');
    fTeleports.addFolder('Note: Fill the ID of the teleport exit here:');
    guiControls['eptTargetExit'] = fTeleports.add(this.editorGUI, 'eptTargetExit');
    guiControls['eptInvisible'] = fTeleports.add(this.editorGUI, 'eptInvisible');
    guiControls['eptAddEntrance'] = fTeleports.add(this.editorGUI, 'eptAddEntrance');

    var fSigns = fEntityPlacer.addFolder('Signs');
    guiControls['epsType'] = fSigns.add(this.editorGUI, 'epsType', SignTypeEnum);
    guiControls['epsText'] = fSigns.add(this.editorGUI, 'epsText');
    guiControls['epsFontSize'] = fSigns.add(this.editorGUI, 'epsFontSize');
    guiControls['epsAdd'] = fSigns.add(this.editorGUI, 'epsAdd');

    var fWaypoints = fEntityPlacer.addFolder('Waypoints');
    guiControls['epWaypointName'] = fWaypoints.add(this.editorGUI, 'epWaypointName');
    guiControls['epwAdd'] = fWaypoints.add(this.editorGUI, 'epwAdd');

    var fTriggers = fEntityPlacer.addFolder('Triggers');
    guiControls['epTriggerName'] = fTriggers.add(this.editorGUI, 'epTriggerName');
    guiControls['epTriggerScript'] = fTriggers.add(this.editorGUI, 'epTriggerScript');
    guiControls['epTriggerRange'] = fTriggers.add(this.editorGUI, 'epTriggerRange');
    guiControls['epTriggerInterval'] = fTriggers.add(this.editorGUI, 'epTriggerInterval');
    guiControls['epTriggerAdd'] = fTriggers.add(this.editorGUI, 'epTriggerAdd');

    var fTrains = fEntityPlacer.addFolder('Trains');
    guiControls['eptrMesh'] = fTrains.add(this.editorGUI, 'eptrMesh', ModelEnum);
    guiControls['eptrScriptName'] = fTrains.add(this.editorGUI, 'eptrScriptName');
    guiControls['eptrAdd'] = fTrains.add(this.editorGUI, 'eptrAdd');

    var fBanks = fEntityPlacer.addFolder('Banks');
    guiControls['epBankName'] = fBanks.add(this.editorGUI, 'epBankName');
    guiControls['epBankMesh'] = fBanks.add(this.editorGUI, 'epBankMesh', ModelEnum);
    guiControls['epBankSlots'] = fBanks.add(this.editorGUI, 'epBankSlots');
    guiControls['epBankAdd'] = fBanks.add(this.editorGUI, 'epBankAdd');

    var fLootableMeshes = fEntityPlacer.addFolder('Lootable Meshes');
    guiControls['eplmMesh'] = fLootableMeshes.add(this.editorGUI, 'eplmMesh', ModelEnum);
    fLootableMeshes.addFolder('Note: Uses following format: ');
    fLootableMeshes.addFolder('<chance in 100>:<itemID>[;<chance in 100>;<itemID>]... ');
    fLootableMeshes.addFolder('For example: 100:3;25:1034;12:3923');
    guiControls['eplmLootItems'] = fLootableMeshes.add(this.editorGUI, 'eplmLootItems');
    fLootableMeshes.addFolder('Note: Amount of seconds before respawning (restocking the items)');
    guiControls['eplmRespawnTime'] = fLootableMeshes.add(this.editorGUI, 'eplmRespawnTime');
    guiControls['eplmAdd'] = fLootableMeshes.add(this.editorGUI, 'eplmAdd');

    guiControls['enableNPCEditor'] = fNPCEditor.add(this.editorGUI, 'enableNPCEditor');
    guiControls['neDeleteMode'] = fNPCEditor.add(this.editorGUI, 'neDeleteMode');
    guiControls['npcTemplate'] = fNPCEditor.add(this.editorGUI, 'npcTemplate', Object.keys(unitTemplates).sort());
    guiControls['npcParam'] = fNPCEditor.add(this.editorGUI, 'npcParam');
    fNPCEditor.add(this.editorGUI, 'addNPC');
    //        fNPCEditor.add(this.editorGUI, 'editNPC');
    guiControls['npcShowEditor'] = fNPCEditor.add(this.editorGUI, 'npcShowEditor');

    guiControls['tpPlayerName'] = fTeleport.add(this.editorGUI, 'tpPlayerName');
    guiControls['tpZone'] = fTeleport.add(this.editorGUI, 'tpZone', zoneSelection);
    guiControls['tpTargetPosX'] = fTeleport.add(this.editorGUI, 'tpTargetPosX');
    guiControls['tpTargetPosY'] = fTeleport.add(this.editorGUI, 'tpTargetPosY');
    guiControls['tpTargetPosZ'] = fTeleport.add(this.editorGUI, 'tpTargetPosZ');
    guiControls['tpTargetPlayerName'] = fTeleport.add(this.editorGUI, 'tpTargetPlayerName');
    fTeleport.add(this.editorGUI, 'tpSetCurrentPos');
    fTeleport.add(this.editorGUI, 'tpTeleport');



    var fItems = fCheats.addFolder('Items');

    guiControls['chItemName'] = fItems.add(this.editorGUI, 'chItemName', this.editorGUI.itemCollection);
    guiControls['chGiveItem'] = fItems.add(this.editorGUI, 'chGiveItem');
    guiControls['chGiveCoins'] = fCheats.add(this.editorGUI, 'chGiveCoins');

    guiControls['chFlyMode'] = fCheats.add(this.editorGUI, 'chFlyMode');
    guiControls['chClimb'] = fCheats.add(this.editorGUI, 'chClimb');
    guiControls['chSpeed'] = fCheats.add(this.editorGUI, 'chSpeed');
    guiControls['chGodMode'] = fCheats.add(this.editorGUI, 'chGodMode');
    guiControls['chInvisibleByMonsters'] = fCheats.add(this.editorGUI, 'chInvisibleByMonsters');
    guiControls['ch999Damage'] = fCheats.add(this.editorGUI, 'ch999Damage');
    guiControls['chDevNinja'] = fCheats.add(this.editorGUI, 'chDevNinja');
    guiControls['chForceDay'] = fCheats.add(this.editorGUI, 'chForceDay');
    guiControls['chForceNight'] = fCheats.add(this.editorGUI, 'chForceNight');
    guiControls['chSunOffset'] = fCheats.add(this.editorGUI, 'chSunOffset', 0, 359);
    guiControls['chFOV'] = fCheats.add(this.editorGUI, 'chFOV', 1, 90);

    guiControls['opShowDebug'] = fOptions.add(this.editorGUI, 'opShowDebug');
    //guiControls['opBackupServer'] = fOptions.add(this.editorGUI, 'opBackupServer');
    guiControls['opRestartServer'] = fOptions.add(this.editorGUI, 'opRestartServer');
    guiControls['opReloadData'] = fOptions.add(this.editorGUI, 'opReloadData');


    guiControls['pmCharacterName'] = fPlayerManagement.add(this.editorGUI, 'pmCharacterName');
    guiControls['pmAction'] = fPlayerManagement.add(this.editorGUI, 'pmAction', UserManagementTypeEnum);
    guiControls['pmHours'] = fPlayerManagement.add(this.editorGUI, 'pmHours');
    guiControls['pmReason'] = fPlayerManagement.add(this.editorGUI, 'pmReason');
    guiControls['pmExecute'] = fPlayerManagement.add(this.editorGUI, 'pmExecute');


    guiControls['chFlyMode'].onFinishChange(function(value) {

      ironbane.player.enableGravity = !value;
      ironbane.player.velocity.set(0,0,0);

      ironbane.player.cameraStatus = CameraStatusEnum.ThirdPerson;
      ironbane.player.unitStandingOn = null;

      localStorage.chFlyMode = value;
    });
    guiControls['chClimb'].onFinishChange(function(value) {
      localStorage.chClimb = value;
    });
    guiControls['chSpeed'].onFinishChange(function(value) {
      localStorage.chSpeed = value;
    });
    guiControls['chGodMode'].onFinishChange(function(value) {
      socketHandler.socket.emit('chGodMode', value);
      localStorage.chGodMode = value;
    });
    guiControls['chInvisibleByMonsters'].onFinishChange(function(value) {
      socketHandler.socket.emit('chInvisibleByMonsters', value);
      localStorage.chInvisibleByMonsters = value;
    });
    guiControls['ch999Damage'].onFinishChange(function(value) {
      socketHandler.socket.emit('ch999Damage', value);
      localStorage.ch999Damage = value;
    });
    guiControls['chDevNinja'].onFinishChange(function(value) {
      socketHandler.socket.emit('chDevNinja', value);
      localStorage.chDevNinja = value;
    });
    guiControls['chForceDay'].onFinishChange(function(value) {
      localStorage.chForceDay = value;
    });
    guiControls['chForceNight'].onFinishChange(function(value) {
      localStorage.chForceNight = value;
    });
    guiControls['chFOV'].onFinishChange(function(value) {
      ironbane.camera.fov = value;
      ironbane.camera.updateProjectionMatrix();
    });
    this.editorGUI.closed = true;

    guiControls['opShowDebug'].onFinishChange(function(value) {
      localStorage.opShowDebug = value;

      ba("Please refresh the page in order for the IDs to show up/disappear.");
    });


    var me = this;

    var checkPreviewMesh = function() {
      if ( levelEditor.editorGUI.globalEnable
        && !levelEditor.editorGUI.mpTransformMode
        && levelEditor.editorGUI.enableModelPlacer ) {
        levelEditor.SetPreviewMesh(levelEditor.editorGUI.selectModel);
      }
      else {
        levelEditor.SetPreviewMesh(null);
      }
    };

    guiControls['globalEnable'].onFinishChange(function(value) {



      localStorage.globalEnable = value;

      terrainHandler.ReloadCells();

      if ( value ) {
        ironbane.newLevelEditor = new NewLevelEditor();
      }
      else {
        ironbane.newLevelEditor.Destroy();
        ironbane.newLevelEditor = null;
      }

      checkPreviewMesh();


    });




    guiControls['mpRotX'].onFinishChange(function(value) {
      levelEditor.editorGUI.mpRotX = Math.floor(value/5)*5;
      for (var i=0;i<levelEditor.editorGUI.gui.__folders['Model Placer'].__controllers.length;i++) {
        levelEditor.editorGUI.gui.__folders['Model Placer'].__controllers[i].updateDisplay();
      }
    });
    guiControls['mpRotY'].onFinishChange(function(value) {
      levelEditor.editorGUI.mpRotY = Math.floor(value/5)*5;
      for (var i=0;i<levelEditor.editorGUI.gui.__folders['Model Placer'].__controllers.length;i++) {
        levelEditor.editorGUI.gui.__folders['Model Placer'].__controllers[i].updateDisplay();
      }
    });
    guiControls['mpRotZ'].onFinishChange(function(value) {
      levelEditor.editorGUI.mpRotZ = Math.floor(value/5)*5;
      for (var i=0;i<levelEditor.editorGUI.gui.__folders['Model Placer'].__controllers.length;i++) {
        levelEditor.editorGUI.gui.__folders['Model Placer'].__controllers[i].updateDisplay();
      }
    });

    $('#gameFrame').mousewheel(function(event, delta, deltaX, deltaY) {
      if ( !levelEditor.editorGUI.globalEnable ) return;
      //bm('delta: '+delta+', deltaX: '+deltaX+', deltaY: '+deltaY+'');

      var value = delta * 0.05;

      if ( keyTracker[16] && keyTracker[18] ) {
        levelEditor.editorGUI.mpRotX += value;
      }
      // shift
      else if ( keyTracker[16] ) {
        levelEditor.editorGUI.mpRotY += value;
      }
      // alt
      else if ( keyTracker[18] ) {
        levelEditor.editorGUI.mpRotZ += value;
      }


      if ( levelEditor.editorGUI.mpRotX > (Math.PI*2) ) levelEditor.editorGUI.mpRotX -= (Math.PI*2);
      if ( levelEditor.editorGUI.mpRotY > (Math.PI*2) ) levelEditor.editorGUI.mpRotY -= (Math.PI*2);
      if ( levelEditor.editorGUI.mpRotZ > (Math.PI*2) ) levelEditor.editorGUI.mpRotZ -= (Math.PI*2);
      if ( levelEditor.editorGUI.mpRotX < 0 ) levelEditor.editorGUI.mpRotX += (Math.PI*2);
      if ( levelEditor.editorGUI.mpRotY < 0 ) levelEditor.editorGUI.mpRotY += (Math.PI*2);
      if ( levelEditor.editorGUI.mpRotZ < 0 ) levelEditor.editorGUI.mpRotZ += (Math.PI*2);

      // if ( levelEditor.previewMesh ) {
      //   levelEditor.previewMesh.rotation.set(
      //     levelEditor.editorGUI.mpRotX.ToRadians(),
      //     levelEditor.editorGUI.mpRotY.ToRadians(),
      //     levelEditor.editorGUI.mpRotZ.ToRadians()
      //   );
      //   levelEditor.previewMesh.changeRotationNextTick = true;
      // }

      for (var i=0;i<levelEditor.editorGUI.gui.__folders['Model Placer'].__controllers.length;i++) {
        levelEditor.editorGUI.gui.__folders['Model Placer'].__controllers[i].updateDisplay();
      }

    });



    guiControls['enableModelPlacer'].onFinishChange(function(value) {
      checkPreviewMesh();
    });



    guiControls['mpTransformMode'].onFinishChange(function(value) {
      if ( value ) {

        _.each([
          'Entering Transform mode...',
          'Click a mesh to select it.',
          'Press R to switch to Rotation mode',
          'Press T to switch back to Translation mode.',
          'Press X to delete the selected mesh.',
          'Press Z to undo changes made to the selected mesh.',
          'Press D to duplicate the mesh you are holding.'
        ], function(msg) {
          hudHandler.AddChatMessage(msg);
        });
      }

      checkPreviewMesh();
    });

    guiControls['selectModel'].onFinishChange(function(value) {
      checkPreviewMesh();
    });

    //$('#tileSelectBox').css('width', (frameWidth-20)+'px');
    $('#tileSelectBox').css('left', ((frameWidth/2)-200)+'px');
    $('#tileSelectBox').css('top', ((frameHeight)-200)+'px');

    var customContainer = document.getElementById('editorControls');
    customContainer.appendChild(this.editorGUI.gui.domElement);


    this.transformControls = new THREE.TransformControls(ironbane.camera);

  //this.SetTile(levelEditor.editorGUI.selectedTile);
  },
  PlaceModel: function(position, rotX, rotY, rotZ, id, metadata) {

    position = position.Round(2);


    // We emit, and must add the Object ourselves because it is static
    // Set the cell to reload


    var cellPos = WorldToCellCoordinates(position.x, position.z, cellSize);
    //[{"x":1.83,"y":0,"z":13.04,"t":5,"p":"1","rX":0,"rY":0,"rZ":0}]
    terrainHandler.GetCellByWorldPosition(position).objectData.push({
      x:position.x,
      y:position.y,
      z:position.z,
      t:5,
      p:id,
      rX:rotX,
      rY:rotY,
      rZ:rotZ
    });

    var unit = new Mesh(position,
      new THREE.Euler(rotX,
        rotY,
        rotZ), 0, id, metadata);

    unit.canSelectWithEditor = true;

    unit.dynamic = true;

    if ( unit ) {
      ironbane.getUnitList().addUnit(unit);
      terrainHandler.GetCellByWorldPosition(position).objects.push(unit);
    }
    else {
      ba("Bad unit for PlaceModel!");
    }

    if ( !le("globalEnable") ) terrainHandler.GetCellByWorldPosition(position).Reload();

    terrainHandler.RebuildOctree();

  },
  tick: function(dTime) {



    this.heightTest += dTime;

    if ( this.previewMesh ) {

      if ( this.previewMesh ) {
        this.previewMesh.object3D.rotation.set(
          levelEditor.editorGUI.mpRotX,
          levelEditor.editorGUI.mpRotY,
          levelEditor.editorGUI.mpRotZ
        );
        this.previewMesh.changeRotationNextTick = true;
      }

      if ( currentMouseToWorldData ) {


        this.previewMesh.initialStaticUpdateDone = false;


        this.previewMesh.object3D.position.copy(currentMouseToWorldData.point);

        // Get the normal, and add half the bounding box
        var normal = currentMouseToWorldData.face.normal.clone();

        var roty = this.previewMesh.rotation.y;



        if ( this.previewMesh.boundingBox ) {
          var offset = this.previewMesh.boundingBox.size.clone()
            .multiplyScalar(0.5);


          offset.x *= normal.x;

          if ( normal.y > 0) {
            offset.y *= 0;
          }
          else {
            offset.y *= normal.y * 2.0;
          }



          offset.z *= normal.z;

          if ( !le("mpIgnoreBoundingBox") ) {
            this.previewMesh.object3D.position.add(offset);
          }
        }


        // Snap to grid if set
        if ( le("mpGridSnap") ) {

          this.previewMesh.object3D.position.x = Math.round(this.previewMesh.object3D.position.x);
          //this.previewMesh.object3D.position.y = Math.round(this.previewMesh.object3D.position.y);
          this.previewMesh.object3D.position.z = Math.round(this.previewMesh.object3D.position.z);

        }

        this.previewMesh.tick(dTime);
      }
    }

    if ( levelEditor.selectedNode && ironbane.player ) {
      if ( DistanceSq(levelEditor.selectedNode['pos'], ironbane.player.position) > 15*15 ) {
        levelEditor.selectedNode = null;
        for(var c in terrainHandler.cells) terrainHandler.cells[c].ReloadWaypointsOnly();
      }

    }
  }
});

var levelEditor = new LevelEditor();
