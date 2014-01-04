function MenuScreen(nextScreen){
	function action(val){
		if(val == "play"){
			GM.switchScreen(new GameScreen());
		}
	}
	function toggleListeners(val){
		var fn = val + "EventListener";
		document.getElementById("btn-play")[fn]("click",function(){action("play");}, false);
	}
	/* screen methods */
	this.init = function(){
		toggleListeners("add");
	};
	this.show = function(){
		document.getElementById("screen-menu").style.display = "block";
	};
	this.hide = function(){
		document.getElementById("screen-menu").style.display = "none";
	};
};
GM.utils.inherits(MenuScreen, Screen);