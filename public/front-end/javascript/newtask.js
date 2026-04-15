

const user = JSON.parse(localStorage.getItem("currentUser"));

if (!user) {
  alert("Please log in first.");
  window.location.href = "login.html";
}

// get task information from front end form
const form = document.getElementById("new-task-form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const taskTitle      = document.getElementById("task-title").value;
    const description    = document.getElementById("task-desc").value;
    const patient        = document.getElementById("task-patient").value;
    const category       = document.getElementById("task-category")?.value;
    const status         = document.getElementById("task-status")?.value;
    const time           = document.getElementById("task-time")?.value ;
    const priority       = document.getElementById("task-priority").value ;
    const shift          = document.getElementById("task-shift").value;
    const shiftDate      = document.getElementById("task-shift-date").value ;
    const flagNextNurse  = document.getElementById("task-flag").checked ;

    // Basic validation
    if (!taskTitle || !patient || !shiftDate) {
      alert("Please fill at least task title, patient, and date.");
      return;

    }

    try {
         // Send task data to backend
      const res = await fetch("http://localhost:8080/api/tasks", {
        method: "POST",
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
          nurseId: user.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Task creation failed");
        return;
      }

      alert("Task created successfully!");
      console.log("task created successfully");
      window.location.href = "tasks.html";

    } catch (err) {

      console.error(err);
      alert("Network error. Please try again.");
      console.log("error in creating task");

    }

  });
}