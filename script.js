const START_LEN = 4;
const PART_SIZE = 10;

const KEY_LEFT = 37;
const KEY_UP = 38;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;
const KEY_A = 65;
const KEY_W = 87;
const KEY_D = 68;
const KEY_S = 83;

const play = document.getElementById("play");
const help = document.getElementById("help");
const instructions = document.getElementById("instructions");
const gameCanvas = document.getElementById("board");
const board = gameCanvas.getContext("2d");

var food, player1, player2;
var restart = false;
var running = false;

document.addEventListener("keydown", changeDirection);
play.addEventListener("click", () =>
	running ? restart = true : start()
);
help.addEventListener("click", () => {
	instructions.style.display = instructions.style.display === "block" ? "none" : "block";
	gameCanvas.style.display = instructions.style.display === "block" ? "none" : "block";
});

function start() {
	running = true;
	restart = false;

	player1 = new Player(gameCanvas.width - START_LEN * PART_SIZE, 0, "lightblue", "darkblue");
	player2 = new Player(0, 0, "lightgreen", "darkgreen");

	food = { x: 0, y: 0 };
	generateFood();

	updateScore();
	main()
}

function main() {
	player1.changingDirection = false;
	player2.changingDirection = false;
	if (player1.dead() || player1.collide(player2)) {
		player1.score = player1.score * -1;
		updateScore();
		running = false;
	} else if (player2.dead() || player2.collide(player1)) {
		player2.score = player2.score * -1;
		updateScore();
		running = false;
	} else setTimeout(() => {
		clearCanvas();
		player1.move();
		player1.draw();
		player2.move();
		player2.draw();
		drawFood();
		main()
	}, 100);
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
	if (!player1.changingDirection) {
		if (event.keyCode === KEY_LEFT) player1.changeDirection("left");
		else if (event.keyCode === KEY_UP) player1.changeDirection("up");
		else if (event.keyCode === KEY_RIGHT) player1.changeDirection("right");
		else if (event.keyCode === KEY_DOWN) player1.changeDirection("down");
	}
	if (!player2.changingDirection) {
		if (event.keyCode === KEY_A) player2.changeDirection("left");
		else if (event.keyCode === KEY_W) player2.changeDirection("up");
		else if (event.keyCode === KEY_D) player2.changeDirection("right");
		else if (event.keyCode === KEY_S) player2.changeDirection("down");
	}
}

function randomFood(min, max) {
	return Math.round((Math.random() * (max - min) + min) / PART_SIZE) * 10;
}

function generateFood() {
	food.x = randomFood(0, gameCanvas.width - PART_SIZE);
	food.y = randomFood(0, gameCanvas.height - PART_SIZE);
	for (let i of player1.snake)
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
	document.getElementById("score1").innerHTML = player1.score;
	document.getElementById("score2").innerHTML = player2.score;
}

class Player {
	constructor(x, y, color, stroke) {
		this.color = color;
		this.stroke = stroke;
		this.score = 0;
		this.snake = [];
		for (let i = 0; i < START_LEN; i++)
			this.snake.push({
				x: x + PART_SIZE * i,
				y: PART_SIZE + y
			});
		this.dx = PART_SIZE * (x === 0 ? 1 : -1);
		this.dy = 0;
		this.changingDirection = false;
	}

	draw() {
		board.fillStyle = this.color;
		board.strokeStyle = this.stroke;
		for (let part of this.snake) {
			board.fillRect(part.x, part.y, PART_SIZE, PART_SIZE);
			board.strokeRect(part.x, part.y, PART_SIZE, PART_SIZE);
		}
	}

	move() {
		this.snake.unshift({
			x: this.snake[0].x + this.dx,
			y: this.snake[0].y + this.dy
		});
		if (this.snake[0].x === food.x && this.snake[0].y === food.y) {
			this.score++;
			updateScore();
			generateFood();
		} else this.snake.pop();
	}

	changeDirection(direction) {
		if (this.changingDirection) return;
		this.changingDirection = true;
		if (direction === "left" && this.dx !== PART_SIZE) {
			this.dx = -PART_SIZE;
			this.dy = 0;
		} else if (direction === "up" && this.dy !== PART_SIZE) {
			this.dx = 0;
			this.dy = -PART_SIZE;
		} else if (direction === "right" && this.dx !== -PART_SIZE) {
			this.dx = PART_SIZE;
			this.dy = 0;
		} else if (direction === "down" && this.dy !== -PART_SIZE) {
			this.dx = 0;
			this.dy = PART_SIZE;
		}
	}
	
	dead() {
		if (restart) return true;

		for (let i = 4; i < this.snake.length; i++)
			if (this.snake[i].x === this.snake[0].x && this.snake[i].y === this.snake[0].y)
				return true;

		return (
			this.snake[0].x < 0 || this.snake[0].x > gameCanvas.width - PART_SIZE ||
			this.snake[0].y < 0 || this.snake[0].y > gameCanvas.height - PART_SIZE
		)
	}

	collide(that) {
		for (let i = 0; i < that.snake.length; i++)
			if (that.snake[i].x === this.snake[0].x && that.snake[i].y === this.snake[0].y)
				return true;
		return false
	}
}
