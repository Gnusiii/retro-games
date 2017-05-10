let canvas
let tetris;
let blockSize;
let starttetris = false;

let cnv
let Game;
let BlockSize;
let startGame = false;
// const mySnake = new Snake();

function setup() {
  cnv = createCanvas(500, 490);
  canvas = createCanvas(500, 490);
  Game = new game();
  tetris = new TetrisGame();
  frameRate(10);
  textAlign(CENTER,CENTER);
	textSize(14);
  canvas.parent("tetris");
  cnv.parent("snake");

  let tetrisBtn = document.getElementById('tetris-btn').addEventListener('click', startTetris);
  let snakeBtn = document.getElementById('snake-btn').addEventListener('click', startSnake);
}

function startTetris() {
	starttetris = true;
  startGame = false;
	document.getElementById('tetris-btn').style.display = 'none';


}

function startSnake() {
  startGame = true;
  starttetris = false;
  document.getElementById('snake-btn').style.display = 'none';
  document.getElementById('tetris-btn').style.display = 'none';
}

function draw() {


  if (!startGame) {
    if ( !starttetris ) {
      return;
    }

    tetris.tetrisUpdate();
    tetris.tetrisdisplay();

  } else {
  if (starttetris) {
    tetris.tetrisUpdate();
    tetris.tetrisdisplay();
  }
  background(50, 175, 50);
  Game.update();
  Game.display();
  }
}


class TetrisGame {
  constructor() {
blockSize = 20;
this.Score=0;
this.tetrisLevel=1;
this.Matrix=new Matrix();
this.stats=new Statistics();
this.blocks= [ "I", "J", "L", "O", "S", "T", "Z" ];
// console.log(random(this.blocks));
this.Curr_Piece=new Piece(random(this.blocks));
// console.log(this.Curr_Piece);
this.Next_Piece=new Piece(random(this.blocks));
this.tetrisOver=false;
this.rButton=new ResetButtonTwo();
}


tetrisUpdate(){
  this.tetrisLevel=floor(this.Score/1000)+1;
  frameRate(3+this.tetrisLevel);
  if(keyIsDown(DOWN_ARROW))  //to move fast
  {
    frameRate(12);
  }
  if(keyIsDown(LEFT_ARROW)) {   //move left
    this.Matrix.moveLeft();
  }
  if(keyIsDown(RIGHT_ARROW)) {  //move tight
    this.Matrix.moveRight();
  }

  if (this.tetrisOver) {
    noLoop();
  }

  if(this.Matrix.free) {
    this.Matrix.falling_piece=this.Next_Piece;
    // this.blocks= [ "I", "J", "L", "O", "S", "T", "Z" ];
    this.Next_Piece= new Piece(random(this.blocks));
    this.stats.piece=this.Next_Piece;
    this.stats.tetrisUpdate();
  }
  this.Matrix.tetrisUpdate();
}

tetrisdisplay() {
  background(175, 50, 50);
  this.Matrix.tetrisdisplay();
  this.stats.tetrisdisplay();
  this.rButton.tetrisdisplay();

}

keyPressed() {
  // console.log(this.Matrix);
  return this.Matrix.keyPressed();
}

onClick() {
  this.rButton.onClick();
}

reset() {
  tetris = new TetrisGame();
  loop();
  frameRate(2);
}

}

