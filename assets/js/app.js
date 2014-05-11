//Developed by: Fabian Marin
//Feel free to do whatever you want with this code ;)
//Desparche day 05/05/2014 


var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

//Main ship
var ship = {
	x:100,
	y:canvas.height - 120,
	width: 50,
	height: 70,
	speed : 6,
	image: null,
	status: 'alive',
	lives: 3,
	counter: 0
}

//Keyboard keys
var keyBoard = {};
var game = {
	status: 'initializing',
	enemys: 10
};
var text = {
	counter: -1,
	title:'',
	legend: ''
}
//Shoots array
var shoots = [];
var enemyShoots = [];
//Enemys array
var enemys = [];
var background;
var miniShip = {
	x: canvas.width,
	y: canvas.height - 40,
	width: 25,
	height: 35,
	image: null
}
var aImg = "assets/images/";
var assetsJs = "assets/js/";
var assetsLib = "assets/lib/";
var aMusic = "assets/music/";

var images = [aImg + 'bg.jpg',aImg + 'space.png',aImg + 'ship.png', aImg + 'ship_min.png',aImg + 'enemy.png', aImg + 'shoot.png', aImg + 'enemy_shoot.png'];
var music = [
		{name:'soundBg', file: aMusic + 'bgmusic.mp3'},
		{name:'soundShot', file: aMusic + 'laser_shot.mp3'},
		{name:'soundEnemyShot', file: aMusic + 'laser_enemy.mp3'},
		{name:'soundDead', file: aMusic + 'player_explode.wav'},
		{name:'soundDeadEnemy', file: aMusic + 'enemy_explode.wav'},
		{name:'soundWin', file: aMusic + 'win.mp3'},
		{name:'soundLose', file: aMusic + 'lose.mp3'},
	];
var preloader;
var miniShips= [];
var enemyImg, shootImg, enemyShootImg, soundBg,soundShot, soundEnemyShot, soundDead, soundDeadEnemy, soundWin, soundLose;
//Load the game when the background was loaded
function loadMedia(){
	preloader = new createjs.LoadQueue();
	preloader.on("progress", handleProgress); 
	preloader.on("complete", handleComplete);	

	//preloader.onProgress = loadProgress;
	load();
}
function load(){
	while (images.length > 0) {
		var image = images.shift();
		preloader.loadFile(image);
	}
}
function handleProgress(e) {	
	//console.log(parseInt(preloader.progress * 100) + '%');
}
function handleComplete(e) {
	background = new Image();
	background.src = aImg + 'space.png';
	background.onload = function() {
		//Ship 
		ship.image = new Image();
		ship.image.src = aImg +  'ship.png'

		//Mini Shi
		miniShip.image = new Image();
		miniShip.image.src = aImg +  'ship_min.png';

		//Enemy image
		enemyImg = new Image();
		enemyImg.src = aImg +  'enemy.png';

		//SHoot Image
		shootImg = new Image();
		shootImg.src = aImg +  'shoot.png';

		//Enemy shoot
		enemyShootImg = new Image();
		enemyShootImg.src = aImg +  'enemy_shoot.png';

		
		loadAudio(function(){			
			playSound('soundBg');
		});



		var interval = window.setInterval(frameLoop, 1000/55);

		ship.image.onload = function() {
			
			miniShip.image.onload = function(){
				
			}
		}	
	}
}
function loadAudio(callback){
	var countMusic = 0;
	var canContinue = false;
	for (var i in music) {
		var sound = music[i];

		sound.element = document.createElement('audio');
		document.body.appendChild(sound.element);
		sound.element.setAttribute('src', sound.file);

		sound.element.addEventListener('canplaythrough', function() { 
		   //audio.play();
		   //can play thr
		   countMusic++;
		   if(countMusic == music.length) {
		   	callback();
		   } 
		   //console.log('can play throught');
		}, false);
		 //console.log('sound ready?');
	};

	//while (countMusic != music.length) {
	//	console.log("CARGANDO SONIDOS")
	//}
	//console.log(countMusic)
	//console.log(music.length)
	//console.log("YA CARGARON LOS SONIDOS");

/*	//Background music
	soundBg = document.createElement('audio');
	document.body.appendChild(soundBg);
	soundBg.setAttribute('src', 'bgmusic.mp3');

	soundBg.play();

	//Player shot
	soundShot = document.createElement('audio');
	document.body.appendChild(soundShot);
	soundShot.setAttribute('src', 'laser_shot.mp3');

	//Enemy shot sound
	soundEnemyShot = document.createElement('audio');
	document.body.appendChild(soundEnemyShot);
	soundEnemyShot.setAttribute('src', 'laser_enemy.mp3');
	
	//Player dies
	soundDead = document.createElement('audio');
	document.body.appendChild(soundDead);
	soundDead.setAttribute('src', 'player_explode.wav');
	
	//Enemy dies
	soundDeadEnemy = document.createElement('audio');
	document.body.appendChild(soundDeadEnemy);
	soundDeadEnemy.setAttribute('src', 'enemy_explode.wav');
	 
	//Win
	soundWin = document.createElement('audio');
	document.body.appendChild(soundWin);
	soundWin.setAttribute('src', 'win.mp3');
	
	//Lose
	soundLose = document.createElement('audio');
	document.body.appendChild(soundLose);
	soundLose.setAttribute('src', 'lose.mp3');*/
}
function playSound(soundName, clone){
	var sound = music.filter(function (sound) {
	    return sound.name === soundName;
	})[0];

	if(clone) {
		var audio = sound.element.cloneNode()	
		audio.play();
	} else {
		sound.element.play();
	}
}
function stopSound(soundName){
	var sound = music.filter(function (sound) {
	    return sound.name === soundName;
	})[0];

	sound.element.pause()		
}
function drawBackground(){
	ctx.drawImage(background,0,0);
}
function drawShip() {
	ctx.save();
	//ctx.fillStyle = 'red';
	//ctx.fillRect(ship.x,ship.y,ship.width,ship.height);
	if(keyBoard[37] || keyBoard[39]) {
		//apply alpha
		ctx.globalAlpha = 0.8;
	} else {
		ctx.globalAlpha = 1;
	}
	ctx.drawImage(ship.image, ship.x, ship.y, ship.width, ship.height);
	ctx.restore();
}

