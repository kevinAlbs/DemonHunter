//holds all of the in game data like dependencies and animations
GM.data = {
	//images/sound dependencies to be loaded before the game starts
	dependencies:[
		{
			type: 'img',
			name: 'spritesheet',
			src: 'spritesheet.gif?V2'
		}
	],
	//all of the animation data for the locations/times on spritesheet
	animation_sets:{
		Player:{
			walking: [
			{
				x: 0,
				y: 0,
				width: 22,
				height: 60,
				time: 10
			},
			{
				x: 22,
				y: 0,
				width: 22,
				height: 60,
				time: 10
			},
			{
				x: 44,
				y: 0,
				width: 22,
				height: 60,
				time: 10
			},
			{
				x: 66,
				y: 0,
				width: 22,
				height: 60,
				time: 10
			},
			{
				x: 88,
				y: 0,
				width: 22,
				height: 60,
				time: 10
			},
			{
				x: 110,
				y: 0,
				width: 22,
				height: 60,
				time: 1
			}
			],
			standing: [
				{
					x:0,
					y:0,
					width: 22,
					height: 60,
					time: 1
				}
			]
		}
	}
}