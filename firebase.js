import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDnKHTghSxW7fi6bp_UGBhR6Nx4paAtO4U",
  authDomain: "my-babys-place.firebaseapp.com",
  projectId: "my-babys-place",
  storageBucket: "my-babys-place.appspot.com",
  messagingSenderId: "276027805309",
  appId: "1:276027805309:web:d072a5981499be0e126b14",
  measurementId: "G-58WE41QTTZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

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
// ✅ Journal (text + time + gallery)
//
export async function syncJournal(text, time, gallery) {
  await setDoc(doc(db, "journal", "myBaby"), {
    note: text,
    lastUpdated: time,
    gallery: gallery || []
  });
}

export async function getJournal() {
  const docSnap = await getDoc(doc(db, "journal", "myBaby"));
  return docSnap.exists()
    ? docSnap.data()
    : { note: "", lastUpdated: "", gallery: [] };
}

//
// ✅ Upload Photo to Firebase Storage
//
export async function uploadPhoto(file) {
  const path = `journal-photos/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return await getDownloadURL(snapshot.ref);
}
