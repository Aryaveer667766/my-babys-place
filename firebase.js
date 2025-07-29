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

// 🔐 Your Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDnKHTghSxW7fi6bp_UGBhR6Nx4paAtO4U",
  authDomain: "my-babys-place.firebaseapp.com",
  projectId: "my-babys-place",
  storageBucket: "my-babys-place.appspot.com",
  messagingSenderId: "276027805309",
  appId: "1:276027805309:web:d072a5981499be0e126b14",
  measurementId: "G-58WE41QTTZ"
};

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const storage = getStorage(app);

//
// ✅ Wishlist Functions
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
// ✅ Journal Functions (with text + gallery)
//
export async function syncJournal(note, lastUpdated, gallery = []) {
  await setDoc(doc(db, "journal", "myBaby"), {
    note,
    lastUpdated,
    gallery
  });
}

export async function getJournal() {
  const docSnap = await getDoc(doc(db, "journal", "myBaby"));
  if (!docSnap.exists()) return { note: "", lastUpdated: "", gallery: [] };
  const data = docSnap.data();
  return {
    note: data.note || "",
    lastUpdated: data.lastUpdated || "",
    gallery: data.gallery || []
  };
}

//
// ✅ Upload Photo to Firebase Storage and Return URL
//
export async function uploadPhoto(file) {
  const storageRef = ref(storage, `journal/photo-${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}
