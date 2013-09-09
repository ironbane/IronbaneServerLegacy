IronbaneApp
.factory('Character', ['$log', '$http', '$q',
        function($log, $http, $q) {
            var Character = function(json) {
                angular.copy(json || {}, this);
            };

            Character.prototype.getTexture = function() {
                var myChar = this;

                var props = ['skin', 'eyes', 'hair', 'feet', 'body', 'head', 'big'];
                _.each(props, function(p) {
                    if (!(p in myChar)) {
                        myChar[p] = 0;
                    }
                });

                var cachefile = 'images/characters/cache/' +
                    [myChar.skin, myChar.eyes, myChar.hair, myChar.feet, myChar.body, myChar.head, (myChar.big ? 1 : 0)].join('_') +
                    '.png';

                if (_.every(myChar, function(p) {
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