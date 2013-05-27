function Tree(x){
	var leaves;
	this._x = x;
	this._y = 0;//will be set
	this._width = 10;
	this._largestRow = 0;
	var extraHeightBlocks = Math.ceil(Math.random() * 8);
	this._height = 70 +  extraHeightBlocks * 10;

	Tree.prototype.setOnGround.apply(this);


	var treeLeft = 0;//left of tree (including leaves)
	var treeRight = 0;//right of tree (including leaves)
	//generate leaves
	var leaveRows = 4 + (extraHeightBlocks / 2);
	//calculate leaf row width based on quadratic function
	var calcLeafWidth = function(row){
		return -1.5 * Math.pow(leaveRows, -.5)*row*(row - leaveRows);
	};
	var leaves = new Array();
	for(var i = 0; i < leaveRows; i++){
		var rowWidth = calcLeafWidth(i);
		if(rowWidth > this._largestRow){
			this._largestRow = rowWidth;
		}
		for(var j = 0; j < rowWidth; j++){
			var leaf = new Movable();
			leaf.setX(this._x + Math.ceil(j - rowWidth/2) * 10);
			leaf.setY(this._y - 10 * (i - 4));
			leaf.setWidth(10);
			leaf.setHeight(10);
			leaves.push(leaf);
		}	

	}	
	this.getWidthWithLeaves = function(){
		return this._largestRow * 10;
	};
	this.getXWithLeaves = function(){
		return this._x - ((this._largestRow - 1)/ 2* 10);
	}
	this.getLeaves = function(){
		return leaves;
	};

	this.paint = function(ctx){
		var xOff = GM.logic.getXOffset();
		//paint trunk
		ctx.fillStyle = "#503000";
		ctx.fillRect(this._x - xOff, this._y, this._width, this._height);
		ctx.fillRect(this._x - 10 - xOff, this._y + 10, this._width + 20, 10);
		//paint all leaves
		for(var i = 0; i < leaves.length; i++){
			ctx.fillStyle = "#005800";
			leaves[i].paint(ctx);
		}
	};
};

GM.utils.inherits(Tree, Paintable);

