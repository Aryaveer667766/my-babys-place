const textarea = document.getElementById("thoughts");
const timestamp = document.getElementById("timestamp");

// Load previous entry and date
textarea.value = localStorage.getItem("overthinking") || "";
timestamp.innerText = localStorage.getItem("lastUpdated") 
  ? `Last saved: ${localStorage.getItem("lastUpdated")}` 
  : "Nothing saved yet.";

// Save on every input
textarea.addEventListener("input", () => {
  localStorage.setItem("overthinking", textarea.value);

  const now = new Date();
  const formatted = now.toLocaleString('en-IN', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  localStorage.setItem("lastUpdated", formatted);
  timestamp.innerText = `Last saved: ${formatted}`;
});
