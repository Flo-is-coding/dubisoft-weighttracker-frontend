let predictions;
let clickCount = 0;

document.getElementById('lottie_title').addEventListener('click', function () {
    clickCount++;
    if (clickCount === 5) {
        this.src = 'https://lottie.host/208ea239-972f-4640-8813-f6fe7f20c71b/APy5NSK1iq.json';
        clickCount = 0; // Zähler zurücksetzen
    }
});

async function loadPredictions() {
    const response = await fetch('https://dubisoftw-weightracker-backend.azurewebsites.net/api/v1/prediction', {
        method: 'GET', // Die HTTP-Methode
        headers: {
            'Content-Type': 'application/json', // Header für JSON
        },
    });

    // Daten als JSON parsen
    predictions = await response.json();
    console.log(predictions);// Hier kannst du die Daten verwenden
}

function displayPrediction() {
    const hasTakenAShitBeforeWeighing = document.getElementById("shit").checked;
    const element = document.getElementById("uploadButton");
    if (hasTakenAShitBeforeWeighing === true) {
        element.textContent = predictions.wightInCaseTakenShitBeforeWeighing;
    } else {
        element.textContent = predictions.weightInCaseNotTakenShitBeforeWeighing;
    }
}

async function fetchPredictionsAndUploadInputs() {
    await loadPredictions();
    uploadToBackend();
    displayPrediction();

}

async function uploadToBackend() {
    const weight = document.getElementById("weight").value;
    const takesCreatine = document.getElementById("creatin").checked;
    const hasTakenAShitBeforeWeighing = document.getElementById("shit").checked;

    console.log(weight);
    console.log(takesCreatine);
    console.log(hasTakenAShitBeforeWeighing);
    console.log("starting uploading to server...");

    const data = {
        weight: weight, takesCreatine: takesCreatine, hasTakenAShitBeforeWeighing: hasTakenAShitBeforeWeighing
    }

    console.log(data);

    await fetch("https://dubisoftw-weightracker-backend.azurewebsites.net/api/v1/weightdata", {
        method: "POST", headers: {
            "Content-Type": "application/json"
        }, body: JSON.stringify(data) // Konvertiere das JS-Objekt zu JSON
    })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                // Erfolgreiche Antwort (Statuscode 2xx)
            } else {
                // Fehlerhafte Antwort (z.B. Statuscode 4xx oder 5xx)
                if (weight < 130) {
                    alert("Du hast dich heute schon gewogen!")
                } else {
                    alert("Du hast dich heute schon gewogen du fette Sau!")
                }
            }
        })
}



