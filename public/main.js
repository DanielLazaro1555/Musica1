document.addEventListener("DOMContentLoaded", function () {
  // Llamamos a la función loadJSON con la URL del archivo JSON en línea
  loadJSON(
    "https://raw.githubusercontent.com/DanielLazaro1555/Musica1/main/public/bd.json"
  );
});



var currentSongIndex = 0; // Índice de la canción actual

// Función para cargar el JSON y mostrar la primera canción
function loadJSON(jsonPath) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          var jsonData = JSON.parse(xhr.responseText);

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
              <div class="col-md-4">
                  <img src="${getFullUrl(
                    currentSong.imagen
                  )}" class="img-fluid rounded-start" alt="Imagen del álbum">
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
                      <p class="card-text"><strong>Derechos de autor:</strong><br> <span>${
                        currentSong.derechos_de_autor || "Desconocido"
                      }</span></p>
                      <div class="d-flex justify-content-center mt-3">
      <button id="prevButton" class="btn btn-secondary me-3">Anterior</button>
      <audio controls class="w-100" style="width: 100%; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px;">
                          <source src="${getFullUrl(
                            currentSong.archivo_musica
                          )}">
                          Tu navegador no soporta el elemento de audio.
                      </audio>
      <button id="nextButton" class="btn btn-primary ms-3">Siguiente</button>
                        </div>
                      
                  </div>
              </div>
          </div>
      `;

  songsContainer.appendChild(songCard);
}

// Función para obtener la URL completa basada en la ubicación actual del script
function getFullUrl(relativeUrl) {
  var base = window.location.href;
  return new URL(relativeUrl, base).href;
}
