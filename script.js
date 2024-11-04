"use strict";

var map = L.map('map').setView([46.201398876908065, 6.145992279052731],13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


var marker = L.marker([46.201398876908065, 6.145992279052731]).addTo(map);