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
    fill(255);
    for (let i = 0; i < this.total; i++) {
      rect(this.tail[i].x, this.tail[i].y, 15, 15);
    }
    rect(this.x, this.y, 15, 15);
  }

}
