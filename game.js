const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scale = 20;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let food;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

document.getElementById("highScore").textContent = highScore;

(function setup() {
    snake = new Snake();
    food = new Food();
    window.setInterval(gameLoop, 100);
})();

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    snake.update();
    snake.draw();
    food.draw();

    if (snake.eat(food)) {
        food = new Food();
        score++;
        document.getElementById("score").textContent = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            document.getElementById("highScore").textContent = highScore;
        }
    }

    if (snake.collide()) {
        alert(`لقد خسرت! النتيجة النهائية: ${score}`);
        score = 0;
        document.getElementById("score").textContent = score;
        snake = new Snake();
    }
}

function Snake() {
    this.snakeArray = [{x: 5, y: 5}];
    this.direction = "right";
    this.newDirection = "right";

    this.update = function () {
        const head = {...this.snakeArray[0]};

        if (this.newDirection === "right") head.x++;
        if (this.newDirection === "left") head.x--;
        if (this.newDirection === "up") head.y--;
        if (this.newDirection === "down") head.y++;

        this.snakeArray.unshift(head);

        if (!this.eat(food)) {
            this.snakeArray.pop();
        }

        this.direction = this.newDirection;
    };

    this.changeDirection = function (event) {
        if (event.key === "ArrowRight" && this.direction !== "left") {
            this.newDirection = "right";
        }
        if (event.key === "ArrowLeft" && this.direction !== "right") {
            this.newDirection = "left";
        }
        if (event.key === "ArrowUp" && this.direction !== "down") {
            this.newDirection = "up";
        }
        if (event.key === "ArrowDown" && this.direction !== "up") {
            this.newDirection = "down";
        }
    };

    this.eat = function (food) {
        return this.snakeArray[0].x === food.x && this.snakeArray[0].y === food.y;
    };

    this.collide = function () {
        if (this.snakeArray[0].x < 0 || this.snakeArray[0].y < 0 ||
            this.snakeArray[0].x >= columns || this.snakeArray[0].y >= rows) {
            return true;
        }

        for (let i = 1; i < this.snakeArray.length; i++) {
            if (this.snakeArray[i].x === this.snakeArray[0].x &&
                this.snakeArray[i].y === this.snakeArray[0].y) {
                return true;
            }
        }

        return false;
    };

    this.draw = function () {
        ctx.fillStyle = "#66ff66";
        for (let i = 0; i < this.snakeArray.length; i++) {
            ctx.fillRect(this.snakeArray[i].x * scale, this.snakeArray[i].y * scale, scale, scale);
        }
    };
}

function Food() {
    this.x = Math.floor(Math.random() * columns);
    this.y = Math.floor(Math.random() * rows);

    this.draw = function () {
        ctx.fillStyle = "#ff6666";
        ctx.beginPath();
        ctx.arc(this.x * scale + scale / 2, this.y * scale + scale / 2, scale / 2, 0, Math.PI * 2, false);
        ctx.fill();
    };
}

window.addEventListener("keydown", (event) => snake.changeDirection(event));

function restartGame() {
    score = 0;
    document.getElementById("score").textContent = score;
    snake = new Snake();
}
