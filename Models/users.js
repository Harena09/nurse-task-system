const mongoose = require('mongoose');
const bcrypt = require("bcrypt");

// Define the user schema
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
     
    password: {
        type: String,
        required: true
    }
  
});

// Create the user model
const User = mongoose.model('User', userSchema);
module.exports = User;
