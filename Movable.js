function Movable(){
	/* 
	for my inheritance
	declare all properties on this (which are copied over)
	and declare all methods on prototype (which are shared)
	*/
	if(this == window){
		return new Movable();
	}
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	this.xVel = 0;
	this.yVel = 0;
	this.gravity = 0;
	this.onGround = false;
}

//default properties
Movable.prototype.collidingWith(movable){
	//returns true/false if colliding with other movable object
};

//updates gravity, checks for collision with ground
Movable.prototype.gravityUpdate = function(){
		var ground;
		if(xVel > 0){
			//add x velocity to 'to' parameter
			ground = GM.logic.getGround(this.x, this.x+this.width+this.xVel);
		}
		else{
			//add x velocity to 'from' parameter
			ground = GM.logic.getGround(this.x+this.xVel, this.x+this.width);
		}
		var cHeight = GM.logic.getCHeight();

		//check if about to hit ground xwise
		if(this.xVel > 0){
			//check right side
			//do I only have to check the last ground block?
			//we know that getGround will get the last block which x is moving to
			//or that the first block will be the block which x is moving to
			actualHeight = cHeight - ground[ground.length-1] * 10;
			if(this.y + this.height > actualHeight){
				//move up to just before the block they are about to hit
				this.x = (this.x + this.xVel + this.width) - ((this.x + this.xVel + this.width) % 10) - this.width;
				this.xVel = 0;
				//remove the last block from y checking, since it will not be moving there
				ground.splice(ground.length-1, 1);
			}
		}
		else if(xVel < 0){
			//check left side
			actualHeight = cHeight - ground[0] * 10;
			if(this.y + this.height > actualHeight){
				//move up to just before the block they are about to hit
				this.x = (this.x + this.xVel) + (10 - ((this.x + this.xVel) % 10));
				this.xVel = 0;
				//remove the last block from y checking, since it will not be moving there
				ground.splice(0, 1);
			}
		}	
		this.x += this.xVel;

		//see if about to hit ground or if off of ground
		var highest = 0; 
		for(var i = 0; i < ground.length; i++){
			if(ground[i] > highest){
				highest = ground[i];	
			}
		}
		var actualHeight = cHeight - highest * 10;

		if(this.onGround == false){
			if(this.yVel < terminalVelocity){
				//apply gravity
				this.yVel += this.gravity;
			}
		}
		//if the player is already on the ground, check if they are no longer on the ground by checking one pixel below them
		if(this.onGround && this.y + 1 + this.height < actualHeight){
			//no longer on ground
			this.yVel += this.gravity;
			this.onGround = false;
		}

		//else check if they are mid air and falling and about to hit the ground
		if(this.y + this.yVel + this.height > actualHeight){
			this.y = actualHeight - this.height;
			this.yVel = 0;
			this.onGround = true;
		}

		this.y += this.yVel;
	};