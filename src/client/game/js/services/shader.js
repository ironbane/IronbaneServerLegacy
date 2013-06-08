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
angular.module('IronbaneGame')
.constant('SHADER_PATH', '/game/data/shaders/') // good for testing/mock todo: config?
.factory('Shader', ['$log', '$http', '$q', 'SHADER_PATH', function($log, $http, $q, path) {
    return {
        get: function(name) {
            var shader = {
                fragment: null,
                vertex: null
            };

            return $q.all([$http.get(path + name + '.vs'), $http.get(path + name + '.fs')])
                .then(function(files) {
                    shader.vertex = files[0].data;
                    shader.fragment = files[1].data;

                    return shader;
                }, function(err) {
                    $log.error('error loading shader: ', name, err);
                    $q.reject(err);
                });
        }
    };
}]);