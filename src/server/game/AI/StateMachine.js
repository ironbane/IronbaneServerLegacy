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



var StateMachine = Class.extend({
	Init: function(owner, currentState, globalState) {

		this.owner = owner;

		this.globalState = globalState;
        this.globalState.Enter(this.owner);

		this.currentState = currentState;
        this.currentState.Enter(this.owner);

		this.previousState = null;

	},
	Update: function(dTime) {
		if ( this.globalState ) this.globalState.Execute(this.owner, dTime);

		if ( this.currentState ) this.currentState.Execute(this.owner, dTime);
	},
	SetGlobalState: function(globalState) {

		this.globalState.Exit(this.owner);
		this.globalState = globalState;
    	this.globalState.Enter(this.owner);

	},
	ChangeState: function(newState) {

		this.previousState = this.currentState;

		this.currentState.Exit(this.owner);

		this.currentState = newState;

		this.currentState.Enter(this.owner);

	},
	RevertToPreviousState: function() {
		this.ChangeState(this.previousState);
	},
	IsInState: function(state) {
		return this.currentState instanceof state;
    },
    HandleMessage: function(message, data) {

        this.currentState.HandleMessage(this.owner, message, data);
        this.globalState.HandleMessage(this.owner, message, data);

    }

});
