const CARD_BACK = "&#127136;";

const ALL_CARDS = [
  "&#127137;", "&#127138;", "&#127139;", "&#127140;", "&#127141;",
  "&#127142;", "&#127143;", "&#127144;", "&#127145;", "&#127146;",
  "&#127147;", "&#127148;", "&#127149;", "&#127150;", "&#127153;",
  "&#127154;", "&#127155;", "&#127156;", "&#127157;", "&#127158;"
];

const grid = document.getElementById("cardGrid");
const movesEl = document.getElementById("moves");
const timeEl = document.getElementById("time");
const statusEl = document.getElementById("status");
const restartBtn = document.getElementById("restart");

let deck = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;

let moves = 0;
let matched = 0;

let seconds = 0;
let timer = null;
let timerStarted = false;

function randIndex(max) {
  return Math.floor(Math.random() * (max + 1));
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = randIndex(i);
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startTimer() {
  if (timerStarted) return;
  timerStarted = true;

  timer = setInterval(() => {
    seconds++;
    timeEl.textContent = seconds;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

function buildDeck() {
  const pool = [...ALL_CARDS];
  const chosen = [];

  for (let i = 0; i < 8; i++) {
    const r = randIndex(pool.length - 1);
    chosen.push(pool[r]);
    pool.splice(r, 1);
  }

  deck = chosen.concat(chosen);
  shuffle(deck);
}

function renderBoard() {
  grid.innerHTML = "";

  deck.forEach((value, index) => {
    const card = document.createElement("div");
    card.innerHTML = CARD_BACK;
    card.dataset.value = value;
    card.dataset.index = index;

    card.addEventListener("click", () => handleClick(card));
    grid.appendChild(card);
  });
}

function handleClick(card) {
  if (lockBoard) return;
  if (card.classList.contains("matched")) return;
  if (card === firstCard) return;

  startTimer();

  card.classList.add("flipped");
  card.innerHTML = card.dataset.value;

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  moves++;
  movesEl.textContent = moves;

  if (firstCard.dataset.value === secondCard.dataset.value) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    matched += 2;
    firstCard = null;
    secondCard = null;

    if (matched === 16) {
      stopTimer();
      statusEl.textContent =
        `You won in ${moves} moves and ${seconds} seconds!`;
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard.innerHTML = CARD_BACK;
      secondCard.innerHTML = CARD_BACK;

      firstCard = null;
      secondCard = null;
      lockBoard = false;
    }, 700);
  }
}

function restartGame() {
  stopTimer();
  timerStarted = false;
  seconds = 0;
  timeEl.textContent = 0;

  moves = 0;
  matched = 0;
  movesEl.textContent = 0;
  statusEl.textContent = "";

  firstCard = null;
  secondCard = null;
  lockBoard = false;

  buildDeck();
  renderBoard();
}

restartBtn.addEventListener("click", restartGame);

restartGame();
