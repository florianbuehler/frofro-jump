import Base from './modules/base.js';
import { hideGameOverMenu, hideMenu, showGameOverMenu } from './modules/menus.js';
import Platform, { BrokenPlatformSubstitute } from './modules/platform.js';
import Player from './modules/player.js';
import { hideScoreBoard, showScoreBoard } from './modules/score-board.js';
import Spring from './modules/spring.js';

var ua = navigator.userAgent;
var bTouch =
  ua.indexOf('(iP') == -1 &&
  ua.indexOf('Android') == -1 &&
  ua.indexOf('BlackBerry') == -1 &&
  ua.indexOf('HTC') == -1 &&
  ua.indexOf('PlayBook') == -1 &&
  ua.indexOf('webOS') == -1 &&
  ua.indexOf('IEMobile') == -1 &&
  ua.indexOf('Silk') == -1
    ? false
    : true;
var bT = 0; // emulate keys pressed
var bTlast = 0;
var Dir = 'left';

function mobile(id) {
  // TODO: pass keys as arrays (as could change)
  var o = document.getElementById(id);
  if (o) {
    if (bTouch) {
      o.innerHTML =
        "<p><div style='border:1px solid red;width:60px;float:left;margin-left:60px;font-size:xx-large;-webkit-user-select:none;' ontouchend='Dir = \"left\";player.isMovingLeft = false;' ontouchstart='Dir = \"left\";player.isMovingLeft = true;' >&larr;</div> <div style='border:1px solid red;width:60px;float:right;margin-right:60px;font-size:xx-large;-webkit-user-select:none;' ontouchend='Dir = \"right\";player.isMovingRight = false;' ontouchstart='Dir = \"right\";player.isMovingRight = true;' >&rarr;</div></p>";

      document.body.addEventListener('touchmove', function (event) {
        event.preventDefault();
      });
      setTimeout(function () {
        window.scrollTo(0, 1);
      }, 1);
    }
  }
}

if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (fn, scope) {
    for (var i = 0, len = this.length; i < len; ++i) {
      fn.call(scope, this[i], i, this);
    }
  };
}

