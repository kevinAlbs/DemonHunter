function Enemy(){
	this._width = 30, 
	this._height = 70;
	this._xSpeed = 2;
	this._xVel = 0;//prevent initial jump
	this._state = "idle";

	function behave(){

	};
	this.update = function(){
		//check whether it is on screen
		var inScreen = GM.logic.inScreen(this);
		var playerX = GM.logic.getPlayerX();
		var playerWidth = GM.logic.getPlayerWidth();
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
		
		if(!inScreen){
			this._state = "idle";
			this.moveX(0);
		}
		switch(this._state){
			case "idle":
				if(inScreen){
					this._state = "follow_player";
					this.moveX(disp/dist);//move towards player (no need to check threshold since enemy will idle during off screen
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
					console.log("ATTACK!");
					break;
				}
			break;
		}
		this.gravityUpdate();
		//check after gravityUpdate if trying to move but stuck
		if(this._state == "follow_player" && this._xVel == 0){
			this.jump();
		}
	}	
}
GM.utils.inherits(Enemy, Person);