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
		// generate heights
		var sign = 1; // positive 10% chance of sign change
		var minHeight = 15, maxHeight = 30;

		for(var i = 0; i < ground.length; i++){
			if(i == 0){
				prev = 15;
			}
			else{
				prev = ground[i-1];
			}
			if(i > 10 && i < 30){
				//platform for player
				ground[i] = ground[i-1];
				continue;
			}
			// height is in 10's, so from 0 to 60
			var diff = Math.floor(Math.random() * 100); 
			//60 percent no change
			if(diff < 60){
				diff = 0;
			}
			else{
				diff = 1;
			}
			var thisHeight = prev + diff * sign;
			if(thisHeight < minHeight){
				thisHeight = minHeight;
			}
			else if(prev > maxHeight){
				thisHeight = maxHeight;
			}
			if(Math.ceil(Math.random() * 10) == 1){
				sign = -1 * sign;
			}
			ground[i] = thisHeight;
		}
		smoothGround();
	};

	//removes those 1 block jitters
	function smoothGround(){
		for(var i = 0; i < ground.length - 3; i++){
			if(ground[i+1] > ground[i] && ground[i+1] > ground[i+2]){
				ground[i+1] = ground[i];
			}
		}
	}

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
		ctx.fillStyle = "#00a800";
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