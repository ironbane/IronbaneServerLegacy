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

var Actor = MovingUnit.extend({
    Init: function(data) {
        this._super(data);
        this.stateMachine = new StateMachine(this, new EmptyState(), new EmptyState());
    },
    Awake: function() {
        if (!(this.isPlayer())) {
            var identifier = this.template.name;

            // Hack for trains...bad! We need to switch to a CES system
            if (this instanceof Train) {
                identifier = this.data.scriptName;
            }

            // Load the real state
            var currentState = null;
            switch (this.template.type) {
                case UnitTypeEnum.MONSTER:
                    currentState = new MonsterState();
                    break;
                case UnitTypeEnum.VENDOR:
                    currentState = new SellMerchandise();
                    break;
                case UnitTypeEnum.MOVINGOBSTACLE:
                    currentState = new MovingObstacle();
                    break;
                case UnitTypeEnum.TURRET:
                case UnitTypeEnum.TURRET_KILLABLE:
                    currentState = new Turret();
                    break;
                case UnitTypeEnum.TURRET_STRAIGHT:
                    currentState = new TurretStraight();
                    break;
            }

            if (currentState) {
                this.stateMachine.setGlobalState(currentState);
            }

            //identifier = identifier.replace(/ /g,"");

            // Check if we have a global state defined
            if (!_.isUndefined(actorScripts[identifier])) {

                this.isScripted = true;
                this.stateMachine.setGlobalState(new actorScripts[identifier]());
            }

        }

        this._super();

    },
    Tick: function(dTime) {

        this.stateMachine.update(dTime);

        this._super(dTime);
    },
    handleMessage: function(message, data) {
        this.stateMachine.handleMessage(message, data);
    }
});
