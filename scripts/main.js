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
	
	const btncat = document.getElementById("catButton");
    const newLetter = getRandomLetter();
    if (newLetter === 'fin') {
        letterBox.textContent = 'Fin';
        generateButton.disabled = true;
    } else {
		btncat.style.display = 'none';
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
// Array con 100 categorías
const categories = [
    "Frutas", "Animales", "Colores", "Ciudades", "Países", "Deportes", "Comidas", "Películas", "Música", "Profesiones", 
    "Flores", "Instrumentos", "Ropa", "Tecnología", "Marcas", "Nombres", "Personajes históricos", "Lugares turísticos", 
    "Minerales", "Libros", "Vehículos", "Planetas", "Idiomas", "Partes del cuerpo", "Herramientas", "Juguetes", "Electrodomésticos", 
    "Bebidas", "Días festivos", "Científicos", "Obras de arte", "Géneros musicales", "Superhéroes", "Villanos", "Instrumentos musicales",
    "Monedas", "Monumentos", "Ríos", "Montañas", "Desiertos", "Playas", "Especies en peligro", "Series de TV", "Videojuegos",
    "Aplicaciones móviles", "Software", "Insectos", "Aves", "Reptiles", "Mamíferos", "Reyes", "Películas de acción", "Películas de terror", 
    "Películas de comedia", "Directores de cine", "Actores", "Actrices", "Coches", "Motos", "Aviones", "Frutas exóticas", "Verduras", 
    "Legumbres", "Minerales", "Metales", "Géneros literarios", "Festivales", "Museos", "Arquitectos", "Pintores", "Escultores",
    "Obras arquitectónicas", "Inventos", "Continentes", "Océanos", "Personajes de ficción", "Artistas", "Compositores", "Poetas",
    "Cuentos infantiles", "Mitos y leyendas", "Animales mitológicos", "Dioses", "Monstruos", "Géneros de videojuegos", "Canciones famosas",
    "Bailes", "Juegos de mesa", "Plantas", "Frutas tropicales", "Mares", "Islas", "Cómics", "Deportistas", "Estadios", "Equipos deportivos",
    "Estilos de baile", "Obras de teatro", "Célebres batallas", "Expresiones artísticas", "Movimientos culturales"
];

// Limitar la cantidad de categorías seleccionadas
const maxSelection = 10;
let remainingCategories = [...categories]; // Copia del array original

// Crear el listado de categorías como checkbox dinámicamente
const categoryList = document.getElementById('categoryList');
categories.forEach(category => {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = category;
    checkbox.id = category;
    checkbox.name = 'categories';

    const label = document.createElement('label');
    label.htmlFor = category;
    label.textContent = category;

    const div = document.createElement('div');
    div.appendChild(checkbox);
    div.appendChild(label);

    categoryList.appendChild(div);
});

// Manejar la selección de categorías y limitar a 10
document.querySelectorAll('input[name="categories"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const selected = document.querySelectorAll('input[name="categories"]:checked');
        if (selected.length > maxSelection) {
            this.checked = false;
            alert(`No puedes seleccionar más de ${maxSelection} categorías`);
        }
    });
});

// Mostrar las categorías seleccionadas y comenzar el juego
document.getElementById('startButton').addEventListener('click', function() {
    const selectedCategories = [];
    document.querySelectorAll('input[name="categories"]:checked').forEach(checkbox => {
        selectedCategories.push(checkbox.value);
    });

    // Mostrar las categorías seleccionadas en la pantalla
    const selectedCategoriesDiv = document.getElementById('selectedCategories');
    if (selectedCategories.length === 0) {
        selectedCategoriesDiv.innerHTML = "<h2>No has seleccionado ninguna categoría</h2>";
    } else {
        selectedCategoriesDiv.innerHTML = `<h2>Categorías seleccionadas:</h2><ul>` + 
                                           selectedCategories.map(cat => `<li>${cat}</li>`).join('') + 
                                           `</ul>`;
    }
});

// Función para elegir una categoría aleatoria sin repetir
document.getElementById('randomCategoryButton').addEventListener('click', function() {
    if (remainingCategories.length > 0) {
        // Elegir una categoría aleatoria
        const randomIndex = Math.floor(Math.random() * remainingCategories.length);
        const randomCategory = remainingCategories[randomIndex];
        
        // Mostrar la categoría en la pantalla
        const randomCategoryDisplay = document.getElementById('randomCategoryDisplay');
        randomCategoryDisplay.innerHTML = `<h2>Categoría Aleatoria:</h2><p>${randomCategory}</p>`;
        
        // Eliminar la categoría elegida del array de categorías restantes
        remainingCategories.splice(randomIndex, 1);
    } else {
        alert("Ya no quedan más categorías para elegir.");
    }
});

// Obtener elementos
const catmodal = document.getElementById("catmodal");
const openModalButton = document.getElementById("catButton");
const closeModalButton = document.getElementById("catclose-button");

// Función para abrir el modal
openModalButton.addEventListener('click', function() {
    catmodal.style.display = "block"; // Mostrar el modal
});

// Función para cerrar el modal
closeModalButton.addEventListener('click', function() {
    catmodal.style.display = "none"; // Ocultar el modal
});

// Cerrar el modal si se hace clic fuera de él
window.addEventListener('click', function(event) {
    if (event.target === catmodal) {
        catmodal.style.display = "none"; // Ocultar el modal si se hace clic fuera
    }
});







