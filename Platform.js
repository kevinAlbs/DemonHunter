function Platform(){
	this._pickups = null;//health and ammo
	this.spikes = null;
	this.next = null;
	this.prev = null;
	var leftSide = new AnimationSet(GM.data.animation_sets.Platform);
	var middle = new AnimationSet(GM.data.animation_sets.Platform);
	var rightSide = new AnimationSet(GM.data.animation_sets.Platform);
	leftSide.switchAnimation("left");
	middle.switchAnimation("middle");
	rightSide.switchAnimation("right");


	this.addPickup = function(p){
		p.setY(this._y - p.getHeight());
		p.next = this._pickups;
		this._pickups = p;
	};

	this.addSpike = function(x){
		var ns = new Spike();
		ns.setX(x);
		ns.setY(this._y - ns._height);
		ns.next = this.spikes;//add to front
		this.spikes = ns;
	};

	this.addSpikes = function(num){
		//partition width into num pieces
		//sorry for magic num but 20 is width of spike
		var widthStep = (this.getWidth() - 20) / num;
		var start = this.getX();
		for(var i = 0; i < num; i++){
			this.addSpike(start + Math.random() * widthStep);
			start += widthStep;
		}
	};

	/* @return Object Either the node it collides with or null */
	this.collisionWithSpikes = function(m){
		for(var node = this.spikes; node != null; node = node.next){
			if(node.collidingWith(m)){
				return node;
			}
		}
		return null;
	};

	/* @return Array Pickups which m is colliding with or empty array */
	this.collisionWithPickups = function(m, remove){
		var coll = [];
		var prev = null;
		for(var node = this._pickups; node != null; node = node.next){
			if(node.collidingWith(m)){
				coll.push(node);
				if(remove){
					node.onCollide();
					//remove from list
					if(prev == null){
						//front of list
						this._pickups = this._pickups.next;
					}
					else{
						prev.next = node.next;
					}
				}
			}
			prev = node;
		}
		return coll;
	};

	this.paint = function(ctx){
		var xOff = GM.game.getXOffset();
		if(GM.game.rectangleDebug){
			ctx.strokeRect(Math.round(this._x - xOff), Math.round(this._y), this._width, this._height);
		}
		var lsw = 78, //left side width (sorry for hard coding)
			rsw = 19,
			mw = 133;
		if(lsw > this._width){
			if(rsw > this._width){
				//clip both
				lsw = this._width/2;
				rsw = lsw;
			}
			else{
				//clip
				lsw = this._width - rsw;	
			}
			
		}
		leftSide.drawFrame(this._x - xOff, this._y, this._width, this._height, ctx, 1, false, 0,0, lsw, false);
		var widthForMiddle = this._width - lsw - rsw;
		var curX = this._x - xOff + lsw;
		while(widthForMiddle > 0){
			var appliedWidth = mw;
			if(appliedWidth > widthForMiddle){
				appliedWidth = widthForMiddle;
			}
			middle.drawFrame(curX, this._y, this._width, this._height, ctx, 1, false, 0,0, appliedWidth, false);//clip off width if necessary
			widthForMiddle -= appliedWidth;
			curX += appliedWidth;
		}
		rightSide.drawFrame(curX, this._y, this._width, this._height, ctx, 1, false, 0, 0, rsw, false);
		for(var node = this.spikes; node != null; node = node.next){
			node.paint(ctx);
		}
		for(var node = this._pickups; node != null; node = node.next){
			node.paint(ctx);
		}
	};
}
GM.utils.inherits(Platform, Movable);