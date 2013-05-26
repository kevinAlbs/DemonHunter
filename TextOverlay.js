//singleton
GM.textOverlay = (function(){
	function TextOverlay(){
		var cclock = 0, //cursor clock
			wclock = 0, //writing clock
		    append = "",//cursor
			textarea = document.getElementById("textOverlay"),
		    curText = "",
		    textInQueue = null,//array of characters
		    curQueueIndex = 0,
		    textOutputFinished = false, //true after text is done typing on screen (but user has not pressed spacebar yet)
		    callbackProgress = null,
		    saying = false; //true when typing letters
		this.update = function(){
			//check if there is text in queue
			if(saying){
				wclock++;
				if(wclock > 1){
					//increment letter
					curText += textInQueue[curQueueIndex];
					curQueueIndex++;
					if(curQueueIndex >= textInQueue.length){
						saying = false;
					}
					wclock = 0;
				}
			}
			textarea.value = curText + append;
			cclock += 1;
			if(cclock > 10){
				cclock = 0;
				append = append ==  "" ? "_" : "";
			}
		}

		this.hide = function(){
			curText = "";//reset
			saying = false;
			textarea.style.display = "none";
		}

		this.show = function(){
			textarea.style.display = "block";
		}
		/*
		onProgress is a callback function called after user presses spacebar after text is written
		*/
		this.say = function(name, text, onProgress){
			if(saying){
				return false;
			}
			saying = true;
			curText += name + "- ";
			textInQueue = text.split("");
			curQueueIndex = 0;
			callbackProgress = onProgress;
			return true;
		}
	}

	
	return new TextOverlay();
}());


