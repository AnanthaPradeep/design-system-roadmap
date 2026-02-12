const tasks = document.querySelectorAll(".task");
const progressText = document.getElementById("progress");

window.onload = function () {
  const saved = JSON.parse(localStorage.getItem("designSystemProgress")) || [];
  tasks.forEach((task, index) => {
    task.checked = saved[index] || false;
  });
  updateProgress();
};

function saveProgress() {
  const states = [];
  tasks.forEach(task => states.push(task.checked));
  localStorage.setItem("designSystemProgress", JSON.stringify(states));
}

function updateProgress() {
  const total = tasks.length;
  const checked = document.querySelectorAll(".task:checked").length;
  const percent = Math.round((checked / total) * 100);
  progressText.textContent = percent;

  if (percent === 100) {
    alert("🎉 Congratulations! You completed the roadmap!");
  }
}

tasks.forEach(task => {
  task.addEventListener("change", () => {
    updateProgress();``
    saveProgress();
  });
});

function saveAsPDF() {
  window.print();
}

function resetProgress() {
  if (confirm("Are you sure you want to reset progress?")) {
    tasks.forEach(task => task.checked = false);
    localStorage.removeItem("designSystemProgress");
    updateProgress();
  }
}
