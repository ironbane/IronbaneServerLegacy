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



var filmWorld = function(options) {

    var targetPosition = options.target || ironbane.camera.position;


    var onAwake = options.onAwake || function() {};

    var startDelay = options.startDelay || 0;

    var onStart = options.onStart || function() {};
    var onComplete = options.onComplete || function() {};
    var onHold = options.onHold || function() {};


    var transitionTime = options.transitionTime ? options.transitionTime : 5000;
    var easing = options.easing ? options.easing : TWEEN.Easing.Quadratic.InOut;
    var goBack = options.goBack || false;
    var holdTime = options.holdTime || 2000;


    var lookTarget = options.lookTarget || ironbane.camera.lookAtPosition;
    var zoomFOV = options.zoomFOV || ironbane.camera.fov;


    var startPos = ironbane.camera.position;

    onAwake();

    var tweenPos = new TWEEN.Tween( RawVector3(startPos) )
      .delay(startDelay)
      .to( RawVector3(targetPosition), transitionTime )
      .easing( easing )
      .onUpdate( function () {
        ironbane.camera.position.set(this.x, this.y, this.z);
      })
      .onStart(function() {
        onStart();
      })
      .onComplete(function() {
        if ( !goBack ) {

            onHold();
            setTimeout(function() {
                onComplete();
            }, holdTime);

        }
      });


    if ( goBack ) {

        var tweenPosBack = new TWEEN.Tween( RawVector3(targetPosition) )
          .delay(holdTime)
          .to( RawVector3(startPos), transitionTime )
          .easing( easing )
          .onStart(function() {
            onHold();
          })
          .onUpdate( function () {
            ironbane.camera.position.set(this.x, this.y, this.z);
          })
          .onComplete(function() {
            onComplete();
          });

        tweenPos.chain(tweenPosBack);

    }

    tweenPos.start();

    var startFov = ironbane.camera.fov;



    var tweenFov = new TWEEN.Tween( {fov:startFov} )
    .delay(startDelay)
    .to( {fov:zoomFOV}, transitionTime )
    .easing( easing )
    .onUpdate( function () {
        ironbane.camera.fov = this.fov;
        ironbane.camera.updateProjectionMatrix();
    });

    if ( goBack ) {
        var tweenFovBack = new TWEEN.Tween( {fov:zoomFOV} )
        .delay(holdTime)
        .to( {fov:startFov}, transitionTime )
        .easing( easing )
        .onUpdate( function () {
            ironbane.camera.fov = this.fov;
            ironbane.camera.updateProjectionMatrix();
        });

        tweenFov.chain(tweenFovBack);
    }

    tweenFov.start();

    var startLookAt = ironbane.camera.lookAtPosition.clone();
    var endLookAt = lookTarget;


    var tweenLookAt = new TWEEN.Tween( RawVector3(startLookAt) )
    .delay(startDelay)
    .to( RawVector3(endLookAt), transitionTime )
    .easing( easing )
    .onUpdate( function () {
        ironbane.camera.lookAt(new THREE.Vector3(this.x, this.y, this.z));
    });

    if ( goBack ) {
        var tweenLookAtBack = new TWEEN.Tween( RawVector3(endLookAt) )
        .delay(holdTime)
        .to( RawVector3(startLookAt), transitionTime )
        .easing( easing )
        .onUpdate( function () {
            ironbane.camera.lookAt(new THREE.Vector3(this.x, this.y, this.z));
        });

        tweenLookAt.chain(tweenLookAtBack);
    }

    tweenLookAt.start();



};


var Cutscenes = {
    FindIronbane: {
        start: function() {

            console.log("Init FindIronbane");

            this.mytest = "hello";


            var me = this;

            ironbane.player.canMove = false;


            var startPoint = ironbane.camera.position.clone();
            var startLookAt = ironbane.camera.lookAtPosition.clone();




            var restoreFOV = {
                target: startPoint,
                lookTarget: startLookAt,
                zoomFOV: 75,
                transitionTime: 2000,
                onComplete: function() {
                    me.end();
                }
            };
            //<br><div style="padding-top:50px"><img src="theme/images/mascot.png"></div>


            var backToChar = {
                target: ironbane.player.position.clone().addSelf(ironbane.player.heading.clone().multiplyScalar(2)).addSelf(new THREE.Vector3(0, 2, 0)),
                lookTarget: ironbane.player.position,
                transitionTime: 10000,
                holdTime:0,
                // goBack: true,
                zoomFOV: 75,
                onAwake: function() {
                    bm('With the Runestone destroyed, Ironbane will<br>have enough power to destroy our world.');
                    setTimeout(function() {
                         bm('Time is of the essence. You are our only hope.');
                    }, 5000);
                },
                onComplete: function() {

                    filmWorld(restoreFOV);
                    ironbane.player.canMove = true;
                }
            };

            var miniBosses = {
                target: new THREE.Vector3(0, 500, 0),
                lookTarget: new THREE.Vector3(100, 100, 0),
                transitionTime: 10000,
                holdTime: 5000,
                // goBack: true,
                zoomFOV: 75,
                onAwake: function() {
                    bm('Ironbane has given the key<br>to one of his loyal servants.');
                    setTimeout(function() {
                        bm('These guardians live in the<br>darkest places of this continent.');
                    }, 5000);
                },
                onHold: function() {
                    bm('One of them will have the key.<br>We don\'t know which one.');
                },
                onComplete: function() {
                    filmWorld(backToChar);
                }
            };

            var castleZoomed = {
                target: new THREE.Vector3(0, 100, 0),
                lookTarget: new THREE.Vector3(1, 100, -20),
                holdTime: 5000,
                // goBack: true,
                zoomFOV: 25,
                onAwake: function() {
                    bm('Ironbane\'s castle is guarded<br> by powerful and corrupt minions.');
                },
                onHold: function() {
                    bm('In addition, the Gates are locked and require a key.');
                },
                onComplete: function() {
                    filmWorld(miniBosses);
                }
            };

            var castle = {
                target: new THREE.Vector3(0, 100, 0),
                lookTarget: new THREE.Vector3(1, 100, -20),
                holdTime: 5000,
                // goBack: true,
                // zoomFOV: 25,
                onAwake: function() {
                    bm('Recently however, our holy stone is giving a warning.');
                },
                onHold: function() {
                    bm('Ironbane, the once fateful dragon, is<br>planning an assault in his castle.');
                },
                onComplete: function() {
                    filmWorld(castleZoomed);
                }
            };

            var runeStone = {
                target: new THREE.Vector3(0, 3, 1),
                lookTarget: new THREE.Vector3(0, 3, -3),
                goBack: false,
                holdTime: 5000,
                onHold: function() {
                  bm('This is our holy Runestone.<br>It protects us from evil.');
                },
                onComplete: function() {
                    filmWorld(castle);
                }
            };

            var village = {
                target: new THREE.Vector3(50, 50, 0),
                lookTarget: new THREE.Vector3(0, 0, 0),
                goBack: false,
                holdTime: 2000,
                onHold: function() {
                  bm('Welcome to the peaceful village of Ravenwood!');
                },
                onComplete: function() {
                    filmWorld(runeStone);
                }
            };




            filmWorld(village);



        },
        tick: function(dTime) {


        },
        end: function() {
            this.cinema.EndCutscene();
        }
    }
};
