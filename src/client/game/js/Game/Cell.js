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

var cellStatusEnum = {
    INIT: 0,
    LOADING: 1,
    LOADED: 2,
    DESTROYED: 3
};

var Cell = Class.extend({
    Init: function(cellX, cellZ) {

        this.cellX = cellX;
        this.cellZ = cellZ;

        var tempVec = CellToWorldCoordinates(this.cellX, this.cellZ, cellSize);
        this.worldPosition = new THREE.Vector3(tempVec.x, 0, tempVec.z);

        this.status = cellStatusEnum.INIT;

        this.objects = [];
        this.waypointMeshes = [];

        // Used to construct the model geometry, so we can still cast shadows
        this.modelGeometry = null;
        this.modelMesh = null;

        // Numbers of models that must be 0 before we can add the cell mesh
        this.modelsToBuild = 0;

        this.objectData = null;
        this.graphData = null;

        this.filesToLoad = 0;

        this.octree = new THREE.Octree();

    },
    Tick: function(dTime) {

        switch(this.status) {
            case cellStatusEnum.INIT:
                this.Load();
                this.status = cellStatusEnum.LOADING;
                break;
            case cellStatusEnum.LOADING:

                break;
            case cellStatusEnum.LOADED:

                break;
        }

    },
    Load: function() {
        var me = this;


        // Todo: switch to promises
        this.filesToLoad++;
        // Make the request, and when the request is in, build the mesh
        var objectsFile = 'plugins/game/data/'+terrainHandler.zone+'/'+this.cellX+'/'+this.cellZ+'/objects.json?'+(new Date()).getTime();
        $.getJSON(objectsFile, function(data) {
          me.filesToLoad--;
          me.objectData = data;
          console.log('Loaded: '+objectsFile);
          me.FinishLoad();
        }).error(function() {
          me.filesToLoad--;
          me.objectData = [];
          console.warn('Not found: '+objectsFile);
          me.FinishLoad();
        });


        if ( isEditor ) {
          this.filesToLoad++;
          var graphFile = 'plugins/game/data/'+terrainHandler.zone+'/'+this.cellX+'/'+this.cellZ+'/graph.json?'+(new Date()).getTime();
          $.getJSON(graphFile, function(data) {
            me.filesToLoad--;
            me.graphData = data;
            console.log('Loaded graph: '+graphFile);
            me.FinishLoad();
          }).error(function() {
            me.filesToLoad--;
            me.graphData = {};
            console.warn('No graph found: '+graphFile);
            me.FinishLoad();
          });
        }

    },
    FinishLoad: function() {
        if ( !this.filesToLoad ) {
            // Make the mesh
            this.LoadObjects();
        }
    },
    AddMesh: function() {

        if ( this.modelsToBuild ) return;

        // Load all 3D models that belong to this group
        this.models = new THREE.Mesh(this.modelGeometry, new THREE.MeshFaceMaterial());
        this.models.castShadow = true;
        ironbane.scene.add(this.models);

        // Collision data is now saved to this cell
        this.octree.add(this.models, true);

        ironbane.renderer.shadowMapEnabled = true;
        ironbane.renderer.shadowMapAutoUpdate = true;
        ironbane.renderer.shadowMapSoft = false;


        if ( ironbane.shadowMapUpdateTimer ) {
            clearTimeout(ironbane.shadowMapUpdateTimer);
        }

        ironbane.shadowMapUpdateTimer = setTimeout(function() {
            ironbane.renderer.shadowMapAutoUpdate = false;
        }, 100);


        this.status = cellStatusEnum.LOADED;

        terrainHandler.RebuildOctree();
    },
    Destroy: function() {

        if ( this.modelGeometry ) {
            _.each(this.modelGeometry.materials, function(material) {
              material.deallocate();
            });

            this.modelGeometry.deallocate();
        }

        if ( this.models ) {
            //terrainHandler.skybox.terrainOctree.remove(this.models);

            // Possible mem leak suspect
            this.octree = new THREE.Octree();

            ironbane.scene.remove(this.models);
        }


        _.each(this.objects, function(object) {
            object.Destroy();

            // Remove from unitList
            ironbane.unitList = _.without(ironbane.unitList, object);
        });

        this.objects = [];

        this.status = cellStatusEnum.DESTROYED;
    },
    ReloadWaypointsOnly: function() {

        _.each(this.objects, function(object) {
            if ( object instanceof Waypoint) {
                object.Destroy();

                // Remove from unitList
                ironbane.unitList = _.without(ironbane.unitList, object);
                this.objects = _.without(this.objects, object);
            }
        }, this);

        _.each(this.waypointMeshes, function(waypointMesh) {
            ironbane.scene.remove(waypointMesh);
        });

        this.waypointMeshes = [];

        this.LoadObjects(true);
    },
    ReloadObjectsOnly: function() {

        for(var o=0;o<this.objects.length;o++) {
            this.objects[o].Destroy();
            // Remove from unitList

            ironbane.unitList = _.without(ironbane.unitList, this.objects[o]);
        }

        for(var m=0;m<this.waypointMeshes.length;m++) {
            ironbane.scene.remove(this.waypointMeshes[m]);
        }
        this.waypointMeshes = [];

        this.objects = [];

        this.LoadObjects();
    },
    Reload: function() {
        this.Destroy();
        this.status = cellStatusEnum.INIT;
    },
    LoadObjects: function(waypointsOnly) {

        this.modelGeometry = new THREE.Geometry();

        // We just want to load the objects in memory, not actually add them to
        // the scene. Later, merge in the geometry with the terrain mesh

        waypointsOnly = waypointsOnly || false;

        if ( _.isEmpty(this.objectData) ) {
            // Skip to add mesh instantly
            this.AddMesh();
        }

        _.each(this.objectData, function(gObject) {

            if ( waypointsOnly ) return;

            var pos = new THREE.Vector3(gObject.x, gObject.y, gObject.z);

            var unit = null;

            var param = gObject.p;

            // metadata could be undefined, but the Mesh class should handle that
            var metadata = gObject.metadata ? gObject.metadata : {};

            var meshData = preMeshes[param] ? preMeshes[param] : null;

            var rotation = new THREE.Vector3(gObject.rX, gObject.rY, gObject.rZ);

            if ( meshData && (meshData.special || le("globalEnable")) ) {

                switch (gObject.t) {
                    case UnitTypeEnum.BILLBOARD:
                        unit = new Billboard(pos, gObject.r, 0, gObject.p);
                        break;
                    case UnitTypeEnum.MESH:
                        unit = new Mesh(pos, rotation, 0, gObject.p, metadata);
                        break;
                }

                if ( unit ) {
                    ironbane.unitList.push(unit);
                    this.objects.push(unit);
                }

            }
            else {

                this.modelsToBuild++;

                if ( !meshData ) {
                  meshData = preMeshes[0];
                }

                var filename = (meshData.filename.split("."))[0]+".js";

                var model = meshPath + filename;

                (function(cell, pos, rotation, metadata, meshData, param){
                meshHandler.Load(model, function(geometry) {

                        var geometry = meshHandler.SpiceGeometry(geometry, rotation,
                            metadata, meshData, param, false);

                        _.each(geometry.vertices, function(v) {
                            v.addSelf(pos);
                        });

                        // // Merge it with the cell geometry we have so far
                        THREE.GeometryUtils.merge( cell.modelGeometry, geometry );

                        geometry.deallocate();

                        // Ready! Decrease modelsToBuild
                        cell.modelsToBuild--;

                        cell.AddMesh();

                }, meshData.scale);
                })(this, pos, rotation, metadata, meshData, param);

            }

        // Keep track of the ID's in a list of the cell
        }, this);

        if ( showEditor && levelEditor.editorGUI.enablePathPlacer ) {

            var graph = this.graphData;

            if ( graph && !_.isUndefined(graph.nodes)) {
                for(var n=0;n<graph.nodes.length;n++) {
                    var node = graph.nodes[n];

                    var pos = ConvertVector3(node.pos);

                    var texture = "misc/waypoint";
                    if ( levelEditor.selectedNode && levelEditor.selectedNode.id == parseInt(node.id, 10) ) {
                        texture = "misc/waypoint_red";
                    }

                    var nodeID = parseInt(node.id, 10);
                    var unit = new Waypoint(pos, node);

                    if ( unit ) {
                        ironbane.unitList.push(unit);
                        this.objects.push(unit);

                        for (var e=0;e<node.edges.length;e++ ) {
                            var edge = node.edges[e];

                            // Find the node in adjacent cells

                            // Load cells around us
                            this.isLoaded = true;

                            for(var x=this.cellX-1;x<=this.cellX+1;x+=1){
                                for(var z=this.cellZ-1;z<=this.cellZ+1;z+=1){

                                    if ( _.isUndefined(terrainHandler.cells[x+'-'+z])  ) continue;

                                    var graphData = terrainHandler.GetCellByGridPosition(x, z).graphData;

                                    if ( graphData.nodes === undefined ) continue;

                                    var subnodes = graphData.nodes;

                                    for( var sn=0;sn<subnodes.length;sn++ ) {

                                        if ( edge == subnodes[sn].id ) {
                                            var subpos = ConvertVector3(subnodes[sn].pos);
                                            var vec = subpos.subSelf(pos);
                                            if ( !vec.isZero() ) {
                                                var aH = new THREE.ArrowHelper(vec, pos.clone().addSelf(new THREE.Vector3(0, 0.5, 0)), vec.length()-1, 0x00FFFF);
                                                this.waypointMeshes.push(aH);
                                                ironbane.scene.add(aH);
                                            }

                                        }

                                    }

                                }
                            }
                        }

                    }


                }
            }

        }

    }
});
