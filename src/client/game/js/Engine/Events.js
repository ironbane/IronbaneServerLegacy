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

// Disable right-click
$(function() {
    $(this).bind('contextmenu', function(e) {
        e.preventDefault();
    });
});

var isHoveringHud = false;
//$('#statBar,#coinBar,#itemBar,#lootBag,div[id^="li"],div[id^="ii"]').on("mouseover",
//  function() { isHoveringHud = true; },
//  function() { isHoveringHud = false; }
//);
//$('#gameFrame').on("mouseover",
//  function(event) { event.stopPropagation(); isHoveringHud = false; },
//  function(event) { isHoveringHud = true; }
//);
$('#gameFrame').on("mouseover",
    function(event) {
        isHoveringHud = false;
    }
);
$('#statBar,#coinBar,#itemBar,#lootBag,#bankBar,#editorControls,div[id^="li"],div[id^="ii"]').on("mouseover",
    function(event) {
        event.stopPropagation();
        isHoveringHud = true;
    }
);

$(window).resize(function() {
    //alert('resize');
    hudHandler.ResizeFrame();

    // notify the renderer of the size change
    ironbane.renderer.setSize(window.innerWidth, window.innerHeight);
    // update the camera
    ironbane.camera.aspect = window.innerWidth / window.innerHeight;
    ironbane.camera.updateProjectionMatrix();
});

var noDisconnectTrigger = false;

$(document).keydown(function(event) {

    if (window.hasChatFocus === true || window.disableGameControls === true || !socketHandler.inGame) {
        return;
    }

    keyTracker[event.keyCode] = true;



    if (event.keyCode === 27) {

        if (!cinema.IsPlaying()) {
            hudHandler.messageAlert("Back to the Main Menu?", "question", function() {
                socketHandler.readyToReceiveUnits = false;
                socketHandler.socket.emit('backToMainMenu', {}, function(reply) {
                    if (!_.isUndefined(reply.errmsg)) {
                        hudHandler.messageAlert(reply.errmsg);
                        return;
                    }

                    $('#gameFrame').animate({
                        opacity: 0.00
                    }, 1000, function() {

                        setTimeout(function() {
                            ironbane.showingGame = false;
                        }, 100);

                        socketHandler.inGame = false;

                        socketHandler.readyToReceiveUnits = false;

                        ironbane.getUnitList().destroy();

                        ironbane.getUnitList().clear();

                        terrainHandler.Destroy();

                        terrainHandler.status = terrainHandlerStatusEnum.INIT;

                        ironbane.player.Destroy();

                        ironbane.player = null;

                        socketHandler.loggedIn = false;

                        $('div[id^="li"]').remove();
                        $('div[id^="ii"]').remove();

                        // is startdata right here? check session user instead?
                        $.get('/api/user/' + startdata.user + '/characters')
                            .done(function(data) {
                                window.chars = data;
                                window.charCount = window.chars.length;

                                startdata.characterUsed = hudHandler.GetLastCharacterPlayed();

                                hudHandler.ShowMenuScreen();
                                hudHandler.MakeCharSelectionScreen();
                            })
                            .fail(function(err) {
                                console.error('error getting chars...', err);
                            });
                    });
                });
            }, function() {

            });

        } else {
            hudHandler.messageAlert("Skip Cutscene?", "question", function() {
                ironbane.player.canMove = true;
                cinema.Clear();
            }, function() {});
        }
    }


});

// Disable text selection
(function($) {

    $.fn.disableSelection = function() {
        return this.each(function() {
            $(this).attr('unselectable', 'on')
                .css({
                    '-moz-user-select': 'none',
                    '-webkit-user-select': 'none',
                    'user-select': 'none',
                    '-ms-user-select': 'none'
                })
                .each(function() {
                    this.onselectstart = function() {
                        return false;
                    };
                });
        });
    };

})(jQuery);

var mouse = new THREE.Vector2();
var lastMouse = new THREE.Vector2();
var relativeMouse = new THREE.Vector2();


var mouseCheckHoldInterval = null;

var eClientX = 0;
var eClientY = 0;

