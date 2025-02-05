const axios = require("axios");
require("dotenv").config();

const fetchWeather = async () => {
    const city = 'Ptuj';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHERMAP_API_KEY}`;

    try {
        const response = await axios.get(url);
        const weather = response.data;
        return {
            temperature: weather.main.temp,
            humidity: weather.main.humidity,
            windSpeed: weather.wind.speed,
            condition: weather.weather[0].main,
            pressure: weather.main.pressure,
        }
    } catch (error) {
        console.log("Error fetching weather metrics:", error.message);
        return null;
    }

}

module.exports = fetchWeather;
