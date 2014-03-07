

var NewLevelEditor = PhysicsObject.extend({
    Init: function() {

        this.editorControls = new THREE.EditorControls( ironbane.camera );
        this.editorControls.enabled = false;

        this.transformControls = new THREE.TransformControls(ironbane.camera);

        this.selectedObject = null;
        this.selectedObjectOldPosition = null;
        this.selectedObjectOldRotation = null;

        this.sceneHelpers = new THREE.Scene();

        this.sceneHelpers.add( this.transformControls.gizmo );
        this.transformControls.hide();

        this.selectionBox = new THREE.BoxHelper();
        this.selectionBox.material.depthTest = false;
        this.selectionBox.material.transparent = true;
        this.selectionBox.visible = false;
        this.sceneHelpers.add( this.selectionBox );

        ironbane.renderer.autoClear = false;
        ironbane.renderer.autoUpdateScene = false;


        var me = this;



        var ray = new THREE.Raycaster();
        var projector = new THREE.Projector();

        var onMouseDownPosition = new THREE.Vector2();
        var onMouseUpPosition = new THREE.Vector2();

        this.onMouseDown = function ( event ) {

            if ( isHoveringHud ) return;

            event.preventDefault();

            onMouseDownPosition.set( event.layerX, event.layerY );

            if ( me.transformControls.hovered === false
                //levelEditor.editorGUI.enableModelPlacer &&
                //levelEditor.editorGUI.mpTransformMode
                ) {

                me.editorControls.enabled = true;
                document.addEventListener( 'mouseup', me.onMouseUp, false );

            }

        };

        this.onMouseUp = function ( event ) {

            if ( isHoveringHud ) return;

            onMouseUpPosition.set( event.layerX, event.layerY );

            if ( onMouseDownPosition.distanceTo( onMouseUpPosition ) < 1 ) {


                if ( currentMouseToWorldData &&
                    levelEditor.editorGUI.enableModelPlacer &&
                    levelEditor.editorGUI.mpTransformMode ) {
                  ironbane.newLevelEditor.SetSelectedObject(currentMouseToWorldData.object);
                }
                else if ( levelEditor.editorGUI.enableModelPlacer &&
                    !levelEditor.editorGUI.mpTransformMode ) {
                  socketHandler.socket.emit('addModel', {
                    position:levelEditor.previewMesh.position.clone().Round(2),
                    type: 5,
                    rX:levelEditor.editorGUI.mpRotX,
                    rY:levelEditor.editorGUI.mpRotY,
                    rZ:levelEditor.editorGUI.mpRotZ,
                    param:levelEditor.editorGUI.selectModel
                  }, function() {

                  });
                }
                else if ( levelEditor.editorGUI.enableModelPainter && currentMouseToWorldData ) {

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

                          // currentMetadata["t"+materialIndex] = tileToPaint;

                          // _.extend(currentMetadata, obj.metadata);

                          obj.metadata["t"+materialIndex] = tileToPaint;

                          socketHandler.socket.emit('paintModel', {
                            pos: obj.position.clone().Round(2),
                            id: obj.meshData.id,
                            metadata: le("mpClearMode") ? {} : obj.metadata,
                            global : false
                          });

                        }
                      }
                    }
                  }


                }
                else {
                  ironbane.newLevelEditor.ClearSelectedObject();
                }

            }

            me.editorControls.enabled = false;

            document.removeEventListener( 'mouseup', me.onMouseUp );

        };

        this.onDoubleClick = function ( event ) {

            if ( isHoveringHud ) return;

            if ( currentMouseToWorldData && currentMouseToWorldData.object ) {

                me.editorControls.focus( currentMouseToWorldData.object );

            }

        };

        this.onKeyPress = function(event) {

            if ( isHoveringHud ) return;


              if (event.keyCode == 90 ) me.Undo();

              if (event.keyCode == 68 ) me.Duplicate();

              if ( event.keyCode === 88 ) {

                if ( me.selectedObject ) {
                    hudHandler.messageAlert("Delete model?", "question", function() {
                        me.DeleteSelectedObject();
                    });
                }
              }
        };

        this.editorControls.addEventListener( 'change', function () {

            me.transformControls.update();


        } );

        document.body.addEventListener( 'mousedown', this.onMouseDown, false );
        document.body.addEventListener( 'dblclick', this.onDoubleClick, false );
        document.body.addEventListener( 'keydown', this.onKeyPress, false );




        // Enable dynamic shadow maps because they are cool
        ironbane.renderer.shadowMapAutoUpdate = true;

    },
    Destroy: function(){

        this.editorControls.clearListeners();

        document.body.removeEventListener( 'mousedown', this.onMouseDown, false );
        document.body.removeEventListener( 'dblclick', this.onDoubleClick, false );
        document.body.removeEventListener( 'keydown', this.onKeyPress, false );

        ironbane.renderer.shadowMapAutoUpdate = false;

        this._super();

    },
    Undo: function() {

        if ( !this.selectedObject ) return;

        this.selectedObject.position.copy(this.selectedObjectOldPosition);

        this.selectedObject.quaternion.setFromEuler(this.selectedObjectOldRotation);
        //this.selectedObject.rotation.copy(this.selectedObjectOldRotation);

    },
    Duplicate: function() {

        if ( !this.selectedObject ) return;

        var oldPos = this.selectedObjectOldPosition.clone().Round(2);
        var newPos = this.selectedObject.position.clone().Round(2);
        var oldRot = this.selectedObjectOldRotation.clone();
        var newRot = this.selectedObject.rotation.clone();

        var id = this.selectedObject.unit.meshData.id;

        // Make a deep copy, not a reference
        var metadata = this.selectedObject.unit.metadata;

        if ( !newPos.equals(oldPos) ||
            !newRot.equals(oldRot)) {
            socketHandler.socket.emit('addModel', {
                position:newPos,
                type: 5,
                rX:newRot.x,
                rY:newRot.y,
                rZ:newRot.z,
                param:id
            }, function() {
                if ( !_.isEmpty(metadata) ) {
                  socketHandler.socket.emit('paintModel', {
                    pos: newPos,
                    id: id,
                    metadata: metadata,
                    global : false
                  });
                }
            });
        }

        this.Undo();

    },
    DeleteSelectedObject: function() {

        var me = this;

        if ( this.selectedObject.unit instanceof Mesh ) {
            socketHandler.socket.emit('deleteModel', this.selectedObjectOldPosition.clone().Round(2), function() {
                me.ClearSelectedObject();
            });
        }
        else {
            socketHandler.socket.emit('deleteNPC', this.selectedObject.unit.id, function() {
                me.ClearSelectedObject();
            });
        }


    },
    SetSelectedObject: function(mesh) {

        if ( this.selectedObject ) this.ClearSelectedObject();

        if ( !levelEditor.editorGUI.mpTransformMode ) return;

        // If a unit is present, alter the unit
        if ( mesh && mesh.unit ) {

            // Check that the unit can be selected
            if ( !mesh.unit.canSelectWithEditor ) return;

            this.selectedObjectOldPosition = mesh.unit.object3D.position.clone();
            this.selectedObjectOldRotation = mesh.unit.object3D.rotation.clone();


            this.selectionBox.visible = true;
            this.selectionBox.update( mesh );


            this.selectedObject = mesh.unit.object3D;

            this.transformControls.attach(mesh.unit.object3D);
        }

    },
    ClearSelectedObject: function() {

        if ( !this.selectedObject ) return;

        var oldPos = this.selectedObjectOldPosition.clone().Round(2);
        var newPos = this.selectedObject.position.clone().Round(2);
        var oldRot = this.selectedObjectOldRotation.clone();
        var newRot = this.selectedObject.rotation.clone();

        // Check if the positions changed, if so send a request to add a new object
        // and delete the old
        if ( !newPos.equals(oldPos) ||
            !newRot.equals(oldRot)) {

            // Move the object back to where it was, so the delete works properly
            this.Undo();

            if ( this.selectedObject.unit instanceof Mesh ) {

                // Make it invisible as it will be deleted shortly
                this.selectedObject.unit.mesh.visible = false;

                (function(oldPos, newPos, newRot, id, metadata) {
                    setTimeout(function() {
                        socketHandler.socket.emit('deleteModel', oldPos, function() {
                            socketHandler.socket.emit('addModel', {
                                position:newPos,
                                type: 5,
                                rX:newRot.x,
                                rY:newRot.y,
                                rZ:newRot.z,
                                param:id
                            }, function() {
                                if ( !_.isEmpty(metadata) ) {
                                  socketHandler.socket.emit('paintModel', {
                                    pos: newPos,
                                    id: id,
                                    metadata: metadata,
                                    global : false
                                  });
                                }
                            });
                        });
                    }, 100);
                })(oldPos,
                newPos,
                newRot,
                this.selectedObject.unit.meshData.id,
                this.selectedObject.unit.metadata);
            }
            else {

                socketHandler.socket.emit('moveNPC', {
                    position:newPos,
                    id: this.selectedObject.unit.id
                });
            }
        }

        this.selectedObject = null;


        this.transformControls.detach();
        this.selectionBox.visible = false;
    },
    tick: function(dTime) {



        var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
        ironbane.projector.unprojectVector( vector, ironbane.camera );

        var ray = new THREE.Raycaster( ironbane.camera.position, vector.sub( ironbane.camera.position ).normalize() );

        var intersects = terrainHandler.rayTest(ray, {
            testMeshesNearPosition: ironbane.camera.position,
            noTerrain: levelEditor.editorGUI.enableModelPlacer && levelEditor.editorGUI.mpTransformMode,
            extraRange: 500,
            allowBillboards: true,
            unitReference: this,
            unitRayName: "mouse"
        });

        lastMouseToWorldData = currentMouseToWorldData;

        if (intersects.length > 0) {
          currentMouseToWorldData = intersects[0];
        }
        else {
          currentMouseToWorldData = null;
        }

        if ( le("globalEnable") && lastMouseToWorldData != currentMouseToWorldData ) {
          levelEditor.BuildPreviewBuildMesh();
        }

        if ( currentMouseToWorldData ) {
            debug.setWatch("currentMouseToWorldData.point", ConvertVector3(currentMouseToWorldData.point).ToString());
            debug.setWatch("currentMouseToWorldData.normal", ConvertVector3(currentMouseToWorldData.face.normal).ToString());
            debug.setWatch("currentMouseToWorldData.rotation", ConvertVector3(currentMouseToWorldData.object.rotation).ToString());

            if ( !_.isUndefined(currentMouseToWorldData.object.unit) ) {
                debug.setWatch("currentMouseToWorldData.unit.name", currentMouseToWorldData.object.unit.name);
            }
        }

        if ( this.selectedObject ) {
            this.selectedObject.rotation.setFromQuaternion(this.selectedObject.quaternion);
            this.selectedObject.unit.changeRotationNextTick = true;
        }

    }
});