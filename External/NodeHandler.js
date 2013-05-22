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
                if ( terrainHandler.world[x] === undefined ) continue;

                for(var z=cp.z-1;z<=cp.z+1;z+=1){

                    if ( terrainHandler.world[x][z] === undefined ) continue;
                    if ( terrainHandler.world[x][z]["graph"] === undefined ) continue;
                    if ( terrainHandler.world[x][z]["graph"]["nodes"] === undefined ) continue;

                    var graphArr = terrainHandler.world[x][z]['graph']['nodes'];
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
            if ( terrainHandler.world[cellPos.x][cellPos.z]['graph']['nodes'] === undefined ) {
                terrainHandler.world[cellPos.x][cellPos.z]['graph']['nodes'] = [];
            }                     
            terrainHandler.world[cellPos.x][cellPos.z]['graph']['nodes'].push(newNode);
            
            terrainHandler.GetChunkByAccurateWorldPosition(position.x, position.z).ReloadWaypointsOnly();    
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
            terrainHandler.world[nodeInfoFrom.cx][nodeInfoFrom.cz]['graph']['nodes'][nodeInfoFrom.index]['edges'].push(to);
            terrainHandler.world[nodeInfoFrom.cx][nodeInfoFrom.cz]['graph']['nodes'][nodeInfoFrom.index]['edges']
                = _.uniq(terrainHandler.world[nodeInfoFrom.cx][nodeInfoFrom.cz]['graph']['nodes'][nodeInfoFrom.index]['edges']);
            
            if ( !twoway ) {
                for(var c in terrainHandler.chunks) terrainHandler.chunks[c].ReloadWaypointsOnly();  
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
            terrainHandler.world[nodeInfoDelete.cx][nodeInfoDelete.cz]['graph']['nodes'].splice(nodeInfoDelete.index, 1);            
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
            for(var cx in terrainHandler.world) {
                for(var cz in terrainHandler.world[cx]) {
                    
                    if ( terrainHandler.world[cx][cz]["graph"] === undefined ) continue;
                    if ( terrainHandler.world[cx][cz]["graph"]["nodes"] === undefined ) continue;
                    
                    for(var n=0;n<terrainHandler.world[cx][cz]['graph']['nodes'].length;n++) {
                        var edgesToKeep = [];
                        for(var e=0;e<terrainHandler.world[cx][cz]['graph']['nodes'][n]['edges'].length;e++){
                            if ( terrainHandler.world[cx][cz]['graph']['nodes'][n]['edges'][e] != id ) {
                                edgesToKeep.push(terrainHandler.world[cx][cz]['graph']['nodes'][n]['edges'][e]);
                            }
                        }
                        terrainHandler.world[cx][cz]['graph']['nodes'][n]['edges'] = edgesToKeep;
                    }
                }                
            }  
            
            
            for(var c in terrainHandler.chunks) terrainHandler.chunks[c].ReloadWaypointsOnly();  
        }        
    }
});

var nodeHandler = new NodeHandler();