//methods for moving viewport and painting background
GM.viewport = (function(){
	var that = {};
	var xOffset = 0, //always positive
		yOffset = 0; // positive if player moving up

	var cWidth, cHeight, mapWidth;
	var leftMin = 0, rightMax = 0;//left/right bounds in pixesl
	var ground; // holds heights of ground at every area in map 
	var BGBuffer= null; // reference to the blocks being shown on the screen as well as their colors/types for color randomization
	/* 
		BGBuffer acts as a buffer so references of all of the 10x10 background blocks are not needed, only the ones being shown.
		The size of the LinkedList is the amount of blocks that the width of the screen can fit + 1 since when the player is moving
		there may be half of a block showing on either side
	*/
	var BGBufferFirstNode = 0; //index of ground array which the first node in the BGBuffer array points to
	var BGBufferOffset = 0;

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
	};

	function initBGBuffer(){
		BGBuffer = new BGBufferArray();
		//make the size of the LL 1 + amount of 10x10 blocks that fit in width of screen
		var bufferSize = cWidth/10 + 1;
		for(var i = 0; i < bufferSize; i++){
			var node = {
				pixels: new Array(cHeight/10)	
			};
			//generate random colors for sky/ground
			BGBuffer.addToRear(colorColumn(node, ground[i]));
		}
	};

	function updateBGBuffer(xOffset, yOffset){
		var targetFirstNode = Math.floor(xOffset / 10);
		//find the current xOffset and see the diff
		while(targetFirstNode > BGBufferFirstNode){
			//the user has moved to the right, increasing the xOffset
				console.log(xOffset);
				BGBufferFirstNode++;
				var nodeNum = cWidth/10 + BGBufferFirstNode;
				colorColumn(BGBuffer.shiftLeft(), ground[nodeNum]);	
		}	
		while(targetFirstNode < BGBufferFirstNode){
			console.log(xOffset);
			BGBufferFirstNode--;
			colorColumn(BGBuffer.shiftRight(), ground[BGBufferFirstNode]);	
		}


	};
	function getColor(row, type, ref){
		//if ref is defined, this is a pass by reference
		var cData;
		if(ref){
			cData = ref;
		}
		else{
			//create new object
			cData = {type: type};
		}	

		//apply scaled version timeFactor to background
		//0 <= timeFactor <= 1000
		
		switch(type){
			case 's':
				cData.r =  100 - row;
				cData.g = 120 + 2 * row;
				cData.b = Math.floor(Math.random() * 25) + 150 + 2 * row;
			break;
			case 'g':
				cData.r = 80 - 2 * row;
				cData.g = Math.floor(Math.random() * 25) + 180 - row;
				cData.b = 50 - 2 * row;
			break;
		}
		return cData;
	};
	function colorColumn(node, groundHeight){
		//eventually this can depend on where in the map the player is
		//which can be determined by the leftOffset	
		var skyLim = (node.pixels.length - groundHeight);
		for(var i = 0; i < skyLim; i++){
			node.pixels[i] = getColor(i, 's');
		}
		for(var j = skyLim; j < node.pixels.length; j++){
			node.pixels[j] = getColor(i, 'g');
		}
		return node;
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

		updateBGBuffer(xOffset, 0);
	};

	that.randomizeColor = function(){
		var col = Math.floor(Math.random() * BGBuffer.getSize());
		var row = Math.floor(Math.random() * (cHeight / 10));
		var nodeData = BGBuffer.getArr()[col];
		var curPixel = nodeData.pixels[row];
		getColor(row, curPixel.type, curPixel);
	};

	that.init = function(cW, cH, mW){
		cWidth = cW;
		cHeight = cH;
		mapWidth = mW;
		rightMax = mapWidth * 10;
		ground = new Array(mapWidth);
		generateTerrain();
		initBGBuffer();
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

		var node = BGBuffer.iterate();
		for(var i = 0; node != null; i++){
			for(var j = 0; j < node.pixels.length; j++){
				ctx.fillStyle = "rgb(" + node.pixels[j].r + "," + node.pixels[j].g + "," + node.pixels[j].b + ")";
				ctx.fillRect(-1 * xOffset % 10 + i * 10, j * 10, 10 , 10);	
			}
			node = BGBuffer.iterate();
		}
	
	};

	that.getGround = function(){
		return ground;
	}
	that.getXOffset = function(){
		return xOffset;
	};





	return that;
}());