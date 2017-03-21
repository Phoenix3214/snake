function Bot(_width, _height) {

	// init variables:
	this.directions = [new Point(1, 0), new Point(0, -1), new Point(-1, 0), new Point(0, 1)]; // Right, up, left, down.
	this.path = [];
	this.tiles;
	this.adjacents;
	this.width = _width;
	this.height = _height;

	// init tiles:
	this.tiles = new Array(this.width);
	for (var x = 0; x < this.width; x++) {
		this.tiles[x] = new Array(this.height);
		for (var y = 0; y < this.height; y++) {
			this.tiles[x][y] = {visited: 0, blocked: false, discovered: false};
		}
	}

	this.makeMove = function(snake, apple) {
		if (this.path.length) {
			return this.path.shift();
		}
		var snakecopy = snake.slice();
		this.path = this.findPath(snakecopy, apple); // this function can change snakecopy.
		
		if (this.path) {
			var path2 = this.findPath(snakecopy, snakecopy[0].clone());
			if (path2) {
				console.log("there n back successful");
				//this.path.concat(path2); // temporary!!
				return this.path.shift();
			}
		}
		this.path = [];
		//draw();
		//debugger;
		var path3 = this.findPath(snake, snake[0].clone(), false, false);
		if (path3) {
			console.log("can follow tail");
			return path3[0];
		}
		
		path3 = this.findPath(snake, snake[0].clone(), true, false);
		if (path3) {
			console.log("can follow tail");
			return path3[0];
		}
		
		console.log("stalling until out");
		return this.findPath(snake, this.findOut(snake), true, false);
	}
	
	this.findPath = function(snake, goal, stall, debug) {
		var path = [];
		var tails = [];
		resetTiles(this.tiles);
		var current = snake[snake.length - 1].clone();
		
		if (stall) {
			var stallNum = 0;
		}
		
		while (true) {
			
			//debug
			if (debug || analme) {
				ctx.fillStyle = "black"; // Clear canvas.
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				
				ctx.beginPath(); // Draw Apple.
				ctx.fillStyle = "turquoise";
				ctx.arc((apple.x + 0.5) * tileSize, (apple.y + 0.5) * tileSize, tileSize / 2, 0, 2 * Math.PI);
				ctx.fill();
				
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
				
				// Draw  goal.
				ctx.fillStyle = "purple";
				ctx.fillRect(goal.x * tileSize, goal.y * tileSize, tileSize, tileSize);
				
				ctx.beginPath(); // Draw grid.
				ctx.strokeStyle = "white";
				for (var x = 0; x <= cols; x++) {
					ctx.moveTo(x * tileSize, 0);
					ctx.lineTo(x * tileSize, canvas.height);
				}
				for (var y = 0; y <= rows; y++) {
					ctx.moveTo(0, y * tileSize);
					ctx.lineTo(canvas.width, y * tileSize);
				}
				ctx.stroke();
		
				debugger;
			}
			// end debug
			
			stallNum++;
			
			updateTiles(this.tiles, snake);
			this.tiles[current.x][current.y].visited = path.length;
			var dir = this.step(current, goal, path.length, (stall && stallNum < snake.length));
			if (dir === null) {
				if (!path.length) {
					if (debug) {
						draw();
						debugger;
					}
					return null;
				}
				current.subtract(this.directions[path.pop()]);
				snake.length = snake.length - 1; // remove last element.
				snake.unshift(tails.pop());
				continue;
			}
			current.add(this.directions[dir]);
			path.push(dir);
			snake.push(current.clone());
			if (current.equals(goal)) {
				return path;
			}
			tails.push(snake.shift());
		}
	}

	this.step = function(current, goal, pathLength, stall) {
		var possible = [];
		for (var n = 0; n < directions.length; n++) {
			possible.push(directions[n].sum(current));
		}
		for (var n = 0; n < possible.length; n++) {
			if (possible[n].x < 0 || possible[n].x >= this.width || possible[n].y < 0 || possible[n].y >= this.height
					|| pathLength < this.tiles[possible[n].x][possible[n].y].visited
					|| this.tiles[possible[n].x][possible[n].y].blocked) {
				possible.splice(n, 1);
				n--;
			}
		}
		if (possible.length == 0) {
			return null;
		}
		var lowest = Number.POSITIVE_INFINITY;
		var index = null;
		for (var n = 0; n < possible.length; n++) {
			var h = possible[n].distSqrd(goal) * (stall ? -1 : 1); /*possible[n].cityDist(goal) * (stall ? -1 : 1);*/
			if (h < lowest /*|| (h == lowest && possible[n].distSqrd(goal) < possible[index].distSqrd(goal))*/) { // not the result I wanted.
				lowest = h;
				index = n;
			}
		}
		var best = possible[index].difference(current);
		for (var n = 0; n < this.directions.length; n++) {
			if (this.directions[n].equals(best)) {
				return n;
			}
		}
	}
	
	this.findOut = function(snake) {
		updateTiles(this.tiles, snake);
		this.adjacents = [];
		resetDiscovered(this.tiles);
		var expand = [snake[snake.length - 1].clone()];
		
		var first = true;
		while(expand.length) {
			var node = expand[expand.length - 1];
			//console.log(node);
			if (!node) {
				debugger;
			}
			if (node.x >= 0 && node.x < this.width && node.y >= 0 && node.y < this.height && !this.tiles[node.x][node.y].discovered) {
				this.tiles[node.x][node.y].discovered = true;
				if (!first && this.tiles[node.x][node.y].blocked) {
					this.adjacents.push(expand.pop());
					continue;
				}
				first = false;
				for (var n = 0; n < directions.length; n++) {
					expand.push(node.sum(directions[n]));
				}
			}
			expand.length = expand.length - 1; // remove last element.
			//debugger;
		}
		//console.log(this.adjacents);
		
		// debug
		draw();
		ctx.fillStyle = "skyblue";
		for (var n = 0; n < this.adjacents.length; n++) {
			ctx.rect(this.adjacents[n].x * tileSize, this.adjacents[n].y * tileSize, tileSize, tileSize);
		}
		ctx.fill();
		debugger;
		//end debug
		
		for (var n = 0; n < this.adjacents.length; n++) {
			for (var i = 0; i < snake.length; i++) {
				if (this.adjacents[n].equals(snake[i])) {
					this.adjacents[n].index = i;
					break;
				}
			}
		}
		
		var least = Number.POSITIVE_INFINITY;
		var index = null;
		for (var n = 0; n < this.adjacents.length; n++) {
			if (this.adjacents[n].index < least) {
				least = this.adjacents[n].index;
				index = n;
			}
		}
		
		// debug
		ctx.fillStyle = "brown";
		ctx.fillRect(this.adjacents[index].x * tileSize, this.adjacents[index].y * tileSize, tileSize, tileSize);
		debugger;
		// end debug
		
		return this.adjacents[index];
	};
}

function resetTiles(tiles) {
	for (var y = 0; y < tiles[0].length; y++) {
		for (var x = 0; x < tiles.length; x++) {
			tiles[x][y].blocked = false;
			tiles[x][y].visited = 0;
		}
	}
}
function updateTiles(tiles, snake) {
	for (var y = 0; y < tiles[0].length; y++) {
		for (var x = 0; x < tiles.length; x++) {
			tiles[x][y].blocked = false;
		}
	}
	for (var n = 1; n < snake.length; n++) { // n = 1 is important, there should not be collision for the tail.
		tiles[snake[n].x][snake[n].y].blocked = true;
	}
}
function resetDiscovered(tiles) {
	for (var y = 0; y < tiles[0].length; y++) {
		for (var x = 0; x < tiles.length; x++) {
			tiles[x][y].discovered = false;
		}
	}
}