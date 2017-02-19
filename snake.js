/* User-definable Variables */
var cols = 20;
var rows = 20;
var tileSize = ~~(Math.min(window.innerWidth, window.innerHeight) / Math.max(cols, rows));
var sps = 10; // Steps per second.
var useBot = false;
var rainbowMode = true;
/* End User-definable Variables */

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var snake;
var dir;
var loop;
var apple;
var keydown;
var empty;
var finalText;
var main;
var paused = false;
var deathCount = 0;
var bot;

var analme = false;

// Rainbow tables:
var directions = [new Point(1, 0), new Point(0, -1), new Point(-1, 0), new Point(0, 1), new Point(0, 0)]; // Right, up, left, down, none.
var keyCodeToDir = {"37": 2, "38": 1, "39": 0, "40": 3, "68": 0, "87": 1, "65": 2, "83": 3}; // leftArrow, upArrow, rightArrow, downArrow, d, w, a, s.
var dirToKeyCode = [39, 38, 37, 40]; // Right, up, left, down.

var loseMessages = ["you lost! :(", "ouch!", "oh noes!", "that's a headache", "hasta la vista snakey", "now you're fertilizer", "R.I.P.", "WASTED",
	"*Windows blue screen*", "keep your day job", "blame lag", "why even bother?", "one more!", "so close! not.", "'clutch'", "1-800-273-8255", "go outside"];

