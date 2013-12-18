
if ( !SERVER ) {

  var cachedCharacters = {};

  function getCharacterTexture(options) {
      var props = ['skin', 'eyes', 'hair', 'feet', 'body', 'head', 'big'];
      _.each(props, function(p) {
          if(!(p in options)) {
              options[p] = 0;
          }
      });

      var cachefile = 'images/characters/cache/' +
          [options.skin, options.eyes, options.hair, options.feet, options.body, options.head, (options.big ? 1 : 0)].join('_') +
          '.png';

      if(_.every(options, function(p) { return parseInt(p, 10) === 0; })) {
          cachefile = 'media/images/misc/blank.png';
      }

      return cachefile;
  }


  function mergeMaterials(geometry1, materials1, geometry2, materials2) {

    var matrix, matrixRotation,
    vertexOffset = geometry1.vertices.length,
    uvPosition = geometry1.faceVertexUvs[ 0 ].length,
    vertices1 = geometry1.vertices,
    vertices2 = geometry2.vertices,
    faces1 = geometry1.faces,
    faces2 = geometry2.faces,
    uvs1 = geometry1.faceVertexUvs[ 0 ],
    uvs2 = geometry2.faceVertexUvs[ 0 ];

    var geo1MaterialsMap = {};

    for ( var i = 0; i < materials1.length; i ++ ) {

      var id = materials1[ i ].id;

      geo1MaterialsMap[ id ] = i;

    }

    // vertices

    for ( var i = 0, il = vertices2.length; i < il; i ++ ) {

      var vertex = vertices2[ i ];

      var vertexCopy = vertex.clone();

      if ( matrix ) matrix.multiplyVector3( vertexCopy );

      vertices1.push( vertexCopy );

    }

    // faces

    for ( i = 0, il = faces2.length; i < il; i ++ ) {

      var face = faces2[ i ], faceCopy, normal, color,
      faceVertexNormals = face.vertexNormals,
      faceVertexColors = face.vertexColors;


      faceCopy = new THREE.Face3( face.a + vertexOffset, face.b + vertexOffset, face.c + vertexOffset );

      faceCopy.normal.copy( face.normal );

      if ( matrixRotation ) matrixRotation.multiplyVector3( faceCopy.normal );

      for ( var j = 0, jl = faceVertexNormals.length; j < jl; j ++ ) {

        normal = faceVertexNormals[ j ].clone();

        if ( matrixRotation ) matrixRotation.multiplyVector3( normal );

        faceCopy.vertexNormals.push( normal );

      }

      faceCopy.color.copy( face.color );

      for ( var j = 0, jl = faceVertexColors.length; j < jl; j ++ ) {

        color = faceVertexColors[ j ];
        faceCopy.vertexColors.push( color.clone() );

      }

      if ( face.materialIndex !== undefined ) {

        var material2 = materials2[ face.materialIndex ];
        var materialId2 = material2.id;

        var materialIndex = geo1MaterialsMap[ materialId2 ];

        if ( materialIndex === undefined ) {

          materialIndex = materials1.length;
          geo1MaterialsMap[ materialId2 ] = materialIndex;

          materials1.push( material2 );

        }

        faceCopy.materialIndex = materialIndex;

      }

      faceCopy.centroid.copy( face.centroid );
      if ( matrix ) matrix.multiplyVector3( faceCopy.centroid );

      faces1.push( faceCopy );

    }

    // uvs

    for ( i = 0, il = uvs2.length; i < il; i ++ ) {

      var uv = uvs2[ i ], uvCopy = [];

      for ( var j = 0, jl = uv.length; j < jl; j ++ ) {

        uvCopy.push( new THREE.Vector2( uv[ j ].x, uv[ j ].y ) );

      }

      uvs1.push( uvCopy );

    }

  }

  if (!window.console) console = {};
  console.log = console.log || function(){};
  console.warn = console.warn || function(){};
  console.error = console.error || function(){};
  console.info = console.info || function(){};


  THREE.Object3D.prototype.LookFlatAt = function (position, billboardStyle) {

    var target = position.clone();

    billboardStyle = billboardStyle || false;

    if ( billboardStyle ) {
      target.y = this.position.y;
    }



    if ( this.unit ) {

      var matrix = new THREE.Matrix4();

      matrix.lookAt( target, this.position, this.up );

      this.unit.mesh.geometry.dynamic = true;
      this.unit.mesh.geometry.verticesNeedUpdate = true;

      for (var i = 0; i < this.unit.mesh.geometry.vertices.length; i++) {
        this.unit.mesh.geometry.vertices[i].copy(this.unit.startVertices[i]);
      }

      var q = new THREE.Quaternion();
      var e = new THREE.Euler();

      e.setFromRotationMatrix(matrix);

      //this.unit.object3D.rotation.copy(e);

      _.each(this.unit.mesh.geometry.vertices, function(vertex) {
        //vertex.applyEuler(e);
        vertex.applyMatrix4(matrix);
      }, this);

    } else {

      this.matrix.lookAt( target, this.position, this.up );

      if ( this.rotationAutoUpdate ) {
        this.rotation.setFromRotationMatrix( this.matrix, this.rotation.order );
      }
    }

  }

  THREE.Vector3.prototype.ToString = function ( ) {
    return "X: "+roundNumber(this.x,2)+", Y: "+roundNumber(this.y,2)+", Z: "+roundNumber(this.z,2)+"";
  }
  THREE.Euler.prototype.ToString = function ( ) {
    return "X: "+roundNumber(this.x,2)+", Y: "+roundNumber(this.y,2)+", Z: "+roundNumber(this.z,2)+"";
  }


  function v(x,y,z){
    return new THREE.Vector3(x,y,z);
  }

  

  function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
      $('<img/>')[0].src = this;
    // Alternatively you could use:
    // (new Image()).src = this;
    });
  }

  function UrlExists(url)
  {
    var http = new XMLHttpRequest();
    http.open('HEAD', url, false);
    http.send();
    return http.status!=404;
  }

  function getZoneConfig(string) {
    if ( _.isUndefined(zoneTypeConfig[zones[terrainHandler.zone]['type']][string]) ) {
      bm('Error: \''+string+'\' not defined for zone '+zones[terrainHandler.zone].name+'!');
      return 0;
    }
    return zoneTypeConfig[zones[terrainHandler.zone]['type']][string];
  }

  function ba(msg) {
    hudHandler.MessageAlert(msg);
  }
  function bm(msg) {
    hudHandler.AddBigMessage(msg, 5);
  }
  function le(prop) {
    return showEditor && levelEditor.editorGUI[prop];
  }
  function sw(a,b,c) {
    debug.setWatch(a, b, c);
  }

  function cl(msg) {
    console.log(msg);
  }
  function cw(msg) {
    console.warn(msg);
  }
  //    function TestSphereAABB(aABB, contact)
  //        {
  //            // Find point (p) on AABB closest to Sphere centre
  //            Vector3 p = aABB.ClosestPtPointAABB(Centre);
  //
  //            // Sphere and AABB intersect if the (squared) distance from sphere centre to point (p)
  //            // is less than the (squared) sphere radius
  //            Vector3 v = p - Centre;
  //
  //            if (Vector3.Dot(v, v) <= Radius * Radius)
  //            {
  //                contact.location_Distance = aABB.DistPointAABB(Centre);
  //
  //                // Calculate normal using sphere centre a closest point on AABB
  //                contact.normal = Centre - p;
  //
  //                if (contact.normal != Vector3.Zero)
  //                {
  //                    contact.normal.Normalize();
  //                }
  //
  //                contact.radius_Projection = Radius;
  //
  //                return true;
  //            }
  //
  //            // No intersection
  //            return false;
  //        }

  function DisplayUVFrame(mesh, indexH, indexV, numberOfSpritesH, numberOfSpritesV, mirror) {

    mirror = mirror || false;

    var amountU = (1/numberOfSpritesH);
    var amountV = (1/numberOfSpritesV);

    var uvs1 = mesh.geometry.faceVertexUvs[0][0];
    var uvs2 = mesh.geometry.faceVertexUvs[0][1];

    if ( !mirror ) {
      uvs1[0].x = amountU*indexH;
      uvs1[0].y = 1-(amountV*indexV);

      uvs1[1].x = uvs1[0].x;
      uvs1[1].y = uvs1[0].y - amountV;

      uvs1[2].x = uvs1[0].x + amountU;
      uvs1[2].y = uvs1[0].y;
    }
    else {
      uvs1[0].x = amountU*(indexH+1);
      uvs1[0].y = 1-(amountV*indexV);

      uvs1[1].x = uvs1[0].x;
      uvs1[1].y = uvs1[0].y - amountV;

      uvs1[2].x = uvs1[0].x - amountU;
      uvs1[2].y = uvs1[0].y;
    }

    uvs2[0].x = uvs1[1].x;
    uvs2[0].y = uvs1[1].y;

    uvs2[1].x = uvs1[2].x;
    uvs2[1].y = uvs1[1].y;

    uvs2[2].x = uvs1[2].x;
    uvs2[2].y = uvs1[2].y;

    mesh.geometry.uvsNeedUpdate = true;
  }


  function GetRandomVector() {
    var vec = new THREE.Vector3(1, 0, 0);
    var rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationFromEuler(
      new THREE.Euler(
        getRandomFloat(0, Math.PI*2),
        getRandomFloat(0, Math.PI*2),
        getRandomFloat(0, Math.PI*2)
        )
      );
    return vec.applyMatrix4(rotationMatrix);
  }


  function releaseMesh(mesh, options) {

    options = options || {};

    var removeMaterials = options.removeMaterials || false;

    if ( mesh ) {
        mesh.traverse( function ( object ) {

          if ( !_.isUndefined(object.geometry) ) {
            object.geometry.dispose();
          }

          if ( object.material && removeMaterials ) {
            if ( object.material instanceof THREE.MeshFaceMaterial ) {
              _.each(object.material.materials, function(material) {
                material.dispose();
              });
            }
            else {
              object.material.dispose();
            }
          }

        });

        if ( !_.isUndefined(mesh.geometry) ) {
          mesh.geometry.dispose();
        }

        if ( mesh.material && removeMaterials ) {
          if ( mesh.material instanceof THREE.MeshFaceMaterial ) {
            _.each(mesh.material.materials, function(material) {
              material.dispose();
            });
          }
          else {
            mesh.material.dispose();
          }
        }

    }
    mesh = null;
  }


  var hasFlash = function() {
      return !(((typeof navigator.plugins == "undefined" || navigator.plugins.length == 0) ?
        !!(new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) :
        navigator.plugins["Shockwave Flash"]) === undefined);
  };


  var gotFlashInstalled = hasFlash();

}


