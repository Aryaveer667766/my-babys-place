import {
  syncJournal,
  getJournal,
  uploadPhotoWithCaption,
  getPhotos
} from "./firebase.js";

const textarea = document.getElementById("journalEntry");
const saveMsg = document.getElementById("saveMsg");
const photoInput = document.getElementById("photoInput");
const gallery = document.getElementById("gallery");

let saveTimeout = null;

// Load journal data on start
(async () => {
  const data = await getJournal();
  textarea.value = data.note || "";
  renderPhotos(await getPhotos());
})();

// Real-time autosave every 2 sec after typing
textarea.addEventListener("input", () => {
  saveMsg.textContent = "Saving...";
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    const now = new Date().toLocaleString();
    await syncJournal(textarea.value, now);
    saveMsg.textContent = "Saved!";
    setTimeout(() => (saveMsg.textContent = ""), 1500);
  }, 2000);
});

// Handle photo upload
photoInput.addEventListener("change", async (e) => {
  const files = Array.from(e.target.files);
  for (const file of files) {
    const caption = prompt("Enter caption for this photo:");
    if (!caption) continue;
    await uploadPhotoWithCaption(file, caption);
  }
  renderPhotos(await getPhotos());
});

// Render gallery
function renderPhotos(photoArray) {
  gallery.innerHTML = "";
  photoArray.forEach(({ url, caption }) => {
    const div = document.createElement("div");
    div.className = "photo-item";
    div.innerHTML = `
      <img src="${url}" alt="memory" />
      <input type="text" value="${caption}" disabled />
    `;
    gallery.appendChild(div);
  });
}
