
const { Router } = require('express');
const mongoose = require('mongoose');

//Create Patient schema
const PatientSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  ward: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  bedNumber: {
    type: String,
    required: true
  },
  bloodType: {
    type: String,
    required: true
  },
  diagnosis: {
    type: String,
    required: true
  },
  allergies: {
    type: String,
    required: true
  },
  Notes: {
    type: String,
    required: true
  },
  nurseId: String,
});

// Create Patient model from schema
const Patient = mongoose.model("Patient", PatientSchema);
//export model
module.exports = Patient;