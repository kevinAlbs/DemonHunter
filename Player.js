function Player(){
	if(this == window){
		return new Player();
	}
	
	//"protected"
	this._ammo = 30;
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
	this._health=100;

	this.name = "Kaitlin";
	this._state = "user_controlled";//no higher level behavior

	var bullets = null; //linked list of bullets for drawing
	var shooting = false;
	var shotLocked = false;//forces click
	var rollHeightDiff = 40;
	var rollLocked = false;//enforces key press every time
	var animation_set = new AnimationSet(GM.data.animation_sets.Player);
	var head_anim = new AnimationSet(GM.data.animation_sets.Player_head);
	var arm_anim = new AnimationSet(GM.data.animation_sets.Player_arms);

	head_anim.switchAnimation("head1");
	arm_anim.switchAnimation("arms");
	animation_set.switchAnimation("standing");

	this.update = function(){
		if(GM.game.mapDebug){
			this._yVel = -.3;
			this._walkingSpeed = .8;
		}
		//call super.update to update hurt state
		Player.prototype.update.apply(this);

		if(this._dying){
			//decrease height
			var dHeight = 20;
			if(this._height > dHeight){
				var change = .25 * GM.game.delta;
				if(this._height - change < dHeight){
					this._height = dHeight;
					this._dying = false;
				}
				else{
					this._height -= change;
				}
			}
		}

		if(!this._dead){
			if(!this._jumping && !this._rolling){
				if(this._walking){
				animation_set.switchAnimation("walking");//remember, only actually switches if it is not already walking
				}
				else{
					animation_set.switchAnimation("standing");
				}
			}
		}

		this.movementUpdate();

		if(this._y > GM.game.getCHeight() + 500){
			this._die();
		}
		//this._y = 50;
		//this._x += 6;


	};

	this.getWalkingSpeed = function(){return this._walkingSpeed;};
	this.getArmX = function(){return this._x + (8 * this._facing)};
	this.getArmY = function(){return this._y + 16;}

	this.getCenterArmX = function(){return this.getArmX() + 3 * this._facing;};
	this.getCenterArmY = function(){return this.getArmY() + 8;};
	this.getGunTipX  = function(){
		return this.getCenterArmX() + Math.cos(this._armAngle) * 35 * this._facing;
	};
	this.getGunTipY = function(){return this.getCenterArmY() - 1 + Math.sin(this._armAngle) * 37;};
	this.getShootAngle = function(){
		if(this._facing == -1){
			return Math.PI - this._armAngle;
		}
		else{
			return this._armAngle;
		}
	};

	this.mouseUpdate = function(mx, my){
		var xOff = GM.game.getXOffset();
		var ax = this.getArmX() - xOff;
		var ay = this.getArmY();
		var dist = GM.utils.dist(ax, ay, mx, my); //copied from paint method
		if(dist > 10){
			var ang = Math.atan2(my -  ay, mx - ax);
			var pi = Math.PI;
			var max = pi * .4;
			if(this._facing == 1){
				if(ang > max){
					ang = max;
				}
				else if(ang < max * -1){
					ang = max * -1;
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
			else if(this._facing == -1){
				if(ang < 0){
					ang += 2 * pi;
				}
				ang = pi - ang;
				if(ang > max){
					ang = max;
				}
				else if(ang < max * -1){
					ang = max * -1;
				}
				this._armAngle = ang;

				//console.log(this._armAngle);
				if(this._armAngle < -1 * .35 * pi){
					head_anim.switchAnimation("head4");
				}
				else if(this._armAngle < -1 * pi * .14 && this._armAngle > -1 * pi * .25){
					head_anim.switchAnimation("head3");
				}
				else if(this._armAngle >  -1 * pi * .1 && this._armAngle < .29 * pi){
					head_anim.switchAnimation("head1");
				}
				else if(this._armAngle > .31 * pi){
					head_anim.switchAnimation("head2");
				}
			}
		}
	};
	this.paint = function(ctx){
		var xOff = GM.game.getXOffset();
		var ax = this.getArmX() - xOff;
		var ay = this.getArmY();
		var cax = this.getCenterArmX() - xOff;
		var cay = this.getCenterArmY();
		var gtx = this.getGunTipX() - xOff;
		var gty = this.getGunTipY();
		var prev = null;
		ctx.strokeStyle = "rgba(255,255,255,.1)";
		for(var b = bullets; b != null; b = b.next){
			b.t -= GM.game.delta;
			if(b.t <= 0){
				if(prev == null){
					bullets = bullets.next;
				}
				else{
					prev.next = b.next;
				}
			}
			ctx.beginPath();
			ctx.moveTo(gtx, gty);
			ctx.lineTo(gtx + b.xDiff, gty + b.yDiff);
			ctx.stroke();
			ctx.closePath();
			prev = b;
		}
		if(!this._dead){
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
			ctx.strokeRect(this._x - xOff, this._y, this._width, this._height);
			//bullets = null;
			if(GM.debug){
				//ctx.fillText(Math.round(this._x) + "," + Math.round(this._y), this._x - GM.game.getXOffset(), this._y - 10);
			}
			if(this._hurt){
				ctx.globalAlpha = 1;
			}
		}
		else{
			ctx.strokeRect(this._x - xOff, this._y, this._width, this._height);
			animation_set.drawFrame(this._x - xOff - (14 * this._facing), this._y + 5, this._width, this._height, ctx, this._facing);
		}
	};


	//adds bullet to linked list
	function addBullet(angle, hyp){
		var b = {
			a: angle,
			xDiff:  Math.cos(angle) *  hyp,
			yDiff:  Math.sin(angle) * hyp,
			t: 40,
			next: null
		};
		if(bullets == null){
			bullets = b;
		}
		else{
			b.next = bullets;
			bullets = b;
		}
	}

	//if first, add other bullets randomly above and below
	this.shoot = function(first){
		if(shotLocked) return;
		if(shooting) return;
		if(this._rolling){return;}
		if(this._ammo <= 0){
			GM.deps.empty.play();
			return;
		}


		shotLocked = true;
		if(GM.deps.shot1.currentTime == 0 || GM.deps.shot1.ended){
			GM.deps.shot1.play();
			console.log("1");
		}
		else if(GM.deps.shot2.currentTime == 0 || GM.deps.shot2.ended){
			console.log("2");
			GM.deps.shot2.play();	
		}
		else{
			GM.deps.shot3.play();
		}
		//this._yVel -= 2;
		shooting = true;
		var xOff = GM.game.getXOffset();
		var cax = this.getCenterArmX();
		var cay = this.getCenterArmY();
		var x1 = this.getGunTipX(); //again, apologies for hard coding
		var y1 = this.getGunTipY();

		this._ammo--;

		var shootAngle = this.getShootAngle();
		var hyp = GM.game.shootGun(x1, y1, shootAngle);
		addBullet(shootAngle, hyp);

		shootAngle = this.getShootAngle() + (.01 + .015 * Math.random());
		hyp = GM.game.shootGun(x1, y1, shootAngle);
		addBullet(shootAngle, hyp);

		shootAngle = this.getShootAngle() - (.01 + .015 * Math.random());
		hyp = GM.game.shootGun(x1, y1, shootAngle);
		addBullet(shootAngle, hyp);


		
		//check for collisions with enemies etc. call a GM.game function which handles this
		
		
		var that = this;
		arm_anim.switchAnimation("shot", function(){
			that.unshoot();
			arm_anim.switchAnimation("arms");
			//bullet falling
			GM.game.generateParticles({
				x: that.getGunTipX() - GM.game.getXOffset(),
				y: that.getGunTipY(),
				num: 1,
				angle: Math.PI/-2,
				angle_variance: Math.PI/2,
				time: 500,
				time_variance: 100,
				init_speed_x: .05, //px/ms
				init_speed_y: .1,
				color: "#FF0"
			})
		});
		
		
		
		//animation_set.switchAnimation("swing_sword", doneSwing);
	};

	this.unshoot = function(){
		shooting = false;
	}

	this.unlockShot = function(){
		shotLocked = false;
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
		if(this._rolling || !this.onPlatform() || rollLocked || this._dead){return;}
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
		if(this.onPlatform() && !this._ducking && !this._rolling && !this._dead){	
			Player.prototype.jump.call(this);
			if(animation_set.getCurAnimation() == "jumping"){
				animation_set.switchAnimation("jumping2");
			}
			else{
				animation_set.switchAnimation("jumping");
			}
		}
	}

	this.hurt = function(amt){
		Player.prototype.hurt.call(this, amt);
		GM.game.updateHUD();
	};
	this.gainHealth = function(amt){
		Player.prototype.gainHealth.call(this, amt);
		GM.game.updateHUD();
	};

	this.gainAmmo = function(amt){
		this._ammo += amt;
	};
	this.getAmmo = function(amt){
		return this._ammo;
	};

	this._die = function(){
		Player.prototype._die.call(this);

		//after death animation
		animation_set.switchAnimation("dying", function(){
			animation_set.switchAnimation("dead");
			GM.game.handlePlayerDeath();
		});
	}
};

GM.utils.inherits(Player, Person);