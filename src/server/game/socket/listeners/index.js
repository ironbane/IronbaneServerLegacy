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

var fs = require('q-io/fs'),
    path = require('path'),
    _ = require('underscore');

module.exports = function(socketlistener) {

    var listeners = {};
    console.log("loading socket listeners")

    // dynamically load all commands
    fs.list(__dirname).then(function(files) {
        _.each(files, function(file) {
            console.log(file);
            if(file !== 'index.js') {
                var listener = require(__dirname + '/' + file)(socketlistener),
                    listenerName = listener.name || path.basename(file, '.js').toLowerCase();

                console.log('loading socketlistener: ', file, 'named: ', listenerName);

                listeners[listenerName] = cmd;
            }
        });
    }, function(err) {
        console.log('error listing chat commands!');
    });

    return listeners;
};
