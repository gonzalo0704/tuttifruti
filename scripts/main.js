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
		var sound = document.getElementById("my-sound");
		sound.play();
        return 'fin';
    }

    let availableLetters = letters.filter(letter => !usedLetters.includes(letter));
    let randomLetter = availableLetters[Math.floor(Math.random() * availableLetters.length)];

    usedLetters.push(randomLetter);
    return randomLetter;
}

generateButton.addEventListener('click', () => {
	
    const newLetter = getRandomLetter();
    if (newLetter === 'fin') {
        letterBox.textContent = 'Fin';
        generateButton.disabled = true;
    } else {
        letterBox.textContent = newLetter;
        usedLettersBox.textContent = `Letras utilizadas: ${usedLetters.join(', ')}`;
        startProgressBar(120000);
		
		//120000
    }
});
 
let wakeLock = null;

async function requestWakeLock() {
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    console.log('Wake Lock activated');
  } catch (err) {
    console.error(`Failed to activate wake lock: ${err.name}, ${err.message}`);
  }
}

function releaseWakeLock() {
  if (wakeLock !== null) {
    wakeLock.release()
      .then(() => {
        wakeLock = null;
        console.log('Wake Lock released');
      })
      .catch(err => {
        console.error(`Failed to release wake lock: ${err.name}, ${err.message}`);
      });
  }
}

function startProgressBar(duration) {
  requestWakeLock();

  const progressBar = document.getElementById("progress-bar");
  const modal = document.getElementById("time-up-modal");
  const closeButton = document.getElementById("close-button");
  const startTime = Date.now();

  function updateProgressBar() {
    const elapsedTime = Date.now() - startTime;
    const percentage = (elapsedTime / duration) * 100;

    progressBar.style.width = percentage + '%';

    if (elapsedTime < duration) {
      requestAnimationFrame(updateProgressBar);
    } else {
      modal.style.display = 'block';
      progressBar.style.width = '100%';
      releaseWakeLock(); // Release the wake lock when time is up
	  var sound1 = document.getElementById("my-sound1");
		sound1.play();
    }
  }

  closeButton.onclick = function() {
    modal.style.display = 'none';
    releaseWakeLock(); // Also release the wake lock if the modal is closed early
  };

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = 'none';
      releaseWakeLock();
    }
  };

  requestAnimationFrame(updateProgressBar);
}






