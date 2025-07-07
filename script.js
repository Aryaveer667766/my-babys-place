import { syncWishlist, getWishlist } from './firebase.js';

const input = document.getElementById("itemInput");
const list = document.getElementById("wishlist");
const addBtn = document.getElementById("addBtn");

// Add item
addBtn.addEventListener("click", async () => {
  const value = input.value.trim();
  if (value === "") return;

  const li = document.createElement("li");
  li.innerHTML = `<input type="checkbox" /> ${value}`;
  list.appendChild(li);

  await syncWishlist(list.innerHTML);
  input.value = "";
});

// Load existing wishlist on page load
async function loadItems() {
  const html = await getWishlist();
  list.innerHTML = html;
}
loadItems();
import { syncWishlist, getWishlist } from './firebase.js';

// Elements
const input = document.getElementById("itemInput");
const list = document.getElementById("wishlist");
const addBtn = document.getElementById("addBtn");
const footer = document.getElementById("footer");

// 💖 Add item
addBtn.addEventListener("click", async () => {
  const value = input.value.trim();
  if (value === "") return;

  const li = document.createElement("li");
  li.innerHTML = `<input type="checkbox" /> ${value}`;
  list.appendChild(li);
  await syncWishlist(list.innerHTML);
  input.value = "";
});

// 💾 Load wishlist
async function loadItems() {
  const html = await getWishlist();
  list.innerHTML = html;
}
loadItems();

// 🎈 Floating hearts every 1.2s
function createHearts() {
  const heart = document.createElement('div');
  heart.className = 'floating-heart';
  heart.textContent = '💖';
  heart.style.position = 'fixed';
  heart.style.left = Math.random() * 100 + '%';
  heart.style.bottom = '-30px';
  heart.style.fontSize = '24px';
  heart.style.animation = 'floatUp 4s ease-in';
  heart.style.zIndex = 1000;
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 4000);
}
setInterval(createHearts, 1200);

// 🎁 Surprise welcome popup (first visit only)
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

// 💌 Secret “From Arya” mode (footer click)
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

