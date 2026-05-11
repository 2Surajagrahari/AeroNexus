const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    // ⏰ THE FLEX: This tells MongoDB to auto-delete the document after 300 seconds (5 mins)
    createdAt: { type: Date, default: Date.now, expires: 300 }
});

module.exports = mongoose.model('OTP', otpSchema);