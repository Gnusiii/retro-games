function Snake() {
  this.x = 0;
  this.y = 0;
  this.xspeed = 1;
  this.yspeed = 0;
  this.total = 0;
  this.tail = [];

  this.eat = (pos) => {
    let dis = dist(this.x, this.y, pos.x, pos.y);
    if (dis < 1) {
      this.total ++;
      return true;
    }
    else {
      return false;
    }
  }

  this.collision = () => {
    for (let i = 0; i < this.tail.length; i++) {
      let pos = this.tail[i];
      let dis = dist(this.x, this.y, pos.x, pos.y);
      if (dis < 1) {
        this.total = 0;
        this.tail = [];

        if ('collisionHandler' in this)
          this.collisionHandler();
      }
    }
  }

  this.dir = (x, y) => {
    this.xspeed = x;
    this.yspeed = y;
  }

  this.update = () => {
    for (let i = 0; i < this.tail.length-1; i++) {
      this.tail[i] = this.tail[i+1];
    }
    this.tail[this. total-1] = createVector(this.x, this.y);

    this.x = this.x + this.xspeed * scl;
    this.y = this.y + this.yspeed * scl;

    this.x = constrain(this.x, 0, width-scl);
    this.y = constrain(this.y, 0, height-scl);
  }
  this.show = () => {
    fill(205, 220, 57);
    for (let i = 0; i < this.total; i++) {
      rect(this.tail[i].x, this.tail[i].y, 15, 15);
    }
    rect(this.x, this.y, 15, 15);
  }

}

let cnv;
let snake;
let scl = 15;
let isGameOn = false;


//////////////////////////////////////////
//SETUP
//////////////////////////////////////////

function setup() {
  cnv = createCanvas(400, 400);
  cnv.parent('my-container');

  snake = new Snake();
  snake.collisionHandler = () => {
    isGameOn = false;
    document.getElementById('startGame').style.display = 'block';
    snake.x = 0;
    snake.y = 0;
  }
  frameRate(10);
  foodLocation();

  // Event listeners
  let btn = document.getElementById("startGame").addEventListener("click", startGame);
}

  function startGame() {
    isGameOn = true;
    document.getElementById('startGame').style.display = 'none';
  }

function foodLocation() {
  let cols = floor(width/scl);
  let rows = floor(height/scl);
  food = createVector(floor(random(cols)), floor(random(rows)));
  food.mult(scl);
}

//////////////////////////////////////////
//DRAW
//////////////////////////////////////////


// setTimeout(function(){
//   keepDrawing = true;
// }, 2000)
function draw() {

  if ( !isGameOn ) {
    return;
  }

  background(102, 187, 106);
  if (snake.eat(food)) {
    foodLocation();
  }

  snake.collision();
  snake.update();
  snake.show();

  fill(205, 220, 57);
  rect(food.x, food.y, 15, 15);
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    snake.dir(0, -1);
  }
  else if (keyCode === DOWN_ARROW) {
    snake.dir(0, 1);
  }
  else if (keyCode === RIGHT_ARROW) {
    snake.dir(1, 0);
  }
  else if (keyCode === LEFT_ARROW) {
    snake.dir(-1, 0);
  }
}
