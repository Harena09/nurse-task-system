
// Get the currently logged-in user from localStorage
const user = JSON.parse(localStorage.getItem("currentUser"));

if (!user) {
  alert("Please log in first.");
  window.location.href = "login.html";
}

// Get the patient information
const form = document.getElementById("new-patient-form");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullname = document.getElementById("patient-title").value;
    const age = document.getElementById("patient-age").value;
    const dateOfBirth = document.getElementById("patient-birthdate").value;
    const gender = document.getElementById("patient-gender").value;
    const bloodType = document.getElementById("patient-bloodtype").value;
    const ward = document.getElementById("patient-ward").value;
    const bedNumber = document.getElementById("patient-bed").value;
    const diagnosis = document.getElementById("patient-diagnosis").value;
    const allergies = document.getElementById("patient-allergies").value;
    const Notes = document.getElementById("patient-note").value;

    if (!fullname || !age || !dateOfBirth || !ward || !bedNumber) {
      alert("Please fill in the required fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullname,
          age,
          dateOfBirth,
          gender,
          bloodType,
          ward,
          bedNumber,
          diagnosis,
          allergies,
          Notes,
        nurseId: user.id 
        }),
      });

      //convert to JSON form and edd new patient
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Patient creation failed");
        return;
      }

      alert("Patient created successfully!");
      window.location.href = "patients.html";
    } catch (err) {
      console.error(err);
      alert("Network error. Please try again.");
         console.log("error in adding new patient");
    }
  });
}