
const express = require("express");
const Patient = require("../../Models/patients");

const router = express.Router();

// Create a new patient record
router.post("/", async (req, res) => {
    try {
        const patientNew = new Patient({
            fullname: req.body.fullname,
            age: req.body.age,
            dateOfBirth: req.body.dateOfBirth,
            ward: req.body.ward,
            gender: req.body.gender,
            bedNumber: req.body.bedNumber,
            bloodType: req.body.bloodType,
            diagnosis: req.body.diagnosis,
            allergies: req.body.allergies,
            Notes: req.body.Notes,
            nurseId: req.body.nurseId,

        });

        await patientNew.save();
        res.status(201).json(patientNew);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET all patients 
router.get("/", async (req, res) => {
    try {

        const nurseId = req.query.nurseId;

        console.log(" GET tasks request - nurseId:", nurseId);

        //check if nurse ID exists
        if (!nurseId) {
            console.log("No nurseId provided ");
            return res.json([]);
        }

        const patients = await Patient.find({ nurseId });
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET patient by ID
router.get("/:id", async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient)
            return res.status(404).json({ message: "Patient not found" });
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// UPDATE patient by id
router.patch("/:id", async (req, res) => {
    try {
        const patientId = req.params.id;

        const {
            fullname,
            age,
            dateOfBirth,
            ward,
            gender,
            bedNumber,
            bloodType,
            diagnosis,
            allergies,
            Notes,
        } = req.body;

        const updatedPatient = await Patient.findByIdAndUpdate(
            patientId,
            {
                fullname: fullname,
                age: age,
                dateOfBirth: dateOfBirth,
                ward: ward,
                gender: gender,
                bedNumber: bedNumber,
                bloodType: bloodType,
                diagnosis: diagnosis,
                allergies: allergies,
                Notes: Notes,
            },
            { returnDocument: "after" }
        );

        if (!updatedPatient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        res.json({
            message: "Patient updated successfully",
            patient: updatedPatient,
        });
        console.log("patient changee");
    } catch (err) {
        console.log("patient not updated", err);
        res.status(500).json({ error: "Error updating patient" });
    }
});

//DELETE patient by id
router.delete("/:id", async (req, res) => {
    try {
        const patientDelete = await Patient.findByIdAndDelete(req.params.id);
        if (!patientDelete)
            return res.status(404).json({ message: "Patient not found" });
        res.json({ message: "Patient deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;