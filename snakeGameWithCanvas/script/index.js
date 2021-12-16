const colors = ['#c3f7f9', '#00d0ff', '#ffe779']

// Налаштовуємо полотно
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Отримуємо ширину та висоту з елемента canvas
const width = canvas.width;
const height = canvas.height;

// Опрацьовуємо блоки width та heidth
const blockSize = 10;
const widthInBlocks = width / blockSize;
const heightInBlocks = height / blockSize;

// Задаємо рахунок на 0
let score = 0;

// Малюємо межі
const drawBorder = function () {
    ctx.fillStyle = "Gray";
    ctx.fillRect(0, 0, width, blockSize);
    ctx.fillRect(0, height - blockSize, width, blockSize);
    ctx.fillRect(0, 0, blockSize, height);
    ctx.fillRect(width - blockSize, 0, blockSize, height);
};

// Малюємо рахунок у верхньому лівому куті
const drawScore = function () {
    ctx.font = "20px Courier";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Score: " + score, blockSize, blockSize);
};

// Очищуємо інтревал та висвітлюємо текст "Game Over"
const gameOver = function () {
    playing = false;
    ctx.font = "60px Courier";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Game Over", width / 2, height / 2);
};

// Малюємо коло (за допомогою функції із Розділу 14)
const circle = function (x, y, radius, fillCircle) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
        ctx.fill();
    } else {
        ctx.stroke();
    }
};

// Конструктор Block
const Block = function (col, row) {
    this.col = col;
    this.row = row;
};

// Малюємо квадрат у локації блока
Block.prototype.drawSquare = function (color) {
    let x = this.col * blockSize;
    let y = this.row * blockSize;

    ctx.fillStyle = color;
    ctx.shadowBlur = 5;
    ctx.shadowColor = color;
    ctx.fillRect(x, y, blockSize, blockSize);
};

// Малюємо коло у локації блока
Block.prototype.drawCircle = function (color) {
    let centerX = this.col * blockSize + blockSize / 2;
    let centerY = this.row * blockSize + blockSize / 2;
    ctx.fillStyle = color;
    ctx.shadowBlur = 0;
    circle(centerX, centerY, blockSize / 2, true);
};


// Перевіряємо, чи цей блок не знаходиться в одній локації
// з іншим блоком
Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
};

// Конструктор Snake
const Snake = function () {
    this.segments = [
        new Block(7, 5),
        new Block(6, 5),
        new Block(5, 5)
    ];

    this.direction = "right";
    this.nextDirection = "right";
};

// Малюємо квадрат для кожного сегмента тіла змійки
Snake.prototype.draw = function () {
    for (let i = 0; i < this.segments.length; i++) {
        // this.segments[0].drawSquare(colors[2]);

        if (i % 2 === 0) {
            this.segments[i].drawSquare(colors[1]);

        } else {
            this.segments[i].drawSquare(colors[2]);
        }
    }
};

// Створюємо нову голову та додаємо її до початку змійки,
// щоб переміщати змійку в поточному напрямку
Snake.prototype.move = function () {
    const head = this.segments[0];
    let newHead;

    this.direction = this.nextDirection;

    if (this.direction === "right") {
        newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === "down") {
        newHead = new Block(head.col, head.row + 1);
    } else if (this.direction === "left") {
        newHead = new Block(head.col - 1, head.row);
    } else if (this.direction === "up") {
        newHead = new Block(head.col, head.row - 1);
    }

    if (this.checkCollision(newHead)) {
        gameOver();
        return;
    }

    this.segments.unshift(newHead);

    if (newHead.equal(apple.position)) {
        score++;
        apple.move();
        animationTime -= 10;
    } else {
        this.segments.pop();
    }
};

// Перевіряємо, чи нова голова змійки зіткнулася зі стіною
// або влаcним тілом
Snake.prototype.checkCollision = function (head) {
    const leftCollision = (head.col === 0);
    const topCollision = (head.row === 0);
    const rightCollision = (head.col === widthInBlocks - 1);
    const bottomCollision = (head.row === heightInBlocks - 1);

    const wallCollision = leftCollision || topCollision || rightCollision || bottomCollision;

    let selfCollision = false;
    for (let i = 0; i < this.segments.length; i++) {
        if (head.equal(this.segments[i])) {
            selfCollision = true;
        }
    }

    return wallCollision || selfCollision;
};

// Задаємо наступний напрям руху змійки на основі клавіатури
Snake.prototype.setDirection = function (newDirection) {
    if (this.direction === "up" && newDirection === "down") {
        return;
    } else if (this.direction === "right" && newDirection === "left") {
        return;
    } else if (this.direction === "down" && newDirection === "up") {
        return;
    } else if (this.direction === "left" && newDirection === "right") {
        return;
    }

    this.nextDirection = newDirection;
};

// Конструктор Apple
const Apple = function () {
    this.position = new Block(10, 10);
};

// Малюємо коло на локації яблучка
Apple.prototype.draw = function () {
    this.position.drawCircle("LimeGreen");
};

// Переміщуємо яблуко на нову випадкову локацію
Apple.prototype.move = function () {
    while (this.position !== this.segments) {
        const randomCol = Math.floor(Math.random() * (widthInBlocks - 2)) + 1;
        const randomRow = Math.floor(Math.random() * (heightInBlocks - 2)) + 1;
        this.position = new Block(randomCol, randomRow);
        return this.position;
    }
};

// Створюємо об'єкти змійки та яблука
const snake = new Snake();
const apple = new Apple();

// Передаємо функцію анімації до setInterval

let playing = true;
let animationTime = 100;
const gameLoop = function () {
    ctx.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();

    if (playing) {
        setTimeout(gameLoop, animationTime);
    }
};

gameLoop();

// Конвертуємо ключ-коди в напрямки
const direction = {
    37: "left",
    38: "up",
    39: "right",
    40: "down"
};

// Обробник keydown для маніпуляції напрямками,
// заданими натисканням клавіш
$("body").keydown(function (event) {
    const newDirection = direction[event.keyCode];
    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
    }
});