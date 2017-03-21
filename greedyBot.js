function Bot(_width, _height) {

	// init variables:
	this.directions = [new Point(1, 0), new Point(0, -1), new Point(-1, 0), new Point(0, 1)]; // Right, up, left, down.
	this.width = _width;
	this.height = _height;
	
	this.makeMove = function(snake, apple) {
		var head = snake[snake.length - 1];
		var possible = [];
		for (var n = 0; n < directions.length; n++) {
			possible.push(directions[n].sum(head));
		}
		for (var n = 0; n < possible.length; n++) {
			if (possible[n].x < 0 || possible[n].x >= this.width || possible[n].y < 0 || possible[n].y >= this.height
					|| inSnake(possible[n], snake)) {
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
			var h = possible[n].cityDist(apple);
			if (h < lowest) {
				lowest = h;
				index = n;
			}
		}
		var best = possible[index].difference(head);
		for (var n = 0; n < this.directions.length; n++) {
			if (this.directions[n].equals(best)) {
				return n;
			}
		}
	};
}

function inSnake(current, snake) {
	for (var n = 0; n < snake.length; n++) {
		if (current.equals(snake[n])) {
			return true;
		}
	}
	return false;
}