const Platform = function () {
  this.width = 70;
  this.height = 17;

  this.x = Math.random() * (window.config.width - this.width);
  this.y = window.gameState.position;

  window.gameState.position += window.config.height / window.config.platformCount;

  this.flag = 0;
  this.state = 0;

  //Sprite clipping
  this.cx = 0;
  this.cy = 0;
  this.cwidth = 105;
  this.cheight = 31;

  //Function to draw it
  this.draw = function (ctx) {
    try {
      if (this.type === 1) this.cy = 0;
      else if (this.type === 2) this.cy = 61;
      else if (this.type === 3 && this.flag === 0) this.cy = 31;
      else if (this.type === 3 && this.flag === 1) this.cy = 1000;
      else if (this.type === 4 && this.state === 0) this.cy = 90;
      else if (this.type === 4 && this.state === 1) this.cy = 1000;

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
    } catch (e) {    }
  };

  //Platform types
  //1: Normal
  //2: Moving
  //3: Breakable (Go through)
  //4: Vanishable
  //Setting the probability of which type of platforms should be shown at what score

  const score = window.gameState.score;

  if (score >= 5000) this.types = [2, 3, 3, 3, 4, 4, 4, 4];
  else if (score >= 2000 && score < 5000) this.types = [2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4];
  else if (score >= 1000 && score < 2000) this.types = [2, 2, 2, 3, 3, 3, 3, 3];
  else if (score >= 500 && score < 1000) this.types = [1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3];
  else if (score >= 100 && score < 500) this.types = [1, 1, 1, 1, 2, 2];
  else this.types = [1];

  this.type = this.types[Math.floor(Math.random() * this.types.length)];

  //We can't have two consecutive breakable platforms otherwise it will be impossible to reach another platform sometimes!
  if (this.type === 3 && window.gameState.broken < 1) {
    window.gameState.broken++;
  } else if (this.type === 3 && window.gameState.broken >= 1) {
    this.type = 1;
    window.gameState.broken = 0;
  }

  this.moved = 0;
  this.vx = 1;
};

export default Platform;
