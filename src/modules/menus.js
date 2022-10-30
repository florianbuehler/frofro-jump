export const hideMainMenu = function () {
  const menu = document.getElementById('mainMenu');
  menu.style.zIndex = '-1';

  if (
    navigator.userAgent.toLowerCase().indexOf('firefox') !== -1 &&
    navigator.userAgent.toLowerCase().indexOf('android') !== -1
  ) {
    menu.style.display = 'none';
  }
};

export const showGameOverMenu = function (gameScore) {
  const menu = document.getElementById('gameOverMenu');
  menu.style.zIndex = '1';
  menu.style.visibility = 'visible';

  if (
    navigator.userAgent.toLowerCase().indexOf('firefox') !== -1 &&
    navigator.userAgent.toLowerCase().indexOf('android') !== -1
  ) {
    menu.style.display = 'block';
  }

  const gameScoreEl = document.getElementById('gameScore');
  gameScoreEl.innerText = gameScore;

  let highScore = localStorage.getItem('highScore');
  if (highScore <= gameScore) {
    highScore = gameScore;
    localStorage.setItem('highScore', highScore);
  }

  const highScoreEl = document.getElementById('highScore');
  highScoreEl.innerText = highScore;
};

export const hideGameOverMenu = function () {
  const menu = document.getElementById('gameOverMenu');
  menu.style.zIndex = '-1';
  menu.style.visibility = 'hidden';

  if (
    navigator.userAgent.toLowerCase().indexOf('firefox') !== -1 &&
    navigator.userAgent.toLowerCase().indexOf('android') !== -1
  ) {
    menu.style.display = 'none';
  }
};