class Matrix {
  constructor() {
this.pos=createVector(0,0);
this.size=createVector(12,24);
this.free=true;
this.falling_piece;
this.startingpos=p5.Vector.add(this.pos,createVector(6,-1));
this.speed=createVector(0,1);
this.cells=[];
this.canMove=true;

for(var i=0;i<this.size.x;i++){
  this.cells[i]=[];
  for(var j=0;j<this.size.y;j++){
    this.cells[i][j]=false;
  }
}
}
tetrisUpdate() {
  if (this.free){
    this.falling_piece.pos.set(this.startingpos);
    this.free=false;
  }

  let collision=this.checkCollission();
  if (collision) {
    //Add the blocks to Matrix
    this.free=true;
    for(var i=0;i<this.falling_piece.blocks.length;i++){
      let block=p5.Vector.add(this.falling_piece.pos,this.falling_piece.blocks[i]);
      this.cells[block.x][block.y]=true;
    }
    //check for Complete Line
    let counter=0;
    for(let i=0;i<this.size.y;i++){
      let check=true;
      for(let j=0;j<this.size.x;j++){
        check=(check && this.cells[j][i]);
      }
      if(check){
        for(let j=0;j<this.size.x;j++){
          this.cells[j].splice(i,1);
          this.cells[j].unshift(false);

        }
        counter++;

      }
    }
    //change Score on Completer Line
    switch(counter){
      case 4:
        tetris.Score+=400;
      case 3:
        tetris.Score+=300;
      case 2:
        tetris.Score+=200;
      case 1:
        tetris.Score+=100;
    }

    if(this.falling_piece.pos.y<0){
      console.log("tetris Over");
      tetris.tetrisOver=true;
    }

  }
  else if((!keyIsPressed||keyIsDown(DOWN_ARROW)||keyIsDown(UP_ARROW))||this.canMove){
    this.falling_piece.pos.add(this.speed);
  }



}
tetrisdisplay() {
  stroke(255);
  noFill();
    rect(this.pos.x,this.pos.y,this.size.x*blockSize,this.size.y*blockSize);
    this.falling_piece.tetrisdisplay();
    for(var i=0;i<this.size.x;i++){
      for(var j=0;j<this.size.y;j++){
        if(this.cells[i][j]){
          rect(i*blockSize,j*blockSize,blockSize,blockSize);
        }
    }
  }
}
//following functions returns true if current piece collides with matrix
checkCollission() {
  for(var i=0;i<this.falling_piece.blocks.length;i++){
    if((this.falling_piece.pos.y+this.falling_piece.blocks[i].y+1)-(this.pos.y+this.size.y)>=0){
      return true;
    }

    else if(this.cells[this.falling_piece.pos.x+this.falling_piece.blocks[i].x][this.falling_piece.pos.y+this.falling_piece.blocks[i].y+1]){
      return true;
    }
  }

  return false;
}
// function to call when left key is presssed
moveLeft(){
  if(this.falling_piece.pos.x>this.pos.x) {
    var check=true;
      for(var i=0;i<this.falling_piece.blocks.length;i++){
        if(this.cells[this.falling_piece.pos.x+this.falling_piece.blocks[i].x-1][this.falling_piece.pos.y+this.falling_piece.blocks[i].y])//||this.cells[this.falling_piece.pos.x+this.falling_piece.blocks[i].x-1][this.falling_piece.pos.y+this.falling_piece.blocks[i].y+1])
        {
          check=false;
        }
      }
    if (check){
      this.falling_piece.pos.add(createVector(-1,0));
      this.canMove=false;

    }else{
      this.canMove=true;
    }
  }
  else this.canMove=true;
    // return false;
}
//function to call when right key is pressed
moveRight() {
  var check=true;
    for(var i=0;i<this.falling_piece.blocks.length;i++){
      if(this.size.x-(this.falling_piece.pos.x+this.falling_piece.blocks[i].x)<2)
        check=false;
      else if(this.cells[this.falling_piece.pos.x+this.falling_piece.blocks[i].x+1][this.falling_piece.pos.y+this.falling_piece.blocks[i].y])//||this.cells[this.falling_piece.pos.x+this.falling_piece.blocks[i].x+1][this.falling_piece.pos.y+this.falling_piece.blocks[i].y+1])
      {
        check=false;
      }
    }
    if(check) {
      this.falling_piece.pos.add(createVector(1,0));
      this.canMove=false;
    }
    else{
      this.canMove=true;
    }
}
// following function to rotatr when up arrow is pressed
keyPressed() {
  if(keyCode==UP_ARROW){

    this.falling_piece.rot=(this.falling_piece.rot+1)%4;
    this.falling_piece.fillblocks();
  for(var i=0;i<this.falling_piece.blocks.length;i++){
      if((this.falling_piece.pos.x+this.falling_piece.blocks[i].x)>=this.size.x||this.cells[this.falling_piece.pos.x+this.falling_piece.blocks[i].x][this.falling_piece.pos.y+this.falling_piece.blocks[i].y])
      {
        if(this.falling_piece.rot>0)
          this.falling_piece.rot=(this.falling_piece.rot-1)%4;
        else
          this.falling_piece.rot=3;
        this.falling_piece.fillblocks();
      }
    }
    return false;
  }
  if(keyCode==DOWN_ARROW){
    return false;
  }
}
}

class Statistics {
  constructor() {
this.block_position=createVector((width-260)/blockSize+4,height/(2*blockSize));
this.score_position=createVector(width-260,100);
this.next_text=createVector((width-260),height/2+30);
}
tetrisUpdate() {
  this.piece.pos.set(this.block_position);
}
tetrisdisplay() {

  this.piece.tetrisdisplay();
  //text("hi"+this.score,width-300,0,width,height);
  fill(0);
  // text("Next piece ", this.next_text.x, this.next_text.y);
  let scoreCount = text("Score: "+tetris.Score,240,0,width-240,height/4);
  let levelCount = text("Level: "+tetris.tetrisLevel,240,0,width-240,height/2);

}
}

