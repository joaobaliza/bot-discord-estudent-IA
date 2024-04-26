const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    guildId: { type: String, unique: true },
    ownerId: { type: String, unique: true },
    categoryIa: { type: String }
});

module.exports = mongoose.model('Config', configSchema);