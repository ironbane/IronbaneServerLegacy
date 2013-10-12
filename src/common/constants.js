// commonjs wrapper for Shared.js replacement
var _ = require('underscore');
var THREE = require('./three');
(function(exports) {

    var IB = {};

IB.sequencedTimers = {};

    // STUFF FROM INIT
    IB.guestSpawnZone = 1;
    IB.guestSpawnPosition = {x: 10, y: 0, z: 0};
    IB.tutorialSpawnZone = 3;
    IB.tutorialSpawnPosition = {x: 42, y: 57, z: 59};
    IB.normalSpawnZone = 1;
    IB.normalSpawnPosition = {x: 3, y: 20, z: -4};
    IB.playerSpawnTimeout = 5.0;
    IB.NPCSpawnTimeout = 10.0;
    // END INIT

    IB.cellSize = 96 + 16;
    IB.cellSizeHalf = IB.cellSize / 2;
    IB.cellLoadRange = 1;

    IB.unitAcceleration = 20;

    IB.dayTime = 60 * 15;
    // IB.dayTime = 90;

    IB.worldScale = 2;

    IB.lootBagTemplate = 2;
    IB.movingObstacleTemplate = 4;
    IB.toggleableObstacleTemplate = 5;
    IB.leverTemplate = 6;
    IB.teleportEntranceTemplate = 7;
    IB.teleportExitTemplate = 8;
    IB.signTemplate = 9;
    IB.lootableMeshTemplate = 10;
    IB.heartPieceTemplate = 11;
    IB.musicPlayerTemplate = 71;
    IB.waypointTemplate = 95;
    IB.trainTemplate = 96;

    IB.UnitTypeEnum = {
        PLAYER: 0,
        NPC: 1,
        LOOTABLE: 2,
        BILLBOARD: 3,
        MULTIBOARD: 4,
        MESH: 5,
        MOVINGOBSTACLE: 6,
        TRAIN: 7,
        TOGGLEABLEOBSTACLE: 8,
        LEVER: 9,
        TELEPORTENTRANCE: 10,
        TELEPORTEXIT: 11,
        SIGN: 12,
        HEARTPIECE: 13,
        MUSICPLAYER: 14,
        WAYPOINT: 15,

        // NPC's
        MONSTER: 20,
        VENDOR: 21,
        TURRET: 22,
        WANDERER: 23,
        TURRET_STRAIGHT: 24,
        TURRET_KILLABLE: 25
    };

    IB.ZoneTypeEnum = {
        WORLD: 1,
        DUNGEON: 2,
        TUTORIAL: 3,
        CASTLE: 4
    };

    IB.LightSystemEnum = {
        DAYANDNIGHT: 1,
        DAYONLY: 2,
        NIGHTONLY: 3,
        DUNGEON: 4
    };

    IB.zoneTypeConfig = {};

    IB.zoneTypeConfig[IB.ZoneTypeEnum.WORLD] = {
        "enableFluid": true,
        "fluidLevel": -1.3,
        "fluidTexture": 1650,
        "fluidTextureGlow": 1651,
        "fluidType": "water",
        "enableClouds": true,
        "cloudDensity": 0.80,
        "cloudLevel": 45,
        "skyboxShader": "world",
        "lightSystem": IB.LightSystemEnum.DAYANDNIGHT,
        "music": ["music/IRONBANE 2", "music/IRONBANE 4", "music/IRONBANE 5"]
    };

    IB.zoneTypeConfig[IB.ZoneTypeEnum.DUNGEON] = {
        "enableFluid": true,
        "fluidLevel": -1,
        "fluidTexture": 1650,
        "fluidTextureGlow": 1651,
        "fluidType": "water",
        "enableClouds": false,
        "cloudDensity": 0.0,
        "cloudLevel": 0,
        "skyboxShader": "dungeon",
        "lightSystem": IB.LightSystemEnum.DUNGEON,
        "music": ["music/underground"]
    };

    IB.zoneTypeConfig[IB.ZoneTypeEnum.TUTORIAL] = {
        "enableFluid": true,
        "fluidLevel": 0.5,
        "fluidTexture": 1650,
        "fluidTextureGlow": 1651,
        "fluidType": "water",
        "enableClouds": false,
        "cloudDensity": 0.0,
        "cloudLevel": 0,
        "skyboxShader": "dungeon",
        "lightSystem": IB.LightSystemEnum.DUNGEON,
        "music": ["music/tutorial"]
    };

    IB.zoneTypeConfig[IB.ZoneTypeEnum.CASTLE] = {
        "enableFluid": true,
        "fluidLevel": 0.5,
        "fluidTexture": 102,
        "fluidTextureGlow": 101,
        "fluidType": "lava",
        "enableClouds": false,
        "cloudDensity": 0.0,
        "cloudLevel": 0,
        "skyboxShader": "dungeon",
        "lightSystem": IB.LightSystemEnum.DUNGEON,
        "music": ["music/castle"]
    };

    IB.LootBagTypeEnum = {
        COMMON: 0,
        UNCOMMON: 1,
        EPIC: 2,
        LEGENDARY: 3,

        CHEST: 11,
        BOOKSHELVES: 12
    };

    IB.SteeringBehaviourEnum = {
        SEEK: 0,
        ARRIVE: 1,
        PURSUIT: 2,
        INTERPOSE: 3
    };

    IB.SignTypeEnum = {
        DIRECTION: 1,
        NORMAL: 2,
        HUGE: 3
    };


    IB.WeaponRanges = {
        sword: 2,
        dagger: 5,
        axe: 4,
        bow: 15,
        staff: 15
    };

    IB.ColorEnum = {
        WHITE: 0xFFFFFF,
        LIGHTBLUE: 0x92aafd,
        RED: 0xFF0000,
        GREEN: 0x00FF00,
        BLUE: 0x0000FF
    };

    IB.MovingObstacleMovementTypeEnum = {
        SineWaveX: 1,
        SineWaveY: 2,
        SineWaveZ: 3,
        SineWaveXY: 4,
        SineWaveXZ: 5,
        SineWaveYZ: 6,
        SineWaveXYZ: 7,
        SineWaveXYZ2: 8,
        RotationX: 21,
        RotationY: 22,
        RotationZ: 23,
        RotationXY: 24,
        RotationXZ: 25,
        RotationYZ: 26,
        RotationXYZ: 27,
        RotationXYZ2: 28
    };

    IB.ToggleableObstacleMovementTypeEnum = {
        DoorX: 1,
        DoorY: 2,
        DoorZ: 3
    };

    IB.UserManagementTypeEnum = {
        LIGHTWARN: 0,
        SERIOUSWARN: 1,
        KICK: 2,
        BAN: 3
    };

    IB.skinIdMaleStart = 1000;
    IB.skinIdMaleEnd = 1004;

    IB.skinIdFemaleStart = 1010;
    IB.skinIdFemaleEnd = 1014;

    IB.hairIdMaleStart = 1000;
    IB.hairIdMaleEnd = 1009;

    IB.hairIdFemaleStart = 1010;
    IB.hairIdFemaleEnd = 1019;

    IB.eyesIdMaleStart = 1000;
    IB.eyesIdMaleEnd = 1009;

    IB.eyesIdFemaleStart = 1010;
    IB.eyesIdFemaleEnd = 1019;

    IB.meleeTimeout = 0.5;
    IB.meleeRange = 3.0;

    IB.maxHealth = 20;

    IB.CalculateItemPrice = function(item) {
        // for now use basevalue directly, eventually will have modifiers on the shopkeep
        return item.basevalue || 0;
    };

    IB.dateChunks = new Array(
  new Array(60 * 60 * 24 * 365, 'year'),
  new Array(60 * 60 * 24 * 30, 'month'),
  new Array(60 * 60 * 24 * 7, 'week'),
  new Array(60 * 60 * 24, 'day'),
  new Array(60 * 60, 'hour'),
  new Array(60, 'minute'),
  new Array(1, 'second')
  );


IB.WasLucky = function(maxchance) {
  return getRandomInt(1, maxchance) == 1;
};

IB.WasLucky100 = function(chance) {
  return chance >= mt_rand(1, 100);
};

Number.prototype.Round = function(digits) {
  return roundNumber(this, digits);
};

function roundNumber(number, decimals) {
  var newnumber = new Number(number+'').toFixed(parseInt(decimals));
  return parseFloat(newnumber);
}

IB.CheckVector = function(obj) {
  return CheckData(obj, ["x","y","z"]);
};

IB.ConvertVector3 = function(vec) {
  return new THREE.Vector3(vec.x, vec.y, vec.z);
}

IB.CheckData = function(obj, names) {
  if ( _.isUndefined(obj) ) return false;
  if ( !obj ) return false;

  //for(var n in names) {
  for(var n=0;n<names.length;n++){
    if ( _.isUndefined(obj[names[n]]) ) return false;
  }
  return true;
};

IB.timeSince = function(since) {
  var count;
  for (i = 0, j = dateChunks.length; i < j; i++) {
    var seconds = dateChunks[i][0];
    var name = dateChunks[i][1];
    if ((count = Math.floor(since / seconds)) !== 0) {
      break;
    }
  }
  var print = (count == 1) ? '1 ' + name : count + " " + name + "s";
  return print;
};

IB.ChooseSequenced = function(a) {
  var uid = "";
  for (var b in a) uid += b;
  if ( _.isUndefined(sequencedTimers[uid]) ) sequencedTimers[uid] = 0;
  var value = a[sequencedTimers[uid]];
  sequencedTimers[uid]++;
  if ( sequencedTimers[uid] >= a.length ) sequencedTimers[uid] = 0;
  return value;
};

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
};
    // Generic cell functions
// Cells are supposed to be numbered next to eachother
IB.WorldToCellCoordinates= function(x, z, cellsize) {

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

IB.CellToWorldCoordinates =  function(x, z, cellsize) {

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

    if (typeof(module) === 'object' && module.exports === exports) {
        module.exports = IB;
    } else {
        // temp for the client dump on window until client uses obj
        _.extend(exports, IB);
        exports.IB = IB;
    }

})(this);