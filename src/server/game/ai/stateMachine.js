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
var Class = require('../../../common/class');

var StateMachine = Class.extend({
    init: function(owner, currentState, globalState) {
        this.owner = owner;

        this.globalState = globalState;
        this.globalState.enter(this.owner);

        this.currentState = currentState;
        this.currentState.enter(this.owner);

        this.previousState = null;
    },
    update: function(dTime) {
        if (this.globalState) {
            this.globalState.execute(this.owner, dTime);
        }

        if (this.currentState) {
            this.currentState.execute(this.owner, dTime);
        }
    },
    setGlobalState: function(globalState) {
        this.globalState.exit(this.owner);
        this.globalState = globalState;
        this.globalState.enter(this.owner);
    },
    changeState: function(newState) {
        this.previousState = this.currentState;

        this.currentState.exit(this.owner);

        this.currentState = newState;

        this.currentState.enter(this.owner);
    },
    revertToPreviousState: function() {
        this.changeState(this.previousState);
    },
    isInState: function(state) {
        return this.currentState instanceof state;
    },
    handleMessage: function(message, data) {
        this.currentState.handleMessage(this.owner, message, data);
        this.globalState.handleMessage(this.owner, message, data);
    }
});

module.exports = StateMachine;
