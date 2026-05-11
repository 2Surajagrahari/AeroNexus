const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
    flightId: { type: String, required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    alphaDistance: { type: Number, required: true },
    betaDistance: { type: Number, required: true },
    hazardsAvoided: { type: Number, default: 0 },
    delayRisk: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Flight', flightSchema);