const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snake;
let direction;
let food;
let score;
let motionData = [];

// Web Audio API를 활용한 440Hz Sine Wave 재생 함수
function playSineWave() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    // 사인파 설정
    oscillator.type = "sine";
    oscillator.frequency.value = 440; // 440Hz (A4 음)

    // 사운드 크기 설정
    gainNode.gain.value = 0.1; // 볼륨 (0 ~ 1)

    // 연결
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // 재생 시작
    oscillator.start();

    // 2초 후 사운드 중지
    setTimeout(() => {
        oscillator.stop();
        audioContext.close();
    }, 2000);
}

// Snake 게임 초기화 함수
function startGame() {
    score = 0;
    document.getElementById("score").innerText = score;
    document.getElementById("retryButton").style.display = 'none';
    resetGamePositions();
}

function resetGamePositions() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: 0, y: 0 };
    placeFood();
    draw();
}

// 방향 변경 함수
function changeDirection(newDirection) {
    switch (newDirection) {
        case 'up':
            if (direction.y === 0) direction = { x: 0, y: -20 };
            break;
        case 'down':
            if (direction.y === 0) direction = { x: 0, y: 20 };
            break;
        case 'left':
            if (direction.x === 0) direction = { x: -20, y: 0 };
            break;
        case 'right':
            if (direction.x === 0) direction = { x: 20, y: 0 };
            break;
    }
    updateGame(); // 즉시 게임 업데이트
}

// 게임 상태 업데이트
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

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || collision(head)) {
        alert(`Game Over! Your score: ${score}`);
        startGame();
    }
    draw();
}

// 음식 배치
function placeFood() {
    food = {
        x: Math.floor(Math.random() * canvas.width / 20) * 20,
        y: Math.floor(Math.random() * canvas.height / 20) * 20
    };
}

// 충돌 감지
function collision(head) {
    return snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
}

// 캔버스 그리기
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, 20, 20));
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 20, 20);
}

// 키보드 입력 이벤트
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            changeDirection('up');
            break;
        case "ArrowDown":
            changeDirection('down');
            break;
        case "ArrowLeft":
            changeDirection('left');
            break;
        case "ArrowRight":
            changeDirection('right');
            break;
    }
});

startGame();
