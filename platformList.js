//singleton
GM.platformList = (function(){
	var that = {};
	var root = null;//since platforms only have the extra next/prev properties, I'm going to use Movable objects
	var cur = null;

	that.getRoot = function(){
		return root;//will probably change
	}

	that.generatePlatforms = function(num){
		if(num <= 0){
			return;
		}
		root = new Movable();
		root.setX(10);
		root.setY(200);
		root.setWidth(100);
		root.setHeight(10);
		root.next = null;
		root.prev = null;
		var rear = root;
		num--;
		for(var i = 1; i < num; i++){
			var newObj = new Movable();
			newObj.setX(70 * i);
			newObj.setY(200 + Math.floor(Math.random() * 100) - 50);
			newObj.setWidth(100);
			newObj.setHeight(10);
			rear.next = newObj;
			newObj.prev = rear;
			newObj.next = null;
			rear =  newObj;
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
		if(aDiff < mhw + phw + Math.abs(m.getXVel()) + 2){
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
		if(aDiff < mhh + phh + Math.abs(m.getYVel()) + 2){
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
	return that;
}());