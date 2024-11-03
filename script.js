const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snake;
let direction;
let food;
let score;

// 캔버스 크기 설정을 위해 CSS에서 조정하도록 설정했으므로 JavaScript에서는 캔버스의 크기를 설정하지 않음
function setCanvasSize() {
    if (window.innerWidth <= 600) { // 모바일 크기 기준
        canvas.width = 300;
        canvas.height = 300;
    } else { // 데스크톱 크기 기준
        canvas.width = 400;
        canvas.height = 400;
    }
    resetGamePositions();
}

function resetGamePositions() {
    snake = [{ x: Math.floor(canvas.width / 2 / 20) * 20, y: Math.floor(canvas.height / 2 / 20) * 20 }];
    direction = { x: 0, y: 0 };
    placeFood();
    draw();
}

window.addEventListener("resize", setCanvasSize); // 화면 크기 변경 시 다시 설정

function startGame() {
    score = 0;
    document.getElementById("score").innerText = score;
    document.getElementById("retryButton").style.display = "none";
    resetGamePositions();
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / 20)) * 20,
        y: Math.floor(Math.random() * (canvas.height / 20)) * 20,
    };
}

function updateGame() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    if (head.x === food.x && head.y === food.y) {
        snake.unshift(head);
        score++;
        document.getElementById("score").innerText = score;
        placeFood();
    } else {
        snake.pop();
        snake.unshift(head);
    }

    if (
        head.x < 0 || head.x >= canvas.width ||
        head.y < 0 || head.y >= canvas.height ||
        collision(head)
    ) {
        gameOver();
    }

    draw();
}

function collision(head) {
    return snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
}

function gameOver() {
    alert("Game Over! Score: " + score);
    startGame();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "green";
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, 20, 20));

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, 20, 20);
}

function changeDirection(newDirection) {
    switch (newDirection) {
        case "up":
            if (direction.y === 0) direction = { x: 0, y: -20 };
            break;
        case "down":
            if (direction.y === 0) direction = { x: 0, y: 20 };
            break;
        case "left":
            if (direction.x === 0) direction = { x: -20, y: 0 };
            break;
        case "right":
            if (direction.x === 0) direction = { x: 20, y: 0 };
            break;
    }
    updateGame();
}

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            changeDirection("up");
            break;
        case "ArrowDown":
            changeDirection("down");
            break;
        case "ArrowLeft":
            changeDirection("left");
            break;
        case "ArrowRight":
            changeDirection("right");
            break;
    }
});

startGame();
