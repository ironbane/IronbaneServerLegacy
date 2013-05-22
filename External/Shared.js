/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var cellSize = 96+16;
var cellSizeHalf = cellSize/2;
var cellLoadRange = 2;


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
  MAINMENU : 3
};

var zoneTypeConfig = {};

zoneTypeConfig[ZoneTypeEnum.WORLD] = {
  'enableWater': true,
  'waterLevel': -1,
  'waterTexture': 1650,
  'waterTextureGlow': 1651,
  'enableClouds': true,
  'cloudDensity':0.80,
  'cloudLevel': 15,
  'skyboxShader': "world",
  "noTerrain": false,
  "music": ["ib2"]
};

zoneTypeConfig[ZoneTypeEnum.DUNGEON] = {
  'enableWater': true,
  'waterLevel': -1,
  'waterTexture': 1650,
  'waterTextureGlow': 1651,
  'enableClouds': false,
  'cloudDensity':0.0,
  'cloudLevel': 0,
  'skyboxShader': "dungeon",
  "noTerrain": false,
  "music": ["ib2"]
};

zoneTypeConfig[ZoneTypeEnum.MAINMENU] = {
  'enableWater': false,
  'waterLevel': -1,
  'waterTexture': 1650,
  'waterTextureGlow': 1651,
  'enableClouds': false,
  'cloudDensity':0.0,
  'cloudLevel': 0,
  'skyboxShader': "dungeon",
  "noTerrain": true,
  "music": []
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

var meleeTimeout = 0.5;
var meleeRange = 3.0;

var maxHealth = 20;

var maxCoins = 24;


function CalculateItemPrice(item) {
  //                    var temp = {
  //                        id: server.GetAValidItemID(),
  //                        template : item,
  //                        slot:l,
  //                        attr1: dataHandler.items[item].attr1,
  //                        equipped: 0
  //                    }
  return item.attr1;
}