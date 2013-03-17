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
		}
		{
			x: 110,
			y: 0,
			width: 22,
			height: 60,
			time: 10
		}
	];
	var animation = new Animation(frames);
	this.update = function(){
		this.gravityUpdate();
	};
};

GM.utils.inherits(Player, Mob);