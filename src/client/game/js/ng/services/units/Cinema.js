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



IronbaneApp.service("Cinema", function(){
    
        this.queue = [];
    this.PlayCutscene = function(id) {
        $("#chatBox").css("opacity", 0);
        hudHandler.hideHUD();
    $('#black-bar-top,#black-bar-bottom').animate({
        height: 60
      }, 1000, function() {

      });

        this.queue.push({
            id: id,
            hasStarted: false
        });

    };
    this.EndCutscene = function() {

    $('#black-bar-top,#black-bar-bottom').animate({
        height: 0
      }, 1000, function() {
        hudHandler.ShowHUD();
        $("#chatBox").css("opacity", "");
      });

        this.queue.shift();

    };
    this.Clear = function() {

        $('#black-bar-top,#black-bar-bottom').animate({
            height: 0
          }, 1000, function() {
            hudHandler.ShowHUD();
          });

        this.queue = [];

        TWEEN.removeAll();

    };
    this.IsPlaying = function() {
        return this.queue.length !== 0;
    };
    this.tick= function(dTime) {

        if ( this.queue.length === 0 ) return;

        var nowPlaying = this.queue[0];

        var scene = nowPlaying.id;

        if ( !nowPlaying.hasStarted ) {
            nowPlaying.hasStarted = true;
            Cutscenes[scene].cinema = this;
            Cutscenes[scene].start();
        }

        Cutscenes[scene].tick(dTime);

    };
});
