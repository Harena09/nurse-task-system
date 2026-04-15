// Get logged-in user from localStorage
const user = JSON.parse(localStorage.getItem("currentUser"));

if (!user) {
  alert("Please log in first.");
  window.location.href = "login.html";
}


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("handover-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

      // Get handover form
    const payload = {
      shift: document.getElementById("shift").value,
      shiftDate: document.getElementById("shiftDate").value,
      from: document.getElementById("fromNurse").value,
      to: document.getElementById("toNurse").value,
      situation: document.getElementById("situation").value,
      background: document.getElementById("background").value,
      assessment: document.getElementById("assessment").value,
      recommendation: document.getElementById("recommendation").value,
      taskSummary: document.getElementById("taskSummary").value,
      additionalNotes: document.getElementById("additionalNotes").value,
      nurseId: user.id

    };

    try {
          // Send handover to backend
      const res = await fetch("http://localhost:8080/api/handover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Could not send handover");
        console.log("could not send handover")
        return;
      }

      const result = await res.json();
      alert("Handover sent successfully!");
      window.location.href = "dashboard.html";
    } catch (err) {
      console.error("Error sending handover:", err);
      alert("Network error");
    }
  });
});


