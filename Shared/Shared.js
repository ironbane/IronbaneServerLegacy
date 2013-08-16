/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var cellSize = 96+16;
var cellSizeHalf = cellSize/2;
var cellLoadRange = 1;


var unitAcceleration = 20;


var dayTime = 60 * 15;
// var dayTime = 90;


var worldScale = 2;

var lootBagTemplate = 2;
var movingObstacleTemplate = 4;
var toggleableObstacleTemplate = 5;
var leverTemplate = 6;
var teleportEntranceTemplate = 7;
var teleportExitTemplate = 8;
var signTemplate = 9;
var lootableMeshTemplate = 10;
var heartPieceTemplate = 11;
var musicPlayerTemplate = 71;

var UnitTypeEnum = {
  PLAYER: 0,
  NPC: 1,
  LOOTABLE: 2,
  BILLBOARD : 3,
  MULTIBOARD : 4,
  MESH : 5,
  MOVINGOBSTACLE: 6,
  TRAIN: 7,
  TOGGLEABLEOBSTACLE: 8,
  LEVER: 9,
  TELEPORTENTRANCE: 10,
  TELEPORTEXIT: 11,
  SIGN: 12,
  HEARTPIECE: 13,
  MUSICPLAYER: 14,

  // NPC's
  MONSTER:20,
  VENDOR:21,
  TURRET:22,
  WANDERER:23,
  TURRET_STRAIGHT:24,
  TURRET_KILLABLE:25
};

var ZoneTypeEnum = {
  WORLD: 1,
  DUNGEON : 2,
  TUTORIAL : 3,
  CASTLE : 4
};

var LightSystemEnum = {
  DAYANDNIGHT: 1,
  DAYONLY: 2,
  NIGHTONLY: 3
};

var zoneTypeConfig = {};

zoneTypeConfig[ZoneTypeEnum.WORLD] = {
  "enableFluid": true,
  "fluidLevel": -1.3,
  "fluidTexture": 1650,
  "fluidTextureGlow": 1651,
  "fluidType": "water",
  "enableClouds": true,
  "cloudDensity":0.80,
  "cloudLevel": 45,
  "skyboxShader": "world",
  "lightSystem": LightSystemEnum.DAYANDNIGHT,
  "music": ["music/IRONBANE 2","music/IRONBANE 4","music/IRONBANE 5"]
};

zoneTypeConfig[ZoneTypeEnum.DUNGEON] = {
  "enableFluid": true,
  "fluidLevel": -1,
  "fluidTexture": 1650,
  "fluidTextureGlow": 1651,
  "fluidType": "water",
  "enableClouds": false,
  "cloudDensity":0.0,
  "cloudLevel": 0,
  "skyboxShader": "dungeon",
  "lightSystem": LightSystemEnum.NIGHTONLY,
  "music": ["music/underground"]
};

zoneTypeConfig[ZoneTypeEnum.TUTORIAL] = {
  "enableFluid": true,
  "fluidLevel": 0.5,
  "fluidTexture": 1650,
  "fluidTextureGlow": 1651,
  "fluidType": "water",
  "enableClouds": false,
  "cloudDensity":0.0,
  "cloudLevel": 0,
  "skyboxShader": "dungeon",
  "lightSystem": LightSystemEnum.NIGHTONLY,
  "music": ["music/tutorial"]
};

zoneTypeConfig[ZoneTypeEnum.CASTLE] = {
  "enableFluid": true,
  "fluidLevel": 0.5,
  "fluidTexture": 102,
  "fluidTextureGlow": 101,
  "fluidType": "lava",
  "enableClouds": false,
  "cloudDensity":0.0,
  "cloudLevel": 0,
  "skyboxShader": "dungeon",
  "lightSystem": LightSystemEnum.NIGHTONLY,
  "music": ["music/castle"]
};

var LootBagTypeEnum = {
  COMMON: 0,
  UNCOMMON: 1,
  EPIC: 2,
  LEGENDARY: 3,

  CHEST: 11,
  BOOKSHELVES: 12
};

var SteeringBehaviourEnum = {
  SEEK: 0,
  ARRIVE: 1,
  PURSUIT: 2,
  INTERPOSE: 3
};

var SignTypeEnum = {
  DIRECTION: 1,
  NORMAL: 2,
  HUGE: 3
};


var WeaponRanges = {
  sword:2,
  dagger:5,
  axe:4,
  bow:15,
  staff:15
};

var ColorEnum = {
  WHITE: 0xFFFFFF,
  LIGHTBLUE: 0x92aafd,
  RED: 0xFF0000,
  GREEN: 0x00FF00,
  BLUE: 0x0000FF
};

var MovingObstacleMovementTypeEnum = {
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

var ToggleableObstacleMovementTypeEnum = {
  DoorX : 1,
  DoorY : 2,
  DoorZ : 3
};

var UserManagementTypeEnum = {
  LIGHTWARN : 0,
  SERIOUSWARN : 1,
  KICK : 2,
  BAN : 3
};

var meleeTimeout = 0.5;
var meleeRange = 3.0;

var maxHealth = 20;

function CalculateItemPrice(item) {
  //                    var temp = {
  //                        id: server.GetAValidItemID(),
  //                        template : item,
  //                        slot:l,
  //                        attr1: dataHandler.items[item].attr1,
  //                        equipped: 0
  //                    }

  // for now use basevalue directly, eventually will have modifiers on the shopkeep
  return item.basevalue || 0;
}