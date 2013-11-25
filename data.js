//holds all of the in game data like dependencies and animations
GM.data = {
	//images/sound dependencies to be loaded before the game starts
	dependencies:[
		{
			type: 'img',
			name: 'spritesheet',
			src: 'spritesheet.gif?v3'
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
					time: 5
				},
				{
					x:88,
					y:60,
					width: 44,
					height: 60,
					time: 2
				},
			]
		},
		Professor:{
			injured: [
				{
					x:0,
					y:120,
					width: 60,
					height: 22,
					time: 1
				}
			],
		}
	},

	cutscenes: {
		firstMeeting: [
		{
			name: "Kaitlin",
			text: "Wha... where am I\n"
		},
		{
			text: "I was just walking down a sidewalk, and then the next thing I know I end up here\n"
		},
		{
			text: "I feel dizzy...\n"
		},
		{
			text: "I guess I should figure out where I am\n"
		}
		],
		//when kaitlin meets prof.
		meet:[
		{
			name: "Man",
			text: "Hello? Is someone there?\n"
		},
		/*{
			name: "Kaitlin",
			text: "Yes yes! You look injured, are you alright?!\n"
		},
		{
			name: "Man",
			text: "I'm very weak... I'm losing a lot of blood\n"
		},
		{
			text: "I need some kind of bandage, and some nutrition... I..\n"
		},
		{
			text: "take this weapon, it may help you\n"
		},
		{
			name: "Kaitln",
			text: "I know you're in pain but can you tell me where I am?\n"
		},
		{
			name: "Man",
			text: "I'll tell you everything, just get me something to bandage this wound\n"
		}*/
		]
	}
}