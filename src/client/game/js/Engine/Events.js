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


// Variables
var hasChatFocus = false;
var lastUsedChat = [];
var lastUsedChatCounter = 0;
var lastUsedChatSelectCounter = 0;



// Client input
var msg = '';

$('#chatInput').attr('value', msg);

$('#chatInput').focus(function(){

  if ( !socketHandler.inGame ) return;

  if ( $('#chatInput').attr('value') == msg ) {
    $('#chatInput').attr('value', '');
  }
  hasChatFocus = true;
});
$('#chatInput').blur(function(){
  if ( !socketHandler.inGame ) return;

  if ( $('#chatInput').attr('value') === '' ) {
    $('#chatInput').attr('value', msg);
  }
  hasChatFocus = false;
});
$('#chatInput').keypress(function(e)
{
  if ( !socketHandler.inGame ) return;

  code= (e.keyCode ? e.keyCode : e.which);
  if (code == 13) {
    var clientmsg = $('#chatInput').val();
    lastUsedChat[lastUsedChatCounter++] = clientmsg;
    lastUsedChatSelectCounter = lastUsedChatCounter;

    socketHandler.socket.emit('chatMessage', {
      message: clientmsg
    });

    $('#chatInput').attr('value', '');
    $('#chatInput').blur();
    $('#chatInputBox').hide();
  }
});
$('#chatInput').keydown(function(e)
{
  if ( !socketHandler.inGame ) return;

  code= (e.keyCode ? e.keyCode : e.which);
  if ( code == 45 ) {
    if ( player.target_unit ) {
      $('#chatInput').attr('value',
        $('#chatInput').attr('value') +
        ' '+player.target_unit.id+' ');
    }
  }
  if ( code == 38 ) {
    if ( lastUsedChatSelectCounter > 0 ) lastUsedChatSelectCounter--;
    $('#chatInput').attr('value',
      lastUsedChat[lastUsedChatSelectCounter]);
  }
  if ( code == 40 ) {
    if ( lastUsedChatSelectCounter < lastUsedChat.length - 1 )
      lastUsedChatSelectCounter++;

    $('#chatInput').attr('value',
      lastUsedChat[lastUsedChatSelectCounter]);
  }
});

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
$('#statBar,#coinBar,#itemBar,#lootBag,div[id^="li"],div[id^="ii"]').on("mouseover",
  function(event) {
    event.stopPropagation();
    isHoveringHud = true;
  }
  );

$(window).resize(function() {
  //alert('resize');
  hudHandler.ResizeFrame();

  // notify the renderer of the size change
  ironbane.renderer.setSize( window.innerWidth, window.innerHeight );
  // update the camera
  ironbane.camera.aspect  = window.innerWidth / window.innerHeight;
  ironbane.camera.updateProjectionMatrix();
});

var noDisconnectTrigger = false;

$(document).keydown(function(event){

  if ( !socketHandler.inGame ) return;

  if ( hasChatFocus ) return;

  keyTracker[event.keyCode] = true;

  if ( event.keyCode == 13 ) {
    setTimeout(function(){
      $('#chatLine').focus();
      hasChatFocus = true;
    }, 100);
    return;
  }


  if ( ironbane.player ) {
    if ( event.keyCode == 49 ) {
      ironbane.player.UseItem(0);
    }
    if ( event.keyCode == 50 ) {
      ironbane.player.UseItem(1);
    }
    if ( event.keyCode == 51 ) {
      ironbane.player.UseItem(2);
    }
    if ( event.keyCode == 52 ) {
      ironbane.player.UseItem(3);
    }
    if ( event.keyCode == 53 ) {
      ironbane.player.UseItem(4);
    }
    if ( event.keyCode == 54 ) {
      ironbane.player.UseItem(5);
    }
    if ( event.keyCode == 55 ) {
      ironbane.player.UseItem(6);
    }
    if ( event.keyCode == 56 ) {
      ironbane.player.UseItem(7);
    }
    if ( event.keyCode == 57 ) {
      ironbane.player.UseItem(8);
    }
    if ( event.keyCode == 48 ) {
      ironbane.player.UseItem(9);
    }
  }


  if ( event.keyCode == 27 ) {

    if ( !cinema.IsPlaying() ) {
      hudHandler.MessageAlert("Back to the Main Menu?", "question", function() {

        socketHandler.readyToReceiveUnits = false;

        socketHandler.socket.emit('backToMainMenu', {}, function (reply) {

          if ( ISDEF(reply.errmsg) ) {
            hudHandler.MessageAlert(reply.errmsg);
            return;
          }

          $('#gameFrame').animate({
            opacity: 0.00
          }, 1000, function() {

            setTimeout(function(){ironbane.showingGame = false;}, 100);

            socketHandler.inGame = false;

            for(var u=0;u<ironbane.unitList.length;u++) ironbane.unitList[u].Destroy();

            ironbane.unitList = [];

            terrainHandler.Destroy();

            terrainHandler.status = terrainHandlerStatusEnum.INIT;

            ironbane.player = null;

            socketHandler.loggedIn = false;

            $('div[id^="li"]').remove();
            $('div[id^="ii"]').remove();

            $.post('gamehandler.php?action=getchars', function(data) {
              eval(data);

              hudHandler.ShowMenuScreen();
              hudHandler.MakeCharSelectionScreen();

            });

          });


        });
      }, function() {

      });

    }
    else {
      hudHandler.MessageAlert("Skip Cutscene?", "question", function() {
        ironbane.player.canMove = true;
        cinema.Clear();
      }, function() {});
    }
  }


});

