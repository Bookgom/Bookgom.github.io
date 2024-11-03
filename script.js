const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snake;
let direction;
let food;
let score;

// 모바일 및 데스크톱 화면 크기 설정
function setCanvasSize() {
    if (window.innerWidth <= 600) { // 모바일 크기 기준
        canvas.width = 300;
        canvas.height = 300;
    } else { // 데스크톱 크기 기준
        canvas.width = 400;
        canvas.height = 400;
    }
    // 캔버스 크기가 변경되면 스네이크와 음식의 위치도 재설정
    resetGamePositions();
}

// 스네이크와 음식의 위치를 초기화하는 함수
function resetGamePositions() {
    snake = [{ x: Math.floor(canvas.width / 2 / 20) * 20, y: Math.floor(canvas.height / 2 / 20) * 20 }];
    direction = { x: 0, y: 0 };
    placeFood();
    draw();
}

// 캔버스 크기를 환경에 맞게 설정
setCanvasSize();
window.addEventListener("resize", setCanvasSize); // 화면 크기 변경 시 다시 설정

function startGame() {
    score = 0;
    document.getElementById("score").innerText = score;
    document.getElementById("retryButton").style.display = "none";
    resetGamePositions(); // 게임 시작 시 위치 초기화
}

function placeFood() {
    // 음식의 위치를 캔버스 크기에 맞춰 20px 그리드 단위로 설정
    food = {
        x: Math.floor(Math.random() * (canvas.width / 20)) * 20,
        y: Math.floor(Math.random() * (canvas.height / 20)) * 20,
    };
}

function updateGame() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // 음식에 도달했을 때
    if (head.x === food.x && head.y === food.y) {
        snake.unshift(head);
        score++;
        document.getElementById("score").innerText = score;
        placeFood();
    } else {
        snake.pop();
        snake.unshift(head);
    }

    // 벽 충돌 또는 자기 충돌 시 게임 오버
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
    startGame(); // 게임 초기화
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "green";
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, 20, 20));

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, 20, 20);
}

// 방향 변경 함수
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
    updateGame(); // 방향을 바꿀 때마다 한 번씩 이동
}

// 키보드 방향키 이벤트 처리
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
