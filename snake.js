let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
let restartDiv = document.getElementById('restartDiv');
let WIDTH = 608;
let HEIGHT = 608;
let cellSize = 32;
let player;
let apple;
let gameover = false;

class Apple {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.img = new Image();
        this.img.src = './img/food.png';
        this.respawn();
    }

    respawn() {
        this.x = Math.floor(Math.random() * ((WIDTH/cellSize) - 2)) * cellSize + cellSize;
        this.y = Math.floor(Math.random() * ((HEIGHT/cellSize) - 4)) * cellSize + 3*cellSize;
    }

    draw() {
        ctx.drawImage(this.img, this.x, this.y, cellSize, cellSize);
    }
}

class Snake {
    constructor() {
        this.init()
    }

    init() {
        this.x = WIDTH/2 - 16;
        this.y = HEIGHT/2 + 16;
        this.body = [{ x: this.x, y: this.y }];
        this.maxSpd = 32;
        this.xSpd = 0;
        this.ySpd = 0;
        this.inputs = [];
        this.direction = '';
        this.score = 0;
        gameover = false;
    }

    update() {
        if(gameover) return;
        // Set player direction according to first unprocessed input
        if(this.inputs.length > 0) this.direction = this.inputs.shift();
        
        if(this.direction === 'right') {
            this.ySpd = 0;
            this.xSpd = this.maxSpd;
        } else if(this.direction === 'left') {
            this.ySpd = 0;
            this.xSpd = -this.maxSpd;
        }

        if(this.direction === 'up') {
            this.xSpd = 0;
            this.ySpd = -this.maxSpd;
        } else if(this.direction === 'down') {
            this.xSpd = 0;
            this.ySpd = this.maxSpd;
        }

        this.x += this.xSpd;
        this.y += this.ySpd;

        // Test collision with wall
        if(this.x > WIDTH-2*cellSize || this.x < cellSize || this.y > HEIGHT-2*cellSize || this.y < 3*cellSize) {
            gameover = true;
            clearInterval(gameLoop);
        }

        // Test collision with self
        for(let i = 1; i < this.body.length; i++) {
            if(Math.abs(this.x - this.body[i].x) < cellSize && Math.abs(this.y - this.body[i].y) < cellSize) {
                gameover = true;
                clearInterval(gameLoop);
            }
        }
        
        if(!gameover) {

            // Test collision with apple
            if(Math.abs(this.x - apple.x) < cellSize && Math.abs(this.y - apple.y) < cellSize) {
                //add a point
                this.score++;
                apple.respawn();
            } else {
                this.body.shift(); // delete old head
            }

            let newHead = {
                x: this.x,
                y: this.y
            };
            
            this.body.push(newHead); // add new head
        }
    }

    draw() {
        ctx.fillStyle = 'green';
        for(let i = 0; i < this.body.length; i++) {
            ctx.fillRect(this.body[i].x, this.body[i].y, cellSize, cellSize);
        }
    }
}

player = new Snake();
apple = new Apple();
let bg = new Image();
bg.src = './img/ground.png';

function update() {
    ctx.drawImage(bg, 0, 0, WIDTH, HEIGHT);

    player.update();
    player.draw();

    apple.draw();

    ctx.font = "32px Arial";
    ctx.fillStyle = 'white';
    ctx.fillText(player.score, 64, 48);

    if(gameover) {
        restartDiv.style.display = 'block';
    } else {
        restartDiv.style.display = 'none';
    }
}

function restartGame() {
    gameover = false;
    player.init();
    gameLoop = setInterval(() => {
        update();
    }, 80)
}

document.onkeydown = function(event) {
    if(event.keyCode === 68 && player.direction !== 'left') {	//d
        player.inputs.push('right');
    } else if(event.keyCode === 83 && player.direction !== 'up') {	//s
        player.inputs.push('down');
    } else if(event.keyCode === 65 && player.direction !== 'right') { //a
        player.inputs.push('left');
    } else if(event.keyCode === 87 && player.direction !== 'down') { // w
        player.inputs.push('up');
    }
}

restartGame();