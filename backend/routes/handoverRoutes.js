

const express = require("express");
const Handover = require("../../Models/handover");
const User = require("../../Models/users");

const router = express.Router();

// POST create new handover
router.post("/", async (req, res) => {
    try {
        const {
            shift: Shift,
            shiftDate: ShiftDate,
            from: From,
            to: To,
            situation: Situation,
            background: Background,
            assessment: Assessment,
            recommendation: Recommendation,
            taskSummary: TaskSummary,
            additionalNotes: AdditionalNotes,
            nurseId,
        } = req.body;

        const fromUser = await User.findOne({ fullname: From });
        const toUser = await User.findOne({ fullname: To });

        if (!fromUser) {
            return res.status(400).json({ error: `Nurse "${From}" not found` });//ca marche pas
        }
        if (!toUser) {
            return res.status(400).json({ error: `Nurse "${To}" not found` });
        }

        //create new handover document
        const handover = new Handover({
            Shift,
            ShiftDate,
            From: fromUser._id,
            To: toUser._id,
            Situation,
            Background,
            Assessment,
            Recommendation,
            TaskSummary,
            AdditionalNotes,
            nurseId
        });

        await handover.save();
        console.log("handover created");
        res.status(201).json({ message: "Handover created", _id: handover._id });
    } catch (err) {
        console.log("handover not saved", err);
        res.status(500).json({ error: "Could not save handover" });
    }
});

// GET all handovers
router.get("/", async (req, res) => {


    try {
        const nurseId = req.query.nurseId;

        console.log(" GET tasks request", nurseId);

        // If no nurseId, return an empty array 
        if (!nurseId) {
            console.log("No nurseId provided");
            return res.json([]);
        }


        const handovers = await Handover.find({

            $or: [
                { nurseId },      //created by current user 
                { To: nurseId }    // sent to user
            ]
        })
            .populate("From", "fullname")
            .populate("To", "fullname")
            .sort({ ShiftDate: -1 });


        res.json(handovers);
    } catch (err) {
        console.log("handover not loading", err);
        res.status(500).json({ error: "Error loading handovers" });
    }
});

// GET one handover by id
router.get("/:id", async (req, res) => {
    try {
        const handover = await Handover.findById(req.params.id)
            .populate("From", "fullname")
            .populate("To", "fullname");
        if (!handover) {
            return res.status(404).json({ error: "Handover not found" });
        }

        res.json(handover);
    } catch (err) {
        console.log("handover not found", err);
        res.status(500).json({ error: "Error loading handover" });
    }
});

// PATCH handover by id
router.patch("/:id", async (req, res) => {
    try {
        const handoverId = req.params.id;

        const {
            shift: Shift,
            shiftDate: ShiftDate,
            from: From,
            to: To,
            situation: Situation,
            background: Background,
            assessment: Assessment,
            recommendation: Recommendation,
            taskSummary: TaskSummary,
            additionalNotes: AdditionalNotes,
        } = req.body;


        const fromUser = await User.findOne({ fullname: From });
        const toUser = await User.findOne({ fullname: To });

        if (!fromUser) {
            return res.status(400).json({ error: `Nurse "${From}" not found` });
        }
        if (!toUser) {
            return res.status(400).json({ error: `Nurse "${To}" not found` });
        }

        //update handover information
        const updatedHandover = await Handover.findByIdAndUpdate(
            handoverId,
            {
                Shift,
                ShiftDate,
                From: fromUser._id,
                To: toUser._id,
                Situation,
                Background,
                Assessment,
                Recommendation,
                TaskSummary,
                AdditionalNotes,
            },
            { returnDocument: "after" }
        );

        if (!updatedHandover) {
            return res.status(404).json({ error: "Handover not found" });
        }

        res.json({ message: "Handover updated successfully", handover: updatedHandover });
    } catch (err) {
        console.log("handover not updated", err);
        res.status(500).json({ error: "Error updating handover" });
    }
});

// DELETE handover by id
router.delete("/:id", async (req, res) => {
    try {
        const deleteHandover = await Handover.findByIdAndDelete(req.params.id);

        if (!deleteHandover) {
            return res.status(404).json({ error: "Handover to be deleted not found" });
        }

        res.json({ message: "Handover deleted successfully" });
    } catch (err) {
        console.log("handover not deleted", err);
        res.status(500).json({ error: "Error deleting handover" });
    }
});



module.exports = router;