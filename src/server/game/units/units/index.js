/*
    This file is part of Ironbane MMO.

    Ironbane MMO is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Ironbane MMO is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Ironbane MMO.  If not, see <http://www.gnu.org/licenses/>.
*/

// load all possible states here (instead of dynamic)
var units = {};
var log = require('util').log;
units.Actor = require('./actor');
units.Fighter = require('./fighter');
units.Lootable = require('./lootable');
units.MovingUnit = require('./movingunit');
units.NPC = require('./npc');
units.Player = require('./player');
units.HeartPiece = require('./special/heartpiece');
units.lever = require('./special/lever');
units.MovingObstacle = require('./special/movingobstacle');
units.MusicPlayer = require('./special/musicplayer');
units.sign = require('./special/sign');
units.TeleportEntrance = require('./special/teleportentrance');
units.TeleportExit = require('./special/teleportexit');
units.ToggableObstacle = require('./special/toggleableobstacle');
units.Train = require('./special/train');
units.Waypoint = require('./special/Waypoint');

log(units);
module.exports = units;
