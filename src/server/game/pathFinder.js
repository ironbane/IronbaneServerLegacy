var fs = require('fs');
var _ = require('underscore');
var astar = require(APP_ROOT_PATH + '/Game/AI/astar.js');
var THREE = require('../../client/game/lib/three/three.js');


var distanceToSquared = function(a, b) {

    var dx = a.x - b.x;
    var dy = a.y - b.y;
    var dz = a.z - b.z;

    return dx * dx + dy * dy + dz * dz;

};


//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/math/is-point-in-poly [rev. #0]
function isPointInPoly(poly, pt){
    for(var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
        ((poly[i].z <= pt.z && pt.z < poly[j].z) || (poly[j].z <= pt.z && pt.z < poly[i].z))
        && (pt.x < (poly[j].x - poly[i].x) * (pt.z - poly[i].z) / (poly[j].z - poly[i].z) + poly[i].x)
        && (c = !c);
    return c;
}

function isVectorInPolygon(vector, polygon, vertices) {

    // reference point will be the centroid of the polygon
    // We need to rotate the vector as well as all the points which the polygon uses

    var center = polygon.centroid;

    var lowestPoint = 100000;
    var highestPoint = -100000;

    var polygonVertices = [];

    _.each(polygon.vertexIds, function(vId) {
        lowestPoint = Math.min(vertices[vId].y, lowestPoint);
        highestPoint = Math.max(vertices[vId].y, highestPoint);
        polygonVertices.push(vertices[vId]);
    });

    if ( vector.y < highestPoint+0.5 && vector.y > lowestPoint-0.5 &&
        isPointInPoly(polygonVertices, vector) ) {
        return true;
    }
    return false;
}


function triarea2(a, b, c) {
    var ax = b.x - a.x;
    var az = b.z - a.z;
    var bx = c.x - a.x;
    var bz = c.z - a.z;
    return bx * az - ax * bz;
}

function vequal(a, b) {
    return distanceToSquared(a, b) < 0.00001;
}

function Channel() {
    this.portals = [];
}

Channel.prototype.push = function(p1, p2) {
    if (p2 === undefined) p2 = p1;
    this.portals.push({
        left: p1,
        right: p2
    });
};

Channel.prototype.stringPull = function() {
    var portals = this.portals;
    var pts = [];
    // Init scan state
    var portalApex, portalLeft, portalRight;
    var apexIndex = 0,
        leftIndex = 0,
        rightIndex = 0;

    portalApex = portals[0].left;
    portalLeft = portals[0].left;
    portalRight = portals[0].right;

    // Add start point.
    pts.push(portalApex);

    for (var i = 1; i < portals.length; i++) {
        var left = portals[i].left;
        var right = portals[i].right;

        // Update right vertex.
        if (triarea2(portalApex, portalRight, right) <= 0.0) {
            if (vequal(portalApex, portalRight) || triarea2(portalApex, portalLeft, right) > 0.0) {
                // Tighten the funnel.
                portalRight = right;
                rightIndex = i;
            }
            else {
                // Right over left, insert left to path and restart scan from portal left point.
                pts.push(portalLeft);
                // Make current left the new apex.
                portalApex = portalLeft;
                apexIndex = leftIndex;
                // Reset portal
                portalLeft = portalApex;
                portalRight = portalApex;
                leftIndex = apexIndex;
                rightIndex = apexIndex;
                // Restart scan
                i = apexIndex;
                continue;
            }
        }

        // Update left vertex.
        if (triarea2(portalApex, portalLeft, left) >= 0.0) {
            if (vequal(portalApex, portalLeft) || triarea2(portalApex, portalRight, left) < 0.0) {
                // Tighten the funnel.
                portalLeft = left;
                leftIndex = i;
            }
            else {
                // Left over right, insert right to path and restart scan from portal right point.
                pts.push(portalRight);
                // Make current right the new apex.
                portalApex = portalRight;
                apexIndex = rightIndex;
                // Reset portal
                portalLeft = portalApex;
                portalRight = portalApex;
                leftIndex = apexIndex;
                rightIndex = apexIndex;
                // Restart scan
                i = apexIndex;
                continue;
            }
        }
    }

    if ((pts.length === 0) || (!vequal(pts[pts.length - 1], portals[portals.length - 1].left))) {
        // Append last point to path.
        pts.push(portals[portals.length - 1].left);
    }

    this.path = pts;
    return pts;
};

var zoneNodes = {};
var path = null;


module.exports = {
    setPath: function(newPath) {
        path = newPath;
    },
    getPath: function(newPath) {
        return path;
    },
    loadZone: function(zone) {

        zoneNodes[zone] = null;

        // First check if we have a nodes.json file for this zoneß
        var zonePath = path + "/" + zone + "/navnodes.json";

        if (fs.existsSync(zonePath)) {
            // Load static gameobjects
            var data = JSON.parse(fs.readFileSync(zonePath, 'utf8'));

            zoneNodes[zone] = data;

            console.log("Loaded navigation data for zone " + zone + "");
        }
        else {
            console.log("Warning: no navigation data found for zone " + zone + "");
        }

    },
    test: function() {
        // console.log(this.getRandomNode(3));
        // this.findPath(zoneNodes[3].polygons[0].centroid, zoneNodes[3].polygons[46].centroid, 3);
    },
    getGroup: function(zone, position) {

        if ( !zoneNodes[zone] ) return null;

        var closestNodeGroup = null;

        var distance = Math.pow(50, 2);

        _.each(zoneNodes[zone].groups, function(group, index) {
            _.each(group, function(node) {
                var measuredDistance = distanceToSquared(node.centroid, position);
                if (measuredDistance < distance) {
                    closestNodeGroup = index;
                    distance = measuredDistance;
                }
            });
        });

        return closestNodeGroup;
    },
    getRandomNode: function(zone, group, nearPosition, nearRange) {

        if ( !zoneNodes[zone] ) return new THREE.Vector3();

        nearPosition = nearPosition || null;
        nearRange = nearRange || 0;

        var candidates = [];

        var polygons = zoneNodes[zone].groups[group];

        _.each(polygons, function(p) {
            if ( nearPosition && nearRange ) {
                if ( distanceToSquared(nearPosition, p.centroid) < nearRange*nearRange ) {
                    candidates.push(p.centroid);
                }
            }
            else {
                candidates.push(p.centroid);
            }
        });

        return _.sample(candidates) || new THREE.Vector3();
    },
    findPath: function(startPosition, targetPosition, zone, group) {

        var allNodes = zoneNodes[zone].groups[group];
        var vertices = zoneNodes[zone].vertices;

        var closestNode = null;
        var distance = Math.pow(50, 2);

        _.each(allNodes, function(node) {
            var measuredDistance = distanceToSquared(node.centroid, startPosition);
            if (measuredDistance < distance) {
                closestNode = node;
                distance = measuredDistance;
            }
        }, this);


        var farthestNode = null;
        distance = Math.pow(50, 2);
        //for(var x=0;x<allNodes.length;x++){

        _.each(allNodes, function(node) {
            var measuredDistance = distanceToSquared(node.centroid, targetPosition);
            if (measuredDistance < distance &&
                isVectorInPolygon(targetPosition, node, vertices)) {
                farthestNode = node;
                distance = measuredDistance;
            }
        }, this);

        // If we can't find any node, just go straight to the target
        if (!closestNode || !farthestNode) {
            //this.targetNodePosition = targetPosition.clone();
            return null;
        }

        var paths = astar.search(allNodes, closestNode, farthestNode);

        // console.log("Path:");
        // console.log(paths);

        var getPortalFromTo = function(a, b) {
            for (var i = 0; i < a.neighbours.length; i++) {
                if (a.neighbours[i] === b.id) {
                    return a.portals[i];
                }
            }
        };

        // We got the corridor
        // Now pull the rope

        var channel = new Channel();

        channel.push(startPosition);

        for (var i = 0; i < paths.length; i++) {
            var polygon = paths[i];

            var nextPolygon = paths[i + 1];

            if (nextPolygon) {
                var portals = getPortalFromTo(polygon, nextPolygon);
                channel.push(
                    vertices[portals[0]],
                    vertices[portals[1]]
                );
            }

        }

        channel.push(targetPosition);

        channel.stringPull();


        var threeVectors = [];

        _.each(channel.path, function(c) {
            threeVectors.push(new THREE.Vector3(c.x, c.y, c.z));
        });

        // We don't need the first one, as we already know our start position
        threeVectors.shift();

        return threeVectors;
    }
};

