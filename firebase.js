import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  serverTimestamp
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

// 📝 Journal text functions
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

// 📸 Upload photo with caption
export async function uploadPhotoWithCaption(file, caption) {
  const filename = `${Date.now()}-${file.name}`;
  const storageRef = ref(storage, `journalPhotos/${filename}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);

  await addDoc(collection(db, "journalPhotos"), {
    url,
    caption,
    createdAt: serverTimestamp()
  });
}

// 🖼️ Fetch all photos with captions
export async function getPhotos() {
  const snapshot = await getDocs(collection(db, "journalPhotos"));
  const result = [];
  snapshot.forEach(doc => {
    const data = doc.data();
    result.push({
      url: data.url,
      caption: data.caption || ""
    });
  });
  return result;
}
