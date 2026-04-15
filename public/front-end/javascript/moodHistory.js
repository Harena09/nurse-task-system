
 async function loadMoodStats() {
    try {
        //fecth mood information form backend
      const res = await fetch(`http://localhost:8080/api/moods/stats?nurseId=${user.id}`);
      const stats = await res.json();

      const map = {};
      for (const s of stats) {
        map[s.mood] = s.count;
      }

      // Update each mood block
      document.querySelectorAll(".MoodHistory").forEach((item) => {
        const mood = item.dataset.mood;
        const count = map[mood]||0;

        const stats = item.querySelector(".moodStats");
        if (stats) {
          stats.textContent = `x${count}`;
        }
      });
    } catch (err) {
      console.error("Error loading mood stats:", err);
    }
  }

  document.addEventListener("DOMContentLoaded", loadMoodStats);







