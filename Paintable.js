//interface
function Paintable(){
	this._x = 0;
	this._y = 0;
	this._width = 10;
	this._height = 10;
}
Paintable.prototype.paint = function(ctx){
	//default
	ctx.fillRect(this._x - GM.logic.getXOffset(),this._y,this._width, this._height);
	if(GM.debug){
		ctx.fillText(this._x + "," + this._y, this._x - GM.logic.getXOffset(), this._y - 10);
	}
};