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
.constant('ZONE_TYPES', {
    WORLD: 1,
    DUNGEON: 2,
    MAINMENU: 3
})
.factory('Zone', ['$log', '$http', 'ZONE_TYPES', function($log, $http, ZONE_TYPES) {
    // should expose this to outside reconfig?
    var zoneTypeConfig = {};

    zoneTypeConfig[ZONE_TYPES.WORLD] = {
      'enableWater': true,
      'waterLevel': -10,
      'waterTexture': 1650,
      'waterTextureGlow': 1651,
      'enableClouds': true,
      'cloudDensity':0.80,
      'cloudLevel': 15,
      'skyboxShader': "world",
      "music": ["ib2"]
    };

    zoneTypeConfig[ZONE_TYPES.DUNGEON] = {
      'enableWater': true,
      'waterLevel': -1,
      'waterTexture': 1650,
      'waterTextureGlow': 1651,
      'enableClouds': false,
      'cloudDensity':0.0,
      'cloudLevel': 0,
      'skyboxShader': "dungeon",
      "music": ["ib2"]
    };

    var Zone = Class.extend({
        init: function(settings) {
            angular.copy(settings || {}, this);

            // attach config reference to each zone?
        },
        getConfig: function(key) {
            return Zone.getConfig(this, key);
        }
    });

    // get a config param from the zone type config above
    Zone.getConfig = function(zone, key) {
        var config = zoneTypeConfig[zone.type];

        if(!config || !config.hasOwnProperty(key)) {
            return undefined;
        }

        return config[key];
    };

    // get all zones, ajax version
    Zone.getAll = function() {
        var promise = $http.get('/api/zone')
            .then(function(response) {
                var result = [];

                angular.forEach(response.data, function(data) {
                    result.push(new Zone(data));
                });

                return result;
            }, function(err) {
                $log.log('error getting zone data', err);
            });

        return promise;
    };

    return Zone;
}]);