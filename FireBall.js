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
		GM.deps.fireball.play();
		this._exploded = true;
		//make particles
		GM.game.generateParticles({
			num: 15,
			x: this._x + this._width/2 - GM.game.getXOffset(),
			y: this._y + this._height/2,
			angle: 0,
			angle_variance: 2*Math.PI,
			time: 500,
			time_variance: 100,
			init_speed_x: .2, //px/ms
			init_speed_y: .2,
			color: "#FF9000"
		})
		this._xVel = 0;
		this._yVel = 0;
	}
	this.paint = function(ctx){
		var xOff = GM.game.getXOffset();
		if(!this._exploded){
			animation_set.drawFrame(this._x - xOff, this._y, this._width, this._height, ctx, -1 * this._facing);
		}
		if(GM.game.rectangleDebug){
			ctx.strokeRect(this._x - xOff, this._y, this._width, this._height);
		}
	};
}
GM.utils.inherits(FireBall, Movable);