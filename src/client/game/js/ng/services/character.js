IronbaneApp
.constant('MAX_CHAR_SLOTS', 3) // TODO: set by server config?
.factory('Character', ['$log', '$http', '$q',
        function($log, $http, $q) {
            var Character = function(json) {
                angular.copy(json || {}, this);
            };

            Character.prototype.getTexture = function(big) {
                var myChar = this,
                    options = {
                        skin: myChar.skin || 0,
                        eyes: myChar.eyes || 0,
                        hair: myChar.hair || 0,
                        feet: myChar.feet || 0,
                        body: myChar.body || 0,
                        head: myChar.head || 0,
                        big: big
                    };

                var cachefile = 'images/characters/cache/' +
                    [options.skin, options.eyes, options.hair, options.feet, options.body, options.head, (options.big ? 1 : 0)].join('_') +
                    '.png';

                if (_.every(options, function(p) {
                    return parseInt(p, 10) === 0;
                })) {
                    cachefile = 'media/images/misc/blank.png';
                }

                return cachefile;
            };

            Character.get = function(charId) {
                // not implemented yet! (on back end)
            };

            Character.getAll = function(userId) {
                var url = '/api/user/' + userId + '/characters';

                return $http.get(url).then(function(response) {
                    var chars = [];

                    angular.forEach(response.data, function(c) {
                        chars.push(new Character(c));
                    });

                    return chars;
                }, function(err) {
                    return $q.reject(err);
                });
            };

            Character.generate = function() {
                // randomize appearance

            };

            return Character;
        }
    ]);