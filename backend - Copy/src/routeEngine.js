const fs = require('fs');
const path = require('path');
const graphPath = path.join(__dirname, '../data/indian_airspace.json');
const airspaceGraph = JSON.parse(fs.readFileSync(graphPath, 'utf8'));

class PriorityQueue {
    constructor() { this.elements = []; }
    enqueue(item, priority) {
        this.elements.push({ item, priority });
        this.elements.sort((a, b) => a.priority - b.priority);
    }
    dequeue() { return this.elements.shift().item; }
    isEmpty() { return this.elements.length === 0; }
}

function calculateHaversine(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const toRad = (angle) => angle * (Math.PI / 180);
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function calculateBearing(lat1, lon1, lat2, lon2) {
    const toRad = (angle) => angle * (Math.PI / 180);
    const toDeg = (angle) => angle * (180 / Math.PI);
    const lat1Rad = toRad(lat1);
    const lat2Rad = toRad(lat2);
    const dLon = toRad(lon2 - lon1);
    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    return (toDeg(Math.atan2(y, x)) + 360) % 360; 
}

function runAStarOptimization(startId, goalId, activeStorms = [], windData = {}) {
    startId = startId.toUpperCase();
    goalId = goalId.toUpperCase();

    if (!airspaceGraph[startId] || !airspaceGraph[goalId]) {
        return { error: `Points ${startId} or ${goalId} not found.` };
    }

    // ✈️ 3D PHYSICS CONSTANTS
    const CRUISE_SPEED_KMH = 850;
    const ALTITUDES = [25000, 35000]; // Flight levels: 25k ft and 35k ft
    const FUEL_BURN = {
        25000: 2700, // Thicker air = more drag = 2700 kg/hr
        35000: 2200  // Thinner air = less drag = 2200 kg/hr
    };
    const CLIMB_PENALTY_KG = 900; // Extra fuel required to climb from 25k to 35k
    const STORM_TOP_ALTITUDE = 30000; // Storms top out at 30k feet!

    let frontier = new PriorityQueue();
    let cameFrom = {};
    let costSoFar = {};

    // 🌐 STATE SPACE EXPANSION: We now track NodeID AND Altitude (e.g., "DEL_25000")
    let startLow = `${startId}_25000`;
    let startHigh = `${startId}_35000`;

    frontier.enqueue(startLow, 0);
    frontier.enqueue(startHigh, CLIMB_PENALTY_KG); // Assume we burn fuel if we climb to 35k immediately

    cameFrom[startLow] = null;
    cameFrom[startHigh] = null;
    costSoFar[startLow] = 0;
    costSoFar[startHigh] = CLIMB_PENALTY_KG;

    let finalGoalKey = null;

    while (!frontier.isEmpty()) {
        let currentKey = frontier.dequeue();
        let [currentId, currentAltStr] = currentKey.split('_');
        let currentAlt = parseInt(currentAltStr);

        if (currentId === goalId) {
            finalGoalKey = currentKey;
            break;
        }

        let neighbors = airspaceGraph[currentId].connections;
        for (let nextId of neighbors) {
            let nextNode = airspaceGraph[nextId];
            
            let distanceToNext = calculateHaversine(
                airspaceGraph[currentId].lat, airspaceGraph[currentId].lon,
                nextNode.lat, nextNode.lon
            );

            let bearing = calculateBearing(
                airspaceGraph[currentId].lat, airspaceGraph[currentId].lon,
                nextNode.lat, nextNode.lon
            );

            let wind = windData[nextId] || { speed: 0, deg: 0 };
            let angleDiffRad = (bearing - wind.deg) * (Math.PI / 180);
            let windComponent = wind.speed * Math.cos(angleDiffRad); 
            let groundSpeed = Math.max(CRUISE_SPEED_KMH + windComponent, 100);

            let flightTimeHours = distanceToNext / groundSpeed;

            // 🔀 THE 3D DECISION TREE: Test both staying at current altitude OR changing altitude
            for (let nextAlt of ALTITUDES) {
                let nextKey = `${nextId}_${nextAlt}`;
                
                // Calculate fuel burn for this specific altitude
                let fuelBurnKg = flightTimeHours * FUEL_BURN[nextAlt];
                
                // Add penalty if the algorithm decides to climb
                let climbCost = (nextAlt > currentAlt) ? CLIMB_PENALTY_KG : 0;

                // 🌩️ THE 3D WEATHER BYPASS LOGIC
                let weatherPenalty = 0;
                if (activeStorms.includes(nextId)) {
                    if (nextAlt <= STORM_TOP_ALTITUDE) {
                        weatherPenalty = 50000.0; // 💥 Hit the storm! Massive penalty.
                    } else {
                        weatherPenalty = 0; // ✈️ Flew OVER the storm at 35k ft! No penalty.
                    }
                }

                let segmentCost = fuelBurnKg + climbCost + weatherPenalty;
                let newCost = costSoFar[currentKey] + segmentCost;

                if (!(nextKey in costSoFar) || newCost < costSoFar[nextKey]) {
                    costSoFar[nextKey] = newCost;

                    let distanceToGoal = calculateHaversine(
                        nextNode.lat, nextNode.lon,
                        airspaceGraph[goalId].lat, airspaceGraph[goalId].lon
                    );
                    let heuristicMinFuel = (distanceToGoal / 1000) * FUEL_BURN[35000]; 
                    
                    frontier.enqueue(nextKey, newCost + heuristicMinFuel);
                    cameFrom[nextKey] = currentKey;
                }
            }
        }
    }

    if (!finalGoalKey) return { status: "Failed", message: "No safe route found." };

    // 🔙 RECONSTRUCT THE 3D PATH
    let currentKey = finalGoalKey;
    let pathNodes = [];
    let totalDistance = 0;

    while (currentKey !== null) {
        let [id, altStr] = currentKey.split('_');
        let nodeData = airspaceGraph[id];
        
        pathNodes.unshift({
            id: id,
            name: nodeData.name,
            type: nodeData.type,
            lat: nodeData.lat,
            lon: nodeData.lon,
            altitude_ft: parseInt(altStr) // 📊 Include altitude in the final JSON!
        });
        
        if (cameFrom[currentKey] !== null) {
            let [prevId, prevAlt] = cameFrom[currentKey].split('_');
            let prevNode = airspaceGraph[prevId];
            totalDistance += calculateHaversine(prevNode.lat, prevNode.lon, nodeData.lat, nodeData.lon);
        }
        currentKey = cameFrom[currentKey];
    }

    return {
        status: "Success",
        start: startId,
        destination: goalId,
        totalDistanceKm: totalDistance.toFixed(2),
        estimatedFuelBurnKg: costSoFar[finalGoalKey].toFixed(2),
        waypointCount: pathNodes.length,
        route: pathNodes
    };
}

module.exports = { runAStarOptimization };