function Movable(){
	/* 
	for my inheritance
	declare all properties on this (which are copied over)
	and declare all methods on prototype (which are shared)
	*/
	if(this == window){
		return new Movable();
	}
	this._x = 0;
	this._y = 0;
	this._width = 0;
	this._height = 0;
	this._xVel = 0;
	this._yVel = 0;
	this._gravity = .75;
	this._terminalVelocity = 9;
	this._onGround = false;
}

GM.utils.inherits(Movable, Paintable);

//default properties
Movable.prototype.collidingWith = function(movable){
	//returns true/false if colliding with other movable object
};
//set the y coordinate relative to ground so movable object can be placed directly on ground
Movable.prototype.setOnGround = function(){
	ground = GM.logic.getGround(this._x, this._x+this._width);
	var highest = 0;
	var c_height = GM.logic.getCHeight();
	for(var i = 0; i < ground.length; i++){
		if(ground[i] > highest){
			highest = ground[i];	
		}
	}
	var actual_height = c_height - highest * 10;
	this._y = actual_height - this._height;
};
//updates gravity, checks for collision with ground
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
		this._x += this._xVel;

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
			}
		}
		//if the player is already on the ground, check if they are no longer on the ground by checking one pixel below them
		if(this._onGround && this._y + 1 + this._height < actual_height){
			//no longer on ground
			this._yVel += this._gravity;
			this._onGround = false;
		}

		//else check if they are mid air and falling and about to hit the ground
		if(this._y + this._yVel + this._height > actual_height){
			this._y = actual_height - this._height;
			this._yVel = 0;
			this._onGround = true;
		}

		this._y += this._yVel;
	};



