	
/*
 * @class game
 * singleton
 * contains game logic
 * acts as mediator for all game classes
 */
GM.game = (function(){
	var that = {};
	that.mapTest = true;
	that.bulletsCollideWithPlatforms = true;
	that.collisionDebug = true; //when I was testing, TODO: remove this
	that.delta = 0;	
	var	paused= false, //if true, it will still update, but not run anything
		movementPaused = false,//used for cutscenes, stops user movment
		started= false, //if false it won't keep updating, set to true on the first init
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
		mouse = {
			pressed: false,
			x: cWidth,
			y: cHeight/2
		},
		player = null,
		HUD = {
			health : document.getElementById("health_amt"),
			ammo : document.getElementById("ammo_amt"),
			score: document.getElementById("score_amt")
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
	}

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
	}
	function handleMousemove(e){
		mouse.x = e.offsetX;
		mouse.y = e.offsetY;
	}
	function handleMousedown(e){
		mouse.pressed = true;
		mouse.x = e.offsetX;
		mouse.y = e.offsetY;
	}
	function handleMouseup(){
		mouse.pressed = false;
	}

	//data is exported object from builder
	function buildFromData(data){
		GM.platformList.importPlatforms(data.platforms);
		GM.enemyList.importEnemies(data.enemies);
	}

	//update map data to start at specified xOff
	function updateXCoords(frag, xOff){
		for(var i = 0; i < frag.platforms.length; i++){
			var p = frag.platforms[i];
			p.x += xOff;
			for(var j = 0; j < p.spikes.length; j++){
				p.spikes[j].x += xOff;
			}
			for(var j = 0; j < p.pickups.length; j++){
				p.pickups[j].x += xOff;
			}
		}
		for(var i = 0; i < frag.enemies.length; i++){
			frag.enemies[i].x += xOff;
		}
	}

	function makeGlue(){
		//TODO
	}

	//tie all map fragments together with glue
	function buildMap(){
		var xOff = 0;
		//for now just append all of them
		var frags = GM.data.mapFragments;
		if(!frags || frags.length == 0){
			return;//need at least one fragment
		}
		//arrange by difficulty
		var diff = {1:[],2:[],3:[],4:[],5:[]};
		for(var i = 0; i < frags.length; i++){
			diff[frags[i].difficulty].push(frags[i]);
		}
		//now diff is a map from difficulty to map fragments
		
		var output = {
			platforms: [],
			enemies: [],
			playerX: -1,
			playerY: -1
		};
		output.playerX = frags[0].data.playerX;
		output.playerY = frags[0].data.playerY;
		for(var i = 0; i < frags.length; i++){
			updateXCoords(frags[i].data, xOff);
			var last = frags[i].data.platforms[frags[i].data.platforms.length-1];
			xOff = last.x + last.width;
			output.platforms = output.platforms.concat(frags[i].data.platforms);
			output.enemies = output.enemies.concat(frags[i].data.enemies);
		}
		console.log(xOff); //~4.28 minutes
		buildFromData(output);
	}

	function init(){
		var cnv = document.getElementById("mycanvas");
		ctx = cnv.getContext("2d");
		ctx.strokeStyle = "#00F";
		//ctx.webkitImageSmoothingEnabled = false;
		cWidth = cnv.width;
		cHeight = cnv.height;
		mapWidth = 50000;//in blocks

		if(GM.game.mapTest){
			buildMap();
			player = new Player();
		}
		else if(GM.data.hasOwnProperty("builder")){
			//builder debugging, import data
			buildFromData(GM.data.builder.output);
			player = new Player();
			player.setX(GM.data.builder.output.playerX);
			player.setY(GM.data.builder.output.playerY);
		}
		else{
			GM.platformList.generatePlatforms(200, 1);
			GM.enemyList.generateEnemies(GM.platformList.getRoot().next);
			player = new Player();
		}

		GM.viewport.init(cWidth, cHeight, mapWidth);
		that.p = player;
		paused = false;
		that.updateHUD();
		if(!started){
			requestAnimationFrame(update);//start updating process
			started = true;
		}
	}

	//called to clean up objects/listeners before restarting
	//this can safely be called even if the game is already destroyed
	function destroy(){
		paused = true;
		player = null;
		GM.platformList.destroy();
		GM.enemyList.destroy();
	}
	function checkCollisions(){
		var i = GM.enemyList.checkFireBallCollisions(player);
		if(i.length > 0){
			player.hurt(i.length * 5);
		}
		for(var e = GM.enemyList.getRoot(); e != null; e = e.next){
			if(e.isActivated()){
				//check collisions between player and enemies
				if(!e.isDead() && e.collidingWith(player)){
					player.hurt(10);
				}
			}
			else{
				break;
			}
		}
		for(var p = GM.platformList.getRoot(); p != null; p = p.next){
			if(p.getX() > player.getX()){ //beyond possibility of player
				break;
			}
			//else
			if(p.collisionWithSpikes(player) != null){
				player.hurt(1);
			}
			//check collisions with pickups
			var pickups = p.collisionWithPickups(player, true);
			for(var i = 0; i < pickups.length; i++){
				var pi = pickups[i];
				if(pi.getType() == "health"){
					player.gainHealth(10);
					that.updateHUD();
				}
				else if(pi.getType() == "ammo"){
					player.gainAmmo(20);
					that.updateHUD();
				}
			}
		}
	}
	var d = new Date();
	var ticks = 0;
	var timeCount = 0;
	var prevTime = null;

	function update(timestamp){
		if(prevTime == null || paused){
			//continue to update, but do nothing
			prevTime =  timestamp;
			requestAnimationFrame(update);
			return;
		}
		
		var newTime = timestamp;
		GM.game.delta = newTime - prevTime;
		prevTime = newTime;

		checkCollisions();
		var movementDebug = true;
		if(!movementPaused){
			if(keys.r){
				if(movementDebug)
					player.moveX(1);
				else
					player.moveX(1.2);
			}
			else if(keys.l){
				if(movementDebug)
					player.moveX(-1);
				else
					player.moveX(.7);
			}
			else{
				if(movementDebug)
					player.unMoveX();
				else
					player.moveX(1);
			}
			if(keys.u){
				player.jump();
			}
			else{
				player.unjump();
			}
			if(keys.d){
				player.barrelRoll();
			}
			else{
				player.unBarrelRoll();
			}
			if(mouse.pressed){
				player.mouseUpdate(mouse.x, mouse.y);
				player.shoot();
			}
			else{
				player.unlockShot();
				player.mouseUpdate(mouse.x, mouse.y);
			}
		}
		else{
			player.moveX(0);//no moving during cutscenes!
		}

		if(keys.s || keys.zp){
			GM.textOverlay.progress();//go to next line!
		}
		//update everything
		player.update();
		GM.viewport.update(player.getX(), player.getY());
		GM.enemyList.updateFireBalls();
		for(var e = GM.enemyList.getRoot(); e != null; e = e.next){
			if(e.isActivated()){
				e.update();	
			}
			else{
				break;
			}
		}

		paint();

		
		//now that update has run, set all key presses to false
		keys.zp = false;

		GM.textOverlay.update();
		GM.particleList.update();
		
		ticks++;
		var now = new Date().getTime();
		timeCount += now - prevTime;
		if(timeCount > 1000){
			curFPS = ticks;
			ticks = 0;
			timeCount = 0;
		}
		//prevTime = now;
		GM.platformList.cleanUp();
		GM.enemyList.cleanUp();
		
		
		requestAnimationFrame(update);
	};

	function paint(){
		ctx.clearRect(0,0,cWidth, cHeight);
		GM.viewport.paint(ctx);
		//paint player
		player.paint(ctx);
		//paint enemies
		for(var p = GM.enemyList.getRoot(); p != null; p = p.next){
			if(!p.isActivated()){
				break;
			}
			p.paint(ctx);
		}
		GM.enemyList.paintFireBalls(ctx);
		//
		//ctx.font = "11px Arial";
		//ctx.fillText(curFPS + " fps", 5,10);
		//I could potentially move the following block of code into platformList
		//This works assuming the platformList is removing platforms to the left of the screen (so the root is in screen)
		for(var p = GM.platformList.getRoot(); p != null; p = p.next){
			if(p.getX() > player.getX() && !GM.viewport.inScreen(p)){ //beyond bounds stop drawing
				break;
			}
			if(p.hasOwnProperty("color")){
				//ctx.strokeStyle = p.color;
			}
			else{
				//ctx.strokeStyle = "#00F";
			}
			p.paint(ctx);
			//ctx.strokeRect(p.getX() - GM.viewport.getXOffset(), p.getY(), p.getWidth(), p.getHeight());
		}
		GM.particleList.paint(ctx);
		//ctxout.clearRect(0,0,cWidth,cHeight);
		//ctxout.drawImage(buffer, 0, 0);

	};

	function toggleMovement(val){
		movementPaused = val;
	}
	/* public methods */
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
				case "sound":
					var aud = new Audio();
					aud.preload = "auto";
					aud.addEventListener("canplaythrough", loaded, true);
					aud.src = deps[i].src;
					GM.deps[deps[i].name] = aud;
				break;
			}
		}
	};

	//add or remove all listeners
	that.toggleListeners = function(val){
		var fn = val + "EventListener";
		var cnv = document.getElementById("mycanvas");
		document[fn]("keydown",handleKeyDown, false);
		document[fn]("keyup",handleKeyUp, false);
		cnv[fn]("mousedown", handleMousedown, false);
		cnv[fn]("mouseup", handleMouseup, false);
		cnv[fn]("mousemove", handleMousemove, false);
	};

	that.startGame = function(){
		console.log("Game started");
		destroy();
		init();
	};

	
	that.getXOffset = function(){
		return GM.viewport.getXOffset();
	};

	that.getCHeight = function(){return cHeight;}
	that.getCWidth = function(){return cWidth;}
	that.getMapWidth = function(){return mapWidth * 10;}
	that.inScreen = function(obj){
		return GM.viewport.inScreen(obj);
	}
	that.getPlayerWalking = function(){return player.getWalkingSpeed();};
	that.getPlayerXVel = function(){return player.getXVel();}
	that.getPlayerX = function(){return player.getX();};
	that.getPlayerY = function(){return player.getY();};
	that.getPlayerPlatform = function(){return player.whichPlatform();};
	that.getPlayerWidth = function(){return player.getWidth();};
	that.getPlayerHeight = function(){return player.getHeight();};
	that.generateParticles = function(stg){
		//to be implemented
		GM.particleList.generateParticles(stg);
		
	};
	that.addFireBall = function(x,y,xVel,yVel){
		GM.enemyList.addFireBall(x,y,xVel,yVel);
	}
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

	that.shootGun = function(startX, startY, angle){
		var closestE = null;
		var closestT = cWidth + cHeight; //cWidth + cHeight is always larger than longest possible distance
		var dx = Math.cos(angle);
		var dy = Math.sin(angle);
		var xColl, yColl;
		for(var e = GM.enemyList.getRoot(); e != null; e = e.next){
			if(e.isActivated()){
				//calculate collisions, deal damage to enemies
				//calculate time at which the x matches either side of the enemy, see if the y is within bounds
				var ex = e.getX();
				var ey = e.getY();
				var ew = e.getWidth();
				var eh = e.getHeight();
				var tx = (ex - startX)/dx;
				var projY = startY + tx * dy;
				if(ey < projY && projY < ey + eh){
					if(tx > 0 && tx < closestT){
						closestT = tx;
						xColl = startX + dx * tx;
						yColl = projY;
						closestE = e;
					}
				}
				tx = ((ex + ew) - startX)/dx;
				projY = startY + tx * dy;
				if(ey < projY && projY < ey + eh){
					if(tx > 0 && tx < closestT){
						closestT = tx;
						xColl = startX + dx * tx;
						yColl = projY;
						closestE = e;
					}
				}
				//check just one other side (it must hit at least two sides), so checking all but one is fine
				var ty = (ey - startY)/dy;
				var projX = startX + ty * dx;
				if(ex < projX && projX < ex + ew){
					if(ty > 0 && ty < closestT){
						closestT = ty;
						xColl = projX;
						yColl = startY + dy * ty;
						closestE = e;
					}
				}
			}
			else{
				break;
			}
		}
		if(GM.game.bulletsCollideWithPlatforms){
			for(var e = GM.platformList.getRoot(); e != null; e = e.next){
				if(e.getX() < cWidth + GM.game.getXOffset()){
					//calculate collisions, deal damage to enemies
					//calculate time at which the x matches either side of the enemy, see if the y is within bounds
					var ex = e.getX();
					var ey = e.getY();
					var ew = e.getWidth();
					var eh = e.getHeight();
					var tx = (ex - startX)/dx;
					var projY = startY + tx * dy;
					if(ey < projY && projY < ey + eh){
						if(tx > 0 && tx < closestT){
							closestT = tx;
							closestE = null;
						}
					}
					tx = ((ex + ew) - startX)/dx;
					projY = startY + tx * dy;
					if(ey < projY && projY < ey + eh){
						if(tx > 0 && tx < closestT){
							closestT = tx;
							closestE = null;
						}
					}
					//check just one other side (it must hit at least two sides), so checking all but one is fine
					var ty = (ey - startY)/dy;
					var projX = startX + ty * dx;
					if(ex < projX && projX < ex + ew){
						if(ty > 0 && ty < closestT){
							closestT = ty;
							closestE = null;
						}
					}
				}
				else{
					break;
				}
			}
		}
		if(closestE != null){
			console.log(closestT);
			closestE.hurt(10);
			that.generateParticles({
				x: xColl - that.getXOffset(),
				y: yColl,
				num: 2,
				angle: 0,
				angle_variance: Math.PI,
				time: 500,
				time_variance: 100,
				init_speed_x: .2, //px/ms
				init_speed_y: .1,
				color: "#F00"
			});
		}
		//update hud to show ammo
		that.updateHUD();
		return closestT;
	};

	that.updateHUD = function(){
		HUD.health.innerHTML = player.getHealth();
		HUD.ammo.innerHTML = player.getAmmo();
	};

	return that;
}());
