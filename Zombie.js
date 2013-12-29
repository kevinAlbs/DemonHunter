function Zombie(p){
	this._width = 15, 
	this._height = 87;
	this._walkingSpeed = .04;
	this._health = 30;
	this._state = "idle";
	this._attachedPlatform = p;
	var animation_set = new AnimationSet(GM.data.animation_sets.Zombie);
	animation_set.switchAnimation("idle");
	this._followPlayerDistance = 0;

	function behave(){

	};

	this._die = function(){
		Zombie.prototype._die.call(this);
		this._state="dying";
		//this._height = 20;
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
		Zombie.prototype.update.apply(this);
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
		
		if(this._dead){
			if(this._dying){
				//show death animation
				this._state = "dying";
			}
			else{
				this._state = "dead";
			}
		}
		if(this._followPlayerDistance == 0 && !this._dead){
			//follow player on if she is on same platform
			var pp = GM.game.getPlayerPlatform();
			if(pp == this._attachedPlatform){
				this._state = "follow_player";
			}	
		}
		else if(dist < this._followPlayerDistance && !this._dead){
			this._state = "follow_player";
		}

		switch(this._state){
			case "idle":
				animation_set.switchAnimation("idle");
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
				if(this._height > 20){
					var change = .25 * GM.game.delta;
					this._height -= change;
				}
			break;
		}

		//this.movementUpdate();
		//check after gravityUpdate if trying to move but stuck
		if(this._state == "follow_player" && this._xVel == 0){
			this.jump();
		}
	}
	Zombie.prototype.initPos.call(this);
}
GM.utils.inherits(Zombie, Enemy);