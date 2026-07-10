import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBUd34AXvnBkUMaciculMQLLRRAPkxf-6o",
  authDomain: "daarul-khoirot-pendaftaran.firebaseapp.com",
  projectId: "daarul-khoirot-pendaftaran",
  storageBucket: "daarul-khoirot-pendaftaran.firebasestorage.app",
  messagingSenderId: "963910462284",
  appId: "1:963910462284:web:8fd602848c8087810b3de9",
  measurementId: "G-V6SXY1KZTR"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);