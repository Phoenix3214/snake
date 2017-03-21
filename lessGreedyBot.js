function Bot(_width, _height) {

	// init variables:
	this.directions = [new Point(1, 0), new Point(0, -1), new Point(-1, 0), new Point(0, 1)]; // Right, up, left, down.
	this.path = [];
	this.tiles;
	this.width = _width;
	this.height = _height;

	// init tiles:
	this.tiles = new Array(this.width);
	for (var x = 0; x < this.width; x++) {
		this.tiles[x] = new Array(this.height);
		for (var y = 0; y < this.height; y++) {
			this.tiles[x][y] = {visited: 0, blocked: false};
		}
	}

	this.makeMove = function(snake, apple) {
		//console.log(snake);
		if (!this.path.length) { // if there are no pre-calculated moves.
		
			var tails = []; // init tails array.
			var current = snake[snake.length - 1].clone(); // set current as snake head.
			resetVisited(this.tiles); // mark all nodes as not visited.
			
			while(true) { // begin loop.
				updateTiles(this.tiles, snake); // mark nodes that are occupied by the snake.
				
				this.tiles[current.x][current.y].visited = this.path.length; // mark node as visited.
				var dir = this.step(current, apple); // get the 'best' direction.
				if (typeof dir != "number") { // if there is no possible direction.
					if (this.path.length) { // if we can still back up.
						current.subtract(this.directions[this.path.pop()]); // move current back one.
						snake.length = snake.length - 1; // remove snake head.
						snake.unshift(tails.pop()); // add last snake tail.
						continue;
					}
					break; // stop loop, algorithm can't get to the goal.
				} // else:
				current.add(this.directions[dir]); // move current.
				this.path.push(dir); // add direction to the path.
				snake.push(current.clone()); // add next snake head.
				if (snake[snake.length - 1].equals(apple)) { // if snake got to the apple.
					break; // stop loop, algorithm found a path.
				}
				tails.push(snake.shift()); // remove snake tail, and keep it for later.
			}
		}
		//console.log(this.path, snake.length);
		return this.path.shift(); // move snake.
	}

	this.step = function(current, goal) {
		var possible = [];
		for (var n = 0; n < directions.length; n++) {
			possible.push(directions[n].sum(current));
		}
		for (var n = 0; n < possible.length; n++) {
			if (possible[n].x < 0 || possible[n].x >= this.width || possible[n].y < 0 || possible[n].y >= this.height
					|| this.path.length < this.tiles[possible[n].x][possible[n].y].visited
					|| this.tiles[possible[n].x][possible[n].y].blocked) {
				possible.splice(n, 1);
				n--;
			}
		}
		if (possible.length) {
			var lowest = Number.POSITIVE_INFINITY;
			var index = null;
			for (var n = 0; n < possible.length; n++) {
				var h = /*possible[n].cityDist(goal);*/ possible[n].distSqrd(goal);
				if (h < lowest) {
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
	}
}

function resetVisited(tiles) {
	for (var y = 0; y < tiles[0].length; y++) {
		for (var x = 0; x < tiles.length; x++) {
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