'use strict';

// const message = document.querySelector('.message').textContent;
// console.log(message);
// document.querySelector('.message').textContent = 'Correct Number!';

// document.querySelector('.number').textContent = 13;
// document.querySelector('.score').textContent = 10;

// document.querySelector('.guess').value = 23;
// console.log(document.querySelector('.guess').value);

let secretNumber = Math.trunc(Math.random() * 20) + 1;
let score = 20;
let highScore = 0;

const body = document.querySelector('body');
const guessDOM = document.querySelector('.guess');
const scoreDOM = document.querySelector('.score');
const highScoreDOM = document.querySelector('.highscore');
const message = document.querySelector('.message');
const number = document.querySelector('.number');
const checkBtn = document.querySelector('.check');
const againBtn = document.querySelector('.again');

function checkNumber() {
  const guess = Number(guessDOM.value);
  // When there is no input
  if (!guess) {
    setMessage('No number!');

    // When player wins
  } else if (guess === secretNumber) {
    setMessage('Correct number!');
    number.textContent = secretNumber;
    document.querySelector('body').style.backgroundColor = '#60b347';
    number.style.width = '30rem';
    if (score > highScore) {
      highScore = score;
      highScoreDOM.textContent = highScore;
    }

    // When guess is wrong
  } else if (guess !== secretNumber) {
    if (score > 1) {
      setMessage(guess > secretNumber ? 'Too high!' : 'Too low!');
      score--;
      scoreDOM.textContent = score;
    } else {
      setMessage('Game over!');
      scoreDOM.textContent = 0;
    }
  }
}

function reset() {
  secretNumber = Math.trunc(Math.random() * 20) + 1;
  score = 20;
  scoreDOM.textContent = score;
  body.style.backgroundColor = '#222';
  number.style.width = '15rem';
  number.textContent = '?';
  guessDOM.value = '';
  setMessage('Start guessing...');
}

function setMessage(text) {
  message.textContent = text;
}

checkBtn.addEventListener('click', checkNumber);

againBtn.addEventListener('click', reset);
