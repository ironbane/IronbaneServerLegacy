/**
 * @module ticker
 **/

var Promise = require('bluebird'),
    async = require('q-async'),
    _ = require('underscore');

/**
 * @class Ticker
 **/
var Ticker = (function() {

    var cells = [],
        millisecondsBetween = 200,
        secondsBetween = 0.200,
        limit = 9,
        started = false;

    /**
     * @method add - Add a cell to be ticked.
     * Start ticking if no there are currently no cells to tick.
     * @param cell {CellHandler}
     **/
    function add(cell) {
        if (!_.contains(cells, cell)) {
            cells.push(cell);
        }

        start();
    }

    /**
     * @method remove
     * @param cell {CellHandler}
     **/
    function remove(cell) {
        cells = _.without(cells, cell);
    }

    /**
     * @method start
     **/
    function start() {
        if (started) {
            return;
        }

        started = true;

        var iterator = function(elapsed, cell, callback) {
            cell.tick(elapsed).then(function() {
                callback(null);
            }).fail(function(err) {
                console.error('Ticker.start', err.stack);
                callback(err);
            });
        };

        var tickAll = _.throttle(function(elapsed) {
            if (cells.length === 0) {
                started = false;
                return;
            }

            elapsed = elapsed || 0;

            var begin = Date.now();

            async.eachLimit(cells, limit, _.partial(iterator, elapsed)).then(function() {

                var nextElapsed = Math.min(secondsBetween, Date.now() - begin);

                tickAll(nextElapsed);
            });
        }, millisecondsBetween);

        tickAll(0);
    }

    return {
        add: add,
        remove: remove
    };

})();

module.exports = Ticker;