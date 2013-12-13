## TODO ##
- Add support for multiple platforms (doubly linked list, make a seperate PlatformList singleton class) [done]
- Add back gravity (need methods to check if on platform) [done]
- rewrite setOnGround [unnecessary as I can fix initial conditions]
- clean up unused classes/methods (ground, etc.)
- use requestAnimation method [done]
- move generateTerrain into PlatformList class [done]
- Do not update enemies offscreen [done]
- Remove platforms as they go offscreen to the left (unless reconsidering game) [done]
- At maximum gun angle you should still be able to shoot, only at that angle though [done]
- add support for multiple enemies [done]

### Technical ###
- Add spikes
- implement enemy and player death (enemies need not be removed from the linked list since they can just be removed after they are offscreen)
- Add other three enemies
- Add barrel roll (dodges fire + jump)
- Add HUD
- Add boss
- Add screens and ability to restart game
- tweak difficulty of platforms, enemies, and spikes for optimal gameplay
- optimizations (no floating point painting, read article)

### Design ###
- Sun sets as you are playing (more demons come out at night)
- sprites for deaths, spikes, platforms
- background

At this point, the basic wireframe running should be nearly complete

Guns + enemies:
- Possible Enemy types:
	+ Zombie (only walks on platform) [done]
	+ Centaur (on platform, jumps at you)
	+ Fire Demon (on platform, shoots fire)
	+ Air Demon (in sky, either shoots down at you or flies down to get you. It could also potentially follow you until you kill it)

## Issues ##
- Since collisions are checked with all possible platforms (given the x) if two platforms happen to have the same x coordinates (with one below the other) and the mob's y velocity is greater than the height of the platform, if it checks the other platform first, it will collide with that (putting the player in the middle of the other platform). This could be fixed by checking all platforms before moving the player and then checking the minimum x and y time values and using that to update the position. However, since in this context I do not think I will be having two platforms on top of one another, this should not be a problem. If necessary I will change this.
- In Linux, the canvas painting is a little blurry for a high speed. It looks fine in Windows though. Maybe optimizations will alleviate this.

## Remarks ##
- Presently, I have all of the platform collision and gravity in Mob.js. This is under the assumption that Mobs will be the only objects interacting with platforms. In the future, if the need arises, I may want to put this in Movable.
- Possibly change duck to barrel roll
- In the context of this game it is okay, but I would like to change the xOffset to reset periodically so we don't end up with large numbers for x/y coordinates. After a very very long time we could reach integer overflow. But I'm sure I'll end the game before that ;)
- Possibly add bullet boost
- Thoreau
