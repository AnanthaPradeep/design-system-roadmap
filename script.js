
const tasks = document.querySelectorAll(".task");
const progressText = document.getElementById("progress");
const themeToggle = document.getElementById("theme-toggle");

let completeAlertShown = false;

window.onload = function () {
  const savedTheme = localStorage.getItem("designSystemTheme") || "light";
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
  }

  const savedProgress = JSON.parse(localStorage.getItem("designSystemProgress")) || [];
  tasks.forEach((task, index) => {
    task.checked = savedProgress[index] || false;
  });

  updateAllMainTasks();
  updateProgress();
};


themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
  localStorage.setItem(
    "designSystemTheme",
    document.body.classList.contains("dark-theme") ? "dark" : "light"
  );
});


function saveProgress() {
  const states = Array.from(tasks).map(task => task.checked);
  localStorage.setItem("designSystemProgress", JSON.stringify(states));
}

function updateProgress() {
  const total = tasks.length;
  const checked = document.querySelectorAll(".task:checked").length;
  const percent = Math.round((checked / total) * 100);

  progressText.textContent = percent;

  const progressFill = document.getElementById("progressFill");
  if (progressFill) progressFill.style.width = percent + "%";

  if (percent === 100 && !completeAlertShown) {
    completeAlertShown = true;
    alert("🎉 Congratulations! You completed the roadmap!");
  } else if (percent < 100) {
    completeAlertShown = false;
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
      let parent = parentLi.parentElement.closest("li");
      if (parent) {
        const parentMain = parent.querySelector(".main-task");
        const siblingSubs = parent.querySelectorAll(".sub-task");
        parentMain.checked = Array.from(siblingSubs).every(sub => sub.checked);
      }
    }

    updateProgress();
    saveProgress();
    updateAllMainTasks();
  });
});


function saveAsPDF() {
  window.print();
}


function saveAsImage() {
  const element = document.getElementById("roadmap-container");


  const nestedLists = element.querySelectorAll("ul");
  nestedLists.forEach(ul => (ul.style.display = "block"));

  html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    scrollY: -window.scrollY
  })
    .then(canvas => {
      nestedLists.forEach(ul => (ul.style.display = ""));
      const link = document.createElement("a");
      link.download = "roadmap-progress.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    })
    .catch(err => {
      console.error("Error generating image:", err);
      alert("Oops! Something went wrong while generating the image.");
    });
}

function resetProgress() {
  if (confirm("Are you sure you want to reset progress?")) {
    tasks.forEach(task => (task.checked = false));
    localStorage.removeItem("designSystemProgress");
    updateProgress();
    updateAllMainTasks();
  }
}
