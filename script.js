// Rock Paper Scissors game logic wired to the UI

const CHOICES = ['rock', 'paper', 'scissors'];
const EMOJI = {
  rock: '✊',
  paper: '✋',
  scissors: '✌️',
};

const BEATS = {
  rock: 'scissors',
  paper: 'rock',
  scissors: 'paper',
};

const playerScoreEl = document.getElementById('player-score');
const computerScoreEl = document.getElementById('computer-score');
const playerPickEl = document.getElementById('player-pick');
const computerPickEl = document.getElementById('computer-pick');
const resultMessageEl = document.getElementById('result-message');
const resetBtn = document.getElementById('reset-btn');
const choiceButtons = document.querySelectorAll('.choice-btn');

let playerScore = 0;
let computerScore = 0;

function getComputerChoice() {
  const index = Math.floor(Math.random() * CHOICES.length);
  return CHOICES[index];
}

function getRoundResult(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    return 'tie';
  }
  if (BEATS[playerChoice] === computerChoice) {
    return 'win';
  }
  return 'lose';
}

function updateScoreboard() {
  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;
}

function playRound(playerChoice) {
  const computerChoice = getComputerChoice();
  const result = getRoundResult(playerChoice, computerChoice);

  playerPickEl.textContent = EMOJI[playerChoice];
  computerPickEl.textContent = EMOJI[computerChoice];

  if (result === 'win') {
    playerScore += 1;
    resultMessageEl.textContent = `You win! ${capitalize(playerChoice)} beats ${computerChoice}.`;
  } else if (result === 'lose') {
    computerScore += 1;
    resultMessageEl.textContent = `You lose! ${capitalize(computerChoice)} beats ${playerChoice}.`;
  } else {
    resultMessageEl.textContent = `It's a tie! You both picked ${playerChoice}.`;
  }

  updateScoreboard();
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function resetGame() {
  playerScore = 0;
  computerScore = 0;
  updateScoreboard();
  playerPickEl.textContent = '❔';
  computerPickEl.textContent = '❔';
  resultMessageEl.textContent = 'Make your move!';
}

choiceButtons.forEach((button) => {
  button.addEventListener('click', () => {
    playRound(button.dataset.choice);
  });
});

resetBtn.addEventListener('click', resetGame);
