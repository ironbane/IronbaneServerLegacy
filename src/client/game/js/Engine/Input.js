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

// Disable these keys for editor and in-game
var badKeys = new Array(9, 13, 27, 32, 33, 34, 35, 36, 37, 38, 39, 40);
var editorKeys = new Array(73, 74, 75, 76);
var keyTracker = {};

// Use direct keycodes for keypress, keyTracker for true keydown holds
$(document).keydown(function(event) {

    if (window.hasChatFocus === true || window.disableGameControls === true || !socketHandler.inGame) {
        return;
    }

    // This prevents the SNAFU with items floating above itembar when pressing enter when an alertBox is active
    if (event.keyCode === 13 && hudHandler.alertBoxActive) {
        hudHandler.showInv({slots: 10, items: socketHandler.playerData.items});
    }

    keyTracker[event.keyCode] = true;
    // open chat with enter, /, or @
    if ((event.keyCode === 13 || event.keyCode === 191 || (event.shiftKey && event.keyCode === 50)) && socketHandler.inGame) {
        $('#chatInput').addClass('focused').focus();
        setTimeout(function() {
            $('#chatInput').addClass('focused').focus();
            if(event.keyCode === 191) {
                $('#chatInput').val('/');
            }
            if(event.shiftKey && event.keyCode === 50) {
                $('#chatInput').val('@');
            }
        }, 100);
        return;
    }

    // H - HELP
    if(event.keyCode === 72 && socketHandler.inGame) {
        $('#helpDialog').scope().$apply(function(scope) {
            scope.showHelpDialog = !!!scope.showHelpDialog;
        });
    }

    //U - screenshotmode
    if(event.keyCode === 85 && socketHandler.inGame){
        hudHandler.toggleScreenShotMode();
    }

    // ITEM SLOT HOTKEYS
    if (ironbane.player) {
        if (event.keyCode === 49) {
            ironbane.player.useItem(0);
        }
        if (event.keyCode === 50) {
            ironbane.player.useItem(1);
        }
        if (event.keyCode === 51) {
            ironbane.player.useItem(2);
        }
        if (event.keyCode === 52) {
            ironbane.player.useItem(3);
        }
        if (event.keyCode === 53) {
            ironbane.player.useItem(4);
        }
        if (event.keyCode === 54) {
            ironbane.player.useItem(5);
        }
        if (event.keyCode === 55) {
            ironbane.player.useItem(6);
        }
        if (event.keyCode === 56) {
            ironbane.player.useItem(7);
        }
        if (event.keyCode === 57) {
            ironbane.player.useItem(8);
        }
        if (event.keyCode === 48) {
            ironbane.player.useItem(9);
        }
    }

    // Firefox arrow keys scrolling fix
    if([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
        event.preventDefault();
    }

});

$(document).keyup(function(event) {
    keyTracker[event.keyCode] = false;
});