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
	this.name = "Kaitlin";
	this._state = "user_controlled";//no higher level behavior

	var swingingSword = false;
	var animation_set = new AnimationSet(GM.data.animation_sets.Player);
	animation_set.switchAnimation("standing");
	function doneSwing(){
		swingingSword = false;
		console.log("done swing");
	}
	this.update = function(){
		if(!swingingSword){
			if(this._walking){
				animation_set.switchAnimation("walking");//remember, only actually switches if it is not already walking
			}
			else{
				animation_set.switchAnimation("standing");
			}
		}
		this.gravityUpdate();
	};
	this.paint = function(ctx){
		animation_set.drawFrame(this._x - GM.logic.getXOffset(), this._y, this._width, this._height, ctx, this._facing);
		ctx.strokeRect(this._x - GM.logic.getXOffset(), this._y, this._width, this._height);
		if(GM.debug){
			ctx.fillText(this._x + "," + this._y, this._x - GM.logic.getXOffset(), this._y - 10);
		}
	}
	this.swingSword = function(){
		if(swingingSword) return;
		swingingSword = true;
		animation_set.switchAnimation("swing_sword", doneSwing);
	}
};

GM.utils.inherits(Player, Person);