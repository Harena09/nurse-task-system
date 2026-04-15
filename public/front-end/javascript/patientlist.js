async function loadPatients() {
  try {

 const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
      alert("Please log in first.");
      window.location.href = "login.html";
      return;
    }

    // Fetch patients from backend
    const res = await fetch(`http://localhost:8080/api/patients?nurseId=${user.id}`);
    const patients = await res.json();

    // Sort by _id 
    const sortedPatients = patients.sort((a, b) => {
      //  sort by creation time descending (newest first)
  
      const aDate = new Date(a.createdAt).getTime() || a._id ? 0 : 0;
      const bDate = new Date(b.createdAt).getTime() || b._id ? 0 : 0;
      return bDate - aDate; 
    });

    const container = document.querySelector(".patients-grid");
    if (!container) return;

    // Render patients into patient-card boxes
    container.innerHTML = sortedPatients.map(patient => `
      <div class="patient-card">
        <div class="patient-top">
          <span class="material-symbols-outlined">person</span>
          <h4 class="ward">${patient.ward || "Unknown"}</h4>
        </div>
        <h3 class="patient-name">${patient.fullname || ""}</h3>
        <p class="patient-bednumber">Bed ${patient.bedNumber || ""}</p>
        <p class="condition">${patient.diagnosis || "No diagnosis"}</p>
        <div class="patient-footer">
          <a href="patientDetails.html?id=${patient._id}">View Details</a>
        </div>
      </div>
    `).join("");

  } catch (err) {
    console.error("Error loading patients:", err);
  }
}


document.addEventListener("DOMContentLoaded", loadPatients);


//dashboard task summary section loading
async function loadDashboardPatientSt() {
  try {
    const res = await fetch(`http://localhost:8080/api/patients?nurseId=${user.id}`);
        const patients = await res.json();

    const totalpatients = patients.length;
  
    const totalPatientsEl = document.getElementById("patients-count");

    if (totalPatientsEl) totalPatientsEl.textContent = totalpatients;

  } catch (err) {
    console.error("Error loading dashboard stats:", err);
  }
}

document.addEventListener("DOMContentLoaded", loadDashboardPatientSt);
