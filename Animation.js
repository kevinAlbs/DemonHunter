/* 
	frames describes each frame in the animation:
	frames = [
		{
			x,
			y,
			width,
			height,
			time <in milliseconds>	
		},
		{...}
		...
	]
*/

function Animation(frames){
	if(this == window){
		return new Animation(frames);
	}
	this._frames = frames;
	this._curFrame = 0;
	this._ticks = 0;//counter incremented on update, set to 0 on each frame change

	var callback = false;

	this._updateFrame = function(){
		this._ticks += GM.game.delta;
		if(this._ticks > this._frames[this._curFrame].time){
			this._curFrame++;
			if(this._curFrame >= this._frames.length){
				//animation loop finished
				this._curFrame = 0;
				if(callback){
					callback();
				}
			}
			this._ticks = 0;
		}
	};
	/*
		x,y,width,height - describes bounding box of mob/object which this animation applies to,
		the image will be centered around this rectangular area
		dir - the direction the mob is facing (1 for right, -1 for left), image will be flipped to face that direction
	*/
	this.drawFrame = function(x,y,width,height,ctx, dir, rot, rx, ry, clipWidth, clipHeight){
		var f = this._frames[this._curFrame];
		var flip = 1, offset = 0;
		ctx.save();
		if(dir == -1){
			ctx.scale(-1, 1);
			flip = -1;
			offset = -1 * width;
		}
		
		ctx.translate(Math.round(flip * x + offset),Math.round(y));
		if(rot){
			ctx.translate(Math.round(rx), Math.round(ry));
			ctx.rotate(rot);
			ctx.translate(-1 * Math.round(rx), -1 * Math.round(ry));
		}
		var w = f.width,
			h = f.height;
		if(clipWidth){
			w = clipWidth;
		}
		if(clipHeight){
			h = clipHeight;
		}
		ctx.drawImage(GM.deps.spritesheet, Math.round(f.x), Math.round(f.y), w, h, 0, 0, w, h);
		//ctx.fillRect(0,0, Math.round(f.width), Math.round(f.height));
		if(dir == -1){
			
		}
		ctx.restore();
		this._updateFrame();
	};

	this.reset = function(){
		this._ticks = 0;
		this._curFrame = 0;
		callback = false;
	};

	this.setCallback = function(cb){
		callback = cb;
	};

	this.getCurFrame = function(){
		return this._curFrame;
	}

};

