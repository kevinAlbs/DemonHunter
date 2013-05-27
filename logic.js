
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


	function handleKeyDown(e){
		console.log(e.which);
		switch(e.which){
			case 39:
			keys.r = true;
			e.preventDefault();
			break;
			case 37:
			keys.l = true;
			e.preventDefault();
			break;
			case 38:
			keys.u = true;
			e.preventDefault();
			break;
			case 40:
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
		mapWidth = 2000;//in blocks
		document.addEventListener("keydown",handleKeyDown, false);
		document.addEventListener("keyup",handleKeyUp, false);
		GM.viewport.init(cWidth, cHeight, mapWidth);
		var ground = GM.viewport.getGround();
	
		cObs.player = new Player();
		cObs.player.setOnGround();//put player on ground

		//test with an enemy
		/*
		cObs.enemyTest = new Enemy();
		cObs.enemyTest.setX(200);
		cObs.enemyTest.setOnGround();
		*/
		//now generate trees, mobs, etc.
		cObs.trees = [];
		var inc = 80; //tells how spread apart trees are (smaller in forrest area)
		var acc = 0;//initially smaller
		for(var i = 0; i < mapWidth; i+=inc){
			var tree = new Tree((i + Math.ceil(Math.random() * 20)) * 10);
			inc += acc;
			if(inc <= 0){
				acc = 0;
				inc = 1;
			}
			if(i > mapWidth * 2 / 3){
				acc = 1; //less dense third of map
			}
			else if(i > mapWidth * 1 / 3){
				acc = -1; //denser third of map
			}
			tree.setOnGround();
			cObs.trees.push(tree);
		}
		//GM.textOverlay.show();
		//GM.textOverlay.say("Kaitlin", "Where am I?", null);
	}
	function checkCollisions(){
		//check important collisions
		//check if player's sword is colliding with enemies or leaves
		//check if sword is colliding
		var sword = cObs.player.getSword();
		if(sword){
			//check sword collisions
			/*if(sword.collidingWith(cObs.enemyTest)){
				console.log("colliding");
				if(!cObs.enemyTest.isHurt()){
					cObs.enemyTest.hurt(50);
					if(cObs.enemyTest.isDead()){
						//remove

					}
				}
			}*/
			//check with any trees in vicinity
		}
		

	}
	var d = new Date();
	var startTime = d.getTime();
	var ticks = 0;
	//TODO calculate real time diff and account for slow fps with extra updates etc.
	function update(){

		checkCollisions();

		if(keys.r){
			cObs.player.moveX(1);
		}
		else if(keys.l){
			cObs.player.moveX(-1);
		}
		else{
			cObs.player.moveX(0);
		}

		if(keys.u){
			cObs.player.jump();
		}
		
		if(keys.zp){
			cObs.player.swingSword();
		}	
		//update everything
		cObs.player.update();
		GM.viewport.update(cObs.player.getX(), cObs.player.getY());

		//cObs.enemyTest.update();
		paint();
//		GM.viewport.randomizeColor();
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
		ctx.clearRect(0,0,cWidth, cHeight);
		ctxout.clearRect(0,0,cWidth, cHeight);

		GM.viewport.paint(ctx);
		for(var i = 0; i < cObs.trees.length; i++){
			var tree = cObs.trees[i];
			if(GM.viewport.inScreenOverride(tree.getXWithLeaves(), tree.getWidthWithLeaves())){
				tree.paint(ctx);
			}
		}
		//paint player
		cObs.player.paint(ctx);
		//paint enemies
		//cObs.enemyTest.paint(ctx);
		ctx.fillStyle = "#F00";
		ctx.font = "30px Arial";
		ctx.fillText(curFPS + " fps", 100,200);
		ctxout.drawImage(buffer, 0, 0);
	};

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
	return that;
}());
