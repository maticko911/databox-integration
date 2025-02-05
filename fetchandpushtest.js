const fetchWeather = require("./weather_integration")
const fetchGithub = require("./github_integration")
const pushToDatabox = requere('./push_data')
const storeMetricsLocally = require("./utils/store_metrics_locally")

jest.mock("./weather_integration")
jest.mock("./github_integration")
jest.mock("./push_data")
jest.mock("./utils/store_metrics_locally")

describe("fetchAndPushMetrics", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("it should fetch weather and GitHib data and store it locally", async () => {
        fetchWeather.mockResolvedValue({
            temperature: 7,
            humidity: 40,
            windSpeed: 100,
            condition: "Clear",
            pressure: 1012,
        });

        fetchGithub.mockResolvedValue({
            repositories: 10,
            followers: 100,
            commits: 150,
            stars: 20,
            watchers: 5,
        });

        pushToDatabox.mockResolvedValue(true);

        const metrics = {
            weather: {
                temperature: 25,
                humidity: 60,
                windSpeed: 5,
                condition: "Clear",
                pressure: 1013,
            },
            github: {
                repositories: 10,
                followers: 100,
                commits: 150,
                stars: 20,
                watchers: 5,
            },
        };

        // Funkcija za pridobivanje in pošiljanje metrik
        await require("./index").fetchAndPushMetrics();

        // Preverjanje, ali so podatki shranjeni lokalno
        expect(storeMetricsLocally).toHaveBeenCalledWith(
            metrics,
            true,
            ""
        );

        // Preverim, ali so bili podatki poslani v Databox
        expect(pushToDatabox).toHaveBeenCalledWith(metrics);
    });

    test("should handle failure in pushing data", async () => {
        // Simuliram neuspešno pošiljanje
        fetchWeather.mockResolvedValue({
            temperature: 25,
            humidity: 60,
            windSpeed: 5,
            condition: "Clear",
            pressure: 1013,
        });

        fetchGitHubMetrics.mockResolvedValue({
            repositories: 10,
            followers: 100,
            commits: 150,
            stars: 20,
            watchers: 5,
        });

        pushToDatabox.mockResolvedValue(false);

        const metrics = {
            weather: {
                temperature: 25,
                humidity: 60,
                windSpeed: 5,
                condition: "Clear",
                pressure: 1013,
            },
            github: {
                repositories: 10,
                followers: 100,
                commits: 150,
                stars: 20,
                watchers: 5,
            },
        };

        // Funkcija za pridobivanje in pošiljanje metrik
        await require("./index").fetchAndPushMetrics();

        // Preverjanje, ali so bili podatki shranjeni lokalno z napako
        expect(storeMetricsLocally).toHaveBeenCalledWith(
            metrics,
            false,
            "Failed to push data to Databox."
        );
    });
});