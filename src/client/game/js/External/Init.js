



var stealth = (window.location+" ").indexOf("localhost") != -1;
stealth = false;



var SERVER = false;

var showEditor = false;

var slotsAvailable = 4;

var tileSize = 32;
var tilesPath = 'plugins/game/images/tiles/';
var tilesBigPath = 'plugins/game/images/tiles_big/';
var tilesExt = 'png';

//var objectsPath = 'plugins/world/images/objects/';

var previousCharacter = 0;
var nextCharacter = 0;

var skinIdMaleStart = 1000;
var skinIdMaleEnd = 1004;

var skinIdFemaleStart = 1010;
var skinIdFemaleEnd = 1014;

var hairIdMaleStart = 1000;
var hairIdMaleEnd = 1009;

var hairIdFemaleStart = 1010;
var hairIdFemaleEnd = 1019;

var eyesIdMaleStart = 1000;
var eyesIdMaleEnd = 1009;

var eyesIdFemaleStart = 1010;
var eyesIdFemaleEnd = 1019;


// Preload images

var globalWireFrame = debugging && true;



var numberOfPlayersOnline = 0;