function SetData(obj, data, names) {
  for(var n in names) {
    obj[names[n]] = data[names[n]];
  }
}

function SetDataAll(obj, data) {
  for(var n in data) {
    obj[n] = data[n];
  }
}

function CheckData(obj, names) {
  if ( _.isUndefined(obj) ) return false;
  if ( !obj ) return false;

  //for(var n in names) {
  for(var n=0;n<names.length;n++){
    if ( _.isUndefined(obj[names[n]]) ) return false;
  }
  return true;
}



function CheckVector(obj) {
  return CheckData(obj, ["x","y","z"]);
}

// Generic cell functions
// Cells are supposed to be numbered next to eachother
function WorldToCellCoordinates(x, z, cellsize) {

  if ( cellsize % 2 != 0 ) console.error("Cellsize not dividable by 2!");

  var cellhalf = cellsize / 2;
  //  5 / 20 = 0
  // 20 / 20 = 1
  x = Math.floor((x + cellhalf)/cellsize);
  z = Math.floor((z + cellhalf)/cellsize);

  return {
    x: x,
    z: z
  };
}

function CellToWorldCoordinates(x, z, cellsize) {

  if ( cellsize % 2 != 0 ) console.error("Cellsize not dividable by 2!");

  //var cellhalf = cellsize / 2;
  // 0 * 20 - 10 = -10;
  // 1 * 20 - 10 = 10;
  x = (x * cellsize) ;
  z = (z * cellsize) ;

  return {
    x: x,
    z: z
  };
}

