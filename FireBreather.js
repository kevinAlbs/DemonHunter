function FireBreather(p){
	this._width = 20, 
	this._height = 87;
	this._walkingSpeed = .04;
	this._health = 90;
	this._state = "idle";
	this._attachedPlatform = p;
	var shotFire =false;
	//the bounce gives the up and down bouncing on paint
	var bounce = 0;
	var BOUNCE_TIME = 200;
	var bounceTimer = BOUNCE_TIME;
	var bounceUp = true;
	var SHOOT_DELAY = 600;
	var shootDelay = SHOOT_DELAY;
	var animation_set = new AnimationSet(GM.data.animation_sets.FireBreather);
	var arm_animation = new AnimationSet(GM.data.animation_sets.FireBreatherArm);
	arm_animation.switchAnimation("idle");
	animation_set.switchAnimation("walking");

	function behave(){

	};

	this._die = function(){
		console.log("HERE");
		FireBreather.prototype._die.call(this);
		animation_set.switchAnimation("dying", function(){
			animation_set.switchAnimation("dead");
		});
	}
	this.paint = function(ctx){
		var xOff = GM.game.getXOffset();
		if(this._hurt){
			ctx.globalAlpha = .5;
		}
		animation_set.drawFrame(this._x - xOff - (1 * this._facing), this._y + bounce, this._width, this._height, ctx, -1 * this._facing);
		if(!this._dead){
			arm_animation.drawFrame(this._x - xOff - (-17 * this._facing), this._y + 15 + bounce, this._width, this._height, ctx, -1 * this._facing);
		}
		ctx.strokeRect(this._x - xOff, this._y, this._width, this._height);
		if(this._hurt){
			ctx.globalAlpha = 1;
		}
	}
	this.update = function(){
		if(!this._activated){
			return;
		}

		shootDelay -= GM.game.delta;
		bounceTimer -= GM.game.delta;
		if(!this._dead){
			if(bounceTimer < 0){
				bounceTimer = BOUNCE_TIME;
				if(bounceUp){
					bounce++;
					if(bounce >= 2){
						bounceUp = false;
					}
				}
				else{
					bounce--;
					if(bounce <= -2){
						bounceUp = true;
					}
				}
			}
		}
		//call super.update to update hurt state
		FireBreather.prototype.update.apply(this);
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
				animation_set.switchAnimation("walking");
			break;
			case "follow_player":
				if(!shotFire && shootDelay < 0){
					shotFire = true;
					var that = this;
					arm_animation.switchAnimation("throwing", function(){
						GM.game.addFireBall(that.getX() + (17 * that._facing), that.getY() + 16 + bounce, .275 * that._facing, 0); 	
						arm_animation.switchAnimation("idle");
						shootDelay = SHOOT_DELAY;
						shotFire = false;
					});
				}
				animation_set.switchAnimation("walking");
				if(dist > threshold){
					//move towards the player
					this.moveX(disp/dist);
				}
			break;
			case "dying":
				var dHeight = 15;
				if(this._height > dHeight){
					var change = .25 * GM.game.delta;
					if(this._height - change < dHeight){
						this._height = dHeight;
						this._dying = false;
						this._state = "dead";
					}
					else{
						this._height -= change;
					}
				}
			break;
		}
	}
	FireBreather.prototype.initPos.call(this);
}
GM.utils.inherits(FireBreather, Enemy);