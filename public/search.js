document.addEventListener("DOMContentLoaded", function () {
  // Llamamos a la función loadJSON con la URL del archivo JSON en línea
  loadJSON(
    "https://raw.githubusercontent.com/DanielLazaro1555/Musica1/main/public/bd.json"
  );
});

var allSongsData; // Variable para almacenar todos los datos de las canciones

function loadJSON(jsonPath) {
  fetch(jsonPath)
    .then((response) => response.json())
    .then((jsonData) => {
      allSongsData = jsonData; // Almacenar todos los datos de las canciones
      // Llamamos a la función para mostrar los datos en la página
      displayDataOnPage(allSongsData);
    })
    .catch((error) => console.error("Error al cargar el archivo JSON:", error));
}

// Función para mostrar los datos en la página
function displayDataOnPage(data) {
  var container = document.getElementById("miContenedor");

  // Verificar si el contenedor se encontró correctamente
  if (!container) {
    console.error(
      "Error: No se encontró el contenedor con el ID 'miContenedor'."
    );
    return;
  }

  // Limpiar el contenido existente
  container.innerHTML = "";

  // Verificar si los datos son un array y no está vacío
  if (Array.isArray(data) && data.length > 0) {
    // Recorrer los datos y agregarlos al contenedor
    data.forEach(function (item) {
      // Crear un contenedor para cada canción
      var songContainer = document.createElement("div");
      songContainer.classList.add(
        "song-container",
        "row",
        "mb-3",
        "border",
        "border-secondary",
        "rounded",
        "align-items-center"
      ); // Agregar clases de Bootstrap para bordes, redondeado y centrado verticalmente

      // Crear un elemento de imagen
      var imageElement = document.createElement("img");
      imageElement.src = new URL(item.imagen, window.location.href).href;
      imageElement.classList.add("col-12", "col-md-3", "rounded", "border"); // Ajustar las clases para el ancho de la imagen y bordes

      // Crear un elemento de texto para el nombre de la canción y el artista
      var textElement = document.createElement("div");
      textElement.innerHTML = `<strong>${item.titulo}</strong> <br> ${item.artista}`;

      // Ajustar estilos para el elemento de texto
      textElement.classList.add("col-12", "col-md-6", "text-center");

      // Crear un botón
      var buttonElement = document.createElement("button");
      buttonElement.textContent = "Reproducir";

      // Ajustar estilos personalizados para el botón
      buttonElement.style.paddingTop = "1.5rem";
      buttonElement.style.paddingBottom = "1.5rem";
      buttonElement.style.marginTop = "1rem"; // Ajusta según sea necesario

      // Agregar clases y estilos adicionales según sea necesario
      buttonElement.classList.add(
        "col-12",
        "col-md-3",
        "btn",
        "btn-primary",
        "ml-md-auto",
        "my-2"
      );

      // Añadir un ícono para mejorar el diseño (opcional)
      var iconElement = document.createElement("i");
      iconElement.classList.add("bi", "bi-play"); // Clases de Bootstrap Icons
      buttonElement.appendChild(iconElement);
      // Agregar elementos al contenedor de la canción
      songContainer.appendChild(imageElement);
      songContainer.appendChild(textElement);
      songContainer.appendChild(buttonElement);

      // Agregar el contenedor de la canción al contenedor principal
      container.appendChild(songContainer);
    });
  } else {
    console.error(
      "Error: Los datos no son un array válido o el array está vacío."
    );
  }
}

// search.js

document.addEventListener("DOMContentLoaded", function () {
  var searchInput = document.getElementById("searchInput");
  searchInput.classList.add("form-control"); // Agregar clase de Bootstrap para estilizar el input
  searchInput.addEventListener("input", function () {
    var searchTerm = searchInput.value.toLowerCase();
    filterSongs(searchTerm);
  });
});

function filterSongs(searchTerm) {
  // Verificamos si ya se cargaron los datos de las canciones
  if (!allSongsData) {
    console.error("Error: Los datos de las canciones no han sido cargados.");
    return;
  }

  var filteredSongs = allSongsData.filter(function (song) {
    return song.titulo.toLowerCase().includes(searchTerm);
  });

  updatemiContenedor(filteredSongs);
}

function updatemiContenedor(songs) {
    var miContenedor = document.getElementById('miContenedor');
    // Limpiamos el contenido actual antes de agregar los nuevos resultados
    miContenedor.innerHTML = '';
  
    songs.forEach(function (song) {
      var songContainer = document.createElement('div');
      songContainer.classList.add(
        'song-container',
        'row',
        'mb-3',
        'border',
        'border-secondary',
        'rounded',
        'align-items-center'
      );
  
      var imageElement = document.createElement('img');
      imageElement.src = new URL(song.imagen, window.location.href).href;
      imageElement.classList.add('col-12', 'col-md-3', 'rounded', 'border');
  
      // Corregir el uso de 'song' en lugar de 'item' aquí
      var textElement = document.createElement('div');
      textElement.innerHTML = `<strong>${song.titulo}</strong> <br> ${song.artista}`;
      textElement.classList.add('col-12', 'col-md-6', 'text-center');
  
      var buttonElement = document.createElement('button');
      buttonElement.textContent = 'Reproducir';
  
      buttonElement.style.paddingTop = '1.5rem';
      buttonElement.style.paddingBottom = '1.5rem';
      buttonElement.style.marginTop = '1rem';
  
      buttonElement.classList.add(
        'col-12',
        'col-md-3',
        'btn',
        'btn-primary',
        'ml-md-auto',
        'my-2'
      );
  
      var iconElement = document.createElement('i');
      iconElement.classList.add('bi', 'bi-play');
      buttonElement.appendChild(iconElement);
  
      songContainer.appendChild(imageElement);
      songContainer.appendChild(textElement);
      songContainer.appendChild(buttonElement);
  
      miContenedor.appendChild(songContainer);
    });
  }
