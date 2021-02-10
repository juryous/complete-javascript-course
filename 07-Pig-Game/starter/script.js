'use strict';

const diceDOM = document.querySelector('.dice');
const allScores = document.querySelectorAll('.score, .current-score');
const player0DOM = document.querySelector('.player--0');
const player1DOM = document.querySelector('.player--1');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');

let activePlayer, currentScore, scores, playing;

init();

btnRoll.addEventListener('click', () => {
  if (playing) {
    // Generate a random dice roll
    let dice = Math.trunc(Math.random() * 6) + 1;

    // Display the dice
    diceDOM.classList.remove('hidden');
    diceDOM.src = `dice-${dice}.png`;
    // Check if rolled 1
    if (dice !== 1) {
      // Add dice to current score
      currentScore += dice;
      document.getElementById(
        `current--${activePlayer}`
      ).textContent = currentScore;
    } else {
      // Switch player
      switchPlayer();
    }
  }
});

btnHold.addEventListener('click', () => {
  if (playing) {
    // Add current score to active player's total score
    scores[activePlayer] += currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer];
    // Check if current score is less than 100
    if (scores[activePlayer] >= 100) {
      // Game over
      playing = false;
      diceDOM.classList.add('hidden');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');
    } else {
      // Switch player
      switchPlayer();
    }
  }
});

btnNew.addEventListener('click', init);

function init() {
  activePlayer = 0;
  currentScore = 0;
  scores = [0, 0];
  playing = true;

  diceDOM.classList.add('hidden');
  player0DOM.classList.add('player--active');
  player1DOM.classList.remove('player--active');
  player0DOM.classList.remove('player--winner');
  player1DOM.classList.remove('player--winner');
  allScores.forEach(score => (score.textContent = 0));
}

function switchPlayer() {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0DOM.classList.toggle('player--active');
  player1DOM.classList.toggle('player--active');
}
