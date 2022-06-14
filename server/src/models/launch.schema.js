const mongoose = require("mongoose");

const launchSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true
    },
    mission: {
        type: String,
        required: true
    },
    rocket: {
        type: String,
        required: true
    },
    launchDate: {
        type: Date,
        required: true
    },
    destination: {
        type: String,
    },
    customer: {
        type: [String],
        required: true,
        default: ["Nasa", "SpaceX"],
    },
    upcoming: {
        type: Boolean,
        required: true,
        default: true
    },
    success: {
        type: Boolean,
        required: true,
        default: true
    },
    dataSource: {
        type: String,
        enum: ["space-x", "nasa-mission-dashboard"],
        default: "nasa-mission-dashboard",        
    }
});

const Launch = mongoose.model("Launch", launchSchema);

module.exports = { Launch };