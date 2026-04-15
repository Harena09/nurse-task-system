
const API_URL = window.location.origin;

// REGISTER
const registerForm = document.querySelector("form");

if (registerForm && document.getElementById("fullname")) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    //get register information
    const fullname = document.getElementById("fullname").value;
    const role = document.getElementById("role").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, role, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
         console.log("registration failed");
        return;
      }

      // Register user and direct to login form
      alert("Registered successfully! You can now log in.");
      console.log("registration successful");
      window.location.href = "login.html";
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  });

}


