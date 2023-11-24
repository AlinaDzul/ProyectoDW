const emojis = ['🐱', '🎀', '🌸', '🍭', '🍬', '🐾', '🌈', '💖'];

const gameBoard = document.getElementById('game-board');
let firstCard = null;
let secondCard = null;
let gameStarted = false;
let timer;
let seconds = 0;
const maxSeconds = 60;
let gameWon = false;
let gameLost = false;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let shuffledEmojis = shuffle([...emojis, ...emojis]);

function createCard(index) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.textContent = '?';
    card.dataset.index = index;
    card.addEventListener('click', flipCard);
    return card;
}

function setupGame() {
    shuffledEmojis = shuffle([...emojis, ...emojis]); // Mover aquí la asignación para volver a barajar las cartas
    shuffledEmojis.forEach((emoji, index) => {
        const card = createCard(index);
        gameBoard.appendChild(card);
    });
}

function flipCard() {
    if (gameStarted && !gameWon && !gameLost) {
        if (!firstCard) {
            firstCard = this;
            firstCard.textContent = shuffledEmojis[firstCard.dataset.index];
            firstCard.classList.add('flipped');
        } else if (this !== firstCard) {
            secondCard = this;
            secondCard.textContent = shuffledEmojis[secondCard.dataset.index];
            secondCard.classList.add('flipped');

            setTimeout(checkForMatch, 500);
        }
    }
}


function checkForMatch() {
    const isMatch = firstCard.textContent === secondCard.textContent;

    if (isMatch) {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
    } else {
        firstCard.classList.remove('flipped');
        secondCard.classList.remove('flipped');
        firstCard.textContent = '?';
        secondCard.textContent = '?';
    }

    firstCard = null;
    secondCard = null;

    checkForWin();
}

function checkForWin() {
    const allCards = document.querySelectorAll('.card');
    const allFlipped = Array.from(allCards).every(card => card.classList.contains('flipped'));

    if (allFlipped) {
        if (seconds < maxSeconds) {
            document.getElementById('hello-kitty-win').style.display = 'block';
            document.getElementById('container').classList.add('animate-background');
            document.getElementById('container').classList.add('animate-title');
            pauseTimer();
            gameWon = true;
        } else {
            endGameDueToTimeout();
        }
    }
}

function endGameDueToTimeout() {
    if (!gameWon) {
        document.getElementById('time-out-message').style.display = 'block';
        document.getElementById('hello-kitty-lose').style.display = 'block';
        document.getElementById('container').classList.add('animate-background');
        pauseTimer();
        gameLost = true;
    }
    gameStarted = false;
}

function resetGame() {
    gameBoard.innerHTML = ''; // Limpiar el tablero antes de agregar nuevas cartas
    setupGame(); // Volver a configurar el juego
    document.getElementById('hello-kitty-win').style.display = 'none';
    document.getElementById('hello-kitty-lose').style.display = 'none';
    document.getElementById('time-out-message').style.display = 'none';
    document.getElementById('container').classList.remove('animate-background');
    document.getElementById('container').classList.remove('animate-title');
    firstCard = null;
    secondCard = null;
    gameStarted = false;
    gameWon = false;
    gameLost = false;
    resetTimer();
}

function startGame() {
    resetGame();
    startTimer();
    gameStarted = true;
    setTimeout(endGameDueToTimeout, maxSeconds * 1000);
}

function pauseGame() {
    pauseTimer();
}

function startTimer() {
    timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    seconds++;

    if (seconds <= maxSeconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
        document.getElementById('timer-container').textContent = formattedTime;
    } else {
        endGameDueToTimeout();
    }
}

function pauseTimer() {
    clearInterval(timer);
}

function resetTimer() {
    clearInterval(timer);
    seconds = 0;
    document.getElementById('timer-container').textContent = '00:00';
}

setupGame(); // Llamada inicial para configurar el juego
resetGame(); // Llamada al reiniciar el juego y el cronómetro
