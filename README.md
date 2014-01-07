## About ##
This is a simple platformer game. You can play it [here](http://kevinalbs.com/demonHunter/). As of now it runs best in Chrome and Firefox. There are still issues and lag on Linux Chromium.

## TODO ##
- Add more map fragments, split up tree generation (possibly make world editor open source on it's own and make it more all-purpose)
- Add more sounds
- Clean up old code
- Add documentation
- Clean up readme

### Technical ###
- Add spikes [done]
- implement enemy and player death (enemies need not be removed from the linked list since they can just be removed after they are offscreen)
- Add other three enemies [done]
- Add multiple shots which end on collision [done]
- Add barrel roll (dodges fire + jump) [done]
- Add particles
- Add HUD
- Add boss
- Possibly add initial conditions to editor (e.g. some enemies start out running at you regardless of platform, others stay)
- Add screens and ability to restart game [dpne]
- tweak difficulty of platforms, enemies, and spikes for optimal gameplay
	+ I'm thinking my best plan of action is to continue trial-and-error to get basic difficulties of platforms THEN use hard coded patterns for more intricate designs which are placed randomly throughout the level
- optimizations (no floating point painting, read article)
- Have enemies move around when visible on platform (back and forth?, also so they can jump down on you possibly)
- Create world editor and hard code a lot of the level (platforms, enemies, and spikes) [done]
- Basics of enemy sprites [done]
- Create the map [done]
- Have enemies move around when visible on platform [done]
- Enemy death with height falling so bullets do not pass through until death completes [done]
- Player death and restarting [done]
- Add loading to builder [done]

### Design ###
- sprite for centaur [done], fire breather, flyer [done]
- trees and clouds in background
- sprites for deaths, spikes, platforms, pickups
- background [done]
- possible bg music http://opengameart.org/content/thrust-sequence

At this point, the basic wireframe running should be nearly complete

Guns + enemies:
- Possible Enemy types:
	+ Zombie (only walks on platform) [done]
	+ Centaur (on platform, jumps at you) [done]
	+ Fire Demon (on platform, shoots fire) [done]
	+ Air Demon (in sky, flies down and shoots fire from right to left. Also tries to ram into you (maybe). Stays in screen until you kill it) [done]

## Issues ##
- Since collisions are checked with all possible platforms (given the x) if two platforms happen to have the same x coordinates (with one below the other) and the mob's y velocity is greater than the height of the platform, if it checks the other platform first, it will collide with that (putting the player in the middle of the other platform). This could be fixed by checking all platforms before moving the player and then checking the minimum x and y time values and using that to update the position. However, since in this context I do not think I will be having two platforms on top of one another, this should not be a problem. If necessary I will change this.
- In Linux, the canvas painting is a little blurry for a high speed. It looks fine in Windows though. Maybe optimizations will alleviate this.
- There were problems with lag due to incorrect calculation of delta. There is still slight lag on linux but it's worth playing around with to try and minimize lag at the end.
- [fixed] Centaurs are removed before they are completely offscreen since their width is smaller than their painted body
- On restart, trees may be positioned slightly off. Cannot confirm right now and I don't care.
- Music is not looping

## Remarks ##
- Presently, I have all of the platform collision and gravity in Mob.js. This is under the assumption that Mobs will be the only objects interacting with platforms. In the future, if the need arises, I may want to put this in Movable.
- Possibly change duck to barrel roll
- In the context of this game it is okay, but I would like to change the xOffset to reset periodically so we don't end up with large numbers for x/y coordinates. After a very very long time we could reach integer overflow. But I'm sure I'll end the game before that ;)
- Possibly add bullet boost
- Thoreau


## Builder ##

### Todo ###
- possibly add autosaving