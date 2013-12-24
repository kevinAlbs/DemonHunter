function LoadingScreen(nextScreen){
	/* screen methods */
	this.init = function(){
		GM.game.loadDependencies(GM.data.dependencies, function(){
			//GM.deps.bg.play();
			if(nextScreen){
				GM.switchScreen(nextScreen);	
			}
			else{
				GM.switchScreen(new GameScreen());	
			}
		});
	};
	this.show = function(){
		document.getElementById("screen-loading").style.display = "block";
	};
	this.hide = function(){
		document.getElementById("screen-loading").style.display = "none";
	};
};
GM.utils.inherits(LoadingScreen, Screen);