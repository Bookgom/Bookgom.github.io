const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snake;
let direction;
let food;
let score;

const SERVER_URL = "https://magpie-correct-goshawk.ngrok-free.app/api/motion-data"; // 서버 URL
let motionData = [];

// 권한 요청 버튼
const requestPermissionButton = document.getElementById("requestPermissionButton");

// iOS 권한 요청 설정
function checkAndRequestPermission() {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        // iOS 환경: 버튼 표시
        requestPermissionButton.style.display = 'block';
        requestPermissionButton.addEventListener('click', () => {
            DeviceMotionEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        console.log('Motion permission granted');
                        startMotionCapture(); // 권한 허가 후 모션 데이터 수집 시작
                        requestPermissionButton.style.display = 'none'; // 버튼 숨기기
                    } else {
                        console.error('Permission denied');
                        alert('모션 데이터를 사용하려면 권한을 허용해주세요.');
                    }
                })
                .catch(error => console.error('Permission request failed:', error));
        });
    } else {
        // Android/데스크톱: 자동 실행
        startMotionCapture();
    }
}

// 모션 데이터 수집 시작 함수
function startMotionCapture() {
    if (window.DeviceMotionEvent) {
        console.log("Starting motion capture...");
        window.addEventListener("devicemotion", handleMotionEvent);
        setInterval(sendMotionData, 5000); // 5초 간격으로 데이터 전송
    } else {
        console.warn("DeviceMotionEvent is not supported on this device.");
    }
}

// 모션 데이터 수집 함수
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
    if (motionData.length > 50) motionData.shift(); // 데이터 개수 제한
}

// 서버로 모션 센서 데이터 전송
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
        .then(data => console.log("Data sent to server:", data))
        .catch(error => console.error("Error sending data:", error));

        motionData = []; // 전송 후 배열 초기화
    }
}

// 게임 초기화 및 리셋
function resetGamePositions() {
    snake = [{ x: Math.floor(canvas.width / 2 / 20) * 20, y: Math.floor(canvas.height / 2 / 20) * 20 }];
    direction = { x: 0, y: 0 };
    placeFood();
    draw();
}

window.addEventListener("resize", setCanvasSize);

function startGame() {
    score = 0;
    document.getElementById("score").innerText = score;
    document.getElementById("retryButton").style.display = 'none';
    resetGamePositions();

    // 권한 요청 및 모션 데이터 수집 시작
    checkAndRequestPermission();
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

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || collision(head)) {
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
