document.addEventListener("DOMContentLoaded", async () => {
    // Get handover ID
  const urlParams = new URLSearchParams(window.location.search);
  const handoverId = urlParams.get("id");

  if (!handoverId) {
    alert("No handover ID provided");
    window.location.href = "handoversummary.html";
    return;
  }

     // Fetch handover data from backend
  try {
    const res = await fetch(`http://localhost:8080/api/handover/${handoverId}`);
    const handover = await res.json();

    if (!res.ok) {
      alert("Handover not found");
      window.location.href = "handoversummary.html";
      return;
    }

       // Fill form fields with existing handover data
    document.getElementById("handover-shift").value = handover.Shift || "";
    document.getElementById("handover-shift-date").value = handover.ShiftDate
      ? new Date(handover.ShiftDate).toISOString().split("T")[0]
      : "";

    document.getElementById("handover-from").value =
      handover.From?.fullname || "";
    document.getElementById("handover-to").value =
      handover.To?.fullname || "";

    document.getElementById("handover-situation").value = handover.Situation || "";
    document.getElementById("handover-background").value = handover.Background || "";
    document.getElementById("handover-assessment").value = handover.Assessment || "";
    document.getElementById("handover-recommendation").value = handover.Recommendation || "";
    document.getElementById("handover-task-summary").value = handover.TaskSummary || "";
    document.getElementById("handover-additional-notes").value = handover.AdditionalNotes || "";
    
  } catch (error) {
    console.error("Error loading handover:", error);
    alert("Could not load handover data");
  }
});


// Save after Submit
document.getElementById("edit-handover-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const handoverId = urlParams.get("id");

  try {
    const res = await fetch(`http://localhost:8080/api/handover/${handoverId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        shift: document.getElementById("handover-shift").value,
        shiftDate: document.getElementById("handover-shift-date").value,
        from: document.getElementById("handover-from").value,
        to: document.getElementById("handover-to").value,
        situation: document.getElementById("handover-situation").value,
        background: document.getElementById("handover-background").value,
        assessment: document.getElementById("handover-assessment").value,
        recommendation: document.getElementById("handover-recommendation").value,
        taskSummary: document.getElementById("handover-task-summary").value,
        additionalNotes: document.getElementById("handover-additional-notes").value,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Could not update handover");
      return;
    }

    alert("Handover updated successfully!");
    window.location.href = "handoversummary.html";
  } catch (error) {
    console.error("Error updating handover:", error);
    alert("Network error");
  }
});


//delete handover
const deleteBtn = document.getElementById("delete-handover-btn");
if (deleteBtn) {
  deleteBtn.addEventListener("click", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const handoverId = urlParams.get("id");

    if (!confirm("Are you sure you want to delete this handover?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:8080/api/handover/${handoverId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Could not delete handover");
        return;
      }

      alert("Handover deleted successfully!");
      window.location.href = "handoversummary.html";
    } catch (error) {
      console.error("Error deleting handover:", error);
      alert("Network error");
    }
  });
}