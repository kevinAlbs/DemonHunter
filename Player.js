function Player(){
	if(this == window){
		return new Player();
	}
	if(Player.instance != null){
		return Player.instance;
	}
	Player.instance = this;

	//"protected"
	this._x = 80;
	this._y = 20;
	this._xSpeed = 5;
	this._yVel = 0;
	this._width = 22; 
	this._height = 60;
	this._jumpSpeed = -20;
	this._ducking = false;
	this._hasLongJump = true;

	this.name = "Kaitlin";
	this._state = "user_controlled";//no higher level behavior

	var sword = new Movable(),
		maxSwordWidth = 50,
		peakSwordFrame = 1;//which frame the sword is at max length
		swingingSword = false;

	var animation_set = new AnimationSet(GM.data.animation_sets.Player);
	animation_set.switchAnimation("standing");

	function doneSwing(){
		swingingSword = false;
		sword.setWidth(0);
		sword.setHeight(0);
	};

	this.update = function(){
		//call super.update to update hurt state
		Player.prototype.update.apply(this);
		if(!swingingSword){
			if(this._walking){
				animation_set.switchAnimation("walking");//remember, only actually switches if it is not already walking
			}
			else{
				animation_set.switchAnimation("standing");
			}
		}

		this.gravityUpdate();
		//this._y = 50;
		//this._x += 6;

		if(swingingSword){
			//update sword position based on location and sword animation progress
			var totalFrames = GM.data.animation_sets.Player.swing_sword.length;
			var curFrame = animation_set.getCurFrame();
			var newSwordWidth = maxSwordWidth * (1 - (Math.abs(curFrame - peakSwordFrame))/(peakSwordFrame+1));
			sword.setWidth(newSwordWidth);
			sword.setHeight(5);
			var swordX = this._x + this._width;
			if(this._facing == -1){
				swordX = this._x - sword.getWidth();
			}
			sword.setX(swordX);
			sword.setY(this._y + 13);
		}
	};

	this.paint = function(ctx){
		//animation_set.drawFrame(this._x - GM.main.getXOffset(), this._y, this._width, this._height, ctx, this._facing);
		ctx.strokeRect(this._x - GM.main.getXOffset(), this._y, this._width, this._height);
		ctx.fillStyle = "#000";
		sword.paint(ctx);
		if(GM.debug){
			ctx.fillText(Math.round(this._x) + "," + Math.round(this._y), this._x - GM.main.getXOffset(), this._y - 10);
		}
	};

	this.swingSword = function(){
		if(swingingSword) return;
		swingingSword = true;
		animation_set.switchAnimation("swing_sword", doneSwing);
	};

	this.getSword = function(){
		if(swingingSword){
			return sword;
		}
		else{
			return false;
		}
	};
	this.duck = function(){
		Player.prototype.duck.apply(this);
		if(this._ducking){
			//went through
			this._height = 40;
			this.setOnGround();
		}
	}
	this.unduck = function(){
		if(!this._ducking){return;}
		Player.prototype.unduck.apply(this);
		this._height = 60;
		this.setOnGround();
	}
};

GM.utils.inherits(Player, Person);
