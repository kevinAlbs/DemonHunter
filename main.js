//MAIN is a singleton handling screens, dependencies, and tying things together
MAIN = (function(){
var that = {};
var curScreen = "";

var screens = {
	gameplay: {
		init: function(){
			GM.game.startGame();
		},
		show: function(){
			document.getElementById("screen-gameplay").style.display = "block";
			GM.game.toggleListeners("add");
		},
		hide: function(){
			document.getElementById("screen-gameplay").style.display = "none";
			GM.game.toggleListeners("remove");
		}
	},
	loading: {
		init: function(){
			that.loadDependencies(GM.data.dependencies, function(){
				that.switchScreen("gameplay");
			});
		},
		show: function(){
			document.getElementById("screen-loading").style.display = "block";
		},
		hide: function(){
			document.getElementById("screen-loading").style.display = "none";
		}
	}
};

//if noRestart is true, it will not re-init the screen, only hide/show
that.switchScreen = function(nm, noRestart){
	if(!screens.hasOwnProperty(nm)){
		return;
	}
	if(!noRestart){
		screens[nm].init();
	}
	if(curScreen != ""){
		screens[curScreen].hide();
	}
	screens[nm].show();
	curScreen = nm;
};

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
};

return that;
}());