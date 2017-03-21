var moves = [];
		var aTiles = new Array(cols);
		var aSnake = [];
		var open = [];
		var current = {};
		var tPath;
		var start = new Point();
		var goal;
		var ghostTail;
		
		for (var x = 0; x < cols; x++) { // init aTiles
			aTiles[x] = new Array(rows);
			/*for (var y = 0; y < rows; y++) {
				
			}*/
		}
		
		Array.indexOfPointObj = function(point) {
			for (var n = 0; n < this.length; n++) {
				if (this[n].x == point.x && this[n].y == point.y) {
					return n;
				}
			}
			return -1;
		};
		
		function makeMove(snake, dir, apple, width, height) {
			
			if (moves.length == 0) {
				start.setTo(snake[snake.length - 1]); // Start is snake.
				goal = new Point();
				goal.setTo(apple); // Goal is apple.
				tPath = findPath();
				if (!ghostTail) { // If there isn't a ghost tail, calculate one.
					//ghostTail = findTail(snake);
				}
				if (!tPath) {
					// change the goal to tail
				} else {
					// set start as food and goal as tail
					tPath = findPath();
					if (!tPath) {
						// set start as snake and goal as tail
					} else {
						// set start as snake and goal as food
					}
				}
				moves = findPath();
			}
			//ghostTail = snake[0].clone();
			keydown({keyCode: dirToKeyCode[moves.splice(0, 1)[0]]});
		}
		function findPath() {
			tiles[start.x][start.y].g = 0;
			// add start to open
			// update current
			while(open.length > 0 && !(current.x == goal.x && current.y == goal.y)) {
				for (n = 0; n < directions.length; n++) {
					nei = {x: current.x + directions[n].x, y: current.y + directions[n].y};
					if ((nei.x == current.x && nei.y == current.y) || nei.x < 0 || nei.x > cols - 1 || nei.y < 0 || nei.y > rows - 1 || tiles[nei.x][nei.y].closed || tiles[nei.x][nei.y].blocked) {
						continue;
					}
					if (tiles[nei.x][nei.y].h == undefined) {
						tiles[nei.x][nei.y].h = heuristic(nei);
					}
					tentativeG = tiles[current.x][current.y].g + cityDist(current, nei);
					if (tiles[nei.x][nei.y].g == undefined || tentativeG < tiles[nei.x][nei.y].g) {
						tiles[nei.x][nei.y].g = tentativeG;
						tiles[nei.x][nei.y].parent = current;
					}
					tiles[nei.x][nei.y].f = tiles[nei.x][nei.y].g + tiles[nei.x][nei.y].h;
					if (open.indexOfPointObj(nei) == - 1) {
						open.push(nei);
					}
				}
				open.splice(open.indexOfPointObj(current), 1);
				tiles[current.x][current.y].closed = true;
				if (open.length == 0) {
					if (current.x != goal.x || current.y != goal.y) {
						noSolution = true;
					} else {
						noSolution = false;
					}
					return;
				}
				least = Number.POSITIVE_INFINITY;
				indices = [];
				for (n = 0; n < open.length; n++) {
					if (tiles[open[n].x][open[n].y].f <= least) {
						least = tiles[open[n].x][open[n].y].f;
						indices.push(n);
					}
				}
				least = Number.POSITIVE_INFINITY;
				index = null;
				for (n = 0; n < indices.length; n++) {
					distSqrd = distSquared(open[indices[n]], goal);
					if (distSqrd < least) {
						least = distSqrd;
						index = n;
					}
				}
				current = {x: open[indices[index]].x, y: open[indices[index]].y};
			}
			if (current.x != goal.x || current.y != goal.y) {
				noSolution = true;
			} else {
				noSolution = false;
			}
		}