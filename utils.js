GM.utils = {
	/*
		Breakdown of this form of inheritance:
		childClass inherits parent's own properties and prototype properties
		childClass has access to 'super' like methods by calling childClass.prototype.<method>
		childClass.prototype is an object of the parentClass, so any additions to childClass.prototype has no effect on the parentClass.prototype
		this method need only be called once

		For reference, this method is described in Javascript Patterns by Stoyan Stefanov on page 117
	*/
	inherits : function(childClass, parentClass){
		childClass.prototype = new parentClass();
	}
};

/* a little example
function p(){
	this.prop = "hi";
}
p.prototype.say = function(){
	console.log("Saying: " + this.prop);
}
p.prototype.prop = "default";
var p1 = new p();

function c(){
	this.prop = "child";
	this.say = function(){
		console.log("child override");
		c.prototype.say();//call to super
	}
}
GM.utils.inherits(c, p);
var c1 = new c();
c1.say();

*/