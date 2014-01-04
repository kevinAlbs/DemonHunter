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
	this._PACE_TIME = 800;
	this._paceTimer = this._PACE_TIME;
	this._followPlayerDistance = 0;//0 means when player is on the same platform

	this.setFollowPlayerDistance = function(val){
		this._followPlayerDistance = val;
	};

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
	this.activate = function(){
		this._activated = true;
	}
	this.isActivated = function(){
		if(GM.viewport.inScreen(this) && !this._activated){
			this.activate();
		}
		return this._activated;
	}
	this.paint = function(ctx){
		var xOff = GM.game.getXOffset();
		if(this._hurt){
			ctx.globalAlpha = .5;
		}
		animation_set.drawFrame(this._x - xOff - (-15 * this._facing), this._y, this._width, this._height, ctx, -1 * this._facing);
		if(GM.game.rectangleDebug){
			ctx.strokeRect(this._x - xOff, this._y, this._width, this._height);
		}
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
	};

	this.hurt = function(amt){
		Enemy.prototype.hurt.call(this, amt);
		this._hurt = false;//we need for multiple bullets to hurt enemies
	}
	this.initPos();
}
GM.utils.inherits(Enemy, Person);