//methods for moving viewport and painting background
GM.viewport = (function(){
	var that = {};
	var xOffset = 0; //always positive

	var cWidth, cHeight, mapWidth;
	var leftMin = 0, rightMax = 0;//left/right bounds in pixels

	var timeFactor = 0;//for time of day (currently unused TODO	)	
	var time = 1;

	var moon = document.getElementById("moon");
	var startMoonX = 720;
	var endMoonX = -50;
	var moonXSpeed = .001285; //takes ~10 minutes
	var moonX;
	var NUM_LARGE_TREES = 14; //meaning 1-14
	var NUM_SMALL_TREES = 14;

	var largeTrees = [], smallTrees = [];

	var treesMade = false;
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
		var largeTreeLastX = 0, smallTreeLastX = 0;
		var ltcontainer = document.getElementById("large_tree_container");
		var smcontainer = document.getElementById("small_tree_container");
		if(!treesMade){
			var numArray = [];
			//make large trees
			for(var i = 1; i <= NUM_LARGE_TREES; i++){
				numArray.push(i);
			}
			//shuffle
			for(var i = 0; i < numArray.length; i++){
				var index = Math.floor(Math.random() * numArray.length);
				var tmp = numArray[index];
				numArray[index] = numArray[i];
				numArray[i] = tmp;
			}
			for(var i = 0; i < numArray.length; i++){
				largeTreeLastX += 150 + Math.random() * 1500;
				var img = document.createElement("img");
				img.src = "images/trees/large_" + numArray[i] + ".png";
				img.style.left = largeTreeLastX + "px";
				ltcontainer.appendChild(img);
				largeTrees.push({
					img : img,
					x: largeTreeLastX
				});
			}
			//make small trees
			numArray = [];
			for(var i = 1; i <= NUM_SMALL_TREES; i++){
				numArray.push(i);
			}
			//shuffle
			for(var i = 0; i < numArray.length; i++){
				var index = Math.floor(Math.random() * numArray.length);
				var tmp = numArray[index];
				numArray[index] = numArray[i];
				numArray[i] = tmp;
			}
			for(var i = 0; i < numArray.length; i++){
				smallTreeLastX += 50 + Math.random() * 500;
				var img = document.createElement("img");
				img.src = "images/trees/small_" + numArray[i] + ".png";
				img.style.left = smallTreeLastX + "px";
				smcontainer.appendChild(img);
				smallTrees.push({
					img : img,
					x: smallTreeLastX
				});
			}
			treesMade = true;
		}
		else{
			//reset their positions, do not create them though
			var largeTreeFirstX = false, smallTreeFirstX = false;
			for(var i = 0; i < largeTrees.length; i++){
				if(!largeTreeFirstX || largeTrees[i].x < largeTreeFirstX){
					largeTreeFirstX = largeTrees[i].x;
				}
			}
			//subtract off largeTreeFirstX
			for(var i = 0; i < largeTrees.length; i++){
				largeTrees[i].x -= largeTreeFirstX - Math.random() * 500;
			}
			for(var i = 0; i < smallTrees.length; i++){
				if(!smallTreeFirstX || smallTrees[i].x < smallTreeFirstX){
					smallTreeFirstX = smallTrees[i].x;
				}
			}
			//subtract off smalTreeFirstX
			for(var i = 0; i < smallTrees.length; i++){
				smallTrees[i].x -= smallTreeFirstX - Math.random() * 200;
			}

		}

		xOffset = 0;
		leftMin = 0;
		rightMax = 0;
		cWidth = cW;
		cHeight = cH;
		mapWidth = mW;
		rightMax = mapWidth * 10;
		moonX = startMoonX;
		//put the threes in random offsets (at least 100 away) since there are more than 10, you'll never see all of them on the screen

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
		//update tree offsets
		var largeTreeLastX = 0, smallTreeLastX = 0;
		var offscreen = null;
		for(var i = 0; i < largeTrees.length; i++){
			if(largeTrees[i].x > largeTreeLastX){
				largeTreeLastX = largeTrees[i].x;
			}
			var actualX = largeTrees[i].x - xOffset/1.5;
			largeTrees[i].img.style.left = actualX;
			if(actualX < -500){
				offscreen = largeTrees[i];
			}
		}
		if(offscreen != null){
			offscreen.x = largeTreeLastX + 150 + Math.random() * 1500;
		}
		offscreen = null;
		for(var i = 0; i < smallTrees.length; i++){
			if(smallTrees[i].x > smallTreeLastX){
				smallTreeLastX = smallTrees[i].x;
			}
			var actualX = smallTrees[i].x - xOffset/3;
			smallTrees[i].img.style.left = actualX;
			if(actualX < -500){
				offscreen = smallTrees[i];
			}
		}
		if(offscreen != null){
			offscreen.x = smallTreeLastX + 50 + Math.random() * 500;
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
