
//logout
const logoutBtn = document.getElementById("logout");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();

       // Remove logged-in user from localStorage
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
  });
}
