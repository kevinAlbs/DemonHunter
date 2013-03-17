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

	this.update = function(){
		this.gravityUpdate();
	};
};

GM.utils.inherits(Player, Mob);