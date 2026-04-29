// Mock Database of major Indian and Global Airports

export const airports = {
    // INDIA (Major Hubs & Regional)
    "DEL": { name: "New Delhi", lat: 28.5562, lng: 77.1000 },
    "BOM": { name: "Mumbai", lat: 19.0896, lng: 72.8656 },
    "BLR": { name: "Bengaluru", lat: 13.1986, lng: 77.7066 },
    "HYD": { name: "Hyderabad", lat: 17.2403, lng: 78.4294 },
    "MAA": { name: "Chennai", lat: 12.9941, lng: 80.1709 },
    "CCU": { name: "Kolkata", lat: 22.6520, lng: 88.4463 },
    "AMD": { name: "Ahmedabad", lat: 23.0734, lng: 72.6266 },
    "PNQ": { name: "Pune", lat: 18.5793, lng: 73.9089 },
    "GOI": { name: "Goa (Dabolim)", lat: 15.3808, lng: 73.8313 },
    "COK": { name: "Kochi", lat: 10.1518, lng: 76.3930 },
    "TRV": { name: "Thiruvananthapuram", lat: 8.4821, lng: 76.9201 },
    "JAI": { name: "Jaipur", lat: 26.8242, lng: 75.8011 },
    "LKO": { name: "Lucknow", lat: 26.7606, lng: 80.8893 },
    "ATQ": { name: "Amritsar", lat: 31.7096, lng: 74.7973 },
    "IXC": { name: "Chandigarh", lat: 30.6735, lng: 76.7885 },
    "SXR": { name: "Srinagar", lat: 33.9870, lng: 74.7743 },
    "VNS": { name: "Varanasi", lat: 25.4520, lng: 82.8593 },
    "PAT": { name: "Patna", lat: 25.5913, lng: 85.0880 },
    "BBI": { name: "Bhubaneswar", lat: 20.2444, lng: 85.8178 },
    "GAU": { name: "Guwahati", lat: 26.1061, lng: 91.6033 },

    // GLOBAL INTERSECTION HUBS
    "LHR": { name: "London", lat: 51.4700, lng: -0.4543 },
    "JFK": { name: "New York", lat: 40.6413, lng: -73.7781 },
    "DXB": { name: "Dubai", lat: 25.2532, lng: 55.3657 },
    "SIN": { name: "Singapore", lat: 1.3644, lng: 103.9915 },
    "NRT": { name: "Tokyo", lat: 35.7647, lng: 140.3863 },
    "SYD": { name: "Sydney", lat: -33.9399, lng: 151.1753 }
};

export function getAirportData(code) {
    const cleanCode = code.toUpperCase().trim();
    if (airports[cleanCode]) {
        return {
            id: cleanCode,
            name: airports[cleanCode].name,
            coordinates: [airports[cleanCode].lat, airports[cleanCode].lng]
        };
    }
    return null;
}
