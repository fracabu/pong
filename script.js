const gameBoard = document.querySelector(".game-board");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector(".score-text");
const resetBtn = document.querySelector(".reset-btn");
const themeSwitcher = document.getElementById("themeSwitcher");
let gameWidth = gameBoard.width;
let gameHeight = gameBoard.height;
const boardBackground = "#000000";
const paddle1Color = "#ffffff";
const paddle2Color = "#ffffff";
const paddleBorder = "#ffffff";
const ballColor = "#ffffff";
const ballBorderColor = "#ffffff";
const ballRadius = 12.5;
const paddleSpeed = 50;

let intervalID;
let ballSpeed;
let ballX = gameWidth / 2;
let ballY = gameHeight / 2;
let ballXDirection = 0;
let ballYDirection = 0;
let player1Score = 0;
let player2Score = 0;
let paddle1 = {
    width: 25,
    height: 100,
    x: 0,
    y: 0
};
let paddle2 = {
    width: 25,
    height: 100,
    x: gameWidth - 25,
    y: gameHeight - 100
};

// Touch control intervals
let touchIntervals = {
    leftUp: null,
    leftDown: null,
    rightUp: null,
    rightDown: null
};

// Theme management
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeSwitcher.checked = true;
} else {
    document.body.classList.remove("dark");
}

themeSwitcher.addEventListener("change", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// Resize management
function resizeGame() {
    const container = document.querySelector('.game-container');
    const containerWidth = container.clientWidth;
    const containerHeight = window.innerHeight * 0.6;
    const size = Math.min(containerWidth, containerHeight);

    // Aggiorna le dimensioni del canvas mantenendo l'aspect ratio
    gameBoard.style.width = `${size}px`;
    gameBoard.style.height = `${size}px`;

    // Aggiorna le variabili di gioco
    gameWidth = gameBoard.width;
    gameHeight = gameBoard.height;
    
    // Aggiorna la posizione del paddle2
    paddle2.x = gameWidth - paddle2.width;
}

// Continuous movement function for touch controls
function continuousMove(paddle, direction) {
    movePaddleTouch(paddle, direction);
    return setInterval(() => {
        movePaddleTouch(paddle, direction);
    }, 16);
}

// Touch controls start
document.querySelector('.left-up').addEventListener('touchstart', (event) => {
    event.preventDefault();
    if (!touchIntervals.leftUp) {
        touchIntervals.leftUp = continuousMove('left', 'up');
    }
});

document.querySelector('.left-down').addEventListener('touchstart', (event) => {
    event.preventDefault();
    if (!touchIntervals.leftDown) {
        touchIntervals.leftDown = continuousMove('left', 'down');
    }
});

document.querySelector('.right-up').addEventListener('touchstart', (event) => {
    event.preventDefault();
    if (!touchIntervals.rightUp) {
        touchIntervals.rightUp = continuousMove('right', 'up');
    }
});

document.querySelector('.right-down').addEventListener('touchstart', (event) => {
    event.preventDefault();
    if (!touchIntervals.rightDown) {
        touchIntervals.rightDown = continuousMove('right', 'down');
    }
});

// Touch controls end
document.querySelector('.left-up').addEventListener('touchend', () => {
    if (touchIntervals.leftUp) {
        clearInterval(touchIntervals.leftUp);
        touchIntervals.leftUp = null;
    }
});

document.querySelector('.left-down').addEventListener('touchend', () => {
    if (touchIntervals.leftDown) {
        clearInterval(touchIntervals.leftDown);
        touchIntervals.leftDown = null;
    }
});

document.querySelector('.right-up').addEventListener('touchend', () => {
    if (touchIntervals.rightUp) {
        clearInterval(touchIntervals.rightUp);
        touchIntervals.rightUp = null;
    }
});

document.querySelector('.right-down').addEventListener('touchend', () => {
    if (touchIntervals.rightDown) {
        clearInterval(touchIntervals.rightDown);
        touchIntervals.rightDown = null;
    }
});

// Keyboard controls
function changeDirection(event) {
    const keyPressed = event.keyCode;
    const paddle1Up = 87;    // W key
    const paddle1Down = 83;  // S key
    const paddle2Up = 38;    // Up arrow
    const paddle2Down = 40;  // Down arrow

    switch (keyPressed) {
        case paddle1Up:
            if (paddle1.y > 0) paddle1.y -= paddleSpeed;
            break;
        case paddle1Down:
            if (paddle1.y < gameHeight - paddle1.height) paddle1.y += paddleSpeed;
            break;
        case paddle2Up:
            if (paddle2.y > 0) paddle2.y -= paddleSpeed;
            break;
        case paddle2Down:
            if (paddle2.y < gameHeight - paddle2.height) paddle2.y += paddleSpeed;
            break;
    }
}

// Touch movement
function movePaddleTouch(paddle, direction) {
    const moveAmount = 15; // Velocità ridotta per un controllo più preciso
    
    if (paddle === "left") {
        if (direction === "up" && paddle1.y > 0) {
            paddle1.y -= moveAmount;
        }
        if (direction === "down" && paddle1.y < gameHeight - paddle1.height) {
            paddle1.y += moveAmount;
        }
    } else if (paddle === "right") {
        if (direction === "up" && paddle2.y > 0) {
            paddle2.y -= moveAmount;
        }
        if (direction === "down" && paddle2.y < gameHeight - paddle2.height) {
            paddle2.y += moveAmount;
        }
    }
}

function gameStart() {
    createBall();
    nextTick();
}

function nextTick() {
    intervalID = setTimeout(() => {
        clearBoard();
        drawPaddles();
        moveBall();
        drawBall(ballX, ballY);
        checkCollision();
        nextTick();
    }, 10);
}

function clearBoard() {
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

function drawPaddles() {
    ctx.strokeStyle = paddleBorder;

    ctx.fillStyle = paddle1Color;
    ctx.fillRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);
    ctx.strokeRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height);

    ctx.fillStyle = paddle2Color;
    ctx.fillRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
    ctx.strokeRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height);
}

