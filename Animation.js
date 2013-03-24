/* 
	frames describes each frame in the animation:
	frames = [
		{
			x,
			y,
			width,
			height,
			time <in updates>	
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
		this._ticks++;
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
	this.drawFrame = function(x,y,width,height,ctx, dir){
		var f = this._frames[this._curFrame];
		var flip = 1, offset = 0;
		if(dir == -1){
			ctx.save();
			ctx.scale(-1, 1);
			flip = -1;
			offset = -1 * width;
		}
		ctx.drawImage(GM.deps.spritesheet, f.x, f.y, f.width, f.height, flip * x + offset, y,  f.width, f.height);
		if(dir == -1){
			ctx.restore();
		}
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
};

