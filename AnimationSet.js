//manages multiple animations (making it easier for mobs to switch between different animations etc.)
function AnimationSet(set){
	if(this == window){
		return new AnimationSet(set);
	}	
	this._set = {};
	this._curAnimation = null;//string of property in this._set of current animation set
	for(prop in set){
		if(set.hasOwnProperty(prop)){
			//create a new animation for this
			this._set[prop] = new Animation(set[prop]);
		}
	}
	//switches and resets current animation
	this.switchAnimation = function(newAnim){
		if(newAnim == this._curAnimation){
			return;//ignore since it is already on this animation
		}
		if(this._curAnimation != null){
			this._set[this._curAnimation].reset();
		}
		if(newAnim in this._set){
			this._curAnimation = newAnim;
		}
		else{
			console.log(newAnim + "not in animation set");
		}
	}

	this.drawFrame = function(x,y,width,height,ctx, dir){
		this._set[this._curAnimation].drawFrame(x,y,width,height,ctx,dir);
	}

	this.getCurAnimation = function(){
		return this._curAnimation;
	}
}