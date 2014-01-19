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
        // console.log("making: " + cellX + "," + cellZ);

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

        this.octree = new THREE.Octree({undeferred: true});



    },
    tick: function(dTime) {

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

        this.totalMaterials = [];

        // Todo: switch to promises
        this.filesToLoad++;
        // Make the request, and when the request is in, build the mesh
        var objectsFile = 'data/'+terrainHandler.zone+'/'+this.cellX+'/'+this.cellZ+'/objects.json?'+(new Date()).getTime();
        $.getJSON(objectsFile).done(function(data) {
          me.objectData = data;
          console.log('Loaded: '+objectsFile);
         }).error(function() {
          me.objectData = [];
          console.warn('Not found: '+objectsFile);
          }).always(function(){
           me.filesToLoad--;
           me.FinishLoad();

        });


        if ( isEditor ) {
          this.filesToLoad++;
          var graphFile = 'data/'+terrainHandler.zone+'/'+this.cellX+'/'+this.cellZ+'/graph.json?'+(new Date()).getTime();
          $.getJSON(graphFile).done(function(data) {
            me.graphData = data;
            console.log('Loaded graph: '+graphFile);
          }).error(function() {
            me.graphData = {};
            console.warn('No graph found: '+graphFile);
            }).always(function(){
            me.filesToLoad--;
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

        _.each(this.totalMaterials, function(material) {
          material.side = THREE.DoubleSide;
        });

        // Load all 3D models that belong to this group
        this.models = new THREE.Mesh(this.modelGeometry, new THREE.MeshFaceMaterial(this.totalMaterials));
        this.models.castShadow = true;

        this.models.material.side = THREE.DoubleSide;

        ironbane.scene.add(this.models);

        // Collision data is now saved to this cell
        this.octree.add(this.models, {useFaces:true});

        ironbane.renderer.shadowMapAutoUpdate = true;

        if ( ironbane.shadowMapUpdateTimer ) {
            clearTimeout(ironbane.shadowMapUpdateTimer);
        }

        ironbane.shadowMapUpdateTimer = setTimeout(function() {
            if ( !le("globalEnable") ) {
                ironbane.renderer.shadowMapAutoUpdate = false;
            }
        }, 1000);

        this.status = cellStatusEnum.LOADED;

        terrainHandler.RebuildOctree();
    },
    Destroy: function() {

        if ( this.modelGeometry ) {
            this.modelGeometry.dispose();
            this.totalMaterials = [];
        }

        if ( this.models ) {
            // TODO Possible mem leak suspect? but removing manually is too slow...
            this.octree = new THREE.Octree({undeferred: true});
            _.each(this.totalMaterials, function(material) {
                material.dispose();
            });
            ironbane.scene.remove(this.models);
        }
        _.each(this.objects, function(object) {
            object.Destroy();
            // Remove from unitList
            ironbane.getUnitList().removeUnit(object);
        });

        this.objects = [];
        this.status = cellStatusEnum.DESTROYED;
    },
    ReloadWaypointsOnly: function() {

        _.each(this.objects, function(object) {
            if ( object instanceof Waypoint) {
                object.Destroy();
                // Remove from unitList
                ironbane.getUnitList().removeUnit(object);
                this.objects = _.without(this.objects, object);
            }
        }, this);

        this.ClearWaypoints();

        this.LoadObjects(true);
    },
    ReloadObjectsOnly: function() {

        for(var o=0;o<this.objects.length;o++) {
            this.objects[o].Destroy();
            // Remove from unitList
        }
        ironbane.getUnitList().removeUnits(this.objects);

        this.ClearWaypoints();

        this.objects = [];

        this.LoadObjects();
    },
    Reload: function() {
        this.Destroy();
        this.status = cellStatusEnum.INIT;
    },
    ClearWaypoints: function() {
        _.each(this.waypointMeshes, function(waypointMesh) {
            ironbane.scene.remove(waypointMesh);
            releaseMesh(waypointMesh);
        });
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

            // Eulers are expressed in radians, so convert!
            var rotation = new THREE.Euler(gObject.rX, gObject.rY, gObject.rZ);


            // Special meshes do not get "baked" into the cell modelGeometry
            if ( meshData && (meshData.special || le("globalEnable")) ) {

                switch (gObject.t) {
                    case UnitTypeEnum.MESH:
                        unit = new Mesh(pos, rotation, 0, gObject.p, metadata);
                        break;
                }

                // Make the units dynamic so we can alter them
                unit.dynamic = true;

                // Also set a special flag so we can only select these objects using the editor
                unit.canSelectWithEditor = true;

                if ( unit ) {
                    ironbane.getUnitList().addUnit(unit);
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
                ironbane.meshHandler.Load(model, function(geometry, jsonMaterials) {

                        // Geometry cannot be instanced here as me modify it directly,
                        // so it must be cloned! We therefore pass true to the third param of
                        // meshHandler.Load()

                        var result = ironbane.meshHandler.ProcessMesh({
                            geometry: geometry,
                            jsonMaterials: jsonMaterials,
                            rotation: rotation,
                            metadata: metadata,
                            meshData: meshData
                        });

                        var materials = result.materials;
                        geometry = result.geometry;



                        //cell.totalMaterials = cell.totalMaterials.concat(materials);

                        _.each(geometry.vertices, function(v) {
                            v.add(pos);
                        });

                        // // Merge it with the cell geometry we have so far
                        mergeMaterials( cell.modelGeometry, cell.totalMaterials, geometry, materials );

                        geometry.dispose();

                        // Ready! Decrease modelsToBuild
                        cell.modelsToBuild--;

                        cell.AddMesh();

                }, true);
                })(this, pos, rotation, metadata, meshData, param);

            }

        // Keep track of the ID's in a list of the cell
        }, this);

    }
});
