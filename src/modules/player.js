const Player = function () {
  this.vy = 11;
  this.vx = 0;

  this.dir = 'left';
  this.isMovingLeft = false;
  this.isMovingRight = false;
  this.isDead = false;

  this.width = 55;
  this.height = 40;

  // sprite clipping
  this.cx = 0;
  this.cy = 0;
  this.cwidth = 110;
  this.cheight = 82;

  this.x = window.config.width / 2 - this.width / 2;
  this.y = window.config.height;
};

Player.prototype.draw = function () {
  try {
    const isLanding = this.vy < -7 && this.vy > -15;

    if (this.dir === 'left' && !isLanding) this.cy = 211;
    else if (this.dir === 'left' && isLanding) this.cy = 375;
    else if (this.dir === 'right' && !isLanding) this.cy = 123;
    else if (this.dir === 'right' && isLanding) this.cy = 293;

    window.game.board.drawImage(
      window.config.sprites,
      this.cx,
      this.cy,
      this.cwidth,
      this.cheight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  } catch (e) {
    console.log(e);
  }
};

Player.prototype.jump = function () {
  this.vy = -8;
};

Player.prototype.jumpHigh = function () {
  this.vy = -16;
};

Player.prototype.move = function () {
  // accelerations produces when the user hold the keys
  if (this.isMovingLeft === true) {
    this.x += this.vx;
    this.vx -= 0.15;
  } else {
    this.x += this.vx;
    if (this.vx < 0) this.vx += 0.1;
  }

  if (this.isMovingRight === true) {
    this.x += this.vx;
    this.vx += 0.15;
  } else {
    this.x += this.vx;
    if (this.vx > 0) this.vx -= 0.1;
  }

  // Speed limits!
  if (this.vx > 8) this.vx = 8;
  else if (this.vx < -8) this.vx = -8;
};

Player.prototype.reset = function () {
  this.vy = 11;
  this.vx = 0;
  this.x = window.config.width / 2 - this.width / 2;
  this.y = window.config.height;

  this.isMovingLeft = false;
  this.isMovingRight = false;
  this.isDead = false;
};

export default Player;
