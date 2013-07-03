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
/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
 
 // Disable these keys for editor and in-game
var badKeys = new Array(9,13,27,32,33,34,35,36,37,38,39,40);
var editorKeys = new Array(73,74,75,76);
var keyTracker = {};


// Use direct keycodes for keypress, keyTracker for true keydown holds
$(document).keydown(function(event){
    
  
    
    if ( hasChatFocus ) return;
    
    keyTracker[event.keyCode] = true;


    if ( event.keyCode == 13 && socketHandler.inGame ) {
        $('#chatInputBox').show();
        setTimeout(function(){
        $('#chatInput').focus();
        hasChatFocus = true;
        }, 100);
        return;
    }

});

$(document).keyup(function(event){
    keyTracker[event.keyCode] = false;
});
