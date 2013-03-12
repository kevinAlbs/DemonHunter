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
			playerx += 3;
		}
		if(keys.l){
			playerx -= 3;
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
