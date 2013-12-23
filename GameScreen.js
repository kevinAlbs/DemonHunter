function GameScreen(){
	/* screen methods */
	this.init = function(){
		GM.game.startGame();
	};
	this.show = function(){
		document.getElementById("screen-gameplay").style.display = "block";
		GM.game.toggleListeners("add");
	};
	this.hide = function(){
		document.getElementById("screen-gameplay").style.display = "none";
		GM.game.toggleListeners("remove");
	};
};
GM.utils.inherits(GameScreen, Screen);