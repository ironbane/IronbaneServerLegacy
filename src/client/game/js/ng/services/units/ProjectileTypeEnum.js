
IronbaneApp.service("ProjectileTypeEnum", ["ParticleTypeEnum", function(ParticleTypeEnum) {
    this.FIREBALL = {
        speed: 15,
        lifeTime: 1,
        has8Textures: false,
        parabolic: false,
        destroyOnImpact: true,
        particle: ParticleTypeEnum.FIREBALL
    };
    this.PLASMABALL= {
        speed: 8,
        lifeTime: 2,
        has8Textures: false,
        parabolic: false,
        destroyOnImpact: true,
        particle: ParticleTypeEnum.PLASMABALL
    };
    this.SNOWFLAKE = {
        speed: 8,
        lifeTime: 2,
        has8Textures: false,
        parabolic: false,
        destroyOnImpact: true,
        particle: ParticleTypeEnum.SNOWFLAKE
    };
    this.SLIMEBALL = {
        speed: 4,
        lifeTime: 12,
        has8Textures: false,
        parabolic: false,
        destroyOnImpact: true,
        impactParticle: ParticleTypeEnum.GREENBLOBIMPACT,
        particle: ParticleTypeEnum.SLIMEBALL
    };
    // HEALBALL = {
    //     speed: 8,
    //     lifeTime: 2,
    //     has8Textures: false,
    //     parabolic: false,
    //     destroyOnImpact: true,
    //     particle: ParticleTypeEnum.HEALBALL
    // },
    this.ACIDBALL = {
        speed: 15,
        lifeTime: 1,
        has8Textures: false,
        parabolic: false,
        destroyOnImpact: true,
        impactParticle: ParticleTypeEnum.GREENBLOBIMPACT,
        particle: ParticleTypeEnum.ACIDBALL
    };
    this.ROCK = {
        speed: 10,
        lifeTime: 8,
        has8Textures: false,
        parabolic: true,
        destroyOnImpact: true,
        impactParticle: ParticleTypeEnum.ROCKSHATTER,
        particle: ParticleTypeEnum.ROCK
    };
    this.SNOWBALL = {
        speed: 10,
        lifeTime: 8,
        has8Textures: false,
        parabolic: true,
        destroyOnImpact: true,
        impactParticle: ParticleTypeEnum.SNOWBALLSPLATTER,
        particle: ParticleTypeEnum.SNOWBALL
    };
    this.ARROW = {
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
    };
    this.MELEE = {
        speed: 6,
        lifeTime: 0.5,
        parabolic: true,
        meshType: ProjectileMeshTypeEnum.MELEE,
        // particle: ParticleTypeEnum.ACIDBALL,
        impactParticle: ParticleTypeEnum.MELEEHIT,
        destroyOnImpact: true,
        impactParticleOnUnitsOnly: true
        // impactSound: function(){return ChooseRandom(["arrowHit1","arrowHit2","arrowHit3"])}
    };
    this.BONE = {
        speed: 18,
        lifeTime: 8,
        parabolic: true,
        meshType: ProjectileMeshTypeEnum.BONE,
        rotationSpeed: new THREE.Vector3(10, 0, 0),
        texture: {
            FULL: 'images/projectiles/bone.png',
            BONEHEAD: 'images/projectiles/bonehead.png'
        }
    };
    this.POWERBALL = {
        speed: 15,
        lifeTime: 1,
        has8Textures: false,
        parabolic: false,
        destroyOnImpact: true,
        particle: ParticleTypeEnum.POWERBALL
    };
}]);