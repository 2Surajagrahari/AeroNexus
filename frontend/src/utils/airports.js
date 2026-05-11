import allAirportsData from './airports.json';

export function getAirportData(code) {
    const cleanCode = code.toUpperCase().trim();

    // 🚀 DIRECT LOOKUP: Instead of .find(), we just ask the object for the specific key
    const foundAirport = allAirportsData[cleanCode];

    if (foundAirport) {
        return {
            id: cleanCode,
            name: foundAirport.name || "Unknown Airport",
            // Using a fallback just in case your JSON uses 'lon' instead of 'lng'
            coordinates: [foundAirport.lat, foundAirport.lng || foundAirport.lon]
        };
    }

    return null;
}