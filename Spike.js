function Spike(){
	this.next = null;
	this.setHeight(20);
	this.setWidth(20);
	var animation_set = new AnimationSet(GM.data.animation_sets.Spike);
	animation_set.switchAnimation("idle");
	this.paint = function(ctx){
		var xOff = GM.game.getXOffset();
		ctx.strokeRect(this._x - xOff, this._y, this._width, this._height);
		animation_set.drawFrame(this._x - xOff, this._y, this._width, this._height, ctx);
	};
}
GM.utils.inherits(Spike, Movable);