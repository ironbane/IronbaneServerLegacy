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

var tooltipWidth = 0;
var tooltipHeight = 0;

var currentHoverDiv = "";
function MakeHoverBox(div,text) {

    (function(div){
    $("#"+div).mouseenter(function(e){

        currentHoverDiv = div;

        var t = $("#tooltip").html();
        $("#tooltip").show();
        $("#tooltip").html(text);
        tooltipWidth = parseInt($("#tooltip").width());
        tooltipHeight = parseInt($("#tooltip").height());
        offsetY = - tooltipHeight - 50;
        offsetX = - tooltipWidth /2;
    });
    $("#"+div).mouseleave(function(e){
        $("#tooltip").hide();
    });
    })(div);
}

$(document).ready(function(){
    frameWidth = $(window).width();
    frameHeight = $(window).height();
});

$(document).mousemove(function(e){

    mouseX = e.pageX;
    mouseY = e.pageY;


    var tposx = mouseX + offsetX;
    var tposy = mouseY + offsetY;
   if ( tposx+tooltipWidth+10 > frameWidth ) tposx -= (tooltipWidth+10+(1*offsetX));
//    if ( tposy+tooltipHeight-40 > frameHeight ) tposy -= (tooltipHeight+(1*offsetY));
    while (tposy+tooltipHeight-20 > frameHeight ) tposy -= 1;
    //while (tposx+tooltipWidth+10 > frameWidth ) tposx -= 1;

    $("#tooltip").css("left", (tposx)+"px");
    $("#tooltip").css("top", (tposy)+"px");

});
