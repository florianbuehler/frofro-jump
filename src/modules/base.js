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

  this.draw = function (ctx) {
    try {
      ctx.drawImage(
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
};

export default Base;
