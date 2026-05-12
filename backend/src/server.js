const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Models & Services
const Flight = require('./models/Flight');
const User = require('./models/User');
const OTP = require('./models/OTP');
const { runAStarOptimization } = require('./routeEngine');
const { getHazardousNodes } = require('./weatherService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ==========================================
// 🔌 DATABASE & EMAIL CONFIGURATION
// ==========================================
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('🟢 Connected to MongoDB Atlas'))
    .catch(err => console.error('🔴 MongoDB Connection Error:', err));

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ==========================================
// 🔐 ENTERPRISE AUTHENTICATION ROUTES
// ==========================================

// 1. Send OTP Email for Registration
app.post('/api/auth/register-request', async (req, res) => {
    try {
        const { email, password, username } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) return res.status(400).json({ error: "Email or username already exists." });

        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

        await OTP.findOneAndDelete({ email });
        await OTP.create({ email, otp: generatedOtp });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'AeroNexus - Verification Code',
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #0a0a0a; color: white; padding: 40px; border-radius: 10px;">
                    <h2 style="color: #10b981;">AeroNexus Access Request</h2>
                    <p>Your authorization code is:</p>
                    <h1 style="letter-spacing: 5px; color: white;">${generatedOtp}</h1>
                    <p style="color: #666;">This code expires in 5 minutes.</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ message: "OTP sent successfully to your email!" });

    } catch (error) {
        console.error("Email Error:", error);
        res.status(500).json({ error: "Failed to process registration request." });
    }
});

// 2. Verify OTP and Create User
app.post('/api/auth/verify-otp', async (req, res) => {
    try {
        const { email, username, password, otp } = req.body;

        const validOtp = await OTP.findOne({ email, otp });
        if (!validOtp) return res.status(400).json({ error: "Invalid or expired OTP." });

        const newUser = new User({ email, username, password, role: 'Dispatcher' });
        await newUser.save();

        await OTP.findOneAndDelete({ email });

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            message: "Registration successful!",
            token,
            user: { username: newUser.username, email: newUser.email, role: newUser.role }
        });

    } catch (error) {
        // 👇 This will now accurately catch OTP saving errors and print them!
        console.error("🔥 OTP VERIFICATION CRASH:", error);
        res.status(500).json({ error: `DATABASE CRASH: ${error.message}` });
    }
});

// 3. Standard Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ $or: [{ username: username }, { email: username }] });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        res.json({
            message: "Login successful",
            token,
            user: { username: user.username, role: user.role }
        });
    } catch (error) {
        // 👇 Fixed this block so it doesn't say "OTP verification failed" on a login error
        console.error("Login Error:", error);
        res.status(500).json({ error: "Server authentication error" });
    }
});
// 4. Get Current Logged-In User Profile
app.get('/api/auth/me', async (req, res) => {
    try {
        // Grab the token from the request headers
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Access Denied. No token provided." });

        // Decode the token to get the user's ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user in the database (but EXCLUDE the password for security)
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(404).json({ error: "User not found." });

        res.json(user);
    } catch (error) {
        console.error("Profile Fetch Error:", error);
        res.status(401).json({ error: "Invalid or expired token." });
    }
});

// ==========================================
// ✈️ FLIGHT & DATA ROUTES
// ==========================================

app.get('/api/route', async (req, res) => {
    try {
        const startAirport = req.query.from;
        const endAirport = req.query.to;

        if (!startAirport || !endAirport) {
            return res.status(400).json({ error: "Missing 'from' and 'to' parameters." });
        }

        let initialResult = runAStarOptimization(startAirport, endAirport, [], {});

        if (initialResult.error || initialResult.status === "Failed") {
            return res.status(404).json({ error: initialResult.error || "Route calculation failed." });
        }

        const { hazardousNodes, windData } = await getHazardousNodes(initialResult.route);
        let optimizedResult = runAStarOptimization(startAirport, endAirport, hazardousNodes, windData);

        // Save to Database
        const newFlight = new Flight({
            flightId: `FLT-${Math.floor(Math.random() * 10000)}`,
            origin: startAirport,
            destination: endAirport,
            alphaDistance: optimizedResult.totalDistance || 0,
            betaDistance: initialResult.totalDistance || 0,
            hazardsAvoided: hazardousNodes.length
        });
        await newFlight.save().catch(err => console.error("DB Save Error:", err));

        res.json({
            message: hazardousNodes.length > 0 ? "LIVE WEATHER ALERT: Route dynamically recalculated." : "Clear skies route approved.",
            avoidedHazards: hazardousNodes,
            alphaRoute: optimizedResult,
            betaRoute: initialResult
        });

    } catch (error) {
        console.error("SERVER ERROR:", error);
        res.status(500).json({ error: "Internal Server Error." });
    }
});

app.get('/api/traffic', async (req, res) => {
    try {
        const response = await fetch('https://opensky-network.org/api/states/all?lamin=8.0&lomin=68.0&lamax=37.0&lomax=97.0');
        if (!response.ok) throw new Error("OpenSky Network rejected the request.");
        const data = await response.json();

        const planes = (data.states || []).map(state => ({
            id: state[0],
            callsign: state[1] ? state[1].trim() : 'UNKNOWN',
            lon: state[5],
            lat: state[6]
        })).filter(p => p.lat && p.lon);

        res.json({ status: "success", count: planes.length, data: planes });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch traffic." });
    }
});

app.get('/api/analytics', async (req, res) => {
    try {
        const totalFlights = await Flight.countDocuments();
        const hazardAgg = await Flight.aggregate([{ $group: { _id: null, total: { $sum: "$hazardsAvoided" } } }]);
        const totalHazardsAvoided = hazardAgg.length > 0 ? hazardAgg[0].total : 0;
        const recentFlights = await Flight.find().sort({ timestamp: -1 }).limit(50);

        res.json({ stats: { totalFlights, totalHazardsAvoided }, recentFlights });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch analytics." });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 AeroNexus Chal pda hai on http://localhost:${PORT}`);
});