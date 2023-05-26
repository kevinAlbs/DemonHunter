<html>
<head>
	<!-- Google tag (gtag.js) -->
	<script async src="https://www.googletagmanager.com/gtag/js?id=G-5DYJH8B9RC"></script>
	<script>
	window.dataLayer = window.dataLayer || [];
	function gtag(){dataLayer.push(arguments);}
	gtag('js', new Date());

	gtag('config', 'G-5DYJH8B9RC');
	</script>
	<meta property="og:image" content="http://kevinalbs.com/demonHunter/images/cover.png" />
	<title>Kaitlin - Demon Hunter</title>
	<link href="style.css?v2" rel="stylesheet" type="text/css" />
	<style>
	</style>
</head>
<body>
<div id="container">
	<textarea id="textOverlay" disabled></textarea>
	<div id="screen-loading" class="screen no-highlight">
		<h2>Loading...</h2>
	</div>
	<div id="screen-menu" class="screen no-highlight">
		<div class="inner">
			<h1>KAITLIN</h1>
			<h2>DEMON HUNTER</h2>
			<ul>
				<li id="btn-play">Play</li>
				<li id="btn-leaderboard">Leaderboard</li>
			</ul>
		</div>
	</div>
	<div id="screen-leaderboard" class="screen no-highlight">
		<div class="inner">
		<h2>TOP 100 SCORES</h2>
		<div class="scroller">
			<table>
				<?php
					require('mysqlconfig.php');
					$results = mysqli_query($cxn, 'SELECT * FROM scores ORDER BY score DESC LIMIT 100');
					while ($row = mysqli_fetch_assoc($results)) {
					$niceDate = explode(' ', $row['date'])[0];
				?>
				<tr><td><?php echo $niceDate ?></td><td><?php echo $row['name'] ?></td><td><?php echo $row['score'] ?></td></tr>
				<?php
					}
				?>
			</table>
		</div>
		<ul><li id='btn-back'>Back to Menu</li></ul>
		</div>
	</div>
	<div id="screen-gameplay" class="screen no-highlight">
		<div id="tutorial">
			<div id="tutorial_play">PLAY!</div>
		</div>
		<canvas id="mycanvas" width="1000" height="600"></canvas>
		<div id="hud" class="cf">
			<div class="section">
				<h2>HEALTH</h2>
				<div id="health_bar">
					<div id="health_bar_fill"></div>
				</div>
			</div>
			<div class="section ammo">
				<h2>AMMO</h2>
				<h3 id="ammo_amt">100</h3>
			</div>
			<div class="section score">
				<h2>SCORE</h2>
				<div class='best-section'>
					<span class="best">BEST: <span id="best">0</span></span><br/>
					<span id="submit">[SUBMIT]</span>
				</div>
				<br style='clear:both'>
				<h3 id="score_amt">0</h3>
			</div>
			<div class="section">
				<p id="status">GO!</p>
			</div>
		</div>
		<div class="trees">
			<div class="large" id="large_tree_container">
			</div>
			<div class="small" id="small_tree_container">
			</div>
		</div>
		<img id="moon"  src="images/moon.png" />
	</div>
</div>
<footer>
	Developed by <a href="http://kevinalbs.com" target="_blank" title="View Kevin Albertson's Portfolio">Kevin Albertson</a>. 
	View source or contribute on <a href="https://github.com/kevinAlbs/DemonHunter" target="_blank" title="View GitHub repository">GitHub</a>. Works best in Chrome/Firefox.
</footer>
<p id="debug"></p>
<script>
	var GM = {}; //mediator for gameplay, screens, dependency loading
	GM.debug = true;
	//I don't quite like the sequential file loading, but it'll do for now
	//Also, the naming scheme is Capital first for class, lowercase for singleton (just object)
</script>

<script src="data.js"></script>
<script src="mapData.js"></script>
<script src="utils.js"></script>
<script src="GM.js"></script>
<script src="Screen.js"></script>
<script src="GameScreen.js"></script>
<script src="LeaderboardScreen.js"></script>
<script src="MenuScreen.js"></script>
<script src="LoadingScreen.js"></script>
<script src="Paintable.js"></script>
<script src="TextOverlay.js"></script>
<script src="Animation.js"></script>
<script src="AnimationSet.js"></script>
<script src="Movable.js"></script>
<script src="Tree.js"></script>
<script src="Mob.js"></script>
<script src="Person.js"></script>
<script src="Player.js"></script>
<script src="Enemy.js"></script>
<script src="Zombie.js"></script>
<script src="Centaur.js"></script>
<script src="FireBreather.js"></script>
<script src="Flyer.js"></script>
<script src="game.js"></script>
<script src="viewport.js"></script>
<script src="Spike.js"></script>
<script src="Pickup.js"></script>
<script src="Platform.js"></script>
<script src="platformList.js"></script>
<script src="FireBall.js"></script>
<script src="enemyList.js"></script>
<script src="particleList.js"></script>
<script>
function pageLoaded(){
	//onces deps are loaded, start game
	GM.switchScreen(new LoadingScreen(new MenuScreen()));
}
window.addEventListener("load", pageLoaded);
</script>

</body>
</html>