function DistanceBetweenPoints(x1,y1,x2,y2){
  return Math.sqrt(Math.pow((x2-x1), 2) + Math.pow((y2-y1), 2));
}

function DistanceSq(pos1, pos2) {
  return Math.pow((pos2.x-pos1.x), 2) + Math.pow((pos2.y-pos1.y), 2) + Math.pow((pos2.z-pos1.z), 2);
}

String.prototype.trim = function() {
  return this.replace(/^\s+|\s+$/g, "");
};


// Inheritance
// http://www.cyberminds.co.uk/blog/articles/how-to-implement-javascript-inheritance.aspx
// http://jsfiddle.net/UbgfG/1/

//InheritanceHandler = {};
//InheritanceHandler.extend = function(subClass, baseClass) {
//    function inheritance() { }
//    inheritance.prototype = baseClass.prototype;
//    subClass.prototype = new inheritance();
//    subClass.prototype.constructor = subClass;
//    subClass.baseConstructor = baseClass;
//    subClass.superClass = baseClass.prototype;
//};


/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
// http://ejohn.org/blog/simple-javascript-inheritance/

(function(){
  var initializing = false, fnTest = /xyz/.test(function(){
    xyz;
  }) ? /\b_super\b/ : /.*/;
  // The base Class implementation (does nothing)
  this.Class = function(){};

  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
      typeof _super[name] == "function" && fnTest.test(prop[name]) ?
      (function(name, fn){
        return function() {
          var tmp = this._super;

          // Add a new ._super() method that is the same method
          // but on the super-class
          this._super = _super[name];

          // The method only need to be bound temporarily, so we
          // remove it when we're done executing
          var ret = fn.apply(this, arguments);
          this._super = tmp;

          return ret;
        };
      })(name, prop[name]) :
      prop[name];
    }

    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.Init )
        this.Init.apply(this, arguments);
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;

    return Class;
  };
})();




