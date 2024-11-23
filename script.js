const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snake;
let direction;
let food;
let score;
let motionData = [];

// Flask 서버 URL
const SERVER_URL = "https://magpie-correct-goshawk.ngrok-free.app/api/motion-data"; // 외부 접근 가능한 서버 URL

// Web Audio API 변수
let audioContext = null;
let oscillator = null;

// Sine Wave 토글 함수
function toggleSineWave() {
    if (audioContext && oscillator) {
        oscillator.stop();
        audioContext.close();
        audioContext = null;
        oscillator = null;
        console.log("Sine wave stopped");
    } else {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = "sine";
        oscillator.frequency.value = 440; // 440Hz

        gainNode.gain.value = 0.1; // 볼륨 설정
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        console.log("Sine wave playing at 440Hz");
    }
}

// iOS 권한 요청
function requestPermissionForIOS() {
    if (typeof DeviceMotionEvent.requestPermission === "function") {
        DeviceMotionEvent.requestPermission()
            .then((permissionState) => {
                if (permissionState === "granted") {
                    console.log("iOS permission granted");
                    startMotionCapture();
                } else {
                    alert("Motion data permission is required!");
                }
            })
            .catch((error) => console.error("Permission request failed:", error));
    } else {
        startMotionCapture();
    }
}

// 모션 데이터 수집
function handleMotionEvent(event) {
    const { acceleration, rotationRate } = event;
    const data = {
        timestamp: Date.now(),
        acceleration: {
            x: acceleration.x || 0,
            y: acceleration.y || 0,
            z: acceleration.z || 0,
        },
        rotationRate: {
            alpha: rotationRate.alpha || 0,
            beta: rotationRate.beta || 0,
            gamma: rotationRate.gamma || 0,
        },
    };
    motionData.push(data);
    if (motionData.length > 50) motionData.shift();
}

// 서버로 모션 데이터 전송
function sendMotionData() {
    if (motionData.length > 0) {
        fetch(SERVER_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ motionData }),
        })
            .then((response) => response.json())
            .then((data) => console.log("Data sent to server:", data))
            .catch((error) => console.error("Error sending data:", error));

        motionData = [];
    }
}

// 모션 데이터 수집 시작
function startMotionCapture() {
    if (window.DeviceMotionEvent) {
        window.addEventListener("devicemotion", handleMotionEvent);
    } else {
        console.warn("DeviceMotionEvent not supported");
    }
}

// 게임 초기화
function startGame() {
    score = 0;
    document.getElementById("score").innerText = score;
    document.getElementById("retryButton").style.display = "none";
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
        head.x < 0 ||
        head.x >= canvas.width ||
        head.y < 0 ||
        head.y >= canvas.height ||
        collision(head)
    ) {
        alert("Game Over! Your score: " + score);
        startGame();
    }
    draw();
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * canvas.width / 20) * 20,
        y: Math.floor(Math.random() * canvas.height / 20) * 20,
    };
}

function collision(head) {
    return snake.some((segment, index) => index !== 0 && segment.x === head.x && segment.y === head.y);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "green";
    snake.forEach((segment) => ctx.fillRect(segment.x, segment.y, 20, 20));
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, 20, 20);
}

// 키보드 입력 이벤트
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

// 주기적으로 모션 데이터 전송
setInterval(sendMotionData, 5000);

// 게임 시작
startGame();

