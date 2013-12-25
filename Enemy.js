function Enemy(p){
	this._width = 15, 
	this._height = 87;
	this._walkingSpeed = .04;
	this._health = 30;
	this._xVel = 0;//prevent initial jump
	this._state = "idle";
	this._activated = false;
	this._maxHurtTicks = 0;
	var animation_set = new AnimationSet(GM.data.animation_sets.Zombie);
	animation_set.switchAnimation("idle");
	this._facing = -1;
	this._attachedPlatform = p;

	this.initPos = function(){
		if(this._attachedPlatform){
			var p = this._attachedPlatform;
			this._x = p.getX() + p.getWidth() * 2/3 + Math.random() * 20;
			this._y = p.getY() - this._height - 1;
		}
	}

	this.setPlatform = function(p){
		this._attachedPlatform = p;
	}

	function behave(){

	};

	this._die = function(){
		Enemy.prototype._die.call(this);
	}
	this.isActivated = function(){
		if(GM.viewport.inScreen(this) && !this._activated){
			this._activated = true;
		}
		return this._activated;
	}
	this.paint = function(ctx){
		var xOff = GM.game.getXOffset();
		if(this._hurt){
			ctx.globalAlpha = .5;
		}
		animation_set.drawFrame(this._x - xOff - (-15 * this._facing), this._y, this._width, this._height, ctx, -1 * this._facing);
		ctx.strokeRect(this._x - xOff, this._y, this._width, this._height);
		if(this._hurt){
			ctx.globalAlpha = 1;
		}
	}
	this.update = function(){
		if(!this._activated){
			return;
		}
		//call super.update to update hurt state
		Enemy.prototype.update.apply(this);
		this.movementUpdate();
	}
	this.initPos();
}
GM.utils.inherits(Enemy, Person);