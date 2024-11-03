const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// 캔버스 크기를 명시적으로 설정
canvas.width = 400;
canvas.height = 400;

let snake;
let direction;
let food;
let score;
let gameLoop;
let hasMoved = false; // 방향키가 눌렸을 때만 이동하도록 제어

function startGame() {
    // 초기화
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: 0 }; // 초기에는 움직이지 않음
    score = 0;
    hasMoved = false;
    document.getElementById("score").innerText = score;
    document.getElementById("retryButton").style.display = "none";
    placeFood();

    // 기존의 게임 루프가 있으면 종료
    if (gameLoop) clearInterval(gameLoop);

    // 100ms마다 updateGame을 호출하지만, hasMoved가 true일 때만 게임 업데이트
    gameLoop = setInterval(() => {
        if (hasMoved) {
            updateGame();
            hasMoved = false; // 이동 후에는 다시 false로 설정
        }
    }, 100);
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20,
    };
}

function updateGame() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // 뱀이 음식에 도달했을 때
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
    hasMoved = true; // 방향 변경이 있을 때만 이동
}

// 키보드 방향키 이벤트 처리
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            changeDirection("up");
            break;
        case "ArrowDown":
      
