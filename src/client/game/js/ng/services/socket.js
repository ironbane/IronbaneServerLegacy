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
    .factory('socket', ['$q', '$log', '$window', '$rootScope', 'GAME_HOST', 'GAME_PORT', function($q, $log, $window, $rootScope, GAME_HOST, GAME_PORT) {
        var deferred = $q.defer(),
            promise = deferred.promise,
            _socket = null;

        return {
            connect: function() {
                if(_socket !== null) {
                    $log.warn('socket already exists', _socket);
                    return;
                }

                _socket = $window.io.connect('http://' + GAME_HOST + ':' + GAME_PORT + '/', {
                    reconnect: false
                });

                deferred.resolve(_socket);
            },
            on: function(eventName, callback) {
                // deferred events until we are connected
                promise.then(function(socket) {
                    socket.on(eventName, function() {
                        var args = arguments;
                        callback.apply(socket, args);
                        _.throttle(function() { $rootScope.apply(); }, 500)(); // update angular slower than socket
                    });
                });
            },
            emit: function(eventName, data, callback) {
                // emit doesn't need to be deferred, but also can't be called until connected
                if(_socket === null) {
                    return;
                }

                _socket.emit(eventName, data, function() {
                    var args = arguments;
                    $rootScope.$apply(function() {
                        if (callback) {
                            callback.apply(_socket, args);
                        }
                    });
                });
            }
        };
    }]);