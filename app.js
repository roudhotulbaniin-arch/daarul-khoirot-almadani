import { auth } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
document.addEventListener("DOMContentLoaded", () => {

    setTanggalHariIni();

});

/* ==========================================================
   INIT DEFAULT
========================================================== */

function initDefault() {

    el.tanggal.value = today();
    el.tanggalKehadiran.value = today();

    const now = new Date();
    const bulan = now.getMonth() + 1;

    el.bulan.dataset.value = String(bulan).padStart(2, "0");
    el.bulan.value = namaBulan[bulan - 1];

    el.tahun.dataset.value = String(now.getFullYear());
    el.tahun.value = String(now.getFullYear());
}

/* ==========================================================
   START APP
========================================================== */

onAuthStateChanged(auth, async (user) => {

    if (user) {

        console.log("LOGIN AKTIF:", user.email);

        initDefault();

        await loadSantri();

        loadDaftarSurah();

        listenIbadah();

        openTab(null, "santri-panel");

    } else {

        console.log("USER BELUM LOGIN");

        window.location.href = "admin/login.html";

    }

});

/* ==========================================================
   TAB
========================================================== */

window.openTab = function (evt, tabId) {

    document.querySelectorAll(".tab-content")
        .forEach(tab => tab.classList.remove("active"));

    document.querySelectorAll(".tab-link")
        .forEach(btn => btn.classList.remove("active"));

    const panel = document.getElementById(tabId);

    if (panel) panel.classList.add("active");

    if (evt?.currentTarget) {
        evt.currentTarget.classList.add("active");
    } else {

        document
            .querySelector(`[onclick*="${tabId}"]`)
            ?.classList.add("active");

    }

    // Dashboard
    if (tabId === "dashboard-panel") {
        rebuildDashboard();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

};


/* ==========================================================
   NEXT TAB
========================================================== */

window.nextTab = function (tabId) {

    openTab(null, tabId);

};


/* ==========================================================
   PREV TAB
========================================================== */

window.prevTab = function () {

    const tabs = [...document.querySelectorAll(".tab-content")];

    const current = tabs.findIndex(t =>
        t.classList.contains("active")
    );

    if (current > 0) {

        openTab(
            null,
            tabs[current - 1].id
        );

    }

};

document.getElementById('menu-toggle')?.addEventListener('click', () => {
    document.getElementById('main-nav').classList.toggle('show');
    document.getElementById('menu-overlay').classList.toggle('show');
});

document.getElementById('menu-overlay')?.addEventListener('click', function() {
    document.getElementById('main-nav').classList.remove('show');
    this.classList.remove('show');
});


/* ==========================================================
   AUTO LOAD
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    el.tanggalKehadiran.value = today();

});

const btnLogout = document.getElementById("btnLogout");

if (btnLogout) {
    btnLogout.addEventListener("click", async (e) => {
        e.preventDefault();
        await signOut(auth);
        location.href = "admin/login.html";
    });
}