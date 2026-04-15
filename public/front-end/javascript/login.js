
//Login
const loginForm = document.querySelector(".login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    //Send login information
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // Save user session and direct to dashboard
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      alert("Login successful");
      window.location.href = "dashboard.html";

    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  });
}
