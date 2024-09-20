function outputValues() {
    const weight = document.getElementById("weight").value;
    const takesCreatine = document.getElementById("creatin").checked;

    console.log(weight);
    console.log(takesCreatine);
    console.log("starting uploading to server...");

    const data = {
        weight: weight,
        takesCreatine: takesCreatine
    }

    console.log(data);

    fetch("https://dubisoftw-weightracker-backend.azurewebsites.net/api/v1/weightdata", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data) // Konvertiere das JS-Objekt zu JSON
    })
        .catch((error) => {
            console.error("Error:", error);
            alert("There was an error submitting the data.");
        });
}



