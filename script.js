"use strict";

var map = L.map('map').setView([46.201398876908065, 6.145992279052731],13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


var marker = L.marker([46.201398876908065, 6.145992279052731]).addTo(map);


const video = document.getElementById('camera-feed');


if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            
            video.srcObject = stream;
        })
        .catch((error) => {
            console.error("Error accessing the camera:", error);
            alert("Camera access is required to view the feed.");
        });
} else {
    alert("Camera not supported in this browser.");
}