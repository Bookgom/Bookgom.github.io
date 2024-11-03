const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

let snake;
let direction;
let food;
let score;
let gameLoop;

function startGame() {
    // 뱀의 초기 위치와 방향을 설정
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: -20 }; // 초기 방향: 위쪽으로 움직이기 시작
    score = 0;
    document.getElementById("score").innerText = score;
    document.getElementById("retryButton").style.display = "none";
    placeFood();
    
    // 기존에 실행 중인 게임 루프가 있다면 멈춤
    if (gameLoop) clearInterval(gameLoop);
    
    // 새로운 게임 루프 시작
    gameLoop = setInterval(updateGame, 100);
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20,
    };
}

function updateGame() {
    // 새로운 머리 위치 계산
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // 뱀이 음식에 도달했을 때
    if (head.x === food.x && head.y === food.y) {
        snake.unshift(head);
        score++;
        document.getElementById("score").innerText = score;
        placeFood();
    } else {
        snake.pop(); // 꼬리 제거 (길이 유지)
        snake.unshift(head);
    }

    // 게임 오버 조건 확인 (초기 상태가 아닌 경우)
    if (
        head.x < 0 || head.x >= canvas.width || 
        head.y < 0 || head.y >= canvas.height || 
        (snake.length > 1 && collision(head))
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

// 방향 변경 함수 (키보드 및 모바일 버튼 이벤트 처리)
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
