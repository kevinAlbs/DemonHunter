//singleton
GM.enemyList = (function(){
	var that = {};
	var root = null;//since platforms only have the extra next/prev properties, I'm going to use Movable objects
	var rear = null;
	var cur = null;

	that.getRoot = function(){
		return root;
	}
	/*
	From experimentation, seems like maximum y difference is 119 away (up) in exactly 11 frames (I think)
	The maximum x will depend on y. I will have to figure this out later.

	This will generate platforms on the end of the linked list
	*/
	that.generateEnemies = function(platform, difficulty){
		var pNode = platform;
		if(pNode == null){
			return;
		}
		if(root == null){
			root = new Centaur(pNode);
			root.next = null;
			root.prev = null;
			rear = root;
		}
		for(var p = pNode.next; p != null; p = p.next){
			var newObj = new Centaur(p);
			rear.next = newObj;
			newObj.prev = rear;
			newObj.next = null;
			rear = newObj;
		}
	};

	that.cleanUp = function(){
		//cleans up old platforms
		var prev = null;
		var ptr = root;
		while(ptr != null){
			if(ptr.getX() + ptr.getWidth() - GM.viewport.getXOffset() < 0){
				console.log("Removing enemy");
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
			else if(!ptr.isActivated()){
				break;//in order by x values, so break at point when no more are off screen
			}
			prev = ptr;
			if(ptr){
				ptr = ptr.next;
			}
		}
	};
	
	return that;
}());