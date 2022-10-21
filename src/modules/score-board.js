export const showScoreBoard = function () {
  const menu = document.getElementById('scoreBoard');
  menu.style.zIndex = '1';

  if (
    navigator.userAgent.toLowerCase().indexOf('firefox') !== -1 &&
    navigator.userAgent.toLowerCase().indexOf('android') !== -1
  ) {
    menu.style.display = 'block';
  }
};

export const hideScoreBoard = function () {
  const menu = document.getElementById('scoreBoard');
  menu.style.zIndex = '-1';

  if (
    navigator.userAgent.toLowerCase().indexOf('firefox') !== -1 &&
    navigator.userAgent.toLowerCase().indexOf('android') !== -1
  ) {
    menu.style.display = 'none';
  }
};

export const updateScore = function (score) {
  const scoreText = document.getElementById('score');
  scoreText.innerHTML = score;
};
