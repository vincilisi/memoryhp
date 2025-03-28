const symbols = ['⚡', '🦉', '🪄', '🏰', '🧙‍♂️', '🐉', '🎩', '🕯️', '🐍', '📜', '☠️', '🗝️', '🦅', '🧙‍♀️', '🌟'];
const memoryGrid = document.getElementById('memoryGrid');
const timerElement = document.getElementById('timer');
const movesElement = document.getElementById('moves');
const endMessage = document.getElementById('endMessage');

let firstCard = null;
let secondCard = null;
let lockGrid = false;
let timer;
let timeRemaining;
let movesRemaining;

function adjustCardSize(cardCount) {
    const memoryGrid = document.getElementById('memoryGrid');
    const viewportWidth = window.innerWidth; // Larghezza della finestra
    const viewportHeight = window.innerHeight; // Altezza della finestra

    const cols = Math.min(Math.floor(viewportWidth / 200), cardCount); // Colonne massime
    const rows = Math.ceil(cardCount / cols); // Righe necessarie

    // Calcola dimensioni ottimali delle carte
    const cardWidth = viewportWidth / cols - 5; // Larghezza della carta
    const cardHeight = viewportHeight / rows - 5; // Altezza della carta

    document.querySelectorAll('.card').forEach(card => {
        card.style.width = `${cardWidth}px`;
        card.style.height = `${cardHeight}px`;
    });
    document.querySelectorAll('.card').forEach(card => {
        card.style.width = "100px";
        card.style.height = "100px";
    });
    
    // Adatta la griglia dinamicamente
    memoryGrid.style.gridTemplateColumns = `repeat(${cols}, ${cardWidth}px)`;
}

function startGame(cardCount, maxTime, maxMoves) {
    memoryGrid.innerHTML = ""; // Resetta la griglia
    endMessage.style.display = "none"; // Nascondi messaggi di fine
    clearInterval(timer); // Ferma timer

    timeRemaining = maxTime;
    movesRemaining = maxMoves;

    timerElement.innerText = `Tempo: ${formatTime(timeRemaining)}`;
    movesElement.innerText = `Mosse Rimanenti: ${movesRemaining}`;

    startTimer();

    const selectedSymbols = symbols.slice(0, cardCount / 2);
    const cards = [...selectedSymbols, ...selectedSymbols].sort(() => Math.random() - 0.5);

    cards.forEach(content => createCard(content)); // Genera tutte le carte

    adjustCardSize(cardCount); // Adatta dimensione e layout
}
window.addEventListener('resize', () => {
    adjustCardSize(document.querySelectorAll('.card').length); // Ridimensiona le carte
});

function startTimer() {
    timer = setInterval(() => {
        timeRemaining--;
        timerElement.innerText = `Tempo: ${formatTime(timeRemaining)}`;
        if (timeRemaining <= 0) {
            clearInterval(timer);
            showEndMessage("Tempo Scaduto! Ritenta! 😔", false);
        }
    }, 1000);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' + minutes : minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
}

function createCard(content) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card');
    cardDiv.dataset.content = content;
    cardDiv.innerText = '?';

    console.log(`Creato card con contenuto: ${content}`); // Verifica generazione carta

    cardDiv.addEventListener('click', () => {
        if (lockGrid || cardDiv.classList.contains('flipped')) return;

        cardDiv.classList.add('flipped');
        cardDiv.innerText = content;

        if (!firstCard) {
            firstCard = cardDiv;
        } else {
            secondCard = cardDiv;
            checkMatch();
        }
    });

    memoryGrid.appendChild(cardDiv);
}
function checkMatch() {
    if (firstCard.dataset.content === secondCard.dataset.content) {
        // Coppia corretta: mantieni visibili
        resetTurn(true);

        const allFlipped = document.querySelectorAll('.card.flipped').length;
        if (allFlipped === document.querySelectorAll('.card').length) {
            clearInterval(timer);
            showEndMessage("Ben Fatto! 🎉", true);
        }
    } else {
        // Coppia sbagliata: riduci mosse
        lockGrid = true;
        movesRemaining--;
        movesElement.innerText = `Mosse Rimanenti: ${movesRemaining}`;

        if (movesRemaining < 0) {
            clearInterval(timer);
            showEndMessage("Hai Superato il Limite di Mosse! 😔", false);
        }

        setTimeout(() => {
            firstCard.classList.remove('flipped');
            firstCard.innerText = '?';
            secondCard.classList.remove('flipped');
            secondCard.innerText = '?';
            resetTurn(false);
        }, 1000);
    }
}

function resetTurn(match) {
    if (match) {
        // Disabilita carte corrette
        firstCard.style.pointerEvents = 'none';
        secondCard.style.pointerEvents = 'none';
    }
    firstCard = null;
    secondCard = null;
    lockGrid = false;
}

function showEndMessage(message, success) {
    endMessage.style.display = "block";
    endMessage.innerText = message;

    if (success) {
        playCelebration();
    } else {
        playFailureSong();
    }
}

function playCelebration() {
    const audio = new Audio("media/vittoria.mp3");
    audio.play();
}

function playFailureSong() {
    const audio = new Audio("media/sconfitta.mp3");
    audio.play();
}

console.log(`Columns: ${cols}, Rows: ${rows}`);