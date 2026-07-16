// ================================================================
//  FIREBASE.JS — Konfigurasi & Inisialisasi Firebase
//  Daarul Khoirot Al-Madani
// ================================================================


// ==========================================================
//  IMPORTS
// ==========================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import {
    getFirestore,
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    writeBatch,
    onSnapshot,
    serverTimestamp,
    Timestamp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";


// ==========================================================
//  FIREBASE CONFIG
// ==========================================================

const firebaseConfig = {
    apiKey:            "AIzaSyBUd34AXvnBkUMaciculMQLLRRAPkxf-6o",
    authDomain:        "daarul-khoirot-pendaftaran.firebaseapp.com",
    projectId:         "daarul-khoirot-pendaftaran",
    storageBucket:     "daarul-khoirot-pendaftaran.firebasestorage.app",
    messagingSenderId: "963910462284",
    appId:             "1:963910462284:web:8fd602848c8087810b3de9",
    measurementId:     "G-V6SXY1KZTR"
};


// ==========================================================
//  INISIALISASI FIREBASE
// ==========================================================

const app  = initializeApp(firebaseConfig);
const db   = getFirestore(app);
const auth = getAuth(app);


// ==========================================================
//  DAFTAR COLLECTION
// ==========================================================

const COL = {
    SANTRI:    "pendaftaran_santri",
    HAFALAN:   "setoran_hafalan",
    KEHADIRAN: "kehadiran_santri",
    IBADAH:    "ibadah_akhlaq_santri",
    USERS:     "users"                     // ✅ Tambahan untuk kelola admin
};


// ==========================================================
//  EXPORT (untuk ES6 Module)
// ==========================================================

export {
    // Core
    app,
    auth,
    db,

    // Auth
    onAuthStateChanged,

    // Firestore Functions
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    writeBatch,
    onSnapshot,
    serverTimestamp,
    Timestamp,

    // Collection Names
    COL
};


// ==========================================================
//  EXPOSE KE WINDOW (untuk file JS non-module)
// ==========================================================

window.db                = db;
window.auth              = auth;
window.COL               = COL;

window.collection        = collection;
window.doc               = doc;
window.getDoc            = getDoc;
window.getDocs           = getDocs;
window.addDoc            = addDoc;
window.setDoc            = setDoc;
window.updateDoc         = updateDoc;
window.deleteDoc         = deleteDoc;
window.query             = query;
window.where             = where;
window.orderBy           = orderBy;
window.limit             = limit;
window.writeBatch        = writeBatch;
window.onSnapshot        = onSnapshot;
window.serverTimestamp   = serverTimestamp;
window.Timestamp         = Timestamp;