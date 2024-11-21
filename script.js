const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snake;
let direction;
let food;
let score;

const SERVER_URL = "https://magpie-correct-goshawk.ngrok-free.app/api/motion-data";
let motionData = [];

// iOS 권한 요청 설정
function checkAndRequestPermission() {
    const requestPermissionButton = document.getElementById("requestPermissionButton");
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        requestPermissionButton.style.display = 'block';
        requestPermissionButton.addEventListener('click', () => {
            DeviceMotionEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        startMotionCapture();
                        requestPermissionButton.style.display = 'none';
                    } else {
                        alert('모션 데이터를 사용하려면 권한을 허용해주세요.');
                    }
                })
                .catch(error => console.error('Permission request failed:', error));
        });
    } else {
        startMotionCapture();
    }
}

// 모션 데이터 수집 시작
function startMotionCapture() {
    if (window.DeviceMotionEvent) {
        window.addEventListener("devicemotion", handleMotionEvent);
        setInterval(sendMotionData, 5000);
    } else {
        console.warn("DeviceMotionEvent is not supported.");
    }
}

// 모션 데이터 처리
function handleMotionEvent(event) {
    const { acceleration, rotationRate } = event;
    const data = {
        timestamp: Date.now(),
        acceleration: {
            x: acceleration.x || 0,
            y: acceleration.y || 0,
            z: acceleration.z || 0
        },
        rotationRate: {
            alpha: rotationRate.alpha || 0,
            beta: rotationRate.beta || 0,
            gamma: rotationRate.gamma || 0
        }
    };
    motionData.push(data);
    if (motionData.length > 50) motionData.shift();
}

// 모션 데이터 서버 전송
function sendMotionData() {
    if (motionData.length > 0) {
        fetch(SERVER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ motionData })
        })
        .then(response => response.json())
        .catch(error => console.error('Error sending data:', error));

        motionData = [];
    }
}

// 게임 초기화
function startGame() {
    score = 0;
    document.getElementById("score").innerText = score;
    document.getElementById("retryButton").style.display = 'none';
    resetGamePositions();
    checkAndRequestPermission();
}

// 캔버스 초기화
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
    updateGame(); // 클릭하면 바로 업데이트
}

// 음식 배치
function placeFood() {
    food = {
        x: Math.floor(Math.random() * canvas.width / 20) * 20,
        y: Math.floor(Math.random() * canvas.height / 20) * 20
    };
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
