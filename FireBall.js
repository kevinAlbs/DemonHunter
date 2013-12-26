function FireBall(){
	this.next = null;
	this.setHeight(9);
	this.setWidth(10);
	this._exploded = false;
	var animation_set = new AnimationSet(GM.data.animation_sets.Fireball);
	animation_set.switchAnimation("idle");
	this.explodingOn = function(m){
		//if it hasn't already exploded and is colliding with something, explode
		return !this._exploded && this.collidingWith(m);
	}
	this.hasExploded = function(){return this._exploded;};
	this.explode = function(){
		this._exploded = true;
		//make particles
		this._xVel = 0;
		this._yVel = 0;
	}
	this.paint = function(ctx){
		var xOff = GM.game.getXOffset();
		animation_set.drawFrame(this._x - xOff, this._y, this._width, this._height, ctx, -1 * this._facing);
		if(this._exploded){
			//ctx.strokeStyle = "#000";
		}
		ctx.strokeRect(this._x - xOff, this._y, this._width, this._height);
	};
}
GM.utils.inherits(FireBall, Movable);