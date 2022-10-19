const Spring = function () {
  this.x = 0;
  this.y = 0;

  this.width = 26;
  this.height = 30;

  // sprite clipping
  this.cx = 0;
  this.cy = 0;
  this.cwidth = 45;
  this.cheight = 53;

  this.state = 0;

  this.draw = function (ctx) {
    try {
      if (this.state === 0) this.cy = 445;
      else if (this.state === 1) this.cy = 501;

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

export default Spring;
