//
const express = require("express");
const router = express.Router();
const Task = require("../../Models/task");

// POST create new task
router.post("/", async (req, res) => {
  try {
    const {
      taskTitle,
      description,
      patient,
      category,
      status,
      time,
      priority,
      shift,
      shiftDate,
      flagNextNurse,
    } = req.body;

    const task = new Task({
      TaskTitle: taskTitle,
      TaskDescription: description,
      TaskStatus: status,
      Patient: patient,
      Category: category,
      Time: time,
      Priority: priority,
      Shift: shift,
      ShiftDate: shiftDate,
      FlavnextNurse: flagNextNurse,
      nurseId: req.body.nurseId,

    });

    await task.save();
    console.log("task created");
    res.status(201).json({ message: "Task created", _id: task._id });
  } catch (err) {
    console.log("task not saved", err);
    res.status(500).json({ error: "Could not save task" });
  }
});

// GET all tasks
router.get("/", async (req, res) => {
  try {

    const nurseId = req.query.nurseId;

    console.log(" GET tasks - nurseId:", nurseId);


    if (!nurseId) {
      console.log("No nurseId provided");
      return res.json([]);
    }

    //sort tasks by date
    const tasks = await Task.find({ nurseId }).sort({ Time: 1 });
    console.log(`Found ${tasks.length} tasks`);


    const allTasks = await Task.find({});
    console.log("ALL tasks have nurseId:", allTasks.map(t => t.nurseId));


    res.json(tasks);


  } catch (err) {
    console.log("task not loading", err);
    res.status(500).json({ error: "Error loading tasks" });
  }
});


// GET one task by id
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    console.log("task not found", err);
    res.status(500).json({ error: "Error loading task" });
  }
});



// UPDATE  task by id
router.patch("/:id", async (req, res) => {
  try {
    const taskId = req.params.id;

    const {
      taskTitle,
      description,
      patient,
      category,
      status,
      time,
      priority,
      shift,
      shiftDate,
      flagNextNurse,
    } = req.body;

    // Find by id and update fields, return the updated task
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        TaskTitle: taskTitle,
        TaskDescription: description,
        TaskStatus: status,
        Patient: patient,
        Category: category,
        Time: time,
        Priority: priority,
        Shift: shift,
        ShiftDate: shiftDate,
        FlavnextNurse: flagNextNurse,
      },
      { returnDocument: 'after' }

    );


    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task updated successfully", task: updatedTask });
    console.log("tache changee")
  } catch (err) {
    console.log("task not updated", err);
    res.status(500).json({ error: "Error updating task" });
  }
});




//delete task by ID
router.delete("/:id", async (req, res) => {

  try {
    const deleteTask = await Task.findByIdAndDelete(req.params.id);

    if (!deleteTask) {
      return res.status(404).json({ error: "Task to be deleted not found" });
    }

    res.json({ message: "Task deleted successfully" });


  } catch (err) {

    console.log("task not deleted", err);
    res.status(500).json({ error: "Error deleting task" });

  }

});


module.exports = router;

