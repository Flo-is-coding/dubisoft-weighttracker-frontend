function hideButton() {
    const element = document.getElementById("uploadButton");
    element.style.display = "none"; // Blendet das Element aus
}
function outputValues() {
    const weight = document.getElementById("weight").value;
    const takesCreatine = document.getElementById("creatin").checked;
    const tookShit = document.getElementById("shit").checked;

    console.log(weight);
    console.log(takesCreatine);
    console.log(tookShit);
    console.log("starting uploading to server...");

    const data = {
        weight: weight,
        takesCreatine: takesCreatine,
        tookShit: tookShit
    }

    console.log(data);

    fetch("https://dubisoftw-weightracker-backend.azurewebsites.net/api/v1/weightdata", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data) // Konvertiere das JS-Objekt zu JSON
    })
        .then(response => {
            if (response.status >= 200 && response.status < 300) {
                // Erfolgreiche Antwort (Statuscode 2xx)
                hideButton();
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



