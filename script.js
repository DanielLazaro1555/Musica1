document.getElementById('fileInput').addEventListener('change', handleFile);

function handleFile(e) {
    const file = e.target.files[0];

    if (file) {
        getMetadata(file);
    }
}

function getMetadata(file) {
    const reader = new FileReader();

    reader.onload = function (e) {
        const arrayBuffer = e.target.result;
        parseFLACMetadata(arrayBuffer);
    };

    reader.readAsArrayBuffer(file);
}

function parseFLACMetadata(arrayBuffer) {
    flac.parseMetadata(arrayBuffer, function (metadata) {
        if (metadata) {
            const formattedMetadata = formatMetadata(metadata);
            displayMetadata(formattedMetadata);
        } else {
            console.error('Error parsing FLAC metadata.');
        }
    });
}

function formatMetadata(metadata) {
    const formattedMetadata = {};

    for (const key in metadata) {
        formattedMetadata[key] = metadata[key][0]; // Use the first value if it's an array
    }

    return formattedMetadata;
}

function displayMetadata(metadata) {
    const metadataDisplay = document.getElementById('metadataDisplay');
    metadataDisplay.innerHTML = '';

    for (const key in metadata) {
        const metadataItem = document.createElement('p');
        metadataItem.innerHTML = `<strong>${key}:</strong> ${metadata[key]}`;
        metadataDisplay.appendChild(metadataItem);
    }
}
