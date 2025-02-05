const { ApiResponse, Configuration, DataPostRequest, DefaultApi } = require("databox");

const config = new Configuration({
    basePath: "https://push.databox.com",
    username: "83f0588aa03740c69c9b8d6829b59d53",
    headers: {
        Accept: "application/vnd.databox.v2+json",
    },
});

// Function to send metrics to Databox
const pushToDatabox = async (metrics) => {
    const metricsToSend = Object.entries(metrics).flatMap(([category, values]) => {
        if (typeof values !== 'object') {
            console.error(`Napaka: vrednosti za kategorijo ${category} niso objekt.`);
            return [];
        }

        return Object.entries(values).map(([key, value]) => {
            const metricKey = `${category}.${key}`;
            let metricValue;

            if (typeof value === 'string') {
                metricValue = parseFloat(value);
                if (isNaN(metricValue)) {
                    console.error(`Napaka: vrednost za metriko ${metricKey} ni veljavna številka (${value}).`);
                    return null;
                }
            } else if (typeof value === 'number') {
                metricValue = value;
            } else {
                console.error(`Napaka: vrednost za metriko ${metricKey} ni številka.`);
                return null;
            }

            return {
                key: metricKey,
                value: metricValue,
                date: new Date().toISOString(),
            };
        }).filter(Boolean);
    });

    // Prepare the dataPostRequest
    const dataPostRequest = {
        pushData: metricsToSend,
    };

    // Send the data to Databox using the API
    const api = new DefaultApi(config);
    try {
        const response = await api.dataPostRaw(dataPostRequest);
        console.log("Response data", response.raw.json());
        return true;
    } catch (error) {
        console.error("Error pushing metrics to Databox:", error.message);
        return false;
    }
};

module.exports = pushToDatabox;
