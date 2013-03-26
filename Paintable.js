//interface
function Paintable(){
	this._x = 0;
	this._y = 0;
	this._width = 10;
	this._height = 10;
}
Paintable.prototype.setX = function(val){
	//check within bounds
	if(val >= 0){
		this._x = val;
	}
};
Paintable.prototype.getX = function(){return this._x;}
Paintable.prototype.getY = function(){return this._y;}
Paintable.prototype.getWidth = function(){return this._width;}
Paintable.prototype.getHeight = function(){return this._height;}
Paintable.prototype.setX = function(val){this._x = val;}
Paintable.prototype.setY = function(val){this._y = val;}
Paintable.prototype.setWidth = function(val){this._width = val;}
Paintable.prototype.setHeight = function(val){this._height = val;}
Paintable.prototype.paint = function(ctx){
	//default
	ctx.fillRect(this._x - GM.logic.getXOffset(),this._y,this._width, this._height);
	if(GM.debug){
		ctx.fillText(this._x + "," + this._y, this._x - GM.logic.getXOffset(), this._y - 10);
	}
};