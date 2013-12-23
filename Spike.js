function Spike(){
	this.next = null;
	this.setHeight(20);
	this.setWidth(20);
	this.paint = function(ctx){
		var xOff = GM.game.getXOffset();
		ctx.strokeRect(this._x - xOff, this._y, this._width, this._height);
	};
}
GM.utils.inherits(Spike, Movable);