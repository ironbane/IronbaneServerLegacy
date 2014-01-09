/**
 * @module tests
 **/

var test = require('assert-tap').test;

/**
 * @class Tests
 * Provides test functions that can be run on a 
 * world handler when it is created and loaded.
 **/
var Tests = {

    /**
     * @method loadUnits
     * @param worldHandler {WorldHandler}
     * @param compareUnits {compareUnits} - Units that should be added to cells.
     **/
    loadUnits : function(worldHandler, compareUnits) {

        compareUnits = _.flatten(compareUnits); 

        test('WorldHandler -- Loaded Units Test', function(t) { 

            worldHandler.getNPCs().then(function(npcs) {

                _.each(compareUnits, function(compareUnit) {

                    var msg = 'NPC ' + compareUnit.id + ' should exist.';

                    var check = _.some(npcs, function(npc) {
                        return npc.id === compareUnit.id;
                    });

                    t.ok(check, msg);

                });

                t.equal(compareUnits.length, npcs.length, 'Lengths of unit collections should be equal');

                t.end();

            });

        });

    },

    /**
     * @method loadCells
     *
     * @param worldHandler {WorldHandler}
     *
     * @param info {Array} -
     * Coordinates and zone ids for cells that should have handlers.
     *
     **/
    loadCells : function(worldHandler, info) {

        var compare = info.length;

        var countCells = function() {

            var count = 0;

            return worldHandler.LoopCells(function() { 
                count++;
            }).then(function() { 
                return count;
            });

        };

        return countCells().then(function(count) {

            test('WorldHandler -- Loaded Cells Test', function(t) {

                t.equal(count, compare, count + '===' + compare);

                _.each(info, function(i) {

                    var msg = 'Should have cell [ zone: ' + i.zoneId;
                    msg += ', cx: ' + i.cellCoords.x;
                    msg += ', cz: ' + i.cellCoords.z + ']';

                    t.ok(worldHandler.CheckWorldStructure(i.zoneId, i.cellCoords.x, i.cellCoords.z), msg);
                });

                t.end(); 

            });

        }); 

    } 

};

//module.exports = Tests;

