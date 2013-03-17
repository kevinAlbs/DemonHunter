function Mob(){
	this._state = "";//describing the higher behavior of a mob, eg. attacking_player, or follow_player
	this._jumpSpeed = -9;
	this._xSpeed = 5;//walking speed
	this._walking = false;
	this.name = "";

	this.moveX = function(dir){
		if(dir != 0) this._walking = true;
		else this._walking = false;

		this._xVel = dir * this._xSpeed;
	};
	this.jump = function(){
		if(this._onGround){
			this._onGround = false;
			this._yVel = this._jumpSpeed;
		}
	}	
}

GM.utils.inherits(Mob, Movable);