function Person(){
	if(this == window){
		return new Person();
	}
	this._health = 100;
	this._hurt = false;//true when person gets hurt, true during entire hurt state (TODO: decide if I should use _state for this)
//	this._justHurt = false;//true when person gets hurt for ONE UPDATE
	this._hurtTicks = 0;//hurt timer
	this._maxHurtTicks = 10;//amount of time person is in hurt state
};

//inheritance must go before any prototype additions (since it will set prototype to new object)
GM.utils.inherits(Person, Mob);

Person.prototype._die = function(){
	this._x = -1000;//lol
};

//public
Person.prototype.update = function(){
	if(this._hurt){
		/*
		if(this._hurtTicks == 0){
			this._justHurt = true;
		}
		else{
			this._justHurt = false;
		}
		*/
		this._hurtTicks++;
		if(this._hurtTicks > this._maxHurtTicks){
			//done with hurt state
			this._hurt = false;
			this._hurtTicks = 0;
		}
	}
};
//returns true if damage was inflicted
Person.prototype.hurt = function(amt){
	if(this._hurt){
		return false;//already hurt, cannot be hurt while in hurt state
	}

	this._hurt = true;
	if(this._health <= amt){
		this._die();
	}
	this._health -= amt;
	return true;
};

Person.prototype.isHurt = function(){
	return this._hurt;
};

Person.prototype.getHealth = function(){
	return this._health;
};

Person.prototype.isDead = function(){
	return this._health <= 0;
}