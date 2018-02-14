// User Variables
const cols = 20;
const rows = 20;
const sps = 10; // Steps per second.
const rainbowMode = true;

// tables
const directions = [new Point(1, 0), new Point(0, -1), new Point(-1, 0), new Point(0, 1), new Point(0, 0)]; // Right, up, left, down, none.
const keyCodeToDir = {37: 2, 38: 1, 39: 0, 40: 3, 68: 0, 87: 1, 65: 2, 83: 3}; // leftArrow, upArrow, rightArrow, downArrow, d, w, a, s.
const dirToKeyCode = [39, 38, 37, 40]; // Right, up, left, down.
const loseMessages = ["you lost! :(", "ouch!", "oh noes!", "that's a headache", "hasta la vista snakey", "now you're fertilizer", "R.I.P.", "WASTED",
    "*Windows blue screen*", "keep your day job", "blame lag", "why even bother?", "one more!", "so close! not.", "'clutch'", "1-800-273-8255", "go outside"];

let tileSize = Math.floor(Math.min(innerWidth / cols, innerHeight / rows));
let canvas;
let ctx;
let snake;
let dir;
let apple;
let keydown;
let empty;
let finalText;
let prev;
let progress = 0;
let paused = false;
let deathCount = 0;

window.addEventListener("resize", () => {
    tileSize = Math.floor(Math.min(innerWidth / cols, innerHeight / rows));
    initCanvas();
    draw();
});
window.addEventListener("keydown", keydown = event => { // Get user input.
    if ([32, 37, 38, 39, 40].indexOf(event.keyCode) != -1) { // stop firefox from scrolling the page.
        event.preventDefault();
    }
    if (event.keyCode == 13 || event.keyCode == 32) {
        if (finalText) {
            finalText = null;
            initSnake();
            newApple();
        } else {
            paused = !paused;
        }
        return;
    }
    const tmpDir = keyCodeToDir[event.keyCode];
    if (tmpDir != null && tmpDir != dir[dir.length - 1] && (((tmpDir + 2) % 4) != dir[dir.length - 1] || snake.length == 1)) {
        dir.push(tmpDir);
    }
});
const initCanvas = () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = cols * tileSize;
    canvas.height = rows * tileSize;
};
const initSnake = () => {
    snake = [];
    snake.push(new Point(Math.random() * cols | 0, Math.random() * rows | 0));
    dir = [4];
};
const loop = now => {
    progress += (now - prev) / (1e3 / sps);
    prev = now;
    if (progress >= 1) {
        progress--;
        if (!paused && ! finalText) {
            step();
        }
        draw();
    }
    requestAnimationFrame(loop);
};
const step = () => {
    if (dir.length > 1) {
        dir.shift();
    }
    const next = snake[snake.length - 1].clone().sum(directions[dir[0]]);
    let bitItself;
    for (let n = 0; n < snake.length - 3; n++) {
        if (snake[n].equals(snake[snake.length - 1])) {
            bitItself = true;
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
};
const newApple = () => {
    let x;
    let y;
    do {
        const index = Math.random() * rows * cols | 0;
        x = index % cols;
        y = index / cols | 0;
    } while(snake.some(p => p.x === x && p.y === y));
    apple = new Point(x, y);
};
const drawText = (string, x, y, maxWidth) => {
    ctx.strokeStyle = hsl(Date.now() % 1e4 / 1e4);
    ctx.fillStyle = "#000";
    ctx.fillText(string, x, y, maxWidth);
    ctx.strokeText(string, x, y, maxWidth);
};
const hsl = percent => `hsl(${percent * 360}, 100%, 50%)`;
const setFont = size => ctx.font = `${size}px PressStart2P, Trebuchet MS`;
const draw = () => { // Draw entire frame.
    ctx.fillStyle = "#000"; // Clear canvas.
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath(); // Draw Apple.
    ctx.fillStyle = hsl(Date.now() % 5e3 / 5e3);
    ctx.arc((apple.x + 0.5) * tileSize, (apple.y + 0.5) * tileSize, tileSize / 2, 0, 2 * Math.PI);
    ctx.fill();

    for (let n = 0; n < snake.length; n++) { // Draw rainbow snake.
        const cur = snake[n];
        const l = snake.length;
        const a = 1e3 / sps;
        const b = a * Math.max(l, 24);
        ctx.fillStyle = hsl((Date.now() + n * a) % b / b);
        ctx.fillRect(cur.x * tileSize, cur.y * tileSize, tileSize, tileSize);
    }

    ctx.beginPath(); // Draw grid.
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= cols; x++) {
        ctx.moveTo(x * tileSize, 0);
        ctx.lineTo(x * tileSize, canvas.height);
    }
    for (let y = 0; y <= rows; y++) {
        ctx.moveTo(0, y * tileSize);
        ctx.lineTo(canvas.width, y * tileSize);
    }
    ctx.stroke();

    ctx.textAlign = "center"; // main text
    ctx.textBaseline = "middle";
    ctx.lineWidth = 2;
    const midX = canvas.width / 2;
    const midY = canvas.height / 2;
    if (paused || finalText) {
        const text = finalText || "paused";
        setFont(Math.min(midX / text.length * 1.5, midX / 5));
        drawText(text, midX, midY);
        setFont(midX / 16);
        drawText("press enter or space to play", midX, midY * 1.15);
    }

    ctx.fillStyle = "#fff"; // score
    setFont(tileSize * 0.6);
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText(`Score: ${snake.length - 1}`, 5, canvas.height);
}

document.addEventListener("DOMContentLoaded", () => {
    initCanvas();
    initSnake();
    newApple();
    prev = performance.now();
    requestAnimationFrame(loop);
});
