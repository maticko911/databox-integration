const fs = require("fs");
const storeMetricsLocally = require("./util/storeMetricsLocally");

describe("storeMetricsLocally", () => {
    test("should store metrics in a JSON file", () => {
        const metrics = {
            github: { repositories: 10, followers: 100 },
            weather: { temperature: 25, humidity: 60 },
        };

        storeMetricsLocally(metrics, true, "");

        const fileContent = fs.readFileSync("metrics.json", "utf8");
        const storedData = JSON.parse(fileContent);

        expect(storedData).toHaveProperty("timestamp");
        expect(storedData.metrics).toEqual(metrics);
        expect(storedData.success).toBe(true);
        expect(storedData.errorMessage).toBe("");

        // Cleanup after the test
        fs.unlinkSync("metrics.json");
    });

    test("should handle errors correctly when push fails", () => {
        const metrics = {
            github: { repositories: 10, followers: 100 },
            weather: { temperature: 25, humidity: 60 },
        };

        const errorMessage = "Failed to push data to Databox";
        storeMetricsLocally(metrics, false, errorMessage);

        const fileContent = fs.readFileSync("metrics.json", "utf8");
        const storedData = JSON.parse(fileContent);

        expect(storedData).toHaveProperty("timestamp");
        expect(storedData.metrics).toEqual(metrics);
        expect(storedData.success).toBe(false);
        expect(storedData.errorMessage).toBe(errorMessage);

        // Cleanup after the test
        fs.unlinkSync("metrics.json");
    });
});
