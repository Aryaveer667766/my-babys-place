import { syncWishlist, getWishlist } from './firebase.js';

const input = document.getElementById("itemInput");
const list = document.getElementById("wishlist");

async function addItem() {
  const value = input.value.trim();
  if (value === "") return;

  const li = document.createElement("li");
  li.innerHTML = `<input type="checkbox" /> ${value}`;
  list.appendChild(li);
  await saveItems();
  input.value = "";
  showMessage("Added to your wishlist 💕");
}

async function saveItems() {
  await syncWishlist(list.innerHTML);
}

async function loadItems() {
  const html = await getWishlist();
  list.innerHTML = html;
}

function showMessage(msg) {
  const el = document.createElement("div");
  el.textContent = msg;
  el.style.cssText =
    'position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: #fff0f4; padding: 10px 20px; border-radius: 12px; box-shadow: 0 0 10px rgba(0,0,0,0.1); font-weight: bold;';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}

function createHearts() {
  const heart = document.createElement('div');
  heart.className = 'floating-heart';
  heart.style.left = Math.random() * 100 + '%';
  heart.style.animationDuration = (2 + Math.random() * 3) + 's';
  document.body.appendChild(heart);
  setTimeout(() => heart.remove(), 5000);
}

setInterval(createHearts, 800);
loadItems();
