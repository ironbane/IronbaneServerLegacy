// index.js - bootup the game

var GameEngine = require('./engine'),
    World = require('./world');

var game = new GameEngine({
    autoBackup: false,
    world: new World()
});

game.on('tick', function(elapsed) {
    //console.log('test tick: ' + elapsed);
});

game.start();

// provide reference to the main app
module.exports = game;