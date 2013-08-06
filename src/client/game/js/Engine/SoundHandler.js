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
            file: "music/ib_theme.mp3",
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
            preload: true,
            volume: 0.5
        }, {
            file: "music/ironbane4.mp3",
            volume: 0.5,
            preload: true
        }, {
            file: "music/ironbane5.mp3",
            volume: 0.5,
            preload: true,
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
        "ui/click.mp3",
        "ui/blip.mp3",
        "ui sound/uisound1.mp3",

        "misc/switch.wav",
        "misc/switch2.wav",
        "misc/bag1.wav",
        "misc/bag2.wav",
        "misc/drop.wav",
        "misc/enterGame.wav",


        "equip/equipSword1.wav",
        "equip/equipSword2.wav",
        "equip/equipSword3.wav",
        "equip/equip1.wav",
        "equip/equip2.wav",

        "environment/splash1.wav",
        "environment/splash2.wav",

        "battle/arrowHit1.wav",
        "battle/arrowHit2.wav",
        "battle/arrowHit3.wav",

        "battle/swing1.wav",
        "battle/swing2.wav",
        "battle/swing3.wav",

        "battle/hit1.wav",
        "battle/hit2.wav",
        "battle/hit3.wav",

        "battle/die1.wav",
        "battle/die2.wav",
        "battle/die3.wav",

        //"mutant" : "die/mutant.wav",

        "battle/fireStaff.wav",
        "battle/fireArrow.wav",
        "battle/fireArrow2.wav",

        // "jump1": "player/jump/Player_Jump_01.wav",
        // "jump2": "player/jump/Player_Jump_02.wav",
        // "jump3": "player/jump/Player_Jump_03.wav",
        // "jump4": "player/jump/Player_Jump_04.wav",
        // "jump5": "player/jump/Player_Jump_05.wav",

        "player/GetItem/PLAYER_GET_ITEM_01.wav",
        "player/RegenHealth/PLAYER_REGEN_HEALTH_03.wav",
        "player/GetCoins/PLAYER_GET_COINS_01.wav",
        "player/GetCoins/PLAYER_GET_COINS_01.wav",
        "player/GetCoins/PLAYER_GET_COINS_01.wav",
        "player/TakeDamage/PLAYER_TAKE_DAMAGE_03.wav",

        "NPCs/GreenSlime/01.wav",
        "NPCs/GreenSlime/02.wav",
        "NPCs/GreenSlime/03.wav",

        "Weapons/WEAPON_LONG_BOW_01.wav",
        "Weapons/WEAPON_ACID_STAFF_02.wav",

        "Atmos/ATMOS_WORLD_DAY.wav",
        "Atmos/ATMOS_WORLD_NIGHT.wav",

        "footsteps/Dirt1.wav",
        "footsteps/Dirt2.wav",
        "footsteps/Dirt3.wav",
        "footsteps/Dirt4.wav",
        "footsteps/Dirt5.wav",
        "footsteps/Dirt6.wav",
        "footsteps/Grass1.wav",
        "footsteps/Grass2.wav",
        "footsteps/Grass3.wav",
        "footsteps/Grass4.wav",
        "footsteps/Grass5.wav",
        "footsteps/Grass6.wav",
        "footsteps/Wood1.wav",
        "footsteps/Wood2.wav",
        "footsteps/Wood3.wav",
        "footsteps/Wood4.wav",
        "footsteps/Wood5.wav",
        "footsteps/Wood6.wav",
        "footsteps/Stone1.wav",
        "footsteps/Stone2.wav",
        "footsteps/Stone3.wav",
        "footsteps/Stone4.wav",
        "footsteps/Stone5.wav",
        "footsteps/Stone6.wav",
        "inventory/bubble1.wav",
        "inventory/bubble2.wav",
        "inventory/bubble3.wav",

        "NPCs/ironbane/Fireattack.wav",
        "NPCs/ironbane/breath1.wav",
        "NPCs/ironbane/breath2.wav",
        "NPCs/ironbane/growl3.wav",
        "NPCs/ironbane/attack2.wav",

        // "step1": "step/grass1.wav",
        // "step2": "step/grass2.wav",
        "step/water1.wav",
        "step/water2.wav",

        {
            file: "fighter/jump.wav",
            preload:true
        },


        "npcs/rat/die",

        "monster/deathb.wav",
        "monster/deathd.wav",
        "monster/deathe.wav",
        "monster/deathr.wav",
        "monster/deaths.wav",
        "monster/grunt1.wav",
        "monster/grunt2.wav",

        "monster/painb.wav",
        "monster/paind.wav",
        "monster/paine.wav",
        "monster/painp.wav",
        "monster/painr.wav",
        "monster/pains.wav",

        "monster/piggrunt1",
        "monster/piggrunt2",

        //      "race": "battle/02_-_rage_racer.mp3",
        //      "splash": "battle/splash.ogg",

        "placeholder"
    ],
    sounds: {},
    loadedMainMenuMusic: false,
    Init: function() {
        var self = this;

        // Start SoundManager2
        soundManager.setup({
            url: ironbane_root_directory + 'plugins/game/flash/',
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
                    url: ironbane_root_directory + 'plugins/game/sound/' + sound.file,
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
        if (sound === "music/ib_theme") {
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
        var sound = ChooseRandom(sounds);
        var distance = 0;

        if (position) {
            distance = terrainHandler.GetReferenceLocation().subSelf(position).length();
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