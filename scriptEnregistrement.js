"use strict";

const btnRec = document.getElementById("enregistrer");
const texteUl = document.getElementById("Texte");

const micro = await navigator.mediaDevices.getUserMedia({ audio: true });


btnRec.addEventListener('ontouchstart')
{
    startRec(micro);
}

btnRec.addEventListener('ontouchend')
{

}

let microActuel;

async function startRec(micro) 
{
    if(microActuel){
        microActuel.getAudioTracks().foreach(track => track.stop());
    }

    try{
        microActuel = await micro;

    }
    catch (error){
        console.error("Erreur à accéder au micro");
        alert("Pas d'accés au microphone");
    }
}


"use strict";

// Récupération des éléments HTML
const btnRec = document.getElementById("enregistrer");
const texteUl = document.getElementById("Texte");

// Accéder au microphone
const micro = await navigator.mediaDevices.getUserMedia({ audio: true });

let mediaRecorder;
let audioChunks = [];
let audioBlob;

// Ajouter l'écouteur d'événement pour démarrer l'enregistrement
btnRec.addEventListener('touchstart', startRec);

// Ajouter l'écouteur d'événement pour arrêter l'enregistrement
btnRec.addEventListener('touchend', stopRec);

async function startRec() {
    // Vérifier si l'enregistrement est déjà en cours et l'arrêter si nécessaire
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
    }

    // Créer un enregistreur de média
    mediaRecorder = new MediaRecorder(micro);
    mediaRecorder.ondataavailable = event => {
        audioChunks.push(event.data);  // Ajouter les morceaux audio à un tableau
    };
    
    mediaRecorder.onstop = async () => {
        // Créer un blob à partir des données audio
        audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        // Appeler la fonction pour envoyer l'audio au serveur
        await transcrireAudio(audioBlob);
    };

    // Démarrer l'enregistrement
    mediaRecorder.start();
}

function stopRec() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();  // Arrêter l'enregistrement
    }
}

// Fonction pour envoyer l'audio au serveur pour cURL
async function transcrireAudio(audioBlob) {
    // Convertir le Blob audio en FormData
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.wav");

    try {
        const response = await fetch("http://localhost:3000/transcribe", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        afficherTexteTranscrit(data.text);  // Afficher le texte transcrit
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'audio:", error);
    }
}

// Fonction pour afficher le texte transcrit sur l'écran
function afficherTexteTranscrit(texte) {
    const li = document.createElement('li');
    li.textContent = texte;
    texteUl.appendChild(li);
}



const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const port = 3000;

// Set up multer for handling file uploads
const upload = multer({ dest: "uploads/" });

// Endpoint to handle audio file upload and transcription
app.post("/transcribe", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;

    // Run cURL to send the audio file to Whisper for transcription
    const curlCommand = `curl -X POST http://localhost:5000/transcribe \
      -H "Content-Type: multipart/form-data" \
      -F "file=@${filePath}"`;

    // Execute the cURL command
    exec(curlCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: "Error transcribing audio" });
        }

        // Assuming the Whisper API returns a text object with transcription
        let response;
        try {
            response = JSON.parse(stdout);  // Parse the response from Whisper API
        } catch (err) {
            console.error("Error parsing Whisper API response:", err);
            return res.status(500).json({ error: "Error processing transcription" });
        }

        // Clean up the uploaded file after processing
        require("fs").unlinkSync(filePath);

        // Return the transcribed text
        return res.json({ text: response.text });
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
