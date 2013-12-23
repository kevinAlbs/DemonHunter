//singleton
GM.platformList = (function(){
	var that = {};
	var root = null;//since platforms only have the extra next/prev properties + spikes, I'm going to use Movable objects
	var rear = null;
	var cur = null;

	that.getRoot = function(){
		return root;//will probably change
	}

	/*
	passed array should be of form:
	[range_start, range_end, prob, range_start, range_end, prob, ...]
	Probabilities should sum to 1
	*/
	function pdf(arr){
		var m = Math.random();
		var totalProb = 0;
		for(var i = 0; i < arr.length-2; i += 3){
			totalProb += arr[i+2];
			if(m < totalProb){
				//random number between arr[i] and arr[i+1]
				var diff = arr[i+1]-arr[i];
				return parseInt(arr[i] + Math.random() * diff);
			}
		}
	}

	function makePlatform(special, curX, curY, curWidth, difficulty, exactYAway){
		var newObj = new Platform();
		if(special == "first"){
			newObj.setX(10);
			newObj.setWidth(500);
			newObj.setY(300);
			newObj.setHeight(10);
			return newObj;
		}
		else if(difficulty == 1){
			var xDiff = 20 + pdf([50,60,.1, 61,80,.4, 81,100,.5]);
			curX = curX + curWidth + xDiff;
			if(exactYAway){
				curY += exactYAway;
			}
			else{
				var flip = 1;
				if(Math.random() - .5 < 0){
					flip = -1;
				}
				var yDiff = 40 + pdf([0,10,.3, 11,20,.3, 20,30,.3, 40,50,.1]);
				curY = curY + yDiff * flip;
			}
			curWidth = 600 + (Math.random() * 50) - 25;

			//small chance of weird platform
			curWidth = pdf([100,100,.05, 1000,1000,.05, 550,650,.9]);

			
		}


		newObj.setX(curX);
		
		if(curY < 150){
			curY = 150;
		}
		if(curY > 550){
			curY = 550;
		}
		newObj.setY(curY);
		
		newObj.setWidth(curWidth);
		newObj.setHeight(10);

		//depending on width, add spikes
		//add spikes to large platforms
		if(newObj.getWidth() > 100){
			//newObj.addSpikes(10);
		}

		return newObj;
	}
	/*
	From experimentation, seems like maximum y difference is 119 away (up) in exactly 11 frames (I think)
	The maximum x will depend on y. I will have to figure this out later.

	This will generate platforms on the end of the linked list
	*/
	that.generatePlatforms = function(num, difficulty){
		if(num <= 0){
			return;
		}
		
		if(root == null){
			root = makePlatform("first");
			rear = root;
			num--;
		}
		else{
			curX = rear.getX();
			curWidth = rear.getWidth();
			curY = rear.getY();
		}

		for(var i = 0; i < num; i++){
			var curX = rear.getX();
			var curY = rear.getY();
			var curWidth = rear.getWidth();
			var newObj = makePlatform("", curX, curY, curWidth, 1);
			rear.next = newObj;
			newObj.prev = rear;
			newObj.next = null;				
			rear =  newObj;
			/*
			if(Math.random() - .5 < 0){
				//make another object at the same location at least 1.5 * height away
				var targY = rear.getY();
				var targX = rear.getX();
				var targWidth = rear.getWidth();
				if(targY < 550 - 80 && targY > 250){
					//we don't want to make two platforms right on top of each other
					var flip = 1;
					if(Math.random() - .5 < 0){
						flip = -1;
					}
					newObj = makePlatform("", curX, targY, curWidth, 1, flip * pdf([100,110,.5, 110,130,.5]));
					newObj.setWidth(targWidth * 3/2);
					if(newObj.getX() < targX){
						newObj.setX(targX + 10);
					}
					rear.next = newObj;
					newObj.prev = rear;
					newObj.next = null;				
					rear =  newObj;
				}
			}
			*/
		}
	};
	/** @param m Movable - the object
	    @param p Movable - the platform
	    @return Integer - -1 if m's x is less, 0 if possible, 1 if greater
	 */
	that.collPossibleX = function(m, p){
		var mhw = m.getWidth()/2;//half width
		var phw = p.getWidth()/2;
		var mcx = m.getX() + mhw;//center x
		var pcx = p.getX() + phw;
		var sDiff = mcx - pcx; //signed difference
		var aDiff = Math.abs(sDiff);
		if(aDiff < mhw + phw + (Math.abs(m.getXVel()) * GM.game.delta) + 2){
			return 0;
		}
		else{
			if(sDiff < 0){
				return -1;
			}
			else{
				return 1;
			}
		}
	};
	that.collPossibleY = function(m, p){
		var mhh = m.getHeight()/2;//half width
		var phh = p.getHeight()/2;
		var mcy = m.getY() + mhh;//center x
		var pcy = p.getY() + phh;
		var sDiff = mcy - pcy; //signed difference
		var aDiff = Math.abs(sDiff);
		if(aDiff < mhh + phh + (Math.abs(m.getYVel()) * GM.game.delta) + 2){
			return 0;
		}
		else{
			if(sDiff < 0){
				return -1;
			}
			else{
				return 1;
			}
		}
	};

	that.cleanUp = function(){
		//cleans up old platforms
		var prev = null;
		var ptr = root;
		while(ptr != null){
			if(ptr.getX() + ptr.getWidth() - GM.viewport.getXOffset() < 0){
				console.log("Removing");
				//remove
				if(prev == null){
					root = ptr.next;
					if(ptr.next){
						ptr.next.prev = null;
					}
					ptr = ptr.next;
				}
				else{
					prev.next = ptr.next;
					if(ptr.next){
						ptr.next.prev = prev;
					}
					ptr = prev;
				}
			}
			else{
				break;//in order by x values, so break at point when no more are off screen
			}
			prev = ptr;
			if(ptr){
				ptr = ptr.next;
			}
		}
	};

	that.attach = function(m, p){
		m.setY(p.getY() - p.getHeight() - m.getHeight());
	}
	
	that.destroy = function(){
		root = null;
	};
	
	return that;
}());