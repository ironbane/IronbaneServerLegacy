/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var NodeHandler = Class.extend({
    Init: function() {

    },
    GetNodeArrayIndex: function(zone, id) {

        if ( SERVER ) {
            for(var cx in worldHandler.world[zone]) {
                for(var cz in worldHandler.world[zone][cx]) {

                    if ( worldHandler.world[zone][cx][cz]["graph"] === undefined ) continue;
                    if ( worldHandler.world[zone][cx][cz]["graph"]["nodes"] === undefined ) continue;

                    var graphArr = worldHandler.world[zone][cx][cz]['graph']['nodes'];
                    var index = _.indexOf(graphArr, (_.where(graphArr, {id:id}))[0]);

                    if ( index != -1 ) return {index:index,cx:cx,cz:cz};
                }
            }
        }
        else {
            var p = terrainHandler.GetReferenceLocation();

            var cp = WorldToCellCoordinates(p.x, p.z, cellSize);

            for(var x=cp.x-1;x<=cp.x+1;x+=1){
                for(var z=cp.z-1;z<=cp.z+1;z+=1){

                    if ( _.isUndefined(terrainHandler.cells[x+'-'+z])  ) continue;

                    var graphData = terrainHandler.GetCellByGridPosition(x, z).graphData;

                    if ( graphData["nodes"] === undefined ) continue;

                    var graphArr = graphData["nodes"];
                    var index = _.indexOf(graphArr, (_.where(graphArr, {id:id}))[0]);
                    if ( index != -1 ) return {index:index,cx:x,cz:z};

                }
            }
        }

        return null;
    },
    AddNode: function(zone, id, position) {

        var cellPos = WorldToCellCoordinates(position.x, position.z, cellSize);

        var newNode = {
            id:id,
            pos:position,
            edges:[]
        };

        // We'll help build the graph from here
        if ( SERVER ) {
            if ( worldHandler.world[zone][cellPos.x][cellPos.z]['graph']['nodes'] === undefined ) {
                worldHandler.world[zone][cellPos.x][cellPos.z]['graph']['nodes'] = [];
            }
            worldHandler.world[zone][cellPos.x][cellPos.z]['graph']['nodes'].push(newNode);
        }
        else {
            var graphData = terrainHandler.GetCellByGridPosition(cellPos.x, cellPos.z).graphData;
            if ( graphData['nodes'] === undefined ) {
                graphData['nodes'] = [];
            }
            graphData['nodes'].push(newNode);

            terrainHandler.GetCellByWorldPosition(position).ReloadWaypointsOnly();
        }

    },
    GetNodePosition: function(zone, id) {
        var nodeInfo = this.GetNodeArrayIndex(zone, id);
        return worldHandler.world[zone][nodeInfo.cx][nodeInfo.cz]['graph']['nodes'][nodeInfo.index]['pos'];
    },
    AddEdge: function(zone, from, to, twoway) {

        twoway = twoway || false;

        var nodeInfoFrom = this.GetNodeArrayIndex(zone, from);

        if ( SERVER ) {
            worldHandler.world[zone][nodeInfoFrom.cx][nodeInfoFrom.cz]['graph']['nodes'][nodeInfoFrom.index]['edges'].push(to);
            worldHandler.world[zone][nodeInfoFrom.cx][nodeInfoFrom.cz]['graph']['nodes'][nodeInfoFrom.index]['edges']
                = _.uniq(worldHandler.world[zone][nodeInfoFrom.cx][nodeInfoFrom.cz]['graph']['nodes'][nodeInfoFrom.index]['edges']);
        }
        else {
            var graphData = terrainHandler.GetCellByGridPosition(nodeInfoFrom.cx, nodeInfoFrom.cz).graphData;

            if ( !graphData.nodes ) return;


            graphData.nodes[nodeInfoFrom.index]['edges'].push(to);
            graphData.nodes[nodeInfoFrom.index]['edges']
                = _.uniq(graphData.nodes[nodeInfoFrom.index]['edges']);

            if ( !twoway ) {

                _.each(terrainHandler.cells, function(cell) {
                    cell.ReloadWaypointsOnly();
                });

            }
        }

        if ( twoway ) {
            this.AddEdge(zone, to, from, false);
        }
    },
    DeleteNode: function(zone, id) {
        var nodeInfoDelete = this.GetNodeArrayIndex(zone, id);

        if ( SERVER ) log("Going to delete "+id+" in "+zone);

        if ( SERVER ) {
            worldHandler.world[zone][nodeInfoDelete.cx][nodeInfoDelete.cz]['graph']['nodes'].splice(nodeInfoDelete.index, 1);
        }
        else {
            var graphData = terrainHandler.GetCellByGridPosition(nodeInfoDelete.cx, nodeInfoDelete.cz).graphData;
            graphData['nodes'].splice(nodeInfoDelete.index, 1);
        }


        // Delete edges that point to this id
        if ( SERVER ) {
            for(var cx in worldHandler.world[zone]) {
                for(var cz in worldHandler.world[zone][cx]) {

                    if ( worldHandler.world[zone][cx][cz]["graph"] === undefined ) continue;
                    if ( worldHandler.world[zone][cx][cz]["graph"]["nodes"] === undefined ) continue;

                    for(var n=0;n<worldHandler.world[zone][cx][cz]['graph']['nodes'].length;n++) {
                        var edgesToKeep = [];
                        for(var e=0;e<worldHandler.world[zone][cx][cz]['graph']['nodes'][n]['edges'].length;e++){
                            if ( worldHandler.world[zone][cx][cz]['graph']['nodes'][n]['edges'][e] != id ) {
                                edgesToKeep.push(worldHandler.world[zone][cx][cz]['graph']['nodes'][n]['edges'][e]);
                            }
                        }
                        worldHandler.world[zone][cx][cz]['graph']['nodes'][n]['edges'] = edgesToKeep;
                    }
                }
            }
        }
        else {


            _.each(terrainHandler.cells, function(cell) {
                    var graphData = cell.graphData;

                    if ( graphData["nodes"] === undefined ) return;

                    var graphArr = graphData["nodes"];

                    for(var n=0;n<graphArr.length;n++) {
                        var edgesToKeep = [];
                        for(var e=0;e<graphArr[n]['edges'].length;e++){
                            if ( graphArr[n]['edges'][e] != id ) {
                                edgesToKeep.push(graphArr[n]['edges'][e]);
                            }
                        }
                        graphArr[n]['edges'] = edgesToKeep;
                    }
            });


            _.each(terrainHandler.cells, function(cell) {
                cell.ReloadWaypointsOnly();
            });
        }
    }
});

var nodeHandler = new NodeHandler();