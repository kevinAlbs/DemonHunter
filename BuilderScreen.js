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
		"s": "spike",
		"e": "export"
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
		if(tool == "delete"){
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
	function handleClick(e){
		that.exportJson();
	}
	function handleMousedown(e){

	}
	function handleMouseup(e){

	}
	function switchTool(t,x,y){
		console.log(t);
		tool = t;
		$("#toolbar span").html("Tool: " + tool);
		var btn = $("button[value=" + tool + "]");
		container.css({
			"cursor" : btn.attr("data-cursor")
		});

		//if x and y are not defined, put them in corner
		if(!x){
			x = 100;
			y = 10;
		}
		x += (-1 * xOff());//account for offest
		//perform any immediate actions
		container.draggable("disable");
		switch(tool){
			case "export":
				that.exportJson();
			break;
			case "move":
				container.draggable("enable");
			break;
			case "zombie":
				var newObj = $("<div></div>").addClass("zombie object").css({
					left: x + "px",
					top: y + "px"
				});
				newObj.draggable({containment: container, snap: ".platform", snapMode: "outer"});
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
			case "firebreather":
			//TODO: implement until sprites are finalized
			break;
			case "flyer":
			break;
			case "centaur":
			break;
			case "platform":
				var newObj = $("<div></div>").addClass("platform object").css({
					left: x + "px",
					top:  y + "px"
				});
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
		}
		else{
			$("#toolbar").unDelegate("button", "click", handleToolbar);	
			container.unDelegate(".object", "click", handleObjectClick);
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
	this.exportJson = function(){
		//sort platforms by x, give them spikes (sorting unnecessary), output
		var ps = $(".platform");
		//make list of objects
		var platforms = [];
		for(var i = 0; i < ps.size(); i++){
			var p = $(ps.get(i));
			var ss = getObjectsOn(p);
			var spikes =[];
			for(var i = 0; i < ss.length; i++){
				var s = $(ss[i]);
				if(!s.hasClass("spike")) continue;
				spikes.push({
					x: s.position().left
				});
			}
			spikes = sort(spikes);
			platforms.push({
				x: p.position().left,
				y: p.position().top,
				width: p.width(),
				spikes: spikes
			});
		}
		platforms = sort(platforms);

		//sort enemies by x
		var enemies = [];
		var es = $(".zombie,.centaur,.firebreather,.flyer");
		for(var i = 0; i < es.size(); i++){
			var e = $(es.get(i));
			enemies.push({
				x: e.position().left,
				y: e.position().top
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

};
GM.utils.inherits(BuilderScreen, Screen);