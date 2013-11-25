//methods for moving viewport and painting background
GM.viewport = (function(){
	var that = {};
	var xOffset = 0, //always positive
		yOffset = 0; // positive if player moving up

	var cWidth, cHeight, mapWidth;
	var clock = 0;//time of day
	var leftMin = 0, rightMax = 0;//left/right bounds in pixesl
	var ground; // holds heights of ground at every area in map 

	var timeFactor = 0;//for time of day		
	var time = 1;

	function generateTerrain(){
		for(var i = 0; i < ground.length; i++){
			if((0 < i && i < 30) || (50 < i && i < 60)){
				ground[i] = 26;
			}
			else{
				ground[i] = 0;
			}
		}
	};


	/*
	 this is the absolute x and y of the player
	 changes offsets on viewport to follow player
	*/
	function updateOffsets(x,y){
		//to center x:
		xOffset = (x - cWidth / 2);
		if(xOffset < leftMin){
			xOffset = leftMin;
		}
		var rightBound = (rightMax - cWidth);
		if(xOffset > rightBound){
			xOffset = rightBound;
		}

	};

	that.init = function(cW, cH, mW){
		cWidth = cW;
		cHeight = cH;
		mapWidth = mW;
		rightMax = mapWidth * 10;
		ground = new Array(mapWidth);
		generateTerrain();
		//initBGBuffer();
	};
	that.update = function(playerx, playery){
		updateOffsets(playerx, playery);
		timeFactor += time;
		if(timeFactor > 1000){
			time = -1;
		}
		else if(timeFactor <= 0){
			time = 1;
		}
	};
	that.paint = function(ctx){
		ctx.fillStyle = "#3cbcfc";
		ctx.fillRect(0,0, cWidth, cHeight);
		var firstBlock = Math.floor(xOffset / 10);
		var totalBlocks = cWidth / 10 + 1;
		ctx.fillStyle = "#009800";
		for(var i = 0; i < totalBlocks; i++){
			ctx.fillRect(-1 * xOffset % 10 + i * 10, (cHeight/10 - ground[i + firstBlock]) * 10, 10 , cHeight - (10 * ground[i + firstBlock]));
		}
	}

	that.getGround = function(){
		return ground;
	}
	that.getXOffset = function(){
		return xOffset;
	};

	//obj inherits Paintable
	that.inScreen = function(obj){
		return that.inScreenOverride(obj.getX(), obj.getWidth());
	};
	//not supplied object, but x and width instead (so far used for trees where "width" needs to include leaves)
	that.inScreenOverride = function(x,w){
		if(x + w > xOffset){
			if(x < xOffset + cWidth){
				return true;
			}	
		}
	}

	return that;
}());
