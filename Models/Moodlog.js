// Import Mongoose library
const mongoose = require("mongoose");

//Define Moodlog Schema
const MoodLogSchema = new mongoose.Schema(
  {
    mood: { type: String, required: true, enum: ["great", "good", "neutral", "stressed", "anxious", "exhausted", "bad"] },
    note: { type: String },
    nurseId: String,

  },
  
  { timestamps: true } 
);

// Create Moodlog model from schema
const MoodLog = mongoose.model("MoodLog", MoodLogSchema);
module.exports = MoodLog;
