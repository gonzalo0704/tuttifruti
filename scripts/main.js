const letterBox = document.getElementById('letterBox');
const generateButton = document.getElementById('generateButton');
const usedLettersBox = document.getElementById('usedLettersBox');
const modal = document.getElementById('timeUpModal');
const closeModal = document.getElementById('closeModal');

const letters = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('').filter(letter => letter !== 'Ñ');
let usedLetters = [];
let timer;

function getRandomLetter() {
    if (usedLetters.length === letters.length) {
        return 'fin';
    }

    let availableLetters = letters.filter(letter => !usedLetters.includes(letter));
    let randomLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];

    usedLetters.push(randomLetter);
    return randomLetter;
}

function startTimer() {
    clearTimeout(timer);
    letterBox.style.animation = 'borderColorAnimation 180s linear';
    timer = setTimeout(() => {
        modal.style.display = 'block';
    }, 180000);
}

generateButton.addEventListener('click', () => {
    const newLetter = getRandomLetter();
    if (newLetter === 'fin') {
        letterBox.textContent = 'Fin';
        generateButton.disabled = true;
    } else {
        letterBox.textContent = newLetter;
        usedLettersBox.textContent = `Letras utilizadas: ${usedLetters.join(', ')}`;
        startTimer();
    }
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    letterBox.style.animation = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        letterBox.style.animation = 'none';
    }
});
