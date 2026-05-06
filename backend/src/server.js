const express = require('express');
const cors = require('cors');
const { runAStarOptimization } = require('./routeEngine');
const { getHazardousNodes } = require('./weatherService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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

        // PASS 1: Calculate the base shortest-distance route (BETA PATH)
        let initialResult = runAStarOptimization(startAirport, endAirport, [], {});

        // 🛡️ BULLETPROOF FIX: Check if nodes are missing OR if a path couldn't be found
        if (initialResult.error || initialResult.status === "Failed") {
            console.error("Pathfinding failed:", initialResult.error || initialResult.message);
            return res.status(404).json({
                error: initialResult.error || initialResult.message || "Route calculation failed."
            });
        }

        // PASS 2: Fetch LIVE weather and WIND data
        const { hazardousNodes, windData } = await getHazardousNodes(initialResult.route);
        const simStorm = req.query.simStorm;

        if (simStorm) {
            let fakeStormId = simStorm.toUpperCase();
            if (!hazardousNodes.includes(fakeStormId)) {
                console.log(`⚠️ DEV OVERRIDE: Spawning artificial storm at ${fakeStormId}`);
                hazardousNodes.push(fakeStormId);
            }
        }

        // PASS 3: Recalculate using WIND PHYSICS and STORM DETOURS (ALPHA PATH)
        let optimizedResult = runAStarOptimization(startAirport, endAirport, hazardousNodes, windData);

        let destWind = windData[endAirport] ? windData[endAirport].speed : 0;
        let isStormAtDest = hazardousNodes.includes(endAirport) ? 1 : 0;
        let delayPrediction = { delay_probability_percent: 0, ai_assessment: "AI Service Offline" };

        try {
            // 🐳 DOCKER FIX: Use dynamic environment variable for ML service URL
            const mlUrl = process.env.ML_URL || 'http://localhost:5000';
            const aiResponse = await fetch(`${mlUrl}/predict?wind=${destWind}&storm=${isStormAtDest}`);
            delayPrediction = await aiResponse.json();
        } catch (err) {
            console.error("⚠️ Python ML Microservice is offline. Skipping delay prediction.");
        }

        // 🔀 THE ALPHA/BETA PAYLOAD UPDATE
        if (hazardousNodes.length > 0) {
            console.log(`🌩️ Rerouting aircraft around live storms at: ${hazardousNodes.join(', ')}`);
            return res.json({
                message: "LIVE WEATHER ALERT: Route dynamically recalculated to avoid severe weather. Fuel optimized.",
                avoidedHazards: hazardousNodes,
                ai_delay_prediction: delayPrediction,
                alphaRoute: optimizedResult, // 👈 THE AI WEATHER DETOUR
                betaRoute: initialResult     // 👈 THE SHORTEST DISTANCE (IGNORING WEATHER)
            });
        }

        console.log("☀️ Skies are clear. Approved for departure.");
        res.json({
            message: "Live weather check passed. Clear skies route approved. Fuel optimized.",
            ai_delay_prediction: delayPrediction,
            alphaRoute: optimizedResult, // 👈 THE NORMAL ROUTE
            betaRoute: initialResult     // 👈 EXACT SAME AS ALPHA WHEN NO STORMS
        });

    } catch (error) {
        console.error("🔥 FATAL SERVER ERROR:", error);
        res.status(500).json({ error: "Internal Server Error during route calculation." });
    }
});


//writing this code for fetching the real time flights that are flying over india 
app.get('/api/traffic', async (req, res) => {
    try {
        console.log("📡 Fetching Live ADS-B Traffic over India...");

        // Bounding Box for India: lamin=8.0, lomin=68.0, lamax=37.0, lomax=97.0
        const response = await fetch('https://opensky-network.org/api/states/all?lamin=8.0&lomin=68.0&lamax=37.0&lomax=97.0');

        if (!response.ok) throw new Error("OpenSky Network rejected the request.");
        const data = await response.json();

        // OpenSky returns a massive, confusing array. We map it into clean objects for React!
        const planes = (data.states || []).map(state => ({
            id: state[0],
            callsign: state[1] ? state[1].trim() : 'UNKNOWN',
            country: state[2],
            lon: state[5],
            lat: state[6],
            altitude_m: state[7] || 0,
            velocity_ms: state[9] || 0,
            heading: state[10] || 0
        })).filter(p => p.lat && p.lon); // Only keep planes with valid GPS coordinates

        res.json({ status: "success", count: planes.length, data: planes });
    } catch (error) {
        console.error("⚠️ Traffic API Error:", error.message);
        res.status(500).json({ error: "Failed to fetch live traffic." });
    }
});


app.listen(PORT, () => {
    console.log(`🚀 AeroNexus Live API running on http://localhost:${PORT}`);
});