function Centaur(p){
	this._width = 25, 
	this._height = 89;
	this._walkingSpeed = .2;
	this._jumpSpeed = -.45;
	this._health = 25+Math.random()*10;
	this._state = "idle";
	this._attachedPlatform = p;


	
	var animation_set = new AnimationSet(GM.data.animation_sets.Centaur);
	animation_set.switchAnimation("idle");

	function behave(){

	};

	this._die = function(){
		Centaur.prototype._die.call(this);
		animation_set.switchAnimation("dying", function(){
			animation_set.switchAnimation("dead");
		});
	}
	this.paint = function(ctx){
		var xOff = GM.game.getXOffset();
		if(this._hurt){
			ctx.globalAlpha = .5;
		}
		animation_set.drawFrame(this._x - xOff - (-25 * this._facing), this._y, this._width, this._height, ctx, -1 * this._facing);
		if(GM.game.rectangleDebug){
			ctx.strokeRect(this._x - xOff, this._y, this._width, this._height);
		}
		if(this._hurt){
			ctx.globalAlpha = 1;
		}
	}
	this.activate = function(){
		Centaur.prototype.activate.call(this);
		this._state="idle";
		//this.moveX(1);
	};
	this.update = function(){
		if(!this._activated){
			return;
		}
		//call super.update to update hurt state
		Centaur.prototype.update.apply(this);
		var playerX = GM.game.getPlayerX();
		var playerWidth = GM.game.getPlayerWidth();
		var leftDisp = (playerX + playerWidth) - this._x; //players displacement
		var rightDisp = playerX - (this._x + this._width);
		var disp, dist; //displacement and distance
		var threshold = 150;//minimum distance to attack
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
			case "pacing":
				animation_set.switchAnimation("running");
				this._paceTimer -= GM.game.delta;
				if(this._paceTimer < 0){
					if(this._xVel < 0){
						this.moveX(1);
					}
					else{
						this.moveX(-1);
					}
					this._paceTimer = this._PACE_TIME;
				}
				
			break;
			case "follow_player":
				animation_set.switchAnimation("running");
				if(dist > threshold){
					//move towards the player
					this.moveX(disp/dist);
				}
				else if(GM.game.getPlayerY() + GM.game.getPlayerHeight() == this._y + this._height){
					this.jump();
				}
			break;
			case "dying":
				var dHeight = 37;
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
	Centaur.prototype.initPos.call(this);
}
GM.utils.inherits(Centaur, Enemy);