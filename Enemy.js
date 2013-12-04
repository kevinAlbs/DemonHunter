function Enemy(p){
	this._width = 30, 
	this._height = 70;
	this._xSpeed = .04;
	this._health = 30;
	this._xVel = 0;//prevent initial jump
	this._state = "idle";
	this._attachedPlatform = null;
	this._activated = false;
	this._maxHurtTicks = 0;

	if(p){
		this._attachedPlatform = p;
		this._x = p.getX() + p.getWidth() * 2/3;
		this._y = p.getY() - this._height - 1;
	}

	function behave(){

	};
	this._die = function(){
		Enemy.prototype._die.call(this);
		this._width = 50;
		this._height = 20;
	}
	this.isActivated = function(){
		if(GM.viewport.inScreen(this) && !this._activated){
			this._activated = true;
		}
		return this._activated;
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
		if(!inScreen || pp != this._attachedPlatform){
			this._state = "idle";
			this.moveX(0);
		}
		switch(this._state){
			case "idle":
				if(inScreen && pp == this._attachedPlatform){
					this._state = "follow_player";
					if(dist > threshold){
						this.moveX(disp/dist);//move towards player (no need to check threshold since enemy will idle during off screen
					}
				}
			break;
			case "follow_player":
				if(dist > threshold){
					//move towards the player
					this.moveX(disp/dist);
				}
				else{
					this._state = "attack";
					this.moveX(0);
				}
			break;
			case "attack":
				if(dist > threshold){
					//player has moved out of way, follow!
					this._state = "follow_player";
					//move towards the player
					this.moveX(disp/dist);
				}
				else{
					//console.log("ATTACK!");
					break;
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
}
GM.utils.inherits(Enemy, Person);