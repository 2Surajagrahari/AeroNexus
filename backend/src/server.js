const express = require('express');
const cors = require('cors');
const { runAStarOptimization } = require('./routeEngine');
const { getHazardousNodes } = require('./weatherService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// A simple health-check route for the root URL
app.get('/', (req, res) => {
    res.json({ 
        service: "AeroNexus API Engine",
        status: "Online",
        message: "Welcome to the AeroNexus API. Use /api/route?from=IATA&to=IATA to dispatch a flight."
    });
});

app.get('/api/route', async (req, res) => {
    const startAirport = req.query.from;
    const endAirport = req.query.to;

    if (!startAirport || !endAirport) {
        return res.status(400).json({ error: "Missing 'from' and 'to' parameters." });
    }

    console.log(`\n✈️ --- NEW FLIGHT PLAN REQUEST: ${startAirport} to ${endAirport} ---`);
    
    // PASS 1: Calculate the base shortest-distance route (No wind data yet)
    let initialResult = runAStarOptimization(startAirport, endAirport, [], {});

    if (initialResult.error) {
        return res.status(404).json(initialResult);
    }
    
    // PASS 2: Fetch LIVE weather and WIND data for the proposed route
    // Notice how we destructure the object returned by our new weatherService!
    const { hazardousNodes, windData } = await getHazardousNodes(initialResult.route);
    const simStorm = req.query.simStorm;
    if (simStorm) {
        let fakeStormId = simStorm.toUpperCase();
        if (!hazardousNodes.includes(fakeStormId)) {
            console.log(`⚠️ DEV OVERRIDE: Spawning artificial storm at ${fakeStormId}`);
            hazardousNodes.push(fakeStormId);
        }
    }
    // PASS 3: Recalculate using WIND PHYSICS and STORM DETOURS
    // We run this to get the exact fuel burn, even if skies are clear!
    let optimizedResult = runAStarOptimization(startAirport, endAirport, hazardousNodes, windData);

    let destWind = windData[endAirport] ? windData[endAirport].speed : 0;
    let isStormAtDest = hazardousNodes.includes(endAirport) ? 1 : 0;
    let delayPrediction = { delay_probability_percent: 0, ai_assessment: "AI Service Offline" };

    try {
        const aiResponse = await fetch(`http://localhost:5000/predict?wind=${destWind}&storm=${isStormAtDest}`);
        delayPrediction = await aiResponse.json();
    } catch (err) {
        console.error("⚠️ Python ML Microservice is offline. Skipping delay prediction.");
    }

    if (hazardousNodes.length > 0) {
        console.log(`🌩️ Rerouting aircraft around live storms at: ${hazardousNodes.join(', ')}`);
        return res.json({
            message: "LIVE WEATHER ALERT: Route dynamically recalculated to avoid severe weather. Fuel optimized.",
            avoidedHazards: hazardousNodes,
            ai_delay_prediction: delayPrediction, // 👈 Attached the AI data!
            data: optimizedResult
        });
    }
    
    console.log("☀️ Skies are clear. Approved for departure with wind-optimized fuel calculation.");
    res.json({
        message: "Live weather check passed. Clear skies route approved. Fuel optimized.",
        ai_delay_prediction: delayPrediction, // 👈 Attached the AI data!
        data: optimizedResult
    });
});

app.listen(PORT, () => {
    console.log(`🚀 AeroNexus Live API running on http://localhost:${PORT}`);
});