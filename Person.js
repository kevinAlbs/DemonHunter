function Person(){
	if(this == window){
		return new Person();
	}
	this._maxHealth = 100;
	this._dead = false;
	this._dying = false;//true when in process of dying (show animation, etc.)
	this._health = 100;
	this._hurt = false;//true when person gets hurt, true during entire hurt state (TODO: decide if I should use _state for this)
//	this._justHurt = false;//true when person gets hurt for ONE UPDATE
	this._hurtTicks = 0;//hurt timer
	this._maxHurtTicks = 500;//amount of time person is in hurt state (in milliseconds)
};

//inheritance must go before any prototype additions (since it will set prototype to new object)
GM.utils.inherits(Person, Mob);

Person.prototype._die = function(){
	this._dead = true;
	this._dying = true;
	//this.moveX(0);
};

//public
Person.prototype.update = function(){
	if(this._dead){
		this._hurt = false;
		this._xVel *= .95;
		return;
	}
	if(this._hurt){
		this._hurtTicks += GM.game.delta;
		if(this._hurtTicks > this._maxHurtTicks){
			//done with hurt state
			this._hurt = false;
			this._hurtTicks = 0;
		}
	}
};
/*
returns 0 if could not inflict since already in hurt state
returns 1 if could hurt but not dead
returns 2 if dead
*/
Person.prototype.hurt = function(amt){
	if(this._dead){return;}
	if(this._hurt){
		return 0;//already hurt, cannot be hurt while in hurt state
	}
	this._hurt = true;
	if(this._health <= amt){
		this._health = 0;
		this._die();
		return 2;
	}
	this._health -= amt;
	return 1;
};

Person.prototype.gainHealth = function(amt){
	if(this._dead){return;}
	this._health += amt;
	if(this._health > this._maxHealth){
		this._health = this._maxHealth;
	}
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