# History

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