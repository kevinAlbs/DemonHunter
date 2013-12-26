//methods for moving viewport and painting background
GM.viewport = (function(){
	var that = {};
	var xOffset = 0; //always positive

	var cWidth, cHeight, mapWidth;
	var leftMin = 0, rightMax = 0;//left/right bounds in pixesl

	var timeFactor = 0;//for time of day (currently unused TODO	)	
	var time = 1;

	var moon = document.getElementById("moon");
	var startMoonX = 720;
	var endMoonX = -50;
	var moonXSpeed = .001285; //takes ~10 minutes
	var moonX;
	/*
	 this is the absolute x and y of the player
	 changes offsets on viewport to follow player
	*/
	function updateOffsets(x,y){
		//to center x:
		xOffset = (x - cWidth / 5);
		if(xOffset < leftMin){
			xOffset = leftMin;
		}
		var rightBound = (rightMax - cWidth);
		if(xOffset > rightBound){
			xOffset = rightBound;
		}

	};

	that.init = function(cW, cH, mW){
		xOffset = 0;
		leftMin = 0;
		rightMax = 0;
		cWidth = cW;
		cHeight = cH;
		mapWidth = mW;
		rightMax = mapWidth * 10;
		moonX = startMoonX;
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
		
		if(moonX > endMoonX){
			moon.style.left = Math.round(moonX) + "px";
			moonX -= moonXSpeed * GM.game.delta;
		}

	};
	that.paint = function(ctx){

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
		return false;
	}

	return that;
}());
