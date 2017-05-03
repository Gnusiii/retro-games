

let cnv;
let snake;
let scl = 15;
let food;

function centerCanvas() {
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  cnv.position(x, y);
}

function windowResized() {
  centerCanvas();
}

//////////////////////////////////////////
//SETUP
//////////////////////////////////////////

function setup() {
  cnv = createCanvas(400, 400);
  centerCanvas();
  snake = new Snake();
  frameRate(10);
  foodLocation();
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

function draw() {
  background(100, 100, 100);

  if (snake.eat(food)) {
    foodLocation();
  }
  snake.collision();
  snake.update();
  snake.show();

  fill(150, 50, 50);
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
