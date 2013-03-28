function Tree(){
	var leaves;
	this._x = 10;
	this._y = 10;
	this._width = 10;
	this._height = 100;

	//generate leaves
	this.getLeaves = function(){
		return leaves;
	};

	this.paint = function(ctx){
		var xOff = GM.logic.getXOffset();
		//paint trunk
		ctx.fillStyle = "#820";
		ctx.fillRect(this._x - xOff, this._y, this._width, this._height);
		ctx.fillRect(this._x - 10 - xOff, this._y + 10, this._width + 20, 10);
		//paint all leaves
		
	};
};

GM.utils.inherits(Tree, Paintable);

