// replace old soundHandler
IronbaneApp
    .value('DEFAULT_VOLUME', 0.3)
    .value('MUSIC', [{
        file: "music/maintheme.mp3",
        volume: 0.5,
        loops: 999,
        preload: true
    }, {
        file: "music/castle.mp3",
        volume: 0.5
    }, {
        file: "music/tutorial.mp3",
        volume: 0.5
    }, {
        file: "music/ironbane2.mp3",
        //preload: true,
        volume: 0.5
    }, {
        file: "music/ironbane4.mp3",
        volume: 0.5
        //preload: true
    }, {
        file: "music/ironbane5.mp3",
        volume: 0.5,
        //preload: true,
        loops: 1
    }, {
        file: "music/ironbane6.mp3",
        volume: 0.5,
        loops: 1
    }, {
        file: "music/ironbane7.mp3",
        volume: 0.5,
        loops: 1
    }, {
        file: "music/ironbane8.mp3",
        volume: 0.5,
        loops: 1
    }, {
        file: "music/ironbane10.mp3",
        volume: 0.5,
        loops: 1
    }, {
        file: "music/underground.mp3",
        volume: 0.5,
        loops: 1
    }])
    .value('SOUND_EFFECTS', [
        "ui/click.mp3",
        "ui/blip.mp3",
        "ui sound/uisound1.mp3",

        {
            file: "misc/switch.wav",
            preload: true
        },

        {
            file: "misc/bag1.wav",
            preload: true
        },
        {
            file: "misc/bag2.wav",
            preload: true
        },
        {
            file: "misc/drop.ogg",
            preload: true
        },

        {
            file: "equip/equipsword1.wav",
            preload: true
        },
        {
            file: "equip/equipsword2.wav",
            preload: true
        },
        {
            file: "equip/equipsword3.wav",
            preload: true
        },
        {
            file: "equip/equip1.wav",
            preload: true
        },
        {
            file: "equip/equip2.wav",
            preload: true
        },

        "environment/splash1.wav",
        "environment/splash2.wav",

        {
            file: "battle/arrowhit1.wav",
            preload: true
        },
        {
            file: "battle/arrowhit2.wav",
            preload: true
        },
        {
            file: "battle/arrowhit3.wav",
            preload: true
        },

        {
            file: "battle/swing1.wav",
            preload: true
        },
        {
            file: "battle/swing2.wav",
            preload: true
        },
        {
            file: "battle/swing3.wav",
            preload: true
        },

        {
            file: "battle/hit1.wav",
            preload: true
        },
        {
            file: "battle/hit2.wav",
            preload: true
        },
        {
            file: "battle/hit3.wav",
            preload: true
        },

        {
            file: "battle/die1.wav",
            preload: true
        },
        {
            file: "battle/die2.wav",
            preload: true
        },
        {
            file: "battle/die3.wav",
            preload: true
        },

        {
            file: "battle/firestaff.wav",
            preload: true
        },
        {
            file: "battle/firearrow1.wav",
            preload: true
        },
        {
            file: "battle/firearrow2.wav",
            preload: true
        },

        "player/getcoin1.wav",
        "player/getcoin2.wav",
        "player/getitem1.wav",
        "player/getitem2.wav",
        "player/regenhealth.wav",

        // "weapons/weapon_long_bow_01.wav",
        // "weapons/weapon_acid_staff_02.wav",

        // "atmos/atmos_world_day.wav",
        // "atmos/atmos_world_night.wav",

        "footsteps/dirt1.wav",
        "footsteps/dirt2.wav",
        "footsteps/dirt3.wav",
        "footsteps/dirt4.wav",
        "footsteps/dirt5.wav",
        "footsteps/dirt6.wav",
        "footsteps/grass1.wav",
        "footsteps/grass2.wav",
        "footsteps/grass3.wav",
        "footsteps/grass4.wav",
        "footsteps/grass5.wav",
        "footsteps/grass6.wav",
        "footsteps/wood1.wav",
        "footsteps/wood2.wav",
        "footsteps/wood3.wav",
        "footsteps/wood4.wav",
        "footsteps/wood5.wav",
        "footsteps/wood6.wav",
        "footsteps/stone1.wav",
        "footsteps/stone2.wav",
        "footsteps/stone3.wav",
        "footsteps/stone4.wav",
        "footsteps/stone5.wav",
        "footsteps/stone6.wav",
        "inventory/bubble1.wav",
        "inventory/bubble2.wav",
        "inventory/bubble3.wav",

        "step/water1.wav",
        "step/water2.wav",

        {
            file: "fighter/jump.wav",
            preload:true
        }])
    .service('AudioManager', ['$window', 'DEFAULT_VOLUME', 'MUSIC', 'SOUND_EFFECTS', 'storage', function($window, DEFAULT_VOLUME, MUSIC, SOUND_EFFECTS, storage) {
        var manager = this;

        manager.loadedMainMenuMusic = false;

        var _sounds = {}; // internal sound cache

        var onLoad = function(sound) {
            if (sound === "music/maintheme") {
                manager.loadedMainMenuMusic = true;
            }
        };

        var preload = function() {
            // TODO: Add a list of all NPC sounds using unitTemplates
            // Check if the sounds exist and load em

            var soundList = MUSIC.concat(SOUND_EFFECTS);

            var self = this;
            _.each(soundList, function(sound) {
                if (!_.isObject(sound)) {
                    sound = {
                        file: sound
                    };
                }
                //30-6-2013: Ingmar: if sound.volume is undefined, get a fixed value
                sound.volume = (sound.volume !== undefined) ? sound.volume : DEFAULT_VOLUME;
                sound.loops = (sound.loops !== undefined) ? sound.loops : 1;
                var key = sound.file.substring(0, sound.file.length - 4);
                _sounds[key] = {
                    sound: $window.soundManager.createSound({
                        id: key,
                        url: ironbane_root_directory + 'sound/' + sound.file,
                        autoLoad: !! sound.preload,
                        onload: function(success) {
                            if (success) {
                                onLoad(key);
                            }
                        }
                    }),
                    loops: sound.loops,
                    baseVolume: sound.volume
                };
            });
        };

        // Start SoundManager2
        $window.soundManager.setup({
            url: ironbane_root_directory + 'flash/',
            flashVersion: 9,
            useFlashBlock: false,
            useHTML5Audio: true,
            preferFlash: false,
            onready: preload,
            defaultOptions: {
                // set global default volume for all sound objects
                volume: storage.get('volume.master') || DEFAULT_VOLUME
            }
        });

        //should not require any file type when useHTMLAudio is true
        //soundManager will freeze for the browser that does not use required file type
        //i.e. if .mp3 required is true, FF will freeze. if .ogg required, Safari will freeze
        $window.soundManager.audioFormats = {
            ogg: {
                type: ['audio/ogg; codecs=vorbis'],
                required: false
            },
            mp3: {
                type: ['audio/x-mpeg', 'audio/mpeg; codecs="mp3"', 'audio/mpeg', 'audio/mp3', 'audio/MPA', 'audio/mpa-robust'],
                required: false
            },
            mp4: { //needs to be defined for soundManager
                related: ['aac','m4a'], // additional formats under the MP4 container
                type: ['audio/mp4; codecs="mp4a.40.2"', 'audio/aac', 'audio/x-m4a', 'audio/MP4A-LATM', 'audio/mpeg4-generic'],
                required: false
            }
        };

        // public methods:

        // basic search the sound db
        this.getAllSounds = function(soundID) {
            if(!soundID) {return [];}

            return _.map(_sounds, function(value, key) {
                if(key.search(soundID) >= 0) {
                    return value;
                }
            });
        };

        // should return whether or not the play was successful for other methods
        this.play = function(soundID, position, once) {
            if (!storage.get('allowSound')) {
                return false;
            }

            var sounds = this.getAllSounds(soundID);
            if (sounds.length === 0) {
                //console.log("sound " + s + " not found");
                return false;
            }
            var sound = _.sample(sounds);

            // play once behavior, the random nature of the above might make this wonky
            if(once && sound.sound.playState !== 0) {
                return false;
            }

            var distance = 0;

            if (position) {
                distance = $window.terrainHandler.GetReferenceLocation().sub(position).length();
                distance = Math.pow(distance, 1);
            }

            //bm("distance: "+distance);

            var volume = distance / 20;
            volume = 1 - volume.clamp(0, 1);
            volume = volume * 100;
            volume = volume.clamp(0, 100);

            //this.SetVolume(s, volume);
            sound.sound.setVolume(volume);
            //soundManager.setPan(sound, 80);
            sound.sound.play();

            return true;
        };

        this.playOnce = function(soundID, position) {
            return this.play(soundID, position, true);
        };

        this.setVolume = function(sound, volume) {
            if(sound in _sounds) {
                _sounds[sound].sound.setVolume(volume);
            }
        };

        // just a pass thru
        this.stopAll = function() {
            $window.soundManager.stopAll();
        };

        this.fadeIn = function(sound, time) {
            var self = this;

            if(self.playOnce(sound)) {
                var tween = new $window.TWEEN.Tween({
                    volume: 0
                })
                .to({
                    volume: 100
                }, time)
                .onUpdate(function() {
                    self.setVolume(sound, this.volume);
                }).start();
            }
        };

        this.fadeOut = function(sound, time) {
            var self = this;

            if(self.playOnce(sound)) {
                var tween = new $window.TWEEN.Tween({
                    volume: 100
                })
                .to({
                    volume: 0
                }, time)
                .onUpdate(function() {
                    self.setVolume(sound, this.volume);
                }).start();
            }
        };

    }]);