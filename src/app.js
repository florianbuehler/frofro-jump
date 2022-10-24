import Base from './modules/base.js';
import { hideGameOverMenu, hideMainMenu, showGameOverMenu } from './modules/menus.js';
import Platform, { BrokenPlatformSubstitute } from './modules/platform.js';
import Player from './modules/player.js';
import { hideScoreBoard, showScoreBoard, updateScore } from './modules/score-board.js';
import Spring from './modules/spring.js';

/////
/////  TODO refactor
/////
const ua = navigator.userAgent;
const bTouch = !(
  ua.indexOf('(iP') === -1 &&
  ua.indexOf('Android') === -1 &&
  ua.indexOf('BlackBerry') === -1 &&
  ua.indexOf('HTC') === -1 &&
  ua.indexOf('PlayBook') === -1 &&
  ua.indexOf('webOS') === -1 &&
  ua.indexOf('Silk') === -1
);
var bT = 0; // emulate keys pressed
var bTlast = 0;

console.log(ua);

function mobile(id) {
  // TODO: pass keys as arrays (as could change)
  const o = document.getElementById(id);
  if (o) {
    // if (bTouch) {
    //   o.innerHTML =
    //     "<p><div style='border:1px solid red;width:60px;float:left;margin-left:60px;font-size:xx-large;-webkit-user-select:none;' ontouchend='Dir = \"left\";player.isMovingLeft = false;' ontouchstart='Dir = \"left\";player.isMovingLeft = true;' >&larr;</div> <div style='border:1px solid red;width:60px;float:right;margin-right:60px;font-size:xx-large;-webkit-user-select:none;' ontouchend='Dir = \"right\";player.isMovingRight = false;' ontouchstart='Dir = \"right\";player.isMovingRight = true;' >&rarr;</div></p>";
    //
    //   document.body.addEventListener('touchmove', function (event) {
    //     event.preventDefault();
    //   });
    //   setTimeout(function () {
    //     window.scrollTo(0, 1);
    //   }, 1);
    // }
  }
}

mobile('keys');

////
////
////

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

const addKeyboardControls = function (player) {
  document.onkeydown = function (e) {
    const key = e.key;

    if (key === 'ArrowLeft') {
      player.dir = 'left';
      player.isMovingLeft = true;
    } else if (key === 'ArrowRight') {
      player.dir = 'right';
      player.isMovingRight = true;
    }

    if (key === ' ') {
      !window.game.hasPlayedBefore ? startGame() : restartGame();
    }
  };

  document.onkeyup = function (e) {
    const key = e.key;

    if (key === 'ArrowLeft') {
      player.dir = 'left';
      player.isMovingLeft = false;
    } else if (key === 'ArrowRight') {
      player.dir = 'right';
      player.isMovingRight = false;
    }
  };
};

//
// menu loop specific functions
//

const menuLoop = function () {
  if (!window.game.isInGame) {
    const game = window.game;

    game.board.clearRect(0, 0, window.config.width, window.config.height);
    game.base.draw();

    determineNewPlayerPositionForMenu();
    game.player.draw();

    requestAnimFrame(menuLoop);
  }
};

const determineNewPlayerPositionForMenu = () => {
  const player = window.game.player;

  if (bTouch) player.dir = 'left';

  player.y += player.vy;
  player.vy += window.config.gravity;

  player.move();

  // let the player jump when he hits the platform (button)
  if (
    player.vy > 0 &&
    player.x + 15 < 260 &&
    player.x + player.width - 15 > 155 &&
    player.y + player.height > 475 &&
    player.y + player.height < 500
  ) {
    player.jump();
  }

  // let the player jump when he hits the base
  if (player.y + player.height > window.game.base.y && window.game.base.y < window.config.height) {
    player.jump();
  }

  // let the player move through walls
  if (player.x > window.config.width) player.x = 0 - player.width;
  else if (player.x < 0 - player.width) player.x = window.config.width;
};

//
// game loop specific functions
//

const gameLoop = function () {
  if (window.game.isInGame) {
    const game = window.game;

    game.board.clearRect(0, 0, window.config.width, window.config.height);
    game.base.draw();

    determinePlatformPosition();
    game.platforms.forEach(function (p) {
      p.draw();
    });

    game.spring.addToPlatform(game.platforms[0]);

    determinePlayerPosition();
    game.player.draw();

    updateScore(game.score);

    requestAnimFrame(gameLoop);
  } else {
    // if the player is not in the game anymore we need to reset the player, position and base for the menu loop
    window.game.player.reset();
    window.game.position = 0;
    window.game.base.reset();

    menuLoop();
  }
};

