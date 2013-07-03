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


var MeshHandler = Class.extend({
  Init: function() {


    this.geometries = {};


  },
  Load: function(model, readyFunc, scale) {

    if ( this.geometries[model] ) {
      setTimeout(function() {
        readyFunc(THREE.GeometryUtils.clone(meshHandler.geometries[model]));
        // readyFunc(THREE.GeometryUtils.clone(meshHandler.geometries[model]));
      }, 1000);
      return;
    }


    var jsonLoader = new THREE.JSONLoader();



    jsonLoader.load( model, function( geometry ) {
      meshHandler.geometries[model] = geometry;
      readyFunc(THREE.GeometryUtils.clone(geometry));
      // readyFunc(geometry);
    }, null, scale);



  },
  SpiceGeometry: function(geometry, rotation, metadata, meshData, param, drawNameMesh) {




    // Rotate geometry

    var rotationMatrix = new THREE.Matrix4();
    rotationMatrix.setRotationFromEuler(
      new THREE.Vector3((rotation.x).ToRadians(),
        (rotation.y).ToRadians(), (rotation.z).ToRadians()));

    for(var v=0;v<geometry.vertices.length;v++) {
      geometry.vertices[v] = rotationMatrix.multiplyVector3(geometry.vertices[v]);
    }

    geometry.computeCentroids();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    geometry.dynamic = true;

    var tiles = [];
    for(var x=1;x<=10;x++){
      if ( ISDEF(metadata["t"+x]) ) {
        tiles.push("tiles/"+metadata["t"+x]);
      }
      else if ( ISDEF(meshData["t"+x]) ) {
        tiles.push(meshData["t"+x]);
      }
      else {
        tiles.push(1);
      }
    }

    var uvscale = [];
    for(var x=1;x<=10;x++){
      if ( ISDEF(metadata["ts"+x]) ) {
        uvscale.push(new THREE.Vector2(
          parseFloat(metadata["ts"+x]),parseFloat(metadata["ts"+x])));
      }
      else if ( ISDEF(meshData["ts"+x]) ) {
        uvscale.push(new THREE.Vector2(
          parseFloat(meshData["ts"+x]),parseFloat(meshData["ts"+x])));
      }
      else {
        uvscale.push(new THREE.Vector2(1,1));
      }
    }


    var materials = [];

    // Only push materials that are actually inside the materials
    for (var i=0; i<geometry.jsonMaterials.length; i++) {

      // // Check if there's a map inside the material, and if it contains a sourceFile
      // if ( !_.isUndefined(geometry.jsonMaterials[i]["mapDiffuse"]) && tiles[i] === "tiles/1" ) {
      //   // Extract the tile!
      //   tiles[i] = "tiles/"+(geometry.jsonMaterials[i]["mapDiffuse"].split("."))[0];
      // }

      if ( drawNameMesh ) {
        materials.push(textureHandler.GetTexture('plugins/game/images/'+tiles[i] + '.png', false, {
          transparent:true,
          opacity:0.5,
          seeThrough:true,
          alphaTest:0.5,
          uvScaleX:uvscale[i].x,
          uvScaleY:uvscale[i].y
        }));
      }
      else {
        materials.push(textureHandler.GetTexture('plugins/game/images/'+tiles[i] + '.png', false, {
          transparent:meshData["transparent"] === 1,
          alphaTest:0.1,
          useLighting:true
        }));
      }

      materials[i].shading = THREE.FlatShading;

    //materials.push(new THREE.MeshBasicMaterial({color:Math.random() * 0xffffff}));

    //materials[i].wireframe = true;
    }

    // De-allocate the old materials
    //        _.each(geometry.materials, function(material) {
    //          material.deallocate();
    //          ironbane.renderer.deallocateMaterial( material );
    //        });

    geometry.materials = materials;

    return geometry;
  },
  BuildMesh: function(geometry, meshData) {


  },
  Tick: function(dTime) {



  }
});


var meshHandler = new MeshHandler();
