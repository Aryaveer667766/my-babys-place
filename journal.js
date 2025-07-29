import { syncJournal, getJournal } from './firebase.js';

const textarea = document.getElementById("thoughts");
const timestamp = document.getElementById("timestamp");

function formatTime(date) {
  return date.toLocaleString('en-IN', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

async function loadJournal() {
  const data = await getJournal();
  textarea.value = data.note || "";
  timestamp.innerText = data.lastUpdated
    ? Last saved: ${data.lastUpdated}
    : "Nothing saved yet.";
}

textarea.addEventListener("input", async () => {
  const now = new Date();
  const time = formatTime(now);
  await syncJournal(textarea.value, time);
  timestamp.innerText = Last saved: ${time};
});

loadJournal();
