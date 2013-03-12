//circular linked list
function LinkedList(){
	function Node(data){
		this.data = data;
		this.next = null;
		this.prev = null;
	};
	var that = {};
	var rear = null,
		iterator = null,
		size = 0;
	var arr = null;

	that.addToRear = function(data){
		size++;
		var newNode = new Node(data, null);
		if(rear == null){
			rear = newNode;
			newNode.next = rear;
			newNode.prev = rear;
		}
		else{
			newNode.next = rear.next;	
			newNode.prev = rear;
			rear.next.prev = newNode;
			rear.next = newNode;
			rear = newNode;
		}
	};

	that.getArr = function(){
		//returns an array of access for randomizing colours
		//note that since the linked list shifts, the array maintains no order
		//this is only useful for randomization
		if(arr == null){
			//initialize
			var i = 0;
			arr = new Array(that.getSize());
			var ptr = rear.next;
			do{	
				arr[i] = ptr.data;
				i++;
				ptr = ptr.next;
			}while(ptr != rear.next);
		}
		return arr;
	}

	/* shifts linked list to the right, moving the rear node to the front
	 * returns the node that was just shifted's data
	 */
	that.shiftRight = function(){
		rear = rear.prev;
		return rear.next.data;
	};

	that.shiftLeft = function(){
		rear = rear.next;
		return rear.data;
	};

	that.getSize = function(){
		return size;
	};

	that.iterate = function(){
		var dataToReturn = null;
		if(iterator == null){
			dataToReturn = rear.next.data;
			//first call
			iterator = rear.next.next;
			return dataToReturn;	
		}
		else{
			if(iterator == rear.next){
				iterator = null;
				return null;
				//iteration complete
			}
			else{
				dataToReturn = iterator.data;
				iterator = iterator.next;
				return dataToReturn;	
			}
		}
	};

	return that;
};

var GM = {};
/*
 * contains game logic
 * acts as mediator
 */
GM.logic = (function(){
	var that = {};
	var	paused= false,
		started= false,
		timer= null,
		fps= 10,
		cWidth, // canvas width
		cHeight,
		mapWidth, //map width (in tens)
		ctx, //canvas context
		keys= {
			l: false, //left
			r: false, //right
			u: false,
			d: false
		};

	var playerx = 400, playery = 100;//temps for testing viewport
	function handleKeyDown(e){
		//console.log(e.which);
		switch(e.which){
			case 39:
			keys.r = true;
			break;
			case 37:
			keys.l = true;
			break;
			case 38:
			keys.u = true;
			break;
			case 40:
			keys.d = true;
			break;
		}
		e.preventDefault();
		return false;
	};

	function handleKeyUp(e){
		switch(e.which){
			case 39:
			keys.r = false;
			break;
			case 37:
			keys.l = false;
			break;
			case 38:
			keys.u = false;
			break;
			case 40:
			keys.d = false;
			break;
		}
		e.preventDefault();
		return false;
	};

	function init(){
		var cnv = document.getElementById("mycanvas");
		ctx = cnv.getContext("2d");
		cWidth = cnv.width;
		cHeight = cnv.height;
		mapWidth = 160;
		document.addEventListener("keydown",handleKeyDown, false);
		document.addEventListener("keyup",handleKeyUp, false);
		GM.viewport.init(cWidth, cHeight, mapWidth);
		var ground = GM.viewport.getGround();
		//now generate trees, mobs, etc.
	}
	//TODO calculate real time diff and account for slow fps with extra updates etc.
	function update(){
		if(keys.r){
			playerx += 15;
		}
		if(keys.l){
			playerx -= 15;
		}
		GM.viewport.updateOffsets(playerx, playery);
		paint();
		GM.viewport.randomizeColor();
		if(!paused){
			timer = window.setTimeout(update, Math.floor(1000 / fps));
		}
	};

	function paint(){
		ctx.clearRect(0,0,cWidth, cHeight);
		GM.viewport.paint(ctx);
	};

	/* public methods */
	that.startGame = function(){
		console.log("Game started");
		init();
		update();
	}
	return that;
}());

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
		BGBuffer = new LinkedList();
		//make the size of the LL 1 + amount of 10x10 blocks that fit in width of screen
		var bufferSize = cWidth/10 + 1;
		for(var i = 0; i < bufferSize; i++){
			var node = {
				pixels: new Array(cHeight/10)	
			};
			//generate random colors for sky/ground
			BGBuffer.addToRear(colorColumn(node, ground[i]));
		}
		console.log("BGBuffer:");
	};

	function updateBGBuffer(xOffset, yOffset){
		var targetFirstNode = Math.floor(xOffset / 10);
		//find the current xOffset and see the diff
		while(targetFirstNode > BGBufferFirstNode){
			//the user has moved to the right, increasing the xOffset
				console.log("Shift left");
				console.log(xOffset);
				BGBufferFirstNode++;
				var nodeNum = cWidth/10 + BGBufferFirstNode;
				colorColumn(BGBuffer.shiftLeft(), ground[nodeNum]);	
		}	
		while(targetFirstNode < BGBufferFirstNode){
			console.log("Shift right");
			console.log(xOffset);
			BGBufferFirstNode--;
			colorColumn(BGBuffer.shiftRight(), ground[BGBufferFirstNode]);	
		}


	};
	function getColor(type, ref){
		//if ref is defined, this is a pass by reference
		var cData;
		if(ref){
			cData = ref;
		}
		else{
			//create new object
			cData = {type: type};
		}	
		switch(type){
			case 's':
				cData.r =  120;
				cData.g = 220;
				cData.b = Math.floor(Math.random() * 25) + 210;
			break;
			case 'g':
				cData.r = 80;
				cData.g = Math.floor(Math.random() * 25) + 180;
				cData.b = 50;
			break;
		}
		return cData;
	};
	function colorColumn(LLNode, groundHeight){
		//eventually this can depend on where in the map the player is
		//which can be determined by the leftOffset	
		var skyLim = (LLNode.pixels.length - groundHeight);
		for(var i = 0; i < skyLim; i++){
			LLNode.pixels[i] = getColor('s');
		}
		for(var j = skyLim; j < LLNode.pixels.length; j++){
			LLNode.pixels[j] = getColor('g');
		}
		return LLNode;
	};
	that.randomizeColor = function(){
		var col = Math.floor(Math.random() * BGBuffer.getSize());
		var row = Math.floor(Math.random() * (cHeight / 10));
		var nodeData = BGBuffer.getArr()[col];
		var curPixel = nodeData.pixels[row];
		getColor(curPixel.type, curPixel);
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
	/*
	 this is the absolute x and y of the player
	*/
	that.updateOffsets = function(x,y){
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

	return that;
}());

window.addEventListener("load", function(){GM.logic.startGame();});