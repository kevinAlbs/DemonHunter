//since I'm assuming most pickups will be similar, I'm only making one class for all and having the _type field differentiate them
function Pickup(type, x){
	this._type = type;
	var anim = new AnimationSet(GM.data.animation_sets.Pickup);
	if(x){
		this._x = x;
	}
	this.init = function(){
		if(this._type == "health" || this._type == "ammo"){
			this._width = 10;
			this._height = 10;
		}
		anim.switchAnimation(this._type);
	};
	this.paint = function(ctx){
		var xOff = GM.game.getXOffset();
		anim.drawFrame(this._x - xOff, this._y, this._width, this._height, ctx,1);
	}
	this.getType = function(){
		return this._type;
	}
	this.setType = function(newType){
		this._type = newType;
	}
	this.onCollide = function(){
		GM.deps[this._type].play();
		//show that animation etc.
	};
	this.init();
};
GM.utils.inherits(Pickup, Movable);