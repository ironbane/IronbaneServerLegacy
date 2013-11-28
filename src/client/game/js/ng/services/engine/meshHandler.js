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

IronbaneApp.factory('MeshHandler', function(){
var MeshHandler = Class.extend({
  Init: function() {


    this.geometries = {};


  },
  Load: function(model, readyFunc, clone) {
    var me = this;
    if ( this.geometries[model] ) {
      setTimeout(function() {
        var val = me.geometries[model].geometry;
        if ( clone ) val = val.clone();
        readyFunc(val, me.geometries[model].jsonMaterials);
      }, 1);
      return;
    }


    var jsonLoader = new THREE.JSONLoader();


    // TODO are the jsonMaterials allowed to be copied over here?
    // Do they also need to be cached?
    jsonLoader.load( model, function( geometry, jsonMaterials ) {
      me.geometries[model] = {
        geometry: geometry,
        jsonMaterials: jsonMaterials
      };
      var val = me.geometries[model].geometry;
      if ( clone ) val = val.clone();
      readyFunc(val, me.geometries[model].jsonMaterials);
      // readyFunc(geometry);
    }, null);



  },
  ProcessMesh: function(options) {

    var geometry = options.geometry;
    var jsonMaterials = options.jsonMaterials;

    var rotation = options.rotation || new THREE.Euler();

    // meshData: comes from the database, preset tiles to paint
    // metadata: comes from the placed model,
    // so each instance of the model can be separately painted with other tiles
    var metadata = options.metadata || {};
    var meshData = options.meshData || {};

    // Rotate geometry
    _.each(geometry.vertices, function(v) {
      v.applyEuler(rotation);
    });

    geometry.computeCentroids();
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();

    geometry.dynamic = true;

    var tiles = [];
    for (var i=0; i<jsonMaterials.length; i++) {
      var tileIndex = i+1;
      var tile = "tiles/1";

      if ( !_.isUndefined(meshData["t"+tileIndex]) ) {
        tile = meshData["t"+tileIndex];
      }
      if ( !_.isUndefined(metadata["t"+tileIndex]) ) {
        if ( !_.isNaN(parseInt(metadata["t"+tileIndex],10)) ) {
          tile = "tiles/"+metadata["t"+tileIndex];
        }
        else {
          tile = "textures/"+metadata["t"+tileIndex];
        }
      }

      // Check if there's a map inside the material, and if it contains a sourceFile
      if ( !_.isUndefined(jsonMaterials[i]["mapDiffuse"]) && tile === "tiles/1" ) {
        // Extract the tile!
        var texture = jsonMaterials[i]["mapDiffuse"].split(/[\\/]/);
        texture = texture[texture.length-1].split(".")[0];

        if ( !_.isNaN(parseInt(texture,10)) ) {
          tile = "tiles/"+texture;
        }
        else {
          tile = "textures/"+texture;
        }
      }

      tiles.push(tile);
    }

    var uvscale = [];
    for(var x=1;x<=10;x++){
      if ( !_.isUndefined(metadata["ts"+x]) ) {
        uvscale.push(new THREE.Vector2(
          parseFloat(metadata["ts"+x]),parseFloat(metadata["ts"+x])));
      }
      else if ( !_.isUndefined(meshData["ts"+x]) ) {
        uvscale.push(new THREE.Vector2(
          parseFloat(meshData["ts"+x]),parseFloat(meshData["ts"+x])));
      }
      else {
        uvscale.push(new THREE.Vector2(1,1));
      }
    }


    var materials = [];

    for (var i=0; i<jsonMaterials.length; i++) {

      // if ( drawNameMesh ) {
      //   materials.push(textureHandler.getTexture('images/'+tiles[i] + '.png', false, {
      //     transparent:true,
      //     opacity:0.5,
      //     seeThrough:true,
      //     alphaTest:0.5,
      //     uvScaleX:uvscale[i].x,
      //     uvScaleY:uvscale[i].y
      //   }));
      // }
      // else {
        materials.push(ironbane.textureHandler.getTexture('images/'+tiles[i] + '.png', false, {
          transparent:meshData["transparent"] && meshData["transparent"] === 1,
          alphaTest:0.1,
          useLighting:true
        }));
      // }

      materials[i].shading = THREE.FlatShading;

    }

    return {
      geometry: geometry,
      materials: materials
    };
  },
  BuildMesh: function(geometry, meshData) {


  },
  tick: function(dTime) {



  }
});
return MeshHandler;
});