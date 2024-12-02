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
function getLocalStream() {
    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        window.localStream = stream; // A
        window.localAudio.srcObject = stream; // B
        window.localAudio.autoplay = true; // C
      })
      .catch((err) => {
        console.error(`you got an error: ${err}`);
      });
  }


async function startRec() {
    audioChunks = [];
    microActuel = getLocalStream();

    if (microActuel && microActuel.state === "recording") 
        {
        microActuel.stop();
        }
    
 
    
    microActuel.onstop = async () => {

        const audio = document.createElement("audio");
        audio.controls = true;
        const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
        const audioURL = window.URL.createObjectURL(blob);
        audio.src = audioURL;
        console.log("recorder stopped");
    };

    microActuel.ondataavailable = event => {
        audioChunks.push(event.data);
    };

    microActuel.start();
}

function stopRec() {
    if (microActuel && microActuel.state === "recording") {
        microActuel.stop();
    }
}
if(localStorage.getItem("audio") === null){
    localStorage.setItem("audio", audioChunks);
}

async function transcrireAudio(audioTexte) {

        afficherTexteTranscrit(audioTexte); 
    
    
}
let audioFile = "./inauguration-calculateur-alps-7s.mp3";
function afficherTexteTranscrit(texte) {
    
    const li = document.createElement('li');
    li.textContent = texte;
    texteUl.appendChild(li);
}

async function PostAudio(audioFile) {
    const url = 'https://api.infomaniak.com/1/ai/272/openai/audio/transcriptions';
    const response = await fetch(url,{
        'method': 'POST',
        'headers': {
        'Authorization': 'Bearer 4JXuZq6cpFRZRpUNg7ZGkpn5ikWnxarDrI0T4P5lbs6rcuhX7LRTUumzS9pEZF-zW7I51_EIupOLtOzp',
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({"file": audioFile, "model": "whisper"}),
    });
    if(!response.ok){
        throw new Error(response.status);
    }
    
        
}

async function getAudio(response) {
    const url = `https://api.infomaniak.com/1/ai/272/results/${response.batch_id}`;
        response = await fetch(url,{
        'method': 'GET',
        'headers': {
            'Authorization': 'Bearer 4JXuZq6cpFRZRpUNg7ZGkpn5ikWnxarDrI0T4P5lbs6rcuhX7LRTUumzS9pEZF-zW7I51_EIupOLtOzp',
            'Content-Type': 'application/json',
          },
        });
    transcrireAudio()
}



// Aide de chat GPT pour le curl et l'API whisper d'infomaniak
// import express from "express";
// import multer from "multer";
// import { exec } from "child_process";
// import path from "path";

// const app = express();
// const port = 5500;

// const upload = multer({ dest: "uploads/" });

// app.post("/transcribe", upload.single("file"), (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ error: "No file uploaded" });
//     }

//     const filePath = req.file.path;

//     const curlCommand = `curl -X POST http://localhost:5500/transcribe \
//       -H "Content-Type: multipart/form-data" \
//       -F "file=@${filePath}"`;


//     exec(curlCommand, (error, stdout, stderr) => {
//         if (error) {
//             console.error(`exec error: ${error}`);
//             return res.status(500).json({ error: "Error transcribing audio" });
//         }


//         let response;
//         try {
//             response = JSON.parse(stdout);  
//         } catch (err) {
//             console.error("Error parsing Whisper API response:", err);
//             return res.status(500).json({ error: "Error processing transcription" });
//         }

        
//         require("fs").unlinkSync(filePath);

        
//         return res.json({ text: response.text });
//     });
// });

// app.listen(port, () => {
//     console.log(`Server listening at http://localhost:${port}`);
// });
