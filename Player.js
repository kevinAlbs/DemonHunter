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
	this._y = 210;
	this._xSpeed = .3; //in pixels per ms
	
	this._yVel = 0;
	this._width = 22; 
	this._height = 89;
	this._jumpSpeed = -.48;
	this._ducking = false;
	this._hasLongJump = true;
	this._armAngle = 0;
	this._canShoot = true;

	this.name = "Kaitlin";
	this._state = "user_controlled";//no higher level behavior

	var bullets = null; //linked list of bullets for drawing
	var shooting = false;

	var animation_set = new AnimationSet(GM.data.animation_sets.Player);
	var head_anim = new AnimationSet(GM.data.animation_sets.Player_head);
	var arm_anim = new AnimationSet(GM.data.animation_sets.Player_arms);
	head_anim.switchAnimation("head1");
	arm_anim.switchAnimation("arms");
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

	this.getArmX = function(){return this._x + (8 * this._facing)};
	this.getArmY = function(){return this._y + 19;}

	this.mouseUpdate = function(mx, my){
		var xOff = GM.main.getXOffset();
		var ax = this.getArmX() - xOff;
		var ay = this.getArmY();
		var dist = GM.utils.dist(ax, ay, mx, my); //copied from paint method
		if(dist > 10){
			var ang = Math.atan2(my -  ay, mx - ax);
			var max = Math.PI * 2/5;
			//this code only works facing right (for this game)
			if(this._facing == 1){
				if(ang > max){
					ang = max;
					this._canShoot = false;
				}
				else if(ang < max * -1){
					ang = max * -1;
					this._canShoot = false;
				}
				else{
					this._canShoot = true;
				}
			}
			this._armAngle = ang;
		}
	};
	this.paint = function(ctx){
		var xOff = GM.main.getXOffset();
		var ax = this.getArmX() - xOff;
		var ay = this.getArmY();
		if(this._hurt){
			ctx.globalAlpha = .5;
		}
		animation_set.drawFrame(this._x - xOff - (14 * this._facing), this._y + 19, this._width, this._height, ctx, this._facing);
		head_anim.drawFrame(this._x - xOff - (4 * this._facing), this._y + 2, this._width, this._height, ctx, this._facing);
		arm_anim.drawFrame(ax, ay, this._width, this._height, ctx, this._facing, this._armAngle, 3, 3);
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
		if(this._hurt){
			ctx.globalAlpha = 1;
		}
	};

	this.shoot = function(sx,sy){
		if(shooting) return;
		if(!this._canShoot){return;}

		//this._yVel -= 2;
		shooting = true;
		var xOff = GM.main.getXOffset();
		var ax = this.getArmX();
		var ay = this.getArmY();
		sx += xOff;
		var newBullet = {
			x1: ax,
			y1: ay,
			x2: sx,
			y2: sy,
			t: 0,
			next: null
		};
		var x1 = ax;
		var y1 = ay;
		var dy = (sy - y1);
		var dx = (sx - x1);
		GM.main.shootGun(x1, y1, dx, dy);
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
