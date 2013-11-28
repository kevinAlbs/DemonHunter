
/*
 * @class main
 * singleton
 * contains game logic
 * acts as mediator
 */
GM.main = (function(){
	var that = {};
	var	paused= false,
		movementPaused = false,//used for cutscenes, stops user movment
		started= false,
		timer= null,
		fps= 30,
		curFPS = 0,
		cWidth, // canvas width
		cHeight,
		mapWidth, //map width (in tens)
		ctx, //canvas buffer context
		buffer,
		ctxout,
		keys= {
			l: false, //left
			r: false, //right
			u: false,
			d: false,
			z: false,//letter z
			zp: false, //true when z is PRESSED ONCE!
			s: false //space
		},
		//collidable objects, categorized for ease of use
		//make into linked lists
		cObs = {
		};
		cObsInScreen = { //updated with objects in screen
		};


	function handleKeyDown(e){
		console.log(e.which);
		switch(e.which){
			case 39:
			case 68:
			keys.r = true;
			e.preventDefault();
			break;
			case 37:
			case 65:
			keys.l = true;
			e.preventDefault();
			break;
			case 38:
			case 87:
			keys.u = true;
			e.preventDefault();
			break;
			case 40:
			case 83:
			keys.d = true;
			e.preventDefault();
			break;
			case 32:
			keys.s = true;
			e.preventDefault();
			break;
			case 90:
			keys.zp = !keys.z;//z is pressed when z was not already being pressed
			keys.z = true;
			e.preventDefault();
			break;
		}
	};

	function handleKeyUp(e){
		switch(e.which){
			case 39:
			case 68:
			keys.r = false;
			break;
			case 37:
			case 65:
			keys.l = false;
			break;
			case 38:
			case 87:
			keys.u = false;
			break;
			case 40:
			case 83:
			keys.d = false;
			break;
			case 90:
			keys.z = false;
			keys.zp = false;
			break;
			case 32:
			keys.s = false;
			e.preventDefault();
			break;
		}
		e.preventDefault();
		return false;
	};

	function init(){
		buffer = document.createElement("canvas");
		var cnv = document.getElementById("mycanvas");
		buffer.width = cnv.width;
		buffer.height = cnv.height;
		ctx = buffer.getContext("2d");
		ctxout = cnv.getContext("2d");
		cWidth = cnv.width;
		cHeight = cnv.height;
		mapWidth = 500;//in blocks
		document.addEventListener("keydown",handleKeyDown, false);
		document.addEventListener("keyup",handleKeyUp, false);
		GM.platformList.generatePlatforms(200);
		GM.viewport.init(cWidth, cHeight, mapWidth);
		var ground = GM.viewport.getGround();
	
		cObs.player = new Player();
		//cObs.player.setOnGround();//put player on ground

		//test with an enemy
		/*
		cObs.enemyTest = new Enemy();
		cObs.enemyTest.setX(200);
		cObs.enemyTest.setOnGround();
		*/
	}
	function checkCollisions(){
		//check bullet collisions
	}
	var d = new Date();
	var startTime = d.getTime();
	var ticks = 0;
	//TODO calculate real time diff and account for slow fps with extra updates etc.
	function update(){

		checkCollisions();
		if(!movementPaused){
			if(keys.r){
				cObs.player.moveX(1);
			}
			else if(keys.l){
				cObs.player.moveX(-1);
			}
			else{
				cObs.player.unMoveX();
			}
			if(keys.u){
				cObs.player.jump();
			}
			else{
				cObs.player.unjump();
			}
			if(keys.d){
				cObs.player.duck();
			}
			else{
				cObs.player.unduck();
			}
			if(keys.zp){
				cObs.player.swingSword();
			}	
		}
		else{
			cObs.player.moveX(0);//no moving during cutscenes!
		}

		if(keys.s || keys.zp){
			GM.textOverlay.progress();//go to next line!
		}
		//update everything
		cObs.player.update();
		GM.viewport.update(cObs.player.getX(), cObs.player.getY());

		//cObs.enemyTest.update();
		paint();

		if(!paused){
			timer = window.setTimeout(update, Math.floor(1000 / fps)); //TODO: change to requestAnimationKeyframe or something
		}
		//now that update has run, set all key presses to false
		keys.zp = false;

		GM.textOverlay.update();

		
		ticks++;
		d = new Date();
		if(d.getTime() - startTime > 1000){
			curFPS = ticks;
			ticks = 0;
			startTime = d.getTime();
		}
	};

	function paint(){
		//ctx.clearRect(0,0,cWidth, cHeight);
		//ctxout.clearRect(0,0,cWidth, cHeight);
		GM.viewport.paint(ctx);
		//paint player
		cObs.player.paint(ctx);
		//paint enemies
		//cObs.enemyTest.paint(ctx);
		ctx.strokeStyle = "#00F";
		ctx.font = "11px Arial";
		ctx.fillText(curFPS + " fps", 5,10);
		for(var p = GM.platformList.getRoot(); p != null; p = p.next){
			if(p.hasOwnProperty("color")){
				ctx.strokeStyle = p.color;
			}
			else{
				ctx.strokeStyle = "#00F";
			}
			ctx.strokeRect(p.getX() - GM.viewport.getXOffset(), p.getY(), p.getWidth(), p.getHeight());
		}
		ctxout.drawImage(buffer, 0, 0);
	};

	function toggleMovement(val){
		movementPaused = val;
	}
	/* public methods */
	that.startGame = function(){
		console.log("Game started");
		init();
		update();
	}

	/* deps is defined as an array of objects describing media type:
	[{
		type: 'img',
		src: 'filepath.jpg',
		name: 'spritesheet'
	}]
	name is final name in GM.deps
	*/
	that.loadDependencies = function(deps, callback){
		var total = deps.length, loadedTotal = 0;
		GM.deps = {};
		function loaded(){
			loadedTotal++;
			if(loadedTotal == total){
				//finished loading all dependencies
				callback.call(window);
			}
		}
		//load each one
		for(var i = 0; i < deps.length; i++){
			switch(deps[i].type){
				case "img":
					//load image
					var img = new Image();
					img.onload = loaded;
					img.src = deps[i].src;
					GM.deps[deps[i].name] = img;
				break;
			}
		}
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
	that.getCWidth = function(){return cWidth;}
	that.getMapWidth = function(){return mapWidth * 10;}
	that.inScreen = function(obj){
		return GM.viewport.inScreen(obj);
	}
	that.getPlayerX = function(){return cObs.player.getX();};
	that.getPlayerWidth = function(){return cObs.player.getWidth();};
	that.generateParticles = function(stg){
		//to be implemented
		
	};
	that.cutscene = function(cutsceneData, additionalCallback){
		toggleMovement(true); 
		GM.textOverlay.show();
		var cb = function(){
			toggleMovement(false); 
			GM.textOverlay.hide(); 
			if(additionalCallback){
				additionalCallback.call();
			}
		};
		GM.textOverlay.startCutscene(cutsceneData, cb);
	};
	that.collisionDebug = true;
	return that;
}());