function roundNumber(number, decimals) {
  var newnumber = new Number(number+'').toFixed(parseInt(decimals));
  return parseFloat(newnumber);
}

Number.prototype.Round2 = function() {
  return this % 2 == 0 ? this : this+1;
};
Number.prototype.Round = function(digits) {
  return roundNumber(this, digits);
};
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};
Number.prototype.ToDegrees = function() {
  return this * (180 / Math.PI);
};
Number.prototype.ToRadians = function() {
  return this * (Math.PI / 180);
};
Number.prototype.Lerp = function(t, alpha) {
  return this + ( t - this ) * alpha;
};


// * (180/Math.PI)

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Random float between
function getRandomFloat(minValue,maxValue,precision){
  precision = precision || 2;
  return parseFloat(Math.min(minValue + (Math.random() * (maxValue - minValue)),maxValue).toFixed(precision));
}

function ChooseRandom(a) {
  return a[getRandomInt(0,a.length-1)];
}

var sequencedTimers = {};
function ChooseSequenced(a) {
  var uid = "";
  for (var b in a) uid += b;
  if ( _.isUndefined(sequencedTimers[uid]) ) sequencedTimers[uid] = 0;
  var value = a[sequencedTimers[uid]];
  sequencedTimers[uid]++;
  if ( sequencedTimers[uid] >= a.length ) sequencedTimers[uid] = 0;
  return value;
}

function ConvertVector3(vec) {
  return new THREE.Vector3(vec.x, vec.y, vec.z);
}
function RawVector3(vec) {
  return {x:vec.x, y:vec.y, z:vec.z};
}

/*function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
*/
function CheckForFunctionReturnValue(v, data) {
  return typeof(v)=="function"?v(data):v;
}

THREE.Vector3.prototype.Round = function(n) {
  this.x = roundNumber(this.x, n);
  this.y = roundNumber(this.y, n);
  this.z = roundNumber(this.z, n);

  return this;
};

// Server only uses the Vector3 Class (for now)
if (!SERVER) {
  THREE.Euler.prototype.Round = function(n) {
    this.x = roundNumber(this.x, n);
    this.y = roundNumber(this.y, n);
    this.z = roundNumber(this.z, n);

    return this;
  };
}

