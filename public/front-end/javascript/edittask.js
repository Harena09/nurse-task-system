// When the page loads
document.addEventListener("DOMContentLoaded", async () => {
  // Get the task id 
  const urlParams = new URLSearchParams(window.location.search);
  const taskId = urlParams.get("id");


  if (!taskId) {
    alert("No task ID provided");
    window.location.href = "/tasks.html";
    return;
  }

  try {
    // get the task from the backend
    const res = await fetch(`http://localhost:8080/api/tasks/${taskId}`);
    const task = await res.json();

   
    if (!res.ok) {
      alert("Task not found");
      window.location.href = "/tasks.html";
      return;
    }

    //  Fill the form with the existing task data
    document.getElementById("task-title").value = task.TaskTitle;
    document.getElementById("task-desc").value = task.TaskDescription;
    document.getElementById("task-patient").value = task.Patient;
    document.getElementById("task-category").value = task.Category ;
    document.getElementById("task-status").value = task.TaskStatus;
    document.getElementById("task-time").value = task.Time ;
    document.getElementById("task-priority").value = task.Priority ;
    document.getElementById("task-shift").value = task.Shift;
document.getElementById("task-shift-date").value = task.ShiftDate
  ? new Date(task.ShiftDate).toISOString().split("T")[0]
  : "";
    document.getElementById("task-flag").checked = task.FlavnextNurse || false;
  } catch (err) {
    console.error("Error loading task for edit:", err);
    alert("Could not load task data");
    window.location.href = "/tasks.html";
  }
});



document.getElementById("new-task-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get the task id
  const urlParams = new URLSearchParams(window.location.search);
  const taskId = urlParams.get("id");

  if (!taskId) {
    alert("No task ID provided");
    return;
  }

  // Read the current values from the form
  const taskTitle = document.getElementById("task-title").value;
  const description = document.getElementById("task-desc").value;
  const patient = document.getElementById("task-patient").value;
  const category = document.getElementById("task-category").value;
  const status = document.getElementById("task-status").value;
  const time = document.getElementById("task-time").value;
  const priority = document.getElementById("task-priority").value;
  const shift = document.getElementById("task-shift").value;
  const shiftDate = document.getElementById("task-shift-date").value;
  const flagNextNurse = document.getElementById("task-flag").checked;

  // Basic validation
  if (!taskTitle || !patient || !shiftDate) {
    alert("Please fill at least task title, patient, and date.");
    return;
  }


  // Send updated data to backend
  try {
    const res = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Could not update task");
      return;
    }

    alert("Task updated successfully!");
    window.location.href = "tasks.html"; 
  } catch (err) {
    console.error("Error updating task:", err);
    alert("Network error");
  }
});



