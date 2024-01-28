const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    birthDate: {
        type: Date,
        required: true
    },
    ssnumber: {
        type: Number,
        required: true
    },
});

module.exports = Record = mongoose.model('records', RecordSchema);