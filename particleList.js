GM.particleList = (function(){
	var that = this;
	var root = null;

	that.update = function(){
		var prev = null;
		var node = root;
		while(node != null){
			node.time -= GM.game.delta;
			node.x += node.xVel * GM.game.delta;
			node.y += node.yVel * GM.game.delta; 
			node.yVel += .00134 * GM.game.delta; //gravity hard coded
			if(node.time <= 0){
				//remove
				if(prev == null){
					//front
					root = root.next;
					node = node.next;
				}
				else{
					prev.next = node.next;
					node = node.next;
				}
			}
			else{
				prev = node;
				node = node.next;
			}
		}
	};

	that.paint = function(ctx){
		var curColor = "";
		for(var node = root; node != null; node = node.next){
			if(curColor != node.color){
				//avoid changing context as much
				ctx.fillStyle = node.color;
			}
			ctx.fillRect(node.x, node.y, 2, 2);
		}
	}
	that.generateParticles = function(stg){
		var defaults = {
			x: 100,
			y: 100,
			num: 10,
			angle: Math.PI,
			angle_variance: 2 * Math.PI,
			time: 500,
			time_variance: 100,
			init_speed_x: .2, //px/ms
			init_speed_y: .1,
			color: "#FFF"
		};
		GM.utils.extend_obj(stg, defaults);
		console.log(stg);
		var hav = stg.angle_variance/2;//half of angle variance
		var htv = stg.time_variance/2;
		for(var i = 0; i < stg.num; i++){
			var p = {};
			p.x = stg.x;
			p.y = stg.y;
			var ang = stg.angle + (Math.random() * stg.angle_variance) - hav;
			p.xVel = stg.init_speed_x * Math.cos(ang);
			p.yVel = stg.init_speed_y * Math.sin(ang);
			p.color = stg.color;
			p.time = stg.time + (Math.random() * stg.time_variance) - htv;
			p.next = null;
			if(root == null){
				root = p;
			}
			else{
				p.next = root;
				root = p;
			}
		}
	}
	return that;
}());