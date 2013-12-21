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


// Only used for projectiles
var offsetID = -1000000;

function GetNewProjectileID() {
    return offsetID--;
}


var ProjectileMeshTypeEnum = {
    // 0 not allowed as 0 == null
    ARROW: 1,
    BONE: 2,
    MELEE: 3
};

var ProjectileTypeEnum = {
    FIREBALL: {
        speed: 15,
        lifeTime: 1,
        has8Textures: false,
        parabolic: false,
        destroyOnImpact: true,
        particle: ParticleTypeEnum.FIREBALL
    },
    PLASMABALL: {
        speed: 8,
        lifeTime: 2,
        has8Textures: false,
        parabolic: false,
        destroyOnImpact: true,
        particle: ParticleTypeEnum.PLASMABALL
    },
    SNOWFLAKE: {
        speed: 8,
        lifeTime: 2,
        has8Textures: false,
        parabolic: false,
        destroyOnImpact: true,
        particle: ParticleTypeEnum.SNOWFLAKE
    },
    SLIMEBALL: {
        speed: 4,
        lifeTime: 12,
        has8Textures: false,
        parabolic: false,
        destroyOnImpact: true,
        impactParticle: ParticleTypeEnum.GREENBLOBIMPACT,
        particle: ParticleTypeEnum.SLIMEBALL
    },
    // HEALBALL: {
    //     speed: 8,
    //     lifeTime: 2,
    //     has8Textures: false,
    //     parabolic: false,
    //     destroyOnImpact: true,
    //     particle: ParticleTypeEnum.HEALBALL
    // },
    ACIDBALL: {
        speed: 15,
        lifeTime: 1,
        has8Textures: false,
        parabolic: false,
        destroyOnImpact: true,
        impactParticle: ParticleTypeEnum.GREENBLOBIMPACT,
        particle: ParticleTypeEnum.ACIDBALL
    },
    ROCK: {
        speed: 10,
        lifeTime: 8,
        has8Textures: false,
        parabolic: true,
        destroyOnImpact: true,
        impactParticle: ParticleTypeEnum.ROCKSHATTER,
        particle: ParticleTypeEnum.ROCK
    },
    SNOWBALL: {
        speed: 10,
        lifeTime: 8,
        has8Textures: false,
        parabolic: true,
        destroyOnImpact: true,
        impactParticle: ParticleTypeEnum.SNOWBALLSPLATTER,
        particle: ParticleTypeEnum.SNOWBALL
    },
    ARROW: {
        speed: 18,
        lifeTime: 8,
        parabolic: true,
        meshType: ProjectileMeshTypeEnum.ARROW,
        impactSound: "arrowhit",
        texture: {
            FULL: 'images/projectiles/arrow_single.png',
            BACK: 'images/projectiles/arrowback.png',
            HEAD: 'images/projectiles/arrowhead.png'
        }
    },
    MELEE: {
        speed: 6,
        lifeTime: 0.5,
        parabolic: true,
        meshType: ProjectileMeshTypeEnum.MELEE,
        // particle: ParticleTypeEnum.ACIDBALL,
        impactParticle: ParticleTypeEnum.MELEEHIT,
        destroyOnImpact: true,
        impactParticleOnUnitsOnly: true
        // impactSound: function(){return ChooseRandom(["arrowHit1","arrowHit2","arrowHit3"])}
    },
    BONE: {
        speed: 18,
        lifeTime: 8,
        parabolic: true,
        meshType: ProjectileMeshTypeEnum.BONE,
        rotationSpeed: new THREE.Vector3(10, 0, 0),
        texture: {
            FULL: 'images/projectiles/bone.png',
            BONEHEAD: 'images/projectiles/bonehead.png'
        }
    },
    POWERBALL: {
        speed: 15,
        lifeTime: 1,
        has8Textures: false,
        parabolic: false,
        destroyOnImpact: true,
        particle: ParticleTypeEnum.POWERBALL
    }
};


