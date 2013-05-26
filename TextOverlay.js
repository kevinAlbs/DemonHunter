//singleton
GM.textOverlay = (function(){
	function TextOverlay(){
		var textarea = document.getElementById("textOverlay");
		this.update = function(){

		}
	}
	/*
	onEnd is a callback function called after all of the text is 
	function say(text, onEnd){

	}
	*/
	return new TextOverlay();
}());


