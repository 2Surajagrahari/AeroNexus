require('dotenv').config();
const API_KEY = process.env.WEATHER_API_KEY;

async function getHazardousNodes(routeNodes) {
    let hazardousNodes = [];
    let windData = {}; 
    console.log(`Fetching LIVE satellite weather & wind data for ${routeNodes.length} waypoints...`);
    for (let node of routeNodes) {
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${node.lat}&lon=${node.lon}&appid=${API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.weather && data.weather.length > 0) {
                const condition = data.weather[0].main;
                const windSpeedKmh = data.wind.speed * 3.6; 
                const windDeg = data.wind.deg; 
                windData[node.id] = { speed: windSpeedKmh, deg: windDeg };
                const dangerousConditions = ['Thunderstorm', 'Tornado', 'Squall', 'Ash'];
                if (dangerousConditions.includes(condition)) {
                    hazardousNodes.push(node.id);
                }
            }
        } catch (error) {
            console.error(`❌ Failed to fetch weather for ${node.id}`);
        }
    }

    return { hazardousNodes, windData }; 
}

module.exports = { getHazardousNodes };