// Disable text selection
(function($){

  $.fn.disableSelection = function() {
    return this.each(function() {
      $(this).attr('unselectable', 'on')
      .css({
        '-moz-user-select':'none',
        '-webkit-user-select':'none',
        'user-select':'none',
        '-ms-user-select':'none'
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
  if (event.target == ironbane.renderer.domElement || $.inArray(id, ['chatContent','debugBox']) != -1 ) {
    event.preventDefault();
    if ( mouseCheckHoldInterval ) clearInterval(mouseCheckHoldInterval);
    mouseCheckHoldInterval = setInterval(function(){
      mouseIntervalFunction(event);
    }, 100);

  }


//return false;
}
);
$(document).mouseup(function(event) {
  clearInterval(mouseCheckHoldInterval);

  if ( event.button === 0 ) {

  }
  else {
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
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;


//    if ( ironbane.player ) ironbane.player.UpdateMouseProjectedPosition();
});

var mouseIntervalFunction = function(event){


  // relativeMouse = mouse.clone().subSelf(lastMouse);

  // sw("relativeMouse", ConvertVector3(relativeMouse));

  document.getSelection().removeAllRanges();



  if ( showEditor && levelEditor.editorGUI.globalEnable ) {

    if (currentMouseToWorldData) {

      if ( levelEditor.editorGUI.enableNPCEditor ) {

        var position = currentMouseToWorldData.point;

        // Find an object near that position which could be a waypoint
        var npc = null;

        _.each(ironbane.unitList, function(obj) {


          if ( obj.InRangeOfPosition(position, 1)
            && ((obj instanceof Unit) && obj.id < 0) ) {
            npc = obj;
          }


        });

        if ( npc ) {
          socketHandler.socket.emit('deleteNPC', npc.id);
        }
        else {
          _.each(ironbane.unitList, function(unit) {
            
            if ( unit.id < 0 ) {

            if ( currentMouseToWorldData.object == unit.mesh ) {
              if ( levelEditor.editorGUI.neDeleteMode ) {
                socketHandler.socket.emit('deleteNPC', unit.id);
              }

            }
              }
          });
        }
      }
      else if ( levelEditor.editorGUI.enablePathPlacer ) {

        var position = currentMouseToWorldData.point;

        // Find an object near that position which could be a waypoint
        var waypoint = null;

        _.each(terrainHandler.cells, function(cell) {
            _.each(cell.objects, function(obj) {
            if ( obj instanceof Waypoint && obj.mesh ) {
              if ( obj.InRangeOfPosition(position, 1) ) {
                waypoint = obj;
              }
            }
          });
        });

        // what if the node is in the air?
        _.each(terrainHandler.cells, function(cell) {
            _.each(cell.objects, function(obj) {
              if ( currentMouseToWorldData.object == obj.mesh ) {

              if ( (obj instanceof Waypoint) ) {
                waypoint = obj;
              }
            }
          });
        });

        if ( levelEditor.editorGUI.ppMode == PathPlacerModeEnum.NODES ) {

          // Send a request to destroy this object
          socketHandler.socket.emit('ppAddNode', position.Round(2), function(reply) {

            if ( ISDEF(reply.errmsg) ) {
              hudHandler.MessageAlert(reply.errmsg);
              return;
            }

            _.each(terrainHandler.cells, function(cell) {
                _.each(cell.objects, function(obj) {

                    if ( obj instanceof Waypoint ) {
                      if ( obj.InRangeOfPosition(position, levelEditor.editorGUI.ppAutoConnectWithin) ) {
                        socketHandler.socket.emit('ppAddEdge', {
                          from:reply.newNodeID,
                          to:obj.nodeData['id'],
                          twoway:true
                          }, function(reply) {

                          if ( ISDEF(reply.errmsg) ) {
                            hudHandler.MessageAlert(reply.errmsg);
                            return;
                          }

                        });
                      }
                    }

                });
            });


          });





        }
        else if ( levelEditor.editorGUI.ppMode == PathPlacerModeEnum.EDGES ) {

          // If nothing selected, clear!


          if ( levelEditor.selectedNode ) {
            if ( waypoint && levelEditor.selectedNode['id'] != waypoint.nodeData['id']) {


              socketHandler.socket.emit('ppAddEdge', {
                from:levelEditor.selectedNode['id'],
                to:waypoint.nodeData['id'],
                twoway:levelEditor.editorGUI.ppTwoWay
                }, function(reply) {

                if ( ISDEF(reply.errmsg) ) {
                  hudHandler.MessageAlert(reply.errmsg);
                  return;
                }

              });
            }
            else {
              levelEditor.selectedNode = null;
            }

            _.each(terrainHandler.cells, function(cell) {
              cell.ReloadWaypointsOnly();
            });

          }
          else {
            // Set selected node
            if ( waypoint ) {
              levelEditor.selectedNode = waypoint.nodeData;

              _.each(terrainHandler.cells, function(cell) {
                cell.ReloadWaypointsOnly();
              });
            }
          }





        }
        else if ( levelEditor.editorGUI.ppMode == PathPlacerModeEnum.DELETE && waypoint) {
          socketHandler.socket.emit('ppDeleteNode', {
            id:waypoint.nodeData.id
            }, function(reply) {

            if ( ISDEF(reply.errmsg) ) {
              hudHandler.MessageAlert(reply.errmsg);
              return;
            }

          });
        }

      }
      else if ( levelEditor.editorGUI.enableModelPlacer ) {

        var position = currentMouseToWorldData.point;


        if ( levelEditor.editorGUI.mpMode == ModelPlacerModeEnum.DELETE ) {
          _.each(terrainHandler.cells, function(cell) {
              _.each(cell.objects, function(obj) {
              if ( currentMouseToWorldData.object == obj.mesh ) {

                if ( obj instanceof Mesh ) {
                  // Send a request to destroy this object

                  socketHandler.socket.emit('deleteModel', obj.position.Round(2));

                }
              }
            });
          });

        }
        else {

          socketHandler.socket.emit('addModel', {
            position:levelEditor.previewMesh.position.clone().Round(2),
            type: 5,
            rX:levelEditor.editorGUI.mpRotX,
            rY:levelEditor.editorGUI.mpRotY,
            rZ:levelEditor.editorGUI.mpRotZ,
            param:levelEditor.editorGUI.selectModel
          });

        }
      }
      else if ( levelEditor.editorGUI.enableModelPainter ) {

          for(var c in terrainHandler.cells) {
            for(var o=0;o<terrainHandler.cells[c].objects.length;o++) {
              if ( currentMouseToWorldData.object == terrainHandler.cells[c].objects[o].mesh ) {

                var obj = terrainHandler.cells[c].objects[o];

                if ( obj instanceof Mesh ) {
                  // Send a request to destroy this object

                  var currentMetadata = {};

                  // Alter it
                  var materialIndex = currentMouseToWorldData.face.materialIndex + 1;

                  var tileToPaint = levelEditor.editorGUI.selectedTile;

                  currentMetadata["t"+materialIndex] = tileToPaint;

                  _.extend(currentMetadata, obj.metadata);

                  socketHandler.socket.emit('paintModel', {
                    pos: obj.position.clone().Round(2),
                    id: obj.meshData.id,
                    metadata: le("mpClearMode") ? {} : currentMetadata,
                    global : le("mpSetForAllModels") ? true : false
                  });

                }
              }
            }
          }


      }

    }
  }
  else if ( ironbane.player ) {

    if ( ironbane.player.dead ) return;

    if ( event.button === 0 ) {
      if (currentMouseToWorldData) {
        var position = currentMouseToWorldData.point;
        ironbane.player.AttemptAttack(position);
      }
    }
    else {
      // Todo: rotate around camera
       //ironbane.player.thirdPersonReference.y = 0;

       ironbane.player.isLookingAround = true;

       var factorX = relativeMouse.x*20;
       if ( factorX > 0 ) {
        factorX = Math.min(1, factorX);
       }
       else if ( factorX < 0 ) {
        factorX = Math.max(-1, factorX);
       }

       var factorY = relativeMouse.y*40;
       if ( factorY > 0 ) {
        factorY = Math.min(1, factorY);
       }
       else if ( factorY < 0 ) {
        factorY = Math.max(-1, factorY);
       }


      var rotationMatrix = new THREE.Matrix4()
        .makeRotationAxis( new THREE.Vector3(0, 1, 0), factorX );

      var side = ironbane.camera.lookAtPosition.clone()
        .subSelf(ironbane.camera.position).normalize()
        .crossSelf(new THREE.Vector3(0, 1, 0)).normalize();
        //debug.DrawVector(this.position, new THREE.Vector3(), 0xFF0000);

        //side.copy(ironbane.player.heading);

      // rotationMatrix.rotateByAxis(side, factorY);

      // // sw("factorX", factorX);
      var newTPR = ironbane.player.thirdPersonReference.clone();

      rotationMatrix.multiplyVector3(newTPR);

      ironbane.player.thirdPersonReference.copy(newTPR);

      var matrix = new THREE.Matrix4().makeRotationAxis( side, -factorY );

      var newTPR = ironbane.player.thirdPersonReference.clone();

      matrix.multiplyVector3(newTPR);

      if ( newTPR.y > 0 && newTPR.y < 4 && false ) {
          ironbane.player.thirdPersonReference.copy(newTPR);
        }
      //ironbane.player.thirdPersonReference.multiplyVector3( matrix );

      ironbane.player.thirdPersonReference.normalize().multiplyScalar(ironbane.player.originalThirdPersonReference.length());

      ironbane.player.thirdPersonReference.y += factorY;


       // ironbane.player.thirdPersonReference.x = 0;
       // ironbane.player.thirdPersonReference.z = 0;
    }


  }

};
