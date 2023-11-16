const START_LEN = 4;
const PART_SIZE = 10;

const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;

const play = document.getElementById("play");
const help = document.getElementById("help");
const instructions = document.getElementById("instructions");
const gameCanvas = document.getElementById("board");
const board = gameCanvas.getContext("2d");

var score, snake, food, dx, dy, changingDirection;
var restart = false;
var running = false;

document.addEventListener("keydown", changeDirection);
play.addEventListener("click", () =>
  running ? restart = true : start()
);
help.addEventListener("click", () => {
	instructions.style.display = instructions.style.display === "block" ? "none" : "block";
  gameCanvas.style.display = instructions.style.display === "block" ? "none": "block";
});

function start() {
  running = true;
  restart = false;
  
  score = 0;
  snake = [];
  for (let i = 0; i < START_LEN; i++)
    snake.push({
      x: PART_SIZE * i,
      y: PART_SIZE
    });
  food = { x: 0, y: 0 };
  generateFood();
  dx = PART_SIZE;
  dy = 0;
  changingDirection = false;
  
  updateScore();
  main()
}

function main() {
	changingDirection = false;
	if (!checkGameOver()) setTimeout(() => {
    clearCanvas();
    moveSnake();
    drawSnake();
    drawFood();
    main()
  }, 100);
  else running = false;
}

function drawSnake() {
	board.fillStyle = 'lightgreen';
	board.strokeStyle = 'darkgreen';
	for (part of snake) {
		board.fillRect(part.x, part.y, PART_SIZE, PART_SIZE);
		board.strokeRect(part.x, part.y, PART_SIZE, PART_SIZE);
	}
}

function moveSnake() {
	snake.unshift({
		x: snake[0].x + dx,
		y: snake[0].y + dy
	});
	if (snake[0].x === food.x && snake[0].y === food.y) {
		score++;
		updateScore();
		generateFood();
	} else snake.pop();
}

function clearCanvas() {
	//  Select the colour to fill the drawing
	board.fillStyle = "black";
	//  Select the colour for the border of the canvas
	board.strokeStyle = "black";
	// Draw a "filled" rectangle to cover the entire canvas
	board.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
	// Draw a "border" around the entire canvas
	board.strokeRect(0, 0, gameCanvas.width, gameCanvas.height);
}

function changeDirection(event) {
	if (changingDirection) return;
	changingDirection = true;
	if (event.keyCode === KEY_LEFT && dx !== PART_SIZE) {
		dx = -PART_SIZE;
		dy = 0;
	} else if (event.keyCode === KEY_UP && dy !== PART_SIZE) {
		dx = 0;
		dy = -PART_SIZE;
	} else if (event.keyCode === KEY_RIGHT && dx !== -PART_SIZE) {
		dx = PART_SIZE;
		dy = 0;
	} else if (event.keyCode === KEY_DOWN && dy !== -PART_SIZE) {
		dx = 0;
		dy = PART_SIZE;
	}
}

function checkGameOver() {
  if (restart) return true;
  
	for (let i = 4; i < snake.length; i++)
		if (snake[i].x === snake[0].x && snake[i].y === snake[0].y)
			return true;

	return (
		snake[0].x < 0 || snake[0].x > gameCanvas.width - PART_SIZE ||
		snake[0].y < 0 || snake[0].y > gameCanvas.height - PART_SIZE
	)
}

function randomFood(min, max) {
	return Math.round((Math.random() * (max - min) + min) / PART_SIZE) * 10;
}

function generateFood() {
	food.x = randomFood(0, gameCanvas.width - PART_SIZE);
	food.y = randomFood(0, gameCanvas.height - PART_SIZE);
	for (let i of snake)
		if (i.x === food.x && i.y === food.y)
			generateFood();
}

function drawFood() {
	board.fillStyle = 'red';
	board.strokeStyle = 'darkred';
	board.fillRect(food.x, food.y, PART_SIZE, PART_SIZE);
	board.strokeRect(food.x, food.y, PART_SIZE, PART_SIZE);
}

function updateScore() {
	document.getElementById("score").innerHTML = score;
}
