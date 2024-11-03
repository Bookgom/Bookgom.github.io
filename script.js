const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

let snake;
let food;
let direction;
let score;
let gameLoop;

function startGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: 0 };
    score = 0;
    document.getElementById("score").innerText = score;
    document.getElementById("retryButton").style.display = "none";
    placeFood();
    gameLoop = setInterval(updateGame, 100);
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20,
    };
}

function updateGame() {
    const head = { x: snake[0].x + direction.x * 20, y: snake[0].y + direction.y * 20 };

    if (head.x === food.x && head.y === food.y) {
        snake.unshift(head);
        score++;
        document.getElementById("score").innerText = score;
        placeFood();
    } else {
        snake.pop();
        snake.unshift(head);
    }

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || collision(head)) {
        gameOver();
    }

    draw();
}

function collision(head) {
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

function gameOver() {
    clearInterval(gameLoop);
    document.getElementById("retryButton").style.display = "block";
    alert("Game Over! Score: " + score);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "green";
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, 20, 20));

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, 20, 20);
}

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

startGame();
