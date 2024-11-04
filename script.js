"use strict";

var map = L.map('map').setView([46.201398876908065, 6.145992279052731],13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


var marker = L.marker([46.201398876908065, 6.145992279052731]).addTo(map);


const video = document.getElementById('camera-feed');
const flipButton = document.getElementById('flip-button');
const captureButton = document.getElementById('capture-button');
const capturedImage = document.getElementById('captured-image');

let currentStream; 
let usingFrontCamera = true; 

capturedImage.src = localStorage.getItem("image");

async function startCamera(facingMode = 'user') {

    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }

    try {

        currentStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: facingMode }
        });
        video.srcObject = currentStream;
    } catch (error) {
        console.error("Error accessing the camera:", error);
        alert("Could not access the camera.");
    }
}

flipButton.addEventListener('click', () => {

    usingFrontCamera = !usingFrontCamera;
    startCamera(usingFrontCamera ? 'user' : 'environment');
});

captureButton.addEventListener('click', () => {
    captureImage();
});

function captureImage() {

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;


    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);


    const imageDataUrl = canvas.toDataURL('image/jpg');
    localStorage.setItem("image", imageDataUrl);
    capturedImage.src = imageDataUrl;
}


startCamera();