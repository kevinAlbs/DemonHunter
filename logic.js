
/*
 * contains game logic
 * acts as mediator
 */
GM.logic = (function(){
	var that = {};
	var	paused= false,
		started= false,
		timer= null,
		fps= 60,
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

	var player = new playerMob();

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
		mapWidth = 800;
		document.addEventListener("keydown",handleKeyDown, false);
		document.addEventListener("keyup",handleKeyUp, false);
		GM.viewport.init(cWidth, cHeight, mapWidth);
		var ground = GM.viewport.getGround();
		//now generate trees, mobs, etc.
	}
	//TODO calculate real time diff and account for slow fps with extra updates etc.
	function update(){
		if(keys.r){
			player.moveX(1);
		}
		else if(keys.l){
			player.moveX(-1);
		}
		else{
			player.moveX(0);
		}

		if(keys.u){
			player.jump();
		}
		
		player.update();
		GM.viewport.update(player.getX(), player.getY());
		paint();
		GM.viewport.randomizeColor();
		if(!paused){
			timer = window.setTimeout(update, Math.floor(1000 / fps));
		}
	};

	function paint(){
		ctx.clearRect(0,0,cWidth, cHeight);
		GM.viewport.paint(ctx);
		player.paint(ctx);
	};

	/* public methods */
	that.startGame = function(){
		console.log("Game started");
		init();
		update();
	}
	//returns ground from x1 to x2
	that.getGround = function(x1, x2){
		var ground = GM.viewport.getGround();
		var e1 = Math.floor(x1/10);
		var e2 = Math.ceil(x2/10);
		if(e1 < 0) e1 = 0;
		if(e2 > ground.length) e2 = ground.length;
		return ground.slice(e1, e2);
	};
	that.getXOffset = function(){
		return GM.viewport.getXOffset();
	}
	that.getCHeight = function(){return cHeight;}
	return that;
}());
