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

// Colors
var brown1 = "#33ff99";
var brown2 = "#339966";
var brown3 = "#0e7051"

var refreshActionBarOnPopClose = false;
var barFillMinData = new Array();
var barFillMaxData = new Array();;

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

function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
        // Alternatively you could use:
        // (new Image()).src = this;
    });
}

function AorAn(thing) {
    var l = thing.toLowerCase().substr(0,1);
    return (l == "a" || l == "e" || l == "i" || l == "u" || l == "o") ? "an "+thing : "a "+thing;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function getRandom(min, max) {
    var randomNum = Math.random() * (max-min);
    return(Math.round(randomNum) + min);
}

function roundNumber(num, dec) {
    var result = Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
    return result;
}

//$(document).ready(function(){
//alert(timeSince(55));
//});


var dateChunks = new Array(

        new Array(60 * 60 * 24 * 365, 'year'),

        new Array(60 * 60 * 24 * 30, 'month'),

        new Array(60 * 60 * 24 * 7, 'week'),

        new Array(60 * 60 * 24, 'day'),

        new Array(60 * 60, 'hour'),

        new Array(60, 'min'),

        new Array(1, '')

);

function timeSince(since) {



    var count;



    for (i = 0, j = dateChunks.length; i < j; i++) {

        var seconds = dateChunks[i][0];

        var name = dateChunks[i][1];

        if ((count = Math.floor(since / seconds)) != 0) {

            break;

        }

    }



    var print = (count == 1) ? '1 ' + name : count + " " + name + "s";

    if ( name == "min" ) print = count + " " + name;
    if ( name == "" ) print = count;

    return print;

}

function CreateBarHTML(min,max,width,height,mincolor,maxcolor,name,label) {
    if ( min < 0 ) min = 0;

    if ( (!barFillMinData[name]&&barFillMinData[name]!=0) || barFillMinData[name] != min || label == "XP" || (!barFillMaxData[name]&&barFillMaxData[name]!=0) || barFillMaxData[name] != max ) {
        barFillMinData[name] = min;
        barFillMaxData[name] = max;
    }
//    else {
//        return;
//    }

    var minwidth = parseInt((parseFloat(min)/parseFloat(max))*parseFloat(width));

    var labeltext = "";
    if ( label ) {

        var color = "black";



        if ( label == "XP" || label == "P" ) {
            color = "white";
        }

        var chrono = false;
        if ( label == "P" ) {
            chrono = true;
        }

        if ( label.length > 1 ) {
            label = " "+label;
        }
        else {
            label = "";
        }

        var labelstyle = ''+min+'/'+max+''+label+'';

        if ( chrono ) {
            labelstyle = timeSince(min.toFixed(1));
            if ( min.toFixed(1) == 0 ) labelstyle = "";
        }

        labeltext = '<div id="'+name+'_text" style="position:relative;top:-2px;color:'+color+';font-size:11px;font-weight:bold;width:'+width+'px;text-align:center">'+labelstyle+'</div>';
    }

    //return '<div style="overflow:hidden;width:'+width+'px;height:'+height+'px;border-color:black;border-style:solid;border-width:1px;background-image:url(plugins/world/images/misc/bar_empty_'+color+'.png)"><div style="width:'+minwidth+'px;height:'+height+'px;background-image:url(plugins/world/images/misc/bar_full_'+color+'.png)"></div></div>';
    return '<div id="'+name+'_max" style="overflow:hidden;width:'+width+'px;height:'+height+'px;border-color:black;border-style:solid;border-width:1px;background-color:'+maxcolor+'"><div id="'+name+'" style="width:'+minwidth+'px;height:'+height+'px;background-color:'+mincolor+'">'+labeltext+'</div></div>';
}

function UpdateBar(min,max,name,label) {

    if ( (!barFillMinData[name]&&barFillMinData[name]!=0) || barFillMinData[name] != min || label == "XP" || (!barFillMaxData[name]&&barFillMaxData[name]!=0) || barFillMaxData[name] != max) {
        barFillMinData[name] = min;
        barFillMaxData[name] = max;
    }
    else {
        return;
    }

    var width = $("#"+name+"_max").width();
    var minwidth = parseInt((parseFloat(min)/parseFloat(max))*parseFloat(width));
    if ( label ) {

        var chrono = false;
        var xpwarning = false;
        if ( label == "P" ) {
            chrono = true;
        }
        if ( label == "XP" ) {
            xpwarning = true;
        }

        if ( label.length > 1 ) {
            label = " "+label;
        }
        else {
            label = "";
        }

        var labelstyle = ''+min+'/'+max+''+label+'';

        if ( chrono ) {
            //labelstyle = min.toFixed(1);
            labelstyle = timeSince(min.toFixed());
            if ( min.toFixed(1) == 0 ) labelstyle = "";
        }
        if ( xpwarning ) {
            if ( min >= max ) {
                if ( XPwarningTimer > 1.0 ) {
                    XPwarningTimer = 0.0;
                    XPwarningFlash = !XPwarningFlash;

                }
                var color = parseInt(XPwarningTimer * 255)
                if ( XPwarningFlash ) color = 255-color;
                $("#"+name).css("background-color", rgbToHex(color, 0, color));
                labelstyle = "Waiting to level up (In battle)...";
            }
            else {
                // Restore default color
                $("#"+name).css("background-color", "#ff33ff");
            }
        }

        $("#"+name+"_text").text(labelstyle);
    }
    $("#"+name).width(minwidth);
}

var delimiter_a = "|";
var delimiter_b = "~";
var delimiter_c = "`";
