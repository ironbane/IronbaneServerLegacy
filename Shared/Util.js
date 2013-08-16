
if ( !SERVER ) {


  function loadTerrainTexture( path ) {

    var image = new Image();
    image.onload = function () {
      texture.needsUpdate = true;
    };
    image.src = path;

    var texture  = new THREE.Texture( image, new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.NearestFilter, THREE.LinearMipMapLinearFilter );

    return new THREE.MeshLambertMaterial( {
      map: texture,
      ambient: 0xbbbbbb
    } );

  }

  function loadTexture( path, textureOnly, options) {



    textureOnly = textureOnly || false;
    options = options || {};

    options.seeThrough = options.seeThrough === undefined ? false : options.seeThrough;
    options.opacity = options.opacity === undefined ? 0.5 : options.opacity;
    options.vertexShader = options.vertexShader === undefined ? "vertex" : options.vertexShader;
    options.uvScaleX = options.uvScaleX === undefined ? 1 : options.uvScaleX;
    options.uvScaleY = options.uvScaleY === undefined ? 1 : options.uvScaleY;
    options.transparent = options.transparent === undefined ? false : options.transparent;
    options.alphaTest = options.alphaTest === undefined ? 0.5 : options.alphaTest;
    options.doubleSided = options.doubleSided === undefined ? false : options.doubleSided;
    options.useLighting = options.useLighting === undefined ? false : options.useLighting;



    var image = new Image();



    image.src = path;



    var texture  = new THREE.Texture( image,
      new THREE.UVMapping(),
      THREE.RepeatWrapping,
      THREE.RepeatWrapping,
      THREE.NearestFilter,
      THREE.NearestMipMapLinearFilter );


    image.onload = function () {
      texture.needsUpdate = true;
    };


    if ( textureOnly ) return texture;

    //return new THREE.MeshBasicMaterial({color:Math.random() * 0xffffff});


    if ( options.useLighting ) {

      var config = {
        map : texture
      };

      if ( options.transparent ) config.transparent = options.transparent;

      return new THREE.MeshLambertMaterial( config ) ;

    }

    //        return new THREE.MeshLambertMaterial( {
    //            map: texture,
    //            ambient: 0xffffff
    //        } );

    var uniforms = {
      uvScale : {
        type: 'v2',
        value: new THREE.Vector2(options.uvScaleX,options.uvScaleY)
      },
      texture1 : {
        type: 't',
        //                value: 0,
        //                texture:texture
        // r50->r51
        value:texture
      }
    };

    if ( options.seeThrough ) {
      uniforms.opacity = {
        type: 'f',
        value: options.opacity
      };
    }

    if ( options.vertexShader == "vertex_world" ) {
      uniforms.camPos = {
        type: 'v3',
        value: ironbane.camera.position.clone()
      };
    }

    return new THREE.ShaderMaterial({
      uniforms : uniforms,
      vertexShader : $('#'+options.vertexShader).text(),
      fragmentShader : $("#"+(options.seeThrough ? 'fragment_opacity' : 'fragment_fullbright')).text(),
      transparent:options.transparent,
      alphaTest: options.alphaTest,
      side: options.doubleSided ? THREE.DoubleSide : THREE.FrontSide
    });

  }

  var cachedCharacters = {};

  function getCharacterTexture(options) {
      var props = ['skin', 'eyes', 'hair', 'feet', 'body', 'head', 'big'];
      _.each(props, function(p) {
          if(!(p in options)) {
              options[p] = 0;
          }
      });

      var cachefile = 'plugins/game/images/characters/cache/' +
          [options.skin, options.eyes, options.hair, options.feet, options.body, options.head, (options.big ? 1 : 0)].join('_') +
          '.png';

      if(_.every(options, function(p) { return parseInt(p, 10) === 0; })) {
          cachefile = 'media/images/misc/blank.png';
      }

      return cachefile;
  }





//    function loadTexture( path, textureOnly, materialOptions, textureOptions) {
//
//
//
//    textureOnly = textureOnly || false;
//    materialOptions = materialOptions || {};
//    textureOptions = textureOptions || {};
//
//    var image = new Image();
//
//
//
//    image.onload = function () {
//      texture.needsUpdate = true;
//    };
//
//    image.src = path;
//
//    var texture  = new THREE.Texture( image,
//      new THREE.UVMapping(),
//      THREE.RepeatWrapping,
//      THREE.RepeatWrapping,
//      THREE.NearestFilter,
//      THREE.LinearMipMapLinearFilter );
//
//    if ( textureOptions.repeat ) texture.repeat = materialOptions.repeat;
//
//    if ( textureOnly ) return texture;
//
//
//
//
//    materialOptions.map = texture;
//
//    //if ( options.repeat) newOptions.repeat = options.repeat;
//
//    return new THREE.MeshLambertMaterial(materialOptions) ;
//
//
//
//  }

  if (!window.console) console = {};
  console.log = console.log || function(){};
  console.warn = console.warn || function(){};
  console.error = console.error || function(){};
  console.info = console.info || function(){};

  $(document).ready(function(){
    THREE.Object3D.prototype.LookAt = function (position, lockX, lockY, lockZ, billboardStyle) {

      var target = position.clone();

      billboardStyle = billboardStyle || false;

      if ( billboardStyle ) {
        target.y = this.position.y;
      }

      this.matrix.lookAt( target, this.position, this.up );

      lockX = lockX || 0;
      lockY = lockY || 0;
      lockZ = lockZ || 0;


      if ( lockX != 0 ) this.matrix.rotateX(lockX);
      if ( lockY != 0 ) this.matrix.rotateY(lockY);
      if ( lockZ != 0 ) this.matrix.rotateZ(lockZ);

      if ( this.rotationAutoUpdate ) {

        this.rotation.setEulerFromRotationMatrix( this.matrix, this.eulerOrder );

      }

      //this.matrix.rotateY(Math.PI);

      return;
      var target = position.clone();
      //            var vector = new THREE.Vector3(lookat.x, this.position.y, lookat.z)
      //
      //
      //            // TODO: Add hierarchy support.
      //
      //            this.matrix.lookAt( vector, this.position, this.up );
      //
      //            if ( mirror ) {
      //                this.matrix.rotateY(Math.PI);
      //            }
      //
      //            this.matrix.rotateZ(rotation);
      //
      //            if ( this.rotationAutoUpdate ) {
      //
      //                this.rotation.setEulerFromRotationMatrix( this.matrix );
      //
      //            }

      var inverse = new THREE.Matrix4().getInverse( this.matrixWorld );
      inverse.multiplyVector3( target );

      this.matrix.lookAt( target, new THREE.Vector3(), new THREE.Vector3(0,1,0) );

      if ( this.rotationAutoUpdate ) {

        this.rotation.setEulerFromRotationMatrix( this.matrix, this.eulerOrder );

      }


    }

    THREE.Vector3.prototype.ToString = function ( ) {
      return "X: "+roundNumber(this.x,2)+", Y: "+roundNumber(this.y,2)+", Z: "+roundNumber(this.z,2)+"";
    }
  });


  function v(x,y,z){
    return new THREE.Vector3(x,y,z);
  }

  function FindUnit(id) {
    if ( !id ) return null;

    if ( ironbane.player && ironbane.player.id == id ) return ironbane.player;

    for (i = 0; i < ironbane.unitList.length; i++) {
      if ( ironbane.unitList[i].id == id ) return ironbane.unitList[i];
    }
    return null;
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

  function GetZoneConfig(string) {
    if ( !ISDEF(zoneTypeConfig[zones[terrainHandler.zone]['type']][string]) ) {
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
    debug.SetWatch(a, b, c);
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

    // Y = inverted
    indexV -= 1;
    if ( indexV < 0 ) indexV = numberOfSpritesV-1;

    var faceuv;

    if ( mirror ) {
      faceuv = [
      new THREE.UV(amountU*(indexH+0), amountV*(indexV+1)), //bottomright
      new THREE.UV(amountU*(indexH+0), amountV*(indexV+0)), //topright
      new THREE.UV(amountU*(indexH+1), amountV*(indexV+0)),  //topleft
      new THREE.UV(amountU*(indexH+1), amountV*(indexV+1)) //bottomleft
      ];
    }
    else {
      faceuv = [
      new THREE.UV(amountU*(indexH+1), amountV*(indexV+1)), //bottomright
      new THREE.UV(amountU*(indexH+1), amountV*(indexV+0)), //topright
      new THREE.UV(amountU*(indexH+0), amountV*(indexV+0)),  //topleft
      new THREE.UV(amountU*(indexH+0), amountV*(indexV+1)) //bottomleft
      ];
    }

    mesh.geometry.faceVertexUvs[0][0] = faceuv;

    mesh.geometry.uvsNeedUpdate = true;
  };


  function GetRandomVector() {
    var vec = new THREE.Vector3(1, 0, 0);
    var rotationMatrix = new THREE.Matrix4();
    rotationMatrix.setRotationFromEuler(new THREE.Vector3(getRandomFloat(0, Math.PI*2), getRandomFloat(0, Math.PI*2), getRandomFloat(0, Math.PI*2)));
    return rotationMatrix.multiplyVector3(vec);
  }

  function releaseMesh(mesh) {
    if ( mesh ) {
        mesh.traverse( function ( object ) {


          //object.material.deallocate();

          if ( !_.isUndefined(object.geometry) ) {
            _.each(object.geometry.materials, function(material) {
              material.deallocate();
            });

            object.geometry.deallocate();
          }

          if ( !_.isUndefined(object.material) ) {
            if ( !(object.material instanceof THREE.MeshFaceMaterial) ) {
              object.material.deallocate();
            }
          }



          object.deallocate();

          ironbane.renderer.deallocateObject( object );
        } );

        mesh.deallocate();
        ironbane.renderer.deallocateObject( mesh );
    }
    mesh = null;
  }


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
  if ( !ISDEF(obj) ) return false;
  if ( !obj ) return false;

  //for(var n in names) {
  for(var n=0;n<names.length;n++){
    if ( !ISDEF(obj[names[n]]) ) return false;
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
  if ( !ISDEF(sequencedTimers[uid]) ) sequencedTimers[uid] = 0;
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


function ISDEF(o) {
  return typeof o !== "undefined";
};


function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function CheckForFunctionReturnValue(v, data) {
  return typeof(v)=="function"?v(data):v;
}


THREE.Vector3.prototype.Round = function(n) {
  this.x = roundNumber(this.x, n);
  this.y = roundNumber(this.y, n);
  this.z = roundNumber(this.z, n);

  return this;
};

THREE.Vector3.prototype.ToRadians = function(n) {
  this.x = this.x.ToRadians();
  this.y = this.y.ToRadians();
  this.z = this.z.ToRadians();

  return this;
};

THREE.Vector3.prototype.InRangeOf = function(vector, range) {
    return vector.clone().subSelf(this).lengthSq() < range*range;
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
  return this.crossSelf(new THREE.Vector3(0, 1, 0));
};

function VectorDistance(a,b) {
  return a.clone().subSelf(b).length();
}
function VectorDistanceSq(a,b) {
  return a.clone().subSelf(b).lengthSq();
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
/*
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
*/

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

