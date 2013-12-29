//screen for building world
function BuilderScreen(){
	
	var that = this;
	var tool = "cursor";
	var firstInit = true;
	var curX=0,curY=0;//x,y coordinates of mouse
	var shortcuts = {
		"c": "cursor",
		"p": "platform",
		"d": "delete",
		"m": "move",
		"z": "zombie",
		"f": "flyer",
		"b": "firebreather",
		"t": "centaur",
		"s": "spike",
		"e": "export",
		"a": "ammo",
		"h": "health"
	};

	var container = $("#scroller");

	function xOff(){
		return container.position().left;
	}

	//goes through all platforms, returns the one directly under the object
	function getPlatformOf(obj){
		var ps = $(".platform");
		for(var i = 0; i < ps.size(); i++){
			var p = $(ps.get(i)),
			px = p.position().left,
			py = p.position().top,
			ph = p.height(),
			pw = p.width(),
			ox = obj.position().left,
			oy = obj.position().top,
			oh = obj.height(),
			ow = obj.width();
			if(py == oy + oh){
				if(px <= ox && ox + ow <= px + pw){
					return p;
				}
			}
		}
		return null;
	}

	//reverse of getPlatformOf, gets objects on a platform (created for spikes)
	function getObjectsOn(p){
		var os = $(".object").not(".platform");
		var objects = [];
		for(var i = 0; i < os.size(); i++){
			var o = $(os.get(i)),
			px = p.position().left,
			py = p.position().top,
			ph = p.height(),
			pw = p.width(),
			ox = o.position().left,
			oy = o.position().top,
			oh = o.height(),
			ow = o.width();
			if(py == oy + oh){
				if(px <= ox && ox + ow <= px + pw){
					objects.push(o);
				}
			}
		}
		return objects;
	}

	function selectObj(obj){
		$(".object").removeClass("selected");
		if(obj){
			obj.addClass("selected");
		}
	}
	function handleObjectClick(e){
		if($(e.currentTarget).hasClass("selected")){
			selectObj(null);//deselect
		}
		else{
			selectObj($(e.currentTarget));
		}
		if(tool == "delete" && !$(e.currentTarget).hasClass("player")){
			$(e.currentTarget).detach();
		}
	}

	function handleMousemove(e){
		curX = e.offsetX;
		curY = e.offsetY;

	}
	function handleKeypress(e){
		var c = String.fromCharCode(e.keyCode);
		console.log(c);
		if(shortcuts.hasOwnProperty(c)){
			switchTool(shortcuts[c], curX, curY);
		}
	}

	function handleTextBlur(e){
		var tb = $(e.target);
		var obj = tb.parent();
		var bar = obj.find(".radius");
		var newWidth = 2 * parseInt(tb.val()) + obj.width();
		bar.width(newWidth);
		bar.css({
			left: (obj.width()/2 - newWidth/2) + "px"
		});
	}

	function handleClick(e){

	}

	function handleMousedown(e){

	}
	function handleMouseup(e){

	}
	//w is width
	//d is enemy follow distance
	function switchTool(t,x,y,w,d){
		console.log(t);
		tool = t;
		$("#toolbar span").html("Tool: " + tool);
		var btn = $("button[value=" + tool + "]");
		container.css({
			"cursor" : btn.attr("data-cursor")
		});

		//if x and y are not defined, put them in corner
		if(!x){
			x = 100 + (-1 * xOff());
			y = 10;
		}
		
		//perform any immediate actions
		container.draggable("disable");
		switch(tool){
			case "export":
				that.exportJson();
			break;
			case "move":
				container.draggable("enable");
			break;
			case "ammo":
				var newObj = $("<div></div>").addClass("ammo object").css({
					left: x + "px",
					top: y + "px"
				});
				newObj.draggable({containment: container, snap: ".platform", snapMode: "outer"});
				selectObj(newObj);
				container.append(newObj);
			break;
			case "health":
				var newObj = $("<div></div>").addClass("health object").css({
					left: x + "px",
					top: y + "px"
				});
				newObj.draggable({containment: container, snap: ".platform", snapMode: "outer"});
				selectObj(newObj);
				container.append(newObj);
			break;
			case "zombie":
				var newObj = $("<div><input type='text' /><div class='radius'></div></div>").addClass("zombie object").css({
					left: x + "px",
					top: y + "px"
				});
				if(d){
					newObj.find("input[type=text]").val(d).blur();
				}
				newObj.draggable({containment: container, snap: ".platform", snapMode: "outer"});
				selectObj(newObj);
				container.append(newObj);
			break;
			case "firebreather":
				var newObj = $("<div><input type='text' /><div class='radius'></div></div>").addClass("firebreather object").css({
					left: x + "px",
					top: y + "px"
				});
				if(d){
					newObj.find("input[type=text]").val(d).blur();
				}
				newObj.draggable({containment: container, snap: ".platform", snapMode: "outer"});
				selectObj(newObj);
				container.append(newObj);
			break;
			case "centaur":
				var newObj = $("<div><input type='text' /><div class='radius'></div></div>").addClass("centaur object").css({
					left: x + "px",
					top: y + "px"
				});
				if(d){
					newObj.find("input[type=text]").val(d).blur();
				}
				newObj.draggable({containment: container, snap: ".platform", snapMode: "outer"});
				selectObj(newObj);
				container.append(newObj);
			break;
			case "flyer":
				var newObj = $("<div></div>").addClass("flyer object").css({
					left: x + "px",
					top: y + "px"
				});
				newObj.draggable({containment: container});
				selectObj(newObj);
				container.append(newObj);
			break;
			case "spike":
				var newObj = $("<div></div>").addClass("spike object").css({
					left: x + "px",
					top: y + "px"
				});
				newObj.draggable({containment: container, snap: ".platform", snapMode: "outer"});
				selectObj(newObj);
				container.append(newObj);
			break;
			case "platform":
				var newObj = $("<div></div>").addClass("platform object").css({
					left: x + "px",
					top:  y + "px"
				});
				if(w){
					newObj.css("width", w + "px");
				}
				newObj.draggable({containment: container}).resizable({handles: "e,w", containment: container });
				selectObj(newObj);
				container.append(newObj);
			break;
		}
	}
	function handleToolbar(e){
		var btn = $(e.currentTarget);
		switchTool(btn.val());
	}
	//add or remove all listeners
	//val is either on or off
	this.toggleListeners = function(val){
		var fn = val; //on or off
		container[fn]("click", handleClick);
		container[fn]("mousedown", handleMousedown);
		container[fn]("mouseup", handleMouseup);
		container[fn]("mousemove", handleMousemove);
		$(document)[fn]("keypress", handleKeypress);
		if(fn == "on"){
			$("#toolbar").delegate("button", "click", handleToolbar);
			container.delegate(".object", "click", handleObjectClick);
			container.delegate(".object input[type=text]", "blur", handleTextBlur);
		}
		else{
			$("#toolbar").undelegate("button", "click", handleToolbar);	
			container.undelegate(".object", "click", handleObjectClick);
			container.undelegate(".object input[type=text]", "blur", handleTextBlur)
			container.draggable("disable");
		}

	};

	//assumes arr is an array of objects, sorts ascending on x property
	function sort(arr){
		var sorted = [];
		if(arr.length == 0){
			return sorted;
		}
		var min;
		while(arr.length > 0){
			min = -1; 
			for(var i = 0; i < arr.length; i++){
				if(min == -1 || arr[i].x < arr[min].x){
					min = i;
				}
			}
			sorted.push(arr[min]);
			arr.splice(min,1);
		}
		return sorted;
	}
	this.importJson = function(obj){
		console.log(obj);
		var spikeHeight = 20, //may need to change if enemy/object sizes change
			ammoHeight = 10,
			healthHeight = 10;

		var heights = {
			"spike": 20,
			"ammo": 10,
			"health": 10
		};

		//remove the initial platform
		$(".platform.init").detach();
		$(".player").css({
			"left": obj.playerX + "px",
			"top" : obj.playerY + "px"
		});
		for(var i = 0; i < obj.platforms.length; i++){
			switchTool("platform", obj.platforms[i].x, obj.platforms[i].y,  obj.platforms[i].width);
			for(var j = 0; j < obj.platforms[i].spikes.length; j++){
				switchTool("spike", obj.platforms[i].spikes[j].x, obj.platforms[i].y - heights["spike"]);
			}
			for(var j = 0; j < obj.platforms[i].pickups.length; j++){
				switchTool(obj.platforms[i].pickups[j].type, obj.platforms[i].pickups[j].x, obj.platforms[i].y - heights[obj.platforms[i].pickups[j].type]);
			}
		}
		for(var i = 0; i < obj.enemies.length; i++){
			switchTool(obj.enemies[i].type, obj.enemies[i].x, obj.enemies[i].y, 0, obj.enemies[i].dist);
		}
	}

	this.exportJson = function(){
		//sort platforms by x, give them spikes (sorting unnecessary), output
		var ps = $(".platform");
		console.log(ps.size() + " platforms");
		//make list of objects
		var platforms = [];
		for(var i = 0; i < ps.size(); i++){
			var p = $(ps.get(i));
			var ss = getObjectsOn(p);
			var spikes =[];
			var pickups = [];
			for(var j = 0; j < ss.length; j++){
				var s = $(ss[j]);
				if(s.hasClass("spike")){
					spikes.push({
						x: s.position().left
					});
				}
				else if(s.hasClass("ammo")){
					pickups.push({
						x: s.position().left,
						type: "ammo"
					});
				}
				else if(s.hasClass("health")){
					pickups.push({
						x: s.position().left,
						type: "health"
					});
				}
			}
			spikes = sort(spikes);
			platforms.push({
				x: p.position().left,
				y: p.position().top,
				width: p.width(),
				spikes: spikes,
				pickups: pickups
			});
		}
		platforms = sort(platforms);

		//sort enemies by x
		var enemies = [];
		var es = $(".zombie,.centaur,.firebreather,.flyer");
		for(var i = 0; i < es.size(); i++){
			var e = $(es.get(i));
			var type = "zombie";
			if(e.hasClass("centaur")){
				type = "centaur";
			}
			else if(e.hasClass("firebreather")){
				type = "firebreather";
			}
			else if(e.hasClass("flyer")){
				type = "flyer";
			}
			var dist = e.find("input[type=text]");
			if(dist.size() > 0){
				dist = dist.val();
			}
			else{
				dist = 0;
			}

			enemies.push({
				x: e.position().left,
				y: e.position().top,
				type: type,
				dist: dist
			});
		}
		enemies = sort(enemies);

		var player = $(".player");
		var output = {
			platforms: platforms,
			enemies: enemies,
			playerX: player.position().left,
			playerY: player.position().top
		};
		$("#output").html(JSON.stringify(output));
		GM.data.builder = {};
		GM.data.builder.output = output;
		GM.data.builder.screen = this;
	}

	/* screen methods */
	this.init = function(){
		//GM.switchScreen(new GameScreen());
		container.draggable({axis: 'x'}).draggable("disable");
		$(".player").draggable({containment: container, snap: ".platform", snapMode: "outer"});
		$(".platform.init").draggable({containment: container}).resizable({handles: "e,w", containment: container });
		
	};
	this.show = function(){
		document.getElementById("screen-builder").style.display = "block";
		this.toggleListeners("on");
	};
	this.hide = function(){
		document.getElementById("screen-builder").style.display = "none";
		this.toggleListeners("off");
	};
	this.init();
};
GM.utils.inherits(BuilderScreen, Screen);