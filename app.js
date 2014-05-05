var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

//Main ship
var ship = {
	x:100,
	y:canvas.height - 100,
	width: 50,
	height: 50,
	speed : 6
}

var keyBoard = {};
var game = {
	status: 'initializing',
	enemys: 10
};
var shoots = [];
var enemys = [];
var background;
function loadMedia(){
	background = new Image();
	background.src = 'space.png';
	background.onload = function() {
		var interval = window.setInterval(frameLoop, 1000/55);
	}
}
function drawBackground(){
	ctx.drawImage(background,0,0);
}
function drawShip() {
	ctx.save();
	ctx.fillStyle = 'red';
	ctx.fillRect(ship.x,ship.y,ship.width,ship.height);
	ctx.restore();
}
function drawShoot() {
	ctx.save();
	ctx.fillStyle = 'yellow';
	for (var i in shoots) {
		var shoot = shoots[i];
		ctx.fillRect(shoot.x,shoot.y,shoot.width,shoot.height);
	};	
	ctx.restore();
}
function fire(){
	shoots.push({
		x: ship.x + 20,
		y: ship.y - 10,
		width: 10,
		height: 10
	})
}
function moveShoots(){
	for(var i in shoots) {
		var shoot = shoots[i];
		shoot.y -= 2;
	}
	//Remove the outside shoots
	shoots = shoots.filter(function(shoot){
		return shoot.y > 0;
	});
}

function updateEnemys(){
	if(game.status == 'initializing') {
		for (var i = 0; i < game.enemys; i++) {
			enemys.push({
				x: 10 + (i * 50),
				y:10, 
				height:40, 
				width:40,
				status:'alive',
				count: 0
			});
		};
	}

	game.status = 'playing';

	for (var i in enemys) {
		var enemy = enemys[i];
		if(!enemy) continue;
		if(enemy.status == 'alive') {
			enemy.count++;
			enemy.x += Math.sin(enemy.count * Math.PI/90) * 5;
		}
	};
}

function drawEnemys(){
	
	for (var i in enemys) {
		ctx.save();
		ctx.fillStyle = 'orange';
		var enemy = enemys[i];
		ctx.fillRect(enemy.x,enemy.y,enemy.width,enemy.height);
		ctx.restore();
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

function frameLoop(){	
	moveShip();
	moveShoots();
	updateEnemys();
	drawBackground();
	drawShip();
	drawShoot();
	drawEnemys();
}


loadMedia();
addKeyEvents();