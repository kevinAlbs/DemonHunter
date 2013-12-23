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
	ctx.fillRect(this._x - GM.game.getXOffset(),this._y,this._width, this._height);
	if(GM.debug){
		//ctx.fillText(this._x + "," + this._y, this._x - GM.game.getXOffset(), this._y - 10);
		if(typeof this.getHealth == "function"){
			//ctx.fillText(this.getHealth(), this._x - GM.game.getXOffset(), this._y - 20);
		}
	}
};

//set the y coordinate relative to ground so movable object can be placed directly on ground
Paintable.prototype.setOnGround = function(){
	ground = GM.game.getGround(this._x, this._x+this._width);
	var highest = 0;
	var c_height = GM.game.getCHeight();
	for(var i = 0; i < ground.length; i++){
		if(ground[i] > highest){
			highest = ground[i];	
		}
	}
	var actual_height = c_height - highest * 10;
	this._y = actual_height - this._height;
};