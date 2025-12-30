// auth.js
import { auth, db } from "./firebase.js";
import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// expose login globally
window.login = async function () {
  const email = document.getElementById("username")?.value;
  const password = document.getElementById("password")?.value;
  const error = document.getElementById("error");

  if (error) error.style.display = "none";

  try {
    // Firebase login
    const cred = await signInWithEmailAndPassword(auth, email, password);

    // Check admin role
    const adminRef = doc(db, "admins", email);
    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists() || !adminSnap.data().active) {
      throw new Error("Not an active admin");
    }

    // Success
    window.location.href = "admin.html";

  } catch (err) {
    if (error) {
      error.style.display = "block";
      error.textContent = err.message;
    }
    console.error(err);
  }
};
