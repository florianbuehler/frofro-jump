const Base = function () {
  this.height = 5;
  this.width = window.config.width;

  // sprite clipping
  this.cx = 0;
  this.cy = 614;
  this.cwidth = 100;
  this.cheight = 5;

  this.moved = 0;

  this.x = 0;
  this.y = window.config.height - this.height;
};

Base.prototype.draw = function () {
  try {
    window.game.board.drawImage(
      window.config.sprite,
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

Base.prototype.reset = function () {
  this.y = window.config.height - this.height;
};

export default Base;
