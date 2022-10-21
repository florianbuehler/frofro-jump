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

export const showGameOverMenu = function () {
  const menu = document.getElementById('gameOverMenu');
  menu.style.zIndex = '1';
  menu.style.visibility = 'visible';

  if (
    navigator.userAgent.toLowerCase().indexOf('firefox') !== -1 &&
    navigator.userAgent.toLowerCase().indexOf('android') !== -1
  ) {
    menu.style.display = 'block';
  }

  const scoreText = document.getElementById('go_score');
  scoreText.innerHTML = 'You scored ' + window.game.score + ' points!';
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
