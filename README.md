## Highest Priority ##
- Create world editor and hard code a lot of the level (platforms, enemies, and spikes)
- Basics of enemy sprites [done]
- Create the map
- Have enemies move around when visible on platform
- Enemy death with height falling so bullets do not pass through until death completes
- Player death and restarting
- Add loading to builder

## TODO ##

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

### Design ###
- sprite for centaur [done], fire breather, flyer
- trees and clouds in background
- sprites for deaths, spikes, platforms
- bullets are now limited
- background
- change shirt color

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
- Centaurs are removed before they are completely offscreen since their width is smaller than their painted body

## Remarks ##
- Presently, I have all of the platform collision and gravity in Mob.js. This is under the assumption that Mobs will be the only objects interacting with platforms. In the future, if the need arises, I may want to put this in Movable.
- Possibly change duck to barrel roll
- In the context of this game it is okay, but I would like to change the xOffset to reset periodically so we don't end up with large numbers for x/y coordinates. After a very very long time we could reach integer overflow. But I'm sure I'll end the game before that ;)
- Possibly add bullet boost
- Thoreau


## Builder ##

### Todo ###
- possibly add autosaving