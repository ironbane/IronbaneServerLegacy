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




var ParticleEmitter = Class.extend({
    Init: function (type, data) {

        this.followUnit = data.followUnit || null;
        this.particleFollowUnit = data.particleFollowUnit || null;

        this.position = data.position
          || (this.followUnit ? data.followUnit.position : null)
          || (new THREE.Vector3());

        this.spawnOffset = data.spawnOffset || new THREE.Vector3();
        this.originalSpawnOffset = this.spawnOffset.clone();

        this.type = type;
        this.data = data;

        this.delay = CheckForFunctionReturnValue(type.delay) || 0.0;
        this.particleDelay = CheckForFunctionReturnValue(type.particleDelay) || 1.0;
        this.count = CheckForFunctionReturnValue(type.count) || -1;

        // Used for keeping time between particle spawns
        this.spawnTimer = 0.0;
        this.spawnWaitTime = 0.0;
        this.lifeTime = CheckForFunctionReturnValue(type.lifeTime) || -1;
        this.lifeTimer = 0.0;

        // System with empty geometry (we add it later)
        // this.particleSystem = new THREE.ParticleSystem((new THREE.Geometry()), material);
        this.particles = [];

        // Optional: addiitonal emitters to spawn when spawning this one (e.g. trails for a fireball)
        this.children = CheckForFunctionReturnValue(type.children) || [];

        // this.particleSystem.sortParticles = true;

        // add it to the scene
        // ironbane.scene.add(this.particleSystem);

        this.removeNextTick = false;

    },
    AddParticle: function () {


        // Spawn children
        _.each(this.children, function(child) {
          if ( this.particleFollowUnit ) {
            particleHandler.Add(ParticleTypeEnum[child],
              {position:this.particleFollowUnit.position.clone()});
          }
          else {
            particleHandler.Add(ParticleTypeEnum[child],
              {position:this.position.clone()});
            }
        }, this);


        this.count--;

        //var particle = new THREE.Vertex(CheckForFunctionReturnValue(this.type.particleStartPosition).clone().add(this.position));
        var particle = {};

        particle.emitter = this;

        var spawnOffset = CheckForFunctionReturnValue(this.type.particleSpawnOffset, this);
        particle.spawnOffset = spawnOffset ? spawnOffset.clone() : new THREE.Vector3();

        // Also rotate the offset if attached to a unit
        if ( this.followUnit ) {
            this.spawnOffset.copy(this.originalSpawnOffset);
            this.spawnOffset.applyEuler(this.followUnit.rotation);
        }


        // Add spawnOffset unique to this instance
        particle.spawnOffset.add(this.spawnOffset);

        particle.localStartPosition = (CheckForFunctionReturnValue(this.type.particleStartPosition, this) || new THREE.Vector3());
        particle.startPosition = particle.localStartPosition.clone().add(this.position).add(particle.spawnOffset);
        particle.position = particle.startPosition.clone();

        particle.rotation = CheckForFunctionReturnValue(this.type.particleStartRotation, this) || 0.0;

        var texture = CheckForFunctionReturnValue(this.type.texture, this);
        particle.texture = texture;


        if ( this.particleFollowUnit ) {
            if ( this.particleFollowUnit.size > 2 ) {
                particle.scale.multiplyScalar(this.particleFollowUnit.size * 0.5);
            }
        }

        var texture = ironbane.textureHandler.getTexture('images/' + texture + '.png', true);

        var spriteMaterial = new THREE.SpriteMaterial({
            color: ColorEnum.WHITE,
            map: texture,
            useScreenCoordinates: false,
            transparent: true
            //alphaTest: 0.5
        });



        particle.velocity = (CheckForFunctionReturnValue(this.type.particleStartVelocity, particle) || new THREE.Vector3()).clone();

        particle.mass = CheckForFunctionReturnValue(this.type.particleMass, this) || 1.0;
        particle.heading = new THREE.Vector3();
        particle.side = new THREE.Vector3();
        particle.maxSpeed = CheckForFunctionReturnValue(this.type.particleMaxSpeed, this) || 5.0;
        particle.maxForce = CheckForFunctionReturnValue(this.type.particleMaxForce, this) || 10.0;
        particle.maxTurnRate = CheckForFunctionReturnValue(this.type.particleMaxTurnRate, this) || 0.5;
        particle.enableGravity = CheckForFunctionReturnValue(this.type.particleEnableGravity, this) || false;

        if ( this.particleFollowUnit ) {
            //particle.followUnitPosition = particle.position.clone();
        }

        particle.particleRotationSpeed = CheckForFunctionReturnValue(this.type.particleRotationSpeed, this) || 0.0;
        particle.lifeTime = CheckForFunctionReturnValue(this.type.particleLifeTime, this) || 5.0;
        particle.lifeTimer = 0.0;

        particle.particleScaleVelocity = (CheckForFunctionReturnValue(this.type.particleScaleVelocity, this) || new THREE.Vector2()).clone();


        particle.sprite = new THREE.Sprite(spriteMaterial);

        particle.sprite.scale = (CheckForFunctionReturnValue(this.type.particleStartScale, particle) || new THREE.Vector2(1.0, 1.0)).clone().multiplyScalar(0.02);

        // Deliberately take twice the width so the images are scaled correctly
        particle.sprite.scale.x *= spriteMaterial.map.image.width;
        particle.sprite.scale.y *= spriteMaterial.map.image.width;

        particle.sprite.material.opacity = 0;

        // particle.sprite.scale = particle.scale;
        // particle.sprite.scale = 0;

        particle.sprite.rotation = particle.rotation;

        // this.particleSystem.geometry.vertices.push(particle);
        // add it to the geometry
        this.particles.push(particle);

        ironbane.scene.add(particle.sprite);

    },
    Destroy: function () {

        for ( var p=0;p<this.particles.length;p++ ) {
            if ( this.particles[p] ) {
                ironbane.scene.remove(this.particles[p].sprite);
                releaseMesh(this.particles[p].sprite);
            }
        }

    // ironbane.scene.remove(this.particleSystem);

    },
    tick: function (dTime) {


        // Keep aligned with our followUnit if we have one
        // Not nessecary because it already points to the same vector at Init
        // if ( this.followUnit ) {
        // this.position = this.followUnit.position;
        // }

        // Destroy if we run out of time
        this.lifeTimer += dTime;

        if ((this.lifeTimer > this.lifeTime && this.lifeTime >= 0) ||
            (this.count === 0 && this.particles.length === 0)) {
            this.removeNextTick = true;
        }


        this.spawnTimer += dTime;

        if ( this.delay > 0 ) this.delay -= dTime;

        if (this.spawnTimer > this.spawnWaitTime && this.count !== 0 && this.delay <= 0) {
            this.spawnTimer = 0.0;

            // Set a new timelimit depending on the delay spawn time (which can be random)
            this.spawnWaitTime = CheckForFunctionReturnValue(this.type.particleDelay, this) || 1.0;

            // And add a particle
            this.AddParticle();
        }

        //debug.setWatch('Particles spawned', this.particles.length);

        //for (var i = 0; i < this.particleSystem.geometry.vertices.length; ++i) {
        for (var i = 0; i < this.particles.length; ++i) {
            // get the particle
            //var particle = this.particleSystem.geometry.vertices[i];
            var particle = this.particles[i];

            var steeringForce = (CheckForFunctionReturnValue(this.type.particleSteeringForce, particle) || new THREE.Vector3()).clone();

            var acceleration = steeringForce.multiplyScalar(particle.mass);
            particle.velocity.add(acceleration.multiplyScalar(dTime));
            particle.velocity.Truncate(particle.maxSpeed);


            if ( particle.enableGravity ) {
                particle.velocity.add(gravity.clone().multiplyScalar(dTime));
            }

            if (particle.velocity.length() > 0.01) {
                particle.heading = particle.velocity.clone().normalize();
                particle.side = particle.heading.clone().Perp();
            }

            if ( this.particleFollowUnit ) {
                //particle.followUnitPosition.add(particle.velocity.clone().multiplyScalar(dTime));
                particle.position = this.particleFollowUnit.position.clone().add(particle.startPosition);
            }
            else {
                particle.position.add(particle.velocity.clone().multiplyScalar(dTime));
            }

            if ( _.isUndefined(particle.opacityHack) ) {
                particle.opacityHack = true;
            }
            else {
                //particle.sprite.scale = particle.scale.clone();
                particle.sprite.scale.add(particle.particleScaleVelocity.clone().multiplyScalar(dTime));
            }

            var opac = CheckForFunctionReturnValue(this.type.particleOpacity, particle);
            particle.sprite.material.opacity = opac === undefined ? 1.0 : opac;



            particle.sprite.rotation += particle.particleRotationSpeed * dTime;

            // Update mesh
            particle.sprite.position = particle.position.clone();

            particle.lifeTimer += dTime;
            if (particle.lifeTimer > particle.lifeTime ) {
                //this.particleSystem.geometry.vertices.splice(i--, 1);
                this.particles.splice(i--, 1);
                ironbane.scene.remove(particle.sprite);

                releaseMesh(particle.sprite, {
                    removeMaterials: true
                });

                continue;
            }


            var onTick = !_.isUndefined(this.type.onTick) ? this.type.onTick : null;

            if ( onTick ) onTick(dTime, particle, this);

        }

    }
});
