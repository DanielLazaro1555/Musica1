document.addEventListener("DOMContentLoaded", function () {
  // Llamamos a la función loadJSON con la URL del archivo JSON en línea
  loadJSON(
    "https://raw.githubusercontent.com/DanielLazaro1555/Musica1/main/public/bd.json"
  );
});

var currentSongIndex = 0; // Índice de la canción actual
var allSongsData; // Variable para almacenar todos los datos de las canciones
var audioPlayer; // Variable para el reproductor de audio

// Función para cargar el JSON y mostrar la primera canción
function loadJSON(jsonPath) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          var jsonData = JSON.parse(xhr.responseText);
          allSongsData = jsonData; // Almacenar todos los datos de las canciones

          // Verificamos si jsonData es un array o un objeto
          if (Array.isArray(jsonData)) {
            // Mostramos solo la primera canción al principio
            displayCurrentSong(jsonData[currentSongIndex]);
            // Agregamos un evento al botón "Siguiente"
            var nextButton = document.getElementById("nextButton");
            nextButton.addEventListener("click", function () {
              // Incrementamos el índice de la canción actual
              currentSongIndex++;
              // Verificamos si el índice está fuera del rango
              if (currentSongIndex >= jsonData.length) {
                currentSongIndex = 0; // Volvemos al principio si llegamos al final
              }
              // Llamamos a la función para mostrar la nueva canción
              displayCurrentSong(jsonData[currentSongIndex]);
            });

            // Agregamos un evento al botón "Anterior"
            var prevButton = document.getElementById("prevButton");
            prevButton.addEventListener("click", function () {
              // Decrementamos el índice de la canción actual
              currentSongIndex--;
              // Verificamos si el índice está fuera del rango
              if (currentSongIndex < 0) {
                currentSongIndex = jsonData.length - 1; // Volvemos al final si llegamos al principio
              }
              // Llamamos a la función para mostrar la nueva canción
              displayCurrentSong(jsonData[currentSongIndex]);
            });

            // Agregar funcionalidad de búsqueda
            setupSearch(jsonData);
          } else if (typeof jsonData === "object" && jsonData !== null) {
            // Si es un objeto, creamos un array con ese objeto
            displayCurrentSong(jsonData);
          } else {
            console.error(
              "El archivo JSON no contiene un array de canciones ni un objeto válido."
            );
          }
        } catch (error) {
          console.error("Error al analizar el archivo JSON:", error);
        }
      } else {
        console.error(
          "Error al cargar el archivo JSON. Código de estado:",
          xhr.status
        );
      }
    }
  };
  xhr.open("GET", jsonPath, true);
  xhr.send();
}

// Función para mostrar la canción actual
function displayCurrentSong(currentSong) {
  var songsContainer = document.getElementById("songsContainer");
  songsContainer.innerHTML = ""; // Limpiamos el contenedor

  // Creamos la tarjeta de la canción
  var songCard = document.createElement("div");
  songCard.className = "card mb-3";
  songCard.innerHTML = `
          <div class="row g-0">
          <div class="col-md-4 d-flex justify-content-center">
          <img src="${getFullUrl(
            currentSong.imagen
          )}" class="img-fluid rounded-4 mx-auto d-block" alt="Imagen del álbum" style="max-width: 100%; height: auto;">
          
      </div>
              <div class="col-md-8">
                  <div class="card-body">
                      <h5 class="card-title text-center"><strong>${
                        currentSong.titulo || "Desconocido"
                      }</strong></h5>
                      <p class="card-text"><strong>Artista:</strong><br> <span>${
                        currentSong.artista || "Desconocido"
                      }</span></p>
                      <p class="card-text"><strong>Álbum:</strong><br> <span>${
                        currentSong.album || "Desconocido"
                      }</span></p>
                      <p class="card-text"><strong>Género:</strong><br> <span>${
                        currentSong.genero || "Desconocido"
                      }</span></p>
                      <p class="card-text"><strong>Número de pista:</strong><br> <span>${
                        currentSong.numero_de_pista || "Desconocido"
                      }</span></p>
                      <p class="card-text"><strong>Año:</strong><br> <span>${
                        currentSong.Año || "Desconocido"
                      }</span></p>
                      
                      <div class="audio-player">
        <audio id="audioPlayer">
            <source src="${getFullUrl(currentSong.archivo_musica)}">
            Tu navegador no soporta el elemento de audio.
        </audio>

        <div class="audio-controls">
            <button id="playPauseButton" class="btn btn-primary">Pausa</button>
            <div class="audio-progress">
                <input type="range" id="progressBar" value="0" step="1" />
            </div>
            <span id="currentTime">0:00</span>
        </div>
    </div>
                  </div>
              </div>
          </div>
      `;

  songsContainer.appendChild(songCard);

  // Inicializar el reproductor de audio
  audioPlayer = document.getElementById("audioPlayer");
  audioPlayer.addEventListener("loadeddata", function () {
    // Reproducir automáticamente cuando se carga la canción
    audioPlayer.play();
  });

  // Configurar eventos para el reproductor de audio personalizado
  audioPlayer.addEventListener("ended", playNextSong);

  // Función para avanzar a la siguiente canción
  function playNextSong() {
    // Incrementar el índice de la canción actual
    currentSongIndex++;
    // Verificar si el índice está fuera del rango
    if (currentSongIndex >= allSongsData.length) {
      currentSongIndex = 0; // Volver al principio si llegamos al final
    }
    // Mostrar la nueva canción
    displayCurrentSong(allSongsData[currentSongIndex]);
  }

  // Configurar eventos para el reproductor de audio personalizado
  var playPauseButton = document.getElementById("playPauseButton");
  playPauseButton.addEventListener("click", togglePlayPause);

  // Función para cambiar entre reproducción y pausa
  function togglePlayPause() {
    if (audioPlayer.paused) {
      audioPlayer.play();
      playPauseButton.textContent = "Pausar";
    } else {
      audioPlayer.pause();
      playPauseButton.textContent = "Reproducir";
    }
  }

  var progressBar = document.getElementById("progressBar");
  progressBar.addEventListener("input", seek);

  // Iniciar la actualización del tiempo actual
  setInterval(updateCurrentTime, 1000);
}

