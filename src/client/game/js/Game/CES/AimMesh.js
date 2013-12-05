
var AimTextures = {
    TARGET_AIM_TEXTURE_BOW: "aim_bow",
    TARGET_AIM_TEXTURE_BOW_FIRE: "aim_bow_fire",
    TARGET_AIM_TEXTURE_FORBIDDEN: "aim_forbidden",
    TARGET_AIM_TEXTURE_CLOSE: "aim_close",
    TARGET_AIM_TEXTURE_CLOSE_FIRE: "aim_close_fire",
    TARGET_AIM_TEXTURE_RED_GLOW: "redglow",
    TARGET_AIM_TEXTURE_AIM_EDITOR: "aim_editor",
    BLANK: "blank"
};

var AimMesh = Component.extend({
        name: "AimMesh",
	Init: function(){
		// Reddish glow that follows the mouse

        this.aimTexture = "";
        this.targetAimTexture = "";
        this.aimMesh = null;
        this.aimMeshPosition = new THREE.Vector3();

        // Secondary helper
        this.aimHelperTexture = "";
        // this.targetAimHelperTexture = "";
        this.aimHelperMesh = null;
        this.aimHelperMeshPosition = new THREE.Vector3();
	},
    destroy: function() {
        if (this.aimMesh) {
            releaseMesh(this.aimMesh, {
                removeMaterials: false
            });

            ironbane.scene.remove(this.aimMesh);
        }
    },
    destroyAimHelperMesh: function() {
        if (this.aimHelperMesh) {
            releaseMesh(this.aimHelperMesh, {
                removeMaterials: false
            });
            ironbane.scene.remove(this.aimHelperMesh);
        }
    },
    setTargetAimTexture: function(targetAimTexture){
        this.targetAimTexture = targetAimTexture;
    },
    tick: function(dTime){
       if (this.aimTexture != this.targetAimTexture) {
            this.destroy();
            this.aimTexture = this.targetAimTexture;
            if (this.aimTexture !== "") {
                this.aimMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1),
                    ironbane.textureHandler.getTexture('images/misc/' + this.aimTexture + '.png', false, {
                        transparent: true,
                        alphaTest: 0.1
                    }));
                this.aimMesh.rotation.x = -Math.PI / 2;
                this.aimMesh.position.copy(this.aimMeshPosition);                
                ironbane.scene.add(this.aimMesh);
            }
        }
        if(this.aimMesh && currentMouseToWorldData){

            var point = ConvertVector3(currentMouseToWorldData.point);
            this.aimMeshPosition.lerp(point.add(currentMouseToWorldData.face.normal.clone().normalize().multiplyScalar(0.05)), dTime * 20);
            this.aimMesh.position.copy(this.aimMeshPosition);
            this.aimMesh.LookFlatAt(currentMouseToWorldData.face.normalWithRotations.clone().add(this.aimMesh.position));
        }
        if (this.aimHelperMesh && currentMouseToWorldData) {
            this.aimHelperMesh.position.copy(this.aimHelperMeshPosition);
        }
    }

});