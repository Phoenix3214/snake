// User Variables
const cols = 20;
const rows = 20;
const sps = 10; // Steps per second.
const rainbowMode = true;

// tables
const directions = [new Point(1, 0), new Point(0, -1), new Point(-1, 0), new Point(0, 1), new Point(0, 0)]; // Right, up, left, down, none.
const keyCodeToDir = {"37": 2, "38": 1, "39": 0, "40": 3, "68": 0, "87": 1, "65": 2, "83": 3}; // leftArrow, upArrow, rightArrow, downArrow, d, w, a, s.
const dirToKeyCode = [39, 38, 37, 40]; // Right, up, left, down.
const loseMessages = ["you lost! :(", "ouch!", "oh noes!", "that's a headache", "hasta la vista snakey", "now you're fertilizer", "R.I.P.", "WASTED",
    "*Windows blue screen*", "keep your day job", "blame lag", "why even bother?", "one more!", "so close! not.", "'clutch'", "1-800-273-8255", "go outside"];

let tileSize = Math.floor(Math.min(innerWidth / cols, innerHeight / rows));
let canvas;
let ctx;
let snake;
let dir;
let loop;
let apple;
let keydown;
let empty;
let finalText;
let main;
let paused = false;
let deathCount = 0;

window.addEventListener("resize", () => {
    tileSize = Math.floor(Math.min(innerWidth / cols, innerHeight / rows));
    initCanvas();
    draw();
});
window.addEventListener("keydown", keydown = event => { // Get user input.
    if (event.preventDefault && [32, 37, 38, 39, 40].indexOf(event.keyCode) != -1) { // stop firefox from scrolling the page.
        event.preventDefault();
    }
    if (event.keyCode == 13 || event.keyCode == 32) {
        if (finalText) {
            finalText = null;
            initSnake();
            newApple();
            draw();
            loop = setInterval(main, ~~(1000 / sps));
        } else if (!paused) {
            clearInterval(loop);
            paused = true;
            draw();
        } else {
            loop = setInterval(main, ~~(1000 / sps));
            paused = false;
        }
        return;
    }
    const tmpDir = keyCodeToDir[event.keyCode+""]; // Convert keyCode to string, then a direction.
    if (tmpDir != null && tmpDir != dir[dir.length - 1] && (((tmpDir + 2) % 4) != dir[dir.length - 1] || snake.length == 1)) {
        dir.push(tmpDir);
    }
});
const initCanvas = () => { // Setup canvas with context and dimensions.
    canvas.width = cols * tileSize;
    canvas.height = rows * tileSize;
};
const initSnake = () => { // Setup snake with head at a random location.
    snake = [];
    snake.push(new Point(randomInt(0, cols - 1), randomInt(0, rows - 1)));
    dir = [4];
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
    const possible = new Array(cols * rows);
    for (let n = 0; n < possible.length; n++) {
        possible[n] = n;
    }
    for (let n = 0; n < snake.length; n++) {
        possible.splice(possible.indexOf(snake[n].y * cols + snake[n].x), 1);
    }
    const index = possible[randomInt(0, possible.length - 1)];
    apple = new Point(index % cols, ~~(index / cols));
};
const randomInt = (min, max) => { // inclusive
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
const drawText = (string, x, y, maxWidth) => {
    ctx.strokeStyle = "turquoise";
    ctx.fillStyle = "black";
    ctx.fillText(string, x, y, maxWidth);
    ctx.strokeText(string, x, y, maxWidth);
};
const setFont = (string, size) => {
    ctx.font = size + "px PressStart2P";
    while (ctx.measureText(string).width + 20 > canvas.width) {
        size--;
        ctx.font = size + "px PressStart2P";
    }
    return size;
};
const draw = () => { // Draw entire frame.
    ctx.fillStyle = "black"; // Clear canvas.
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath(); // Draw Apple.
    ctx.fillStyle = "turquoise";
    ctx.arc((apple.x + 0.5) * tileSize, (apple.y + 0.5) * tileSize, tileSize / 2, 0, 2 * Math.PI);
    ctx.fill();

    if (rainbowMode) {
        for (let n = snake.length - 1; n >= 0; n--) { // Draw rainbow snake.
            ctx.fillStyle = "hsl(" + ~~((n / snake.length) * 361) + ", 100%, 50%)";
            ctx.fillRect((snake[(snake.length - 1) - n].x) * tileSize, (snake[(snake.length - 1) - n].y) * tileSize, tileSize, tileSize);
        }
    } else {
        ctx.beginPath(); // Draw snake.
        ctx.fillStyle = "turquoise";
        for (let n = 0; n < snake.length - 1; n++) { // minus one, beacuase we don't want to draw the head.
            ctx.moveTo(snake[n].x * tileSize, snake[n].y * tileSize);
            ctx.rect(snake[n].x * tileSize, snake[n].y * tileSize, tileSize, tileSize);
        }
        ctx.fill();
        // Draw snake's head.
        ctx.fillStyle = "#00898e"; // Dark turquoise.
        ctx.fillRect(snake[snake.length - 1].x * tileSize, snake[snake.length - 1].y * tileSize, tileSize, tileSize);
    }

    ctx.beginPath(); // Draw grid.
    ctx.strokeStyle = "white";
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

    if (paused) {
        ctx.lineWidth = 2;
        ctx.font = (canvas.width / 10) + "px PressStart2P";
        let offset = (canvas.width - ctx.measureText("paused").width) / 2;
        drawText("paused", offset, canvas.height / 2 + canvas.width / 32);
        ctx.lineWidth = 1;
        ctx.font = (canvas.width / 32) + "px PressStart2P";
        offset = (canvas.width - ctx.measureText("press enter or space to resume").width) / 2;
        drawText("press enter or space to resume", offset, canvas.height * 19 / 32);
    }

    if (finalText) { // Draw final text.
        ctx.lineWidth = 2;
        clearInterval(loop);
        setFont(finalText, (canvas.width / 14));
        let offset = ((canvas.width - ctx.measureText(finalText).width) / 2);
        drawText(finalText, offset + 10, canvas.height / 2 + canvas.width / 32);

        ctx.lineWidth = 1;
        ctx.font = (canvas.width / 32) + "px PressStart2P";
        offset = ((canvas.width - ctx.measureText("press enter or space to respawn").width) / 2);
        drawText("press enter or space to respawn", offset, canvas.height * 6 / 10);
    }

    ctx.fillStyle = "white"; // Draw score.
    ctx.font = tileSize * 0.6 + "px PressStart2P";
    ctx.fillText("Score: " + (snake.length - 1), 5, canvas.height - 5);
}

document.addEventListener("DOMContentLoaded", () => {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    initCanvas();
    initSnake();
    newApple();
    draw();
    loop = setInterval(main = () => {
        step();
        draw();
    }, 1000 / sps);
});