function drawLives(){
	
	for (var i = 1; i <=  ship.lives; i++) {		
		ctx.save();
		ctx.drawImage(miniShip.image, miniShip.x - (i * 50), miniShip.y, miniShip.width, miniShip.height);
		ctx.restore();
	};
	
	
}


function drawShoot() {
	//ctx.save();
	//ctx.fillStyle = 'red';
	for (var i in shoots) {
		var shoot = shoots[i];
		ctx.drawImage(shootImg,shoot.x,shoot.y,shoot.width,shoot.height);
	};	
	//ctx.restore();
}
function fire(){

	playSound('soundShot', true);

	shoots.push({
		x: ship.x + 10,
		y: ship.y - 10,
		width: 30,
		height: 34,
		status:'fired'
	})
}
function moveShoots(){
	for(var i in shoots) {
		var shoot = shoots[i];
		shoot.y -= 2;
	}
	//Remove the outside shoots and the hitted shoots
	shoots = shoots.filter(function(shoot){
		return shoot.y > 0 && shoot.status == 'fired';
	});
}

function updateEnemys(){

	function addEnemyShoot(enemy) {
		return {
			x: enemy.x,
			y: enemy.y,
			width: 10,
			height: 30,
			counter: 0
		};
	}

	if(game.status == 'initializing') {
		for (var i = 0; i < game.enemys; i++) {
			enemys.push({
				x: 10 + (i * 50),
				y:10, 
				height:26, 
				width:40,
				status:'alive',
				count: 0
			});
		};

		game.status = 'playing';
	}

	//if(game.status != 'playing') return;

	for (var i in enemys) {
		var enemy = enemys[i];
		if(!enemy) continue;
		if(enemy.status == 'alive') {
			enemy.count++;
			enemy.x += Math.sin(enemy.count * Math.PI/90) * 5;
			//console.log(enemy.count)

			if(random(0, enemys.length * 10) == 1) {				
				playSound('soundEnemyShot', true);

				enemyShoots.push({
					x: enemy.x,
   					y: enemy.y + enemy.height,
					width: 10,
					height: 30,
					counter: 0
				});
				//console.log(enemyShoots);
			}

		}
		if(enemy.status == 'hit') {
			//Do this if you wanna hide the enemy a few moments later
			enemy.count++;
			if(enemy.count >= 10) {
				enemy.status = 'dead';
				enemy.count = 0;				
			}		
		}
	};

	enemys = enemys.filter(function(enemy){
		return !(enemy.status == 'dead');
	});
}

function drawEnemys(){
	
	for (var i in enemys) {

		//ctx.save();
		//ctx.fillStyle = 'orange';
		var enemy = enemys[i];
		ctx.drawImage(enemyImg,enemy.x,enemy.y,enemy.width,enemy.height);
		//ctx.restore();
	};	
	
}

function drawEnemyShoots(){	
	//console.log(enemyShoots);
	for (var i in enemyShoots) {
		
		//ctx.save();
		//ctx.fillStyle = 'yellow';
		var shoot = enemyShoots[i];
		ctx.drawImage(enemyShootImg,shoot.x,shoot.y,shoot.width,shoot.height);
		//ctx.restore();
	};	

}
function moveEnemyShoots(){

	if(game.status != 'playing') return;

	for(var i in enemyShoots) {		
		var shoot = enemyShoots[i];
		shoot.y += 3;
	}
	//Remove the outside shoots and the hitted shoots
	enemyShoots = enemyShoots.filter(function(shoot){
		return shoot.y < canvas.height;
	});
}


