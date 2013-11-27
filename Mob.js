function Mob(){
	this._state = "";//describing the higher behavior of a mob, eg. attacking_player, or follow_player
	this._jumpSpeed = -9;
	this._xSpeed = 5;//walking speed
	this._walking = false;
	this._ducking = false;
	this._hasLongJump = false;
	this._facing = 1;//-1 for facing left, 1 for facing right, NEVER 0
	this._curPlatform = null;
	this.name = "";

	//dir must be -1, 0, or 1
	this.moveX = function(dir){
		if(dir > 1 || dir < -1){return;}

		if(dir != 0){
			if(!this._ducking){
				this._walking = true;
			}
			this._facing = dir;
		} 
		else{
			this._walking = false;
		}
		if(!this._ducking){
			this._xVel = dir * this._xSpeed;
		}
	};
	this.unMoveX = function(){
		var ab = Math.abs(this._xVel)
		this._walking = false;
		if(ab < .1){
			this._xVel = 0;
		}
		else if(ab > 0){
			this._xVel *= .75;
		}
	}
	this.jump = function(){
		if(GM.main.collisionDebug){
			this._yVel = -3;
			return;
		}
		if(this._onGround && !this._ducking){
			this._onGround = false;
			this._yVel = this._jumpSpeed;
		}
	}	
	this.unjump = function(){
		if(GM.main.collisionDebug){
			this._yVel = 0;
			return;
		}
		if(this._hasLongJump){
			if(this._yVel < -8){
				this._yVel = -8;
			}
		}

	}
	this.duck = function(){
		if(GM.main.collisionDebug){
			this._yVel = 3;
			return;
		}
		if(this._onGround){
			this._xVel = 0;
			this._ducking = true;
		}
	}
	this.unduck = function(){
		if(GM.main.collisionDebug){
			this._yVel = 0;
			return;
		}
		this._ducking = false;
	}

	this.gravityUpdate = function(){
		if(GM.main.collisionDebug){
			if(this._curPlatform == null){
				this._curPlatform = GM.platformList.getRoot();
			}
			var first = null;//first possible platform found
			for(var p = this._curPlatform; p != null; p = p.next){
				var r = GM.platformList.collPossibleX(this, p);
				if(r == 0){
					//possible, check collision
					if(first == null){
						first = p;
					}
					if(GM.platformList.collPossibleY(this,p) == 0){ //also check y because most of the time you will be jumping
						p.color = "#F00";
						var coll = this.collMovingStatic(this, p, true);
					}
					else{
						p.color = "#00F";
					}
				}
				else{
					p.color = "#00F";
				}
				if(r < 0){
					break;//too far
				}
			}
			
			var last = null;
			for(var p = this._curPlatform; p != null; p = p.prev){
				var r = GM.platformList.collPossibleX(this, p);
				if(r == 0){
					//possible, check collision
					last = p;
					if(GM.platformList.collPossibleY(this,p) == 0){ //also check y because most of the time you will be jumping
						p.color = "#F00";
						var coll = this.collMovingStatic(this, p, true);
					}
					else{
						p.color = "#00F";
					}
				}
				else{
					p.color = "#00F";
				}
				if(r > 0){
					break;//too far
				}
			}

			if(last != null){
				this._curPlatform = last;
			}
			else if(first != null){
				this._curPlatform = first;
			}

		}
		Mob.prototype.gravityUpdate.call(this);
	}
}

GM.utils.inherits(Mob, Movable);