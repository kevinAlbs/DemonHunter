function Platform(){
	this.spikes = null;
	this.next = null;
	this.prev = null;

	this.addSpike = function(x){
		var ns = new Spike();
		ns.setX(x);
		ns.setY(this._y - ns._height);
		ns.next = this.spikes;//add to front
		this.spikes = ns;
	}
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
				return m;
			}
		}
		return null;
	};
	this.paint = function(ctx){
		var xOff = GM.main.getXOffset();
		ctx.strokeRect(Math.round(this._x - xOff), Math.round(this._y), this._width, this._height);
		for(var node = this.spikes; node != null; node = node.next){
			node.paint(ctx);
		}
	};
}
GM.utils.inherits(Platform, Movable);