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





var Game = Class.extend({
  Init: function() {
    this.scene = null;
    this.camera = null;
    this.clock = null;
    this.renderer = null;
    this.stats = null;

    this.projector = null;

    this.player = null;

    this.unitList = [];

    this.showingGame = false;

    this.startTime = new Date().getTime();

    // Used for dynamically added objects
    this.waypointOffset = -1000000;
  },
  Start: function() {

    if ( ! Detector.webgl ) {
      hudHandler.ResizeFrame();

      return;
    }

    var bgcolor = ColorEnum.LIGHTBLUE;

    this.scene = new THREE.Scene();

    this.octree = new THREE.Octree();

    this.camera = new THREE.PerspectiveCamera( 75,
      window.innerWidth / window.innerHeight, 0.1, 100000 );

    this.camera.position.x = 0;
    this.camera.position.y = 3;
    this.camera.position.z = 0;

    this.scene.add( this.camera );


    if ( isEditor ) {
      this.scene.add(new THREE.AxisHelper(5));
    }


    this.clock = new THREE.Clock();



    this.projector = new THREE.Projector();

    this.renderer = new THREE.WebGLRenderer( {
      antialias: false,
      clearColor: bgcolor,
      clearAlpha: 1,
      maxLights: 20
    } );

    // this.renderer.sortObjects = false;


    this.renderer.setSize( window.innerWidth, window.innerHeight );


    $('#gameFrame').append(this.renderer.domElement);

    if ( isEditor ) {
      this.stats = new Stats();
      this.stats.domElement.style.position = 'absolute';
      $('#gameFrame').append(this.stats.domElement);
    }

    hudHandler.ResizeFrame();


    $.post('gamehandler.php?action=getchars', function(data) {
      eval(data);

      hudHandler.MakeCharSelectionScreen();

      terrainHandler.Tick(0.1);
    });


    animate();

  },
  Tick: function(dTime) {




    dTime = Math.min(dTime, 0.1);

    // if ( showEditor  ) {
      debug.Tick(dTime);

    // }

    if ( this.stats ) this.stats.update();

    if ( showEditor ) {
      levelEditor.Tick(dTime);
    }

    hudHandler.Tick(dTime);

    if ( !socketHandler.loggedIn && !cinema.IsPlaying() ) {
      this.camera.position.x = previewLocation.x+(Math.cos(new Date().getTime()/20000)*previewDistance)-0;
      this.camera.position.y = previewLocation.y+previewHeight;
      this.camera.position.z = previewLocation.z+(Math.sin(new Date().getTime()/20000)*previewDistance)-0;
      ironbane.camera.lookAt(previewLocation);
    }

    terrainHandler.Tick(dTime);

    meshHandler.Tick(dTime);

    if ( socketHandler.loggedIn ) {

      // Add the player once we have terrain we can walk on
      if(  !this.player ) {

        // We have a spawn location, check the cell
        var cell = WorldToCellCoordinates(socketHandler.spawnLocation.x, socketHandler.spawnLocation.z, cellSize);

        if ( terrainHandler.status === terrainHandlerStatusEnum.LOADED &&
          !terrainHandler.IsLoadingCells() ) {
          ironbane.player = new Player(socketHandler.spawnLocation, new THREE.Vector3(0, socketHandler.spawnRotation, 0), socketHandler.playerData.id, socketHandler.playerData.name);
          ironbane.unitList.push(ironbane.player);
        }

      }

    }

    particleHandler.Tick(dTime);

    for(var x=0;x<this.unitList.length;x++){
      this.unitList[x].Tick(dTime);
    }

    cinema.Tick(dTime);

    sw("THREE.Object3DLibrary.length", THREE.Object3DLibrary.length);
    sw("THREE.GeometryLibrary.length", THREE.GeometryLibrary.length);
    sw("THREE.MaterialLibrary.length", THREE.MaterialLibrary.length);
    sw("THREE.TextureLibrary.length", THREE.TextureLibrary.length);

    // sw("Camera position", this.camera.position);
    // sw("Camera lookAt", this.camera.lookAtPosition);

    // sw("Units ticking", this.unitList.length);

    // var monstersTickingCount = 0;
    // _.each(this.unitList, function(unit) {
    //   if ( unit instanceof Fighter ) monstersTickingCount++;
    // });

    // sw("Monsters ticking", monstersTickingCount);

     if ( terrainHandler.status === terrainHandlerStatusEnum.LOADED &&
          !terrainHandler.IsLoadingCells()
      && soundHandler.loadedMainMenuMusic
      && !ironbane.showingGame) {

      if ( !socketHandler.inGame ) {
        hudHandler.MakeSoundButton();
      }

      ironbane.showingGame = true;

      setTimeout(function() {
        $('#gameFrame').animate({
          opacity: 1.00
        }, 1000, function() {
          $("#gameFrame").css('opacity', '');
          // $("#loadingBar").hide();
        });
      }, 500);
    }

    relativeMouse = mouse.clone().subSelf(lastMouse);
  lastMouse = mouse.clone();
    sw("relativeMouse", ConvertVector3(relativeMouse));
  },
  Render: function () {

    this.renderer.render( this.scene, this.camera );
    debug.Clear();
  }
});

var ironbane = new Game();

function animate() {
  requestAnimationFrame( animate );
  ironbane.Tick(ironbane.clock.getDelta());
  ironbane.Render();
  TWEEN.update();
}

$(document).ready(function(){
  ironbane.Start();
});
