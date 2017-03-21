var canvas = document.querySelector("canvas");
var canvas2 = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var ctx2 = canvas2.getContext("2d");
var w = 0;
var moves = [];
var again = "false";
var h = 0;
var x = 0;
var y = 0;
var SadSound = new Audio("./Sad.wav");
var PointSound = new Audio("./Point.wav");
var HappySound = new Audio("./Happy.wav");
SadSound.volume = .5;
PointSound.volume = .7;
HappySound.volume = .7;
var difficulty = "Difficult";
var cube = {
	x: 25,
	y: 16,
	d: 32
};
var segments = new Array(cube.x * cube.y);
var n = 0;
for (n = 0; n < segments.length; n++) {
	segments[n] = {
		x: 0,
		y: 0,
		dir: 0
	};
}
var i = 0;
segments[0].x = Math.floor(Math.random() * cube.x);
segments[0].y = Math.floor(Math.random() * cube.y);
var segLength = 1;
var cherry = {
	x: Math.floor(Math.random() * cube.x),
	y: Math.floor(Math.random() * cube.y)
};
var fps = 30;
var loop = {
	old: 0,
	frame: 33.33,
	repeat: true,
	dFrame: 1000 / fps,
	temp: 0
};
var refresh = false;
document.getElementById("canvas").addEventListener("click", function() {
	if (refresh) {
		window.location.reload();
	}
});
var oldKey = 0;

function start() {
	requestAnimationFrame(drawFrame);
}

function drawFrame() {
	loop.old = (new Date).getTime();

	moveSegments();

	w += 1;
	if (w == 10) {
		w = 0;
		calculateLogic();
	}

	ctx2.clearRect(0, 0, 800, 512);

	ctx2.beginPath();
	ctx2.fillStyle = "green";
	ctx2.arc(cherry.x * cube.d + .5 * cube.d, cherry.y * cube.d + .5 * cube.d, .5 * cube.d, 0, 2 * Math.PI);
	ctx2.stroke();
	ctx2.fill();

	ctx2.beginPath();
	ctx2.fillStyle = "black";
	ctx2.strokeStyle = "white";
	ctx2.lineWidth = 1;
	for (n = 0; n < segLength; n++) {
		ctx2.rect(segments[n].x * cube.d, segments[n].y * cube.d, cube.d, cube.d);
	}
	ctx2.fill();
	ctx2.stroke();

	ctx2.beginPath();
	ctx2.fillStyle = "white";
	ctx2.font = "20px Arial";
	ctx2.fillText("Score: " + (segLength - 1), 700, 20);
	ctx2.fillText("" + difficulty, 10, 20);

	loop.temp = loop.oldTime;
	loop.oldTime = (new Date).getTime();
	loop.frame = loop.oldTime - loop.temp;

	if (loop.repeat) {
		if (loop.frame < loop.dFrame) {
			setTimeout(function() {
				requestAnimationFrame(drawFrame);
			}, (loop.dFrame - loop.frame));
		} else {
			requestAnimationFrame(drawFrame);
		}
	} else {
		return;
	}

	ctx.drawImage(canvas2, 0, 0);
}

function calculateLogic() {

	// Length cheat:
	if (window.cheat == true && segments[0].dir != 0) {
		newseg();
	} // To use the length cheat, set 'window.cheat' = true in the console.

	for (n = 0; n < segLength; n++) {
		segments[n].x = Math.round(segments[n].x);
		segments[n].y = Math.round(segments[n].y);

		if (n > 3 && segments[0].x == segments[n].x && segments[0].y == segments[n].y) {
			lose();
			return;
		}
	}

	if (segLength > 1) {
		for (n = segLength - 1; n > 0; n--) {
			if (segments[n].dir != segments[n - 1].dir) {
				segments[n].dir = segments[n - 1].dir;
			}
		}
	}

	switch (moves[0]) {
		case 1:
			if (segments[0].dir != 3) {
				segments[0].dir = moves[0];
			}
			break;
		case 2:
			if (segments[0].dir != 4) {
				segments[0].dir = moves[0];
			}
			break;
		case 3:
			if (segments[0].dir != 1) {
				segments[0].dir = moves[0];
			}
			break;
		case 4:
			if (segments[0].dir != 2) {
				segments[0].dir = moves[0];
			}
			break;
	}
	if (moves[0]) {
		moves.splice(0);
	}

	if (segments[0].x == cherry.x && segments[0].y == cherry.y) {
		if (newseg()) {
			return;
		}
		PointSound.play();
		again = "true"
		while (again == "true") {
			cherry.x = Math.floor(Math.random() * cube.x);
			cherry.y = Math.floor(Math.random() * cube.y);

			h = 0;
			for (n = 0; n < segLength; n++) {
				if (cherry.x == segments[n].x) {
					if (cherry.y == segments[n].y) {
						h = 1;
					}
				}
			}
			if (h == 0) {
				again = "false";
			}
		}
	}

	if (segments[0].y == cube.y - 1 && segments[0].dir == 4) {
		lose();
		return
	} else if (segments[0].y == 0 && segments[0].dir == 2) {
		lose();
		return
	} else if (segments[0].x == cube.x - 1 && segments[0].dir == 3) {
		lose();
		return
	} else if (segments[0].x == 0 && segments[0].dir == 1) {
		lose();
		return
	}
}

function moveSegments() {
	for (n = 0; n < segLength; n++) {
		switch (segments[n].dir) {
			case 1:
				segments[n].x -= .1;
				break;
			case 2:
				segments[n].y -= .1;
				break;
			case 3:
				segments[n].x += .1;
				break;
			case 4:
				segments[n].y += .1;
				break;
		}
	}
}

document.onkeydown = function(event) {
	if (event.keyCode == oldKey) return;
	oldKey = event.keyCode;

	if (event.keyCode == 37 || event.keyCode == 65) {
		moves[moves.length] = 1;
	} else if (event.keyCode == 38 || event.keyCode == 87) {
		moves[moves.length] = 2;
	} else if (event.keyCode == 39 || event.keyCode == 68) {
		moves[moves.length] = 3;
	} else if (event.keyCode == 40 || event.keyCode == 83) {
		moves[moves.length] = 4;
	}
};

function lose() {
	loop.repeat = false;
	SadSound.play();

	ctx.beginPath();
	ctx.fillStyle = "red";
	ctx.font = "50px Arial";
	ctx.fillText("You Lose! Score: " + (segLength - 1), 150, 250);
	ctx.stroke();
	ctx.fill();
	refresh = true;
}

function win() {
	loop.repeat = false;
	HappySound.play();

	ctx.beginPath();
	ctx.fillStyle = "green";
	ctx.font = "100px Arial";
	ctx.fillText("You Win!", 200, 270);
	ctx.stroke();
	ctx.fill();
	refresh = true;
}

function newseg() {

	switch (segments[segLength - 1].dir) {
		case 1:
			x = segments[segLength - 1].x + 1;
			y = segments[segLength - 1].y;
			break;
		case 2:
			x = segments[segLength - 1].x;
			y = segments[segLength - 1].y + 1;
			break;
		case 3:
			x = segments[segLength - 1].x - 1;
			y = segments[segLength - 1].y;
			break;
		case 4:
			x = segments[segLength - 1].x;
			y = segments[segLength - 1].y - 1;
			break;
	}

	segments[segLength] = {
		x: x,
		y: y,
		dir: segments[segLength - 1].dir
	};
	segLength++;

	if (segLength == cube.x * cube.y) {
		win();
		return true;
	}
}
