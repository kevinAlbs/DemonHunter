//screen for building world
function BuilderScreen(){
	
	var that = this;
	var tool = "cursor";
	var firstInit = true;

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
		obj.addClass("selected");
	}
	function handleObjectClick(e){
		selectObj($(e.currentTarget));
		if(tool == "delete"){
			$(e.currentTarget).detach();
		}
	}

	function handleClick(e){
		//console.log(e);
		var objs = getObjectsOn($($(".platform").get(0)));
		console.log(objs[0]);
	}
	function handleMousedown(e){

	}
	function handleMouseup(e){

	}
	function handleToolbar(e){
		var btn = $(e.currentTarget);
		tool = btn.val();
		container.css({
			"cursor" : btn.attr("data-cursor")
		});
		console.log("HERE");
		//perform any immediate actions
		container.draggable("disable");
		switch(tool){
			case "move":
				container.draggable("enable");
			break;
			case "zombie":
				var newObj = $("<div></div>").addClass("zombie object").css({
					left: (-1 * xOff() + 100) + "px",
					top: "10px"
				});
				newObj.draggable({containment: container, snap: ".platform", snapMode: "outer"});
				selectObj(newObj);
				container.append(newObj);
			break;
			case "platform":
				var newObj = $("<div></div>").addClass("platform object").css({
					left: (-1 * xOff() + 100) + "px",
					top: "10px"
				});
				newObj.draggable({containment: container}).resizable({handles: "e,w", containment: container });
				selectObj(newObj);
				container.append(newObj);
			break;
		}
	}
	//add or remove all listeners
	//val is either on or off
	this.toggleListeners = function(val){
		var fn = val; //on or off
		container[fn]("click", handleClick);
		container[fn]("mousedown", handleMousedown);
		container[fn]("mouseup", handleMouseup);
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

	this.exportJson = function(){
		//sort platforms
		//sort enemies
	}

	/* screen methods */
	this.init = function(){
		//GM.switchScreen(new GameScreen());
		container.draggable({axis: 'x'}).draggable("disable");
		
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