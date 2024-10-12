// backend/models/users.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const connectDB = require("../db");

connectDB().catch((error) => {
  console.error("Database connection error in model:", error);
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
        required: false,
    },
    email: {
        type: String,
        required: true, // Typically, email should be required
        unique: true,
    },
    password: {
        type: String,
        required: true // Password should be required
    },
    phone: {
        type: String,
        required: false,
    },
    image: {
        type: String,
        required: false,
    },
    created: {
        type: Date,
        default: Date.now,
    }
});

// Hash the password before saving the user
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to validate password
userSchema.methods.isValidPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
