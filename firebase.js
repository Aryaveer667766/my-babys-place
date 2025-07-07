import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDnKHTghSxW7fi6bp_UGBhR6Nx4paAtO4U",
  authDomain: "my-babys-place.firebaseapp.com",
  projectId: "my-babys-place",
  storageBucket: "my-babys-place.firebasestorage.app",
  messagingSenderId: "276027805309",
  appId: "1:276027805309:web:d072a5981499be0e126b14",
  measurementId: "G-58WE41QTTZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

//
// ✅ Wishlist (with checkbox status & auto-delete support)
//
export async function syncWishlist(dataArray) {
  await setDoc(doc(db, "wishlist", "myBaby"), {
    items: JSON.stringify(dataArray)
  });
}

export async function getWishlist() {
  const docSnap = await getDoc(doc(db, "wishlist", "myBaby"));
  return docSnap.exists() ? docSnap.data().items : "[]";
}

//
// ✅ Single-Page Journal (Overthinking section)
//
export async function syncJournal(text, time) {
  await setDoc(doc(db, "journal", "myBaby"), {
    note: text,
    lastUpdated: time
  });
}

export async function getJournal() {
  const docSnap = await getDoc(doc(db, "journal", "myBaby"));
  return docSnap.exists() ? docSnap.data() : { note: "", lastUpdated: "" };
}
