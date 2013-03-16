function playerMob(){
	var that = {};
	var x = 0, 
		y = 0, 
		xVel = 0,
		yVel = 3,
		width = 22, 
		height = 60;
	var xSpeed = 5;
	var jumpSpeed = -9;
	var onGround = true;
	var gravity = .75;
	var terminalVelocity = 9;
	that.getX = function(){return x;}
	that.getY = function(){return y;}
	that.update = function(){
		that.updateMovement();
	};
	//gives gravity, checks for collisions with ground
	that.updateMovement = function(){
		var ground;
		if(xVel > 0){
			//add x velocity to 'to' parameter
			ground = GM.logic.getGround(x, x+width+xVel);
		}
		else{
			//add x velocity to 'from' parameter
			ground = GM.logic.getGround(x+xVel, x+width);
		}
		var cHeight = GM.logic.getCHeight();

		//check if about to hit ground xwise
		if(xVel > 0){
			//check right side
			//do I only have to check the last ground block?
			//we know that getGround will get the last block which x is moving to
			//or that the first block will be the block which x is moving to
			actualHeight = cHeight - ground[ground.length-1] * 10;
			if(y + height > actualHeight){
				//move up to just before the block they are about to hit
				x = (x + xVel + width) - ((x + xVel + width) % 10) - width;
				xVel = 0;
				//remove the last block from y checking, since it will not be moving there
				ground.splice(ground.length-1, 1);
			}
		}
		else if(xVel < 0){
			//check left side
			actualHeight = cHeight - ground[0] * 10;
			if(y + height > actualHeight){
				//move up to just before the block they are about to hit
				x = (x + xVel) + (10 - ((x + xVel) % 10));
				xVel = 0;
				//remove the last block from y checking, since it will not be moving there
				ground.splice(0, 1);
			}
		}	
		x += xVel;

		//see if about to hit ground or if off of ground
		var highest = 0; 
		for(var i = 0; i < ground.length; i++){
			if(ground[i] > highest){
				highest = ground[i];	
			}
		}
		var actualHeight = cHeight - highest * 10;

		if(onGround == false){
			if(yVel < terminalVelocity){
				//apply gravity
				yVel += gravity;
			}
		}
		//if the player is already on the ground, check if they are no longer on the ground by checking one pixel below them
		if(onGround && y + 1 + height < actualHeight){
			//no longer on ground
			yVel += gravity;
			onGround = false;
		}

		//else check if they are mid air and falling and about to hit the ground
		if(y + yVel + height > actualHeight){
			y = actualHeight - height;
			yVel = 0;
			onGround = true;
		}

		y += yVel;

		
	};

	that.paint = function(ctx){
		ctx.fillRect(x - GM.logic.getXOffset(),y,width, height);
	};
	that.moveX = function(dir){
		xVel = dir * xSpeed;
	};
	that.jump = function(){
		if(onGround){
			onGround = false;
			yVel = jumpSpeed;
		}
	}	
	return that;	
};