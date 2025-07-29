import { syncJournal, getJournal, uploadPhoto } from './firebase.js';

const textarea = document.getElementById("thoughts");
const timestamp = document.getElementById("timestamp");
const photoInput = document.getElementById("photoInput");
const galleryContainer = document.getElementById("gallery");

let gallery = [];

// Format time nicely
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

// Save everything (text + gallery)
async function saveJournal() {
  const now = new Date();
  const time = formatTime(now);
  await syncJournal(textarea.value, time, gallery);
  timestamp.innerText = `Last saved: ${time}`;
}

// Load from Firebase on page load
async function loadJournal() {
  const data = await getJournal();
  textarea.value = data.note || "";
  timestamp.innerText = data.lastUpdated
    ? `Last saved: ${data.lastUpdated}`
    : "Nothing saved yet.";
  gallery = data.gallery || [];
  renderGallery();
}

// Auto-save on every keystroke
textarea.addEventListener("input", () => {
  saveJournal();
});

// Photo upload + caption
photoInput.addEventListener("change", async () => {
  const files = Array.from(photoInput.files);
  for (const file of files) {
    const url = await uploadPhoto(file);
    const caption = prompt(`Add a caption for "${file.name}"`) || "";
    gallery.push({ url, caption });
  }
  renderGallery();
  saveJournal();
  photoInput.value = ""; // Clear input
});

// Show photos in gallery
function renderGallery() {
  galleryContainer.innerHTML = "";
  gallery.forEach(({ url, caption }) => {
    const wrapper = document.createElement("div");
    wrapper.className = "photo-item";

    const img = document.createElement("img");
    img.src = url;
    img.alt = caption;

    const captionEl = document.createElement("p");
    captionEl.textContent = caption;

    wrapper.appendChild(img);
    wrapper.appendChild(captionEl);
    galleryContainer.appendChild(wrapper);
  });
}

// Start
loadJournal();
