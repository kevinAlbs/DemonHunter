function Enemy(p){
	this._width = 15, 
	this._height = 87;
	this._walkingSpeed = .04;
	this._health = 30;
	this._xVel = 0;//prevent initial jump
	this._state = "idle";
	this._attachedPlatform = null;
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
		//check whether it is on screen
		var inScreen = GM.game.inScreen(this);
		var playerX = GM.game.getPlayerX();
		var playerWidth = GM.game.getPlayerWidth();
		var leftDisp = (playerX + playerWidth) - this._x; //players displacement
		var rightDisp = playerX - (this._x + this._width);
		var disp, dist; //displacement and distance
		var threshold = 10;//minimum distance to attack
		if(leftDisp < 0){
			//player is to left of enemy
			disp = leftDisp;
		}
		else if(rightDisp > 0){
			disp = rightDisp;
		}
		else{
			disp = 0;
		}
		dist = Math.abs(disp);
		var pp = GM.game.getPlayerPlatform();
		if(this._dead){
			if(this._dying){
				//show death animation
				this._state = "dying";
			}
			else{
				this._state = "dead";
			}
		}
		if(!inScreen || pp != this._attachedPlatform){
			this._state = "idle";
			this.moveX(0);
		}
		switch(this._state){
			case "idle":
				animation_set.switchAnimation("idle");
				if(inScreen && pp == this._attachedPlatform){
					this._state = "follow_player";
					if(dist > threshold){
						this.moveX(disp/dist);//move towards player (no need to check threshold since enemy will idle during off screen
					}
				}
			break;
			case "follow_player":
				animation_set.switchAnimation("walking");
				if(dist > threshold){
					//move towards the player
					this.moveX(disp/dist);
				}
			break;
			case "dying":
				//show dying animation
			break;
		}

		this.movementUpdate();
		//check after gravityUpdate if trying to move but stuck
		if(this._state == "follow_player" && this._xVel == 0){
			this.jump();
		}
	}
	this.initPos();
}
GM.utils.inherits(Enemy, Person);