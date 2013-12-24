//screen for building world
function BuilderScreen(){
	
	var that = this;
	var tool = "cursor";
	var firstInit = true;

	var container = $("#scroller");

	function xOff(){
		return container.position().left;
	}

	function selectObj(obj){
		$(".object").removeClass("selected");
		obj.addClass("selected");
	}
	function handleObjectClick(e){
		selectObj($(e.currentTarget));
	}

	function handleClick(e){
		console.log(e);
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
		//perform any immediate actions
		container.draggable("disable");
		switch(tool){
			case "move":
				container.draggable("enable");
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