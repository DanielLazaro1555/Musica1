document.addEventListener("DOMContentLoaded", function () {
  // Llamamos a la función loadJSON con la URL del archivo JSON en línea
  loadJSON(
    "https://raw.githubusercontent.com/DanielLazaro1555/Musica1/main/public/bd.json"
  );
});

function loadJSON(jsonPath) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          var jsonData = JSON.parse(xhr.responseText);

          // Verificamos si jsonData es un array o un objeto
          if (Array.isArray(jsonData)) {
            displaySongs(jsonData);
          } else if (typeof jsonData === "object" && jsonData !== null) {
            // Si es un objeto, creamos un array con ese objeto
            displaySongs([jsonData]);
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

function displaySongs(songsData) {
  var songsContainer = document.getElementById("songsContainer");

  // Iteramos sobre cada canción en el JSON
  songsData.forEach(function (song, index) {
    var songCard = document.createElement("div");
    songCard.className = "card mb-3";
    songCard.innerHTML = `
              <div class="row g-0">
                  <div class="col-md-4">
                      <img src="${
                        getFullUrl(song.imagen) || "ruta/al/archivo/default.jpg"
                      }" class="img-fluid rounded-start" alt="Imagen del álbum">
                  </div>
                  <div class="col-md-8">
                      <div class="card-body">
                          <h5 class="card-title text-center"><strong>${
                            song.titulo || "Desconocido"
                          }</strong></h5>
                          <p class="card-text"><strong>Artista:</strong><br> <span>${
                            song.artista || "Desconocido"
                          }</span></p>
                          <p class="card-text"><strong>Álbum:</strong><br> <span>${
                            song.album || "Desconocido"
                          }</span></p>
                          <p class="card-text"><strong>Género:</strong><br> <span>${
                            song.genero || "Desconocido"
                          }</span></p>
                          <p class="card-text"><strong>Número de pista:</strong><br> <span>${
                            song.numero_de_pista || "Desconocido"
                          }</span></p>
                          <p class="card-text"><strong>Derechos de autor:</strong><br> <span>${
                            song.derechos_de_autor || "Desconocido"
                          }</span></p>
                          <audio controls class="w-100" style="width: 100%; background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px;">
                              <source src="${
                                getFullUrl(song.archivo_musica) ||
                                "ruta/al/archivo/default.mp3"
                              }">
                              Tu navegador no soporta el elemento de audio.
                          </audio>
                      </div>
                  </div>
              </div>
          `;

    songsContainer.appendChild(songCard);
  });
}

// Función para obtener la URL completa basada en la ubicación actual del script
function getFullUrl(relativeUrl) {
  var base = window.location.href;
  return new URL(relativeUrl, base).href;
}
