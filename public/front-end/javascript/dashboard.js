
  // Get the logged-in user from localStorage
document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  document.querySelector(".profile h2").textContent = currentUser.fullname;
});


