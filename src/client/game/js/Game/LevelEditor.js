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

var ModelPlacerModeEnum = {
  PLACE : 0,
  DELETE : 1
};


var PathPlacerModeEnum = {
  NODES : 0,
  EDGES : 1,
  DELETE : 2
};


var EditorGUI = function() {

  this.globalEnable = ISDEF(localStorage.globalEnable) ? (localStorage.globalEnable === 'true') : false;
  this.globalEnable = false;

  this.tbEnableTransparency = false;

  this.chFlyMode = ISDEF(localStorage.chFlyMode) ? (localStorage.chFlyMode === 'true') : false;
  this.chClimb = ISDEF(localStorage.chClimb) ? (localStorage.chClimb === 'true') : false;
  this.chSpeed = ISDEF(localStorage.chSpeed) ? (localStorage.chSpeed === 'true') : false;
  this.chGodMode = ISDEF(localStorage.chGodMode) ? (localStorage.chGodMode === 'true') : false;
  this.chInvisibleByMonsters = ISDEF(localStorage.chInvisibleByMonsters) ? (localStorage.chInvisibleByMonsters === 'true') : false;
  this.ch999Damage = ISDEF(localStorage.ch999Damage) ? (localStorage.ch999Damage === 'true') : false;
  this.chForceDay = ISDEF(localStorage.chForceDay) ? (localStorage.chForceDay === 'true') : false;
  this.chForceNight = ISDEF(localStorage.chForceNight) ? (localStorage.chForceNight === 'true') : false;
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

  this.opShowDebug = ISDEF(localStorage.opShowDebug) ? (localStorage.opShowDebug === 'true') : true;

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



  this.camDistance = ISDEF(localStorage.camDistance) ? parseFloat(localStorage.camDistance) : 20.0;
  this.camHeight = ISDEF(localStorage.camHeight) ? parseFloat(localStorage.camHeight) : 20.0;

  this.enableWorldPainter = false;

  this.selectedTile = 1;

  // Object placer mode
  this.opMode = ObjectPlacerModeEnum.PLACE;

  // Model placer mode
  this.mpMode = ModelPlacerModeEnum.PLACE;
  this.selectModel = firstOfObject(ModelEnum);
  this.mpRotX = 0;
  this.mpRotY = 0;
  this.mpRotZ = 0;
  this.mpIgnoreOtherModels = false;
  this.mpIgnoreBoundingBox = false;
  this.mpGridSnap = true;
  this.mpHeightOffset = 0;

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
        rotY: ironbane.player.rotation.y.Round()
      }
    });
  };

  this.eptoMesh = firstOfObject(ModelEnum);
  this.eptoMovementType = firstOfObject(ToggleableObstacleMovementTypeEnum);
  this.eptoStartOpen = false;
  this.eptoSpeedMultiplier = 1.0;
  this.eptoDistanceMultiplier = 1.0;
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
        rotY: ironbane.player.rotation.y.Round(),
        startOpen : levelEditor.editorGUI.eptoStartOpen
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
  }

  this.ephpAdd = function() {
    socketHandler.socket.emit('addNPC', {
      position: ironbane.player.position,
      template: heartPieceTemplate
    });
  }

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
        rotY: ironbane.player.rotation.y.Round()
      }
    });
  }

  this.eplmMesh = firstOfObject(ModelEnum);
  this.eplmLootItems = "";
  this.eplmRespawnTime = 300;
  this.eplmAdd = function() {
    socketHandler.socket.emit('addNPC', {
      position: ironbane.player.position,
      template: lootableMeshTemplate,
      param: levelEditor.editorGUI.eplmMesh,
      data: {
        loot:levelEditor.editorGUI.eplmLootItems,
        respawnTime: levelEditor.editorGUI.eplmRespawnTime,
        rotY: ironbane.player.rotation.y.Round()
      }
    });
  }


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
  }


  // NPC editor mode
  this.neDeleteMode = false;



  this.gui = false;

  this.enableObjectPlacer = false;

  // Path placer
  this.enablePathPlacer = false;
  this.ppMode = PathPlacerModeEnum.NODES;
  this.ppTwoWay = true;
  this.ppAutoConnectWithin = 0;

  // Model placer
  this.enableModelPlacer = false;

  // Model painter
  this.enableModelPainter = false;
  this.mpSetForAllModels = false;
  this.mpClearMode = false;

  // NPC editor
  this.enableNPCEditor = false;


  this.npcID = 0;

  this.npcTemplate = 1;
  this.npcParam = 0;
  //this.npcRotation = 0;

  //    this.editNPC = function() {
  //        // Check if our npcID is not 0, and send a request to update the NPC with given ID
  //        // our given editor data
  //        if ( levelEditor.editorGUI.npcID == 0 ) {
  //            hudHandler.MessageAlert('Select an NPC first!');
  //            return;
  //        }
  //
  //        socketHandler.socket.emit('editNPC', {
  //                            name: levelEditor.editorGUI.npcName,
  //                            type: levelEditor.editorGUI.npcType,
  //                            param: levelEditor.editorGUI.npcParam,
  //                            size: levelEditor.editorGUI.npcSize
  //            });
  //    };



  this.tpPlayerName = socketHandler.playerData.name;
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
      if ( ISDEF(reply.errmsg) ) {
        hudHandler.MessageAlert(reply.errmsg);
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




  // Disable the input keys on the editor dropdowns
  setTimeout(function(){
    var ar = new Array(37, 38, 39, 40);
    var disableArrowKeys = function(e) {
      if ($.inArray(e.keyCode, ar)>=0) {
        e.preventDefault();
      }
    }
    $(":input").focus(function(){
      $(document).keydown(disableArrowKeys);
    });

    $(":input").blur(function(){
      $(document).unbind('keydown', disableArrowKeys);
    });

  },1000);


// Define render logic ...
};