function hit(a,b){
	 return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}

function collitions(){
	for(var i in shoots) {
		var shoot = shoots[i];
		for (var k in enemys) {
			var enemy = enemys[k];
			//Verify if a shoot make contact with an enemy
			if(hit(shoot, enemy)) {

				playSound('soundDeadEnemy', true);

				enemy.status = 'hit';
				enemy.counter = 0;
				shoot.status = 'hitted';
			}
		};
	}

	if(ship.status == 'hit' || ship.status == 'dead') return;

	for (var i in enemyShoots) {
		var shoot = enemyShoots[i];
		if(hit(shoot, ship)) {
			playSound('soundDead', true);
			ship.status = 'hit';
			ship.lives--;			
		}
	};
}

function moveShip(){
	if(keyBoard[37]) {
		//Move to the left
		ship.x -= ship.speed;
		if(ship.x < 0) {
			ship.x = 0;
		}
	}
	if(keyBoard[39]) {
		//Move to the right
		ship.x += ship.speed;
		var limit = canvas.width - ship.width;
		if(ship.x > limit) {
			ship.x = limit;
		}
	}
	if(keyBoard[32]) {
		if(!keyBoard.fire) {
			keyBoard.fire = true;
			fire();
		}
		
	} else {
		keyBoard.fire = false;
	}


	if(ship.status == 'hit'){
		//ship.counter++;
		//if(ship.counter >= 20) {
			ship.counter = 0;
			ship.status = 'dead';
			

			//text.title = 'Se lo bajaron';
			//text.legend = 'Dele a la R para seguir apa';			
			//text.counter = 0;


		//}

		//Restart game if there is more lives left
		if(ship.lives > 0) {
			game.status = 'restart';
		} else {
			game.status = 'over';

			text.title = 'Se lo bajaron';
			text.legend = 'Dele un balazo para seguir apa';			
			text.counter = 0;
			
			stopSound('soundBg');
			playSound('soundLose');


		}
	}
}
function addKeyEvents(){

	addEvent(document, 'keydown', function(e){		
		keyBoard[e.keyCode] = true;		
	});

	addEvent(document, 'keyup', function(e){
		keyBoard[e.keyCode] = false;
	});

	function addEvent(element, event, func){
		//Validate if the user have a real browser
		if(element.addEventListener) {
			element.addEventListener(event,func,false);
		} else {
			element.attachEvent(event, func);
		}
	}
}

function updateGameStatus(){
	if(game.status == 'playing' && enemys.length == 0) {
		stopSound('soundBg');
		playSound('soundWin');

		game.status = 'win';
		text.title = 'Gano parce!';
		text.legend = 'De un balazo volver a jugar';
		text.counter = 0;		
	} 
	if(game.status == 'restart') {
		restart();
	}
	/*else if(game.status == 'over' && enemys.length > 0) {
		game.status = 'game_over';
		text.title = 'Se lo culearon';
		text.legend = 'Dele a la R para volver a jugar';
		text.counter = 0;
	}*/
	
	if(text.counter >= 0) {
		text.counter++;
	}
}

function restart() {
	/*
	ship = {
		x:100,
		y:canvas.height - 120,
		width: 50,
		height: 70,
		speed : 6,
		image: ship.image,
		status: 'alive',
		lives: ship.status,
		counter: 0
	}
	*/



	enemyShoots = [];


	ship.x = 100;
	ship.status = 'alive';

	game.status = 'playing';
}

function drawText(){
	if(text.counter == -1) return;
	var alpha = text.counter/50.0;
	if(alpha>1) {
		for (var i in enemys) {
			delete enemys[i];
		};

		for (var i in enemyShoots) {
			delete enemyShoots[i];
		};
	}
	ctx.save();
	ctx.globalAlpha = alpha;

	if(game.status == 'over' || game.status == 'win') {
		ctx.fillStyle = 'white';
		ctx.font = 'Bold 30pt Arial';
		ctx.fillText(text.title, 100, 200);
		ctx.font = '15pt Arial';
		ctx.fillText(text.legend, 190, 250);
	}
	ctx.restore();
}

function random(min, max) {
	var chances = max - min;
	var a = Math.random() * chances;
	a = Math.floor(a);
	return parseInt(min) + a;
}

function frameLoop(){	
	updateGameStatus();
	moveShip();
	moveShoots();
	collitions();
	updateEnemys();
	moveEnemyShoots();

	drawBackground();
	drawShip();
	drawLives();
	drawShoot();
	drawEnemys();
	drawText();
	drawEnemyShoots();
	
}


loadMedia();
addKeyEvents();