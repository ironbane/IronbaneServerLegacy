
// javascript-astar
// http://github.com/bgrins/javascript-astar
// Freely distributable under the MIT License.
// Implements the astar search algorithm in javascript using a binary heap.

var astar = {
  //    init: function(grid) {
  //        for(var x = 0, xl = grid.length; x < xl; x++) {
  //            for(var y = 0, yl = grid[x].length; y < yl; y++) {
  //                var node = grid[x][y];
  //                node.f = 0;
  //                node.g = 0;
  //                node.h = 0;
  //                node.cost = node.type;
  //                node.visited = false;
  //                node.closed = false;
  //                node.parent = null;
  //            }
  //        }
  //    },
  init: function(graph) {
    for(var x=0;x<graph.length;x++){
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
    //for(var x=0;x<graph.length;x++){
//    for(var x in graph) {
//      var node = graph[x];
//      delete node.f;
//      delete node.g;
//      delete node.h;
//      delete node.cost;
//      delete node.visited;
//      delete node.closed;
//      delete node.parent;
//    }
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

    while(openHeap.size() > 0) {

      // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
      var currentNode = openHeap.pop();

      // End case -- result has been found, return the traced path.
      if(currentNode === end) {
        var curr = currentNode;
        var ret = [];
        while(curr.parent) {
          ret.push(curr);
          curr = curr.parent;
        }
        return ret.reverse();
      }

      // Normal case -- move currentNode from open to closed, process each of its neighbors.
      currentNode.closed = true;

      // Find all neighbors for the current node. Optionally find diagonal neighbors as well (false by default).
      var neighbors = astar.neighbors(graph, currentNode);

      for(var i=0, il = neighbors.length; i < il; i++) {
        var neighbor = neighbors[i];

        if(neighbor.closed) {
          // Not a valid node to process, skip to next neighbor.
          continue;
        }

        // The g score is the shortest distance from start to current node.
        // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
        var gScore = currentNode.g + neighbor.cost;
        var beenVisited = neighbor.visited;

        if(!beenVisited || gScore < neighbor.g) {

          // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
          neighbor.visited = true;
          neighbor.parent = currentNode;
          neighbor.h = neighbor.h || astar.heuristic(neighbor.pos, end.pos);
          neighbor.g = gScore;
          neighbor.f = neighbor.g + neighbor.h;

          if (!beenVisited) {
            // Pushing to heap will put it in proper place based on the 'f' value.
            openHeap.push(neighbor);
          }
          else {
            // Already seen the node, but since it has been rescored we need to reorder it in the heap
            openHeap.rescoreElement(neighbor);
          }
        }
      }
    }

    // No result was found - empty array signifies failure to find path.
    return [];
  },
  heuristic: function(pos1, pos2) {
    //return VectorDistanceSq(pos1, pos2);
    return DistanceSq(pos1, pos2);
  },
  //    manhattan: function(pos0, pos1) {
  //        // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
  //
  //        var d1 = Math.abs (pos1.x - pos0.x);
  //        var d2 = Math.abs (pos1.y - pos0.y);
  //        return d1 + d2;
  //    },
  neighbors: function(graph, node) {
    var ret = [];

//      for(var e in node.edges) {
//          ret.push(graph[node.edges[e]]);
//      }

    for(var e=0;e<node.edges.length;e++) {
      for(var n=0;n<graph.length;n++) {
        if ( graph[n].id == node.edges[e] ) {
          ret.push(graph[n]);
        }
      }
    }

    return ret;
  }
//    neighbors: function(grid, node) {
//        var ret = [];
//        var x = node.x;
//        var y = node.y;
//
//        // West
//        if(grid[x-1] && grid[x-1][y]) {
//            ret.push(grid[x-1][y]);
//        }
//
//        // East
//        if(grid[x+1] && grid[x+1][y]) {
//            ret.push(grid[x+1][y]);
//        }
//
//        // South
//        if(grid[x] && grid[x][y-1]) {
//            ret.push(grid[x][y-1]);
//        }
//
//        // North
//        if(grid[x] && grid[x][y+1]) {
//            ret.push(grid[x][y+1]);
//        }
//
//        if (diagonals) {
//
//            // Southwest
//            if(grid[x-1] && grid[x-1][y-1]) {
//                ret.push(grid[x-1][y-1]);
//            }
//
//            // Southeast
//            if(grid[x+1] && grid[x+1][y-1]) {
//                ret.push(grid[x+1][y-1]);
//            }
//
//            // Northwest
//            if(grid[x-1] && grid[x-1][y+1]) {
//                ret.push(grid[x-1][y+1]);
//            }
//
//            // Northeast
//            if(grid[x+1] && grid[x+1][y+1]) {
//                ret.push(grid[x+1][y+1]);
//            }
//
//        }
//
//        return ret;
//    }
};


