
// Get the logged-in user from localStorage
const user = JSON.parse(localStorage.getItem("currentUser"));

if (!user) {
  alert("Please log in first.");
  window.location.href = "login.html";
}

// load all handover records for the logged-in nurse
async function loadHandovers() {
  const list = document.getElementById("handover-list");
  if (!list) return;

  try {
    const res = await fetch(`http://localhost:8080/api/handover?nurseId=${user.id}`);
    const handovers = await res.json();

    if (!Array.isArray(handovers) || handovers.length === 0) {
      list.innerHTML = "<p>No handover records found.</p>";
      return;
    }

    //Sort Handover by date
    const sortedHandovers = handovers.sort((a, b) => {
      const aDate = new Date(a.ShiftDate).getTime();
      const bDate = new Date(b.ShiftDate).getTime();
      return bDate - aDate;
    });


    list.innerHTML = sortedHandovers
      .map((h) => {
        const fromName = h.From?.fullname || "Unknown";
        const toName = h.To?.fullname || "Unknown";
        const date = new Date(h.ShiftDate).toLocaleDateString();

        return `
          <div class="summarybox">
            <h4>Handover Summary</h4>
            <h5>${date}</h5>
            <div class="nurseshifts">
              <p>${fromName}</p>
              <p>${toName}</p>
            </div>
            <a href="handoversummarydetails.html?id=${h._id}">View details</a>
          </div>`;
      })
      .join("");
  } catch (err) {
    console.error("Error loading handovers:", err);
    list.innerHTML = "<p>Error loading handover records.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadHandovers);