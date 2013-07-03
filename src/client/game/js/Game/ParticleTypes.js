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


var ParticleFunctions = {
    OpacityLifeTime: function(p, begin, end) {
        var opac = (p.lifeTimer/p.lifeTime);
        if ( opac < begin ) return opac/begin;
        if ( opac > end ) return (1-opac)/(1-end);
        return 1.0;
    }
}

var ParticleTypeEnum = {
    TEST: {
        texture: function(){
            return ChooseRandom(['misc/heart_full','misc/heart_empty','misc/heart_half'])
        },
        delay: 0.0,

        // The amount of particles to spawn
        // -1 = infinite (default)
        count: -1,
        // The amount of time to spawn particles
        // -1 = infinite (default)
        lifeTime: -1,

        // Time between particle spawns
        particleDelay: 0.2,
        particleLifeTime: 5.0,
        particleStartPosition: new THREE.Vector3(),
        particleStartVelocity: function(){return new THREE.Vector3(getRandomFloat(-1, 1), 0, getRandomFloat(-1, 1))},
        particleSteeringForce: new THREE.Vector3(0, 1, 0),
        particleStartRotation: 0.0,
        particleRotationSpeed: 0.0,
        particleStartScale: new THREE.Vector2(1,1),
        particleScaleVelocity : new THREE.Vector2(0.0,0.0),
        particleOpacity: function(p){
            var opac = (p.lifeTimer/p.lifeTime)*2;
            if ( opac > 1 ) opac = 2 - opac;
            return opac;
        }
    },
    DAMAGE1: {
        texture: 'misc/heart_half_sub',
        delay: 0,

        // The amount of particles to spawn
        // -1 = infinite (default)
        count: 1,
        // The amount of time to spawn particles
        // -1 = infinite (default)
        lifeTime: -1,
        particleStartPosition: function(){return new THREE.Vector3(getRandomFloat(-0.3, 0.3), 0.5, getRandomFloat(-0.3, 0.3))},
        particleSteeringForce: new THREE.Vector3(0, 1, 0),
        particleStartVelocity: new THREE.Vector3(0, 2, 0),
        particleLifeTime: 2.0,
        particleStartScale: new THREE.Vector2(1,1),
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.0, 0.9);}
    },
    DAMAGE2: {
        texture: 'misc/heart_full_sub',
        delay: 0,

        // The amount of particles to spawn
        // -1 = infinite (default)
        count: 1,
        // The amount of time to spawn particles
        // -1 = infinite (default)
        lifeTime: -1,
        particleStartPosition: function(){return new THREE.Vector3(getRandomFloat(-0.3, 0.3), 0.5, getRandomFloat(-0.3, 0.3))},
        particleSteeringForce: new THREE.Vector3(0, 1, 0),
        particleStartVelocity: new THREE.Vector3(0, 2, 0),
        particleLifeTime: 3.0,
        particleStartScale: new THREE.Vector2(1,1),
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.0, 0.9);}
    },
    HEAL1: {
        texture: 'misc/heart_half_add',
        delay: 0,

        // The amount of particles to spawn
        // -1 = infinite (default)
        count: 1,
        // The amount of time to spawn particles
        // -1 = infinite (default)
        lifeTime: -1,
        particleStartPosition: function(){return new THREE.Vector3(getRandomFloat(-0.3, 0.3), 0.5, getRandomFloat(-0.3, 0.3))},
        particleSteeringForce: new THREE.Vector3(0, 1, 0),
        particleStartVelocity: new THREE.Vector3(0, 2, 0),
        particleLifeTime: 2.0,
        particleStartScale: new THREE.Vector2(1,1),
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.0, 0.9);}
    },
    HEAL2: {
        texture: 'misc/heart_full_add',
        delay: 0,

        // The amount of particles to spawn
        // -1 = infinite (default)
        count: 1,
        // The amount of time to spawn particles
        // -1 = infinite (default)
        lifeTime: -1,
        particleStartPosition: function(){return new THREE.Vector3(getRandomFloat(-0.3, 0.3), 0.5, getRandomFloat(-0.3, 0.3))},
        particleSteeringForce: new THREE.Vector3(0, 1, 0),
        particleStartVelocity: new THREE.Vector3(0, 2, 0),
        particleLifeTime: 3.0,
        particleStartScale: new THREE.Vector2(1,1),
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.0, 0.9);}
    },
    ARMORHIT1: {
        texture: 'misc/armor_half_sub',
        delay: 0,

        // The amount of particles to spawn
        // -1 = infinite (default)
        count: 1,
        // The amount of time to spawn particles
        // -1 = infinite (default)
        lifeTime: -1,
        particleStartPosition: function(){return new THREE.Vector3(getRandomFloat(-0.3, 0.3), 0.5, getRandomFloat(-0.3, 0.3))},
        particleSteeringForce: new THREE.Vector3(0, 1, 0),
        particleStartVelocity: new THREE.Vector3(0, 2, 0),
        particleLifeTime: 2.0,
        particleStartScale: new THREE.Vector2(1,1),
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.0, 0.9);}
    },
    ARMORHIT2: {
        texture: 'misc/armor_full_sub',
        delay: 0,

        // The amount of particles to spawn
        // -1 = infinite (default)
        count: 1,
        // The amount of time to spawn particles
        // -1 = infinite (default)
        lifeTime: -1,
        particleStartPosition: function(){return new THREE.Vector3(getRandomFloat(-0.3, 0.3), 0.5, getRandomFloat(-0.3, 0.3))},
        particleSteeringForce: new THREE.Vector3(0, 1, 0),
        particleStartVelocity: new THREE.Vector3(0, 2, 0),
        particleLifeTime: 3.0,
        particleStartScale: new THREE.Vector2(1,1),
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.0, 0.9);}
    },
    ARMORHEAL1: {
        texture: 'misc/armor_half_add',
        delay: 0,

        // The amount of particles to spawn
        // -1 = infinite (default)
        count: 1,
        // The amount of time to spawn particles
        // -1 = infinite (default)
        lifeTime: -1,
        particleStartPosition: function(){return new THREE.Vector3(getRandomFloat(-0.3, 0.3), 0.5, getRandomFloat(-0.3, 0.3))},
        particleSteeringForce: new THREE.Vector3(0, 1, 0),
        particleStartVelocity: new THREE.Vector3(0, 2, 0),
        particleLifeTime: 2.0,
        particleStartScale: new THREE.Vector2(1,1),
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.0, 0.9);}
    },
    ARMORHEAL2: {
        texture: 'misc/armor_full_add',
        delay: 0,

        // The amount of particles to spawn
        // -1 = infinite (default)
        count: 1,
        // The amount of time to spawn particles
        // -1 = infinite (default)
        lifeTime: -1,
        particleStartPosition: function(){return new THREE.Vector3(getRandomFloat(-0.3, 0.3), 0.5, getRandomFloat(-0.3, 0.3))},
        particleSteeringForce: new THREE.Vector3(0, 1, 0),
        particleStartVelocity: new THREE.Vector3(0, 2, 0),
        particleLifeTime: 3.0,
        particleStartScale: new THREE.Vector2(1,1),
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.0, 0.9);}
    },
    DEATH: {
        texture: function(emitter) {
            var options = emitter.followUnit.appearance;
            var cachefile = 'characters/cache/'+
            options.skin+
            '_'+options.eyes+
            '_'+options.hair+
            '_'+options.feet+
            '_'+options.body+
            '_'+options.head+
            '_0';
            return cachefile;
        },
        delay: 0,
        // The amount of particles to spawn
        // -1 = infinite (default)
        particleDelay: 0.01,
        count: 15,
        // The amount of time to spawn particles
        // -1 = infinite (default)
        particleStartPosition: function(){
            var v = GetRandomVector();

            v.multiplyScalar(0.1);

            v.y += 0.7;

            return v;
        },
        particleStartScale: new THREE.Vector2(0.2,0.2),
        particleStartVelocity: function(){
            var v = GetRandomVector();
            // v.y *= 0.1;
            v.y += 0.3;
            v.multiplyScalar(getRandomFloat(2,3.5));
            return v;
        },
        // particleRotationSpeed: function(p) {
        //     return p.lifeTimer*5 * (p.rotation > 0 ? 1 : -1);
        // },
        // particleStartRotation: function(p) { return (getRandomInt(-359,359)).ToRadians() },
        onTick: function(dTime, particle, emitter) {

            if ( !particle.changedUVs ) {

                particle.changedUVs = true;

                var numberOfSpritesH = 3 * 4;
                var numberOfSpritesV = 8 * 4;

                var amountU = (1/numberOfSpritesH);
                var amountV = (1/numberOfSpritesV);

                var indexH = emitter.followUnit.spriteStep;
                var indexV = emitter.followUnit.spriteIndex;

                indexH = getRandomInt(0, numberOfSpritesH-1);
                indexV = getRandomInt(0, numberOfSpritesV-1);

                indexV = numberOfSpritesV-indexV-1;

                particle.sprite.uvScale.x = amountU;
                particle.sprite.uvScale.y = amountV;

                particle.sprite.uvOffset.x = amountU * indexH;
                particle.sprite.uvOffset.y = amountV * indexV;

            }

        },
        lifeTime: -1,
        particleLifeTime: 1.0,
        particleEnableGravity: true,
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.0, 0.9);}
    },
    ENEMYINSIGHT: {
        texture: 'misc/em_red',
        delay: 0,
        // The amount of particles to spawn
        // -1 = infinite (default)
        count: 1,
        // The amount of time to spawn particles
        // -1 = infinite (default)
        particleStartPosition: function(){return new THREE.Vector3(0, 1.5, 0)},
        lifeTime: -1,
        particleLifeTime: 3.0,
        particleStartScale: new THREE.Vector2(1.5,1.5),
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.1, 0.9);}
    },
    ENEMYOUTOFSIGHT: {
        texture: 'misc/qm_green',
        delay: 0,
        // The amount of particles to spawn
        // -1 = infinite (default)
        count: 1,
        // The amount of time to spawn particles
        // -1 = infinite (default)
        particleStartPosition: function(){return new THREE.Vector3(0, 1.5, 0)},
        lifeTime: -1,
        particleLifeTime: 3.0,
        particleStartScale: new THREE.Vector2(1.5,1.5),
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.1, 0.9);}
    },
    SPLASH: {
        texture: function(){
            return ChooseRandom(['particles/splash1','particles/splash2','particles/splash3'])
        },
        delay: 0,
        // The amount of particles to spawn
        // -1 = infinite (default)
        count: 1,
        // The amount of time to spawn particles
        // -1 = infinite (default)
        particleStartPosition: function(){return new THREE.Vector3(0, 0.5, 0)},
        particleStartVelocity: function(){
            var angle = getRandomFloat(0,1) * Math.PI * 2;
            return new THREE.Vector3(Math.cos(angle)*getRandomFloat(0,1), getRandomFloat(0,2), Math.sin(angle)*getRandomFloat(0,1))
        },
        particleEnableGravity: true,
        lifeTime: -1,
        particleLifeTime: 2.0,
        particleStartScale: new THREE.Vector2(1.5,1.5),
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.1, 0.9);}
    },
    LAVABURN: {
        texture: function(){
            return ChooseRandom(['particles/flame1','particles/flame2','particles/flame3'])
        },
        delay: 0,
        // The amount of particles to spawn
        // -1 = infinite (default)
        count: 1,
        // The amount of time to spawn particles
        // -1 = infinite (default)
        particleStartPosition: function(){return new THREE.Vector3(0, 0.5, 0)},
        particleStartVelocity: function(){
            var angle = getRandomFloat(0,1) * Math.PI * 2;
            return new THREE.Vector3(Math.cos(angle)*getRandomFloat(0,1), getRandomFloat(0,2), Math.sin(angle)*getRandomFloat(0,1))
        },
        particleEnableGravity: true,
        lifeTime: -1,
        particleLifeTime: 2.0,
        particleStartScale: new THREE.Vector2(1.5,1.5),
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.1, 0.9);}
    },
    ACIDBALL: {
        texture: 'projectiles/acidball',
        delay: 0,
        // The amount of particles to spawn
        // -1 = infinite (default)
        count: 1,
        // The amount of time to spawn particles
        // -1 = infinite (default)
        particleStartPosition: function(){return new THREE.Vector3(0, 0.5, 0)},
        particleRotationSpeed: function(p) {
            return getRandomFloat(-5.0, 5.0);
        },
        particleStartRotation: function(p) { return (getRandomInt(-359,359)).ToRadians() },
        lifeTime: -1,
        particleLifeTime: 1.0,
        particleStartScale: new THREE.Vector2(1.5,1.5),
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.1, 0.9);}
    },
    SLIMEBALL: {
        texture: 'projectiles/acidball',
        delay: 0,
        // The amount of particles to spawn
        // -1 = infinite (default)
        count: 1,
        // The amount of time to spawn particles
        // -1 = infinite (default)
        particleStartPosition: function(){return new THREE.Vector3(0, 0.5, 0)},
        particleRotationSpeed: function(p) {
            return getRandomFloat(-1.0, 1.0);
        },
        particleStartRotation: function(p) { return (getRandomInt(-359,359)).ToRadians() },
        particleStartScale: new THREE.Vector2(2.5,2.5),
        particleLifeTime: 12.0
    },
    PLASMABALL: {
        texture: 'projectiles/plasmaball',
        delay: 0,
        // The amount of particles to spawn
        // -1 = infinite (default)
        count: 1,
        // The amount of time to spawn particles
        // -1 = infinite (default)
        particleStartPosition: function(){return new THREE.Vector3(0, 0.5, 0)},
        particleRotationSpeed: function(p) {
            return getRandomFloat(-5.0, 5.0);
        },
        particleStartRotation: function(p) { return (getRandomInt(-359,359)).ToRadians() },
        lifeTime: -1,
        particleLifeTime: 2.0,
        particleStartScale: new THREE.Vector2(2.0,2.0),
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.2, 0.8);}
    },
    FIREBALL: {
        texture: 'projectiles/fireball',
        delay: 0,
        // The amount of particles to spawn
        // -1 = infinite (default)
        count: 1,
        // The amount of time to spawn particles
        // -1 = infinite (default)
        particleStartPosition: function(){return new THREE.Vector3(0, 0.5, 0)},
        particleRotationSpeed: function(p) {
            return getRandomFloat(-5.0, 5.0);
        },
        particleStartRotation: function(p) { return (getRandomInt(-359,359)).ToRadians() },
        lifeTime: -1,
        particleLifeTime: 1.0,
        particleStartScale: new THREE.Vector2(2.0,2.0),
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.1, 0.9);},
        children:["FIREBALLTRAIL"]
    },
    FIREBALLTRAIL: {
        texture: 'projectiles/fireball',
        delay: 0,
        // The amount of particles to spawn
        // -1 = infinite (default)
        // The amount of time to spawn particles
        // -1 = infinite (default)
        count: -1,
        particleRotationSpeed: function(p) {
            return getRandomFloat(-5.0, 5.0);
        },
        particleStartRotation: function(p) { return (getRandomInt(-359,359)).ToRadians() },
        lifeTime: 1.0,
        particleLifeTime: 0.1,
        particleStartScale: new THREE.Vector2(2.0,2.0),
        particleScaleVelocity : new THREE.Vector2(-0.1,0.1),
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.1, 0.9);}
    },
    GREENBLOBIMPACT: {
        texture: function(){
            return ChooseRandom(['particles/greenBlob1','particles/greenBlob2','particles/greenBlob3'])
        },
        delay: 0,
        // The amount of particles to spawn
        // -1 = infinite (default)
        count: 5,
        // The amount of time to spawn particles
        // -1 = infinite (default)
        particleStartPosition: function(){return new THREE.Vector3(0, 0.5, 0)},
        particleStartVelocity: function(){
            var angle = getRandomFloat(0,1) * Math.PI * 2;
            return new THREE.Vector3(Math.cos(angle)*getRandomFloat(1,2), getRandomFloat(-1,2), Math.sin(angle)*getRandomFloat(1,2))
        },
        particleRotationSpeed: function(p) {
            return p.lifeTimer*5 * (p.rotation > 0 ? 1 : -1);
        },
        particleStartRotation: function(p) { return (getRandomInt(-359,359)).ToRadians() },
        particleDelay: 0.01,
        particleEnableGravity: true,
        lifeTime: -1,
        particleLifeTime: 2.0,
        particleStartScale: new THREE.Vector2(1.5,1.5),
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.1, 0.9);}
    },
	ROCK: {
        texture: 'projectiles/rock',
        delay: 0,
        // The amount of particles to spawn
        // -1 = infinite (default)
        count: 1,
        // The amount of time to spawn particles
        // -1 = infinite (default)
        particleStartPosition: function(){return new THREE.Vector3(0, 0.5, 0)},
        particleRotationSpeed: function(p) {
            return getRandomFloat(-5.0, 5.0);
        },
        particleStartRotation: function(p) { return (getRandomInt(-359,359)).ToRadians() },
        lifeTime: -1,
        particleLifeTime: 2.0,
        particleStartScale: new THREE.Vector2(1.0,1.0),
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.2, 0.8);}
	},
    ROCKSHATTER: {
        texture: function(){
            return ChooseRandom(['particles/rocksplatter1','particles/rocksplatter2','particles/rocksplatter3'])
        },
        delay: 0,
        // The amount of particles to spawn
        // -1 = infinite (default)
        count: 5,
        // The amount of time to spawn particles
        // -1 = infinite (default)
        particleStartPosition: function(){return new THREE.Vector3(0, 0.5, 0)},
        particleStartVelocity: function(){
            var angle = getRandomFloat(0,1) * Math.PI * 2;
            return new THREE.Vector3(Math.cos(angle)*getRandomFloat(1,2), getRandomFloat(-1,2), Math.sin(angle)*getRandomFloat(1,2))
        },
        particleRotationSpeed: function(p) {
            return p.lifeTimer*5 * (p.rotation > 0 ? 1 : -1);
        },
        particleStartRotation: function(p) { return (getRandomInt(-359,359)).ToRadians() },
        particleDelay: 0.01,
        particleEnableGravity: true,
        lifeTime: -1,
        particleLifeTime: 2.0,
        particleStartScale: new THREE.Vector2(1.5,1.5),
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.1, 0.9);}
    },
    MELEEHIT: {
        texture: function(){
            return ChooseRandom(['particles/hit1','particles/hit2','particles/hit3']);
        },
        delay: 0,
        // The amount of particles to spawn
        // -1 = infinite (default)
        count: 1,
        // The amount of time to spawn particles
        // -1 = infinite (default)
        particleStartPosition: function(){return new THREE.Vector3(0, 0.5, 0);},
        particleDelay: 0.25,
        lifeTime: -1,
        particleLifeTime: 0.15,
        particleStartScale: new THREE.Vector2(2.0,2.0)
        // particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.1, 0.9);}
    },
    CLOUD: {
        texture: function(){
            return ChooseRandom(['misc/cloud1','misc/cloud2','misc/cloud3'])
        },
        delay: 0,
        particleStartPosition: function(){
            var pos;
            if ( !ironbane.player ) {
                pos = new THREE.Vector3();
            }
            else {
                pos = ironbane.player.position.clone();
            }
            pos.x += getRandomFloat(-100, 100);
            pos.z += getRandomFloat(-100, 100);
            pos.y = GetZoneConfig('cloudLevel') + getRandomFloat(-5, 5);
            return pos;
        },
        particleStartVelocity: function(){return new THREE.Vector3(getRandomFloat(-1.0, 1.0), 0, getRandomFloat(-1.0, 1.0))},
        lifeTime: -1,
        particleLifeTime: 30.0,
        particleDelay: function() {
            return (2.0-parseFloat(GetZoneConfig('cloudDensity')).clamp(0.1, 2));
        },
        particleStartScale: function(p){
            var scale = getRandomFloat(3, 2);
            var tex = textureHandler.GetTexture('plugins/game/images/' + p.texture + '.png', true);
            return new THREE.Vector2((tex.image.width/16)*scale, (tex.image.height/16)*scale);
        },
        particleOpacity: function(p){return (ParticleFunctions.OpacityLifeTime(p, 0.02, 0.98))*0.5;}
    },
    TELEPORTENTRANCE: {
        texture: function(){
            return ChooseRandom(['particles/spark1','particles/spark2','particles/spark3'])
        },
        delay: 0,
        particleSpawnOffset: new THREE.Vector3(0, 0.5, 0),
        particleStartPosition: function(p){
            return GetRandomVector().multiplyScalar(1);
        },
        particleStartVelocity: function(p){
            return p.localStartPosition.clone().multiplyScalar(-2);
        },
        particleDelay: 0.05,
        lifeTime: -1,
        particleLifeTime: 0.3,
        particleStartScale: new THREE.Vector2(1.5,1.5),
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.1, 0.9);}
    },
    TELEPORTEXIT: {
        texture: function(){
            return ChooseRandom(['particles/spark1','particles/spark2','particles/spark3'])
        },
        delay: 0,
        particleSpawnOffset: new THREE.Vector3(0, 0.5, 0),
        particleStartPosition: function(p){
            return GetRandomVector().multiplyScalar(0.2);
        },
        particleStartVelocity: function(p){
            return p.localStartPosition.clone().multiplyScalar(4);
        },
        particleDelay: 0.05,
        lifeTime: -1,
        particleLifeTime: 0.3,
        particleStartScale: new THREE.Vector2(1.5,1.5),
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.1, 0.9);}
    },
    TELEPORTENTRANCECIRCLES: {
        texture: function(p){
            var index = Math.abs(p.count) % 2;
            return (['particles/circle1','particles/circle2'])[index];
        },
        delay: 0,
        particleSpawnOffset: new THREE.Vector3(0, 0.5, 0),
        particleDelay: 0.4,
        lifeTime: -1,
        particleLifeTime: 1.0,
        particleStartScale: new THREE.Vector2(2.5,2.5),
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.5, 0.5);},
        particleScaleVelocity : new THREE.Vector2(-0.05,-0.05)
    },
    TELEPORTEXITCIRCLES: {
        texture: function(p){
            var index = Math.abs(p.count) % 2;
            return (['particles/circle1','particles/circle2'])[index];
        },
        delay: 0,
        particleSpawnOffset: new THREE.Vector3(0, 0.5, 0),
        particleDelay: 0.4,
        lifeTime: -1,
        particleLifeTime: 1.0,
        particleStartScale: new THREE.Vector2(0.5,0.5),
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.5, 0.5);},
        particleScaleVelocity : new THREE.Vector2(0.05,0.05)
    },
    FIRESMALL: {
        texture: function(){
            return ChooseRandom(['particles/flameSmall1','particles/flameSmall2','particles/flameSmall3']);
        },
        particleSpawnOffset: new THREE.Vector3(0, 0.0, 0),
        particleStartPosition: function(p){
            return GetRandomVector().multiplyScalar(0.1).setY(0.0);
        },
        particleStartVelocity: function(p){
             return new THREE.Vector3(0, 0.4, 0);
        },
        particleStartScale: function() {
            return new THREE.Vector2(getRandomFloat(2.5, 3.0), getRandomFloat(2.5, 3.0));
        },
        // particleStartRotation: function(p) { return (getRandomInt(-10,10)).ToRadians() },
        particleDelay: 0.08,
        particleLifeTime: 0.5,
        particleScaleVelocity : function(p){
            return new THREE.Vector2(getRandomFloat(0.0, 0.03), getRandomFloat(0.0, 0.03));
        },
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.2, 0.8);}
    },
    HEALSPARKS: {
        texture: function(){
            return ChooseRandom(['particles/spark1','particles/spark2','particles/spark3'])+"_green";
        },
        delay: 0,
        count:10,
        particleSpawnOffset: new THREE.Vector3(0, 0.5, 0),
        particleStartPosition: function(p){
            return GetRandomVector().multiplyScalar(0.2);
        },
        particleStartVelocity: function(p){
            return p.localStartPosition.clone().multiplyScalar(4);
        },
        particleDelay: 0.05,
        particleLifeTime: 0.3,
        particleStartScale: new THREE.Vector2(1.5,1.5),
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.1, 0.9);}
    },
    HEALHEART: {
        texture: 'particles/healheart',
        delay: 0,
        particleSpawnOffset: new THREE.Vector3(0, 0.5, 0),
        particleStartPosition: function(p){
            return GetRandomVector().multiplyScalar(0.2).addSelf(new THREE.Vector3(0, 1.0, 0));
        },
        particleStartVelocity: function(p){
            return p.localStartPosition.clone().multiplyScalar(1.0);
        },
        particleDelay: 0.05,
        count:1,
        particleLifeTime: 1.0,
        particleStartScale: new THREE.Vector2(1.5,1.5),
        particleOpacity: function(p){return ParticleFunctions.OpacityLifeTime(p, 0.3, 0.7);}
    }
};
