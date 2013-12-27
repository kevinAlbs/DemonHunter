//since I'm assuming most pickups will be similar, I'm only making one class for all and having the _type field differentiate them
function Pickup(type, x){
	this._type = type;
	if(x){
		this._x = x;
	}
	this.init = function(){
		if(this._type == "health" || this._type == "ammo"){
			this._width = 10;
			this._height = 10;
		}
	};
	this.paint = function(ctx){
		var xOff = GM.game.getXOffset();
		if(this._type == "health"){
			ctx.save();
			ctx.fillStyle="#FFF";
			ctx.fillRect(this._x-xOff,this._y,this._width,this._height);
			ctx.restore();
		}
		else if(this._type == "ammo"){
			ctx.save();
			ctx.fillStyle="#F00";
			ctx.fillRect(this._x-xOff,this._y,this._width,this._height);
			ctx.restore();
		}
	}
	this.setType = function(newType){
		this._type = newType;
	}
	this.onCollide = function(){
		//show that animation etc.
	};
	this.init();
};
GM.utils.inherits(Pickup, Movable);