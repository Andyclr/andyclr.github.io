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

let currentStream; // To store the current stream
let usingFrontCamera = true; // Track which camera is in use

// Function to start the camera
async function startCamera(facingMode = 'user') {
    // Stop any existing stream
    if (currentStream) {
        currentStream.getTracks().forEach(track => track.stop());
    }

    try {
        // Request access to the camera with the specified facing mode
        currentStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: facingMode }
        });
        video.srcObject = currentStream;
    } catch (error) {
        console.error("Error accessing the camera:", error);
        alert("Could not access the camera.");
    }
}

// Event listener to flip the camera
flipButton.addEventListener('click', () => {
    // Toggle the camera mode
    usingFrontCamera = !usingFrontCamera;
    startCamera(usingFrontCamera ? 'user' : 'environment');
});

captureButton.addEventListener('click', () => {
    captureImage();
});

function captureImage() {
    // Create a canvas element to draw the video frame
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current frame from the video onto the canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the canvas content to a data URL and set it as the image source
    const imageDataUrl = canvas.toDataURL('image/png');
    capturedImage.src = imageDataUrl;
}

// Start the front camera by default
startCamera();