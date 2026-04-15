
document.addEventListener("DOMContentLoaded", function () {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const form = document.getElementById("profile-form");

    if (!user) {
        alert("Please log in first.");
        window.location.href = "login.html";
        return;
    }

    // Fill profile fields
    const fullnameInput = document.getElementById("fullname");
    const roleInput = document.getElementById("role-department");
    const emailInput = document.getElementById("email");

    // fill form
    if (fullnameInput) fullnameInput.value = user.fullname;
    if (roleInput) roleInput.value = user.role;
    if (emailInput) emailInput.value = user.email;

    // update profile on submit
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const fullname = fullnameInput.value.trim();
        const role = roleInput.value.trim();
        const email = emailInput.value.trim();

        if (!fullname) {
            alert("Full name is required");
            return;
        }
        if (!role) {
            alert("Department / Role is required");
            return;
        }
        if (!email) {
            alert("Email is required");
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/profile/${user.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ fullname, role, email })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Failed to update profile");
                return;
            }
            //update user profile
            const updatedUser = data.user;
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));

            alert("Profile updated successfully!");
            console.log("updated user:", updatedUser);


            if (window.location.pathname.includes("profile.html")) {
                window.location.href = "dashboard.html";
            }
        } catch (err) {
            console.error("Profile update error:", err);
            alert("Network error. Please try again.");
        }
    });
});