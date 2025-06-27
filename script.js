const gameBoard = document.getElementById("gameBoard");
const scoreEl = document.getElementById("score");
const difficultyEl = document.getElementById("difficulty");
const startBtn = document.getElementById("startBtn");

const boardSize = 20;
let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;
let gameInterval = null;

function draw() {
  gameBoard.innerHTML = "";

  snake.forEach((segment, index) => {
    const div = document.createElement("div");
    div.style.gridColumnStart = segment.x;
    div.style.gridRowStart = segment.y;
    div.classList.add("snake");

    if (index === 0) {
      div.classList.add("head");
      const angle = getRotationAngle();
      div.style.transform = `rotate(${angle}deg)`;
    } else if (index === snake.length - 1) {
      div.classList.add("tail");
    }

    gameBoard.appendChild(div);
  });

  const foodDiv = document.createElement("div");
  foodDiv.style.gridColumnStart = food.x;
  foodDiv.style.gridRowStart = food.y;
  foodDiv.classList.add("food");
  gameBoard.appendChild(foodDiv);
}

function getRotationAngle() {
  if (direction.x === 1) return 90;
  if (direction.x === -1) return -90;
  if (direction.y === 1) return 180;
  return 0;
}

function move() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();
    placeFood();
  } else {
    snake.pop();
  }
}

function placeFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * boardSize) + 1,
      y: Math.floor(Math.random() * boardSize) + 1,
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  food = newFood;
}

function checkCollision() {
  const head = snake[0];

  if (head.x < 1 || head.y < 1 || head.x > boardSize || head.y > boardSize) {
    alert("💥 Game Over! You hit the wall.");
    stopGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      alert("💥 Game Over! You hit yourself.");
      stopGame();
    }
  }
}

function updateScore() {
  scoreEl.textContent = "Score: " + score;
}

function gameLoop() {
  move();
  draw();
  checkCollision();
}

function startGame() {
  snake = [{ x: 10, y: 10 }];
  direction = { x: 0, y: 0 };
  score = 0;
  updateScore();
  placeFood();

  const speed = parseInt(difficultyEl.value);
  if (gameInterval) clearInterval(gameInterval);
  gameInterval = setInterval(gameLoop, speed);

  document.getElementById("menu").style.display = "none";
  gameBoard.style.display = "grid";
  scoreEl.style.display = "block";
}

function stopGame() {
  clearInterval(gameInterval);
  document.getElementById("menu").style.display = "flex";
  gameBoard.style.display = "none";
  scoreEl.style.display = "none";
}

window.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 1, y: 0 };
      break;
  }
});

startBtn.addEventListener("click", startGame);
