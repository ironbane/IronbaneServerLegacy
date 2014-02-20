var shell = require('shelljs');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var THREE = require('../src/client/game/lib/three/three.js');
var ProgressBar = require('progress')

    function roundNumber(number, decimals) {
        var newnumber = new Number(number + '').toFixed(parseInt(decimals));
        return parseFloat(newnumber);
    }

var nodeIdCount = 1;
var polygonId = 1;


var bar;
var barConfig = {
    // complete: "X",
    // incomplete: ".",
    width: 30
};

module.exports = function(grunt) {

    grunt.registerMultiTask('buildnavnodes', 'Generate navigation data from the level mesh', function() {
        var task = this,
            taskDone = this.async();

        var options = this.options({
            assetDir: "./IronbaneAssets/"
        });

        var mergeVertexIds = function(aList, bList) {

            var sharedVertices = [];

            _.each(aList, function(vId) {
                if (_.contains(bList, vId)) {
                    sharedVertices.push(vId);
                }
            });

            if (sharedVertices.length < 2) return [];

            // console.log("TRYING aList:", aList, ", bList:", bList, ", sharedVertices:", sharedVertices);

            if (_.contains(sharedVertices, aList[0]) && _.contains(sharedVertices, aList[aList.length - 1])) {
                // Vertices on both edges are bad, so shift them once to the left
                aList.push(aList.shift());
            }

            if (_.contains(sharedVertices, bList[0]) && _.contains(sharedVertices, bList[bList.length - 1])) {
                // Vertices on both edges are bad, so shift them once to the left
                bList.push(bList.shift());
            }

            // Again!
            sharedVertices = [];

            _.each(aList, function(vId) {
                if (_.contains(bList, vId)) {
                    sharedVertices.push(vId);
                }
            });

            var clockwiseMostSharedVertex = sharedVertices[1];
            var counterClockwiseMostSharedVertex = sharedVertices[0];


            var cList = _.clone(aList);
            while (cList[0] !== clockwiseMostSharedVertex) {
                cList.push(cList.shift());
            }

            var c = 0;

            var temp = _.clone(bList);
            while (temp[0] !== counterClockwiseMostSharedVertex) {
                temp.push(temp.shift());

                if (c++ > 10) debugger;
            }

            // Shave
            temp.shift();
            temp.pop();

            cList = cList.concat(temp);

            // console.log("aList:", aList, ", bList:", bList, ", cList:", cList, ", sharedVertices:", sharedVertices);

            return cList;
        };

        var setPolygonCentroid = function(polygon, navigationMesh) {
            var sum = new THREE.Vector3();

            var vertices = navigationMesh.vertices;

            _.each(polygon.vertexIds, function(vId) {
                sum.add(vertices[vId]);
            });

            sum.divideScalar(polygon.vertexIds.length);

            polygon.centroid.copy(sum);
        };

        var cleanPolygon = function(polygon, navigationMesh) {

            var newVertexIds = [];

            var vertices = navigationMesh.vertices;

            for (var i = 0; i < polygon.vertexIds.length; i++) {

                var vertex = vertices[polygon.vertexIds[i]];

                var nextVertexId, previousVertexId;
                var nextVertex, previousVertex;

                // console.log("nextVertex: ", nextVertex);

                if (i === 0) {
                    nextVertexId = polygon.vertexIds[1];
                    previousVertexId = polygon.vertexIds[polygon.vertexIds.length - 1];
                }
                else if (i === polygon.vertexIds.length - 1) {
                    nextVertexId = polygon.vertexIds[0];
                    previousVertexId = polygon.vertexIds[polygon.vertexIds.length - 2];
                }
                else {
                    nextVertexId = polygon.vertexIds[i + 1];
                    previousVertexId = polygon.vertexIds[i - 1];
                }

                nextVertex = vertices[nextVertexId];
                previousVertex = vertices[previousVertexId];

                var a = nextVertex.clone().sub(vertex);
                var b = previousVertex.clone().sub(vertex);

                var angle = a.angleTo(b);

                // console.log(angle);

                if (angle > Math.PI - 0.01 && angle < Math.PI + 0.01) {
                    // Unneccesary vertex
                    // console.log("Unneccesary vertex: ", polygon.vertexIds[i]);
                    // console.log("Angle between "+previousVertexId+", "+polygon.vertexIds[i]+" "+nextVertexId+" was: ", angle);


                    // Remove the neighbours who had this vertex
                    var goodNeighbours = [];
                    _.each(polygon.neighbours, function(neighbour) {
                        if (!_.contains(neighbour.vertexIds, polygon.vertexIds[i])) {
                            goodNeighbours.push(neighbour);
                        }
                    });
                    polygon.neighbours = goodNeighbours;


                    // TODO cleanup the list of vertices and rebuild vertexIds for all polygons
                }
                else {
                    newVertexIds.push(polygon.vertexIds[i]);
                }

            }

            // console.log("New vertexIds: ", newVertexIds);

            polygon.vertexIds = newVertexIds;

            setPolygonCentroid(polygon, navigationMesh);

        };

        var isConvex = function(polygon, navigationMesh) {

            var vertices = navigationMesh.vertices;

            if (polygon.vertexIds.length < 3) return false;

            var convex = true;

            var total = 0;

            var results = [];

            for (var i = 0; i < polygon.vertexIds.length; i++) {

                var vertex = vertices[polygon.vertexIds[i]];

                var nextVertex, previousVertex;

                // console.log("nextVertex: ", nextVertex);

                if (i === 0) {
                    nextVertex = vertices[polygon.vertexIds[1]];
                    previousVertex = vertices[polygon.vertexIds[polygon.vertexIds.length - 1]];
                }
                else if (i === polygon.vertexIds.length - 1) {
                    nextVertex = vertices[polygon.vertexIds[0]];
                    previousVertex = vertices[polygon.vertexIds[polygon.vertexIds.length - 2]];
                }
                else {
                    nextVertex = vertices[polygon.vertexIds[i + 1]];
                    previousVertex = vertices[polygon.vertexIds[i - 1]];
                }

                var a = nextVertex.clone().sub(vertex);
                var b = previousVertex.clone().sub(vertex);

                var angle = a.angleTo(b);
                total += angle;

                // console.log(angle);
                if (angle === Math.PI || angle === 0) return false;

                var r = a.cross(b).y;
                results.push(r);
                // console.log("pushed: ", r);
            }

            // if ( total > (polygon.vertexIds.length-2)*Math.PI ) return false;

            _.each(results, function(r) {
                if (r === 0) convex = false;
            });

            if (results[0] > 0) {
                _.each(results, function(r) {
                    if (r < 0) convex = false;
                });
            }
            else {
                _.each(results, function(r) {
                    if (r > 0) convex = false;
                });
            }

            // console.log("allowed: "+total+", max: "+(polygon.vertexIds.length-2)*Math.PI);
            // if ( total > (polygon.vertexIds.length-2)*Math.PI ) convex = false;

            // console.log("Convex: "+(convex ? "true": "false"));



            return convex;
        };

        var buildPolygonGroups = function(navigationMesh) {

            var polygons = navigationMesh.polygons;
            var vertices = navigationMesh.vertices;

            bar = new ProgressBar('Building polygon groups[:bar] :percent', _.extend(barConfig, {
                total: polygons.length
            }));

            var polygonGroups = [];
            var groupCount = 0;

            var spreadGroupId = function(polygon) {
                _.each(polygon.neighbours, function(neighbour) {
                    if (_.isUndefined(neighbour.group)) {
                        neighbour.group = polygon.group;
                        spreadGroupId(neighbour);
                    }
                });
            };

            _.each(polygons, function(polygon, i) {

                bar.tick();

                if (_.isUndefined(polygon.group)) {
                    polygon.group = groupCount++;
                    // Spread it
                    spreadGroupId(polygon);
                }

                if (!polygonGroups[polygon.group]) polygonGroups[polygon.group] = [];

                polygonGroups[polygon.group].push(polygon);
            });


            // Separate groups for testing
            // var count = 0;
            // _.each(polygonGroups, function(polygonGroup) {
            //     var done = {};
            //     count += 0.01;
            //     _.each(polygonGroup, function(polygon) {
            //         _.each(polygon.vertexIds, function(vId) {
            //             if ( !done[vId] ) vertices[vId].y += count;
            //             done[vId] = true;
            //         });
            //     });
            // });


            console.log("Groups built: ", polygonGroups.length);

            return polygonGroups;
        };

        function array_intersect() {
            var i, all, shortest, nShortest, n, len, ret = [],
                obj = {}, nOthers;
            nOthers = arguments.length - 1;
            nShortest = arguments[0].length;
            shortest = 0;
            for (i = 0; i <= nOthers; i++) {
                n = arguments[i].length;
                if (n < nShortest) {
                    shortest = i;
                    nShortest = n;
                }
            }

            for (i = 0; i <= nOthers; i++) {
                n = (i === shortest) ? 0 : (i || shortest); //Read the shortest array first. Read the first array instead of the shortest
                len = arguments[n].length;
                for (var j = 0; j < len; j++) {
                    var elem = arguments[n][j];
                    if (obj[elem] === i - 1) {
                        if (i === nOthers) {
                            ret.push(elem);
                            obj[elem] = 0;
                        }
                        else {
                            obj[elem] = i;
                        }
                    }
                    else if (i === 0) {
                        obj[elem] = 0;
                    }
                }
            }
            return ret;
        }

        var buildPolygonNeighbours = function(polygon, navigationMesh) {
            polygon.neighbours = [];

            // All other nodes that contain at least two of our vertices are our neighbours
            for (var i = 0, len = navigationMesh.polygons.length; i < len; i++) {
                if (polygon === navigationMesh.polygons[i]) continue;

                // Don't check polygons that are too far, since the intersection tests take a long time
                if (polygon.centroid.distanceToSquared(navigationMesh.polygons[i].centroid) > 100 * 100) continue;

                var matches = array_intersect(polygon.vertexIds, navigationMesh.polygons[i].vertexIds);
                // var matches = _.intersection(polygon.vertexIds, navigationMesh.polygons[i].vertexIds);

                if (matches.length >= 2) {
                    polygon.neighbours.push(navigationMesh.polygons[i]);
                }
            }
        };

        var buildPolygonsFromGeometry = function(geometry) {

            geometry.mergeVertices();
            THREE.GeometryUtils.triangulateQuads(geometry);

            console.log("Vertices:", geometry.vertices.length, "polygons:", geometry.faces.length);

            var polygons = [];
            var vertices = geometry.vertices;
            var faceVertexUvs = geometry.faceVertexUvs;

            bar = new ProgressBar('Building polygons      [:bar] :percent', _.extend(barConfig, {
                total: geometry.faces.length
            }));

            // Convert the faces into a custom format that supports more than 3 vertices
            _.each(geometry.faces, function(face) {
                bar.tick();
                polygons.push({
                    id: polygonId++,
                    vertexIds: [face.a, face.b, face.c],
                    centroid: face.centroid,
                    normal: face.normal,
                    neighbours: []
                });
            });

            var navigationMesh = {
                polygons: polygons,
                vertices: vertices,
                faceVertexUvs: faceVertexUvs
            };

            bar = new ProgressBar('Calculating neighbours [:bar] :percent', _.extend(barConfig, {
                total: polygons.length
            }));

            // Build a list of adjacent polygons
            _.each(polygons, function(polygon) {
                bar.tick();
                buildPolygonNeighbours(polygon, navigationMesh);
            });

            return navigationMesh;
        };

        var cleanNavigationMesh = function(navigationMesh) {

            var polygons = navigationMesh.polygons;
            var vertices = navigationMesh.vertices;


            // Remove steep triangles
            var up = new THREE.Vector3(0, 1, 0);
            polygons = _.filter(polygons, function(polygon) {
                var angle = Math.acos(up.dot(polygon.normal));
                return angle < (Math.PI / 4);
            });


            // Remove unnecessary edges using the Hertel-Mehlhorn algorithm

            // 1. Find a pair of adjacent nodes (i.e., two nodes that share an edge between them)
            //    whose normals are nearly identical (i.e., their surfaces face the same direction).


            var newPolygons = [];

            _.each(polygons, function(polygon) {

                if (polygon.toBeDeleted) return;

                var keepLooking = true;

                while (keepLooking) {
                    keepLooking = false;

                    _.each(polygon.neighbours, function(otherPolygon) {

                        if (polygon === otherPolygon) return;

                        if (Math.acos(polygon.normal.dot(otherPolygon.normal)) < 0.01) {
                            // That's pretty equal alright!

                            // Merge otherPolygon with polygon

                            var testVertexIdList = [];

                            var testPolygon = {
                                vertexIds: mergeVertexIds(polygon.vertexIds, otherPolygon.vertexIds),
                                neighbours: polygon.neighbours,
                                normal: polygon.normal.clone(),
                                centroid: polygon.centroid.clone()
                            };

                            cleanPolygon(testPolygon, navigationMesh);

                            if (isConvex(testPolygon, navigationMesh)) {
                                otherPolygon.toBeDeleted = true;


                                // Inherit the neighbours from the to be merged polygon, except ourself
                                _.each(otherPolygon.neighbours, function(otherPolygonNeighbour) {

                                    // Set this poly to be merged to be no longer our neighbour
                                    otherPolygonNeighbour.neighbours = _.without(otherPolygonNeighbour.neighbours, otherPolygon);

                                    if (otherPolygonNeighbour !== polygon) {
                                        // Tell the old Polygon's neighbours about the new neighbour who has merged
                                        otherPolygonNeighbour.neighbours.push(polygon);
                                    }
                                    else {
                                        // For ourself, we don't need to know about ourselves
                                        // But we inherit the old neighbours
                                        polygon.neighbours = polygon.neighbours.concat(otherPolygon.neighbours);
                                        polygon.neighbours = _.uniq(polygon.neighbours);

                                        // Without ourselves in it!
                                        polygon.neighbours = _.without(polygon.neighbours, polygon);
                                    }
                                });

                                polygon.vertexIds = mergeVertexIds(polygon.vertexIds, otherPolygon.vertexIds);

                                // console.log(polygon.vertexIds);
                                // console.log("Merge!");

                                cleanPolygon(polygon, navigationMesh);

                                keepLooking = true;
                            }

                        }
                    });
                }


                if (!polygon.toBeDeleted) {
                    newPolygons.push(polygon);
                }

            });

            var isUsed = function(vId) {
                var contains = false;
                _.each(newPolygons, function(p) {
                    if (!contains && _.contains(p.vertexIds, vId)) {
                        contains = true;
                    }
                });
                return contains;
            };

            // Clean vertices
            var keepChecking = false;
            for (var i = 0; i < vertices.length; i++) {
                if (!isUsed(i)) {

                    // Decrement all vertices that are higher than i
                    _.each(newPolygons, function(p) {
                        for (var j = 0; j < p.vertexIds.length; j++) {
                            if (p.vertexIds[j] > i) {
                                p.vertexIds[j]--;
                            }
                        }
                    });

                    vertices.splice(i, 1);
                    i--;
                }

            };


            navigationMesh.polygons = newPolygons;
            navigationMesh.vertices = vertices;

        };

        var buildNavigationMesh = function(geometry) {

            // console.log("vertices:", geometry.vertices.length, "polygons:", geometry.faces.length);

            var navigationMesh = buildPolygonsFromGeometry(geometry);

            // cleanNavigationMesh(navigationMesh);
            // console.log("Pre-clean:", navigationMesh.polygons.length, "polygons,", navigationMesh.vertices.length, "vertices.");

            // console.log("")
            // console.log("Vertices:", navigationMesh.vertices.length, "polygons,", navigationMesh.polygons.length, "vertices.");

            return navigationMesh;
        };

        var getSharedVerticesInOrder = function(a, b) {

            var aList = a.vertexIds;
            var bList = b.vertexIds;

            var sharedVertices = [];

            _.each(aList, function(vId) {
                if (_.contains(bList, vId)) {
                    sharedVertices.push(vId);
                }
            });

            if (sharedVertices.length < 2) return [];

            // console.log("TRYING aList:", aList, ", bList:", bList, ", sharedVertices:", sharedVertices);

            if (_.contains(sharedVertices, aList[0]) && _.contains(sharedVertices, aList[aList.length - 1])) {
                // Vertices on both edges are bad, so shift them once to the left
                aList.push(aList.shift());
            }

            if (_.contains(sharedVertices, bList[0]) && _.contains(sharedVertices, bList[bList.length - 1])) {
                // Vertices on both edges are bad, so shift them once to the left
                bList.push(bList.shift());
            }

            // Again!
            sharedVertices = [];

            _.each(aList, function(vId) {
                if (_.contains(bList, vId)) {
                    sharedVertices.push(vId);
                }
            });

            return sharedVertices;
        };

        var saveToJs = function(file, navigationMesh) {

            console.log("Saving to JSON");

            var saveObj = {};

            _.each(navigationMesh.vertices, function(v) {
                v.x = roundNumber(v.x, 2);
                v.y = roundNumber(v.y, 2);
                v.z = roundNumber(v.z, 2);
            });

            saveObj.vertices = navigationMesh.vertices;

            var groups = buildPolygonGroups(navigationMesh);

            saveObj.groups = [];

            var findPolygonIndex = function(group, p) {
                for (var i = 0; i < group.length; i++) {
                    if (p === group[i]) return i;
                }
            };

            bar = new ProgressBar('Grouping               [:bar] :percent', _.extend(barConfig, {
                total: groups.length
            }));

            _.each(groups, function(group) {

                bar.tick();

                var newGroup = [];

                _.each(group, function(p) {

                    var neighbours = [];

                    _.each(p.neighbours, function(n) {
                        neighbours.push(findPolygonIndex(group, n));
                    });


                    // Build a portal list to each neighbour
                    var portals = [];
                    _.each(p.neighbours, function(n) {
                        portals.push(getSharedVerticesInOrder(p, n));
                    });


                    p.centroid.x = roundNumber(p.centroid.x, 2);
                    p.centroid.y = roundNumber(p.centroid.y, 2);
                    p.centroid.z = roundNumber(p.centroid.z, 2);

                    newGroup.push({
                        id: findPolygonIndex(group, p),
                        neighbours: neighbours,
                        vertexIds: p.vertexIds,
                        centroid: p.centroid,
                        portals: portals
                    });

                });

                saveObj.groups.push(newGroup);
            });



            fs.writeFileSync(file, JSON.stringify(saveObj));

        };


        var buildNodes = function(file) {

            var zone = path.basename(file, ".nav.js");

            console.log("Building nodes for zone " + zone);
            console.log(file);

            var rawfile = JSON.parse(fs.readFileSync(file, 'utf8'));
            var jsonLoader = new THREE.JSONLoader();
            result = jsonLoader.parse(rawfile);

            var navigationMesh = buildNavigationMesh(result.geometry);

            saveToJs(options.assetDir + "data/" + zone + "/navnodes.json", navigationMesh);
            // saveToJs(options.assetDir+"test.obj", navigationMesh);

        };



        task.filesSrc.forEach(function(file) {
            buildNodes(file);
        });


        grunt.log.writeln("All done!");
        taskDone(true);


    });

};