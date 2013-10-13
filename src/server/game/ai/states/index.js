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
var States = {};

States.EmptyState = require('./emptyState');
States.NPCGlobalState = require('./npcGlobalState');
States.Turret = require('./turret');
States.TurretStraight = require('./turretStraight');
States.ChaseEnemy = require('./chaseEnemy');
States.FleeEnemy = require('./fleeEnemy');
States.Patrol = require('./patrol');
States.Wander = require('./wander');
States.SellMerchandise = require('./vendor');
States.MonsterState = require('./monster');

module.exports = States;
