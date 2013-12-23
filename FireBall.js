function FireBall(){
	this.next = null;
	this.setHeight(5);
	this.setWidth(5);
	this._exploded = false;
	this.explodingOn = function(m){
		//if it hasn't already exploded and is colliding with something, explode
		return !this._exploded && this.collidingWith(m);
	}
	this.hasExploded = function(){return this._exploded;};
	this.explode = function(){
		this._exploded = true;
		//set animation
		this._xVel = 0;
		this._yVel = 0;
	}
	this.paint = function(ctx){
		var xOff = GM.game.getXOffset();
		if(this._exploded){
			//ctx.strokeStyle = "#000";
		}
		ctx.strokeRect(this._x - xOff, this._y, this._width, this._height);
	};
}
GM.utils.inherits(FireBall, Movable);