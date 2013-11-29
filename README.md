## TODO ##
- Add support for multiple platforms (doubly linked list, make a seperate PlatformList singleton class) [done]
- Add back gravity (need methods to check if on platform) [done]
- rewrite setOnGround [unnecessary as I can fix initial conditions]
- clean up unused classes/methods (ground, etc.)
- use requestAnimation method
- move generateTerrain into PlatformList class [done]
- Add spikes on some platforms (which is why you need to do small jumps)
- Make the x movement more precise?
- Do not paint things offscreen
- Remove platforms as they go offscreen to the left (unless reconsidering game) [done]
- optimizations (no floating point painting, read article)
- Sun sets as you are playing (more demons come out at night)

At this point, the basic wireframe running should be nearly complete

Next: guns + enemies
## Issues ##
- Since collisions are checked with all possible platforms (given the x) if two platforms happen to have the same x coordinates (with one below the other) and the mob's y velocity is greater than the height of the platform, if it checks the other platform first, it will collide with that (putting the player in the middle of the other platform). This could be fixed by checking all platforms before moving the player and then checking the minimum x and y time values and using that to update the position. However, since in this context I do not think I will be having two platforms on top of one another, this should not be a problem. If necessary I will change this.

## Remarks ##
- Presently, I have all of the platform collision and gravity in Mob.js. This is under the assumption that Mobs will be the only objects interacting with platforms. In the future, if the need arises, I may want to put this in Movable.
- Possibly change duck to barrel roll