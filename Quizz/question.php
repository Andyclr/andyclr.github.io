<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "quiz_db";

// Créer une connexion
$conn = new mysqli($servername, $username, $password, $dbname);

// Vérifier la connexion
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT question, type, image_url, audio_url FROM questions";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        echo "<div class='question'>";
        echo "<p>" . $row["question"] . "</p>";
        if ($row["type"] == "photo") {
            echo "<img src='" . $row["image_url"] . "' alt='Question'>";
        } elseif ($row["type"] == "audio") {
            echo "<audio controls><source src='" . $row["audio_url"] . "' type='audio/mp3'></audio>";
        }
        echo "</div>";
    }
} else {
    echo "0 results";
}

$conn->close();
?>