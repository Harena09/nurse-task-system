// Import Mongoose library
const mongoose = require("mongoose");

//Define Handover Schema
const HandoverSchema = new mongoose.Schema({
    Shift: {
        type: String,
        required: true,
    },
    
    ShiftDate: {
        type: Date,
        required: true,
    },
    From: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    To: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    Situation: {
        type: String,
        required: true,
    },
    Background: {
        type: String,
        required: true,
    },
    Assessment: {
        type: String,
        required: true,
    },
    Recommendation: {
        type: String,
        required: true,
    },

    TaskSummary: {
        type: String,
        required: true,
    },

    AdditionalNotes: {
        type: String,
        required: true,
    },

    nurseId: String,

    createdAt: {
        type: Date,
        default: Date.now,
    },

});

// Create handover model from schema
const Handover = mongoose.model("Handover", HandoverSchema);
module.exports = Handover;