function Professor(){
	if(this == window){
		return new Professor();
	}
	if(Professor.instance != null){
		return Professor.instance;
	}
	Professor.instance = this;

	//"protected"
	this._x = 200;
	this._yVel = 3;
	this._width = 60; 
	this._height = 22;
	this._state = "unmet";
	var playerX, playerWidthDiv2; //cached vars
	var thresholdToSpeak = 10;

	var animation_set = new AnimationSet(GM.data.animation_sets.Professor);
	animation_set.switchAnimation("injured");


	this.update = function(){
		//call super.update to update hurt state
		Professor.prototype.update.apply(this);
		if(!playerWidthDiv2){
			playerWidthDiv2 = GM.main.getPlayerWidth() / 2;
		}
		playerX = GM.main.getPlayerX();
		if(Math.abs(playerX + playerWidthDiv2 - this._x + this._width / 2) < thresholdToSpeak){
			switch(this._state){
				case "unmet":
					this._state = "waiting_for_vines";
					GM.main.cutscene(GM.data.cutscenes.meet);
				break;
			}
		}
	};

	this.paint = function(ctx){
		animation_set.drawFrame(this._x - GM.main.getXOffset(), this._y, this._width, this._height, ctx, this._facing);
		ctx.strokeRect(this._x - GM.main.getXOffset(), this._y, this._width, this._height);
		if(GM.debug){
			ctx.fillText(this._x + "," + this._y, this._x - GM.main.getXOffset(), this._y - 10);
		}
	};

};

GM.utils.inherits(Professor, Person);