"use strict";

let microActuel;
let audioChunks = [];
let audioBlob;

let btnRec = document.getElementById("enregistrer");
let texteUl = document.getElementById("texte");

btnRec.addEventListener('touchstart', startRec);

btnRec.addEventListener('touchend', stopRec);

if(localStorage.getItem("audio")){
    audioChunks = localStorage.getItem("audio");
    text = localStorage.getItem("text");
    afficherTexteTranscrit(text);
}



async function startRec() {
    if (microActuel && microActuel.state === "recording") 
        {
        microActuel.stop();
    }

    microActuel = new microActuel(micro);

    
    microActuel.ondataavailable = event => {
        audioChunks.push(event.data);
    };
    
    microActuel.onstop = async () => {

        audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

        await transcrireAudio(audioBlob);
    };

    microActuel.start();
}

function stopRec() {
    if (microActuel && microActuel.state === "recording") {
        microActuel.stop();
    }
}
if(localStorage.getItem("audio") === null){
    localStorage.setItem("audio" = audioChunks);
}

async function transcrireAudio(audioBlob) {

    const formData = new FormData();
    formData.append("file", audioBlob, "audio.wav");

    try {
        const response = await fetch("http://localhost:5500/transcribe", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        if(localStorage.getItem("text")){localStorage.setItem("text", data.text);}
        afficherTexteTranscrit(data.text); 
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'audio:", error);
    }
}

function afficherTexteTranscrit(texte) {
    
    const li = document.createElement('li');
    li.textContent = texte;
    texteUl.appendChild(li);
}


// Aide de chat GPT pour le curl et l'API whisper d'infomaniak
const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");

const app = express();
const port = 5500;

const upload = multer({ dest: "uploads/" });

app.post("/transcribe", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;

    const curlCommand = `curl -X POST http://localhost:5500/transcribe \
      -H "Content-Type: multipart/form-data" \
      -F "file=@${filePath}"`;


    exec(curlCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).json({ error: "Error transcribing audio" });
        }


        let response;
        try {
            response = JSON.parse(stdout);  
        } catch (err) {
            console.error("Error parsing Whisper API response:", err);
            return res.status(500).json({ error: "Error processing transcription" });
        }

        
        require("fs").unlinkSync(filePath);

        
        return res.json({ text: response.text });
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
