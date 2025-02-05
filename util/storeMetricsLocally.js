const fs = require('fs');

const storeMetricsLocally = (metrics, pushSuccess, errorMessage='') => {
    const timestamp = new Date().toISOString();

    const numberOfKPIs = Object.keys(metrics).length;
    const data = {
        timestamp,
        service: 'Databox',
        metricsSentToDatabox: metrics,
        numberOfKPIsSent: numberOfKPIs,
        sendingSuccessful: pushSuccess,
        errorMessage: pushSuccess ? '' : errorMessage,
    };

    fs.writeFileSync('metrics.json', JSON.stringify(data, null, 2));
};

module.exports = storeMetricsLocally;