function createBall() {
    ballSpeed = 1;
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    ballXDirection = Math.random() > 0.5 ? 1 : -1;
    ballYDirection = Math.random() > 0.5 ? Math.random() * 1 : Math.random() * -1;
    drawBall(ballX, ballY);
}

function moveBall() {
    ballX += ballSpeed * ballXDirection;
    ballY += ballSpeed * ballYDirection;
}

function drawBall(ballX, ballY) {
    ctx.fillStyle = ballColor;
    ctx.strokeStyle = ballBorderColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
}

function checkCollision() {
    if (ballY <= 0 + ballRadius || ballY >= gameHeight - ballRadius) {
        ballYDirection *= -1;
    }
    if (ballX <= 0) {
        player2Score++;
        updateScore();
        createBall();
        return;
    }
    if (ballX >= gameWidth) {
        player1Score++;
        updateScore();
        createBall();
        return;
    }

    // Paddle collisions
    if (ballX <= paddle1.x + paddle1.width + ballRadius && 
        ballY > paddle1.y && 
        ballY < paddle1.y + paddle1.height) {
        ballX = paddle1.x + paddle1.width + ballRadius; // Prevent ball sticking
        ballXDirection *= -1;
        ballSpeed += 0.5;
    }

    if (ballX >= paddle2.x - ballRadius && 
        ballY > paddle2.y && 
        ballY < paddle2.y + paddle2.height) {
        ballX = paddle2.x - ballRadius; // Prevent ball sticking
        ballXDirection *= -1;
        ballSpeed += 0.5;
    }
}

function updateScore() {
    scoreText.textContent = `${player1Score} : ${player2Score}`;
}

function resetGame() {
    player1Score = 0;
    player2Score = 0;
    paddle1 = {
        width: 25,
        height: 100,
        x: 0,
        y: 0
    };
    paddle2 = {
        width: 25,
        height: 100,
        x: gameWidth - 25,
        y: gameHeight - 100
    };
    ballSpeed = 1;
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    ballXDirection = 0;
    ballYDirection = 0;
    updateScore();
    createBall();
}

// Event Listeners
window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);
window.addEventListener('load', resizeGame);
window.addEventListener('resize', resizeGame);

// Start the game
gameStart();