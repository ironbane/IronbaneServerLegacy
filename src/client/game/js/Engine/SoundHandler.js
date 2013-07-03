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
    DEFAULT_VOLUME : 0.3,
    soundList: {
        "theme": {
            file: "music/ib_theme.mp3",
            volume: 0.5,
            // volume:0,
            loops: 999,
            preload: true
        },

        "castle": {
            file: "music/castle.mp3",
            volume: 0.5,
            // volume:0,
            loops: 1
        },

        "tutorial": {
            file: "music/tutorial.mp3",
            volume: 0.5,
            // volume:0,
            loops: 1
        },

        "ib2": {
            file: "music/IRONBANE 2.mp3",
            preload: true,
            volume: 0.5,
            // volume:0,
            loops: 1
        },

        "ib4": {
            file: "music/IRONBANE 4.mp3",
            volume: 0.5,
            preload: true,
            // volume:0,
            loops: 1
        },

        "ib5": {
            file: "music/IRONBANE 5.mp3",
            volume: 0.5,
            preload: true,
            // volume:0,
            loops: 1
        },

         "ib6": {
            file: "music/IRONBANE 6.mp3",
            volume: 0.5,
            // volume:0,
            loops: 1
        },

         "ib7": {
            file: "music/IRONBANE 7.mp3",
            volume: 0.5,
            // volume:0,
            loops: 1
        },

         "ib8": {
            file: "music/IRONBANE 8.mp3",
            volume: 0.5,
            // volume:0,
            loops: 1
        },

         "ib10": {
            file: "music/IRONBANE 10.mp3",
            volume: 0.5,
            // volume:0,
            loops: 1
        },





        "underground": {
            file: "music/underground.mp3",
            volume: 0.5,
            // volume:0,
            loops: 1
        },

        "click": "ui/click.wav",

        "switch": "misc/switch.wav",
        "switch2": "misc/switch2.wav",
        "bag1": "misc/bag1.wav",
        "bag2": "misc/bag2.wav",
        "drop": "misc/drop.wav",
        "enterGame": "misc/enterGame.wav",


        "equipSword1": "equip/equipSword1.wav",
        "equipSword2": "equip/equipSword2.wav",
        "equipSword3": "equip/equipSword3.wav",
        "equip1": "equip/equip1.wav",
        "equip2": "equip/equip2.wav",

        "splash1": "environment/splash1.wav",
        "splash2": "environment/splash2.wav",

        "arrowHit1": "battle/arrowHit1.wav",
        "arrowHit2": "battle/arrowHit2.wav",
        "arrowHit3": "battle/arrowHit3.wav",

        "swing1": "battle/swing1.wav",
        "swing2": "battle/swing2.wav",
        "swing3": "battle/swing3.wav",

        "hit1": "battle/hit1.wav",
        "hit2": "battle/hit2.wav",
        "hit3": "battle/hit3.wav",

        "die1": "battle/die1.wav",
        "die2": "battle/die2.wav",
        "die3": "battle/die3.wav",

        //"mutant" : "die/mutant.wav",

        "fireStaff": "battle/fireStaff.wav",
        "fireArrow": "battle/fireArrow.wav",
        "fireArrow2" : "battle/fireArrow2.wav",

        // "jump1": "player/jump/Player_Jump_01.wav",
        // "jump2": "player/jump/Player_Jump_02.wav",
        // "jump3": "player/jump/Player_Jump_03.wav",
        // "jump4": "player/jump/Player_Jump_04.wav",
        // "jump5": "player/jump/Player_Jump_05.wav",

        "getItem": "player/GetItem/PLAYER_GET_ITEM_01.wav",
        "regenHealth": "player/RegenHealth/PLAYER_REGEN_HEALTH_03.wav",
        "getCoin1": "player/GetCoins/PLAYER_GET_COINS_01.wav",
        "getCoin2": "player/GetCoins/PLAYER_GET_COINS_01.wav",
        "getCoin3": "player/GetCoins/PLAYER_GET_COINS_01.wav",
        "takeDamage": "player/TakeDamage/PLAYER_TAKE_DAMAGE_03.wav",

        "greenSlime1": "NPCs/GreenSlime/01.wav",
        "greenSlime2": "NPCs/GreenSlime/02.wav",
        "greenSlime3": "NPCs/GreenSlime/03.wav",

        "fireLongbow": "Weapons/WEAPON_LONG_BOW_01.wav",
        "fireAcidstaff": "Weapons/WEAPON_ACID_STAFF_02.wav",

        "atmosDay": "Atmos/ATMOS_WORLD_DAY.wav",
        "atmosNight": "Atmos/ATMOS_WORLD_NIGHT.wav",

        "dirtFootStep1": "player/Footsteps/Dirt/01.wav",
        "dirtFootStep2": "player/Footsteps/Dirt/02.wav",
        "dirtFootStep3": "player/Footsteps/Dirt/03.wav",
        "dirtFootStep4": "player/Footsteps/Dirt/04.wav",
        "dirtFootStep5": "player/Footsteps/Dirt/05.wav",
        "dirtFootStep6": "player/Footsteps/Dirt/06.wav",
        "grassFootStep1": "player/Footsteps/Grass/01.wav",
        "grassFootStep2": "player/Footsteps/Grass/02.wav",
        "grassFootStep3": "player/Footsteps/Grass/03.wav",
        "grassFootStep4": "player/Footsteps/Grass/04.wav",
        "grassFootStep5": "player/Footsteps/Grass/05.wav",
        "grassFootStep6": "player/Footsteps/Grass/06.wav",
        "woodFootStep1": "player/Footsteps/Wood/01.wav",
        "woodFootStep2": "player/Footsteps/Wood/02.wav",
        "woodFootStep3": "player/Footsteps/Wood/03.wav",
        "woodFootStep4": "player/Footsteps/Wood/04.wav",
        "woodFootStep5": "player/Footsteps/Wood/05.wav",
        "woodFootStep6": "player/Footsteps/Wood/06.wav",
        "stoneFootStep1": "player/Footsteps/Stone/01.wav",
        "stoneFootStep2": "player/Footsteps/Stone/02.wav",
        "stoneFootStep3": "player/Footsteps/Stone/03.wav",
        "stoneFootStep4": "player/Footsteps/Stone/04.wav",
        "stoneFootStep5": "player/Footsteps/Stone/05.wav",
        "stoneFootStep6": "player/Footsteps/Stone/06.wav",
        "bubble1": "inventory/bubble1.wav",
        "bubble2": "inventory/bubble2.wav",
        "bubble3": "inventory/bubble3.wav",

        "IBfire": "NPCs/IRONBANE/Fireattack.wav",
        "IBbreath1": "NPCs/IRONBANE/breath1.wav",
        "IBbreath2": "NPCs/IRONBANE/breath2.wav",
        "IBgrowl": "NPCs/IRONBANE/growl3.wav",
        "IBattack": "NPCs/IRONBANE/attack2.wav",

        // "step1": "step/grass1.wav",
        // "step2": "step/grass2.wav",
        // "stepWater1": "step/water1.wav",
        // "stepWater2": "step/water2.wav",
        "jump": "fighter/jump.wav",
        "ratdie" : "npcs/rat/die",

        "deathb" : "monster/deathb.wav",
        "deathd" : "monster/deathd.wav",
        "deathe" : "monster/deathe.wav",
        "deathr" : "monster/deathr.wav",
        "deaths" : "monster/deaths.wav",
        "grunt1" : "monster/grunt1.wav",
        "grunt2" : "monster/grunt2.wav",

        "painb" : "monster/painb.wav",
        "paind" : "monster/paind.wav",
        "paine" : "monster/paine.wav",
        "painp" : "monster/painp.wav",
        "painr" : "monster/painr.wav",
        "pains" : "monster/pains.wav",

        "piggrunt1" : "monster/piggrunt1",
        "piggrunt2" : "monster/piggrunt2",

        //      "race": "battle/02_-_rage_racer.mp3",
        //      "splash": "battle/splash.ogg",

        "placeholder": "placeholder"
    },
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
            if(!_.isObject(sound)) {
                sound = {file: sound};
            }
            //30-6-2013: Ingmar: if sound.volume is undefined, get a fixed value
            sound.volume = (sound.volume !== undefined) ? sound.volume : self.DEFAULT_VOLUME;
            sound.loops = (sound.loops !== undefined) ? sound.loops : 1;
            var key = sound.file.substring(0, sound.file.length - 4);
            self.sounds[key] = soundManager.createSound({
                id: key,
                url: ironbane_root_directory + 'plugins/game/sound/' + sound.file,
                autoLoad: !!sound.preload,
                onload: function(success) {
                    if(success) {
                        self.OnLoad(key);
                    }
                }
            });
        });
    },
    FadeOut: function(sound, time) {
        var self = this;

        this.PlayOnce(sound);

        var tween = new TWEEN.Tween({volume: 100})
                .to({volume: 0}, time)
                .onUpdate(function() {
                    self.SetVolume(sound, this.volume);
                }).start();
    },

    findSoundBase: function(key) {
        var theSound = null;
        _.each(this.soundList, function(sound) {

            if(!_.isObject(sound)) {
                sound = {file: sound};
            }
            if(sound.file.toLowerCase().indexOf(key.toLowerCase()) >= 0) {
                theSound = sound;
            }
        });
        return theSound;

    },
    SetVolume: function(sound, volume) {
        var soundTemplate = this.findSoundBase(sound);
        if(soundTemplate === undefined) return;
     volume *= (soundTemplate.volume !== undefined) ? soundTemplate.volume : this.DEFAULT_VOLUME;
     var theSound = this.sounds[sound];
        theSound.setVolume(volume);
    },
    FadeIn: function(sound, time) {
        var self = this;
        this.PlayOnce(sound);

        var tween = new TWEEN.Tween({volume: 0})
                .to({volume: 100}, time)
                .onUpdate(function() {
                        self.SetVolume(sound, this.volume);
                }).start();
    },
    OnLoad: function(sound) {
        if (sound === "music/ib_theme") {
            this.loadedMainMenuMusic = true;
        }
    },
    PlayOnce: function(sound, position) {
        if (!hudHandler.allowSound) {
            return;
        }
        if(this.getAllSounds(sound).length === 0) {
            console.log("sound " + sound + " not found");
            return;
        }
        if (this.sounds[sound].playState !== 0) {
          return;
        }

        this.Play(sound, position);
    },
    getAllSounds: function(s) {
        var sounds = [];
        for(var loadedSound in this.sounds) {
            if(loadedSound.toLowerCase().indexOf(s.toLowerCase()) >= 0) {
                sounds.push(this.sounds[loadedSound]);
            }
        }
        return sounds;
    },
    Play: function(s, position) {
        if (!hudHandler.allowSound) {return;}
        var sounds = this.getAllSounds(s);
        if(sounds.length === 0) {
            console.log("sound " + s + " not found");
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
        sound.setVolume(volume);
        //soundManager.setPan(sound, 80);
        sound.play();
    },
    StopAll: function() {
        soundManager.stopAll();
    }
});

var soundHandler = new SoundHandler();
