const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 20;
const canvasSize = 400;
let snake;
let food;
let dx, dy;
let score;
let gameInterval;

function startGame() {
  const speed = parseInt(document.getElementById('difficulty').value);

  snake = [{ x: 160, y: 200 }];
  dx = box;
  dy = 0;
  score = 0;
  food = randomFood();

  document.getElementById('score').innerText = 'Score: 0';
  document.getElementById('game-over').style.display = 'none';

  clearInterval(gameInterval);
  gameInterval = setInterval(draw, speed);
}

function draw() {
  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Vẽ mồi
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, box, box);

  // Di chuyển rắn
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };

  // Kiểm tra va chạm
  if (
    head.x < 0 || head.x >= canvasSize ||
    head.y < 0 || head.y >= canvasSize ||
    collision(head, snake)
  ) {
    document.getElementById('game-over').style.display = 'block';
    clearInterval(gameInterval);
    return;
  }

  snake.unshift(head);

  // Ăn mồi
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById('score').innerText = 'Score: ' + score;
    food = randomFood();
  } else {
    snake.pop();
  }

  // Vẽ rắn
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? '#00ff00' : '#009900';
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }
}

function randomFood() {
  const foodX = Math.floor(Math.random() * (canvasSize / box)) * box;
  const foodY = Math.floor(Math.random() * (canvasSize / box)) * box;
  return { x: foodX, y: foodY };
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

document.addEventListener('keydown', direction);

function direction(e) {
  if (e.key === 'ArrowLeft' && dx === 0) {
    dx = -box; dy = 0;
  } else if (e.key === 'ArrowUp' && dy === 0) {
    dx = 0; dy = -box;
  } else if (e.key === 'ArrowRight' && dx === 0) {
    dx = box; dy = 0;
  } else if (e.key === 'ArrowDown' && dy === 0) {
    dx = 0; dy = box;
  }
}

// Bắt đầu khi load trang
window.onload = startGame;