// RequestAnimFrame: a browser API for getting smooth animations
window.requestAnimFrame = (function () {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

//Variables for game
var animloop,
  flag = 0,
  dir,
  firstRun = true;

let menuLoop;

const addKeyboardControls = function () {
  const player = window.game.player;

  document.onkeydown = function (e) {
    const key = e.keyCode;

    if (key === 37) {
      dir = 'left';
      player.isMovingLeft = true;
    } else if (key === 39) {
      dir = 'right';
      player.isMovingRight = true;
    }

    if (key === 32) {
      if (firstRun === true) startGame();
      else resetGame();
    }
  };

  document.onkeyup = function (e) {
    const key = e.keyCode;

    if (key === 37) {
      dir = 'left';
      player.isMovingLeft = false;
    } else if (key === 39) {
      dir = 'right';
      player.isMovingRight = false;
    }
  };
};

const init = function () {
  // we add the config to the window object, so we can access it from everywhere
  window.config = {
    width: 422,
    height: 552,
    gravity: 0.2,
    platformCount: 10,
    sprite: document.getElementById('sprite')
  };

  const canvas = document.getElementById('canvas');
  canvas.width = window.config.width;
  canvas.height = window.config.height;

  // we add the game state to the window object, so we can access and update it from everywhere
  window.game = {
    board: canvas.getContext('2d'),
    base: new Base(),
    player: new Player(),
    spring: new Spring(),
    platforms: [],
    platform_broken_substitute: new BrokenPlatformSubstitute(),
    position: 0,
    broken: 0,
    score: 0
  };

  for (let i = 0; i < window.config.platformCount; i++) {
    window.game.platforms.push(new Platform());
  }

  addKeyboardControls();
};

window.startGame = function () {
  //Variables for the game
  var dir = 'left',
    jumpCount = 0;

  firstRun = false;

  function paintCanvas() {
    window.game.board.clearRect(0, 0, window.config.width, window.config.height);
  }

  function playerCalc() {
    const player = window.game.player;
    const platforms = window.game.platforms;

    if (bTouch) dir = Dir;

    if (dir == 'left') {
      player.dir = 'left';
      if (player.vy < -7 && player.vy > -15) player.dir = 'left_land';
    } else if (dir == 'right') {
      player.dir = 'right';
      if (player.vy < -7 && player.vy > -15) player.dir = 'right_land';
    }

    player.move();

    //Jump the player when it hits the base
    if (player.y + player.height > window.game.base.y && window.game.base.y < window.config.height)
      player.jump();

    //Gameover if it hits the bottom
    if (
      window.game.base.y > window.config.height &&
      player.y + player.height > window.config.height &&
      player.isDead != 'lol'
    )
      player.isDead = true;

    //Make the player move through walls
    if (player.x > window.config.width) player.x = 0 - player.width;
    else if (player.x < 0 - player.width) player.x = window.config.width;

    //Movement of player affected by gravity
    if (player.y >= window.config.height / 2 - player.height / 2) {
      player.y += player.vy;
      player.vy += window.config.gravity;
    }

    //When the player reaches half height, move the platforms to create the illusion of scrolling and recreate the platforms that are out of viewport...
    else {
      platforms.forEach(function (p, i) {
        if (player.vy < 0) {
          p.y -= player.vy;
        }

        if (p.y > window.config.height) {
          platforms[i] = new Platform();
          platforms[i].y = p.y - window.config.height;
        }
      });

      window.game.base.y -= player.vy;
      player.vy += window.config.gravity;

      if (player.vy >= 0) {
        player.y += player.vy;
        player.vy += window.config.gravity;
      }

      window.game.score++;
    }

    //Make the player jump when it collides with platforms
    collides();

    if (player.isDead === true) gameOver();
  }

  //Platform's horizontal movement (and falling) algo

  function platformCalc() {
    const subs = window.game.platform_broken_substitute;
    const platforms = window.game.platforms;

    platforms.forEach(function (p, i) {
      if (p.type == 2) {
        if (p.x < 0 || p.x + p.width > window.config.width) p.vx *= -1;

        p.x += p.vx;
      }

      if (p.flag == 1 && subs.appearance === false && jumpCount === 0) {
        subs.x = p.x;
        subs.y = p.y;
        subs.appearance = true;

        jumpCount++;
      }

      p.draw();
    });

    if (subs.appearance === true) {
      subs.draw();
      subs.y += 8;
    }

    if (subs.y > window.config.height) subs.appearance = false;
  }

  function collides() {
    const player = window.game.player;
    const platforms = window.game.platforms;

    //Platforms
    platforms.forEach(function (p, i) {
      if (
        player.vy > 0 &&
        p.state === 0 &&
        player.x + 15 < p.x + p.width &&
        player.x + player.width - 15 > p.x &&
        player.y + player.height > p.y &&
        player.y + player.height < p.y + p.height
      ) {
        if (p.type === 3 && p.flag === 0) {
          p.flag = 1;
          jumpCount = 0;
          return;
        } else if (p.type === 4 && p.state === 0) {
          player.jump();
          p.state = 1;
        } else if (p.flag === 1) return;
        else {
          player.jump();
        }
      }
    });

    //Springs
    const s = window.game.spring;
    if (
      player.vy > 0 &&
      s.state === 0 &&
      player.x + 15 < s.x + s.width &&
      player.x + player.width - 15 > s.x &&
      player.y + player.height > s.y &&
      player.y + player.height < s.y + s.height
    ) {
      s.state = 1;
      player.jumpHigh();
    }
  }

  function updateScore() {
    var scoreText = document.getElementById('score');
    scoreText.innerHTML = window.game.score;
  }

  function gameOver() {
    const player = window.game.player;
    const platforms = window.game.platforms;

    platforms.forEach(function (p, i) {
      p.y -= 12;
    });

    if (player.y > window.config.height / 2 && flag === 0) {
      player.y -= 8;
      player.vy = 0;
    } else if (player.y < window.config.height / 2) flag = 1;
    else if (player.y + player.height > window.config.height) {
      showGameOverMenu();
      hideScoreBoard();
      player.isDead = 'lol';

      // pf end of game here...
    }
  }

  //Function to update everything

  function update() {
    paintCanvas();
    platformCalc();

    window.game.spring.addToPlatform(window.game.platforms[0]);

    playerCalc();
    window.game.player.draw();

    window.game.base.draw();

    updateScore();
  }

  menuLoop = function () {
    return;
  };
  animloop = function () {
    update();
    requestAnimFrame(animloop);
  };

  animloop();

  hideMenu();
  showScoreBoard();
};

window.resetGame = function () {
  hideGameOverMenu();
  showScoreBoard();

  flag = 0;

  const game = window.game;
  game.position = 0;
  game.score = 0;

  game.base = new Base();
  game.player = new Player();
  game.spring = new Spring();
  game.platform_broken_substitute = new BrokenPlatformSubstitute();

  game.platforms = [];
  for (let i = 0; i < window.config.platformCount; i++) {
    game.platforms.push(new Platform());
  }

  addKeyboardControls()
};

function playerJump() {
  const player = window.game.player;

  if (bTouch) dir = Dir;

  player.y += player.vy;
  player.vy += window.config.gravity;

  if (
    player.vy > 0 &&
    player.x + 15 < 260 &&
    player.x + player.width - 15 > 155 &&
    player.y + player.height > 475 &&
    player.y + player.height < 500
  )
    player.jump();

  if (dir == 'left') {
    player.dir = 'left';
    if (player.vy < -7 && player.vy > -15) player.dir = 'left_land';
  } else if (dir == 'right') {
    player.dir = 'right';
    if (player.vy < -7 && player.vy > -15) player.dir = 'right_land';
  }

  player.move();

  //Jump the player when it hits the base
  if (player.y + player.height > window.game.base.y && window.game.base.y < window.config.height)
    player.jump();

  //Make the player move through walls
  if (player.x > window.config.width) player.x = 0 - player.width;
  else if (player.x < 0 - player.width) player.x = window.config.width;

  player.draw();
}

function update() {
  window.game.board.clearRect(0, 0, window.config.width, window.config.height);
  playerJump();
}

init();

menuLoop = function () {
  update();
  requestAnimFrame(menuLoop);
};

mobile('keys');
menuLoop();
