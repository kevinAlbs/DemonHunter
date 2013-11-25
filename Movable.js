function Movable(){
	/* 
	for my inheritance
	declare all properties on this (which are copied over)
	and declare all methods on prototype (which are shared)
	*/
	if(this == window){
		return new Movable();
	}
	this._gravityMax = 5;
	this._x = 0;
	this._y = 0;
	this._width = 0;
	this._height = 0;
	this._xVel = 0;
	this._yVel = 0;
	this._origGrav = 1.8;
	this._gravAcc = 0;
	this._gravity = this._origGrav;
	this._terminalVelocity = 100;
	this._onGround = false;
}

GM.utils.inherits(Movable, Paintable);

//default properties
Movable.prototype.collidingWith = function(movable){
	//returns true/false if colliding with other movable object
	var left1 = this._x,
		left2 = movable.getX(),
		top1 = this._y,
		top2 = movable.getY(),
		right1 = this._x + this._width,
		right2 = movable.getX() + movable.getWidth(),
		bottom1 = this._y + this._height,
		bottom2 = movable._y + movable.getHeight();
		if(bottom1 < top2 || top1 > bottom2 || left1 > right2 || right1 < left2){
			return false;
		}
		return true;
};

//updates gravity, checks for collision with platforms
Movable.prototype.gravityUpdate = function(){
		var ground;
		if(this._xVel > 0){
			//add x velocity to 'to' parameter
			ground = GM.logic.getGround(this._x, this._x+this._width+this._xVel);
		}
		else{
			//add x velocity to 'from' parameter
			ground = GM.logic.getGround(this._x+this._xVel, this._x+this._width);
		}
		var c_height = GM.logic.getCHeight();

		//check if about to hit ground xwise
		if(this._xVel > 0){
			//check right side
			//do I only have to check the last ground block?
			//we know that getGround will get the last block which x is moving to
			//or that the first block will be the block which x is moving to
			actual_height = c_height - ground[ground.length-1] * 10;
			if(this._y + this._height > actual_height){
				//move up to just before the block they are about to hit
				this._x = (this._x + this._xVel + this._width) - ((this._x + this._xVel + this._width) % 10) - this._width;
				this._xVel = 0;
				//remove the last block from y checking, since it will not be moving there
				ground.splice(ground.length-1, 1);
			}
		}
		else if(this._xVel < 0){
			//check left side
			actual_height = c_height - ground[0] * 10;
			if(this._y + this._height > actual_height){
				//move up to just before the block they are about to hit
				this._x = (this._x + this._xVel) + (10 - ((this._x + this._xVel) % 10));
				this._xVel = 0;
				//remove the last block from y checking, since it will not be moving there
				ground.splice(0, 1);
			}
		}

		if(GM.logic.collisionDebug){
			//get the test platform
			var p = GM.logic.getPlatforms();
			//now using vector math check if it will collide within t <= 1
			//first a point
			var x1 = this._x + this._width;
			var y1 = this._y + this._height;
			var dx = this._xVel;
			var dy = this._yVel;
			var tx = Math.abs((p.x1 - x1)/dx);
			var projY = y1 + tx * dy;
			if(tx < 1){
				console.log(projY);
			}
			if(!(p.y1 < projY  && projY < p.y1+p.h)){
				//the y coordinate is not crossed on this trajectory
				tx = 2;//so it won't happen
			}
			var ty = Math.abs((p.y1 - y1)/dy);
			var projX = x1 + ty * dx;
			if(!(p.x1 < projX && projX < p.x1 + p.w)){
				//the x coordinate is not crossed on this trajectory
				ty = 2;//so it won't happen
			}
			if(tx > 1 && ty > 1){
				//neither is going to happen
			}
			else{
				if(tx < ty){
					console.log("Collision x");
					this._x = (x1 + tx * dx) - this._width - 1;
					this._xVel = 0;
				}
				else if(ty < tx){
					console.log("Collision y");
					this._y = (y1 + ty * dy) - this._height - 1;
					this._yVel = 0;
				}
				else{
					console.log("Equal");
					this._x = (x1 + tx * dx) - this._width - 1;
					this._y = (y1 + ty * dy) - this._height - 1;
					this._xVel = 0;
					this._yVel = 0;
				}
			}
		}
		this._x += this._xVel;

		if(!GM.logic.collisionDebug){
			//see if about to hit ground or if off of ground
			var highest = 0; 
			for(var i = 0; i < ground.length; i++){
				if(ground[i] > highest){
					highest = ground[i];	
				}
			}
			var actual_height = c_height - highest * 10;

			if(this._onGround == false){
				if(this._yVel < this._terminalVelocity){
					//apply gravity
					this._yVel += this._gravity;
					this._gravity += this._gravAcc;
					if(this._gravity > this._gravityMax){
						this._gravity = this._gravityMax;
					}
				}
			}
			//if the player is already on the ground, check if they are no longer on the ground by checking one pixel below them
			if(this._onGround && this._y + 1 + this._height < actual_height){
				//this._gravity = this._origGrav;
				//no longer on ground

				this._yVel += this._gravity;
				this._gravity += this._gravAcc;
				this._onGround = false;
			}

			//else check if they are mid air and falling and about to hit the ground
			if(this._y + this._yVel + this._height > actual_height){
				this._y = actual_height - this._height;
				this._yVel = 0;
				this._gravity = this._origGrav;
				console.log(this._gravity);
				this._onGround = true;
			}
		}
		this._y += this._yVel;


		//check screen bounds
		if(this._x < 0){
			this._x = 0;
		}
		if(this._x + this._width > GM.logic.getMapWidth()){
			this._x = GM.logic.getMapWidth() - this._width;
		}
	};



