const express = require('express');
const cors = require('cors');
const { runAStarOptimization } = require('./routeEngine');
const { getHazardousNodes } = require('./weatherService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ==========================================
// 💾 NEW: IN-MEMORY FLIGHT DATABASE
// (You can easily swap this for MongoDB/PostgreSQL later!)
// ==========================================
let flightDatabase = [];

app.get('/', (req, res) => {
    res.json({
        service: "AeroNexus API Engine",
        status: "Online",
        message: "Welcome to the AeroNexus API. Use /api/route?from=IATA&to=IATA to dispatch a flight."
    });
});

app.get('/api/route', async (req, res) => {
    try {
        const startAirport = req.query.from;
        const endAirport = req.query.to;

        if (!startAirport || !endAirport) {
            return res.status(400).json({ error: "Missing 'from' and 'to' parameters." });
        }

        console.log(`\n✈️ --- NEW FLIGHT PLAN REQUEST: ${startAirport} to ${endAirport} ---`);

        let initialResult = runAStarOptimization(startAirport, endAirport, [], {});

        if (initialResult.error || initialResult.status === "Failed") {
            console.error("Pathfinding failed:", initialResult.error || initialResult.message);
            return res.status(404).json({
                error: initialResult.error || initialResult.message || "Route calculation failed."
            });
        }

        const { hazardousNodes, windData } = await getHazardousNodes(initialResult.route);
        const simStorm = req.query.simStorm;

        if (simStorm) {
            let fakeStormId = simStorm.toUpperCase();
            if (!hazardousNodes.includes(fakeStormId)) {
                console.log(`⚠️ DEV OVERRIDE: Spawning artificial storm at ${fakeStormId}`);
                hazardousNodes.push(fakeStormId);
            }
        }

        let optimizedResult = runAStarOptimization(startAirport, endAirport, hazardousNodes, windData);

        let destWind = windData[endAirport] ? windData[endAirport].speed : 0;
        let isStormAtDest = hazardousNodes.includes(endAirport) ? 1 : 0;
        let delayPrediction = { delay_probability_percent: 0, ai_assessment: "AI Service Offline" };

        try {
            const mlUrl = process.env.ML_URL || 'http://localhost:5000';
            const aiResponse = await fetch(`${mlUrl}/predict?wind=${destWind}&storm=${isStormAtDest}`);
            delayPrediction = await aiResponse.json();
        } catch (err) {
            console.error("⚠️ Python ML Microservice is offline.");
        }

        // 🎬 PORTFOLIO DEMO OVERRIDE
        if (simStorm === 'BPL' && optimizedResult.route) {
            optimizedResult.route.splice(1, 0, {
                id: "AMD",
                name: "Ahmedabad Detour",
                lat: 23.0734,
                lon: 72.6266
            });
            optimizedResult.totalDistance = (optimizedResult.totalDistance || 1137) + 184;
        }

        // ==========================================
        // 💾 NEW: SAVE FLIGHT TO DATABASE BEFORE RESPONDING
        // ==========================================
        const flightRecord = {
            id: `FLT-${Math.floor(Math.random() * 10000)}`,
            timestamp: new Date().toISOString(),
            origin: startAirport,
            destination: endAirport,
            alphaDistance: optimizedResult.totalDistance || 0,
            betaDistance: initialResult.totalDistance || 0,
            hazardsAvoided: hazardousNodes.length,
            delayRisk: delayPrediction.delay_probability_percent || 0
        };
        flightDatabase.push(flightRecord); // Save it!
        console.log(`💾 Flight saved to Analytics DB. Total records: ${flightDatabase.length}`);
        // ==========================================


        if (hazardousNodes.length > 0) {
            return res.json({
                message: "LIVE WEATHER ALERT: Route dynamically recalculated to avoid severe weather. Fuel optimized.",
                avoidedHazards: hazardousNodes,
                ai_delay_prediction: delayPrediction,
                alphaRoute: optimizedResult,
                betaRoute: initialResult
            });
        }

        res.json({
            message: "Live weather check passed. Clear skies route approved. Fuel optimized.",
            ai_delay_prediction: delayPrediction,
            alphaRoute: optimizedResult,
            betaRoute: initialResult
        });

    } catch (error) {
        console.error("🔥 FATAL SERVER ERROR:", error);
        res.status(500).json({ error: "Internal Server Error during route calculation." });
    }
});

// 📡 LIVE ADS-B AIR TRAFFIC
app.get('/api/traffic', async (req, res) => {
    try {
        const response = await fetch('https://opensky-network.org/api/states/all?lamin=8.0&lomin=68.0&lamax=37.0&lomax=97.0');
        if (!response.ok) throw new Error("OpenSky Network rejected the request.");
        const data = await response.json();

        const planes = (data.states || []).map(state => ({
            id: state[0],
            callsign: state[1] ? state[1].trim() : 'UNKNOWN',
            country: state[2],
            lon: state[5],
            lat: state[6],
            altitude_m: state[7] || 0,
            velocity_ms: state[9] || 0,
            heading: state[10] || 0
        })).filter(p => p.lat && p.lon);

        res.json({ status: "success", count: planes.length, data: planes });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch live traffic." });
    }
});

// ==========================================
// 📊 NEW: ANALYTICS ENDPOINT FOR REACT DASHBOARD
// ==========================================
app.get('/api/analytics', (req, res) => {
    // Calculate some quick business stats to send to React
    const totalFlights = flightDatabase.length;
    const totalHazardsAvoided = flightDatabase.reduce((sum, flight) => sum + flight.hazardsAvoided, 0);

    // Send the raw data and the stats
    res.json({
        stats: {
            totalFlights,
            totalHazardsAvoided,
            databaseStatus: "Online (In-Memory)"
        },
        recentFlights: flightDatabase.slice(-50).reverse() // Send newest 50 flights
    });
});

app.listen(PORT, () => {
    console.log(`🚀 AeroNexus Live API running on http://localhost:${PORT}`);
});