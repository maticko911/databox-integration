const cron = require('node-cron');
const fetchWeather = require("./weather_integration");
const fetchGitHubMetrics = require("./github_integration");
const storeMetricsLocally = require("./util/storeMetricsLocally");
const pushToDatabox = require("./push_data");


const logMetrics = (label, metrics) => {
    console.log(`${label} Metrics:`);
    console.log(JSON.stringify(metrics, null, 2));
};

const fetchAndPushMetrics = async () => {
    console.log("Fetching metrics...");

    let errorMessage = '';
    let metrics = {};

    try {
        const [weatherMetrics, gitHubMetrics] = await Promise.all([
            fetchWeather(),
            fetchGitHubMetrics()
        ]);

        if (weatherMetrics) {
            if (weatherMetrics.temperature && !isNaN(weatherMetrics.temperature)) {
                weatherMetrics.temperature = (weatherMetrics.temperature - 273.15).toFixed(2);
            } else {
                console.error("Invalid weather temperature value:", weatherMetrics.temperature);
                weatherMetrics.temperature = null;
            }

            if (weatherMetrics.condition && typeof weatherMetrics.condition === 'string') {
                weatherMetrics.condition = weatherMetrics.condition;
            } else {
                console.error("Invalid weather condition value:", weatherMetrics.condition);
                weatherMetrics.condition = null;
            }

            logMetrics("Weather", weatherMetrics);
            metrics.weather = weatherMetrics;
        } else {
            errorMessage = "Failed to fetch weather metrics.";
            console.log(errorMessage);
        }

        if (gitHubMetrics) {
            logMetrics("GitHub", gitHubMetrics);
            metrics.github = gitHubMetrics;
        } else {
            errorMessage = "Failed to fetch GitHub metrics.";
            console.log(errorMessage);
        }


        if (metrics.weather && metrics.github) {
            // Pošlji metrike v Databox
            const pushSuccess = await pushToDatabox(metrics);
            if (pushSuccess) {
                console.log("Metrics pushed to Databox successfully!");
            } else {
                throw new Error("Failed to push metrics to Databox.");
            }
        } else {
            console.error("Invalid metrics, unable to send to Databox.");
        }

    } catch (error) {
        console.error("Error pushing metrics to Databox:", error.message);
    }

    // Shrani metrike lokalno
    storeMetricsLocally(metrics, errorMessage);
    console.log("Metrics stored locally.");
};

// Periodična naloga za obnavljanje metrik
cron.schedule("0 * * * *", () => {
    console.log("Running scheduled task...");
    fetchAndPushMetrics();
});

fetchAndPushMetrics();