window.addEventListener("resize", function() {
	tileSize = ~~(Math.min(window.innerWidth, window.innerHeight) / Math.max(cols, rows));
	initCanvas();
	draw();
});
window.addEventListener("keydown", keydown = function(event) { // Get user input.
	if (event.keyCode == 13 || event.keyCode == 32) {
		if (finalText) {
			finalText = null;
			initSnake();
			newApple();
			draw();
			loop = setInterval(main, ~~(1000 / sps));
		} else if (!paused) {
			clearInterval(loop);
			paused = true;
			draw();
		} else {
			loop = setInterval(main, ~~(1000 / sps));
			paused = false;
		}
		return;
	}
	var tmpDir = keyCodeToDir[event.keyCode+""]; // Convert keyCode to string, then a direction.
	if (tmpDir != null && tmpDir != dir[dir.length - 1] && (((tmpDir + 2) % 4) != dir[dir.length - 1] || snake.length == 1)) {
		dir.push(tmpDir);
	}
});
function initCanvas() { // Setup canvas with context and dimensions.
	canvas.width = cols * tileSize;
	canvas.height = rows * tileSize;
}
function initSnake() { // Setup snake with head at a random location.
	snake = [];
	snake.push(new Point(randomInt(0, cols - 1), randomInt(0, rows - 1)));
	dir = [4];
}
function step() {
	if (dir.length > 1) {
		dir.shift();
	}
	var next = snake[snake.length - 1].clone().sum(directions[dir[0]]);
	for (var n = 0; n < snake.length - 3; n++) {
		if (snake[n].equals(snake[snake.length - 1])) {
			var bitItself = true;
		}
	}
	if (!next.isLimitedBy(0, 0, cols - 1, rows - 1) || bitItself) {
		deathCount++;
		finalText = loseMessages[(deathCount - 1) % loseMessages.length];
		return;
	}
	snake.push(next);
	if (!apple.equals(snake[snake.length - 1])) {
		snake.shift();
	} else if (snake.length != cols * rows) {
		newApple();
	} else {
		finalText = "You Won! :D";
		return;
	}
	if (useBot) {
		keydown({keyCode: dirToKeyCode[bot.makeMove(snake.slice(), apple.clone())]});
	}
}
function newApple() {
	var possible = new Array(cols * rows);
	for (var n = 0; n < possible.length; n++) {
		possible[n] = n;
	}
	for (var n = 0; n < snake.length; n++) {
		possible.splice(possible.indexOf(snake[n].y * cols + snake[n].x), 1);
	}
	var index = possible[randomInt(0, possible.length - 1)];
	apple = new Point(index % cols, ~~(index / cols));
}
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function drawText(string, x, y, maxWidth) {
	ctx.strokeStyle = "turquoise";
	ctx.fillStyle = "black";
	ctx.fillText(string, x, y, maxWidth);
	ctx.strokeText(string, x, y, maxWidth);
}
function setFont(string, size) {
	ctx.font = size + "px PressStart2P";
	while (ctx.measureText(string).width + 20 > canvas.width) {
		size--;
		ctx.font = size + "px PressStart2P";
	}
	return size;
}
function draw() { // Draw entire frame.
	ctx.fillStyle = "black"; // Clear canvas.
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	ctx.beginPath(); // Draw Apple.
	ctx.fillStyle = "turquoise";
	ctx.arc((apple.x + 0.5) * tileSize, (apple.y + 0.5) * tileSize, tileSize / 2, 0, 2 * Math.PI);
	ctx.fill();
	
	if (rainbowMode) {
		var delta;
		for (var n = snake.length - 1; n >= 0; n--) { // Draw rainbow snake.
			delta = (n / snake.length) / 3;
			//console.log(delta);
			ctx.fillStyle = "hsl(" + ~~((n / snake.length) * 361) + ", 100%, 50%)";
			ctx.fillRect((snake[(snake.length - 1) - n].x + delta) * tileSize, (snake[(snake.length - 1) - n].y + delta) * tileSize, tileSize * (1 - delta * 2), tileSize * (1 - delta * 2));
		}
	} else {
		ctx.beginPath(); // Draw snake.
		ctx.fillStyle = "turquoise";
		for (var n = 0; n < snake.length - 1; n++) { // minus one, beacuase we don't want to draw the head.
			ctx.moveTo(snake[n].x * tileSize, snake[n].y * tileSize);
			ctx.rect(snake[n].x * tileSize, snake[n].y * tileSize, tileSize, tileSize);
		}
		ctx.fill();
		// Draw snake's head.
		ctx.fillStyle = "#00898e"; // Dark turquoise.
		ctx.fillRect(snake[snake.length - 1].x * tileSize, snake[snake.length - 1].y * tileSize, tileSize, tileSize);
	}
	
	ctx.beginPath(); // Draw grid.
	ctx.strokeStyle = "white";
	ctx.lineWidth = 0.5;
	for (var x = 0; x <= cols; x++) {
		ctx.moveTo(x * tileSize, 0);
		ctx.lineTo(x * tileSize, canvas.height);
	}
	for (var y = 0; y <= rows; y++) {
		ctx.moveTo(0, y * tileSize);
		ctx.lineTo(canvas.width, y * tileSize);
	}
	ctx.stroke();
	
	// Bring attention to the head:
	//ctx.strokeStyle = "lime";
	// //ctx.lineWidth = 2; // double commented out. XD
	//ctx.strokeRect(snake[snake.length - 1].x * tileSize, snake[snake.length - 1].y * tileSize, tileSize, tileSize);
	
	/* // For fun:
	ctx.fillStyle = "black";
	for (var n = 0; n < snake.length - 1; n++) { // just to see what it would look like...
		ctx.fillRect((snake[n].x + 0.3) * tileSize, (snake[n].y + 0.3) * tileSize, tileSize * 0.4, tileSize * 0.4);
	}*/
	
	if (paused) {
		ctx.lineWidth = 2;
		ctx.font = (canvas.width / 10) + "px PressStart2P";
		var offset = (canvas.width - ctx.measureText("paused").width) / 2;
		drawText("paused", offset, canvas.height / 2 + canvas.width / 32);
		ctx.font = (canvas.width / 32) + "px PressStart2P";
		var offset = (canvas.width - ctx.measureText("press enter or space to resume").width) / 2;
		drawText("press enter or space to resume", offset, canvas.height * 19 / 32);
	}
	
	if (finalText) { // Draw final text.
		ctx.lineWidth = 2;
		clearInterval(loop);
		setFont(finalText, (canvas.width / 14));
		var offset = ((canvas.width - ctx.measureText(finalText).width) / 2);
		drawText(finalText, offset + 10, canvas.height / 2 + canvas.width / 32);
		
		ctx.font = (canvas.width / 32) + "px PressStart2P";
		var offset = ((canvas.width - ctx.measureText("press enter or space to respawn").width) / 2);
		drawText("press enter or space to respawn", offset, canvas.height * 6 / 10);
	}
	
	ctx.fillStyle = "white"; // Draw score.
	ctx.font = tileSize * 0.6 + "px PressStart2P";
	ctx.fillText("Score: " + (snake.length - 1), 5, canvas.height - 5);
}

/* Main */
initCanvas();
initSnake();
newApple();
if (useBot) { 
	bot = new Bot(cols, rows);
}
draw();
loop = setInterval(main = function() {
		step();
		draw();
}, 1000 / sps);
/* End Main */