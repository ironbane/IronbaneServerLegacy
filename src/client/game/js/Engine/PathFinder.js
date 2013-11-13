

IB.PathFinder = function() {

    var NODESIZE = 4;

    var scanned = [];
    var deleted = [];

    var saveInterval = null;

    function findNode(position) {

        var foundNode = null;

        var cell = terrainHandler.GetCellByWorldPosition(position);
        if ( cell && cell.graphData) {
            _.each(cell.graphData.nodes, function(node) {
                var pos = ConvertVector3(node.pos);
                if ( pos.Round(2).equals(position.clone().Round(2)) ) {
                    foundNode = node;
                }
            });
        }

        return foundNode;
    }

    return {
        // position is expected to be normalized in a spatial cell representation
        check: function(position) {

            var offsets = [
                new THREE.Vector3(1, 0, 0),
                new THREE.Vector3(1, 0, -1),
                new THREE.Vector3(0, 0, -1),
                new THREE.Vector3(-1, 0, -1),
                new THREE.Vector3(-1, 0, 0),
                new THREE.Vector3(-1, 0, 1),
                new THREE.Vector3(0, 0, 1),
                new THREE.Vector3(1, 0, 1)
            ];

            var cell = terrainHandler.GetCellByWorldPosition(position);


            var currentNode = findNode(position);

            var me = this;

            if ( !currentNode ) {

                // First cast to the ground to see where the terrain is
                var ray = new THREE.Raycaster(
                    position.clone().clone().add(new THREE.Vector3(0, le("ppMaxElevationDiff"), 0)),
                    new THREE.Vector3(0, -1, 0)
                );

                var intersects = terrainHandler.rayTest(ray, {
                    testMeshesNearPosition:position
                });

                // If no cast, means we cannot walk here
                if ( !intersects.length ) return;

                // Alter our original position to be sure
                position.copy(intersects[0].point);

                // No node here yet, add one first, then try again
                socketHandler.socket.emit('ppAddNode', position.clone().Round(2), function(reply) {

                    if ( !_.isUndefined(reply.errmsg) ) {
                        hudHandler.messageAlert(reply.errmsg);
                        return;
                    }

                    // Try again
                    me.check(position);

                });

                return;
            }

            var count = 0;

            _.each(offsets, function(offset) {
                count++;
                //setTimeout(function() {
                    // First cast to the ground to see where the terrain is
                    var ray = new THREE.Raycaster(
                        position.clone().add(offset.clone().multiplyScalar(NODESIZE).setY(le("ppMaxElevationDiff"))),
                        new THREE.Vector3(0, -1, 0)
                    );

                    var intersects = terrainHandler.rayTest(ray, {
                        testMeshesNearPosition:position
                    });

                    // If no cast, means we cannot walk here
                    if ( !intersects.length ) return;

                    var height = Math.abs(intersects[0].point.y-position.y);

                    // We allow a max of 45° therefore check the double distance
                    //
                    // NODESIZE  --\
                    // 0         ---
                    // -NODESIZE --/

                    if ( height > le("ppMaxElevationDiff") ) return;


                    // Now check if there is an obstacle in between

                    var pointOnGround = intersects[0].point;
                    var pointInAir = pointOnGround.clone().add(new THREE.Vector3(0, 0.5, 0));

                    ray = new THREE.Raycaster(
                        position.clone().add(new THREE.Vector3(0, 0.5, 0)),
                        // pointInAir,
                        pointInAir.clone()
                            .sub(position.clone().add(new THREE.Vector3(0, 0.5, 0)))
                            //.multiplyScalar(1)
                            .normalize()
                    );

                    intersects = terrainHandler.rayTest(ray, {
                        testMeshesNearPosition:position
                    });

                    var total = intersects.length ? 100 : 0;
                    _.each(intersects, function(i) {
                        total = Math.min(total, i.distance);
                    });

                    var trueLength = offset.length() * NODESIZE;

                    if ( !total || total > trueLength*1.25 ) {
                        // Looks good, go ahead and send the request

                        // Check first if a node already exists at this position
                        // If so, send the ppAddEdge request manually

                        var newNode = findNode(pointOnGround.Round(2));

                        if ( newNode ) {
                            socketHandler.socket.emit('ppAddEdge', {
                                    from:newNode.id,
                                    to:currentNode.id,
                                    twoway:true
                                }, function(reply) {

                                if ( !_.isUndefined(reply.errmsg) ) {
                                    hudHandler.messageAlert(reply.errmsg);
                                    return;
                                }

                            });
                        }
                        else {
                            socketHandler.socket.emit('ppAddNode', pointOnGround.Round(2), function(reply) {

                                if ( !_.isUndefined(reply.errmsg) ) {
                                    hudHandler.messageAlert(reply.errmsg);
                                    return;
                                }

                                socketHandler.socket.emit('ppAddEdge', {
                                        from:reply.newNodeID,
                                        to:currentNode.id,
                                        twoway:true
                                    }, function(reply) {

                                    if ( !_.isUndefined(reply.errmsg) ) {
                                        hudHandler.messageAlert(reply.errmsg);
                                        return;
                                    }

                                });

                            });
                        }


                    }
                    else {
                        // Check if perhaps we can add an object that is closer
                    }
                //}, 200*count);
            });

            if ( saveInterval ) clearTimeout(saveInterval);

            saveInterval = setTimeout(function() {
                //_.each(terrainHandler.cells, function(cell) {
                    cell.ReloadWaypointsOnly();
                //});
            }, 2000);


        },
        tick: function(dTime) {
            if ( ironbane.player ) {

                if ( le("ppUseSmallNodes") ) {
                    NODESIZE = 2;
                }
                else {
                    NODESIZE = 4;
                }


                if ( le("ppAutoScanMode") ) {
                    var cellPos = WorldToCellCoordinates(ironbane.player.position.x, ironbane.player.position.z, NODESIZE);
                    cellPos = CellToWorldCoordinates(cellPos.x, cellPos.z, NODESIZE);

                    var posToCheck = new THREE.Vector3(cellPos.x, ironbane.player.position.y.Round(2), cellPos.z);
                    var posToSave = new THREE.Vector3(cellPos.x, ironbane.player.position.y.Round(), cellPos.z);

                    var found = false;
                    _.each(scanned, function(scan) {
                        if ( scan.x === posToSave.x && scan.y === posToSave.y && scan.z === posToSave.z ) {
                            found = true;
                        }
                    });

                    if ( !found ) {
                        scanned.push(posToSave);
                        this.check(posToCheck);
                    }
                }
                else if ( le("ppAutoDeleteMode") ) {
                    var cell = terrainHandler.GetCellByWorldPosition(ironbane.player.position);
                    if ( cell && cell.graphData) {
                        _.each(cell.graphData.nodes, function(node) {
                            var pos = ConvertVector3(node.pos);
                            if ( ironbane.player.InRangeOfPosition(pos, NODESIZE) ) {
                              socketHandler.socket.emit('ppDeleteNode', {
                                id:node.id
                                }, function(reply) {

                                if ( !_.isUndefined(reply.errmsg) ) {
                                  hudHandler.messageAlert(reply.errmsg);
                                  return;
                                }

                              });
                            }
                        });
                    }
                }

                // At the player's position, check if we are able to reach
                // 8 adjacent positions
                // Cast a ray to each position. If it succeeds, send a request to add a node there.
                // If the node already exists, just add a link there
                // With the reply of the server with the node ID, we connect the node at our feet with the
                // one we just added. Repeat for other locations.



            }
        }
    };
};