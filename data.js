//holds all of the in game data like dependencies and animations
GM.data = {
	//images/sound dependencies to be loaded before the game starts
	dependencies:[
		{
			type: 'img',
			name: 'spritesheet',
			src: 'spritesheet.gif?v2'
		}
	],
	//all of the animation data for the locations/times on spritesheet
	animation_sets:{
		Zombie:{
			idle: [
			{
				x: 0,
				y: 210,
				width: 35,
				height: 87,
				time: 500
			},
			{
				x: 35,
				y: 210,
				width: 35,
				height: 87,
				time: 500
			}
			],
			walking: [
			{
				x: 0,
				y: 210,
				width: 35,
				height: 87,
				time: 120
			},
			{
				x: 35,
				y: 210,
				width: 35,
				height: 87,
				time: 120
			},
			{
				x: 70,
				y: 210,
				width: 35,
				height: 87,
				time: 120
			},
			{
				x: 105,
				y: 210,
				width: 35,
				height: 87,
				time: 120
			},
			{
				x: 140,
				y: 210,
				width: 35,
				height: 87,
				time: 120
			},
			{
				x: 175,
				y: 210,
				width: 35,
				height: 87,
				time: 120
			},
			{
				x: 210,
				y: 210,
				width: 35,
				height: 87,
				time: 120
			},
			{
				x: 245,
				y: 210,
				width: 35,
				height: 87,
				time: 120
			},
			]
		},
		Player_arms:{
			arms: [{
				x: 54,
				y: 162,
				width: 50,
				height: 18,
				time: 1
			}],
			shot: [
			{
				x: 54,
				y: 180,
				width: 50,
				height: 18,
				time: 50
			},
			{
				x: 104,
				y: 162,
				width: 50,
				height: 18,
				time: 75
			},
			{
				x: 104,
				y: 180,
				width: 50,
				height: 18,
				time: 40
			},
			{
				x: 154,
				y: 162,
				width: 50,
				height: 18,
				time: 40
			},
			{
				x: 54,
				y: 162,
				width: 50,
				height: 18,
				time: 40
			},
			]
		},
		Player_head:{
			head1:[{
				x: 54,
				y: 140,
				width: 22,
				height: 22,
				time: 1
			}],
			head2: [{ //down facing
				x: 142,
				y: 140,
				width: 25,
				height: 22,
				time: 1
			}],
			head3: [{
				x: 98,
				y: 140,
				width: 22,
				height: 22,
				time: 1
			}],
			head4: [{
				x: 120,
				y: 140,
				width: 22,
				height: 22,
				time: 1
			}]
		},
		Player:{
			rolling: [
			{
				x: 204,
				y: 161,
				width: 57,
				height: 50,
				time: 60
			},
			{
				x: 261,
				y: 161,
				width: 57,
				height: 50,
				time: 60
			},
			{
				x: 318,
				y: 161,
				width: 57,
				height: 50,
				time: 60
			},
			{
				x: 375,
				y: 161,
				width: 57,
				height: 50,
				time: 60
			},
			{
				x: 375,
				y: 211,
				width: 57,
				height: 50,
				time: 60
			}
			],
			jumping: [
			{
				x: 54,
				y: 0,
				width: 54,
				height: 70,
				time: 70
			},
			{
				x: 108,
				y: 0,
				width: 54,
				height: 70,
				time: 70
			},
			{
				x: 162,
				y: 0,
				width: 54,
				height: 70,
				time: 10000
			}
			],
			jumping2:[
			{
				x: 54,
				y: 70,
				width: 54,
				height: 70,
				time: 70
			},
			{
				x: 108,
				y: 70,
				width: 54,
				height: 70,
				time: 70
			},
			{
				x: 162,
				y: 70,
				width: 54,
				height: 70,
				time: 10000
			}
			],
			walking: [
			/*{
				x: 0,
				y: 0,
				width: 54,
				height: 70,
				time: 35
			},*/
			{
				x: 54,
				y: 0,
				width: 54,
				height: 70,
				time: 35
			},
			{
				x: 108,
				y: 0,
				width: 54,
				height: 70,
				time: 35
			},
			{
				x: 162,
				y: 0,
				width: 54,
				height: 70,
				time: 35
			},
			{
				x: 216,
				y: 0,
				width: 54,
				height: 70,
				time: 35
			},
			{
				x: 270,
				y: 0,
				width: 54,
				height: 70,
				time: 35
			},
			{
				x: 324,
				y: 0,
				width: 54,
				height: 70,
				time: 35
			},
			{
				x: 378,
				y: 0,
				width: 54,
				height: 70,
				time: 35
			},
			/*{
				x: 0,
				y: 70,
				width: 54,
				height: 70,
				time: 35
			},*/
			{
				x: 54,
				y: 70,
				width: 54,
				height: 70,
				time: 35
			},
			{
				x: 108,
				y: 70,
				width: 54,
				height: 70,
				time: 35
			},
			{
				x: 162,
				y: 70,
				width: 54,
				height: 70,
				time: 35
			},
			{
				x: 216,
				y: 70,
				width: 54,
				height: 70,
				time: 35
			},
			{
				x: 270,
				y: 70,
				width: 54,
				height: 70,
				time: 35
			},
			{
				x: 324,
				y: 70,
				width: 54,
				height: 70,
				time: 35
			},
			{
				x: 378,
				y: 70,
				width: 54,
				height: 70,
				time: 35
			},
			],
			standing: [
				{
					x:0,
					y:140,
					width: 54,
					height: 70,
					time: 1
				}
			],
			swing_sword: [
				{
					x:0,
					y:60,
					width: 44,
					height: 60,
					time: 1
				},
				{
					x:44,
					y:60,
					width: 44,
					height: 60,
					time: 1
				},
				{
					x:88,
					y:60,
					width: 44,
					height: 60,
					time: 1
				},
			]
		}
	},

	cutscenes: {
		firstMeeting: [
		]
	}
}