const determinePlatformPosition = () => {
  const game = window.game;
  const subs = game.platform_broken_substitute;
  const platforms = game.platforms;

  platforms.forEach(function (p) {
    if (p.type === 2) {
      if (p.x < 0 || p.x + p.width > window.config.width) p.vx *= -1;

      p.x += p.vx;
    }

    if (p.flag === 1 && subs.appearance === false && game.jumpCount === 0) {
      subs.x = p.x;
      subs.y = p.y;
      subs.appearance = true;

      game.jumpCount++;
    }
  });

  if (subs.appearance === true) {
    subs.draw();
    subs.y += 8;
  }

  if (subs.y > window.config.height) subs.appearance = false;
};

const determinePlayerPosition = () => {
  const player = window.game.player;
  const base = window.game.base;
  const platforms = window.game.platforms;

  if (bTouch) player.dir = 'left';

  player.move();

  // jump the player when he hits the base
  if (player.y + player.height > base.y && base.y < window.config.height) {
    player.jump();
  }

  // game over if the player hits the bottom
  if (
    base.y > window.config.height &&
    player.y + player.height > window.config.height &&
    player.isDead !== 'lol'
  ) {
    player.isDead = true;
  }

  // make the player move through walls
  if (player.x > window.config.width) player.x = 0 - player.width;
  else if (player.x < 0 - player.width) player.x = window.config.width;

  // movement of player affected by gravity
  if (player.y >= window.config.height / 2 - player.height / 2) {
    player.y += player.vy;
    player.vy += window.config.gravity;
  }

  // when the player reaches half height, move the platforms to create the illusion of scrolling
  // and recreate the platforms that are out of viewport...
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

    base.y -= player.vy;
    player.vy += window.config.gravity;

    if (player.vy >= 0) {
      player.y += player.vy;
      player.vy += window.config.gravity;
    }

    window.game.score++;
  }

  // make the player jump when he collides with platforms
  jumpPlayerWhenHittingAPlatform();

  if (player.isDead === true) {
    gameOver();
  }
};

const jumpPlayerWhenHittingAPlatform = () => {
  const player = window.game.player;
  const platforms = window.game.platforms;
  const spring = window.game.spring;

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
        game.jumpCount = 0;
        return;
      } else if (p.type === 4 && p.state === 0) {
        player.jump();
        p.state = 1;
      } else if (p.flag === 1) {
        return;
      } else {
        player.jump();
      }
    }
  });

  if (
    player.vy > 0 &&
    spring.state === 0 &&
    player.x + 15 < spring.x + spring.width &&
    player.x + player.width - 15 > spring.x &&
    player.y + player.height > spring.y &&
    player.y + player.height < spring.y + spring.height
  ) {
    spring.state = 1;
    player.jumpHigh();
  }
};

const gameOver = () => {
  const player = window.game.player;
  const platforms = window.game.platforms;

  platforms.forEach(function (p, i) {
    p.y -= 12;
  });

  if (player.y > window.config.height / 2 && window.game.flag === 0) {
    player.y -= 8;
    player.vy = 0;
  } else if (player.y < window.config.height / 2) {
    window.game.flag = 1;
  } else if (player.y > window.config.height) {
    showGameOverMenu();
    hideScoreBoard();
    player.isDead = 'lol';
    window.game.isInGame = false;
  }
};

const initNewRound = function () {
  window.game.isInGame = true;

  // we need to add some state for the current game
  const game = window.game;
  game.spring = new Spring();
  game.platforms = [];
  game.platform_broken_substitute = new BrokenPlatformSubstitute();
  game.broken = 0;
  game.score = 0;
  game.flag = 0;
  game.jumpCount = 0;

  for (let i = 0; i < window.config.platformCount; i++) {
    game.platforms.push(new Platform());
  }
};

const initGame = function () {
  let isMobile = window.matchMedia('only screen and (max-width: 760px)').matches;

  console.log('isMobile:', isMobile);

  // we add the config to the window object, so we can access it from everywhere
  window.config = {
    width: document.getElementById('game').offsetWidth,
    height: 552,
    gravity: 0.2,
    platformCount: 10,
    sprites: document.getElementById('sprites')
  };

  const canvas = document.getElementById('canvas');
  canvas.width = window.config.width;
  canvas.height = window.config.height;

  // we add the initial game state to the window object, so we can access and update it from everywhere
  window.game = {
    isInGame: false,
    hasPlayedBefore: false,
    board: canvas.getContext('2d'),
    base: new Base(),
    player: new Player(),
    position: 0
  };

  addKeyboardControls(window.game.player);

  menuLoop();
};

window.startGame = function () {
  window.game.hasPlayedBefore = true;
  initNewRound();

  hideMainMenu();
  showScoreBoard();

  gameLoop();
};

window.restartGame = function () {
  initNewRound();

  hideGameOverMenu();
  showScoreBoard();

  gameLoop();
};

initGame();
