"use strict";

let retournerCarteBtn = document.getElementById('retournerCarte');
let carte = document.querySelector('.carte');

retournerCarteBtn.addEventListener('click', () => {
    carte.classList.toggle('retourne');
});