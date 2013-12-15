function Zombie(p){
	this._width = 15, 
	this._height = 87;
	this._walkingSpeed = .04;
	this._health = 30;
	this._state = "idle";
	this._attachedPlatform = p;
	var shotFire =false;
	var animation_set = new AnimationSet(GM.data.animation_sets.Zombie);
	animation_set.switchAnimation("idle");

	function behave(){

	};

	this._die = function(){
		Zombie.prototype._die.call(this);
		this._width = 50;
		this._height = 20;
	}
	this.paint = function(ctx){
		var xOff = GM.main.getXOffset();
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
		var inScreen = GM.main.inScreen(this);
		var playerX = GM.main.getPlayerX();
		var playerWidth = GM.main.getPlayerWidth();
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
		var pp = GM.main.getPlayerPlatform();
		if(this._dead){
			if(this._dying){
				//show death animation
				this._state = "dying";
			}
			else{
				this._state = "dead";
			}
		}
		if(pp == this._attachedPlatform && !this._dead){
			this._state = "follow_player";
			if(!shotFire){
				shotFire = true;
				GM.main.addFireBall(this.getX() + this.getWidth()/2, this.getY() + 10, -.2, 0); 
			}
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
			break;
		}

		this.movementUpdate();
		//check after gravityUpdate if trying to move but stuck
		if(this._state == "follow_player" && this._xVel == 0){
			this.jump();
		}
	}
	Zombie.prototype.initPos.call(this);
}
GM.utils.inherits(Zombie, Enemy);