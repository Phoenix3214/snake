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

const reset = () => {
    resize();
    initSnake();
    newApple();
    prev = performance.now();
};
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
const loop = now => {
    progress += (now - prev) / (1e3 / sps);
    prev = now;
    if (progress >= 1) {
        progress--;
        color = (color + 1 / Math.max(snake.length, 24)) % 1;
        if (!paused && !finalText) {
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
    const head = snake[0];
    const next = head.clone().sum(directions[dir[0]]);
    let bitItself;
    for (let n = 2; n < snake.length; n++) {
        if (snake[n].equals(head)) {
            bitItself = true;
            break;
        }
    }
    if (!next.isLimitedBy(0, 0, cols - 1, rows - 1) || bitItself) {
        finalText = loseMessages[deathCount % loseMessages.length];
        deathCount++;
        return;
    }
    snake.unshift(next);
    if (!apple.equals(head)) {
        snake.pop();
    } else if (snake.length != cols * rows) {
        newApple();
    } else {
        finalText = "You Won! :D";
        return;
    }
};
const draw = () => { // Draw entire frame.
    ctx.fillStyle = "#000"; // Clear canvas.
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath(); // Draw Apple.
    ctx.fillStyle = "#f00";
    ctx.arc((apple.x + 0.5) * tileSize, (apple.y + 0.5) * tileSize, tileSize * .45, 0, 2 * Math.PI);
    ctx.fill();

    for (let n = snake.length - 1; n >= 0; n--) { // Draw rainbow snake.
        const cur = snake[n];
        const a = Math.max(snake.length, 24);
        ctx.fillStyle = hsl(color + (snake.length - 1 - n) / a);
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
const drawText = (string, x, y, maxWidth) => {
    ctx.strokeStyle = hsl(Date.now() % 1e4 / 1e4);
    ctx.fillStyle = "#000";
    ctx.fillText(string, x, y, maxWidth);
    ctx.strokeText(string, x, y, maxWidth);
};
const hsl = percent => `hsl(${percent * 360}, 100%, 50%)`;
const setFont = size => ctx.font = `${size}px PressStart2P, Trebuchet MS`;
const resize = () => {
    tileSize = Math.floor(Math.min(innerWidth / cols, innerHeight / rows));
    initCanvas();
};
const keydown = event => { // Get user input.
    if ([32, 37, 38, 39, 40].indexOf(event.keyCode) != -1) { // stop firefox from scrolling the page.
        event.preventDefault();
    }
    if (event.keyCode == 13 || event.keyCode == 32) {
        if (finalText) {
            finalText = null;
            reset();
        } else {
            paused = !paused;
            prev = performance.now();
        }
    } else {
        const tmpDir = keyCodeToDir[event.keyCode];
        if (tmpDir != null && tmpDir != dir[dir.length - 1] && (((tmpDir + 2) % 4) != dir[dir.length - 1] || snake.length == 1)) {
            dir.push(tmpDir);
        }
    }
};

let tileSize;
let canvas;
let ctx;
let snake;
let dir;
let apple;
let finalText;
let prev;
let progress = 0;
let paused = false;
let deathCount = 0;
let color = 0;

document.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("resize", () => requestAnimationFrame(resize));
    window.addEventListener("keydown", keydown);
    reset();
    requestAnimationFrame(loop);
});
