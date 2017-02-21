var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
var w = 0;
var segments = [];
var tmpdir = 0;
var again = "false";
var h = 0;
var x = 0;
var y = 0;
var SadSound = new Audio("Sad.wav");
var PointSound = new Audio("Point.wav");
var HappySound = new Audio("Happy.wav");
SadSound.volume = .5;
PointSound.volume = .7;
HappySound.volume = .7;
var difficulty = "Difficult";
//var interval = 32;
var cube = {x:25, y:16, d:32};
segments.push({x:Math.floor(Math.random() * cube.x), y:Math.floor(Math.random() * cube.y)});
segLength = cube.x*cube.y;
segLength = 1;
var cherry = {x:Math.floor(Math.random() * cube.x), y:Math.floor(Math.random() * cube.y)};
var loop = {old:0, frame:33.33, repeat:true};
var refresh = false;
document.getElementById("canvas").addEventListener("click", function() {if (refresh) {window.location.reload();}});

function start() {
	requestAnimationFrame(disp);
}

var down = false;
document.onkeydown = function (event) {
	if(down) return;
	down = true;

	if (event.keyCode == 37 || event.keyCode == 65) {
		tmpdir = "left";
	} else if (event.keyCode == 38 || event.keyCode == 87) {
		tmpdir = "up";
	} else if (event.keyCode == 39 || event.keyCode == 68) {
		tmpdir = "right";
	} else if (event.keyCode == 40 || event.keyCode == 83) {
		tmpdir = "down";
	}
};

document.onkeyup = function () {
    down = false;
};

function disp(time) {
	w += 1;
	if (w==5) {
		w = 0;

		for (n=0;n-1<segLength-1;n++) {
			segments[n].x = Math.round(segments[n].x);
			segments[n].y = Math.round(segments[n].y);
		
			if (n>3) {
				if (segments[0].x==segments[n].x) {
					if (segments[0].y==segments[n].y) {
						lose();
						return
					}
				}
			}
		} //OLD CHECK DEATH

		for (n=segLength-1; n>0;n--) {
			if (segLength>1) { 
				if (segments[n].dir!=segments[n-1].dir) {
					segments[n].dir = segments[n-1].dir;
				}
			}
		}

		if (tmpdir=="left") {
			if (segments[0].dir!="right") {
				segments[0].dir = tmpdir;
			}
		} else if (tmpdir=="up") {
			if (segments[0].dir!="down") {
				segments[0].dir = tmpdir;
			}
		} else if (tmpdir=="right") {
			if (segments[0].dir!="left") {
				segments[0].dir = tmpdir;
			}
		} else if (tmpdir=="down") {
			if (segments[0].dir!="up") {
				segments[0].dir = tmpdir;
			}
		}

		if (segments[0].x==cherry.x) {
			if (segments[0].y==cherry.y) {
				if (newseg()) {
					return;
				}
				PointSound.play();
				again = "true"
				while (again=="true") {
					cherry.x = Math.floor(Math.random() * cube.x);
					cherry.y = Math.floor(Math.random() * cube.y);
					h = 0;
					for (n=0;n<segLength;n++) {
						if (cherry.x==segments[n].x) {
							if (cherry.y==segments[n].y) {
								h = 1;
							}
						}
					}
					if (h==0) {
						again = "false";
					}
				}
			}
		}
	}

	if (segments[0].y > cube.y - 1) {
		lose();
		return
	} else if (segments[0].y < 0) {
		lose();
		return
	} else if (segments[0].x > cube.x - .8) {
		lose();
		return
	} else if (segments[0].x < 0) {
		lose();
		return
	}

	ctx.clearRect(0,0,800,512);

	ctx.beginPath();
	ctx.fillStyle = "green";
	ctx.arc(cherry.x * cube.d + .5 * cube.d,cherry.y * cube.d + .5 * cube.d, .5 * cube.d, 0*Math.PI, 2*Math.PI);
	ctx.stroke();
	ctx.fill();	
	ctx.closePath();

	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.lineWidth = 1;
	for (n=0; n < segLength; n++) {
		
		if (segments[n].dir=="left") {
			segments[n].x -= .2;
		} else if (segments[n].dir=="up") {
			segments[n].y -= .2;
		} else if (segments[n].dir=="right") {
			segments[n].x += .2;
		} else if (segments[n].dir=="down") {
			segments[n].y += .2;
		}
		
		ctx.strokeStyle = "black";
		ctx.rect(segments[n].x * cube.d, segments[n].y * cube.d, cube.d, cube.d);
		ctx.fill();
		ctx.stroke();
		ctx.strokeStyle = "white";
		ctx.rect(segments[n].x * cube.d, segments[n].y * cube.d, cube.d, cube.d);
		ctx.stroke();
	} 
	ctx.closePath();
	
	ctx.beginPath();
	ctx.strokeStyle = "white";
	ctx.fillStyle = "white";
	ctx.font = "20px Arial";
	ctx.fillText("Score: " + (segLength-1), 700, 20);
	ctx.fillText("" + difficulty, 10, 20);
	ctx.closePath();
	
	loop.frame = Math.round(time - loop.oldTime);
	loop.oldTime = time;
	
	if (loop.repeat) {
		if (loop.frame<33.33) {
			setTimeout(function() {requestAnimationFrame(disp);}, Math.round(33.33-loop.frame));
		} else {
			requestAnimationFrame(disp);
		}
	}
}

function lose() {
	loop.repeat = false;
	SadSound.play();
	
	ctx.beginPath();
	//ctx.clearRect(0,0,800,512);
	ctx.fillStyle = "red";
	ctx.font = "50px Arial";
	ctx.fillText("You Lose! Score: " + (segLength-1), 150, 250);
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
	refresh = true;
}

function win() {
	loop.repeat = false;
	HappySound.play();
	
	ctx.beginPath();
	//ctx.clearRect(0,0,800,512);
	ctx.fillStyle = "green";
	ctx.font = "100px Arial";
	ctx.fillText("You Win!", 200, 270);
	ctx.stroke();
	ctx.fill();
	ctx.closePath();
	refresh = true;
}

function newseg() {
	
	//interval = ((-32/160000000)*Math.pow(2, segLength))+32;

	if (segments[segLength-1].dir=="left") {
		x = segments[segLength-1].x + 1;
		y = segments[segLength-1].y;
	} else if (segments[segLength-1].dir=="up") {
		x = segments[segLength-1].x;
		y = segments[segLength-1].y + 1;
	} else if (segments[segLength-1].dir=="right") {
		x = segments[segLength-1].x - 1;
		y = segments[segLength-1].y;
	} else if (segments[segLength-1].dir=="down") {
		x = segments[segLength-1].x;
		y = segments[segLength-1].y - 1;
	}
	segments[segLength] = {x:x, y:y, dir:segments[segLength-1].dir};
	segLength++;
	if (segLength-1==cube.x * cube.y) {
		win();
		return true;
	}
}
