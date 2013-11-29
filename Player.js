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
	this._xSpeed = 10;
	this._yVel = 0;
	this._width = 22; 
	this._height = 60;
	this._jumpSpeed = -19.8;
	this._ducking = false;
	this._hasLongJump = true;

	this.name = "Kaitlin";
	this._state = "user_controlled";//no higher level behavior

	var bullets = null; //linked list of bullets for drawing
	var shooting = false;

	var animation_set = new AnimationSet(GM.data.animation_sets.Player);
	animation_set.switchAnimation("standing");

	this.update = function(){
		//call super.update to update hurt state
		Player.prototype.update.apply(this);
		if(this._walking){
			animation_set.switchAnimation("walking");//remember, only actually switches if it is not already walking
		}
		else{
			animation_set.switchAnimation("standing");
		}

		this.movementUpdate();
		//this._y = 50;
		//this._x += 6;

		if(shooting){
			//paint the gun shooting
		}

	};

	this.paint = function(ctx){
		//animation_set.drawFrame(this._x - GM.main.getXOffset(), this._y, this._width, this._height, ctx, this._facing);
		var xOff = GM.main.getXOffset();
		ctx.strokeRect(this._x - xOff, this._y, this._width, this._height);
		ctx.fillStyle = "#000";
		for(var b = bullets; b != null; b = b.next){
			ctx.beginPath();
			ctx.moveTo(b.x1 - xOff, b.y1);
			ctx.lineTo(b.x2 - xOff, b.y2);
			ctx.stroke();
			ctx.closePath();
		}
		if(GM.debug){
			ctx.fillText(Math.round(this._x) + "," + Math.round(this._y), this._x - GM.main.getXOffset(), this._y - 10);
		}
	};

	this.shoot = function(sx,sy){
		if(shooting) return;
		shooting = true;
		var xOff = GM.main.getXOffset();
		var newBullet = {
			x1: this._x,
			y1: this._y,
			x2: sx + xOff,
			y2: sy,
			t: 0,
			next: null
		};
		//check for collisions with enemies etc. call a GM.main function which handles this
		if(bullets == null){
			bullets = newBullet;
		}
		else{
			newBullet.next = bullets;
			bullets = newBullet;
		}

		//animation_set.switchAnimation("swing_sword", doneSwing);
	};

	this.unshoot = function(){
		shooting = false;
	}

	this.duck = function(){
		if(!this._ducking){
			Player.prototype.duck.apply(this);
			if(this._ducking){
				//went through
				var amt = 30;//amount of height decrease
				this._height -= amt;
				this._y += amt;
			}
		}
	}
	this.unduck = function(){
		if(!this._ducking){return;}
		Player.prototype.unduck.apply(this);
		var amt = 30;//amount of height decrease
		this._height += amt;
		this._y -= amt;
		//this.setOnGround();
	}
};

GM.utils.inherits(Player, Person);