var Cat = Class.extend({
  Init: function(range, title, amountoftilesperline) {

    if ( !amountoftilesperline ) amountoftilesperline = 10;

    this.tilelist = [];
    this.title = title;
    this.amountoftilesperline = amountoftilesperline;

    // Make a tile list based on the range
    var ar = range.split(',');
    for(var i=0;i<ar.length;i++){
      var subar = ar[i].split('-');

      var start = parseInt(subar[0]);
      if ( subar.length == 1 ) {
        this.tilelist.push(start);
      }
      else {
        var end = parseInt(subar[1]);
        for(var j=start;j<=end;j++){
          this.tilelist.push(j);
        }
      }
    }


  }
});





var LevelEditor = Class.extend({
  Init: function() {

    this.isShowingTileIDs = false;
    this.isPaddingTileIDs = true;
    this.currentCat = -1;

    this.terrainMode = true;

    this.cats = new Array();

    for(var c=0;c<preCatsTiles.length;c++) {
      this.cats.push(new Cat(preCatsTiles[c].range, preCatsTiles[c].name, preCatsTiles[c].limit_x, true));
    }

    this.ready = false;

    this.previewMesh = null;
    this.previewBuildMesh = null;

    this.setTileHeightBuffer = [];
    this.setTileHeightTimer = 0;

    this.selectedNode = null;
  },
  BuildPreviewBuildMesh: function() {

    if ( this.previewBuildMesh ) {
        this.previewBuildMesh.traverse( function ( object ) {


          //object.material.deallocate();

          if ( !_.isUndefined(object.geometry) ) {
            _.each(object.geometry.materials, function(material) {
              material.deallocate();
            });

            object.geometry.deallocate();
          }

          if ( !_.isUndefined(object.material) ) {
            if ( !(object.material instanceof THREE.MeshFaceMaterial) ) {
              object.material.deallocate();
            }
          }



          object.deallocate();

          ironbane.renderer.deallocateObject( object );
        } );


      ironbane.scene.remove(this.previewBuildMesh);

      this.previewBuildMesh.deallocate();

      ironbane.renderer.deallocateObject( this.previewBuildMesh );
    }

    if ( !currentMouseToWorldData ) return;

    this.previewBuildMesh = new THREE.Object3D();

   if ( levelEditor.editorGUI.enablePathPlacer ) {

      var ix = (currentMouseToWorldData.point.x);
      var iz = (currentMouseToWorldData.point.z);

      if ( levelEditor.editorGUI.ppMode == PathPlacerModeEnum.NODES ) {

          //this.AddPreviewCircleToMesh(ix, iz, levelEditor.editorGUI.ppAutoConnectWithin, 0xffffff);



      }
    }


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
      this.previewMesh = new Mesh(new THREE.Vector3(), new THREE.Vector3(), 0, id);
    }



  },
  ShowSelectionScreen: function(show) {
    if ( show ) {
      $('#tileSelectBox').show();

      // Build tiles
      levelEditor.UpdateCatLinks();


      // for(var i=0;i<this.cats.length;i++){
      //   levelEditor.LoadCat(i, true);
      // }

      levelEditor.LoadCat(0);


    }
    else {
      $('#tileSelectBox').hide();
    }
  },
  PaddingTileIDs: function() {
    this.isPaddingTileIDs = !this.isPaddingTileIDs;
    this.LoadCat(this.currentcat);
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
  LoadCat: function(cat) {
    this.currentCat = cat;

    var cat = this.cats[cat];

    this.UpdateCatLinks();

    var result = '';
    var first;


    if ( this.isPaddingTileIDs ) {
      var width = ((cat.amountoftilesperline * 33) + 40);
    }
    else {
      var width = ((cat.amountoftilesperline * 32) + 40);
    }

    $('#tileSelectBox').css('width', width+'px');



    for (var i = 0; i < cat.tilelist.length; i++) {

      var tile = cat.tilelist[i];

      //if ( !window.opener.tileTypeList[tile] ) continue;

      var uid = tile;
      if ( i == 0 ) first = uid;

      result += '<div id="tiletype'+uid+'" class=tile onclick="levelEditor.SetTile('+uid+')"><div class=tileid style=display:none>'+uid+'</div></div>';

    //        if ( (i+1) % 8 == 0 ) {
    //            result += "</div><div style=\"height:36px;width:1px\">&nbsp;</div><div>";
    //        }
    }

    //    result += "</div>";

    result += '<div style="clear:both"></div>';

    $('#tileList').html(result);

    for (var i = 0; i < cat.tilelist.length; i++) {


      var tile = cat.tilelist[i];

      var uid = tile;



      $('#tiletype'+uid).css('width', 32+'px');
      $('#tiletype'+uid).css('height', 32+'px');


      //            if ( cat.usedForTerrain ) {
      $('#tiletype'+uid).css('background-image', 'url('+tilesPath+'medium.php?i='+uid+')');
      //            }
      //            else {
      //                if ( !ISDEF(preGameObjects[uid]) ) continue;
      //                var gObject = preGameObjects[uid];
      //
      //                switch (gObject.type) {
      //                    case UnitTypeEnum.BILLBOARD:
      //                        $('#tiletype'+uid).css('background-image', 'url('+billboardSpritePath+''+gObject.param+'.'+tilesExt+')');
      //                        break;
      //                }
      //
      //            }

      $('#tiletype'+uid).css('background-position', 'center');
      $('#tiletype'+uid).css('background-repeat', 'no-repeat');

      //if ( (i+1) % 8 != 0 ) {
      $('#tiletype'+uid).css('float', 'left');
      //}

      if ( this.isPaddingTileIDs ) $('#tiletype'+uid).css('margin', '1px 1px 0px 0px');
      //        $('#tiletype'+uid).css('border-color', 'orange');
      //        $('#tiletype'+uid).css('border-width', '1px');
      //        $('#tiletype'+uid).css('border-style', 'solid');
      $('#tiletype'+uid).css('outline', '1px solid orange');

    }



    //$('#tileList').html('<textarea style="width:600px;height:600px">'+$('#tileList').html()+'</textarea>');


    //alert($('#tileList').html());

    //window.opener.SetEditorTileType(first);
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

    for(var i=0;i<this.cats.length;i++){

      //            if ( this.cats[i].usedForTerrain != this.terrainMode ) continue;

      if ( i == this.currentCat ) {
        $('#selectRange').append('[<b>'+this.cats[i].title+'</b>] ');
      }
      else {
        $('#selectRange').append('<a href=# onclick=levelEditor.LoadCat('+i+')>'+this.cats[i].title+'</a> ');
      }

    }
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

    guiControls['camDistance'] = this.editorGUI.gui.add(this.editorGUI, 'camDistance', 1, 40);
    guiControls['camHeight'] = this.editorGUI.gui.add(this.editorGUI, 'camHeight', 1, 40);

    //var fObjectPlacer = this.editorGUI.gui.addFolder('Object Placer');
    var fModelPlacer = this.editorGUI.gui.addFolder('Model Placer');
    var fModelPainter = this.editorGUI.gui.addFolder('Model Painter');
    var fEntityPlacer = this.editorGUI.gui.addFolder('Entity Placer');
    var fNPCEditor = this.editorGUI.gui.addFolder('NPC Editor');
    var fPathPlacer = this.editorGUI.gui.addFolder('Path Placer');


    var fTeleport = this.editorGUI.gui.addFolder('Teleport');

    var fCheats = this.editorGUI.gui.addFolder('Cheats');
    var fOptions = this.editorGUI.gui.addFolder('Options');

    var fPlayerManagement = this.editorGUI.gui.addFolder('Player Management');

    //        guiControls['enableObjectPlacer'] = fObjectPlacer.add(this.editorGUI, 'enableObjectPlacer');
    //
    //        guiControls['opMode'] = fObjectPlacer.add(this.editorGUI, 'opMode', {
    //            Place: ObjectPlacerModeEnum.PLACE,
    //            Delete: ObjectPlacerModeEnum.DELETE
    //            });
    //
    //        fObjectPlacer.add(this.editorGUI, 'selectObject');

    guiControls['enablePathPlacer'] = fPathPlacer.add(this.editorGUI, 'enablePathPlacer');

    guiControls['ppMode'] = fPathPlacer.add(this.editorGUI, 'ppMode', {
      "Add Nodes": PathPlacerModeEnum.NODES,
      "Add Edges": PathPlacerModeEnum.EDGES,
      "Delete": PathPlacerModeEnum.DELETE
    });

    var fEdgeOptions = fPathPlacer.addFolder('Options');
    guiControls['ppTwoWay'] = fEdgeOptions.add(this.editorGUI, 'ppTwoWay');
    guiControls['ppAutoConnectWithin'] = fEdgeOptions.add(this.editorGUI, 'ppAutoConnectWithin', 0, 20);


    guiControls['enableModelPlacer'] = fModelPlacer.add(this.editorGUI, 'enableModelPlacer');



    guiControls['mpMode'] = fModelPlacer.add(this.editorGUI, 'mpMode', {
      Place: ModelPlacerModeEnum.PLACE,
      Delete: ModelPlacerModeEnum.DELETE
    });

    guiControls['selectModel'] = fModelPlacer.add(this.editorGUI, 'selectModel', ModelEnum);
    guiControls['mpRotX'] = fModelPlacer.add(this.editorGUI, 'mpRotX', 0, 359);
    guiControls['mpRotY'] = fModelPlacer.add(this.editorGUI, 'mpRotY', 0, 359);
    guiControls['mpRotZ'] = fModelPlacer.add(this.editorGUI, 'mpRotZ', 0, 359);
    guiControls['mpIgnoreOtherModels'] = fModelPlacer.add(this.editorGUI, 'mpIgnoreOtherModels');
    guiControls['mpIgnoreBoundingBox'] = fModelPlacer.add(this.editorGUI, 'mpIgnoreBoundingBox');
    guiControls['mpGridSnap'] = fModelPlacer.add(this.editorGUI, 'mpGridSnap');
    guiControls['mpHeightOffset'] = fModelPlacer.add(this.editorGUI, 'mpHeightOffset', -19.9, 19.9);

    guiControls['enableModelPainter'] = fModelPainter.add(this.editorGUI, 'enableModelPainter');
    guiControls['mpClearMode'] = fModelPainter.add(this.editorGUI, 'mpClearMode');
    guiControls['mpSetForAllModels'] = fModelPainter.add(this.editorGUI, 'mpSetForAllModels');

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
    guiControls['eptoStartOpen'] = fMovingObstacle.add(this.editorGUI, 'eptoStartOpen');
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

    var fLootableMeshes = fEntityPlacer.addFolder('Lootable Meshes');
    guiControls['eplmMesh'] = fLootableMeshes.add(this.editorGUI, 'eplmMesh', ModelEnum);
    fLootableMeshes.addFolder('Note: Uses following format: ');
    fLootableMeshes.addFolder('<chance in 100>:<itemID>[;<chance in 100>;<itemID>]... ');
    fLootableMeshes.addFolder('For example: 100:3;25:1034;12:3923');
    guiControls['eplmLootItems'] = fLootableMeshes.add(this.editorGUI, 'eplmLootItems');
    fLootableMeshes.addFolder('Note: Amount of seconds before respawning (restocking the items)');
    guiControls['eplmRespawnTime'] = fLootableMeshes.add(this.editorGUI, 'eplmRespawnTime');
    guiControls['eplmAdd'] = fLootableMeshes.add(this.editorGUI, 'eplmAdd');

    // var fHeartPieces = fEntityPlacer.addFolder('Heart Pieces');
    // guiControls['ephpAdd'] = fHeartPieces.add(this.editorGUI, 'ephpAdd');

    // var fMusicPlayer = fEntityPlacer.addFolder('Music Player');
    // guiControls['epmpMusicPiece'] = fMusicPlayer.add(this.editorGUI, 'epmpMusicPiece');
    // guiControls['epmpRange'] = fMusicPlayer.add(this.editorGUI, 'epmpRange');
    // guiControls['epmpAdd'] = fMusicPlayer.add(this.editorGUI, 'epmpAdd');


    guiControls['enableNPCEditor'] = fNPCEditor.add(this.editorGUI, 'enableNPCEditor');
    guiControls['neDeleteMode'] = fNPCEditor.add(this.editorGUI, 'neDeleteMode');



    guiControls['npcTemplate'] = fNPCEditor.add(this.editorGUI, 'npcTemplate', Object.keys(unitTemplates).sort());

    guiControls['npcParam'] = fNPCEditor.add(this.editorGUI, 'npcParam');

    fNPCEditor.add(this.editorGUI, 'addNPC');
    //        fNPCEditor.add(this.editorGUI, 'editNPC');

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


    guiControls['globalEnable'].onFinishChange(function(value) {

     if ( value ) {

       ironbane.player.thirdPersonReference.y = levelEditor.editorGUI.camDistance;
       ironbane.player.thirdPersonReference.z = -levelEditor.editorGUI.camHeight;
       if ( levelEditor.editorGUI.enableModelPlacer ) {
         levelEditor.SetPreviewMesh(levelEditor.editorGUI.selectModel);
       }
       else {
         levelEditor.SetPreviewMesh(null);
       }

     }
     else {

       ironbane.player.thirdPersonReference.y = 3;

       ironbane.player.thirdPersonReference.z = -4;
       levelEditor.SetPreviewMesh(null);

     }


      localStorage.globalEnable = value;

      terrainHandler.ReloadCells();


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

      var value = delta * 5;

      if ( keyTracker[16] ) {
        levelEditor.editorGUI.mpRotX += value;
      }
      else if ( keyTracker[18] ) {
        levelEditor.editorGUI.mpRotZ += value;
      }
      else {
        levelEditor.editorGUI.mpRotY += value;
      }

      if ( levelEditor.editorGUI.mpRotX >= 360 ) levelEditor.editorGUI.mpRotX = 0;
      if ( levelEditor.editorGUI.mpRotY >= 360 ) levelEditor.editorGUI.mpRotY = 0;
      if ( levelEditor.editorGUI.mpRotZ >= 360 ) levelEditor.editorGUI.mpRotZ = 0;
      if ( levelEditor.editorGUI.mpRotX <= -1 ) levelEditor.editorGUI.mpRotX = 355;
      if ( levelEditor.editorGUI.mpRotY <= -1 ) levelEditor.editorGUI.mpRotY = 355;
      if ( levelEditor.editorGUI.mpRotZ <= -1 ) levelEditor.editorGUI.mpRotZ = 355;

      //if ( levelEditor.previewMesh ) levelEditor.previewMesh.UpdateRotation();

      for (var i=0;i<levelEditor.editorGUI.gui.__folders['Model Placer'].__controllers.length;i++) {
        levelEditor.editorGUI.gui.__folders['Model Placer'].__controllers[i].updateDisplay();
      }

    });


    guiControls['enableModelPlacer'].onFinishChange(function(value) {
      if ( levelEditor.editorGUI.globalEnable ) {
        if ( value ) {
          levelEditor.SetPreviewMesh(levelEditor.editorGUI.selectModel);
        }
        else {
          levelEditor.SetPreviewMesh(null);
        }
      }
      else {
        levelEditor.SetPreviewMesh(null);
      }
    });



    guiControls['mpMode'].onFinishChange(function(value) {
      if ( value == ModelPlacerModeEnum.PLACE ) {
        levelEditor.SetPreviewMesh(levelEditor.editorGUI.selectModel);
      }
      else {
        levelEditor.SetPreviewMesh(null);
      }
    });

    guiControls['selectModel'].onFinishChange(function(value) {
      levelEditor.SetPreviewMesh(value);
    });


    guiControls['enablePathPlacer'].onFinishChange(function(value) {
      for(var c in terrainHandler.cells) terrainHandler.cells[c].ReloadWaypointsOnly();
    });



    guiControls['camDistance'].onChange(function(value) {
      if ( levelEditor.editorGUI.globalEnable ) {
        // Update player camera

        //ironbane.player.thirdPersonReference.x = value;
        ironbane.player.thirdPersonReference.z = -value;

      }
      localStorage.camDistance = value;
    });


    guiControls['camHeight'].onChange(function(value) {
      if ( levelEditor.editorGUI.globalEnable ) {
        // Update player camera

        ironbane.player.thirdPersonReference.y = value;


      }
      localStorage.camHeight = value;
    });
    //$('#tileSelectBox').css('width', (frameWidth-20)+'px');
    $('#tileSelectBox').css('left', ((frameWidth/2)-200)+'px');
    $('#tileSelectBox').css('top', ((frameHeight)-200)+'px');

    var customContainer = document.getElementById('editorControls');
    customContainer.appendChild(this.editorGUI.gui.domElement);

  //this.SetTile(levelEditor.editorGUI.selectedTile);
  },
  PlaceObject: function(position, objectId) {
    var gObject = preGameObjects[objectId];

    position = position.Round(2);

    // We emit, and must add the Object ourselves because it is static
    // Set the cell to reload
    socketHandler.socket.emit('addGameObject', {
      position: position,
      type: gObject.type,
      param: gObject.param,
      size: gObject.size
    });


    var unit = null;

    switch (gObject.type) {
      case UnitTypeEnum.BILLBOARD:
        unit = new Billboard((position), 0, 0, gObject.param);
        break;
    }

    unit.size = gObject.size;

    if ( unit ) {
      ironbane.unitList.push(unit);
      terrainHandler.GetCellByWorldPosition(position).objects.push(unit);
    }
  },
  PlaceModel: function(position, rotX, rotY, rotZ, id) {

    position = position.Round(2);

    //position.y += levelEditor.editorGUI.mpHeightOffset;

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

    var unit = new Mesh(position, new THREE.Vector3(rotX, rotY, rotZ), 0, id);


    if ( unit ) {
      ironbane.unitList.push(unit);
      terrainHandler.GetCellByWorldPosition(position).objects.push(unit);
    }
    else {
      ba("Bad unit for PlaceModel!");
    }

    if ( !le("globalEnable") ) terrainHandler.GetCellByWorldPosition(position).Reload();

    terrainHandler.RebuildOctree();

  },
  Tick: function(dTime) {



    this.heightTest += dTime;

    if ( this.previewMesh ) {

      this.previewMesh.rotation.x = levelEditor.editorGUI.mpRotX;
      this.previewMesh.rotation.y = levelEditor.editorGUI.mpRotY;
      this.previewMesh.rotation.z = levelEditor.editorGUI.mpRotZ;

      if ( levelEditor.previewMesh ) levelEditor.previewMesh.UpdateRotationByVertices();

      if ( currentMouseToWorldData ) {


        this.previewMesh.initialStaticUpdateDone = false;


        this.previewMesh.localPosition.copy(currentMouseToWorldData.point);

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
            this.previewMesh.localPosition.addSelf(offset);
          }
        }


        // Snap to grid if set
        if ( le("mpGridSnap") ) {

          this.previewMesh.localPosition.x = Math.round(this.previewMesh.localPosition.x);
          this.previewMesh.localPosition.y = Math.round(this.previewMesh.localPosition.y);
          this.previewMesh.localPosition.z = Math.round(this.previewMesh.localPosition.z);

        }


        this.previewMesh.localPosition.y += levelEditor.editorGUI.mpHeightOffset;
        this.previewMesh.Tick(dTime);
      }
    }

    // var old = levelEditor.editorGUI.mpHeightOffset;
    // if ( keyTracker[33] ) levelEditor.editorGUI.mpHeightOffset += 0.5;
    // if ( keyTracker[34] ) levelEditor.editorGUI.mpHeightOffset -= 0.5;


    // _.each(levelEditor.editorGUI.gui.__folders['Model Placer'].__controllers, function (controller) {
    //   controller.updateDisplay();
    // });

    //this.SetTileHeight(1, 1, this.heightTest);
    // if ( currentMouseToWorldData ) {
    //   //            debug.SetWatch("currentMouseToWorldData.point", ConvertVector3(currentMouseToWorldData.point).ToString());
    //   //            debug.SetWatch("currentMouseToWorldData.normal", ConvertVector3(currentMouseToWorldData.face.normal).ToString());
    //   //            debug.SetWatch("currentMouseToWorldData.rotation", ConvertVector3(currentMouseToWorldData.object.rotation).ToString());
    //   //
    //   //            if ( ISDEF(currentMouseToWorldData.object.unit) ) {
    //   //                debug.SetWatch("currentMouseToWorldData.unit.name", currentMouseToWorldData.object.unit.name);
    //   //            }

    //   // Alter the normal to rotate with the mesh;
    //   var normal = currentMouseToWorldData.face.normal;
    //   var rotationMatrix = (new THREE.Matrix4()).extractRotation(currentMouseToWorldData.object.matrix);
    //   //matrixRotationWorld
    //   normal = rotationMatrix.multiplyVector3(normal);
    // //debug.SetWatch("altered normal", normal.Round(2).ToString());


    // }

    if ( levelEditor.selectedNode && ironbane.player ) {
      if ( DistanceSq(levelEditor.selectedNode['pos'], ironbane.player.position) > 15*15 ) {
        levelEditor.selectedNode = null;
        for(var c in terrainHandler.cells) terrainHandler.cells[c].ReloadWaypointsOnly();
      }

    }
  }
});


var levelEditor = new LevelEditor();