$(document).mousedown(function(event) {


    var id = event.target.id;
    if (event.target == ironbane.renderer.domElement || $.inArray(id, ['chatContent', 'debugBox']) != -1) {
        event.preventDefault();

        mouseClickFunction(event);

        if (mouseCheckHoldInterval) clearInterval(mouseCheckHoldInterval);
        mouseCheckHoldInterval = setInterval(function() {
            mouseIntervalFunction(event);
        }, 100);

    }


    //return false;
});
$(document).mouseup(function(event) {
    clearInterval(mouseCheckHoldInterval);

    if (event.button === 0) {

    } else {
        ironbane.player.isLookingAround = false;
        ironbane.player.thirdPersonReference
            .copy(ironbane.player.originalThirdPersonReference);
    }
    //return false;
});

var lastMouseToWorldData = null;
var currentMouseToWorldData = null;

$(document).mousemove(function(event) {

    // lastMouse = mouse.clone();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;



});

var mouseClickFunction = function(event) {
    if (showEditor && levelEditor.editorGUI.globalEnable) {
        if (currentMouseToWorldData) {

            if (levelEditor.editorGUI.enableNPCEditor) {

                var position = currentMouseToWorldData.point;

                // Find an object near that position which could be a waypoint
                var npc = ironbane.getUnitList().findUnit(function(obj) {
                    if (obj.InRangeOfPosition(position, 1) && ((obj instanceof Unit) && obj.id < 0)) {
                        return obj;
                    }
                });

                if (npc) {
                    socketHandler.socket.emit('deleteNPC', npc.id);
                } else {
                    ironbane.getUnitList().iterate(function(unit) {

                        if (unit.id < 0) {

                            if (currentMouseToWorldData.object == unit.mesh) {
                                if (levelEditor.editorGUI.neDeleteMode) {
                                    socketHandler.socket.emit('deleteNPC', unit.id);
                                }

                            }
                        }
                    });
                }
            }


        }
    }
};

var mouseIntervalFunction = function(event) {


    // relativeMouse = mouse.clone().sub(lastMouse);

    // sw("relativeMouse", ConvertVector3(relativeMouse));

    document.getSelection().removeAllRanges();



    if (ironbane.player && !le("globalEnable")) {

        if (ironbane.player.dead) return;

        if (event.button === 0) {
            if (currentMouseToWorldData) {
                var position = currentMouseToWorldData.point;
                ironbane.player.attemptAttack(position);
            }
        } else {
            // Todo: rotate around camera
            //ironbane.player.thirdPersonReference.y = 0;

            ironbane.player.isLookingAround = true;

            var factorX = relativeMouse.x * 20;
            if (factorX > 0) {
                factorX = Math.min(1, factorX);
            } else if (factorX < 0) {
                factorX = Math.max(-1, factorX);
            }

            var factorY = relativeMouse.y * 40;
            if (factorY > 0) {
                factorY = Math.min(1, factorY);
            } else if (factorY < 0) {
                factorY = Math.max(-1, factorY);
            }


            var rotationMatrix = new THREE.Matrix4()
                .makeRotationAxis(new THREE.Vector3(0, 1, 0), factorX);

            var side = ironbane.camera.lookAtPosition.clone()
                .sub(ironbane.camera.position).normalize()
                .cross(new THREE.Vector3(0, 1, 0)).normalize();

            var newTPR = ironbane.player.thirdPersonReference.clone();

            newTPR.applyMatrix4(rotationMatrix);

            ironbane.player.thirdPersonReference.copy(newTPR);

            var matrix = new THREE.Matrix4().makeRotationAxis(side, -factorY);

            var newTPR = ironbane.player.thirdPersonReference.clone();

            newTPR.applyMatrix4(matrix);

            if (newTPR.y > 0 && newTPR.y < 4 && false) {
                ironbane.player.thirdPersonReference.copy(newTPR);
            }


            ironbane.player.thirdPersonReference.normalize().multiplyScalar(ironbane.player.originalThirdPersonReference.length());

            ironbane.player.thirdPersonReference.y += factorY;

        }


    }

};