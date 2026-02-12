const tasks = document.querySelectorAll(".task");
const progressText = document.getElementById("progress");

window.onload = function () {
  const saved = JSON.parse(localStorage.getItem("designSystemProgress")) || [];

  tasks.forEach((task, index) => {
    task.checked = saved[index] || false;
  });

  updateAllMainTasks();
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

  const progressFill = document.getElementById("progressFill");
  if (progressFill) {
    progressFill.style.width = percent + "%";
  }

  if (percent === 100) {
    alert("🎉 Congratulations! You completed the roadmap!");
  }
}

function updateAllMainTasks() {
  const mainTasks = document.querySelectorAll(".main-task");

  mainTasks.forEach(main => {
    const parentLi = main.closest("li");
    const subTasks = parentLi.querySelectorAll(".sub-task");

    if (subTasks.length > 0) {
      const allChecked = Array.from(subTasks).every(sub => sub.checked);
      main.checked = allChecked;
    }
  });
}

tasks.forEach(task => {
  task.addEventListener("change", function () {

    const parentLi = this.closest("li");

    if (this.classList.contains("main-task")) {
      const childCheckboxes = parentLi.querySelectorAll(".sub-task");

      childCheckboxes.forEach(child => {
        child.checked = this.checked;
      });
    }

    if (this.classList.contains("sub-task")) {
      const parentMain = parentLi
        .closest("ul")
        .closest("li")
        ?.querySelector(".main-task");

      if (parentMain) {
        const siblingSubs = parentMain
          .closest("li")
          .querySelectorAll(".sub-task");

        const allChecked = Array.from(siblingSubs).every(sub => sub.checked);
        parentMain.checked = allChecked;
      }
    }

    updateProgress();
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
