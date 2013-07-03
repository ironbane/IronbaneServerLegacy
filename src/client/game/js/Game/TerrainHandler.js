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


// Must be dividable by 2
var cellLoadRange = cellSize+16;

var previewLocation = new THREE.Vector3(15, 13, 54);

var previewDistance = 15;
var previewHeight = 5;

var terrainHandlerStatusEnum = {
  INIT: 0,
  LOADING: 1,
  LOADED: 2,
  DESTROYED: 3
};

var transitionStateEnum = {
  START: 0,
  MIDDLE: 1,
  END: 2
};
// Init:
//  First, make sure that all cells in range of the player are loaded
//  Send a Destroy signal to cells that are out of range
//
//

var TerrainHandler = Class.extend({
  Init: function() {
    // Multidimensional array per x/z cell
    this.cells = {};

    this.previewZone = 1;
    this.zone = this.previewZone;

    this.waterMesh = null;
    this.skybox = null;

    this.status = terrainHandlerStatusEnum.INIT;

    this.lastOctreeBuildPosition = new THREE.Vector3(0, 1000000000, 0);

    this.currentMusic = "";
    this.targetMusic = "";

    // Used to freeze the player between teleports, so they don't fall down
    // because of gravity inside a terrain/mesh between teleports
    this.transitionState = transitionStateEnum.END;
  },
  Destroy: function() {
    _.each(this.cells, function(cell) {
      cell.Destroy();
    });

    this.cells = {};

    this.cellOctrees = {};

    this.zone = this.previewZone;

    if ( this.skybox ) this.skybox.Destroy();

    this.skybox = null;

    particleHandler.RemoveAll();

    this.terrainHandlerStatusEnum = this.DESTROYED;
  },
  Awake: function() {
    // Called after everything is loaded

    this.BuildWaterMesh();

    if ( GetZoneConfig("enableClouds") ) {
      particleHandler.Add(ParticleTypeEnum.CLOUD, {});
    }

    var me = this;
    this.skybox = new Skybox(function() {
      me.status = terrainHandlerStatusEnum.LOADED;
    });


  },
  BuildWaterMesh: function() {
    if ( this.waterMesh ) {
      ironbane.scene.remove(this.waterMesh);
    }

    if ( !GetZoneConfig('enableFluid') ) return;



    var texture = textureHandler.GetTexture( 'plugins/game/images/tiles/'+GetZoneConfig('fluidTexture')+'.png', true);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.x = 1000;
    texture.repeat.y = 1000;

    var texture2 = textureHandler.GetTexture( 'plugins/game/images/tiles/'+GetZoneConfig('fluidTextureGlow')+'.png', true);
    texture2.wrapS = THREE.RepeatWrapping;
    texture2.wrapT = THREE.RepeatWrapping;
    texture2.repeat.x = 1000;
    texture2.repeat.y = 1000;

    var planeGeo = new THREE.PlaneGeometry(1000, 1000, 300, 300);
    var uniforms = {
      uvScale : {
        type: 'v2',
        value: new THREE.Vector2(0.002,0.002)
      },
      size : {
        type: 'v2',
        value: new THREE.Vector2(1,1)
      },
      hue : {
        type: 'v3',
        value: new THREE.Vector3(1,1,1)
      },
      vSun : {
        type: 'v3',
        value: new THREE.Vector3(0,0,0)
      },
      texture1 : {
        type: 't',
        value: texture
      },
      texture2 : {
        type: 't',
        value: texture2
      },
      scrollSpeed : {
        type: 'v2',
        value: new THREE.Vector2(1,1)
      },
      time : {
        type: 'f',
        value: 0.0
      }
    };

    var shaderMaterial = new THREE.ShaderMaterial({
      uniforms : uniforms,
      vertexShader : $('#vertex_'+GetZoneConfig("fluidType")).text(),
      fragmentShader : $('#fragment_'+GetZoneConfig("fluidType")).text(),
      transparent: GetZoneConfig("fluidType") === "lava" ? false : true
    //alphaTest: 0.5
    });

    this.waterMesh = new THREE.Mesh(planeGeo, shaderMaterial);
    this.waterMesh.rotation.x = -Math.PI/2;
    this.waterMesh.position.y = GetZoneConfig('fluidLevel');
    this.waterMesh.geometry.dynamic = true;

    ironbane.scene.add(this.waterMesh);
  },
  GetCellByWorldPosition: function(position) {
    var cp = WorldToCellCoordinates(position.x, position.z, cellSize);

    return this.GetCellByGridPosition(cp.x, cp.z);
  },
  GetCellByGridPosition: function(x, z) {
    var id = x+'-'+z;

    if ( typeof this.cells[id] == 'undefined' ) {
      this.cells[id] = new Cell(x, z);
    }

    // Revive if they ask for it again
    if ( this.cells[id].status === cellStatusEnum.DESTROYED ) {
      this.cells[id].status = cellStatusEnum.INIT;
    }

    return this.cells[id];
  },
  GetReferenceLocation: function() {
    return this.GetReferenceLocationNoClone().clone();
  },
  GetReferenceLocationNoClone: function() {
    var p;

    if ( ironbane.player ) {
      p = ironbane.player.position;
    }
    else if ( socketHandler.spawnLocation ) {
      p = socketHandler.spawnLocation;
    }
    else {
      p = previewLocation;
    }

    return p;
  },
  ChangeZone: function(newZone) {

    if ( this.zone != newZone ) {
      this.Destroy();
      this.zone = newZone;
      this.status = terrainHandlerStatusEnum.INIT;
      bm(zones[this.zone].name);
    }

    if ( ironbane.player ) {
      ironbane.player.onChangeZone(newZone);
    }
    var zoneMusicPiece = ChooseRandom(GetZoneConfig("music"));

    if ( socketHandler.loggedIn ) {
      this.targetMusic = zoneMusicPiece;
    }

  },
  ReloadCells: function() {
    _.each(this.cells, function(cell) {
      cell.Reload();
    });
  },
  RayTest: function(ray, options) {

    options = options || {};

    var noTerrain = _.isUndefined(options.noTerrain) ?
                      false : options.noTerrain;
    var noMeshes = _.isUndefined(options.noMeshes) ?
                      false : options.noMeshes;
    var extraRange = _.isUndefined(options.extraRange) ?
                      1.0 : options.extraRange;
    var reverseRaySortOrder = _.isUndefined(options.reverseRaySortOrder) ?
                      false : options.reverseRaySortOrder;

    var unitReference = _.isUndefined(options.unitReference) ?
                      null : options.unitReference;

    var unitRayName = options.unitRayName;

    var testMeshesNearPosition = options.testMeshesNearPosition;

    if ( le("mpIgnoreOtherModels") ) {
      noMeshes = true;
    }

    // To optimize, we keep track of the last mesh & face that had a succesful
    // hit. In our use case, it is very likely that the next hit will be the
    // same face/object
    var intersects = [];

    if ( unitReference && false ) {
      if ( !unitReference.lastRayData ) {
        unitReference.lastRayData = {};
      }

      if ( unitReference.lastRayData[unitRayName] ) {
        var rayData = unitReference.lastRayData[unitRayName];
        // Check for the stuff that's inside
        // Do a simple raycast on one plane
        var subIntersects = ray.intersectObject( rayData.mesh,
          false, rayData.faceId );

        intersects = intersects.concat(subIntersects);

        if ( intersects.length > 0 ) return intersects;
      }
    }

    var meshList = [];

    if ( !noMeshes ) {
      for(var u=0;u<ironbane.unitList.length;u++) {
        var unit = ironbane.unitList[u];

        if ( !(unit instanceof Mesh) ) continue;

        if ( !unit.boundingSphere ) continue;

        if ( unit.InRangeOfPosition(testMeshesNearPosition, unit.boundingSphere.radius+extraRange) ) {
          meshList.push(unit);
        }
      }
    }


    if ( !noMeshes ) {
      for(var m=0;m<meshList.length;m++) {
        var subIntersects = ray.intersectOctreeObjects( meshList[m].octree.objects );

        intersects = intersects.concat(subIntersects);
      }
    }


    if ( !noTerrain ) {

      //30-6-2013 - Ingmar : check on existence of ironbane.player, during load of the game, the terrainhandler is loading first and then the player.
      // player does not have yet to exist here, so wait a few cycles
      if(ironbane.player) {
      if ( DistanceSq(this.lastOctreeBuildPosition, ironbane.player.position) > 10*10 ) {
          this.RebuildOctree();
      }

      var subIntersects = ray.intersectOctreeObjects( this.octreeResults );
      intersects = intersects.concat(subIntersects);
    }

}
    if ( reverseRaySortOrder ) {
      intersects.sort(function(a,b) { return b.distance - a.distance; } );
    }
    else {
      intersects.sort(function(a,b) { return a.distance - b.distance; } );
    }

    if ( intersects.length > 0 && unitReference && false ) {
      unitReference.lastRayData[unitRayName] = {
        mesh: intersects[0].object,
        faceId: intersects[0].faceIndex
      };
    }

    return intersects;
  },
  RebuildOctree: function() {
    this.lastOctreeBuildPosition = terrainHandler.GetReferenceLocation();
    this.octreeResults = terrainHandler.skybox.terrainOctree
                            .search(this.lastOctreeBuildPosition, 15, true);

    var me = this;
    _.each(terrainHandler.cells, function(cell) {
      me.octreeResults = me.octreeResults
        .concat(cell.octree.search(me.lastOctreeBuildPosition, 15, true));
    });
  },
  Tick: function(dTime) {

    if ( this.waterMesh ) {
      this.waterMesh.material.uniforms.time.value = (new Date().getTime() - ironbane.startTime)/1000.0;

      if ( this.skybox ) this.waterMesh.material.uniforms.vSun.value.copy(this.skybox.sunVector);

      var p = this.GetReferenceLocationNoClone();
      var cellPos = WorldToCellCoordinates(p.x, p.z, 10);
      var worldPos = CellToWorldCoordinates(cellPos.x, cellPos.z, 10);

      var id = worldPos.x+'-'+worldPos.z;

      terrainHandler.waterMesh.position.x = worldPos.x;
      terrainHandler.waterMesh.position.z = worldPos.z;

    }

    if ( this.transitionState === transitionStateEnum.MIDDLE && this.status === terrainHandlerStatusEnum.LOADED &&
      !this.IsLoadingCells() ) {

        terrainHandler.transitionState = -1;
        setTimeout(function(){
            terrainHandler.transitionState = transitionStateEnum.END;
        }, 100);
    }

    if ( !socketHandler.readyToReceiveUnits &&
      this.status === terrainHandlerStatusEnum.LOADED &&
      socketHandler.loggedIn ) {

      // soundHandler.Play("enterGame");

      socketHandler.readyToReceiveUnits = true;

      // Bring it on!
      socketHandler.socket.emit('readyToReceiveUnits', true, function (reply) {
        if ( ISDEF(reply.errmsg) ) {
          hudHandler.MessageAlert(reply.errmsg);
          return;
        }
      });


    }

    var p = this.GetReferenceLocation();
    var cp = WorldToCellCoordinates(p.x, p.z, cellSize);

    debug.SetWatch('Player Cell X', cp.x);
    debug.SetWatch('Player Cell Z', cp.z);

    switch(this.status) {
      case terrainHandlerStatusEnum.INIT:
        this.Awake();
        this.status = terrainHandlerStatusEnum.LOADING;
        break;
      case terrainHandlerStatusEnum.LOADING:

        break;
      case terrainHandlerStatusEnum.LOADED:
        for(x=cp.x-2;x<=cp.x+2;x+=1){
          for(z=cp.z-2;z<=cp.z+2;z+=1){
            var coords = CellToWorldCoordinates(x, z, cellSize);
            var tempVec = new THREE.Vector3(coords.x, p.y,
               coords.z);

            if ( p.InRangeOf(tempVec, cellLoadRange)) {
              this.GetCellByGridPosition(x, z);
            }
          }
        }

        _.each(this.cells, function(cell) {
            if ( !p.InRangeOf(cell.worldPosition, cellLoadRange+16)) {
              cell.Destroy();
            }
        });


        if ( this.skybox ) this.skybox.Tick(dTime);

        _.each(this.cells, function(cell) {
          cell.Tick(dTime);
        });
        break;
    }

    if ( this.targetMusic != this.currentMusic ) {
      var me = this;
      if ( this.currentMusic ) {
        soundHandler.FadeOut(this.currentMusic, 5.00);

        setTimeout(function() {
          soundHandler.FadeIn(me.targetMusic, 5.00) ;
        }, 5000);
      }
      else {
        soundHandler.FadeIn(this.targetMusic, 5.00) ;
      }

      this.currentMusic = this.targetMusic;
    }




  },
  IsLoadingCells: function() {
    return _.every(this.cells, function(cell) {
      return cell.status === cellStatusEnum.LOADING;
    });
  }
});


var terrainHandler = new TerrainHandler();
