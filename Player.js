function Player(){
	if(this == window){
		return new Player();
	}
	if(Player.instance != null){
		return Player.instance;
	}
	Player.instance = this;

	//"protected"
	this._x = 100, 
	this._yVel = 3,
	this._width = 22, 
	this._height = 60;
	this._gravity = .75;
	this._terminalVelocity = 9;
	this.name = "Kaitlin";
	this._state = "user_controlled";//no higher level behavior

	//create the player animation
	var frames = [
		{
			x: 0,
			y: 0,
			width: 22,
			height: 60,
			time: 10
		},
		{
			x: 22,
			y: 0,
			width: 22,
			height: 60,
			time: 10
		},
		{
			x: 44,
			y: 0,
			width: 22,
			height: 60,
			time: 10
		},
		{
			x: 66,
			y: 0,
			width: 22,
			height: 60,
			time: 10
		},
		{
			x: 88,
			y: 0,
			width: 22,
			height: 60,
			time: 10
		},
		{
			x: 110,
			y: 0,
			width: 22,
			height: 60,
			time: 1
		}
	];
	var animations = {
		walking: new Animation(frames),
		standing : new Animation([{
			x:0,
			y:0,
			width: 22,
			height: 60,
			time: 1
		}])
	}
	var curAnimation = animations.standing;
	this.update = function(){
		if(this._walking){
			curAnimation = animations.walking;
		}
		else{
			curAnimation = animations.standing;
		}
		this.gravityUpdate();
	};
	this.paint = function(ctx){
		curAnimation.drawFrame(this._x - GM.logic.getXOffset(), this._y, this._width, this._height, ctx);
		if(GM.debug){
			ctx.fillText(this._x + "," + this._y, this._x - GM.logic.getXOffset(), this._y - 10);
		}
	}
};

GM.utils.inherits(Player, Mob);