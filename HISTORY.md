# History

# 0.4.2 - 28/10/2013
##Chat

- Improved swearing filter
= Added a channel system. Usage: /join [room] and /leave [room]
- Added private messaging: Usage: @[user] [message]

##Game

- Improved world terrain

##Bug fixes

- Fixed lag when having a lot of projectiles on the screen
- Fixed some NPC's being naked
- You can no longer chat empty messages
- You can no longer register the same username

# 0.4 - 06/10/2013 
##Chat

- The swearfilter now also works on the chat bubbles
- Added /stuck command

#Game

- Added zeppelins
- Added civilians
- Added a lot of new models
- Added basic aggro system
- Improved and more detailed zones
- Improved pathfinding for NPC's
- Turrets now have an appearance
- Improved lighting and atmosphere
- You can now aim directly on NPC's (before you had to aim at the ground they were standing on)

##Interface

- Creating a new character now randomizes the appearance

##Bug fixes

- Fixed IB not working on Firefox and Linux
- Holding the jump key now correctly makes the player jump repeatedly
- Falling through the world is now less likely to happen
- Fixed "ghost mode"
- Arrows and bows now play the correct sounds
- Fixed buggy jumping in water
- Fixed turrets sometimes not shooting at players
- Fixed player names in chat having wrong colors
- Server now auto-restarts every 24 hours to prevent file-reading errors
- Fixed buttons in the main menu causing layout issues
- Character customization buttons now work more properly
- You can no longer get stuck in objects
- Fixed main menu view being different after already having played
- Standing on moving objects is now less buggy

##For developers

- We've updated the README on GitHub for the latest details concerning installation.

# 0.3 - 20/08/2013
##Chat

- Added a basic swearing filter.

## Game

- The first tutorial chest now has a tutorial graphic explaining what to do. 
- Player movement now has more friction. 
- NPC's now attack from a slightly closer range.

## Interface

- Added (funny) loading messages. Feel free to post new ones if you feel creative.
- Trying to login with a false username or password now clears the password field. 
- Due to an unfinished new authentification system, logging in or registering a new account needs to refresh the page. This is temporary and we will address this issue shortly.

## Bug fixes

- NPC's no longer stop respawning after a while. 
- Water splash and jump sounds no longer play repeatedly. 
- Items no longer randomly disappear from the inventory bar when moving them around. 
- Monster weapons no longer play the wrong sounds 
- Arrows that hit the ground no longer repeatedly play the impact sound in an annoying way. 
- Changed the arrow symbols on the character selection screen to resolve a weird spacing issue on mac. 
- Lava no longer looks dark at night. 
- Water and lava no longer have a weird stretch texture sometimes. 
- Trees and other large objects now have shadows again. 
- NPC's in the distance no longer rapidly bounce up and down.

## 0.1.6

- Fixed sprites showing black
- Fixed some lighting artifacts on models
- Fixed most transparency issues with models
- Fixed guests not being able to play again after being killed
- Changed weapon range of melee weapons
- Editor: Added grid snapping (by default enabled)
- Editor: Rotation of models now auto snap to 5 degrees
- Editor: Added option to ignore the bounding box of the adjacent model
- Editor: Fixed models snapping to bad angles when rotating backwards
- Editor: Fixed models not being deleted sometimes
- Editor: Fixed models still having an invisible collision box when deleted
- Editor: Models now have a 'transparent' field in the database

## 0.1.5

- Improved loading transitions
- Added new dying animations
- Fixed some caching issues with character selection screen
- Fixed some tiles looking strange from far away
- All melee attacks now use projectiles (experimental)
- Changed aiming icons (experimental)
- Projectiles can no longer hit friendly targets
- Editor: Models can now be categorized

## 0.1.4

- Added artificial lighting
- Aiming icon now changes when you just fired your weapon
- Vendors now restock their original inventory after 5 minutes
- Editor: Enabling no longer requires refreshing the page
- Editor: Added coins cheat
- Editor: Added ForceNight cheat
- Editor: Added slider to change the time of the day
- Editor: Removed mpHeightOffset from Model Placer
- Editor: Model placer now places models correctly onto other models

## 0.1.3

- Added theme music
- Added button to toggle sound
- Added permadeath
- Monsters that don't carry a weapon now "dash" into the enemy
- Reduced attack angle from 180 to 120 degrees
- Shift-key now allows you to walk slower and rotate faster
- Disabled PvP
- Fixed weapons not scaling when a monster was scaled
- Fixed NPC's not showing eyes
- Fixed some armor not being shown on the player
- Editor: Added item giving cheat

## 0.1.2

- Added more customization to characters
- You can now use your weapon even when out of range
- Reduced melee weapon range by 40%
- Fixed armor images showing up wrong
- Fixed fire staff not working
- Fixed crucial bug where players would not see others after just being killed
- Fixed (most) transparent issues with models
- Fixed NPC's "bugging" when standing on the same spot
- Editor: Added backup feature
- Editor: Added Speed Cheat
- Editor: Added 4x Paint Mode (experimental)
- Editor: World Painter now loads first category by default, not the last

## 0.1.1

- Fixed distant holes in terrain
- Fixed camera sometimes staying stuck in first person view
- Fixed enemies not attacking when you sneak behind them
- Updated home screen
- Updated forum look

## 0.0.8 - First Alpha Release

- Server now auto-restarts on crash
- Increased terrain loading speed by 300%
- Added loading bar
- You can now hold the mouse button for all editor functions
- Fixed game losing focus right after logging in
- Fixed gameobjects sometimes not showing up
- Added items
- Added item/action/equipment hotbar
- Added loot bags
- Implemented drag and drop for the action bar and loot bag
- Added wearable equipment (helmets, body armor and boots)
- You can now press keys 1-9 to use the action bar
- You can now equip different weapons/equipment
- Added bows and arrows
- Added acid & fireballs
- Added water
- Added clouds
