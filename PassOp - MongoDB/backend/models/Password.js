const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
    website: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Password', passwordSchema);
