let cnv;
let Game;
let BlockSize;
let startGame = false;

function setup() {
  cnv = createCanvas(500, 423);
  Game = new game();
  frameRate(10);
  cnv.parent("snake");

  let snakeBtn = document.getElementById('snake-btn').addEventListener('click', startSnake);
}

function startSnake() {
  startGame = true;
  document.getElementById('snake-btn').style.display = 'none';
}

function draw() {

  if (!startGame) {
    return false;
  }

  background(50, 175, 50);
  Game.update();
  Game.display();


}

function game() {
  BlockSize = 20;
  this.Snake = new snake();
  this.Fruit = new fruit(this.Snake);
  this.GameOver = false;
  this.RButton = new ResetButton();
  this.Frame = frameCount;

  this.update = function() {
    if (this.Snake.eat(this.Fruit)) {
      this.Snake.grow();
      this.Fruit.resetPosition(this.Snake);
    } else
    this.Snake.move();
    this.GameOver = this.Snake.checkCollision();

  }

  this.display = function() {
    this.Fruit.display();
    this.Snake.display();
    if (this.GameOver) {
      background(155, 155, 155, 200);
      fill(200, 155, 0);
      noStroke();
      textSize(32);
      textAlign(CENTER, CENTER);
      text("Your snaked reached a length of " + (this.Snake.tail.length + 1) + " !", 0, 0, width, height);
      noLoop();
      this.RButton.display();

    }

  }
  this.keyPressed = function() {
    if (this.Frame != frameCount) {        //Prevents two keys in same frame
      this.Frame=frameCount;
       return(this.Snake.keyPressed());

    }

  }
  this.onClick = function() {
    if (this.GameOver) this.RButton.onClick();
	//else this.Snake.touch();
  }
  this.touch=function(){
	  if (this.Frame != frameCount) {        //Prevents two keys in same frame
      this.Snake.touch();
      this.Frame=frameCount;
    }
    if (this.GameOver) this.RButton.onClick();
  }
  this.reset = function() {
    //background("black");
    stroke(0);
    strokeWeight(1);
    this.GameOver = false;
    this.Snake = new snake();
    loop();
  }



}

function snake() {
  this.pos = createVector(0, 0);
  this.velocity = createVector(BlockSize, 0);
  this.tail = [];


  this.move = function() {
    //movement of snake
    if (this.tail.length > 0) {
      this.tail.pop();
      this.tail.unshift(this.pos.copy());
    }
    this.pos.add(this.velocity);
    // movement in case of touching boundary
    if (this.pos.x >= width) this.pos.x = 0;
    else if (this.pos.x < 0) this.pos.x = width - BlockSize; if (this.pos.y >= height) this.pos.y = 0;
    else if (this.pos.y < 0) this.pos.y = height - BlockSize;
    //--movement ends of snake


  }
  this.checkCollision = function() {
    for (var i = 0; i < this.tail.length; i++) {
      if (this.tail[i].equals(this.pos)) {
        return true;
      }
    }
    return false;
  }
  this.display = function() {
    fill(100, 200, 100);
    rect(this.pos.x, this.pos.y, BlockSize, BlockSize); //displays head
    for (var i = 0; i < this.tail.length; i++) { //displays tail
	rect(this.tail[i].x, this.tail[i].y, BlockSize, BlockSize);
	}
	}
	this.keyPressed = function() {
	if (keyCode == UP_ARROW && this.velocity.y == 0) {
		this.velocity.set(0, -BlockSize); return false;
		}
		else if (keyCode == DOWN_ARROW && this.velocity.y == 0) {
			this.velocity.set(0, BlockSize); return false;
			}
		else if (keyCode == LEFT_ARROW && this.velocity.x == 0) {
			this.velocity.set(-BlockSize, 0); return false;
		}
		else if (keyCode == RIGHT_ARROW && this.velocity.x == 0) {
			this.velocity.set(BlockSize, 0); return false; }
		else return true;
	}
    this.touch=function(){
           if(mouseX>0 && mouseX<width && mouseY>0 && mouseY<height){ if (mouseX>width/2){
			  if(this.velocity.y==0){
				  this.velocity.set(0,-this.velocity.x);
			  }
			  else{
				  this.velocity.set(this.velocity.y,0);
			  }
		  }
		  else{
			  if(this.velocity.x==0){
				  this.velocity.set(-this.velocity.y,0);
			  }
			  else{
				  this.velocity.set(0,this.velocity.x);
			  }

		  }
	  }
  }
  this.eat = function(food) {
    if (this.pos.dist(food.pos) == 0)
      return true;
    else
      return false;
  }
  this.grow = function() {
    this.tail.unshift(this.pos.copy());
    this.pos.add(this.velocity);
  }

}

function fruit(Snake) {
  this.pos = createVector(0, 0);

  this.resetPosition = function(Snake) {
    this.pos.x = floor(random(0, width / BlockSize)) * BlockSize;
    this.pos.y = floor(random(0, height / BlockSize)) * BlockSize;
	if(Snake.tail.length>0){
		for (var i = 0; i < Snake.tail.length; i++) {
			if (Snake.tail[i].equals(this.pos)) {
				this.resetPosition(Snake);
			}
		}
	}

  }
  this.resetPosition(Snake);
  this.display = function() {
    fill(50, 200, 50);
    rect(this.pos.x, this.pos.y, BlockSize, BlockSize);
  }
}

function ResetButton() {
  this.x = width / 2;
  this.y = height * 3 / 4;
  this.radius = 30;
  this.col = 255;
  this.display = function() {
    noFill();
    stroke(this.col);
    strokeWeight(4);
    arc(this.x, this.y, 60, 60, 0, 10 / 6 * PI);
    // line(this.x + this.radius, this.y, this.x + this.radius + 5, this.y + 5);
    // line(this.x + this.radius, this.y, this.x + this.radius - 5, this.y + 5);

  }
  this.onClick = function() {
    if (dist(mouseX, mouseY, this.x, this.y) < this.radius) {
      Game.reset();
    }

  }

}

function mouseReleased() {
  Game.onClick();
  return false;
}
function mousePressed() {
}

function touchStarted(){
	Game.touch();
}
function touchEnded(){
	return false;
}

function keyPressed() {
  return(Game.keyPressed());       // to prevent default of arrow keys only
}
