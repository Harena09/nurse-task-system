async function loadTasks() {
  try {

    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      alert("Please log in first.");
      window.location.href = "login.html";
      return;
    }


    const res = await fetch(`http://localhost:8080/api/tasks?nurseId=${user.id}`);
    const tasks = await res.json();

    // Sort by Time (earliest on top)
    const sortedTasks = tasks.sort((a, b) => {
      return a.Time.localeCompare(b.Time);
    });

    const toDobody = document.getElementById("tasks-table-body");
    const completedbody = document.getElementById("completed-tasks");

    if (!toDobody || !completedbody) return;

    // Filter tasks by status
    const todoTasks = sortedTasks.filter(task => task.TaskStatus !== "Completed");
    const completedTasks = sortedTasks.filter(task => task.TaskStatus === "Completed");

    // To‑Do table: only non‑Completed tasks
    toDobody.innerHTML = todoTasks.map(task => `
      <tr>
        <td>${task.TaskTitle}</td>
        <td>${task.TaskDescription}</td>
        <td>${task.Patient}</td>
        <td>${task.Category}</td>
        <td>${task.Time}</td>
        <td class="warning-${task.TaskStatus?.toLowerCase()}">${task.TaskStatus}</td>
        <td class="${task.Priority === 'Urgent' ? 'priority-high' : 'priority-low'}">${task.Priority}</td>
        <td>${task.Shift}</td>
        <td>${task.ShiftDate ? new Date(task.ShiftDate).toISOString().split("T")[0] : ""}</td>
        <td>
          <a class="edit-task-link" href="edittask.html?id=${task._id}">Edit</a>
          <a class="delete-task-link" href="#" data-id="${task._id}" style="margin-left: 0.45rem;">Delete</a>
        </td>
      </tr>
    `).join("");

    // Completed table: only Completed tasks
    completedbody.innerHTML = completedTasks.map(task => `
      <tr>
        <td>${task.TaskTitle}</td>
        <td>${task.TaskDescription}</td>
        <td>${task.Patient}</td>
        <td>${task.Category}</td>
        <td>${task.Time}</td>
        <td class="${task.TaskStatus?.toLowerCase()}">${task.TaskStatus}</td>
        <td class="${task.Priority === 'Urgent' ? 'priority-high' : 'priority-low'}">${task.Priority}</td>
        <td>${task.Shift}</td>
        <td>${task.ShiftDate ? new Date(task.ShiftDate).toISOString().split("T")[0] : ""}</td>
        <td>
          <a class="edit-task-link" href="edittask.html?id=${task._id}">Edit</a>
          <a class="delete-task-link" href="#" data-id="${task._id}" style="margin-left: 0.45rem;">Delete</a>
        </td>
      </tr>
    `).join("");

  } catch (err) {
    console.error("Error loading tasks:", err);
  }
}


document.addEventListener("DOMContentLoaded", loadTasks);

//load tasks on dashboard
async function loadDashboardTasks() {



  try {


    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;


    const res = await fetch(`http://localhost:8080/api/tasks?nurseId=${user.id}`);
    const tasks = await res.json();

    // Sort by Time (earliest on top)
    const sortedTasks = tasks.sort((a, b) => {
      return a.Time.localeCompare(b.Time);
    });

    const toDobodydash = document.getElementById("dashboard-table");

    if (!toDobodydash) return;

    // Filter tasks by status
    const todoTasks = sortedTasks.filter(task => task.TaskStatus !== "Completed");
    const completedTasks = sortedTasks.filter(task => task.TaskStatus === "Completed");

    // Render only a few tasks for dashboard
    const dashboardTasks = todoTasks.slice(0, 4)


    // To‑Do table: only non‑Completed tasks
    toDobodydash.innerHTML = dashboardTasks.map(task => `
      <tr>
        <td>${task.TaskDescription}</td>
        <td>${task.Patient}</td>
        <td>${task.Time}</td>
        <td class="warning-${task.TaskStatus?.toLowerCase()}">${task.TaskStatus}</td>

      </tr>
    `).join("");



  } catch (err) {
    console.error("Error loading tasks:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadDashboardTasks);



//dashboard task summary section 
async function loadDashboardStats() {


  try {

    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;
    //fetch task data from back
    const res = await fetch(`http://localhost:8080/api/tasks?nurseId=${user.id}`);
    const tasks = await res.json();

    const totalTasks = tasks.filter(task => task.TaskStatus !== "Completed").length;
    const completedTasks = tasks.filter(task => task.TaskStatus === "Completed").length;
    const urgentTasks = tasks.filter(task => task.Priority === "Urgent").length;

    const totalTasksEl = document.getElementById("total-tasks-count");
    const completedTasksEl = document.getElementById("completed-tasks-count");
    const urgentTasksEl = document.getElementById("urgent-tasks-count");


    if (totalTasksEl) totalTasksEl.textContent = totalTasks;
    if (completedTasksEl) completedTasksEl.textContent = completedTasks;
    if (urgentTasksEl) urgentTasksEl.textContent = urgentTasks;


  } catch (err) {
    console.error("Error loading dashboard stats:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadDashboardStats);


// delete function IS this handler
document.addEventListener("click", async (e) => {

  // If the clicked element is NOT a Delete link, do nothing
  if (!e.target.classList.contains("delete-task-link")) return;

  e.preventDefault();

  const taskId = e.target.dataset.id;
  if (!confirm("Delete this task?")) return;

  console.log("Deleting task with id:", taskId); 

  try {
    const res = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Could not delete task");
      return;
    }

    // This removes the row where the task is located
    e.target.closest("tr").remove();

    alert("Task deleted successfully!");
    console.log("task supprimee");
  } catch (err) {
    console.error("Error deleting task:", err);
    alert("Network error");
    console.log("task pas supprimee");
  }
});





