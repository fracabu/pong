const gameBoard = document.querySelector(".game-board");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector(".score-text");
const resetBtn = document.querySelector(".reset-btn");
const themeSwitcher = document.getElementById("themeSwitcher");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = "#000000"; // Nero per il campo di gioco
const paddle1Color = "#ffffff"; // Bianco per i paddle
const paddle2Color = "#ffffff"; // Bianco per i paddle
const paddleBorder = "#ffffff"; // Bordo bianco
const ballColor = "#ffffff"; // Palla bianca
const ballBorderColor = "#ffffff"; // Bordo della palla bianco
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

// Inizializza il tema in base alla preferenza utente salvata
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  themeSwitcher.checked = true;
} else {
  document.body.classList.remove("dark");
}

themeSwitcher.addEventListener("change", () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

// Controlli di gioco
window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);
document.querySelector('.left-up').addEventListener('touchstart', () => movePaddleTouch('left', 'up'));
document.querySelector('.left-down').addEventListener('touchstart', () => movePaddleTouch('left', 'down'));
document.querySelector('.right-up').addEventListener('touchstart', () => movePaddleTouch('right', 'up'));
document.querySelector('.right-down').addEventListener('touchstart', () => movePaddleTouch('right', 'down'));

gameStart();

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
  ballXDirection = Math.random() > 0.5 ? 1 : -1;
  ballYDirection = Math.random() > 0.5 ? Math.random() * 1 : Math.random() * -1;
  ballX = gameWidth / 2;
  ballY = gameHeight / 2;
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
  if (ballX <= paddle1.x + paddle1.width + ballRadius && ballY > paddle1.y && ballY < paddle1.y + paddle1.height) {
    ballX = paddle1.x + paddle1.width + ballRadius;
    ballXDirection *= -1;
    ballSpeed += 1;
  }
  if (ballX >= paddle2.x - ballRadius && ballY > paddle2.y && ballY < paddle2.y + paddle2.height) {
    ballX = paddle2.x - ballRadius;
    ballXDirection *= -1;
    ballSpeed += 1;
  }
}

function changeDirection(event) {
  const keyPressed = event.keyCode;
  const paddle1Up = 87;
  const paddle1Down = 83;
  const paddle2Up = 38;
  const paddle2Down = 40;

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

function movePaddleTouch(paddle, direction) {
  if (paddle === "left") {
    if (direction === "up" && paddle1.y > 0) paddle1.y -= paddleSpeed;
    if (direction === "down" && paddle1.y < gameHeight - paddle1.height) paddle1.y += paddleSpeed;
  } else if (paddle === "right") {
    if (direction === "up" && paddle2.y > 0) paddle2.y -= paddleSpeed;
    if (direction === "down" && paddle2.y < gameHeight - paddle2.height) paddle2.y += paddleSpeed;
  }
}

function updateScore() {
  scoreText.textContent = `${player1Score} : ${player2Score}`;
}

function resetGame() {
  player1Score = 0;
  player2Score = 0;
  paddle1.y = 0;
  paddle2.y = gameHeight - paddle2.height;
  ballSpeed = 1;
  createBall();
  updateScore();
}
