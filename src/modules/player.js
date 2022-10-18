const Player = function (canvasWidth, canvasHeight) {
  const image = document.getElementById('sprite');

  this.vy = 11;
  this.vx = 0;

  this.isMovingLeft = false;
  this.isMovingRight = false;
  this.isDead = false;

  this.width = 55;
  this.height = 40;

  // sprite clipping
  this.cx = 0;
  this.cy = 0;
  this.cwidth = 110;
  this.cheight = 80;

  this.dir = 'left';

  this.x = canvasWidth / 2 - this.width / 2;
  this.y = canvasHeight;

  this.draw = function (ctx) {
    try {
      if (this.dir === 'right') this.cy = 121;
      else if (this.dir === 'left') this.cy = 201;
      else if (this.dir === 'right_land') this.cy = 289;
      else if (this.dir === 'left_land') this.cy = 371;

      ctx.drawImage(
        image,
        this.cx,
        this.cy,
        this.cwidth,
        this.cheight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    } catch (e) {}
  };

  this.jump = function () {
    this.vy = -8;
  };

  this.jumpHigh = function () {
    this.vy = -16;
  };
};

export default Player
