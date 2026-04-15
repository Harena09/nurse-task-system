
const user = JSON.parse(localStorage.getItem("currentUser"));

if (!user) {
    alert("Please log in first.");
    window.location.href = "login.html";
}


document.addEventListener("DOMContentLoaded", async () => {

    // Get form and input elements
    const moodForm = document.getElementById("mood-form");
    const moodInput = document.getElementById("mood-input");
    const moodButtons = document.querySelectorAll(".mood-btn");



    if (moodForm && moodInput) {
        moodButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                moodButtons.forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                moodInput.value = btn.dataset.mood;
            });
        });


        // submit form
        moodForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            if (!moodInput.value) {
                alert("Please select a mood");
                return;
            }

            const payload = {
                mood: moodInput.value,
                note: document.getElementById("mood-note")?.value || "",
                nurseId: user.id
            };

            try {
                //send mood log into the backend
                const res = await fetch("http://localhost:8080/api/moods", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });

                const data = await res.json();
                if (!res.ok) {
                    alert(data.error || "Could not save mood");
                    return;
                }

                alert("Mood logged successfully!");
                loadRecentMoods();
                loadDashboardMoods();

            } catch (err) {
                console.error("Error saving mood:", err);
                alert("Network error");
            }
        });
    }

    // Load recent moods 
    async function loadRecentMoods() {

        try {
            // Fetch moods for current user
            const res = await fetch(`http://localhost:8080/api/moods?nurseId=${user.id}`);
            const moods = await res.json();

            //sort by date, the latest will be displayed first
            const sortedMoods = moods.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            const container = document.getElementById("recent-moods");
            if (!container) return;

            container.innerHTML = sortedMoods
                .map((m) => {
                    const date = new Date(m.createdAt).toISOString().split("T")[0];
                    return `
                        <div class="MoodHistory">
                            <span class="material-symbols-sharp">sentiment_very_satisfied</span>
                            <div class="middle">
                                <div class="left">
                                    <h4>${m.mood}</h4>
                                    <div class="date">
                                        <input type="date" value="${date}" disabled />
                                    </div>
                                </div>
                                <h4 class="note">${m.note || ""}</h4>
                            </div>
                        </div>
                    `;
                })
                .join("");
        } catch (err) {
            console.error("Error loading moods:", err);
        }
    }


    if (document.getElementById("recent-moods")) {
        loadRecentMoods();
    }








    // Load mood information on dashboard
    async function loadDashboardMoods() {


        try {
            const res = await fetch(`http://localhost:8080/api/moods?nurseId=${user.id}`);
            const moods = await res.json();

            const sortedMoods = moods.sort((a, b) => {
                return new Date(b.createdAt) - new Date(a.createdAt);
            });

            // Get dashboard container
            const container = document.getElementById("mood-dashboard");   // fixed id
            if (!container) return;
            //Take the most recent mood
            const recentMoods = sortedMoods.slice(0, 1);

            // Render dashboard mood
            container.innerHTML = recentMoods



                .map((m) => {
                    const date = new Date(m.createdAt).toISOString().split("T")[0];
                    return `
                    <div class="Mood">
                        <span class="material-symbols-outlined">
                            mood
                        </span>
                        <div class="middle">
                            <div class="left">
                                <h3>${m.mood}</h3>
                                <input type="date" value="${date}" disabled />
                            </div>
                        </div>
                    </div>
                `;
                })
                .join("");

        } catch (err) {
            console.error("Error loading moods for dashboard:", err);
        }

    }
    if (document.getElementById("mood-dashboard")) {
        loadDashboardMoods();
    }

});

