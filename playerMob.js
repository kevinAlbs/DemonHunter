function playerMob(){
	var that = {};
	var x = 0, 
		y = 0, 
		xVel = 0,
		yVel = 3,
		width = 22, 
		height = 60;
	var xSpeed = 4;
	that.getX = function(){return x;}
	that.getY = function(){return y;}
	that.update = function(){
		var ground = GM.logic.getGround(x, x+width);
		var cHeight = GM.logic.getCHeight();

		//see if about to hit ground or if off of ground
		var highest = 0; 
		for(var i = 0; i < ground.length; i++){
			if(ground[i] > highest){
				highest = ground[i];	
			}
		}
		var actualHeight = cHeight - highest * 10;
		console.log(actualHeight);
		if(y + yVel + height > actualHeight){
			y = actualHeight - height;
			yVel = 0;
		}
		else if(yVel == 0){
			//this means that was on the ground but no longer is
			//not on ground, try falling again
			yVel = 3;
			return;
		}
		x += xVel;
		y += yVel;

	};
	that.paint = function(ctx){
		ctx.fillRect(x,y,width, height);
	};
	that.moveX = function(dir){
		xVel = dir * xSpeed;
	};
	
	return that;	
};