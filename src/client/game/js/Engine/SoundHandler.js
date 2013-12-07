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

var SoundHandler = Class.extend({
    DEFAULT_VOLUME: 0.3,
    soundList: [{
            file: "music/maintheme.mp3",
            volume: 0.5,
            loops: 999,
            preload: gotFlashInstalled
        }, {
            file: "music/castle.mp3",
            volume: 0.5
        }, {
            file: "music/tutorial.mp3",
            volume: 0.5
        }, {
            file: "music/ironbane2.mp3",
            //preload: gotFlashInstalled
            volume: 0.5
        }, {
            file: "music/ironbane4.mp3",
            volume: 0.5
            //preload: gotFlashInstalled
        }, {
            file: "music/ironbane5.mp3",
            volume: 0.5,
            //preload: gotFlashInstalled
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
        },
           {
            file: "music/dissonantwaltz.ogg",
            volume: 0.5,
            loops: 999
        },

        "ui/click.mp3",
        "ui/blip.mp3",
        "ui sound/uisound1.mp3",

        {
            file: "misc/switch.wav",
            preload: gotFlashInstalled
        },

        {
            file: "misc/bag1.wav",
            preload: gotFlashInstalled
        },
        {
            file: "misc/bag2.wav",
            preload: gotFlashInstalled
        },
        {
            file: "misc/drop.ogg",
            preload: gotFlashInstalled
        },

        {
            file: "equip/equipsword1.wav",
            preload: gotFlashInstalled
        },
        {
            file: "equip/equipsword2.wav",
            preload: gotFlashInstalled
        },
        {
            file: "equip/equipsword3.wav",
            preload: gotFlashInstalled
        },
        {
            file: "equip/equip1.wav",
            preload: gotFlashInstalled
        },
        {
            file: "equip/equip2.wav",
            preload: gotFlashInstalled
        },

        "environment/splash1.wav",
        "environment/splash2.wav",

        {
            file: "battle/arrowhit1.wav",
            preload: gotFlashInstalled
        },
        {
            file: "battle/arrowhit2.wav",
            preload: gotFlashInstalled
        },
        {
            file: "battle/arrowhit3.wav",
            preload: gotFlashInstalled
        },

        {
            file: "battle/swing1.wav",
            preload: gotFlashInstalled
        },
        {
            file: "battle/swing2.wav",
            preload: gotFlashInstalled
        },
        {
            file: "battle/swing3.wav",
            preload: gotFlashInstalled
        },

        {
            file: "battle/hit1.wav",
            preload: gotFlashInstalled
        },
        {
            file: "battle/hit2.wav",
            preload: gotFlashInstalled
        },
        {
            file: "battle/hit3.wav",
            preload: gotFlashInstalled
        },

        {
            file: "battle/die1.wav",
            preload: gotFlashInstalled
        },
        {
            file: "battle/die2.wav",
            preload: gotFlashInstalled
        },
        {
            file: "battle/die3.wav",
            preload: gotFlashInstalled
        },

        {
            file: "battle/firestaff.wav",
            preload: gotFlashInstalled
        },
        {
            file: "battle/firearrow1.wav",
            preload: gotFlashInstalled
        },
        {
            file: "battle/firearrow2.wav",
            preload: gotFlashInstalled
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
            preload:gotFlashInstalled
        },

        "placeholder"
    ],
    sounds: {},
    loadedMainMenuMusic: !gotFlashInstalled,
    Init: function() {
        var self = this;

        // Start SoundManager2
        soundManager.setup({
            url: ironbane_root_directory + 'flash/',
            flashVersion: 9,
            useFlashBlock: false,
            preferFlash: false,
            onready: function() {
                // Ready to use; soundManager.createSound() etc. can now be called.
                self.Preload();
            }
        });
    },
    Preload: function() {

        // TODO: Add a list of all NPC sounds using unitTemplates
        // Check if the sounds exist and load em


        var self = this;
        _.each(self.soundList, function(sound) {
            if (!_.isObject(sound)) {
                sound = {
                    file: sound
                };
            }
            //30-6-2013: Ingmar: if sound.volume is undefined, get a fixed value
            sound.volume = (sound.volume !== undefined) ? sound.volume : self.DEFAULT_VOLUME;
            sound.loops = (sound.loops !== undefined) ? sound.loops : 1;
            var key = sound.file.substring(0, sound.file.length - 4);
            self.sounds[key] = {
                sound: soundManager.createSound({
                    id: key,
                    url: ironbane_root_directory + 'sound/' + sound.file,
                    autoLoad: !! sound.preload,
                    onload: function(success) {
                        if (success) {
                            self.OnLoad(key);
                        }
                    }
                }),
                loops: sound.loops,
                baseVolume: sound.volume
            };
        });
    },
    FadeOut: function(sound, time) {
        var self = this;

        this.PlayOnce(sound);

        var tween = new TWEEN.Tween({
            volume: 100
        })
            .to({
            volume: 0
        }, time)
            .onUpdate(function() {
            self.SetVolume(sound, this.volume);
        }).start();
    },

    SetVolume: function(sound, volume) {
        if(sound in this.sounds) {
            this.sounds[sound].sound.setVolume(volume);
        }
    },
    FadeIn: function(sound, time) {
        if(!(sound in this.sounds)) {
            return;
        }

        var self = this;
        this.PlayOnce(sound);

        var tween = new TWEEN.Tween({
            volume: 0
        })
            .to({
            volume: 100
        }, time)
            .onUpdate(function() {
            self.SetVolume(sound, this.volume);
        }).start();
    },
    OnLoad: function(sound) {
        if (sound === "music/maintheme") {
            this.loadedMainMenuMusic = true;
        }
    },
    PlayOnce: function(soundID, position) {
        if (!hudHandler.allowSound) {
            return;
        }
        if (this.getAllSounds(soundID).length === 0) {
            return;
        }
        if (this.sounds[soundID].sound.playState !== 0) {
            return;
        }

        this.Play(soundID, position);
    },
    getAllSounds: function(s) {
        var sounds = [];
        for (var loadedSound in this.sounds) {
            if (loadedSound.toLowerCase().indexOf(s.toLowerCase()) >= 0) {
                sounds.push(this.sounds[loadedSound]);
            }
        }
        return sounds;
    },
    Play: function(soundID, position) {
        if (!hudHandler.allowSound) {
            return;
        }
        var sounds = this.getAllSounds(soundID);
        if (sounds.length === 0) {
            //console.log("sound " + s + " not found");
            return;
        }
        var sound = _.sample(sounds);
        var distance = 0;

        if (position) {
            distance = terrainHandler.GetReferenceLocation().sub(position).length();
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
    },
    StopAll: function() {
        soundManager.stopAll();
    }
});

var soundHandler = new SoundHandler();