class Piece {
constructor(block) {
this.pos=createVector(0,0);
this.blocks=[]
this.block = block;
this.color= color(0,0,0);
this.rot=0;
this.fillblocks();
// localStorage.setItem("currentBlock"+ num +"", block);

}         // four rorations 0,1 and 2 and 3
fillblocks() {
  console.log(this.block);
  const block = this.block;
  this.blocks=[];
  if(block == "I"){
    this.color= color(25, 150, 25);
    if (this.rot==0||this.rot==2){
      this.blocks.push(createVector(0,0));
      this.blocks.push(createVector(0,1));
      this.blocks.push(createVector(0,2));
      this.blocks.push(createVector(0,3));
    }
    else{
      this.blocks.push(createVector(1,0));
      this.blocks.push(createVector(2,0));
      this.blocks.push(createVector(3,0));
      this.blocks.push(createVector(4,0));
    }

  }
  if(block=="L"){
    this.color= color(100,100,100);
    if(this.rot==0){
      this.blocks.push(createVector(0,0));
      this.blocks.push(createVector(0,1));
      this.blocks.push(createVector(0,2));
      this.blocks.push(createVector(1,2));
    }
    else if (this.rot==1){
      this.blocks.push(createVector(0,0));
      this.blocks.push(createVector(1,0));
      this.blocks.push(createVector(2,0));
      this.blocks.push(createVector(0,1));
    }
    else if (this.rot==2){
      this.blocks.push(createVector(0,0));
      this.blocks.push(createVector(1,0));
      this.blocks.push(createVector(1,1));
      this.blocks.push(createVector(1,2));
    }
    else if (this.rot==3){
      this.blocks.push(createVector(2,0));
      this.blocks.push(createVector(0,1));
      this.blocks.push(createVector(1,1));
      this.blocks.push(createVector(2,1));
    }
  }
  if(block == "J"){
    this.color= color(0, 200, 200);
    if(this.rot==0){
      this.blocks.push(createVector(1,0));
      this.blocks.push(createVector(1,1));
      this.blocks.push(createVector(1,2));
      this.blocks.push(createVector(0,2));
    }
    else if (this.rot==1){
      this.blocks.push(createVector(0,0));
      this.blocks.push(createVector(0,1));
      this.blocks.push(createVector(1,1));
      this.blocks.push(createVector(2,1));
    }
    else if (this.rot==2){
      this.blocks.push(createVector(0,0));
      this.blocks.push(createVector(1,0));
      this.blocks.push(createVector(0,1));
      this.blocks.push(createVector(0,2));
    }
    else if (this.rot==3){
      this.blocks.push(createVector(0,0));
      this.blocks.push(createVector(1,0));
      this.blocks.push(createVector(2,0));
      this.blocks.push(createVector(2,1));
    }
  }
  if(block == "O"){
    this.color= color(200, 200, 0);
    this.blocks.push(createVector(0,0));
    this.blocks.push(createVector(0,1));
    this.blocks.push(createVector(1,0));
    this.blocks.push(createVector(1,1));

  }
  if(block == "S"){
    this.color= color(200, 0, 200);
    if(this.rot==0 ||this.rot==2){
      this.blocks.push(createVector(1,0));
      this.blocks.push(createVector(2,0));
      this.blocks.push(createVector(0,1));
      this.blocks.push(createVector(1,1));
    }
    else{
      this.blocks.push(createVector(0,0));
      this.blocks.push(createVector(0,1));
      this.blocks.push(createVector(1,1));
      this.blocks.push(createVector(1,2));
    }
  }
  if(block == "T"){
    this.color= color(150, 50, 150);
    if (this.rot==0){
      this.blocks.push(createVector(0,0));
      this.blocks.push(createVector(1,0));
      this.blocks.push(createVector(2,0));
      this.blocks.push(createVector(1,1));
    }
    else if (this.rot==1){
      this.blocks.push(createVector(1,0));
      this.blocks.push(createVector(0,1));
      this.blocks.push(createVector(1,1));
      this.blocks.push(createVector(1,2));
    }
    else if (this.rot==2){
      this.blocks.push(createVector(1,0));
      this.blocks.push(createVector(0,1));
      this.blocks.push(createVector(1,1));
      this.blocks.push(createVector(2,1));
    }
    else if (this.rot==3){
      this.blocks.push(createVector(0,0));
      this.blocks.push(createVector(0,1));
      this.blocks.push(createVector(1,1));
      this.blocks.push(createVector(0,2));
    }
  }
  if(block == "Z"){
    this.color= color(50, 150, 200);
    if(this.rot==0|| this.rot==2){
      this.blocks.push(createVector(0,0));
      this.blocks.push(createVector(1,0));
      this.blocks.push(createVector(1,1));
      this.blocks.push(createVector(2,1));
    }
    else{
      this.blocks.push(createVector(1,0));
      this.blocks.push(createVector(0,1));
      this.blocks.push(createVector(1,1));
      this.blocks.push(createVector(0,2));
    }
  }
}



tetrisdisplay() {
  stroke(1, 1, 1);
  fill(this.color);
  for (var i=0;i<this.blocks.length;i++){
  let	position = p5.Vector.add(this.pos,this.blocks[i]);
    rect(position.x*blockSize,position.y*blockSize,blockSize,blockSize);
  }

}
}


