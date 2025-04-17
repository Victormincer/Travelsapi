
// models/User.js - Modelo de usuario
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastLogin: {
        type: Date,
    },
    deviceInfo: {
        deviceId: String,
    }
}, { versionKey: false });

module.exports = mongoose.model('User', UserSchema);
