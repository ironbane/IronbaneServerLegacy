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
.factory('InputService', ['$log', '$window', '$document', 'QWERTY_KEYBOARD',
    function($log, $window, $document, keyboardMap) {

        var currentKeyboard = {},
            mouseMoved = 0;

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

        return {
            tick: tick,
            getKeyName: getKeyName,
            getKBState: getKBState
        };
    }
])
.constant('QWERTY_KEYBOARD', {
    8: 'Backspace',
    9: 'Tab',
    13: 'Enter',
    16: 'Shift',
    17: 'Ctrl',
    18: 'Alt',
    19: 'Pause/Break',
    20: 'Caps Lock',
    27: 'Esc',
    32: 'Spacebar',
    33: 'Page Up',
    34: 'Page Down',
    35: 'End',
    36: 'Home',
    37: 'Arrow Left',
    38: 'Arrow Up',
    39: 'Arrow Right',
    40: 'Arrow Down',
    45: 'Insert',
    46: 'Delete',
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
    189: '_-',
    187: '=+',
    186: ';:',
    59: ';:',
    61: '=+',
    65: 'a',
    66: 'b',
    67: 'c',
    68: 'd',
    69: 'e',
    70: 'f',
    71: 'g',
    72: 'h',
    73: 'i',
    74: 'j',
    75: 'k',
    76: 'l',
    77: 'm',
    78: 'n',
    79: 'o',
    80: 'p',
    81: 'q',
    82: 'r',
    83: 's',
    84: 't',
    85: 'u',
    86: 'v',
    87: 'w',
    88: 'x',
    89: 'y',
    90: 'z',
    91: 'Windows',
    96: '0 (Num Lock)',
    97: '1 (Num Lock)',
    98: '2 (Num Lock)',
    99: '3 (Num Lock)',
    100: '4 (Num Lock)',
    101: '5 (Num Lock)',
    102: '6 (Num Lock)',
    103: '7 (Num Lock)',
    104: '8 (Num Lock)',
    105: '9 (Num Lock)',
    106: '* (Num Lock)',
    107: '+ (Num Lock)',
    109: '- (Num Lock)',
    110: '. (Num Lock)',
    111: '/ (Num Lock)',
    112: 'F1',
    113: 'F2',
    114: 'F3',
    115: 'F4',
    116: 'F5',
    117: 'F6',
    118: 'F7',
    119: 'F8',
    120: 'F9',
    121: 'F10',
    122: 'F11',
    124: 'F12',
    144: 'Num Lock',
    145: 'Scroll Lock',
    182: 'My Computer',
    183: 'My Calculator',
    188: ',<',
    190: '.>',
    191: '/?',
    192: '`~',
    220: '|',
    221: ']}',
    222: '\'"',
    219: '[{'
});