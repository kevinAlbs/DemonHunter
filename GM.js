/*
a screen is an object containing the following methods:
- init
- show
- hide
*/
GM.curScreen = null;
GM.switchScreen = function(screen, noRestart){
	//if noRestart is true, it will not re-init the screen, only hide/show
	if(!screen){
		return;
	}
	if(!noRestart){
		screen.init();
	}
	if(GM.curScreen){
		GM.curScreen.hide();
	}
	screen.show();
	GM.curScreen = screen;
};