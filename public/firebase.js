// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDoWsKzCvD8gcZdgv97mhlJ_hBmxhYu3aY",
  authDomain: "island-moments.firebaseapp.com",
  projectId: "island-moments",
  storageBucket: "island-moments.appspot.com",
  messagingSenderId: "222471061200",
  appId: "1:222471061200:web:be0d750e2eec3479f1e8d5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
