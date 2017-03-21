var Point;
Point = function(x, y) {
	this.x = x;
	this.y = y;
};
Point.prototype.add = function(point) {
	this.x += (point.x || 0);
	this.y += (point.y || 0);
};
Point.prototype.sum = function(point) {
	return new Point(this.x + (point.x || 0), this.y + (point.y || 0));
};
Point.prototype.subtract = function(point) {
	this.x -= point.x;
	this.y -= point.y;
};
Point.prototype.difference = function(point) {
	return new Point(this.x - point.x, this.y - point.y);
};
Point.prototype.limit = function(minX, minY, maxX, maxY) {
	this.x = ((this.x >= minX) ? ((this.x <= maxX) ? this.x : maxX) : minX);
	this.y = ((this.y >= minY) ? ((this.y <= maxY) ? this.y : maxY) : minY);
};
Point.prototype.clone = function() {
	return (new Point(this.x, this.y));
};
Point.prototype.isLimitedBy = function(minX, minY, maxX, maxY) {
	return (this.x >= minX && this.y >= minY && this.x <= maxX && this.y <= maxY);
};
Point.prototype.product = function(point) {
	return new Point(this.x * point.x, this.y * point.y);
};
Point.prototype.equals = function(point) {
	return (this.x == point.x && this.y == point.y);
};
Point.prototype.setTo = function(point) {
	this.x = point.x;
	this.y = point.y;
};
Point.prototype.diffX = function(point) {
	return ((this.x > point.x) ? (this.x - point.x) : (point.x - this.x));
};
Point.prototype.diffY = function(point) {
	return ((this.y > point.y) ? (this.y - point.y) : (point.y - this.y));
};
Point.prototype.cityDist = function(point) {
	return (((this.x > point.x) ? (this.x - point.x) : (point.x - this.x)) + ((this.y > point.y) ? (this.y - point.y) : (point.y - this.y)));
};
Point.prototype.distSqrd = function(point) {
	return (((this.x > point.x) ? (this.x - point.x) : (point.x - this.x)) * ((this.x > point.x) ? (this.x - point.x) : (point.x - this.x)) +
		((this.y > point.y) ? (this.y - point.y) : (point.y - this.y)) * ((this.y > point.y) ? (this.y - point.y) : (point.y - this.y)));
};