var Projectile = Unit.extend({
    Init: function(position, targetPosition, owner, weaponID) {

        this.owner = owner;


        this.weapon = null;
        if (this.owner == ironbane.player) {
            this.weapon = ironbane.player.getEquippedWeapon();
            this.weaponTemplate = items[this.weapon.template];
        } else if (!(this.owner.isPlayer())) {
            this.weapon = items[weaponID];
            this.weaponTemplate = this.weapon;
        } else if (this.owner.isPlayer) {
            this.weapon = owner.weaponTemplate;
            this.weaponTemplate = this.weapon;
        }

        var type = null;

        if (this.weapon) type = ProjectileTypeEnum[this.weaponTemplate.particle];

        if (!type) {
            type = ProjectileTypeEnum.MELEE;
        }


        this.type = {};
        this.type.texture = type.texture === undefined ? "tiles/11" : type.texture;
        this.type.parabolic = type.parabolic === undefined ? false : type.parabolic;
        this.type.speed = type.speed === undefined ? 15 : type.speed;
        this.type.lifeTime = type.lifeTime === undefined ? 1 : type.lifeTime;
        this.type.has8Textures = type.has8Textures === undefined ? false : type.has8Textures;
        this.type.particle = type.particle === undefined ? null : type.particle;
        this.type.meshType = type.meshType === undefined ? null : type.meshType;
        this.type.rotationSpeed = type.rotationSpeed === undefined ? (new THREE.Vector3()) : type.rotationSpeed.clone();
        this.type.impactParticle = type.impactParticle;
        this.type.impactSound = type.impactSound;
        this.type.doubleSided = type.doubleSided === undefined ? false : type.doubleSided;
        this.type.destroyOnImpact = type.destroyOnImpact === undefined ? false : type.destroyOnImpact;
        this.type.impactParticleOnUnitsOnly = type.impactParticleOnUnitsOnly === undefined ? false : type.impactParticleOnUnitsOnly;


        if (type === ProjectileTypeEnum.MELEE) {
            switch (this.weaponTemplate.subtype) {
                case "sword":
                    this.type.lifeTime = 4;
                    this.type.speed = 4;
                    break;
                case "axe":
                    this.type.lifeTime = 2;
                    this.type.speed = 6;
                    break;
                case "dagger":
                    this.type.lifeTime = 2;
                    this.type.speed = 10;
                    break;
            }
        }

        if (this.type.parabolic) {
            position.y += 0.5;
        } else {
            targetPosition.y += 0.1;
        }

        this.particle = null;

        this.size = 0.5 + this.owner.size * 0.5;

        this._super(position, 0, GetNewProjectileID(), 'Projectile', 0, this.size);

        if (!this.type.parabolic) {
            this.restrictToGround = false;
        }

        // Overwrite the default of '5'
        this.maxSpeed = 200;

        this.targetPosition = targetPosition;

        this.dynamic = true;
        this.enableGravity = false;
        this.enableShadow = true;

        if (this.type.parabolic) {
            this.enableGravity = true;
        }

        this.damageDone = false;


        this.impactDone = false;

        if (this.type.parabolic) {
            this.renderOffset.y -= 0.3;
            this.renderOffsetMultiplier = 1.0;
            this.bringToGroundOnSpawn = false;
        }

        var launchVelocity = this.targetPosition.clone().sub(this.position);

        var height = this.targetPosition.clone().sub(this.position).y;

        launchVelocity.normalize().multiplyScalar(this.type.speed);

        if (this.type.parabolic) {
            launchVelocity.y = 0;
            var angle = this.CalculateFiringAngle(targetPosition, false);
            this.heading = launchVelocity.clone().normalize();
            this.side = this.heading.clone().Perp();
            var matrix = new THREE.Matrix4().makeRotationAxis(this.side, angle);
            launchVelocity.applyMatrix4(matrix);
        }

        this.velocity = launchVelocity;

        this.changedRotation = new THREE.Vector3();

        this.rotY = (Math.atan2(this.velocity.z, this.velocity.x));
        if (this.rotY < 0) this.rotY += (Math.PI * 2);
        this.rotY = (Math.PI * 2) - this.rotY;
        this.targetRotY = this.rotY;

        this.lifeTime = this.type.lifeTime;
    },
    Add: function() {
        this._super();

        this.mesh = new THREE.Object3D();

        this.meshChild = new THREE.Object3D();

        this.mesh.add(this.meshChild);

        if (this.type.meshType == ProjectileMeshTypeEnum.ARROW) {
            var mat = ironbane.textureHandler.getTexture(ProjectileTypeEnum.ARROW.texture.FULL, false, {
                transparent: true,
                doubleSided: true
            });


            var mesh;

            var planeGeo = new THREE.PlaneGeometry(1, 1, 1, 1);

            this.meshHeight = 1;

            mesh = new THREE.Mesh(planeGeo, mat);
            mesh.rotation.x = Math.PI;
            mesh.rotation.y = Math.PI / 2;
            this.meshChild.add(mesh);


            var mesh = new THREE.Mesh(planeGeo, mat);
            mesh.rotation.x = Math.PI / 2;
            //            mesh.rotation.y = Math.PI/2;
            mesh.rotation.z = Math.PI / 2;
            this.meshChild.add(mesh);

            var mesh = new THREE.Mesh(planeGeo, ironbane.textureHandler.getTexture(ProjectileTypeEnum.ARROW.texture.BACK, false, {
                transparent: true
            }));
            mesh.scale.x = 0.25;
            mesh.scale.y = 0.25;
            mesh.position.z -= 0.4;
            mesh.rotation.x = Math.PI;
            //            mesh.rotation.y = Math.PI/2;
            mesh.rotation.z = Math.PI;
            this.meshChild.add(mesh);

            var mesh = new THREE.Mesh(planeGeo, ironbane.textureHandler.getTexture(ProjectileTypeEnum.ARROW.texture.HEAD, false, {
                transparent: true
            }));
            mesh.scale.x = 0.25;
            mesh.scale.y = 0.25;
            mesh.position.z += 0.3;
            mesh.rotation.x = Math.PI;
            //            mesh.rotation.y = Math.PI/2;
            mesh.rotation.z = Math.PI;
            mesh.rotation.y = Math.PI;
            this.meshChild.add(mesh);
        }

        if (this.type.meshType == ProjectileMeshTypeEnum.BONE) {
            var mat = ironbane.textureHandler.getTexture(ProjectileTypeEnum.BONE.texture.FULL, false, {
                transparent: true,
                doubleSided: true
            });


            var mesh;

            var planeGeo = new THREE.PlaneGeometry(1, 1, 1, 1);

            this.meshHeight = 1;

            mesh = new THREE.Mesh(planeGeo, mat);
            mesh.rotation.x = Math.PI;
            mesh.rotation.y = Math.PI / 2;
            this.meshChild.add(mesh);


            var mesh = new THREE.Mesh(planeGeo, mat);
            mesh.rotation.x = Math.PI / 2;
            //            mesh.rotation.y = Math.PI/2;
            mesh.rotation.z = Math.PI / 2;
            this.meshChild.add(mesh);


            var mesh = new THREE.Mesh(planeGeo, ironbane.textureHandler.getTexture(ProjectileTypeEnum.BONE.texture.BONEHEAD, false, {
                transparent: true
            }));
            mesh.scale.x = 0.25;
            mesh.scale.y = 0.25;
            mesh.position.z -= 0.4;
            mesh.rotation.x = Math.PI;
            //            mesh.rotation.y = Math.PI/2;
            mesh.rotation.z = Math.PI;
            this.meshChild.add(mesh);

            var mesh = new THREE.Mesh(planeGeo, ironbane.textureHandler.getTexture(ProjectileTypeEnum.BONE.texture.BONEHEAD, false, {
                transparent: true
            }));
            mesh.scale.x = 0.25;
            mesh.scale.y = 0.25;
            mesh.position.z += 0.3;
            mesh.rotation.x = Math.PI;
            //            mesh.rotation.y = Math.PI/2;
            mesh.rotation.z = Math.PI;
            mesh.rotation.y = Math.PI;
            this.meshChild.add(mesh);
        }

        if (this.type.meshType == ProjectileMeshTypeEnum.MELEE) {

            var weaponImage = this.weaponTemplate.image;

            var texture = 'images/items/' + weaponImage + '.png';

            var mat = ironbane.textureHandler.getTexture(texture, false, {
                transparent: true,
                doubleSided: true
            });

            var planeGeo = new THREE.PlaneGeometry(1, 1, 1, 1);

            this.meshHeight = 1;

            var mesh = new THREE.Mesh(planeGeo, mat);
            mesh.rotation.x = Math.PI / 4;
            mesh.rotation.y = Math.PI / 2;
            this.meshChild.add(mesh);

            mesh = new THREE.Mesh(planeGeo, mat);
            mesh.rotation.x = Math.PI * 0.5;
            mesh.rotation.y = Math.PI * 1;
            mesh.rotation.z = Math.PI / 4 * 7;


            this.meshChild.add(mesh);


            this.meshChild.rotation.x = Math.PI * 1.75;

        }

        ironbane.scene.add(this.mesh);


        if (this.type.particle) {
            this.particle = particleHandler.Add(this.type.particle, {
                particleFollowUnit: this
            });
        }


    },
    tick: function(dTime) {
        this.lifeTime -= dTime;

        //this.velocity = this.targetPosition.clone().sub(this.position).normalize().multiplyScalar(this.type.speed);
        //this.steeringForce = this.steeringBehaviour.Seek(this.targetPosition);


        this._super(dTime);

        var spriteIndex = this.getDirectionSpriteIndex();

        if (this.meshChild) {
            if (this.type.meshType == ProjectileMeshTypeEnum.MELEE) {
                if (this.weaponTemplate.subtype === "axe") {
                    //                    this.meshChild.rotation.y += dTime*10;
                    this.meshChild.rotation.x += dTime * 15;
                }
            }
        }

        if (this.type.parabolic) {
            var groundV = this.heading.clone();
            groundV.y = 0;
            groundV.normalize();

            if (this.isTouchingGround) {
                this.velocity.set(0, 0, 0);

                if (this.enableGravity) {
                    //this.position.y += 1.0;
                    this.positionedShadowMesh = false;
                }

                this.enableGravity = false;

            }

        }
        ///This code should move to the server.
        if (this.owner == ironbane.player) {
            if (!this.damageDone) {
                if (!(this.velocity.lengthSq() < 0.0001)) {

                    var list = [];
                    var unitList = [];
                    var me = this;
                    ironbane.getUnitList().iterate(function(u) {
                        if (u instanceof Fighter && u != ironbane.player && me.inRangeOfUnit(u, 1) && u.health > 0 && (u.id < 0 || (u.isPlayer() && me.weapon.attr1 <= 0)) && (u.isPlayer() || !u.template.friendly)) {
                            list.push(u.id);
                            //unitList.push(u);
                        }
                    });

                    if (list.length > 0) {
                        socketHandler.socket.emit('hit', {
                            w: this.weapon.id,
                            l: list
                        }, function(reply) {

                            if (!_.isUndefined(reply.errmsg)) {
                                hudHandler.messageAlert(reply.errmsg);
                                return;
                            }

                        });

                        this.damageDone = true;

                        //                        unit.velocity.set(0,0,0)
                        //                        unit.object3D.position.copy(unitList[0].position);
                        //                        unit.dynamic = false;
                        //                        unit.unitStandingOn = unitList[0];

                        this.Impact();
                    }
                }
            }
        } else if (!(this.owner.isPlayer())) {
            if (!this.damageDone) {
                if (!(this.velocity.lengthSq() < 0.0001)) {

                    var list = [];

                    if (this.inRangeOfUnit(ironbane.player, 1)) {
                        list.push(ironbane.player);
                    }

                    if (list.length > 0) {
                        socketHandler.socket.emit('ghit', {
                            w: this.weapon.id,
                            o: this.owner.id
                        }, function(reply) {

                            if (!_.isUndefined(reply.errmsg)) {
                                hudHandler.messageAlert(reply.errmsg);
                                return;
                            }

                        });

                        this.damageDone = true;

                        this.Impact();
                    }
                }
            }
        } else if (this.owner.isPlayer()) {
            if (!this.damageDone) {
                if (!(this.velocity.lengthSq() < 0.0001)) {

                    var list = [];
                    _.each(ironbane.unitList, function(u) {
                        if (u instanceof Fighter && u != this.owner && this.inRangeOfUnit(u, 1) && u.health > 0 && this.weapon.attr1 <= 0) {
                            list.push(u);
                        }
                    }, this);

                    if (list.length > 0) {
                        this.damageDone = true;
                        this.Impact();

                    }
                }
            }
        }

        this.rotY = (Math.atan2(this.heading.z, this.heading.x));
        if (this.rotY < 0) this.rotY += (Math.PI * 2);
        this.rotY = (Math.PI * 2) - this.rotY;

        if (this.lifeTime <= 0) {
            if (this.particle) {
                this.particle.removeNextTick = true;
                //this.particle = null;
            }

            this.fullDestroy();
            return;
        }

        if (this.type.has8Textures) {
            this.displayUVFrame(0, spriteIndex, 1, 8);
        }

        if (this.mesh) {
            if (this.type.meshType) {

                //if ( this.type.meshType == ProjectileMeshTypeEnum.ARROW ) {
                this.mesh.LookFlatAt(this.position.clone().add(this.heading));
                //}

                if (!this.impactDone) {
                    this.type.rotationSpeed.applyQuaternion(this.meshChild.rotation);
                }
            }
        }
    },
    Impact: function(hasHitTerrain) {

        if (this.impactDone) return;

        if (this.velocity.lengthSq() < 0.25) this.impactDone = true;

        //this.type.rotationSpeed.set(0,0,0);

        if (this.particle) {
            this.particle.removeNextTick = true;
            //this.particle = null;
        }

        if (this.type.destroyOnImpact) {
            this.lifeTime = 0;
        }

        if (!_.isUndefined(this.type.impactParticle)) {
            if (!(this.type.impactParticleOnUnitsOnly && hasHitTerrain)) {
                particleHandler.Add(this.type.impactParticle, {
                    position: this.position.clone()
                });
            }
        }

        if (!_.isUndefined(this.type.impactSound) && !this.damageDone) {
            soundHandler.Play(CheckForFunctionReturnValue(this.type.impactSound), this.position);
        }

    },
    CalculateFiringAngle: function(target, throwHigh) {

        throwHigh = throwHigh || false;

        var targetTransform = target.clone();
        var myTransform = this.position.clone();

        var y = targetTransform.y - myTransform.y;

        targetTransform.y = myTransform.y = 0;

        var x = targetTransform.sub(myTransform).length();

        var v = this.type.speed;
        var g = -gravity.y;

        var sqrt = (v * v * v * v) - (g * (g * (x * x) + 2 * y * (v * v)));

        // Not enough range

        var result;

        if (sqrt < 0) {
            result = Math.PI * 0.15;
        } else {
            sqrt = Math.sqrt(sqrt);

            // DirectFire chooses the low trajectory, otherwise high trajectory.


            if (!throwHigh) {
                result = Math.atan(((v * v) - sqrt) / (g * x));
            } else {
                result = Math.atan(((v * v) + sqrt) / (g * x));
            }

        }

        return result;
    }
});