// Función para actualizar el tiempo actual y la barra de progreso
function updateCurrentTime() {
  var currentTimeDisplay = document.getElementById("currentTime");
  var progressBar = document.getElementById("progressBar");
  var currentTime = formatTime(audioPlayer.currentTime);
  currentTimeDisplay.textContent = currentTime;

  // Actualizar la posición de la barra de progreso
  progressBar.value = (audioPlayer.currentTime / audioPlayer.duration) * 100;
}

// Función para buscar en el archivo de audio
function seek() {
  var seekValue = progressBar.value;
  var seekTime = (seekValue / 100) * audioPlayer.duration;
  audioPlayer.currentTime = seekTime;
}

// Función para dar formato al tiempo en minutos y segundos
function formatTime(time) {
  var minutes = Math.floor(time / 60);
  var seconds = Math.floor(time % 60);
  seconds = seconds < 10 ? "0" + seconds : seconds;
  return minutes + ":" + seconds;
}

// Función para obtener la URL completa basada en la ubicación actual del script
function getFullUrl(relativeUrl) {
  var base = window.location.href;
  return new URL(relativeUrl, base).href;
}

// Función para configurar la funcionalidad de búsqueda
function setupSearch(data) {
  var searchInput = document.getElementById("searchInput");
  var suggestionsContainer = document.getElementById("suggestionsContainer");

  // Verificar si se encontró el elemento de búsqueda y el contenedor de sugerencias
  if (!searchInput || !suggestionsContainer) {
    console.error(
      "Error: No se encontró el elemento de búsqueda o el contenedor de sugerencias."
    );
    return;
  }

  searchInput.addEventListener("input", function () {
    var searchTerm = searchInput.value.toLowerCase();

    // Limpiar las sugerencias si el término de búsqueda es una cadena vacía
    if (searchTerm === "") {
      suggestionsContainer.innerHTML = "";
      return;
    }

    var filteredSongs = data.filter(function (song, index) {
      return (
        song.titulo.toLowerCase().includes(searchTerm) ||
        song.artista.toLowerCase().includes(searchTerm)
      );
    });

    // Limpiar las sugerencias anteriores
    suggestionsContainer.innerHTML = "";

    // Mostrar las sugerencias actuales
    filteredSongs.forEach(function (song) {
      var suggestion = document.createElement("div");
      suggestion.textContent =
        song.titulo + " - " + song.artista + " - " + song.album;
      suggestion.classList.add("suggestion");

      // Agregar un evento al hacer clic en una sugerencia
      suggestion.addEventListener("click", function () {
        currentSongIndex = data.indexOf(song);
        displayCurrentSong(song);
        // Limpiar las sugerencias después de hacer clic
        suggestionsContainer.innerHTML = "";
      });

      suggestionsContainer.appendChild(suggestion);
    });
  });
}

function regresar() {
  window.location.href = "Bienvenido.html";
}
