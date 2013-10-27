// javascript-astar
// http://github.com/bgrins/javascript-astar
// Freely distributable under the MIT License.
// Implements the astar search algorithm in javascript using a binary heap.


var THREE = require('../../src/client/game/lib/three/three.js');

function BinaryHeap(scoreFunction) {
    this.content = [];
    this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
    push: function(element) {
        // Add the new element to the end of the array.
        this.content.push(element);

        // Allow it to sink down.
        this.sinkDown(this.content.length - 1);
    },
    pop: function() {
        // Store the first element so we can return it later.
        var result = this.content[0];
        // Get the element at the end of the array.
        var end = this.content.pop();
        // If there are any elements left, put the end element at the
        // start, and let it bubble up.
        if (this.content.length > 0) {
            this.content[0] = end;
            this.bubbleUp(0);
        }
        return result;
    },
    remove: function(node) {
        var i = this.content.indexOf(node);

        // When it is found, the process seen in 'pop' is repeated
        // to fill up the hole.
        var end = this.content.pop();

        if (i !== this.content.length - 1) {
            this.content[i] = end;

            if (this.scoreFunction(end) < this.scoreFunction(node)) {
                this.sinkDown(i);
            }
            else {
                this.bubbleUp(i);
            }
        }
    },
    size: function() {
        return this.content.length;
    },
    rescoreElement: function(node) {
        this.sinkDown(this.content.indexOf(node));
    },
    sinkDown: function(n) {
        // Fetch the element that has to be sunk.
        var element = this.content[n];

        // When at 0, an element can not sink any further.
        while (n > 0) {

            // Compute the parent element's index, and fetch it.
            var parentN = ((n + 1) >> 1) - 1,
                parent = this.content[parentN];
            // Swap the elements if the parent is greater.
            if (this.scoreFunction(element) < this.scoreFunction(parent)) {
                this.content[parentN] = element;
                this.content[n] = parent;
                // Update 'n' to continue at the new position.
                n = parentN;
            }

            // Found a parent that is less, no need to sink any further.
            else {
                break;
            }
        }
    },
    bubbleUp: function(n) {
        // Look up the target element and its score.
        var length = this.content.length,
            element = this.content[n],
            elemScore = this.scoreFunction(element);

        while (true) {
            // Compute the indices of the child elements.
            var child2N = (n + 1) << 1,
                child1N = child2N - 1;
            // This is used to store the new position of the element,
            // if any.
            var swap = null;
            // If the first child exists (is inside the array)...
            if (child1N < length) {
                // Look it up and compute its score.
                var child1 = this.content[child1N],
                    child1Score = this.scoreFunction(child1);

                // If the score is less than our element's, we need to swap.
                if (child1Score < elemScore)
                    swap = child1N;
            }

            // Do the same checks for the other child.
            if (child2N < length) {
                var child2 = this.content[child2N],
                    child2Score = this.scoreFunction(child2);
                if (child2Score < (swap === null ? elemScore : child1Score)) {
                    swap = child2N;
                }
            }

            // If the element needs to be moved, swap it, and continue.
            if (swap !== null) {
                this.content[n] = this.content[swap];
                this.content[swap] = element;
                n = swap;
            }

            // Otherwise, we are done.
            else {
                break;
            }
        }
    }
};

var distanceToSquared = function(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    var dz = a.z - b.z;

    return dx * dx + dy * dy + dz * dz;
};

var astar = {
    init: function(graph) {
        for (var x = 0; x < graph.length; x++) {
            //for(var x in graph) {
            var node = graph[x];
            node.f = 0;
            node.g = 0;
            node.h = 0;
            node.cost = 1.0;
            node.visited = false;
            node.closed = false;
            node.parent = null;
        }
    },
    cleanUp: function(graph) {
        for (var x = 0; x < graph.length; x++) {
            var node = graph[x];
            delete node.f;
            delete node.g;
            delete node.h;
            delete node.cost;
            delete node.visited;
            delete node.closed;
            delete node.parent;
        }
    },
    heap: function() {
        return new BinaryHeap(function(node) {
            return node.f;
        });
    },
    search: function(graph, start, end) {
        astar.init(graph);
        //heuristic = heuristic || astar.manhattan;


        var openHeap = astar.heap();

        openHeap.push(start);

        while (openHeap.size() > 0) {

            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            var currentNode = openHeap.pop();

            // End case -- result has been found, return the traced path.
            if (currentNode === end) {
                var curr = currentNode;
                var ret = [];
                while (curr.parent) {
                    ret.push(curr);
                    curr = curr.parent;
                }
                this.cleanUp(ret);
                return ret.reverse();
            }

            // Normal case -- move currentNode from open to closed, process each of its neighbours.
            currentNode.closed = true;

            // Find all neighbours for the current node. Optionally find diagonal neighbours as well (false by default).
            var neighbours = astar.neighbours(graph, currentNode);

            for (var i = 0, il = neighbours.length; i < il; i++) {
                var neighbour = neighbours[i];

                if (neighbour.closed) {
                    // Not a valid node to process, skip to next neighbour.
                    continue;
                }

                // The g score is the shortest distance from start to current node.
                // We need to check if the path we have arrived at this neighbour is the shortest one we have seen yet.
                var gScore = currentNode.g + neighbour.cost;
                var beenVisited = neighbour.visited;

                if (!beenVisited || gScore < neighbour.g) {

                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighbour.visited = true;
                    neighbour.parent = currentNode;
                    if (!neighbour.centroid || !end.centroid) debugger;
                    neighbour.h = neighbour.h || astar.heuristic(neighbour.centroid, end.centroid);
                    neighbour.g = gScore;
                    neighbour.f = neighbour.g + neighbour.h;

                    if (!beenVisited) {
                        // Pushing to heap will put it in proper place based on the 'f' value.
                        openHeap.push(neighbour);
                    }
                    else {
                        // Already seen the node, but since it has been rescored we need to reorder it in the heap
                        openHeap.rescoreElement(neighbour);
                    }
                }
            }
        }

        // No result was found - empty array signifies failure to find path.
        return [];
    },
    heuristic: function(pos1, pos2) {
        return distanceToSquared(pos1, pos2);
    },
    neighbours: function(graph, node) {
        var ret = [];

        for (var e = 0; e < node.neighbours.length; e++) {
            ret.push(graph[node.neighbours[e]]);
        }

        return ret;
    }
};

module.exports = astar;