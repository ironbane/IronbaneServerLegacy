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
.factory('InputService', ['$log', '$window', '$document',
    function($log, $window, $document) {

        var currentKeyboard = {},
            mouseMoved = 0,
            actions = {},
            // special keys
            _MAP = {
                shift: 16,
                alt: 18,
                option: 18,
                ctrl: 17,
                control: 17,
                command: 91,
                backspace: 8,
                tab: 9,
                clear: 12,
                enter: 13,
                'return': 13,
                esc: 27,
                escape: 27,
                space: 32,
                left: 37,
                up: 38,
                right: 39,
                down: 40,
                del: 46,
                'delete': 46,
                home: 36,
                end: 35,
                pageup: 33,
                pagedown: 34,
                ',': 188,
                '.': 190,
                '/': 191,
                '`': 192,
                '-': 189,
                '=': 187,
                ';': 186,
                '\'': 222,
                '[': 219,
                ']': 221,
                '\\': 220
            },
            code = function(x) {
                return _MAP[x.toLowerCase()] || x.toUpperCase().charCodeAt(0);
            };
        // function keys
        for (k = 1; k < 20; k++) {
            _MAP['f' + k] = 111 + k;
        }

        // Current Inputs
        var CI = {
            'mouse': {},
            'keyboard': {},
            'gamepad': {}
        };

        // Last Inputs
        var LI = {};

        var onKeyDown = function(e) {
            currentKeyboard[e.keyCode] = 1;
        };

        var onKeyUp = function(e) {
            currentKeyboard[e.keyCode] = 0;
        };

        var mousemap = {
            1: 'mouse_button_left',
            2: 'mouse_button_middle',
            3: 'mouse_button_right'
        };

        var onMouseDown = function(e) {
            CI['mouse'][mousemap[e.which]] = 1;
        };

        var onMouseUp = function(e) {
            CI['mouse'][mousemap[e.which]] = 0;
        };

        var onMouseMove = function(e) {

            //set the mouse move flag to 0
            mouseMoved = 0;

            var movementX = e.movementX ||
                e.mozMovementX ||
                e.webkitMovementX || 0;

            var movementY = e.movementY ||
                e.mozMovementY ||
                e.webkitMovementY || 0;

            //If we get these then let's use them (a must when pointer lock is on)
            if (movementX || movementY) {

                CI['mouse']['mouseDX'] = movementX;
                CI['mouse']['mouseDY'] = movementY;

            } else {

                CI['mouse']['mouseXL'] = CI['mouse']['mouseX'];
                CI['mouse']['mouseYL'] = CI['mouse']['mouseY'];
                CI['mouse']['mouseX'] = (e.clientX / $window.innerWidth) * 2 - 1;
                CI['mouse']['mouseY'] = (e.clientY / $window.innerHeight) * 2 - 1;
                CI['mouse']['mouseDX'] = CI['mouse']['mouseX'] - CI['mouse']['mouseXL'];
                CI['mouse']['mouseDY'] = CI['mouse']['mouseY'] - CI['mouse']['mouseYL'];
            }
        };

        var init = function() {
            //setup listeners
            $($document).on('keydown', onKeyDown);
            $($document).on('keyup', onKeyUp);
            $($document).on('mousemove', onMouseMove);
            $($document).on('mousedown', onMouseDown);
            $($document).on('mouseup', onMouseUp);
        };

        // singleton init
        init();

        var tick = function() {
            //first check if the mouse has been idle so we can kill old values
            mouseMoved++;
            if (mouseMoved > 1) {
                CI['mouse']['mouseDX'] = 0;
                CI['mouse']['mouseDY'] = 0;
            }

            //copy CI into LI
            LI = $.extend(true, {}, CI);

            //to allow for keypressed we need to take a snapshot from the currentKeyboard
            CI.keyboard = $.extend(true, {}, currentKeyboard);
        };

        function getKeyName(code) {
            return keyboardMap[code];
        }

        function getKBState(key) {
            var currentVal = CI.keyboard[key],
                oldVal = LI.keyboard[key];

            return {
                val: currentVal,
                pressed: !currentVal && oldVal,
                delta: currentVal - oldVal
            };
        }

        function actionPressed(name) {
            if (name in actions) {
                var action = actions[name];

                if(action.type === 'keyboard') {
                    for (var i = 0, len = action.keys.length; i < len; i++) {
                        if (getKBState(code(action.keys[i])).pressed) {
                            return true;
                        }
                    }

                    return false;
                }

                // todo: mouse, gamepad
                return false;
            } else {
                $log.error('no such action registered!', name);
                return false;
            }
        }

        return {
            tick: tick,
            getKeyName: getKeyName,
            getKBState: getKBState,
            addAction: function(action) {
                // action should be an 'InputAction'
                actions[action.name] = action;
            },
            actionPressed: actionPressed
        };
    }
])
.factory('InputAction', ['$log', function($log) {
    // TODO: support combos like Shift+W or Shift+Click

    // keys can be either an array or string: 'W' or ['W', 'Up']
    var Action = function(name, keys, type, help) {
        this.name = name;
        if(angular.isArray(keys)) {
            this.keys = keys;
        } else {
            this.keys = [keys];
        }
        // keyboard, mouse, gamepad
        this.type = type;

        // help text, like 'go forward'
        this.help = help;
    };

    return Action;
}]);
