class Point{
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(point) {
        this.x += (point.x || 0);
        this.y += (point.y || 0);
    }
    sum(point) {
        return new Point(this.x + (point.x || 0), this.y + (point.y || 0));
    }
    subtract(point) {
        this.x -= point.x;
        this.y -= point.y;
    }
    difference(point) {
        return new Point(this.x - point.x, this.y - point.y);
    }
    limit(minX, minY, maxX, maxY) {
        this.x = ((this.x >= minX) ? ((this.x <= maxX) ? this.x : maxX) : minX);
        this.y = ((this.y >= minY) ? ((this.y <= maxY) ? this.y : maxY) : minY);
    }
    clone() {
        return (new Point(this.x, this.y));
    }
    isLimitedBy(minX, minY, maxX, maxY) {
        return (this.x >= minX && this.y >= minY && this.x <= maxX && this.y <= maxY);
    }
    product(point) {
        return new Point(this.x * point.x, this.y * point.y);
    }
    equals(point) {
        return (this.x == point.x && this.y == point.y);
    }
    setTo(point) {
        this.x = point.x;
        this.y = point.y;
    }
    diffX(point) {
        return ((this.x > point.x) ? (this.x - point.x) : (point.x - this.x));
    }
    diffY(point) {
        return ((this.y > point.y) ? (this.y - point.y) : (point.y - this.y));
    }
    cityDist(point) {
        return (((this.x > point.x) ? (this.x - point.x) : (point.x - this.x)) + ((this.y > point.y) ? (this.y - point.y) : (point.y - this.y)));
    }
    distSqrd(point) {
        return (((this.x > point.x) ? (this.x - point.x) : (point.x - this.x)) * ((this.x > point.x) ? (this.x - point.x) : (point.x - this.x)) +
            ((this.y > point.y) ? (this.y - point.y) : (point.y - this.y)) * ((this.y > point.y) ? (this.y - point.y) : (point.y - this.y)));
    }
}
