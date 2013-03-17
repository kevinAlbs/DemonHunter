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

	function updateFrame(){
		this._ticks++;
		if(this._ticks > this._frames[this._curFrame]){
			this._curFrame++;
			if(this._curFrame >= this._frames.length){
				this._curFrame = 0;
			}
			this._ticks = 0;
		}
	}
	/*
		x,y,width,height - describes bounding box of mob/object which this animation applies to,
		the image will be centered around this rectangular area
	*/
	this.drawFrame = function(x,y,width,height,ctx){
		var f = this._frames[this._curFrame];
		ctx.drawImage(f.x, f.y, f.width, f.height, x, y, f.width, f.height);
	}
};

