function Flyer(){
	this._width = 30, 
	this._height = 80;
	this._walkingSpeed = .04;
	this._health = 90 + Math.random() * 50; //todo random health?
	this._state = "idle";
	this._noPlatformCollision = true;

	var posTimer = 0;
	var targetX = 0;
	var targetY = 0;
	this._flySpeedX = .3;
	this._flySpeedY = .3;

	var s1 = false; //shot 1,2
	var s2 = false;

	var animation_set = new AnimationSet(GM.data.animation_sets.Flyer);
	animation_set.switchAnimation("flying");

	function behave(){

	};

	this._die = function(){
		Flyer.prototype._die.call(this);
		this._width = 50;
		this._height = 20;
	}
	this.paint = function(ctx){
		var xOff = GM.game.getXOffset();
		if(this._hurt){
			ctx.globalAlpha = .5;
		}
		animation_set.drawFrame(this._x - xOff - (-15 * this._facing), this._y - 15, this._width, this._height, ctx, -1 * this._facing);
		ctx.strokeRect(this._x - xOff, this._y, this._width, this._height);
		if(this._hurt){
			ctx.globalAlpha = 1;
		}
	}

	this.checkPosition = function(){
		posTimer -= GM.game.delta;
		if(posTimer < 0){
			posTimer = Math.random() * 2500 + 2500;
			//pick a random target position (+ offset)
			//TODO: make actually random
			targetX = 200 + Math.random() * 700;
			console.log(targetX);
			if(targetY <= 300){
				//go to bottom side
				targetY = 420 + Math.random() * 50;
			}
			else{
				//go to top side
				targetY = 90 + Math.random() * 50;
			}
			this._state = "move_to_position";
			s1 = false;
			s2 = false;
			s3 = false;
		}
	}
	this.update = function(){
		if(!this._activated){
			return;
		}

		
		//call super.update to update hurt state
		Flyer.prototype.update.apply(this);
		this.checkPosition();

		//check whether it is on screen
		var inScreen = GM.game.inScreen(this);
		var playerX = GM.game.getPlayerX();
		var playerWidth = GM.game.getPlayerWidth();
		var leftDisp = (playerX + playerWidth) - this._x; //players displacement
		var rightDisp = playerX - (this._x + this._width);
		var disp, dist; //displacement and distance
		var cxVel = GM.game.getPlayerXVel(); //current x velocity, minimum speed to keep up
		var cyVel = -1 * this._gravity * GM.game.delta;
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
		switch(this._state){
			case "idle":
				animation_set.switchAnimation("flying");
			break;
			case "fly_at_speed":

			break;
			case "move_to_position":
				animation_set.switchAnimation("flying");

				//set velocity to go towards the end position
				var tgx = targetX + GM.game.getXOffset();//actual x offset
				var tgy = targetY;
				var xDiff = tgx - this._x;
				var axDiff = Math.abs(xDiff);
				var yDiff = tgy - this._y;
				var ayDiff = Math.abs(yDiff);
				var effectiveYVel = cyVel + this._flySpeedY * (yDiff/400);
				var effectiveXVel = cxVel + this._flySpeedX * (xDiff/660);
				
				if(axDiff > 0 && axDiff > (effectiveXVel * GM.game.delta)){
					//move in x direction
					this._xVel = effectiveXVel;
				}
				else{
					this._xVel = cxVel;
				}

				if(ayDiff > 0 && ayDiff > (effectiveYVel * GM.game.delta)){
					this._yVel = effectiveYVel;
				}
				else{
					this._yVel = cyVel; //just keep up
				}

				var pYDiff = this._y - GM.game.getPlayerY();
				var apYDiff = Math.abs(pYDiff);
				if(pYDiff < 0 && apYDiff < 30 && apYDiff > 20 && !s1){
					GM.game.addFireBall(this.getX() + this.getWidth()/2, this.getY() + 10, -.2, 0);
					s1 = true;
				}
				else if(pYDiff > 0 && apYDiff < 30 && apYDiff > 20 && !s2){
					GM.game.addFireBall(this.getX() + this.getWidth()/2, this.getY() + 10, -.2, 0);
					s2 = true;
				}
			break;
			case "dying":
				//show dying animation
			break;
		}

	}
	Flyer.prototype.initPos.call(this);
}
GM.utils.inherits(Flyer, Enemy);