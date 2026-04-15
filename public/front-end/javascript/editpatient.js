
document.addEventListener("DOMContentLoaded", async () => {
    // Get the patient ID 
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get("id");

    if (!patientId) {
        alert("No patient ID provided");
        window.location.href = "patients.html";
        return;
    }

    try {
        const res = await fetch(`http://localhost:8080/api/patients/${patientId}`);
        const patient = await res.json();

        if (!res.ok) {
            alert("Patient not found");
            window.location.href = "patients.html";
            return;
        }

// Populate form fields with existing patient data
        document.getElementById("patient-title").value = patient.fullname;
        document.getElementById("patient-age").value = patient.age;
        document.getElementById("patient-birthdate").value = patient.dateOfBirth
            ? new Date(patient.dateOfBirth).toISOString().split("T")[0]
            : "";
        document.getElementById("patient-gender").value = patient.gender;
        document.getElementById("patient-bloodtype").value = patient.bloodtype;
        document.getElementById("patient-ward").value = patient.ward;
        document.getElementById("patient-bed").value = patient.bedNumber;
        document.getElementById("patient-diagnosis").value = patient.diagnosis;
        document.getElementById("patient-allergies").value = patient.allergies;
        document.getElementById("patient-note").value = patient.Notes;
    } catch (error) {
        console.error("Error loading patient:", error);
        alert("Could not load patient data");
    }
});

//Save changed patient information
document.getElementById("edit-patient-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get("id");

    try {
        const res = await fetch(`http://localhost:8080/api/patients/${patientId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                fullname: document.getElementById("patient-title").value,
                age: document.getElementById("patient-age").value,
                dateOfBirth: document.getElementById("patient-birthdate").value,
                gender: document.getElementById("patient-gender").value,
                bloodType: document.getElementById("patient-bloodtype").value,   
                ward: document.getElementById("patient-ward").value,
                bedNumber: document.getElementById("patient-bed").value,
                diagnosis: document.getElementById("patient-diagnosis").value,
                allergies: document.getElementById("patient-allergies").value,
                Notes: document.getElementById("patient-note").value
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message || "Could not update patient");
            return;
        }

        alert("Patient updated successfully!");
        window.location.href = "patients.html";
    } catch (error) {
        console.error("Error updating patient:", error);
        alert("Network error");
    }
});




//delete patient
const deleteBtn = document.querySelector(".deleted-patient");
if (deleteBtn) {
  deleteBtn.addEventListener("click", async (e) => {
    e.preventDefault();   

    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get("id");

    console.log("URL search:", window.location.search);       
    console.log("Parsed patientId:", patientId);               

    if (!patientId) {
      alert("No patient ID provided");
      return;
    }

    if (!confirm("Are you sure you want to delete this patient?")) {
      return;
    }

    //delete patient by id
    try {
    const res = await fetch(`http://localhost:8080/api/patients/${patientId}`, {
  method: "DELETE",
    headers: { "Content-Type": "application/json" },
 
});

      if (!res.ok) {
        const text = await res.text();
        alert(text || "Could not delete patient");
        return;
      }

      const data = await res.json();
      alert("Patient deleted successfully!");
      window.location.href = "patients.html";  
    } catch (error) {
      console.error("Error deleting patient:", error);
      alert("Network error");
    }

  });
}
// update




