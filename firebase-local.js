// firebase-local.js - Firebase versi CDN non-module
// BISA jalan langsung dari file:// tanpa server!

console.log("🔥 firebase-local.js LOADED");

const firebaseConfig = {
    apiKey: "AIzaSyBUd34AXvnBkUMaciculMQLLRRAPkxf-6o",
    authDomain: "daarul-khoirot-pendaftaran.firebaseapp.com",
    projectId: "daarul-khoirot-pendaftaran",
    storageBucket: "daarul-khoirot-pendaftaran.firebasestorage.app",
    messagingSenderId: "963910462284",
    appId: "1:963910462284:web:8fd602848c8087810b3de9",
    measurementId: "G-V6SXY1KZTR"
};

// Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);

// Buat global
window.db = firebase.firestore();
window.auth = firebase.auth ? firebase.auth() : null;

console.log("🔥 Firebase Ready! db:", window.db);