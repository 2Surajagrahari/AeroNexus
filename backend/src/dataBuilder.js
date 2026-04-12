const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const AIRPORTS_FILE = path.join(__dirname, '../data/airports.csv');
const NAVAIDS_FILE = path.join(__dirname, '../data/navaids.csv');
const OUTPUT_FILE = path.join(__dirname, '../data/indian_airspace.json');

let airspaceGraph = {};
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

async function buildAirspace() {
    console.log("Parsing Indian Airports...");
    await new Promise((resolve) => {
        fs.createReadStream(AIRPORTS_FILE)
            .pipe(csv())
            .on('data', (row) => {
                if (row.Country === 'India') {
                    let id = (row.IATA !== '\\N' && row.IATA !== '') ? row.IATA : row.ICAO;
                    if (id) {
                        airspaceGraph[id] = {
                            id: id,
                            name: row.Name,
                            type: 'AIRPORT',
                            lat: parseFloat(row.Latitude),
                            lon: parseFloat(row.Longitude),
                            connections: []
                        };
                    }
                }
            })
            .on('end', resolve);
    });

    console.log(" Parsing Indian NAVAIDs...");

    await new Promise((resolve) => {
        fs.createReadStream(NAVAIDS_FILE)
            .pipe(csv())
            .on('data', (row) => {
                if (row.iso_country === 'IN' && row.ident) {
                    if (!airspaceGraph[row.ident]) {
                        airspaceGraph[row.ident] = {
                            id: row.ident,
                            name: row.name,
                            type: row.type,
                            lat: parseFloat(row.latitude_deg),
                            lon: parseFloat(row.longitude_deg),
                            connections: []
                        };
                    }
                }
            })
            .on('end', resolve);
    });

    const nodes = Object.keys(airspaceGraph);
    console.log(`Loaded ${nodes.length} total aviation nodes in India.`);
    console.log("Building airway connections (connecting nodes within 400km)...");
    let edgeCount = 0;
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            let nodeA = airspaceGraph[nodes[i]];
            let nodeB = airspaceGraph[nodes[j]];

            let dist = calculateDistance(nodeA.lat, nodeA.lon, nodeB.lat, nodeB.lon);
            if (dist < 400) {
                nodeA.connections.push(nodeB.id);
                nodeB.connections.push(nodeA.id);
                edgeCount++;
            }
        }
    }
    console.log(`Generated ${edgeCount} airway connections!`);
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(airspaceGraph, null, 2));
    console.log(`Saved complete graph to ${OUTPUT_FILE}`);
}

buildAirspace();