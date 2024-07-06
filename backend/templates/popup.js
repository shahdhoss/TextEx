const dropArea = document.getElementById("drop-area");
const inputFile = document.getElementById("input-file");
const imageView = document.getElementById("img-view");
const overlay = dropArea.querySelector(".overlay");

inputFile.addEventListener("change", uploadImage);

function uploadImage() {
    let file = inputFile.files[0];
    let imglink = URL.createObjectURL(file);
    imageView.style.backgroundImage = `url(${imglink})`;
    imageView.textContent = "";
    imageView.style.border = 0;
    sendImage(file);
}

dropArea.addEventListener("dragover", function(e) {
    e.preventDefault();
});

dropArea.addEventListener("dragenter", function() {
    dropArea.classList.add("hover");
    imageView.innerText = "Drop it like it's hot!";
});

dropArea.addEventListener("dragleave", function() {
    dropArea.classList.remove("hover");
});

dropArea.addEventListener("drop", function(e) {
    e.preventDefault();
    dropArea.classList.remove("hover");
    inputFile.files = e.dataTransfer.files;
    uploadImage();
});

function sendImage(file) {
    let formData = new FormData();
    formData.append('image', file);

    fetch('http://127.0.0.1:5000/upload_image', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // console.log('Success:', data);
        document.getElementById("converted_text").innerHTML=`<p>${data.string}<p>`
    })
    .catch((error) => {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    });
}
