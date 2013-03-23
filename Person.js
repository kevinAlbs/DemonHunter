function Person(){
	if(this == window){
		return new Person();
	}
	this._health = 100;
	this._hurt = function(amt){
		this._health -= amt;
	};
};
GM.utils.inherits(Person, Mob);