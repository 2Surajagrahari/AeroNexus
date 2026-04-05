const OWM_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

/**
 * Calculates a dynamically adjusted flight path curve that dodges actual Severe Weather.
 * 
 * @param {Array} start - [lat, lng]
 * @param {Array} end - [lat, lng]
 * @param {boolean} checkWeather - If true, probe OpenWeatherMap
 * @returns {Promise<Array>} Promise returning Array of [lat, lng] defining the polyline path
 */
export async function calculateSafeRoute(start, end, checkWeather = true) {
    const points = [];
    const segments = 50; // High resolution for curve math
    const baseOffset = 10; 

    // Find the mathematical trajectory checkpoints at 25%, 50%, and 75% marks
    const checkNodes = [0.25, 0.5, 0.75].map(t => {
        return {
            lat: (1 - t) * start[0] + t * end[0] + Math.sin(Math.PI * t) * baseOffset,
            lng: (1 - t) * start[1] + t * end[1]
        };
    });

    const activeStorms = [];

    // Probe the OpenWeatherMap REST API at our trajectory nodes
    if (checkWeather) {
        try {
            const fetchPromises = checkNodes.map(node => 
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${node.lat}&lon=${node.lng}&appid=${OWM_API_KEY}`)
                    .then(res => res.json())
            );

            const weatherResponses = await Promise.all(fetchPromises);

            weatherResponses.forEach((res, index) => {
                if (res && res.weather && res.weather.length > 0) {
                    const conditionCode = res.weather[0].id;
                    
                    // Codes: 2XX Thunderstorm, 5XX Rain, 771 Squalls, 781 Tornado
                    const isSevere = conditionCode < 600 || conditionCode === 771 || conditionCode === 781;

                    if (isSevere) {
                        activeStorms.push({
                            lat: checkNodes[index].lat,
                            lng: checkNodes[index].lng,
                            radius: 8 // Storm impact radius
                        });
                    }
                }
            });
        } catch (err) {
            console.error("OpenWeatherMap probe failed. Resorting to standard vector path.", err);
        }
    }

    // Mathematical arc calculation with physics deflection
    for (let t = 0; t <= 1; t += 1/segments) {
        let lat = (1 - t) * start[0] + t * end[0] + Math.sin(Math.PI * t) * baseOffset;
        let lng = (1 - t) * start[1] + t * end[1];

        // Apply repelling force from any detected Live storms
        activeStorms.forEach(storm => {
            const distLat = lat - storm.lat;
            const distLng = lng - storm.lng;
            const distance = Math.sqrt(distLat * distLat + distLng * distLng);

            const evasionRadius = storm.radius * 1.5;
            if (distance < evasionRadius && distance > 0.1) {
                const pushFactor = (evasionRadius - distance) / evasionRadius;
                
                // Deflect flight path algorithmically to avoid the cloud body
                lat += (distLat / distance) * pushFactor * 6;
                lng += (distLng / distance) * pushFactor * 6;
            }
        });

        points.push([lat, lng]);
    }

    return points;
}
