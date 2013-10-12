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
var MovingUnit = require('./movingunit');
var log = require('util').log;

var Actor = MovingUnit.extend({
    init: function(data) {
        this._super(data);
        this.stateMachine = new StateMachine(this, new EmptyState(), new EmptyState());
    },
    awake: function() {
        if (this.id < 0) {
            var identifier = this.template.name;

            // Hack for trains...bad! We need to switch to a CES system
            if (this instanceof Train) {
                identifier = this.data.scriptName;
            }

            this.BuildWaypoints();

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
                this.stateMachine.setGlobalState(new actorScripts[identifier]());
            }
        }

        this._super();
    },
    buildWaypoints: function() {
        // Calculate realistic routes where we can go to
        this.connectedNodeList = [];

        // First, find a "home" node from where we'll build our list
        var closestNode = null;
        var distance = Math.pow(50, 2);
        var allNodes = worldHandler.allNodes[this.zone];

        _.each(allNodes, function(node) {
            var measuredDistance = DistanceSq(node.pos, this.position);

            if (measuredDistance < distance) {
                closestNode = node;
                distance = measuredDistance;
            }
        }, this);

        if (!closestNode) {
            log("Warning: no nodes found for NPC " + this.id + "!");
            return;
        }

        // We got the closest node
        // Now build a path with all nodes that link to it
        var me = this;

        function AnnounceOccurredError(msg, amount) {
            chatHandler.announceRoom('mods', msg + "<br><i>Warning: this error happened " + amount + " seconds ago.</i>", "red");
        }

        function addEdgeNodes(list, zone, node) {
            for (var x = 0; x < node.edges.length; x++) {
                var subNode = worldHandler.allNodes[zone][node.edges[x]];

                if (!subNode) {


                    return;
                }

                if (!_.contains(list, subNode)) {
                    list.push(subNode);
                    addEdgeNodes(list, zone, subNode);
                }
            }
        }

        addEdgeNodes(this.connectedNodeList, this.zone, closestNode);
    },
    tick: function(dTime) {
        this.stateMachine.update(dTime);

        this._super(dTime);
    },
    handleMessage: function(message, data) {
        this.stateMachine.handleMessage(message, data);
    }
});

module.exports = Actor;