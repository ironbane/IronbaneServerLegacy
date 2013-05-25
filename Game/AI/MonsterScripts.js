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


var monsterStateMachines = {
	"Rat Boss" : function() {
		return new RatBoss();
	}
};


var RatBoss = State.extend({
	Init: function() {
		this.obstacleToOpenOnDeath = worldHandler.FindUnit(-1242);

	},
	HandleMessage: function(npc, message, data) {

		//debugger;

		switch (message) {
			case "respawned":
				this.obstacleToOpenOnDeath.Toggle(false);
				break;
			case "killed":
				this.obstacleToOpenOnDeath.Toggle(true);
				break;
		}

	}
});
