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
IronbaneApp
    .factory('socket', ['$window', '$rootScope', 'GAME_HOST', 'GAME_PORT', function($window, $rootScope, GAME_HOST, GAME_PORT) {
        var socket = {};

        return {
            connect: function() {
                socket = $window.io.connect('http://' + GAME_HOST + ':' + GAME_PORT + '/', {
                    reconnect: false
                });
            },
            on: function(eventName, callback) {
                socket.on(eventName, _.throttle(function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        callback.apply(socket, args);
                    });
                }, 500));
            },
            emit: function(eventName, data, callback) {
                socket.emit(eventName, data, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        if (callback) {
                            callback.apply(socket, args);
                        }
                    });
                });
            }
        };
    }]);