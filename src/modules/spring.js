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
};

Spring.prototype.draw = function () {
  try {
    if (this.state === 0) {
      this.cy = 456;
      this.cheight = 43;
    } else if (this.state === 1) {
      this.cy = 501;
      this.cheight = 53;
    }

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
  } catch (e) {}
};

Spring.prototype.addToPlatform = function (platform) {
  if (platform.type === 1 || platform.type === 2) {
    this.x = platform.x + platform.width / 2 - this.width / 2;
    this.y = platform.y - platform.height - 10;

    if (this.y > window.config.height / 1.1) this.state = 0;

    this.draw();
  } else {
    this.x = 0 - this.width;
    this.y = 0 - this.height;
  }
};

export default Spring;
