const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Note: If your terminal complains about this line, just run 'npm install bcryptjs' 

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'Dispatcher' },
    createdAt: { type: Date, default: Date.now }
});

// 🛡️ The Fixed Password Hashing Hook (No 'next' needed!)
UserSchema.pre('save', async function () {
    // Only scramble the password if it's a brand new account or being changed
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
});

// 🔐 Password Verification Method for Login
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);