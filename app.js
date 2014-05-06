//Developed by: Fabian Marin
//Feel free to do whatever you want with this code ;)
//Desparche day 05/05/2014 


var canvas = document.getElementById('game');
var ctx = canvas.getContext('2d');

//Main ship
var ship = {
	x:100,
	y:canvas.height - 100,
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
//Load the game when the background was loaded
function loadMedia(){
	background = new Image();
	background.src = 'space.png';
	background.onload = function() {
		//Ship 
		ship.image = new Image();
		ship.image.src = 'ship.png'
		ship.image.onload = function() {
			var interval = window.setInterval(frameLoop, 1000/55);
		}	
	}
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



function drawShoot() {
	ctx.save();
	ctx.fillStyle = 'red';
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
		height: 10,
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
				height:40, 
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

		ctx.save();
		ctx.fillStyle = 'orange';
		var enemy = enemys[i];
		ctx.fillRect(enemy.x,enemy.y,enemy.width,enemy.height);
		ctx.restore();
	};	
	
}

function drawEnemyShoots(){	
	//console.log(enemyShoots);
	for (var i in enemyShoots) {
		
		ctx.save();
		ctx.fillStyle = 'yellow';
		var shoot = enemyShoots[i];
		ctx.fillRect(shoot.x,shoot.y,shoot.width,shoot.height);
		ctx.restore();
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
			game.status = 'over';
			text.title = 'Se lo bajaron';
			text.legend = 'Dele a la R para seguir apa';
			
			text.counter = 0;
		//}
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
		game.status = 'win';
		text.title = 'Gano parce!';
		text.legend = 'Dele a la R para volver a jugar';
		text.counter = 0;
		console.log('GANO');
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
	drawShoot();
	drawEnemys();
	drawText();
	drawEnemyShoots();
	
}


loadMedia();
addKeyEvents();