function Player(){
	if(this == window){
		return new Player();
	}
	var snd = new Audio("sounds/shotgun.mp3"); // buffers automatically when created
	var snd2 = new Audio("sounds/shotgun.mp3"); // buffers automatically when created
	//"protected"
	this._x = 80;
	this._y = 210;
	this._walkingSpeed = .3; //in pixels per ms
	this._width = 22; 
	this._height = 89;
	this._jumpSpeed = -.5;
	this._ducking = false;
	this._rolling = false;
	this._hasLongJump = true;
	this._armAngle = 0;
	this._canShoot = true;

	this.name = "Kaitlin";
	this._state = "user_controlled";//no higher level behavior

	var bullets = null; //linked list of bullets for drawing
	var shooting = false;
	var rollHeightDiff = 40;
	var rollLocked = false;//enforces key press every time
	var animation_set = new AnimationSet(GM.data.animation_sets.Player);
	var head_anim = new AnimationSet(GM.data.animation_sets.Player_head);
	var arm_anim = new AnimationSet(GM.data.animation_sets.Player_arms);
	head_anim.switchAnimation("head1");
	arm_anim.switchAnimation("arms");
	animation_set.switchAnimation("standing");

	this.update = function(){
		//call super.update to update hurt state
		Player.prototype.update.apply(this);
		if(!this._jumping && !this._rolling){
			if(this._walking){
			animation_set.switchAnimation("walking");//remember, only actually switches if it is not already walking
			}
			else{
				animation_set.switchAnimation("standing");
			}
		}

		this.movementUpdate();
		//this._y = 50;
		//this._x += 6;


	};

	this.getArmX = function(){return this._x + (8 * this._facing)};
	this.getArmY = function(){return this._y + 16;}

	this.getCenterArmX = function(){return this.getArmX() + 3;}
	this.getCenterArmY = function(){return this.getArmY() + 8;}

	this.mouseUpdate = function(mx, my){
		var xOff = GM.main.getXOffset();
		var ax = this.getArmX() - xOff;
		var ay = this.getArmY();
		var dist = GM.utils.dist(ax, ay, mx, my); //copied from paint method
		if(dist > 10){
			var ang = Math.atan2(my -  ay, mx - ax);
			var pi = Math.PI;
			var max = pi * .4;
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
			if(this._armAngle < -1 * .35 * pi){
				head_anim.switchAnimation("head4");
			}
			else if(this._armAngle < -1 * pi * .14 && this._armAngle > -1 * pi * .25){
				head_anim.switchAnimation("head3");
			}
			else if(this._armAngle > -1 * pi * .1 && this._armAngle < .29 * pi){
				head_anim.switchAnimation("head1");
			}
			else if(this._armAngle > .31 * pi){
				head_anim.switchAnimation("head2");
			}

		}
	};
	this.paint = function(ctx){
		var xOff = GM.main.getXOffset();
		var ax = this.getArmX() - xOff;
		var ay = this.getArmY();
		var cax = this.getCenterArmX() - xOff;
		var cay = this.getCenterArmY();
		if(this._hurt){
			ctx.globalAlpha = .5;
		}
		
		if(!this._rolling){
			animation_set.drawFrame(this._x - xOff - (14 * this._facing), this._y + 19, this._width, this._height, ctx, this._facing);
			head_anim.drawFrame(this._x - xOff - (4 * this._facing), this._y + 2, this._width, this._height, ctx, this._facing);
			arm_anim.drawFrame(ax, ay, this._width, this._height, ctx, this._facing, this._armAngle, cax-ax, cay-ay); //rotate about center
		}
		else{
			animation_set.drawFrame(this._x - xOff - (14 * this._facing), this._y + 5, this._width, this._height, ctx, this._facing);
		}
		//ctx.strokeRect(this._x - xOff, this._y, this._width, this._height);
		var prev = null;
		for(var b = bullets; b != null; b = b.next){
			b.t--;
			if(b.t <= 0){
				if(prev == null){
					bullets = bullets.next;
				}
				else{
					prev.next = b.next;
				}
			}
			ctx.beginPath();
			ctx.moveTo(cax, cay);
			ctx.lineTo(cax + b.xDiff, cay + b.yDiff);
			ctx.stroke();
			ctx.closePath();
			prev = b;
		}
		//bullets = null;
		if(GM.debug){
			//ctx.fillText(Math.round(this._x) + "," + Math.round(this._y), this._x - GM.main.getXOffset(), this._y - 10);
		}
		if(this._hurt){
			ctx.globalAlpha = 1;
		}
	};

	this.shoot = function(){
		if(shooting) return;
		if(this._rolling){return;}


		if(snd.currentTime == 0 || snd.ended){
			snd.play();
			console.log("1");
		}
		else{
			console.log("2");
			snd2.play();
			
		}
		//this._yVel -= 2;
		shooting = true;
		var xOff = GM.main.getXOffset();
		var cax = this.getCenterArmX();
		var cay = this.getCenterArmY();
		var hyp = 1200;//approximate hypotenuse of canvas
		var newBullet = {
			xDiff:  Math.cos(this._armAngle) *  hyp,
			yDiff:  Math.sin(this._armAngle) * hyp,
			t: 4,
			next: null
		};
		var x1 = cax;
		var y1 = cay;
		GM.main.shootGun(x1, y1, this._armAngle);
		//check for collisions with enemies etc. call a GM.main function which handles this
		if(bullets == null){
			bullets = newBullet;
		}
		else{
			newBullet.next = bullets;
			bullets = newBullet;
		}
		var that = this;
		arm_anim.switchAnimation("shot", function(){
			that.unshoot();
			arm_anim.switchAnimation("arms");
		});
		
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

	this.barrelRoll = function(){
		if(this._rolling || !this.onPlatform() || rollLocked){return;}
		this._rolling = true;
		rollLocked = true;
		this._height -= rollHeightDiff;
		this._y += rollHeightDiff;
		var that = this;
		animation_set.switchAnimation("rolling", function(){that._stopRolling();});
	}
	this.unBarrelRoll = function(){
		if(!this._rolling){
			rollLocked = false;
			
		}
	};

	this._stopRolling = function(){
		if(!this._rolling){return;}
		animation_set.switchAnimation("walking");
		rollTimer = 0;
		this._rolling = false;
		this._height += rollHeightDiff;
		this._y -= rollHeightDiff;
	}
	
	this.jump = function(){
		if(this.onPlatform() && !this._ducking && !this._rolling){	
			Player.prototype.jump.call(this);
			if(animation_set.getCurAnimation() == "jumping"){
				animation_set.switchAnimation("jumping2");
			}
			else{
				animation_set.switchAnimation("jumping");
			}
		}
	}
};

GM.utils.inherits(Player, Person);