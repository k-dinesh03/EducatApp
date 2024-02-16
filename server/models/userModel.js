const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    userType: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        min: 8,
        max: 20
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

