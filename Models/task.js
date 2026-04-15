const mongoose = require('mongoose');

// Define the task schema
const TaskSchema = new mongoose.Schema({
   
    TaskTitle: String,
    TaskDescription: String,
    Patient: String,
    Category: String,
    TaskStatus: String,
    Time: String,
    Priority: String,
    Shift: String,
    ShiftDate: Date,
    FlavnextNurse: Boolean,
    nurseId: String,
 
});
    
// Create the user model from schema
const Task = mongoose.model('Task', TaskSchema);
module.exports = Task;
