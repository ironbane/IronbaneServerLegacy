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

// Window size
var frameWidth = 800;
var frameHeight = 600;
var launched = false;

// Mouse
var mouseX = 0;
var mouseY = 0;
var startOffsetX = -40;
var startOffsetY = -100;
var offsetX = startOffsetX;
var offsetY = startOffsetY;
var mouseDownLeft = false;
var mouseDownRight = false;

$(document).ready(function(){
    frameWidth = $(window).width();
    frameHeight = $(window).height();
});

