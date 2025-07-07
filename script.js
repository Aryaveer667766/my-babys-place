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
