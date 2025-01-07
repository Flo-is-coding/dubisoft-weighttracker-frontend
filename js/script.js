let predictions;
let streak;
let clickCount = 0;

loadStreakData();

document.getElementById('lottie_title').addEventListener('click', function () {
    clickCount++;
    if (clickCount === 5) {
        this.src = 'https://lottie.host/208ea239-972f-4640-8813-f6fe7f20c71b/APy5NSK1iq.json';
        clickCount = 0; // Zähler zurücksetzen
    }
});
async function fetchAndRenderGraph() {
        const response = await fetch('https://dubisoftw-weightracker-backend.azurewebsites.net/api/v1/weightdata'); // Adjust this URL if needed
        const data = await response.json();

        console.log("Printing Plot Data");

        // Prepare data for ECharts
        const dates = data.map(entry => new Date(entry.recordedAt).toLocaleDateString());
        const weights = data.map(entry => entry.weight);

        // Calculate min and max for y-axis
        const minWeight = Math.min(...weights);
        const maxWeight = Math.max(...weights);

        // Initialize ECharts instance
        const chartDom = document.getElementById('weightGraph');
        const myChart = echarts.init(chartDom);

        // ECharts configuration
        const option = {

            tooltip: {
                trigger: 'axis',
                formatter: '{b}: {c} kg'
            },
            xAxis: {
                type: 'category',
                data: dates,
                axisLabel: {
                    show: false // Hide x-axis labels
                },
                axisLine: {
                    show: false // Hide x-axis line
                },
                splitLine: {
                    show: false // Remove x-axis grid
                }
            },
            yAxis: {
                type: 'value',
                min: minWeight - 1, // Add slight padding below the min value
                max: maxWeight + 1, // Add slight padding above the max value
                axisLabel: {
                    show: false // Hide y-axis labels
                },
                splitLine: {
                    show: false // Remove background grid
                }
            },
            dataZoom: [
                {
                    type: 'inside', // Enable zooming inside the chart
                    start: 0,
                    end: 100
                },
                {
                    type: 'slider', // Enable zooming via slider
                    start: 0,
                    end: 100
                }
            ],
            series: [
                {
                    data: weights,
                    type: 'line',
                    smooth: true,
                    lineStyle: {
                        color: 'blue',
                        width: 3
                    },
                    symbolSize: 8
                }
            ]
        };

        // Render the chart
        myChart.setOption(option);

        // Make chart responsive
        window.addEventListener('resize', myChart.resize);
    }

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

async function loadStreakData() {
    const response = await fetch('https://dubisoftw-weightracker-backend.azurewebsites.net/api/v1/streak', {
        method: 'GET', // Die HTTP-Methode
        headers: {
            'Content-Type': 'application/json', // Header für JSON
        },
    });

    // Daten als JSON parsen
    streak = await response.json();
    displayStreak();
    console.log(streak);// Hier kannst du die Daten verwenden
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

async function fetchPredictionsAndUploadInputsAndAdjustStreak() {

    await loadPredictions();
    await uploadToBackend();
    await displayPrediction();
    fetchAndRenderGraph();

    loadStreakData();
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

function displayStreak() {
    const streak_display_h3 = document.getElementById("streak_text");
    const flame = document.getElementById("streak_flame");
    streak_display_h3.textContent = streak.currentStreak + " Tage";

    if (streak.streakActive) {
        streak_flame.src = "assets/streak_flame_true.png";
    }
}


