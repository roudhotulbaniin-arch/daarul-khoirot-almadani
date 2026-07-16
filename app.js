// ================================================================
//  APP.JS — Main Application
//  Daarul Khoirot Al-Madani
// ================================================================

import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";


// ================================================================
//  INIT DEFAULT VALUE
// ================================================================

function initDefault() {

    el.tanggal.value          = today();
    el.tanggalKehadiran.value = today();

    const now   = new Date();
    const bulan = now.getMonth() + 1;

    el.bulan.dataset.value = String(bulan).padStart(2, "0");
    el.bulan.value         = namaBulan[bulan - 1];

    el.tahun.dataset.value = String(now.getFullYear());
    el.tahun.value         = String(now.getFullYear());
}


// ================================================================
//  CEK LOGIN & LOAD DATA
// ================================================================

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        console.log("USER BELUM LOGIN");
        window.location.href = "login.html";   // ✅ path benar
        return;
    }

    console.log("LOGIN AKTIF:", user.email);

    // ---- Cek data user di Firestore ----
    try {
        const userSnap = await getDoc(doc(db, "users", user.uid));

        if (!userSnap.exists() || !userSnap.data().aktif) {
            alert("Akun Anda tidak valid atau dinonaktifkan!");
            await signOut(auth);
            window.location.href = "login.html";
            return;
        }

        const userData = userSnap.data();

        // Simpan info user global (opsional)
        window.currentUser = userData;

        // ✅ Tampilkan menu khusus admin
        if (userData.role === "admin") {
            tampilkanMenuAdmin();
        }

        // ✅ Tampilkan nama & jabatan di header (jika ada elemen)
        tampilkanInfoUser(userData);

    } catch (err) {
        console.error("Error cek user:", err);
    }

    // ---- Load data aplikasi ----
    initDefault();
    await loadSantri();
    loadDaftarSurah();
    listenIbadah();
    openTab(null, "santri-panel");
});


// ================================================================
//  TAMPILKAN MENU KHUSUS ADMIN
// ================================================================

function tampilkanMenuAdmin() {

    // Menu di sidebar navigasi
    const menuKelola = document.getElementById("menuKelolaUser");
    if (menuKelola) menuKelola.style.display = "";

    // Tombol tab "Kelola User"
    const tabKelola = document.getElementById("tab-kelola-user");
    if (tabKelola) tabKelola.style.display = "";
}


// ================================================================
//  TAMPILKAN INFO USER (opsional)
// ================================================================

function tampilkanInfoUser(userData) {

    const namaEl    = document.getElementById("userNama");
    const jabatanEl = document.getElementById("userJabatan");

    if (namaEl)    namaEl.textContent    = userData.nama || userData.username;
    if (jabatanEl) jabatanEl.textContent = userData.jabatan || "Admin";
}


// ================================================================
//  TAB NAVIGATION
// ================================================================

window.openTab = function (evt, tabId) {

    // Hapus active dari semua tab
    document.querySelectorAll(".tab-content")
        .forEach(tab => tab.classList.remove("active"));

    document.querySelectorAll(".tab-link")
        .forEach(btn => btn.classList.remove("active"));

    // Aktifkan panel yang dipilih
    const panel = document.getElementById(tabId);
    if (panel) panel.classList.add("active");

    // Aktifkan tombol tab
    if (evt?.currentTarget) {
        evt.currentTarget.classList.add("active");
    } else {
        document.querySelector(`[onclick*="${tabId}"]`)
            ?.classList.add("active");
    }

    // Reload dashboard saat masuk tab dashboard
    if (tabId === "dashboard-panel") {
        rebuildDashboard();
    }

    // Scroll ke atas
    window.scrollTo({ top: 0, behavior: "smooth" });
};

window.nextTab = function (tabId) {
    openTab(null, tabId);
};

window.prevTab = function () {

    const tabs = [...document.querySelectorAll(".tab-content")];
    const current = tabs.findIndex(t => t.classList.contains("active"));

    if (current > 0) {
        openTab(null, tabs[current - 1].id);
    }
};


// ================================================================
//  SIDEBAR MOBILE (HAMBURGER MENU)
// ================================================================

document.getElementById("menu-toggle")?.addEventListener("click", () => {
    document.getElementById("main-nav")?.classList.toggle("show");
    document.getElementById("menu-overlay")?.classList.toggle("show");
});

document.getElementById("menu-overlay")?.addEventListener("click", function () {
    document.getElementById("main-nav")?.classList.remove("show");
    this.classList.remove("show");
});


// ================================================================
//  LOGOUT HANDLER
// ================================================================

const btnLogout = document.getElementById("btnLogout");

if (btnLogout) {
    btnLogout.addEventListener("click", async (e) => {
        e.preventDefault();

        if (!confirm("Apakah Anda yakin ingin logout?")) return;

        try {
            await signOut(auth);
            sessionStorage.clear();
            alert("Anda telah logout!");
            window.location.href = "admin/login.html";   // ✅ path benar
        } catch (err) {
            console.error("Logout error:", err);
            alert("Gagal logout. Coba lagi.");
        }
    });
}


// ================================================================
//  ON PAGE READY
// ================================================================

document.addEventListener("DOMContentLoaded", () => {

    // Set tanggal default
    if (typeof setTanggalHariIni === "function") {
        setTanggalHariIni();
    }

    // Set tanggal kehadiran
    if (el?.tanggalKehadiran) {
        el.tanggalKehadiran.value = today();
    }

});