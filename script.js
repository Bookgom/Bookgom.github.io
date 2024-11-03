body {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
}

h1 {
    margin-top: 20px;
}

#gameContainer {
    position: relative;
}

#gameCanvas {
    background-color: #000;
    border: 2px solid #333;
}

#scoreBoard {
    margin-top: 10px;
    font-size: 18px;
}

#retryButton {
    display: none;
    margin-top: 15px;
    padding: 8px 20px;
    font-size: 16px;
    cursor: pointer;
}

/* 모바일 방향 제어 버튼 스타일 */
#controls {
    display: flex;
    flex-wrap: wrap;
    width: 100px;
    margin-top: 20px;
    justify-content: center;
}

#controls button {
    width: 30px;
    height: 30px;
    margin: 5px;
    font-size: 16px;
}