class ResetButtonTwo {
  constructor() {
//this.score_position=createVector(width-260,300);
this.x = (width/2 +120);
this.y = 420;
this.radius = 30;
this.col = 255;

}
tetrisdisplay() {
  noFill();
  stroke(this.col);
  strokeWeight(4);
  arc(this.x, this.y, 60, 60, 0, 10 / 6 * PI);
  line(this.x + this.radius, this.y, this.x + this.radius + 2.5, this.y + 5);
  line(this.x + this.radius, this.y, this.x + this.radius - 2.5, this.y + 5);
  strokeWeight(1);
}
 onClick() {
  if (dist(mouseX, mouseY, this.x, this.y) < this.radius) {
    tetris.reset();
  }

}

}

function keyPressed() {
return(tetris.keyPressed());       // to prevent default of arrow keys only
}
function mouseReleased() {
tetris.onClick();
return false;
}


class game {
  constructor() {
    BlockSize = 20;
    this.Snake = new Snake();
    this.Fruit = new Fruit(this.Snake);
    this.GameOver = false;
    this.RButton = new ResetButton();
    this.Frame = frameCount;
  }
  update()  {
    if (this.Snake.eat(this.Fruit)) {
      this.Snake.grow();
      this.Fruit.resetPosition(this.Snake);
    } else
    this.Snake.move();
    this.GameOver = this.Snake.checkCollision();

  }

  display() {
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
  keyPressed() {
    if (this.Frame != frameCount) {        //Prevents two keys in same frame
      this.Frame=frameCount;
       return(this.Snake.keyPressed());

    }

  }
  onClick() {
    if (this.GameOver) this.RButton.onClick();
	//else this.Snake.touch();
  }
  touch() {
	  if (this.Frame != frameCount) {        //Prevents two keys in same frame
      this.Snake.touch();
      this.Frame=frameCount;
    }
    if (this.GameOver) this.RButton.onClick();
  }
  reset() {
    //background("black");
    stroke(0);
    strokeWeight(1);
    this.GameOver = false;
    this.Snake = new Snake();
    loop();
  }



}

  class Snake {
    constructor() {
  this.pos = createVector(0, 0);
  this.velocity = createVector(BlockSize, 0);
  this.tail = [];

}
  move() {
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
  checkCollision() {
    for (var i = 0; i < this.tail.length; i++) {
      if (this.tail[i].equals(this.pos)) {
        return true;
      }
    }
    return false;
  }
  display() {
    fill(100, 200, 100);
    rect(this.pos.x, this.pos.y, BlockSize, BlockSize); //displays head
    for (var i = 0; i < this.tail.length; i++) { //displays tail
	rect(this.tail[i].x, this.tail[i].y, BlockSize, BlockSize);
	}
	}
	 keyPressed() {
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
    touch(){
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
  eat(food) {
    if (this.pos.dist(food.pos) == 0)
      return true;
    else
      return false;
  }
  grow() {
    this.tail.unshift(this.pos.copy());
    this.pos.add(this.velocity);
  }

}

 class Fruit {
   constructor(Snake) {
  this.pos = createVector(0, 0);
  this.resetPosition(Snake);
}
  resetPosition(Snake) {
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
  display() {
    fill(50, 200, 50);
    rect(this.pos.x, this.pos.y, BlockSize, BlockSize);
  }
}

  class ResetButton {
    constructor() {
  this.x = width / 2;
  this.y = height * 3 / 4;
  this.radius = 30;
  this.col = 255;
}
  display() {
    noFill();
    stroke(this.col);
    strokeWeight(4);
    arc(this.x, this.y, 60, 60, 0, 10 / 6 * PI);
    // line(this.x + this.radius, this.y, this.x + this.radius + 5, this.y + 5);
    // line(this.x + this.radius, this.y, this.x + this.radius - 5, this.y + 5);
  }
  onClick() {
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
