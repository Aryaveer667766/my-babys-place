import { syncWishlist, getWishlist } from './firebase.js';

// Elements
const input = document.getElementById("itemInput");
const list = document.getElementById("wishlist");
const addBtn = document.getElementById("addBtn");
const footer = document.getElementById("footer");
const themeSelect = document.getElementById("themeSelect");
const DELETE_AFTER_HOURS = 4;

let wishlistItems = [];

// ➕ Add item
addBtn.addEventListener("click", () => {
  const value = input.value.trim();
  if (!value) return;
  wishlistItems.push({
    text: value,
    done: false,
    timestamp: null
  });
  input.value = "";
  saveAndRender();
});

// ✅ Save and render
function saveAndRender() {
  renderList();
  syncWishlist(wishlistItems);
}

// 🖼️ Render wishlist
function renderList() {
  list.innerHTML = "";
  const now = Date.now();

  wishlistItems = wishlistItems.filter(item => {
    if (item.done && item.timestamp) {
      const age = (now - item.timestamp) / (1000 * 60 * 60);
      return age < DELETE_AFTER_HOURS;
    }
    return true;
  });

  wishlistItems.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <label>
        <input type="checkbox" data-index="${i}" ${item.done ? "checked" : ""}>
        <span class="${item.done ? 'cut' : ''}">${item.text}</span>
      </label>
    `;
    list.appendChild(li);
  });

  document.querySelectorAll("input[type='checkbox']").forEach(box => {
    box.addEventListener("change", e => {
      const i = e.target.dataset.index;
      const checked = e.target.checked;
      wishlistItems[i].done = checked;
      wishlistItems[i].timestamp = checked ? Date.now() : null;
      saveAndRender();
    });
  });
}

// ☁️ Load from Firebase
async function loadItems() {
  try {
    const raw = await getWishlist();
    wishlistItems = JSON.parse(raw || "[]");
  } catch {
    wishlistItems = [];
  }
  saveAndRender();
}
loadItems();

// 🎨 Theme switcher
function applyTheme(theme) {
  document.body.className = theme;
  localStorage.setItem("theme", theme);
}
themeSelect.addEventListener("change", (e) => {
  applyTheme(e.target.value);
});
const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);
themeSelect.value = savedTheme;

// ⏳ Countdown timer
function updateFullCountdown() {
  const startDate = new Date("2022-11-14T00:00:00");
  const now = new Date();
  const diff = now - startDate;

  const milliseconds = diff % 1000;
  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  const display = `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds 💘`;
  document.getElementById("fullTime").textContent = display;
}
setInterval(updateFullCountdown, 1000);
updateFullCountdown();

// 💝 Floating hearts
function createHearts() {
  const heart = document.createElement('div');
  heart.className = 'floating-heart';
  heart.textContent = '💖';
  heart.style.position = 'fixed';
  heart.style.left = Math.random() * 100 + '%';
  heart.style.bottom = '-30px';
  heart.style.fontSize = '24px';
  heart.style.zIndex = 1000;
  heart.style.animation = 'floatUp 4s linear forwards';
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 4000);
}
setInterval(createHearts, 1200);

// 💬 Welcome popup (first time only)
function showWelcomePopup() {
  if (localStorage.getItem("welcomed")) return;

  const modal = document.createElement("div");
  modal.innerHTML = `
    <div style="
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    ">
      <div style="
        background: white;
        padding: 30px;
        border-radius: 20px;
        max-width: 90%;
        text-align: center;
        box-shadow: 0 0 20px rgba(0,0,0,0.2);
        animation: fadeIn 1s;
      ">
        <h2>Hi my love 💖</h2>
        <p>I made this little place for you to dream, write, and feel safe.</p>
        <p>It’s all yours, always. – Arya 💌</p>
        <button id="closeWelcome" style="margin-top: 20px; padding: 10px 20px; background: #ff92ac; border: none; border-radius: 10px; color: white; font-weight: bold;">Aww, thank you 🥺</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById("closeWelcome").onclick = () => {
    modal.remove();
    localStorage.setItem("welcomed", "yes");
  };
}
showWelcomePopup();

// 💌 Footer secret message
footer.addEventListener("click", () => {
  const secret = document.createElement("div");
  secret.innerHTML = `
    <div style="
      position: fixed;
      top: 0; left: 0;
      width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    ">
      <div style="
        background: #fffafc;
        padding: 30px;
        border-radius: 20px;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 0 30px rgba(0,0,0,0.3);
        animation: fadeIn 0.5s ease;
      ">
        <h2>From Arya 💌</h2>
        <p>You're the most precious part of my world.<br>I made this space so you always feel close to me, even when we’re apart.</p>
        <p><em>I love you endlessly. – Arya 🌙</em></p>
        <button onclick="this.parentElement.parentElement.remove()" style="margin-top: 20px; padding: 10px 20px; background: #ff92ac; border: none; border-radius: 10px; color: white; font-weight: bold;">Close 💗</button>
      </div>
    </div>
  `;
  document.body.appendChild(secret);
});
