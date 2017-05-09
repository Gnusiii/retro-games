
let Game;
let BlockSize;

function setup() {
	let cnv = createCanvas(500, 500);
	cnv.parent("tetris");
	Game = new game();
	frameRate(4);
	textAlign(CENTER,CENTER);
	textSize(14);
}

function draw() {

	Game.update();
	Game.display();
}

function game() {
	BlockSize = 20;
	this.Score=0;
	this.GameLevel=1;
	this.Matrix=new matrix();
	this.stats=new statistics();
	this.designs= [ "I", "J", "L", "O", "S", "T", "Z" ];
	this.Curr_Piece=new piece(random(this.designs));
	this.Next_Piece=new piece(random(this.designs));
	this.GameOver=false;
	this.rButton=new ResetButton();



	this.update=function(){
		this.GameLevel=floor(this.Score/1000)+1;
		frameRate(3+this.GameLevel);
		if(keyIsDown(DOWN_ARROW))  //to move fast
		{
			frameRate(12);
		}
		if(keyIsDown(LEFT_ARROW)){   //move left
			this.Matrix.moveLeft();
		}
		if(keyIsDown(RIGHT_ARROW)){  //move tight
			this.Matrix.moveRight();
		}

		if (this.GameOver){
			noLoop();
		}

		if(this.Matrix.free){
			this.Matrix.falling_piece=this.Next_Piece;
			this.Next_Piece=new piece(random(this.designs));
			this.stats.piece=this.Next_Piece;
			this.stats.update();
		}
		this.Matrix.update();
	}

	this.display=function(){
		background(175, 50, 50);
		this.Matrix.display();
		this.stats.display();
		this.rButton.display();

	}

	this.keyPressed=function(){
		return this.Matrix.keyPressed();
	}

	this.onClick=function(){
		this.rButton.onClick();
	}

	this.reset=function(){
		Game=new game();
		loop();
		frameRate(2);
	}

}

function matrix(){
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

	this.update=function(){
		if (this.free){
			this.falling_piece.pos.set(this.startingpos);
			this.free=false;
		}

		var collision=this.checkCollission();
		if (collision) {
			//Add the design to Matrix
			this.free=true;
			for(var i=0;i<this.falling_piece.blocks.length;i++){
				block=p5.Vector.add(this.falling_piece.pos,this.falling_piece.blocks[i]);
				this.cells[block.x][block.y]=true;
			}
			//check for Complete Line
			counter=0;
			for(var i=0;i<this.size.y;i++){
				var check=true;
				for(var j=0;j<this.size.x;j++){
					check=(check && this.cells[j][i]);
				}
				if(check){
					for(var j=0;j<this.size.x;j++){
						this.cells[j].splice(i,1);
						this.cells[j].unshift(false);

					}
					counter++;

				}
			}
			//change Score on Completer Line
			switch(counter){
				case 4:
					Game.Score+=400;
				case 3:
					Game.Score+=300;
				case 2:
					Game.Score+=200;
				case 1:
					Game.Score+=100;
			}

			if(this.falling_piece.pos.y<0){
				console.log("Game Over");
				Game.GameOver=true;
			}

		}
		else if((!keyIsPressed||keyIsDown(DOWN_ARROW)||keyIsDown(UP_ARROW))||this.canMove){
			this.falling_piece.pos.add(this.speed);
		}



	}
	this.display=function(){
		stroke(255);
		noFill();
		rect(this.pos.x,this.pos.y,this.size.x*BlockSize,this.size.y*BlockSize);
		this.falling_piece.display();
		for(var i=0;i<this.size.x;i++){
			for(var j=0;j<this.size.y;j++){
				if(this.cells[i][j]){
					rect(i*BlockSize,j*BlockSize,BlockSize,BlockSize);
				}
			}
		}
	}
	//following functions returns true if current piece collides with matrix
	this.checkCollission=function(){
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
	this.moveLeft=function(){
		if(this.falling_piece.pos.x>this.pos.x){
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
	this.moveRight=function(){
		var check=true;
			for(var i=0;i<this.falling_piece.blocks.length;i++){
				if(this.size.x-(this.falling_piece.pos.x+this.falling_piece.blocks[i].x)<2)
					check=false;
				else if(this.cells[this.falling_piece.pos.x+this.falling_piece.blocks[i].x+1][this.falling_piece.pos.y+this.falling_piece.blocks[i].y])//||this.cells[this.falling_piece.pos.x+this.falling_piece.blocks[i].x+1][this.falling_piece.pos.y+this.falling_piece.blocks[i].y+1])
				{
					check=false;
				}
			}
			if(check){
				this.falling_piece.pos.add(createVector(1,0));
				this.canMove=false;
			}
			else{
				this.canMove=true;
			}
	}
	// following function to rotatr when up arrow is pressed
	this.keyPressed=function(){
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

function statistics(){
	this.design_position=createVector((width-260)/BlockSize+4,height/(2*BlockSize));
	this.score_position=createVector(width-260,100);
	this.next_text=createVector((width-260),height/2+30);

	this.update=function(){
		this.piece.pos.set(this.design_position);
	}
	this.display=function(){

		this.piece.display();
		//text("hi"+this.score,width-300,0,width,height);
		fill("white");
		// text("Next piece ", this.next_text.x, this.next_text.y);
		text("Score: "+Game.Score,240,0,width-240,height/4);
		text("Level: "+Game.GameLevel,240,0,width-240,height/2);


	}
}

function piece(design){
	this.pos=createVector(0,0);
	this.blocks=[]
	this.color="#FF0000";
	this.rot=0;          // four rorations 0,1 and 2 and 3
	this.fillblocks=function(){
		this.blocks=[];
		if(design=="I"){
			this.color="#FF0000";
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
		if(design=="L"){
			this.color="#FFFF00";
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
		if(design=="J"){
			this.color="#FF00FF";
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
		if(design=="O"){
			this.color="#00FFFF";
			this.blocks.push(createVector(0,0));
			this.blocks.push(createVector(0,1));
			this.blocks.push(createVector(1,0));
			this.blocks.push(createVector(1,1));

		}
		if(design=="S"){
			this.color="#0000FF";
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
		if(design=="T"){
			this.color="#C0C0C0";
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
		if(design=="Z"){
			this.color="#80FF00";
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
	this.fillblocks();


	this.display=function(){
		stroke("black");
		fill(this.color);
		for (var i=0;i<this.blocks.length;i++){
			position=p5.Vector.add(this.pos,this.blocks[i]);
			rect(position.x*BlockSize,position.y*BlockSize,BlockSize,BlockSize);
		}

	}
}

function ResetButton() {
	//this.score_position=createVector(width-260,300);
	this.x = (width/2 +120);
	this.y = 420;
	this.radius = 30;
	this.col = 255;
	this.display = function() {
		noFill();
		stroke(this.col);
		strokeWeight(4);
		arc(this.x, this.y, 60, 60, 0, 10 / 6 * PI);
		line(this.x + this.radius, this.y, this.x + this.radius + 5, this.y + 5);
		line(this.x + this.radius, this.y, this.x + this.radius - 5, this.y + 5);
		strokeWeight(1);
	}
	this.onClick = function() {
		if (dist(mouseX, mouseY, this.x, this.y) < this.radius) {
		  Game.reset();
		}

  }

}

function keyPressed() {
  return(Game.keyPressed());       // to prevent default of arrow keys only
}
function mouseReleased() {
  Game.onClick();
  return false;
}
