function MenuScreen(nextScreen){
	var that = this;
	function action(val){
		if(val == "play"){
			GM.switchScreen(new GameScreen());
		} else if (val == "leaderboard") {
			GM.switchScreen(new LeaderboardScreen(that));
		}
	}
	function toggleListeners(val){
		var fn = val + "EventListener";
		document.getElementById("btn-play")[fn]("click",function(){action("play");}, false);
		document.getElementById("btn-leaderboard")[fn]("click",function(){action("leaderboard");}, false);
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