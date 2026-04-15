
const express = require("express");
const MoodLog = require("../../Models/Moodlog");

const router = express.Router();

//Get mood log statictics groued by type
router.get("/stats", async (req, res) => {

  try {

    const nurseId = req.query.nurseId;

    if (!nurseId) return res.json([]);

    const result = await MoodLog.aggregate([
      { $match: { nurseId } },
      {
        $group: {
          _id: "$mood",
          count: { $sum: 1 }
        }
      },
    ]);

    const stats = result.map((r) => ({
      mood: r._id,
      count: r.count,
    }));

    res.json(stats);
  } catch (err) {
    console.log("moods stats error", err);
    res.status(500).json({ error: "Error loading mood stats" });
  }
});



// Log a new mood
router.post("/", async (req, res) => {
  try {
    const {
      mood,
      note
    } = req.body;

    if (!mood) {
      return res.status(400).json({ error: "Mood is required" });
    }

    const log = new MoodLog({
      mood,
      note,
      nurseId: req.body.nurseId
    });
    await log.save();

    res.status(201).json(log);
  } catch (err) {
    console.log("mood not saved", err);
    res.status(500).json({ error: "Could not save mood" });
  }
});

// Get the most recent mood information 
router.get("/", async (req, res) => {
  try {

    const nurseId = req.query.nurseId;
    console.log("🔍 GET tasks request - nurseId:", nurseId);

    // check if nurse ID exists
    if (!nurseId) {
      console.log("No nurseId provided");
      return res.json([]);
    }

    const logs = await MoodLog.find({ nurseId }).sort({ createdAt: -1 }).limit(7);// nurse
    res.json(logs);
  } catch (err) {
    console.log("moods not loading", err);
    res.status(500).json({ error: "Error loading moods" });
  }
});

module.exports = router;