function Platform(){
	this._pickups = null;//health and ammo
	this.spikes = null;
	this.next = null;
	this.prev = null;

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
		ctx.strokeRect(Math.round(this._x - xOff), Math.round(this._y), this._width, this._height);
		for(var node = this.spikes; node != null; node = node.next){
			node.paint(ctx);
		}
		for(var node = this._pickups; node != null; node = node.next){
			node.paint(ctx);
		}
	};
}
GM.utils.inherits(Platform, Movable);