
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
			d: false,
			z: false,//letter z
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
			case 90:
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
		
		cObs.player = new Player();
		cObs.player.setOnGround();//put player on ground

		//test with an enemy
		cObs.enemyTest = new Enemy();
		cObs.enemyTest.setX(200);
		cObs.enemyTest.setOnGround();
		//now generate trees, mobs, etc.
	}
	function checkCollisions(){
		//check important collisions
		//check if player's sword is colliding with enemies or leaves
		
	}
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
		
		if(keys.z){
			cObs.player.swingSword();
		}	
		//update everything
		cObs.player.update();
		GM.viewport.update(cObs.player.getX(), cObs.player.getY());

		cObs.enemyTest.update();
		paint();
		GM.viewport.randomizeColor();
		if(!paused){
			timer = window.setTimeout(update, Math.floor(1000 / fps));
		}
	};

	function paint(){
		ctx.clearRect(0,0,cWidth, cHeight);
		GM.viewport.paint(ctx);
		cObs.player.paint(ctx);
		cObs.enemyTest.paint(ctx);
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
	that.inScreen = function(obj){
		return GM.viewport.inScreen(obj);
	}
	that.getPlayerX = function(){return cObs.player.getX();}
	that.getPlayerWidth = function(){return cObs.player.getWidth();}
	return that;
}());