THREE.Vector3.prototype.ToRadians = function(n) {
  this.x = this.x.ToRadians();
  this.y = this.y.ToRadians();
  this.z = this.z.ToRadians();

  return this;
};

THREE.Vector3.prototype.InRangeOf = function(vector, range) {
    return vector.clone().sub(this).lengthSq() < range*range;
};

THREE.Vector3.prototype.ToDegrees = function(n) {
  this.x = this.x.ToDegrees();
  this.y = this.y.ToDegrees();
  this.z = this.z.ToDegrees();

  return this;
};

function RoundVector(vec, n) {
  vec.x = roundNumber(vec.x, n);
  vec.y = roundNumber(vec.y, n);
  vec.z = roundNumber(vec.z, n);
  return vec;
}

/*
Number.prototype.ToBig = function() {
  return this * 100;
};
THREE.Vector3.prototype.ToBig = function(n) {
  this.x = this.x * 100;
  this.y = this.y * 100;
  this.z = this.z * 100;

  return this;
};
*/
THREE.Vector3.prototype.Truncate = function(n) {
  if ( this.length() > n ) {
    return this.normalize().multiplyScalar(n);
  }
  return this;
};

THREE.Vector3.prototype.Perp = function() {
  return this.cross(new THREE.Vector3(0, 1, 0));
};

function VectorDistance(a,b) {
  return a.clone().sub(b).length();
}
function VectorDistanceSq(a,b) {
  return a.clone().sub(b).lengthSq();
}


function WasLucky(maxchance) {
  return getRandomInt(1, maxchance) == 1;
}

function WasLucky100(chance) {
  return chance >= mt_rand(1, 100);
}

function mt_rand (min, max) {
  // Returns a random number from Mersenne Twister
  //
  // version: 1109.2015
  // discuss at: http://phpjs.org/functions/mt_rand
  // +   original by: Onno Marsman
  // *     example 1: mt_rand(1, 1);
  // *     returns 1: 1
  var argc = arguments.length;
  if (argc === 0) {
    min = 0;
    max = 2147483647;
  } else if (argc === 1) {
    throw new Error('Warning: mt_rand() expects exactly 2 parameters, 1 given');
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var dateChunks = new Array(

  new Array(60 * 60 * 24 * 365, 'year'),

  new Array(60 * 60 * 24 * 30, 'month'),

  new Array(60 * 60 * 24 * 7, 'week'),

  new Array(60 * 60 * 24, 'day'),

  new Array(60 * 60, 'hour'),

  new Array(60, 'minute'),

  new Array(1, 'second')

  );

function timeSince(since) {



  var count;



  for (i = 0, j = dateChunks.length; i < j; i++) {

    var seconds = dateChunks[i][0];

    var name = dateChunks[i][1];

    if ((count = Math.floor(since / seconds)) != 0) {

      break;

    }

  }



  var print = (count == 1) ? '1 ' + name : count + " " + name + "s";

  //    if ( name == "min" ) print = count + " " + name;
  //    if ( name == "" ) print = count;

  return print;

}


//there is no fixed order for attributes of an object. also this function could return a function...
function firstOfObject(o) {
  for(var k in o) return o[k];
}

/*
function reverseArray(array) {

  var length = array.length;

  if ( length == 0 ) return array;

  var left = null;
  var right = null;
  for (left = 0; left < length / 2; left += 1)
  {
      right = length - 1 - left;
      var temporary = array[left];
      array[left] = array[right];
      array[right] = temporary;
  }
  return array;
}
*/

String.prototype.capitaliseFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

//Copyright 2009 Nicholas C. Zakas. All rights reserved.
//MIT Licensed
/*
function timedChunk(items, process, context, callback){
    var todo = items.concat();   //create a clone of the original

    setTimeout(function(){

        var start = +new Date();

        do {
             process.call(context, todo.shift());
        } while (todo.length > 0 && (+new Date() - start < 15));

        if (todo.length > 0){
            setTimeout(arguments.callee, 25*10);
        } else {
            callback(items);
        }
    }, 25);
}
*/
