/* ==========================================================
   RAPORT.JS v2
   PART 1 : FOUNDATION
   Daarul Khoirot Al-Madani
========================================================== */

/* ==========================================================
   MASTER DATA SURAH
========================================================== */

const dataSurahQuran = [
    { no: 1, nama: "Al-Fatihah", ayat: 7 }, { no: 2, nama: "Al-Baqarah", ayat: 286 }, { no: 3, nama: "Ali 'Imran", ayat: 200 },
    { no: 4, nama: "An-Nisa'", ayat: 176 }, { no: 5, nama: "Al-Ma'idah", ayat: 120 }, { no: 6, nama: "Al-An'am", ayat: 165 },
    { no: 7, nama: "Al-A'raf", ayat: 206 }, { no: 8, nama: "Al-Anfal", ayat: 75 }, { no: 9, nama: "At-Taubah", ayat: 129 },
    { no: 10, nama: "Yunus", ayat: 109 }, { no: 11, nama: "Hud", ayat: 123 }, { no: 12, nama: "Yusuf", ayat: 111 },
    { no: 13, nama: "Ar-Ra'd", ayat: 43 }, { no: 14, nama: "Ibrahim", ayat: 52 }, { no: 15, nama: "Al-Hijr", ayat: 99 },
    { no: 16, nama: "An-Nahl", ayat: 128 }, { no: 17, nama: "Al-Isra'", ayat: 111 }, { no: 18, nama: "Al-Kahf", ayat: 110 },
    { no: 19, nama: "Maryam", ayat: 98 }, { no: 20, nama: "Taha", ayat: 135 }, { no: 21, nama: "Al-Anbiya'", ayat: 112 },
    { no: 22, nama: "Al-Hajj", ayat: 78 }, { no: 23, nama: "Al-Mu'minun", ayat: 118 }, { no: 24, nama: "An-Nur", ayat: 64 },
    { no: 25, nama: "Al-Furqan", ayat: 77 }, { no: 26, nama: "Asy-Syu'ara'", ayat: 227 }, { no: 27, nama: "An-Naml", ayat: 93 },
    { no: 28, nama: "Al-Qasas", ayat: 88 }, { no: 29, nama: "Al-'Ankabut", ayat: 69 }, { no: 30, nama: "Ar-Rum", ayat: 60 },
    { no: 31, nama: "Luqman", ayat: 34 }, { no: 32, nama: "As-Sajdah", ayat: 30 }, { no: 33, nama: "Al-Ahzab", ayat: 73 },
    { no: 34, nama: "Saba'", ayat: 54 }, { no: 35, nama: "Fatir", ayat: 45 }, { no: 36, nama: "Yasin", ayat: 83 },
    { no: 37, nama: "As-Saffat", ayat: 182 }, { no: 38, nama: "Sad", ayat: 88 }, { no: 39, nama: "Az-Zumar", ayat: 75 },
    { no: 40, nama: "Ghafir", ayat: 85 }, { no: 41, nama: "Fussilat", ayat: 54 }, { no: 42, nama: "Asy-Syura", ayat: 53 },
    { no: 43, nama: "Az-Zukhruf", ayat: 89 }, { no: 44, nama: "Ad-Dukhan", ayat: 59 }, { no: 45, nama: "Al-Jasiyah", ayat: 37 },
    { no: 46, nama: "Al-Ahqaf", ayat: 35 }, { no: 47, nama: "Muhammad", ayat: 38 }, { no: 48, nama: "Al-Fath", ayat: 29 },
    { no: 49, nama: "Al-Hujurat", ayat: 18 }, { no: 50, nama: "Qaf", ayat: 45 }, { no: 51, nama: "Az-Zariyat", ayat: 60 },
    { no: 52, nama: "At-Tur", ayat: 49 }, { no: 53, nama: "An-Najm", ayat: 62 }, { no: 54, nama: "Al-Qamar", ayat: 55 },
    { no: 55, nama: "Ar-Rahman", ayat: 78 }, { no: 56, nama: "Al-Waqi'ah", ayat: 96 }, { no: 57, nama: "Al-Hadid", ayat: 29 },
    { no: 58, nama: "Al-Mujadilah", ayat: 22 }, { no: 59, nama: "Al-Hasyr", ayat: 24 }, { no: 60, nama: "Al-Mumtahanah", ayat: 13 },
    { no: 61, nama: "As-Saff", ayat: 14 }, { no: 62, nama: "Al-Jumu'ah", ayat: 11 }, { no: 63, nama: "Al-Munafiqun", ayat: 11 },
    { no: 64, nama: "At-Taghabun", ayat: 18 }, { no: 65, nama: "At-Talaq", ayat: 12 }, { no: 66, nama: "At-Tahrim", ayat: 12 },
    { no: 67, nama: "Al-Mulk", ayat: 30 }, { no: 68, nama: "Al-Qalam", ayat: 52 }, { no: 69, nama: "Al-Haqqah", ayat: 52 },
    { no: 70, nama: "Al-Ma'arij", ayat: 44 }, { no: 71, nama: "Nuh", ayat: 28 }, { no: 72, nama: "Al-Jinn", ayat: 28 },
    { no: 73, nama: "Al-Muzzammil", ayat: 20 }, { no: 74, nama: "Al-Muddassir", ayat: 56 }, { no: 75, nama: "Al-Qiyamah", ayat: 40 },
    { no: 76, nama: "Al-Insan", ayat: 31 }, { no: 77, nama: "Al-Mursalat", ayat: 50 }, { no: 78, nama: "An-Naba'", ayat: 40 },
    { no: 79, nama: "An-Nazi'at", ayat: 46 }, { no: 80, nama: "'Abasa", ayat: 42 }, { no: 81, nama: "At-Takwir", ayat: 29 },
    { no: 82, nama: "Al-Infitar", ayat: 19 }, { no: 83, nama: "Al-Mutaffifin", ayat: 36 }, { no: 84, nama: "Al-Insyiqaq", ayat: 25 },
    { no: 85, nama: "Al-Buruj", ayat: 22 }, { no: 86, nama: "At-Tariq", ayat: 17 }, { no: 87, nama: "Al-A'la", ayat: 19 },
    { no: 88, nama: "Al-Ghasyiyah", ayat: 26 }, { no: 89, nama: "Al-Fajr", ayat: 30 }, { no: 90, nama: "Al-Balad", ayat: 20 },
    { no: 91, nama: "Asy-Syams", ayat: 15 }, { no: 92, nama: "Al-Lail", ayat: 21 }, { no: 93, nama: "Ad-Duha", ayat: 11 },
    { no: 94, nama: "Al-Insyirah", ayat: 8 }, { no: 95, nama: "At-Tin", ayat: 8 }, { no: 96, nama: "Al-'Alaq", ayat: 19 },
    { no: 97, nama: "Al-Qadr", ayat: 5 }, { no: 98, nama: "Al-Bayyinah", ayat: 8 }, { no: 99, nama: "Az-Zalzalah", ayat: 8 },
    { no: 100, nama: "Al-'Adiyat", ayat: 11 }, { no: 101, nama: "Al-Qari'ah", ayat: 11 }, { no: 102, nama: "At-Takasur", ayat: 8 },
    { no: 103, nama: "Al-'Asr", ayat: 3 }, { no: 104, nama: "Al-Humazah", ayat: 9 }, { no: 105, nama: "Al-Fil", ayat: 5 },
    { no: 106, nama: "Quraisy", ayat: 4 }, { no: 107, nama: "Al-Ma'un", ayat: 7 }, { no: 108, nama: "Al-Kausar", ayat: 3 },
    { no: 109, nama: "Al-Kafirun", ayat: 6 }, { no: 110, nama: "An-Nasr", ayat: 3 }, { no: 111, nama: "Al-Lahab", ayat: 5 },
    { no: 112, nama: "Al-Ikhlas", ayat: 4 }, { no: 113, nama: "Al-Falaq", ayat: 5 }, { no: 114, nama: "An-Nas", ayat: 6 }
];

const JUZ_MAP = [
  { juz: 1, start: 1, end: 148 },
  { juz: 2, start: 149, end: 259 },
  { juz: 3, start: 260, end: 385 },
  { juz: 4, start: 386, end: 516 },
  { juz: 5, start: 517, end: 640 },
  { juz: 6, start: 641, end: 750 },
  { juz: 7, start: 751, end: 888 },
  { juz: 8, start: 889, end: 1041 },
  { juz: 9, start: 1042, end: 1200 },
  { juz: 10, start: 1201, end: 1323 },
  { juz: 11, start: 1324, end: 1479 },
  { juz: 12, start: 1480, end: 1648 },
  { juz: 13, start: 1649, end: 1802 },
  { juz: 14, start: 1803, end: 2029 },
  { juz: 15, start: 2030, end: 2214 },
  { juz: 16, start: 2215, end: 2483 },
  { juz: 17, start: 2484, end: 2673 },
  { juz: 18, start: 2674, end: 2825 },
  { juz: 19, start: 2826, end: 3060 },
  { juz: 20, start: 3061, end: 3257 },
  { juz: 21, start: 3258, end: 3410 },
  { juz: 22, start: 3411, end: 3646 },
  { juz: 23, start: 3647, end: 3870 },
  { juz: 24, start: 3871, end: 4048 },
  { juz: 25, start: 4049, end: 4218 },
  { juz: 26, start: 4219, end: 4473 },
  { juz: 27, start: 4474, end: 4757 },
  { juz: 28, start: 4758, end: 5104 },
  { juz: 29, start: 5105, end: 5241 },
  { juz: 30, start: 5242, end: 6236 }
];

/* ==========================================================
   FIREBASE
========================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";

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
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

/* ==========================================================
   FIREBASE CONFIG
   (isi config lama Anda)
========================================================== */

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
const db = getFirestore(app);


/* ==========================================================
   DOM CACHE
========================================================== */

const $ = id => document.getElementById(id);

const el = {

    /* ========= SANTRI ========= */

    idSantri: $("id_santri"),
    searchSantri: $("searchSantriInput"),
    menuSantri: $("menuSantriDropdown"),

    infoId: $("infoIdSantri"),
    infoNama: $("infoNamaSantri"),
    infoAyah: $("infoNamaAyah"),
    infoKelas: $("infoKelas"),
    infoStatus: $("infoStatus"),
    infoDaftar: $("infoTglDaftar"),

    kartuSantri: $("kartuSantri"),
    navSantri: $("navSantri"),

/* ========= KEHADIRAN ========= */

tanggalKehadiran: $("tanggalKehadiran"),
statusKehadiran: $("statusKehadiran"),

boxStatusKehadiran: $("boxStatusKehadiran"),
menuStatusKehadiranDropdown: $("menuStatusKehadiranDropdown"),

    /* ========= HAFALAN ========= */

    santri: $("santri"),

    tanggal: $("tanggal"),

    surah: $("surah"),
    searchSurah: $("searchSurahInput"),

    ayatMulai: $("ayat_mulai"),
    ayatSelesai: $("ayat_selesai"),

    menuSurah: $("menuSurahDropdown"),
    menuAyatMulai: $("menuAyatMulaiDropdown"),
    menuAyatSelesai: $("menuAyatSelesaiDropdown"),

    akumulasi: $("inAkumulasi"),
    setoran: $("inSetoran"),

    tasmi: $("is_tasmi"),

kelancaran: $("nilai_kelancaran"),
tahsin: $("nilai_tahsin"),
tajwid: $("nilai_tajwid"),

    catatan: $("catatan"),
    motivasi: $("motivasi"),

    /* ========= IBADAH ========= */

    subuh: $("subuh"),
    dzuhur: $("dzuhur"),
    ashar: $("ashar"),
    maghrib: $("maghrib"),
    isya: $("isya"),
    tilawah: $("tilawah"),

    adabGuru: $("adabGuru"),
    adabOrtu: $("adabOrtu"),
    disiplin: $("disiplin"),
    kebersihan: $("kebersihan"),

    catatanAkhlaq: $("catatanAkhlaq"),

    /* ========= FILTER ========= */

    bulan: $("filter-bulan"),
    tahun: $("filter-tahun"),

    /* ========= DASHBOARD ========= */

    dashboardBody: $("dash-tabel-body"),

    /* ========= BUTTON ========= */

    btnGenerate: $("btnProsesRekap"),
    btnReset: $("btnResetData")

};

    const wrapKelancaran = el.kelancaran.closest(".dropdown-wrapper-custom");
const wrapTahsin = el.tahsin.closest(".dropdown-wrapper-custom");
const wrapTajwid = el.tajwid.closest(".dropdown-wrapper-custom");



/* ==========================================================
   GLOBAL STATE
========================================================== */

const state = {

    santriAktif: null,
    daftarSantri: [],
    daftarSurah: [],
    historyHafalan: [],
    historyKehadiran: [],
    historyIbadah: [],
    laporan: null,
    dashboard: null,
    loading: false,

    // 👉 TAMBAHAN BARU
    setoranTerakhir: 0,
    akumulasi: 0
    
};

state.dashboard = {

    periode: getPeriode(),

    rekap: [],

    summary: {}

};

let filterSantriPanel = "";

let filterSantriDashboard = "";

/* ==========================================================
   COLLECTION
========================================================== */

const COL = {

    SANTRI: "pendaftaran_santri",

    HAFALAN: "setoran_hafalan",

    KEHADIRAN: "kehadiran_santri",

    IBADAH: "ibadah_akhlaq_santri"

};


/* ==========================================================
   UTIL
========================================================== */

const today = () => {

    const now = new Date();

    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());

    return now.toISOString().split("T")[0];

};
const trim = text => String(text ?? "").trim();

const empty = value => {

    return value === undefined ||
           value === null ||
           value === "";

};

const angka = value => {

    const n = Number(value);

    return Number.isNaN(n) ? 0 : n;

};

const huruf = value => {

    return String(value ?? "").charAt(0);

};


/* ==========================================================
   FORMAT
========================================================== */
function setTanggalHariIni() {

    const input = document.getElementById("tanggalKehadiran");
    if (!input) return;

    const hariIni = new Date();

    // Format YYYY-MM-DD
    const tanggal = hariIni.getFullYear() + "-" +
        String(hariIni.getMonth() + 1).padStart(2, "0") + "-" +
        String(hariIni.getDate()).padStart(2, "0");

    input.value = tanggal;

}

function formatTanggal(value){

    if(!value) return "-";

    const d = new Date(value);

    return d.toLocaleDateString("id-ID",{

        day:"2-digit",

        month:"long",

        year:"numeric"

    });

}

document.addEventListener("DOMContentLoaded", () => {

    setTanggalHariIni();

});

const namaBulan = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember"
];


/* ==========================================================
   LOADING
========================================================== */

function setLoading(status){

    state.loading = status;

}


/* ==========================================================
   ALERT
========================================================== */

function sukses(text){

    Swal.fire({

        icon:"success",

        title:"Berhasil",

        text,

        timer:1700,

        showConfirmButton:false

    });

}

function gagal(text){

    Swal.fire({

        icon:"error",

        title:"Terjadi Kesalahan",

        text

    });

}

function info(text){

    Swal.fire({

        icon:"info",

        title:text

    });

}


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

document.addEventListener("DOMContentLoaded", async () => {

    initDefault();

    await loadSantri();

    loadDaftarSurah();

    // Aktifkan tab pertama
    openTab(null, "santri-panel");

});

document.addEventListener("DOMContentLoaded", () => {

    // listenHafalan();

    // listenKehadiran();

    listenIbadah();

});

/* ==========================================================
   PART 2
   TAB, DROPDOWN & PENCARIAN SANTRI
========================================================== */

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
   CUSTOM DROPDOWN
========================================================== */

function closeDropdown() {

    document
        .querySelectorAll(".dropdown-wrapper-custom.open")
        .forEach(box => {

            box.classList.remove("open");

        });

}

function initDropdown(wrapperId, boxId, inputId) {

    const wrapper = document.getElementById(wrapperId);
    const box = document.getElementById(boxId);
    const input = document.getElementById(inputId);

    if (!wrapper || !box || !input) {
        console.warn("Dropdown missing:", wrapperId, boxId, inputId);
        return;
    }

    box.addEventListener("click", () => {
        wrapper.classList.toggle("open");
    });

    wrapper.querySelectorAll(".dropdown-item-custom").forEach(item => {

        item.addEventListener("click", () => {

            const val = item.textContent.trim();

            input.value = val; // 🔥 INI YANG HARUS MASUK

            input.dispatchEvent(new Event("change"));

            wrapper.classList.remove("open");

        });

    });

}


window.toggleCustomSelect = function (trigger) {

    const wrapper = trigger.closest(".dropdown-wrapper-custom");

    if (!wrapper) return;

    const opened = wrapper.classList.contains("open");

    closeDropdown();

    if (!opened) {

        wrapper.classList.add("open");

    }

};


document.addEventListener("click", e => {

    if (!e.target.closest(".dropdown-wrapper-custom")) {

        closeDropdown();
       
    }

});


window.selectFilterOption = function (
    item,
    inputId,
    value
) {

    const input = document.getElementById(inputId);

    input.value = item.textContent.trim();

    input.dataset.value = value;

    closeDropdown();

};


/* ==========================================================
   LOAD SANTRI
========================================================== */

async function loadSantri() {

    try {

        const snap = await getDocs(
    collection(db, COL.SANTRI)
);


        state.daftarSantri = snap.docs
.map(doc => ({
    ...doc.data(),
    id: doc.data().id_santri,
    nama: doc.data().nama_santri,
    kelas: doc.data().tingkat_unit || "-"
}))
.sort((a, b) => a.nama.localeCompare(b.nama, "id"));
    renderMenuSantri(
            state.daftarSantri
        );
       
       state.santri = state.daftarSantri;

isiFilterSantriDashboard();
        
    }
     
    catch (err) {

        console.error(err);

        gagal(
            "Gagal memuat data santri."
        );

    }

}


/* ==========================================================
   RENDER MENU
========================================================== */

function renderMenuSantri(list) {

    if (!list.length) {

        el.menuSantri.innerHTML = `
            <div class="dropdown-item-custom">
                Tidak ada data
            </div>
        `;

        return;

    }

    el.menuSantri.innerHTML =
        list.map(s => `

        <div
            class="dropdown-item-custom"
            data-id="${s.id}"
        >

            ${s.nama}

        </div>

    `).join("");

}

function renderFilterDashboard(list){

    const menu = document.getElementById("dashFilterDropdown");

    if(!menu) return;

    if(!list.length){

        menu.innerHTML = `
            <div class="dropdown-item-custom">
                Tidak ada data
            </div>
        `;

        return;
    }

    menu.innerHTML = list.map(s=>`

        <div class="dropdown-item-custom"
             data-nama="${s.nama}">

            ${s.nama}

        </div>

    `).join("");

}

const input = document.getElementById("dashFilterSantri");

input.addEventListener("input", function(){

    const keyword = this.value.toLowerCase().trim();

    const hasil = state.daftarSantri.filter(s=>
        s.nama.toLowerCase().includes(keyword)
    );

    renderFilterDashboard(hasil);

    document
        .querySelector("#dashFilterDropdown")
        .parentElement
        .classList.add("open");

});

document.addEventListener("click", function(e){

    if(!e.target.classList.contains("dropdown-item-custom")) return;

    const nama = e.target.dataset.nama;

    if(!nama) return;

    document.getElementById("dashFilterSantri").value = nama;

    document
        .querySelector("#dashFilterDropdown")
        .parentElement
        .classList.remove("open");

    rebuildDashboard();

});
/* ==========================================================
   SEARCH
========================================================== */
el.searchSantri.addEventListener("input", function () {

    const key = this.value
        .toLowerCase()
        .trim();


    const hasil = state.daftarSantri.filter(s =>
        (s.nama_santri || s.nama)
        .toLowerCase()
        .includes(key)
    );


    renderMenuSantri(hasil);


    const wrapper = document.querySelector(
        ".dropdown-wrapper-custom"
    );

    if (wrapper) {
        wrapper.classList.add("open");
    }

});

el.searchSantri.addEventListener("input", function(){

    filterSantriPanel = this.value
        .toLowerCase()
        .trim();


    const hasil = state.daftarSantri.filter(s =>
        s.nama
        .toLowerCase()
        .includes(filterSantriPanel)
    );


    renderMenuSantri(hasil);

});

function isiFilterSantriDashboard() {

    const select = document.getElementById("dashFilterSantri");

    if (!select) return;

    select.innerHTML = '<option value="">Semua Santri</option>';

    state.santri.forEach(s => {

        select.innerHTML += `
            <option value="${s.nama}">
                ${s.nama}
            </option>
        `;

    });

}

document
.getElementById("dashFilterSantri")
.addEventListener("input", function(){

    filterSantriDashboard = this.value
        .toLowerCase()
        .trim();


    rebuildDashboard();


});
/* ==========================================================
   PILIH SANTRI
========================================================== */

el.menuSantri.addEventListener(
    "click",
    e => {

        const item =
            e.target.closest(
                ".dropdown-item-custom"
            );

        if (!item) return;

        const id =
            item.dataset.id;

        pilihSantri(id);

        closeDropdown();

    }
);


/* ==========================================================
   SET SANTRI
========================================================== */

function pilihSantri(id) {

    const santri = state.daftarSantri.find(
        s => s.id === id
    );

    if (!santri) return;

  state.santriAktif = {
    ...santri,
    id: santri.id_santri,
    kelas: santri.tingkat_unit || "-"
};


    el.idSantri.value = santri.id;

    el.santri.value = santri.id;

    el.searchSantri.value = santri.nama_santri;


    tampilIdentitas(santri);

}

/* ==========================================================
   IDENTITAS
========================================================== */

function tampilIdentitas(data) {

    el.infoId.textContent =
        data.id_santri || data.id || "-";

    el.infoNama.textContent =
        data.nama_santri || "-";

    el.infoAyah.textContent =
        data.nama_ayah || "-";

    el.infoKelas.textContent =
        data.tingkat_unit || '-';

    el.infoStatus.textContent =
        data.status_santri || "-";

    el.infoDaftar.textContent =
        formatTanggal(
            data.tgl_daftar || '-'
        );

    el.kartuSantri.style.display =
        "block";

    el.navSantri.style.display =
        "flex";

}

/* ==========================================================
   RESET IDENTITAS
========================================================== */

function resetIdentitas() {

    [
        el.infoId,
        el.infoNama,
        el.infoAyah,
        el.infoKelas,
        el.infoStatus,
        el.infoDaftar

    ].forEach(i =>

        i.textContent = "-"

    );

}


/* ==========================================================
   VALIDASI SANTRI
========================================================== */

function pastikanSantriDipilih(showAlert = true) {

    if (!state.santriAktif) {

        if (showAlert) {
            info("Silakan pilih santri terlebih dahulu.");
        }

        return false;
    }

    return true;
}

/* ==========================================================
   INIT
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadSantri();

    }
);

/* ==========================================================
   PART 3
   KEHADIRAN SANTRI
========================================================== */

/* ==========================================================
   VALIDASI
========================================================== */

function validasiKehadiran() {

    if (!pastikanSantriDipilih()) return false;

    if (!el.tanggalKehadiran.value) {

        info("Tanggal kehadiran belum dipilih.");

        return false;

    }

    if (!el.statusKehadiran.value) {

        info("Status kehadiran belum dipilih.");

        return false;

    }

    return true;

}

/* ==========================================================
   DATA KEHADIRAN
========================================================== */

function getDataKehadiran() {

    return {

        id_santri: state.santriAktif.id_santri,

        nama: state.santriAktif.nama,

        kelas: state.santriAktif.tingkat_unit || "-",

        tanggal: el.tanggalKehadiran.value,

        status: el.statusKehadiran.value,

        createdAt: serverTimestamp()

    };

}


/* ==========================================================
   DOC ID
========================================================== */

function getKehadiranId(data) {

    return `${data.id_santri}_${data.tanggal}`;

}

/* ==========================================================
   SIMPAN
========================================================== */

async function simpanKehadiran() {

    if (!validasiKehadiran()) return false;

    try {

        setLoading(true);

        const data = getDataKehadiran();

        await setDoc(

            doc(
                db,
                COL.KEHADIRAN,
                getKehadiranId(data)
            ),

            data,

            {
                merge: true
            }

        );

        state.historyKehadiran.push(data);

        sukses("Kehadiran berhasil disimpan.");

        return true;

    }

    catch (err) {

        console.error(err);

        gagal("Gagal menyimpan kehadiran.");

        return false;

    }

    finally {

        setLoading(false);

    }

}


/* ==========================================================
   LOAD HISTORY KEHADIRAN
========================================================== */

async function loadHistoryKehadiran() {

if (!pastikanSantriDipilih(false)) return;

    try {

        const q = query(

            collection(db, COL.KEHADIRAN),

            where(
                "id_santri",
                "==",
                state.santriAktif.id_santri
            ),

            orderBy("tanggal", "desc")

        );

        const snap = await getDocs(q);

        state.historyKehadiran = snap.docs.map(doc => ({

            id: doc.id,

            ...doc.data()

        }));

    }

    catch (err) {
    console.error(err.code);
    console.error(err.message);
    console.error(err);
}

}


/* ==========================================================
   REKAP KEHADIRAN
========================================================== */

function hitungRekapKehadiran(data) {

    const hasil = {

        hadir: 0,

        izin: 0,

        sakit: 0,

        alpha: 0

    };

    data.forEach(item => {

        switch (item.status) {

            case "Hadir":

                hasil.hadir++;

                break;

            case "Izin":

                hasil.izin++;

                break;

            case "Sakit":

                hasil.sakit++;

                break;

            case "Alpha":

                hasil.alpha++;

                break;

        }

    });

    hasil.total =
        hasil.hadir +
        hasil.izin +
        hasil.sakit +
        hasil.alpha;

    hasil.persentase =
        hasil.total === 0
            ? 0
            : Math.round(
                (hasil.hadir / hasil.total) * 100
            );

    return hasil;

}

window.konversiPersenKehadiran = function(persen) {

    persen = Number(persen);

    if (isNaN(persen)) return { huruf: "E", angka: 0 };

    if (persen >= 95) return { huruf: "A", angka: 95 };
    if (persen >= 90) return { huruf: "B+", angka: 90 };
    if (persen >= 80) return { huruf: "B", angka: 85 };
    if (persen >= 70) return { huruf: "C", angka: 75 };
    if (persen >= 60) return { huruf: "D", angka: 65 };

    return { huruf: "E", angka: 50 };
};





/* ==========================================================
   RESET FORM
========================================================== */

function resetFormKehadiran() {

    el.tanggalKehadiran.value = today();

    el.statusKehadiran.selectedIndex = 0;

}


/* ==========================================================
   SIMPAN + LANJUT
========================================================== */

window.simpanDanKeHafalan = async function () {

    const ok = await simpanKehadiran();

    if (!ok) return;

    resetFormKehadiran();

    openTab(null, "input-panel");

}


/* ==========================================================
   AUTO LOAD
========================================================== */

document.addEventListener("DOMContentLoaded", () => {

    el.tanggalKehadiran.value = today();

});

/* ==========================================================
   PART 4
   HAFALAN SANTRI
========================================================== */
/* ==========================================================
   LOAD DAFTAR SURAH
========================================================== */

function loadDaftarSurah() {

    state.daftarSurah = [...dataSurahQuran];

    // Urutkan berdasarkan nomor surah
    state.daftarSurah.sort((a, b) => a.no - b.no);

    renderMenuSurah(state.daftarSurah);

}
/* ==========================================================
   MENU SURAH
========================================================== */

function renderMenuSurah(list) {

    if (!list.length) {

        el.menuSurah.innerHTML = `
            <div class="dropdown-item-custom">
                Tidak ada data
            </div>
        `;

        return;

    }

    el.menuSurah.innerHTML = list.map(s => `

        <div
            class="dropdown-item-custom"
            data-id="${s.no}">

            ${s.no}. ${s.nama}

        </div>

    `).join("");

}


/* ==========================================================
   SEARCH SURAH
========================================================== */

el.searchSurah.addEventListener("input", function () {

    const key = this.value
        .toLowerCase()
        .trim();

    const hasil = state.daftarSurah.filter(

        s => s.nama
            .toLowerCase()
            .includes(key)

    );

    renderMenuSurah(hasil);

    this.closest(".dropdown-wrapper-custom")
        .classList.add("open");

});


/* ==========================================================
   PILIH SURAH
========================================================== */

el.menuSurah.addEventListener("click", e => {

    const item = e.target.closest(".dropdown-item-custom");

    if (!item) return;

    pilihSurah(item.dataset.id);

    closeDropdown();

});


function pilihSurah(no) {

    const surah = state.daftarSurah.find(
        s => s.no == no
    );

    if (!surah) return;

    state.surahAktif = surah;

    el.searchSurah.value = surah.nama;
    el.surah.value = surah.nama;

    renderAyatMulai(surah.ayat);
    renderAyatSelesai(surah.ayat);
}

/* ==========================================================
   MENU AYAT
========================================================== */

function renderAyatMulai(total) {

    el.menuAyatMulai.innerHTML = "";

    for (let i = 1; i <= total; i++) {
        el.menuAyatMulai.innerHTML += `
            <div class="dropdown-item-custom" data-value="${i}">
                Ayat ${i}
            </div>
        `;
    }
}


function renderAyatSelesai(total) {

    el.menuAyatSelesai.innerHTML = "";

    for (let i = 1; i <= total; i++) {
        el.menuAyatSelesai.innerHTML += `
            <div class="dropdown-item-custom" data-value="${i}">
                Ayat ${i}
            </div>
        `;
    }
}

/*========================
   WRAPPER
========================================================== */

const wrapperMulai = el.menuAyatMulai.closest(".dropdown-wrapper-custom");
const wrapperSelesai = el.menuAyatSelesai.closest(".dropdown-wrapper-custom");
const wrapperStatus = el.boxStatusKehadiran.closest(".dropdown-wrapper-custom");

/* ==========================================================
   OPEN DROPDOWN
========================================================== */
el.ayatMulai.addEventListener("focus", () => {
    wrapperMulai.classList.add("open");
});

el.ayatSelesai.addEventListener("focus", () => {
    wrapperSelesai.classList.add("open");
});

el.kelancaran.addEventListener("focus", () => {
    wrapKelancaran.classList.add("open");
});

el.tahsin.addEventListener("focus", () => {
    wrapTahsin.classList.add("open");
});

el.tajwid.addEventListener("focus", () => {
    wrapTajwid.classList.add("open");
});

el.boxStatusKehadiran.addEventListener("click", () => {
    wrapperStatus.classList.add("open");
});
/* ==========================================================
   CLOSE SAAT KLIK LUAR
========================================================== */

document.addEventListener("click", (e) => {

    if (!e.target.closest(".dropdown-wrapper-custom")) {

        wrapperMulai.classList.remove("open");
        wrapperSelesai.classList.remove("open");

        wrapKelancaran.classList.remove("open");
        wrapTahsin.classList.remove("open");
        wrapTajwid.classList.remove("open");

        wrapperStatus.classList.remove("open"); // Tambahkan ini
    }

});

el.menuAyatSelesai.addEventListener("click", (e) => {

    const item = e.target.closest(".dropdown-item-custom");
    if (!item) return;

    el.ayatSelesai.value = item.dataset.value;

    wrapperSelesai.classList.remove("open");

    e.stopPropagation();

});

wrapKelancaran.querySelector(".dropdown-menu-custom").addEventListener("click", (e) => {

    const item = e.target.closest(".dropdown-item-custom");
    if (!item) return;

    el.kelancaran.value = item.textContent.trim();

    wrapKelancaran.classList.remove("open");

});
        wrapTahsin.querySelector(".dropdown-menu-custom").addEventListener("click", (e) => {

    const item = e.target.closest(".dropdown-item-custom");
    if (!item) return;

    el.tahsin.value = item.textContent.trim();

    wrapTahsin.classList.remove("open");

});
        wrapTajwid.querySelector(".dropdown-menu-custom").addEventListener("click", (e) => {

    const item = e.target.closest(".dropdown-item-custom");
    if (!item) return;

    el.tajwid.value = item.textContent.trim();

    wrapTajwid.classList.remove("open");

});

el.menuStatusKehadiranDropdown.addEventListener("click", (e) => {

    const item = e.target.closest(".dropdown-item-custom");
    if (!item) return;

    el.statusKehadiran.value = item.dataset.value;

    wrapperStatus.classList.remove("open");

    e.stopPropagation();
});
    
    wrapperStatus.classList.remove("open");

/* ==========================================================
   CLICK AYAT MULAI (EVENT DELEGATION)
========================================================== */

el.menuAyatMulai.addEventListener("click", (e) => {

    const item = e.target.closest(".dropdown-item-custom");
    if (!item) return;

    el.ayatMulai.value = item.dataset.value;

    wrapperMulai.classList.remove("open");

    hitungSetoran();      // hitung selisih
    updateAkumulasi();    // update total
});

/* ==========================================================
   CLICK AYAT SELESAI (EVENT DELEGATION)
========================================================== */

el.menuAyatSelesai.addEventListener("click", (e) => {

    const item = e.target.closest(".dropdown-item-custom");
    if (!item) return;

    ayatSelesai.value = item.dataset.value;

    wrapperSelesai.classList.remove("open");

    hitungSetoran();
    updateAkumulasi();
});

/* ==========================================================
   HITUNG JUMLAH AYAT
========================================================== */
const akumulasi = document.getElementById("inAkumulasi");
const setoran = document.getElementById("inSetoran");

const ayatMulai = document.getElementById("ayat_mulai");
const ayatSelesai = document.getElementById("ayat_selesai");


function updateAkumulasi() {
    const current = Number(setoran.value);

    if (!isNaN(current) && current >= 0) {
        akumulasi.value = current;
    } else {
        akumulasi.value = "";
    }
}

function hitungSetoran() {

    const mulai = Number(ayatMulai.value);
    const selesai = Number(ayatSelesai.value);

    if (isNaN(mulai) || isNaN(selesai)) {
        setoran.value = "";
        return;
    }

    if (selesai < mulai) {
        setoran.value = "0";
        akumulasi.value = "0";
        return;
    }

    const hasil = selesai - mulai + 1;

    setoran.value = hasil;
    akumulasi.value = hasil; // langsung sinkron
}

function hitungAyatTertinggi(data) {

    if (!Array.isArray(data) || data.length === 0) return "-";

    let max = 0;

    data.forEach(item => {

        const mulai = Number(item?.ayat_mulai);
        const selesai = Number(item?.ayat_selesai);

        if (isNaN(mulai) || isNaN(selesai)) return;

        const jumlah = selesai >= mulai ? (selesai - mulai + 1) : 0;

        if (jumlah > max) max = jumlah;
    });

    return max > 0 ? `${max} Ayat` : "-";
}

function syncHitungan() {

    const total = hitungTotalAyat();

    setoran.value = total;
    akumulasi.value = total;
}

function nilaiToAngka(label) {

    if (typeof label !== "string") return 0;

    label = label.trim().toLowerCase();

    // Ibadah & Akhlaq
    switch (label) {
        case "sangat baik": return 95;
        case "baik": return 80;
        case "cukup": return 70;
        case "kurang": return 50;
    }

    // Hafalan
    if (label.startsWith("a")) return 95;
    if (label.startsWith("b")) return 80;
    if (label.startsWith("c")) return 70;
    if (label.startsWith("d")) return 50;

    return 0;
}


/* ==========================================================
   VALIDASI
========================================================== */

function validasiHafalan() {

    if (!pastikanSantriDipilih()) return false;

    if (!el.tanggal.value) {

        info("Tanggal belum dipilih.");

        return false;

    }

    if (!el.surah.value) {

        info("Surah belum dipilih.");

        return false;

    }

    if (!el.ayatMulai.value) {

        info("Ayat mulai belum dipilih.");

        return false;

    }

    if (!el.ayatSelesai.value) {

        info("Ayat selesai belum dipilih.");

        return false;

    }

    return true;

}


/* ==========================================================
   OBJECT HAFALAN
========================================================== */

function getDataHafalan() {

    const mulai = angka(el.ayatMulai.value);
    const selesai = angka(el.ayatSelesai.value);

    return {

        id_santri: state.santriAktif.id_santri,
        nama: state.santriAktif.nama,
        kelas: state.santriAktif.tingkat_unit || "-",
        tanggal: el.tanggal.value,
        surah: el.surah.value,

        ayatMulai: mulai,
        ayatSelesai: selesai,

        totalAyat: selesai - mulai + 1,

        tasmi: el.tasmi.checked,
        kelancaran: el.kelancaran.value,
tahsin: el.tahsin.value,
tajwid: el.tajwid.value,

        catatan: trim(el.catatan.value),
        motivasi: trim(el.motivasi.value),

        // 🔥 AUTO JUZ (FIXED)
        juzMulai: getJuzFromAyat(mulai),
        juzSelesai: getJuzFromAyat(selesai),

        createdAt: serverTimestamp()
    };
}

/* ==========================================================
   SIMPAN
========================================================== */
function getHafalanId(data) {
    return `${data.id_santri}_${data.tanggal}`;
}
async function simpanHafalan() {

    if (!validasiHafalan()) return false;

    try {

        setLoading(true);

        const data = getDataHafalan();

        await setDoc(
    doc(
        db,
        COL.HAFALAN,
        getHafalanId(data)
    ),
    data,
    {
        merge: true
    }
);

    } catch (err) {

        console.error(err);

        gagal("Gagal menyimpan hafalan.");

        return false;

    } finally {

        setLoading(false);

    }
}

ayatMulai?.addEventListener("input", syncHitungan);
ayatSelesai?.addEventListener("input", syncHitungan);


// Agar bisa dipanggil dari HTML (onclick)
window.simpanHafalan = simpanHafalan;

function resetForm() {

    const form = document.getElementById("formHafalan"); // lebih aman

    if (!form) return;

    form.querySelectorAll("input, textarea, select").forEach(el => {

        if (el.type === "checkbox") {
            el.checked = false;
        } else {
            el.value = "";
        }
    });
    if (Number(el.ayatSelesai.value) < Number(el.ayatMulai.value)) {
    info("Ayat selesai tidak boleh lebih kecil dari ayat mulai.");
    return false;
}
} 

function buildRanking(data) {

    const map = {};

    data.forEach(item => {

        const id = item.id_santri;

        if (!map[id]) {
            map[id] = {
                id,
                nama: item.nama,
                kelas: item.kelas,
                totalAyat: 0,
                juzTertinggi: 0
            };
        }

        map[id].totalAyat += item.totalAyat || 0;

        // 🔥 PAKAI INI (FIX UTAMA)
        const j = Number(item.juzSelesai || item.juzMulai || 0);

        if (!isNaN(j) && j > map[id].juzTertinggi) {
            map[id].juzTertinggi = j;
        }
    });

    return Object.values(map)
        .sort((a, b) => b.totalAyat - a.totalAyat);
}

function renderRanking(data = []) {

    const tbody = document.getElementById("rankingBody");

    if (!tbody) return;

    if (!Array.isArray(data) || data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8">Belum ada data</td>
            </tr>
        `;
        return;
    }

    const ranking = [...data].sort((a, b) => {

        // Nilai Akhir
        if (b.nilaiAkhir !== a.nilaiAkhir) {
            return b.nilaiAkhir - a.nilaiAkhir;
        }

        // Hafalan
        if (b.nilaiHafalan !== a.nilaiHafalan) {
            return b.nilaiHafalan - a.nilaiHafalan;
        }

        // Ibadah
        if (b.nilaiIbadah !== a.nilaiIbadah) {
            return b.nilaiIbadah - a.nilaiIbadah;
        }

        // Kehadiran
        return b.persenHadir - a.persenHadir;

    });

    tbody.innerHTML = ranking.map((s, i) => {

        const predikat = angkaKeHuruf(s.nilaiAkhir);

        return `
<tr>

    <td>
        <span class="rank-badge">${i + 1}</span>
    </td>

    <td>${s.nama || "-"}</td>

    <td>${s.id_santri || "-"}</td>

    <td>${s.kelas || "-"}</td>

    <td>${formatNilai(s.persenHadir)}%</td>

    <td>${formatNilai(s.nilaiHafalan)}</td>

    <td>${formatNilai(s.nilaiIbadah)}</td>

    <td>
        <strong>${formatNilai(s.nilaiAkhir)}</strong>
    </td>

    <td>
        ${predikat.latin}<br>
        <small dir="rtl">${predikat.tulisan}</small>
    </td>

</tr>
`;
    }).join("");

}
function listenIbadah() {

    const q = collection(db, COL.IBADAH);

    onSnapshot(q, (snapshot) => {

        state.historyIbadah = snapshot.docs.map(doc => doc.data());

        isiDashboardIbadah(state.historyIbadah);

    });

}

/* ==========================================================
   LANJUT KE IBADAH
========================================================== */

window.simpanDanKeIbadah = async function () {

    const ok = await window.simpanHafalan();

    if (!ok) return;

    openTab(null, "ibadah-panel");
    

};

/* ==========================================================
   INIT
========================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await loadSantri();

        loadDaftarSurah();

    }
);

/* ==========================================================
   PART 5
   IBADAH & AKHLAQ
========================================================== */

/* ==========================================================
   KONVERSI NILAI
========================================================== */
window.konversiAngkaKePredikatIbadah = function(nilai) {

    nilai = Number(nilai);

    if (nilai >= 90) return "Sangat Baik";
    if (nilai >= 80) return "Baik";
    if (nilai >= 70) return "Cukup";

    return "Kurang";
};

/* ==========================================================
   PREDIKAT
========================================================== */

window.konversiAngkaKePredikatIbadah = function(nilai) {

    nilai = Number(nilai);

    if (nilai >= 90) return "Sangat Baik";
    if (nilai >= 80) return "Baik";
    if (nilai >= 70) return "Cukup";
 

    return "Kurang";
};

window.hurufKeArab = function(nilai) {

    const hasil = angkaKeHuruf(nilai);

    return `${hasil.arab} (${hasil.tulisan})`;

};
hurufKeArab(95);
// Mumtaz (ممتاز)

hurufKeArab(80);
// Jayyid Jiddan (جيد جداً)

hurufKeArab(70);
// Jayyid (جيد)

hurufKeArab(50);
// Maqbul (مقبول)

function angkaKePredikatArab(nilai) {

    nilai = Number(nilai);

    if (nilai >= 90)
        return {
            angka: nilai,
            arab: "Mumtaz",
            tulisan: "ممتاز"
        };

    if (nilai >= 80)
        return {
            angka: nilai,
            arab: "Jayyid Jiddan",
            tulisan: "جيد جداً"
        };

    if (nilai >= 70)
        return {
            angka: nilai,
            arab: "Jayyid",
            tulisan: "جيد"
        };

    if (nilai >= 50)
        return {
            angka: nilai,
            arab: "Maqbul",
            tulisan: "مقبول"
        };

    return {
        angka: nilai,
        arab: "Dha'if",
        tulisan: "ضعيف"
    };
}

function rataHuruf(data, field) {

    if (!Array.isArray(data) || data.length === 0) return 0;

    let total = 0;
    let jumlah = 0;

    data.forEach(item => {

        const nilai = nilaiToAngka(item[field]);

        if (nilai > 0) {
            total += nilai;
            jumlah++;
        }

    });

    return jumlah ? total / jumlah : 0;
}

function formatNilai(nilai) {

    nilai = Number(nilai);

    if (Number.isInteger(nilai)) {
        return nilai;
    }

    return Number(nilai.toFixed(1));

}
/* ==========================================================
   RATA-RATA SHOLAT
========================================================== */
function rataSholat() {

    const list = [
        el.subuh?.value || "",
        el.dzuhur?.value || "",
        el.ashar?.value || "",
        el.maghrib?.value || "",
        el.isya?.value || ""
    ];

    console.log("Data sholat:", list);

    const nilai = list.map(v => {
        const angka = nilaiToAngka(v);
        
        return angka;
    });

    

    const valid = nilai.filter(v => v > 0);

    if (valid.length === 0) return 0;

    const total = valid.reduce((a, b) => a + b, 0);

    return Number((total / valid.length).toFixed(1));
}
/* ==========================================================
   RATA-RATA AKHLAQ
========================================================== */

function rataAkhlaq() {

    const list = [
       el.adabGuru?.value || "",
    el.adabOrtu?.value || "",
    el.disiplin?.value || "",
    el.kebersihan?.value || ""
    ];
    console.log("LIST:", list);

    const nilai = list
        .map(v => nilaiToAngka(v))
        .filter(v => v > 0);
        

    if (nilai.length === 0) return 0;

    const total = nilai.reduce((a, b) => a + b, 0);

    return Number((total / nilai.length).toFixed(2));

}

/* ==========================================================
   DATA IBADAH
========================================================== */
function angkaKeHuruf(nilai) {

    nilai = Number(nilai) || 0;

    if (nilai >= 90) {
        return {
            angka: nilai,
            predikat: "Mumtaz",
            latin: "Mumtaz",
            arab: "Mumtaz",
            tulisan: "ممتاز"
        };
    }

    if (nilai >= 80) {
        return {
            angka: nilai,
            predikat: "Jayyid Jiddan",
            latin: "Jayyid Jiddan",
            arab: "Jayyid Jiddan",
            tulisan: "جيد جداً"
        };
    }

    if (nilai >= 70) {
        return {
            angka: nilai,
            predikat: "Jayyid",
            latin: "Jayyid",
            arab: "Jayyid",
            tulisan: "جيد"
        };
    }

    if (nilai >= 60) {
        return {
            angka: nilai,
            predikat: "Maqbul",
            latin: "Maqbul",
            arab: "Maqbul",
            tulisan: "مقبول"
        };
    }

    return {
        angka: nilai,
        predikat: "Dho'if",
        latin: "Dho'if",
        arab: "Dho'if",
        tulisan: "ضعيف"
    };

}

function konversiPredikat(teks) {

    switch ((teks || "").toLowerCase()) {

        case "sangat baik":
            return {
                angka: 95,
                arab: "Mumtaz",
                tulisan: "ممتاز"
            };

        case "baik":
            return {
                angka: 85,
                arab: "Jayyid Jiddan",
                tulisan: "جيد جداً"
            };

        case "cukup":
            return {
                angka: 75,
                arab: "Jayyid",
                tulisan: "جيد"
            };

        case "kurang":
            return {
                angka: 65,
                arab: "Maqbul",
                tulisan: "مقبول"
            };

        default:
            return {
                angka: 50,
                arab: "Dho'if",
                tulisan: "ضعيف"
            };
    }
}

function safeVal(el) {

    if (!el) return 0;

    const val = el.value;

    if (val === null || val === undefined || val === "") return 0;

    return Number(val) || 0;
}

function getDataIbadah() {

    const nilaiSholat = rataSholat();

    const tilawah = el.tilawah?.value || "";

    const nilaiIbadah = Number((
        (nilaiSholat + nilaiToAngka(tilawah)) / 2
    ).toFixed(1));

    const nilaiAkhlaq = rataAkhlaq();

    const rataTotal = Number((
        (nilaiIbadah + nilaiAkhlaq) / 2
    ).toFixed(1));

    console.log("CHECK ELEMEN:", {
        subuh: el.subuh,
        dzuhur: el.dzuhur,
        ashar: el.ashar,
        maghrib: el.maghrib,
        isya: el.isya,
        tilawah: el.tilawah
    });

    return {
        id_santri: state.santriAktif.id_santri,
        nama: state.santriAktif.nama,
        kelas: state.santriAktif.tingkat_unit || "-",

        tanggal: el.tanggal?.value || "",

        ibadah: {
            subuh: el.subuh?.value || "",
            dzuhur: el.dzuhur?.value || "",
            ashar: el.ashar?.value || "",
            maghrib: el.maghrib?.value || "",
            isya: el.isya?.value || "",
            tilawah: tilawah
        },

        akhlaq: {
            adabGuru: el.adabGuru?.value || "",
            adabOrtu: el.adabOrtu?.value || "",
            disiplin: el.disiplin?.value || "",
            kebersihan: el.kebersihan?.value || ""
        },

        rataSholat: Number(nilaiSholat.toFixed(1)),
        rataIbadah: nilaiIbadah,
        rataAkhlaq: Number(nilaiAkhlaq.toFixed(1)),
        rataTotal: rataTotal,

        catatan: el.catatanAkhlaq?.value || "",

        createdAt: serverTimestamp()
    };
}

/* ==========================================================
   VALIDASI
========================================================== */

function validasiIbadah() {

    if (!pastikanSantriDipilih()) return false;

    return true;

}


/* ==========================================================
   SIMPAN
========================================================== */
function getIbadahId(data) {
    return `${data.santriId}_${data.tanggal}`;
}

async function simpanIbadah() {

    if (!validasiIbadah()) return false;

    try {

        setLoading(true);

        const data = getDataIbadah();

        await setDoc(
    doc(
        db,
        COL.IBADAH,
        getIbadahId(data)
    ),
    data,
    {
        merge: true
    }
);

        state.historyIbadah.push(data);

        sukses("Data ibadah berhasil disimpan.");

        return true;

    }

    catch (err) {

    console.error("Gagal simpan ibadah:", err);

    alert(err.message);

    gagal("Gagal menyimpan data ibadah.");

    return false;

}

    finally {

        setLoading(false);

    }

}


/* ==========================================================
   LOAD HISTORY
========================================================== */

async function loadHistoryIbadah() {

if (!pastikanSantriDipilih(false)) return;

    try {

        const q = query(

            collection(db, COL.IBADAH),

            where(

                "id_santri",

                "==",

                state.santriAktif.id_santri

            ),

            orderBy("tanggal", "desc")

        );

        const snap = await getDocs(q);

        state.historyIbadah = snap.docs.map(doc => ({

            id: doc.id,

            ...doc.data()

        }));

    }

    catch (err) {

        console.error(err);

    }

}


/* ==========================================================
   RESET FORM
========================================================== */

function resetFormIbadah() {

    [
        el.subuh,
        el.dzuhur,
        el.ashar,
        el.maghrib,
        el.isya,
        el.tilawah,
        el.adabGuru,
        el.adabOrtu,
        el.disiplin,
        el.kebersihan
    ].forEach(elm => {

        if (elm) elm.value = "";   // ✔ aman untuk input

    });

    // reset catatan
    if (el.catatanAkhlaq) {
        el.catatanAkhlaq.value = "";
    }

    // reset tampilan dropdown custom (jika ada .selected)
    document.querySelectorAll(".dropdown-wrapper-custom .selected")
        .forEach(el => {
            if (el) el.textContent = "";
        });

}

/* ==========================================================
   SIMPAN + REKAP
========================================================== */
async function refreshMiniDashboard() {

    await Promise.all([
        loadHistoryHafalan(),
        loadHistoryKehadiran(),
        loadHistoryIbadah()
    ]);

    refreshDashboardMini();

}

window.simpanDanKeRekap = async function () {

    const ok = await simpanIbadah();
    if (!ok) return;

    // refresh mini dashboard
    await refreshMiniDashboard();

    resetFormIbadah();

    openTab(null, "rekap-panel");

};

/* ==========================================================
   AUTO LOAD HISTORY
========================================================== */

async function refreshSemuaHistory() {

    await Promise.all([
        loadHistoryHafalan(),
        loadHistoryKehadiran(),
        loadHistoryIbadah()
    ]);

    refreshDashboardMini();

}

/* ==========================================================
   PART 6
   REKAP HAFALAN & GENERATE LAPORAN
========================================================== */

/* ==========================================================
   LOAD HISTORY HAFALAN
========================================================== */

async function loadHistoryHafalan() {

if (!pastikanSantriDipilih(false)) return;

    try {

        const q = query(

            collection(db, COL.HAFALAN),

            where(
                "id_santri",
                "==",
                state.santriAktif.id_santri
            ),

            orderBy("tanggal", "asc")

        );

        const snap = await getDocs(q);

        state.historyHafalan = snap.docs.map(doc => ({

            id: doc.id,

            ...doc.data()

        }));

        return state.historyHafalan;

    }

    catch (err) {

        console.error(err);

        gagal("Gagal mengambil data hafalan.");

        return [];

    }

}


/* ==========================================================
   FILTER BULAN
========================================================== */

function filterHafalanBulanan() {

    const now = new Date();

    const bulan =
        el.bulan.dataset.value ||
        String(now.getMonth() + 1).padStart(2, "0");

    const tahun =
        el.tahun.dataset.value ||
        String(now.getFullYear());

    return state.historyHafalan.filter(item => {

        const tgl = new Date(item.tanggal);

        const b = String(tgl.getMonth() + 1).padStart(2, "0");
        const y = String(tgl.getFullYear());

        return (
            item.id_santri === state.santriAktif.id_santri &&
            String(tgl.getMonth() + 1).padStart(2, "0") === bulan &&
            String(tgl.getFullYear()) === tahun
        );


    });

}

/* ==========================================================
   HAFALAN LAMA
   Posisi hafalan terakhir sebelum bulan laporan
========================================================== */
function getHafalanLama() {

    const bulan = Number(el.bulan.dataset.value);
    const tahun = Number(el.tahun.dataset.value);

    const dataLama = state.historyHafalan
        .filter(item => {

            const tgl = new Date(item.tanggal);

            const b = tgl.getMonth() + 1;
            const t = tgl.getFullYear();

            return (
                t < tahun ||
                (t === tahun && b < bulan)
            );

        })
        .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

    if (!dataLama.length) return "-";

    const terakhir = dataLama[dataLama.length - 1];

    return `${terakhir.surah} [${terakhir.ayatMulai}-${terakhir.ayatSelesai}]`;

}

function hitungHafalanLama(data){

    const {bulan,tahun}=getPeriode();

    return data.filter(item=>{

        const t=new Date(item.tanggal);

        const b=String(t.getMonth()+1).padStart(2,"0");
        const y=String(t.getFullYear());

        return (
            y<tahun ||
            (y==tahun && b<bulan)
        );

    });

}

/* ==========================================================
   HAFALAN BARU
========================================================== */

function getHafalanBaru(dataBulanan) {

    if (!dataBulanan.length)
        return "-";

    const awal = dataBulanan[0];

    const akhir = dataBulanan[dataBulanan.length - 1];

    return `${awal.surah} Ayat ${awal.ayatMulai} - ${akhir.surah} Ayat ${akhir.ayatSelesai}`;

}


/* ==========================================================
   HAFALAN AKHIR
========================================================== */

function getAkumulasiTerakhir() {

    if (!state.historyHafalan.length)
        return "-";

    const last =
        state.historyHafalan[
            state.historyHafalan.length - 1
        ];

    return `${last.surah} Ayat ${last.ayatSelesai}`;

}

function getJuzFromAyat(ayat) {

    if (!ayat || isNaN(ayat)) return 1;

    for (let i = 0; i < JUZ_MAP.length; i++) {
        if (ayat >= JUZ_MAP[i].start && ayat <= JUZ_MAP[i].end) {
            return JUZ_MAP[i].juz;
        }
    }

    return 30;
}


/* ==========================================================
   TOTAL AYAT
========================================================== */

function hitungTotalAyat1(data) {

    return data.reduce(

        (total, item) =>

        total + item.totalAyat,

        0

    );

}

/* ==========================================================
   TOTAL TASMI
========================================================== */

function hitungTasmi(data) {

    return data.filter(

        x => x.tasmi

    ).length;

}

/* ==========================================================
   DASHBOARD MINI
========================================================== */
function predikatHafalan(kelancaran, tahsin, tajwid) {

    const rata = formatNilai(
        (kelancaran + tahsin + tajwid) / 3
    );

    let arab;
    let tulisan;

    if (rata >= 90) {
        arab = "Mumtaz";
        tulisan = "ممتاز";
    } else if (rata >= 80) {
        arab = "Jayyid Jiddan";
        tulisan = "جيد جداً";
    } else if (rata >= 70) {
        arab = "Jayyid";
        tulisan = "جيد";
    } else {
        arab = "Maqbul";
        tulisan = "مقبول";
    }

    return {
        angka: rata,
        arab,
        tulisan
    };
}

function isiDashboardMini(data = []) {

    const miniSetoran  = document.getElementById("mini-setoran");
    const miniJuz      = document.getElementById("mini-juz");
    const miniSurat    = document.getElementById("mini-surat");
    const miniAyat     = document.getElementById("mini-ayat");
    const miniKualitas = document.getElementById("mini-kualitas");

    if (!Array.isArray(data)) {
        console.warn("Data hafalan bukan array");
        return;
    }

    // ======================
    // TOTAL SETORAN
    // ======================
    if (miniSetoran) {
        miniSetoran.textContent = data.length;
    }

    // ======================
    // DATA TERAKHIR
    // ======================
    const last = data.at(-1);

    if (!last) {

        if (miniSurat) miniSurat.textContent = "-";
        if (miniAyat) miniAyat.textContent = "-";
        if (miniKualitas) miniKualitas.textContent = "-";
        if (miniJuz) miniJuz.textContent = hitungAyatTertinggi?.(data) ?? "-";

        return;
    }

    // ======================
    // SURAT
    // ======================
    if (miniSurat) {
        miniSurat.textContent =
            last.surah_label ??
            last.surah ??
            "-";
    }

    // ======================
    // AYAT
    // ======================
    if (miniAyat) {
        miniAyat.textContent =
            last.ayat_selesai ??
            last.ayatSelesai ??
            "-";
    }

    // ======================
    // KUALITAS HAFALAN
    // ======================
    if (miniKualitas) {

        const kel = rataHuruf(data, "kelancaran");
        const tah = rataHuruf(data, "tahsin");
        const taj = rataHuruf(data, "tajwid");

        const hasil = predikatHafalan(kel, tah, taj);

miniKualitas.innerHTML = `
    ${formatNilai(hasil.angka)}
    <br>
    <small>${hasil.arab}</small>
    <br>
    <small dir="rtl">${hasil.tulisan}</small>
`;
    }

    // ======================
    // JUZ
    // ======================
if (miniJuz) {

    const maxJuz = data.reduce((max, d) => {

        const j = Number(d.juzSelesai || d.juzMulai || 0);

        return (!isNaN(j) && j > max) ? j : max;

    }, 0);

    miniJuz.textContent = maxJuz > 0 ? `Juz ${maxJuz}` : "-";
}

}

function isiDashboardKehadiran(data = []) {

    const hadir = data.filter(x => x.status === "Hadir").length;
    const izin = data.filter(x => x.status === "Izin").length;
    const sakit = data.filter(x => x.status === "Sakit").length;
    const alpha = data.filter(x => x.status === "Alpha").length;

    const total = hadir + izin + sakit + alpha;

    const persen = total
        ? Math.round((hadir / total) * 100)
        : 0;

    const hasil = angkaKePredikatArab(persen);

    document.getElementById("dash-hadir").textContent = hadir;
document.getElementById("dash-izin").textContent = izin;
document.getElementById("dash-sakit").textContent = sakit;
document.getElementById("dash-alpha").textContent = alpha;
document.getElementById("dash-persen").textContent = persen + "%";
const elNilai = document.getElementById("dash-nilai-kehadiran");

if (elNilai) {
elNilai.innerHTML = `
    <strong>${formatNilai(hasil.angka)}</strong><br>
    <small>${hasil.arab}</small><br>
    <small dir="rtl">${hasil.tulisan}</small>
`;
}
}

function isiDashboardIbadah(data = []) {

    if (!Array.isArray(data) || !data.length) return;

    const rataSholat =
        data.reduce((a,b)=>a+Number(b.rataSholat||0),0)/data.length;

    const rataAkhlaq =
        data.reduce((a,b)=>a+Number(b.rataAkhlaq||0),0)/data.length;

    const rataTotal =
        data.reduce((a,b)=>a+Number(b.rataTotal||0),0)/data.length;

    const hasil = angkaKeHuruf(rataTotal);

    const elSholat   = document.getElementById("dash-sholat");
    const elAkhlaq   = document.getElementById("dash-akhlaq");
    const elPredikat = document.getElementById("dash-predikat");

    if (elSholat)
        elSholat.textContent = formatNilai(rataSholat);

    if (elAkhlaq)
        elAkhlaq.textContent = formatNilai(rataAkhlaq);

    if (elPredikat) {
        elPredikat.innerHTML = `
            <strong>${formatNilai(hasil.angka)}</strong><br>
            <small>${hasil.arab}</small><br>
            <small dir="rtl">${hasil.tulisan}</small>
        `;
    }
}

/* ==========================================================
   REFRESH DASHBOARD MINI
========================================================== */

function refreshDashboardMini() {

    isiDashboardMini(state.historyHafalan || []);

    isiDashboardKehadiran(state.historyKehadiran || []);

    isiDashboardIbadah(state.historyIbadah || []);

    if (typeof renderRanking === "function") {
        renderRanking(state.historyHafalan || []);
    }

}

/* ==========================================================
   GENERATE
========================================================== */
window.generateLaporan = async function () {

    if (!pastikanSantriDipilih()) return;

    try {

        // ======================
        // LOAD DATA
        // ======================
        await loadHistoryHafalan();
        await loadHistoryKehadiran();
        await loadHistoryIbadah();

        const data = filterHafalanBulanan();
/* ==========================================================
   NORMALISASI DATA
========================================================== */
const laporan = (data || []).map(item => ({

    ...item,

    // IDENTITAS
    nama_santri: item.nama ?? "-",
    unit_kelas: item.kelas ?? "-",

    // HAFALAN
    surah_label: item.surah ?? "-",
    ayat_mulai: Number(item.ayatMulai ?? 0),
    ayat_selesai: Number(item.ayatSelesai ?? 0),
    total_ayat_bulanan: Number(item.totalAyat ?? 0),

    // TASMI'
    is_tasmi: Boolean(item.tasmi),

    // NILAI
    nilai: {
        kelancaran: item.kelancaran ?? "-",
        tahsin: item.tahsin ?? "-",
        tajwid: item.tajwid ?? "-"
    },

    // Tetap pertahankan format baru
    kelancaran: item.kelancaran ?? "-",
    tahsin: item.tahsin ?? "-",
    tajwid: item.tajwid ?? "-",

    // CATATAN
    catatan: item.catatan ?? "-",
    motivasi: item.motivasi ?? "-",

    // TANGGAL
    tanggal_input: item.tanggal ?? ""

}));

if (data.length) {
    
}
   await refreshMiniDashboard();

        // ======================
        // HITUNG NILAI
        // ======================
        const kelancaran = rataHuruf(data, "kelancaran");
        const tahsin = rataHuruf(data, "tahsin");
        const tajwid = rataHuruf(data, "tajwid");

        const predikat = predikatHafalan(kelancaran, tahsin, tajwid);

        // ======================
        // AMBIL ELEMENT (SAFE)
        // ======================
        const el = (id) => document.getElementById(id);

        const box = el("boxLaporanRekap");
const mini = el("dashboardRekap");

if (!box || !mini) {
    console.error("dashboardRekap atau boxLaporanRekap tidak ditemukan");
    return;
}

mini.style.display = "none";
box.style.display = "block";

// ======================
// UPDATE LAPORAN
// ======================
const set = (id, val) => {
    const e = el(id);
    if (e) e.textContent = val ?? "-";
};

// Data terakhir
const terakhir = laporan.at(-1);
const ibadahTerakhir = state.historyIbadah.at(-1);

// ======================
// HAFALAN
// ======================
set("cellHafalanLama", getHafalanLama());
set("cellHafalanBaru", getHafalanBaru(laporan));
set("cellHafalanTerakhir", getAkumulasiTerakhir(laporan));

// ======================
// NILAI
// ======================
set("avgKelancaranGabungan", formatNilai(kelancaran));
set("avgTahsinGabungan", formatNilai(tahsin));
set("avgTajwidGabungan", formatNilai(tajwid));

set("avgTotalGabungan", formatNilai(predikat.angka));
set("avgTotalAngka", formatNilai(predikat.angka));
set("avgTotalHuruf", predikat.arab);
set("avgTotalArab", predikat.tulisan);

// ======================
// INTENSITAS
// ======================
set("txtTotalSetoran", laporan.length);
set("txtTotalAyat", hitungTotalAyat(laporan));
set("txtTotalTasmi", hitungTasmi(laporan));

// ======================
// IDENTITAS
// ======================
set("lblNama", terakhir?.nama_santri);
set("lblKelasUnit", terakhir?.unit_kelas);

// ======================
// CATATAN
// ======================

const catatanHafalan = terakhir?.catatan || "-";
const catatanIbadah = ibadahTerakhir?.catatan || "-";

const cellCatatan = el("cellCatatanUstadz");

if (cellCatatan) {
    cellCatatan.innerHTML = `
        <div class="catatan-item">
            <strong>Hafalan</strong>
            <div>${catatanHafalan}</div>
        </div>

        <div class="catatan-item">
            <strong>Ibadah & Akhlaq</strong>
            <div>${catatanIbadah}</div>
        </div>
    `;
}

set("cellMotivasiUstadz", terakhir?.motivasi);

// ======================
// PERIODE
// ======================
if (el("txtPeriodeLaporan")) {
    const bulan = el("filter-bulan")?.value || "";
    const tahun = el("filter-tahun")?.value || "";
    set("txtPeriodeLaporan", `${bulan} ${tahun}`);
}

sukses("Laporan berhasil dibuat.");

    } catch (err) {
        console.error("ERROR GENERATE LAPORAN:", err);
        alert(err.message);
    }
};

/* ==========================================================
   PART 7
   REKAP KEHADIRAN + IBADAH + AKHLAQ
========================================================== */


/* ==========================================================
   LOAD HISTORY KEHADIRAN
========================================================== */

window.loadHistoryKehadiran = async function () {


if (!pastikanSantriDipilih(false)) return;

    try {

        const q = query(

            collection(db, COL.KEHADIRAN),

            where(
                "id_santri",
                "==",
                state.santriAktif.id_santri
            ),

            orderBy("tanggal", "asc")

        );

        const snap = await getDocs(q);

        state.historyKehadiran = snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return state.historyKehadiran;

    }

    catch (err) {

        console.error(err);

        return [];

    }

}


/* ==========================================================
   FILTER KEHADIRAN
========================================================== */

function filterKehadiranBulanan() {

    const bulan = el.bulan.dataset.value;

    const tahun = el.tahun.dataset.value;

    return state.historyKehadiran.filter(item => {

        const tgl = new Date(item.tanggal);

        return (
            item.id_santri === state.santriAktif.id_santri &&
            String(tgl.getMonth() + 1).padStart(2, "0") === bulan &&
            String(tgl.getFullYear()) === tahun
        );


    });

}


/* ==========================================================
   HITUNG KEHADIRAN
========================================================== */

function rekapKehadiran(data) {

    const hasil = {

        hadir:0,
        izin:0,
        sakit:0,
        alpha:0

    };

    data.forEach(item=>{

        switch(item.status){

            case "Hadir":

                hasil.hadir++;
                break;

            case "Izin":

                hasil.izin++;
                break;

            case "Sakit":

                hasil.sakit++;
                break;

            default:

                hasil.alpha++;

        }

    });

    hasil.total =
        hasil.hadir+
        hasil.izin+
        hasil.sakit+
        hasil.alpha;

    hasil.persen =
        hasil.total
        ? ((hasil.hadir/hasil.total)*100)
        :0;

    return hasil;

}


/* ==========================================================
   NILAI KEHADIRAN
========================================================== */

function nilaiKehadiran(persen){

    if(persen>=95) return "A";

    if(persen>=85) return "B";

    if(persen>=75) return "C";

    return "D";

}


/* ==========================================================
   TAMPILKAN KEHADIRAN
========================================================== */

function tampilkanRekapKehadiran() {

    const data = filterKehadiranBulanan();
    const r = rekapKehadiran(data);

    const hasil = konversiPersenKehadiran(r.persen);
    const nilai = angkaKeHuruf(hasil.angka);

    const set = (id, value) => {
        const e = document.getElementById(id);
        if (!e) return;

        // khusus nilai
        if (id === "dash-nilai-kehadiran" ||
            id === "rekapNilaiKehadiran") {

            e.innerHTML = `
                <strong>${formatNilai(nilai.angka)}</strong><br>
                <small>${nilai.arab}</small><br>
                <small dir="rtl">${nilai.tulisan}</small>
            `;
            return;
        }

        e.textContent = value;
    };

    set("dash-hadir", r.hadir);
    set("dash-izin", r.izin);
    set("dash-sakit", r.sakit);
    set("dash-alpha", r.alpha);
    set("dash-persen", formatNilai(r.persen) + "%");

    set("dash-nilai-kehadiran");

    set("rekapHadir", r.hadir);
    set("rekapIzin", r.izin);
    set("rekapSakit", r.sakit);
    set("rekapAlpha", r.alpha);
    set("rekapPersentase", formatNilai(r.persen) + "%");

    set("rekapNilaiKehadiran");
}

/* ==========================================================
   FILTER IBADAH
========================================================== */

function filterIbadahBulanan() {

    const bulan = el.bulan.dataset.value;
    const tahun = el.tahun.dataset.value;

    if (!state.santriAktif) return [];

    return state.historyIbadah.filter(item => {

        const tgl = new Date(item.tanggal);

        return (
            item.id_santri === state.santriAktif.id_santri &&
            String(tgl.getMonth() + 1).padStart(2, "0") === bulan &&
            String(tgl.getFullYear()) === tahun
        );

    });

}

/* ==========================================================
   RATA-RATA
========================================================== */

function rataData(data,key){

    if(!data.length) return "-";

    let total=0;

    data.forEach(item=>{

        total+=item[key];

    });

    return (total/data.length).toFixed(1);

}


/* ==========================================================
   IBADAH
========================================================== */

function tampilkanRekapIbadah() {

    const data = filterIbadahBulanan();

    if (!data.length) return;

    const last = data[data.length - 1];

    const set = (id, value) => {
        const e = document.getElementById(id);
        if (e) e.textContent = value ?? "-";
    };

    const setNilai = (id, nilai) => {

        const e = document.getElementById(id);
        if (!e) return;

        const hasil = angkaKeHuruf(nilai);

        e.innerHTML = `
            <strong>${formatNilai(hasil.angka)}</strong><br>
            <small>${hasil.arab}</small><br>
            <small dir="rtl">${hasil.tulisan}</small>
        `;
    };

    // Rekap
    setNilai("rekapSholat", last.rataSholat);
    setNilai("rekapTilawah", nilaiToAngka(last.ibadah?.tilawah));
setNilai("rekapAdabGuru", nilaiToAngka(last.akhlaq?.adabGuru));
setNilai("rekapAdabOrtu", nilaiToAngka(last.akhlaq?.adabOrtu));
setNilai("rekapDisiplin", nilaiToAngka(last.akhlaq?.disiplin));
setNilai("rekapKebersihan", nilaiToAngka(last.akhlaq?.kebersihan));

 // Dashboard
setNilai("dash-sholat", last.rataIbadah);
setNilai("dash-akhlaq", last.rataAkhlaq);
setNilai("dash-predikat", last.rataTotal);

// Rekap
setNilai("rekapPredikatAkhlaq", last.rataTotal);
}

/* ==========================================================
   CATATAN
========================================================== */

function tampilkanCatatan() {

    const lastHafalan = state.historyHafalan.at(-1);
    const lastIbadah  = state.historyIbadah.at(-1);

 const catatan = $("#cellCatatanUstadz");

if (catatan) {
    catatan.innerHTML = `
        <div style="font-weight:600;color:#0b6b2e;margin-bottom:4px">
            Hafalan
        </div>
        <div style="margin-bottom:16px">
            ${lastHafalan?.catatan || "-"}
        </div>

        <div style="font-weight:600;color:#0b6b2e;margin-bottom:4px">
            Ibadah & Akhlaq
        </div>
        <div>
            ${lastIbadah?.catatan || "-"}
        </div>
    `;
}

const motivasi = $("#cellMotivasiUstadz");

if (motivasi) {
    motivasi.textContent = lastHafalan?.motivasi || "-";
}
}

/* ==========================================================
   GABUNG KE GENERATE
========================================================== */

const generateLaporanLama = window.generateLaporan;

window.generateLaporan = async function () {

    await generateLaporanLama();

  // ======================
// REKAP KEHADIRAN
// ======================
tampilkanRekapKehadiran();

// ======================
// REKAP IBADAH
// ======================
tampilkanRekapIbadah();

// ======================
// CATATAN & MOTIVASI
// ======================
tampilkanCatatan();

};

// ===============================
// DASHBOARD V2 - SINGLE ENGINE
// ===============================
/* ==========================================================
   SCORING ENGINE
========================================================== */
function setPredikatCard(id, nilai, suffix = "") {

    const el = document.getElementById(id);

    if (!el) return;

    const hasil = angkaKeHuruf(Number(nilai) || 0);

    el.innerHTML = `
        <strong>${formatNilai(nilai)}${suffix}</strong><br>
        <small>${hasil.arab}</small><br>
        <small dir="rtl">${hasil.tulisan}</small>
    `;

}

let data = state.dashboard.data;

async function rebuildDashboard() {

    const data = await ambilSemuaData();

    let rekap = hitungRekapPerSantri(data);

    const filterNama = filterSantriDashboard;

    if (filterNama) {
        rekap = rekap.filter(item =>
            (item.nama || "")
                .toLowerCase()
                .includes(filterNama)
        );
    }

const summary = hitungSummaryDashboard(rekap);

const statistik = {

    jumlahSantri: rekap.length,

    totalAyat: rekap.reduce(
        (total, item) => total + (Number(item.totalAyat) || 0),
        0
    ),

    totalSetoran: rekap.reduce(
        (total, item) => total + (Number(item.frekuensi) || 0),
        0
    ),

    totalTasmi: rekap.reduce(
        (total, item) => total + (Number(item.tasmi) || 0),
        0
    ),

    rataKehadiran: rekap.length
        ? rekap.reduce(
            (total, item) => total + (Number(item.persenHadir) || 0),
            0
        ) / rekap.length
        : 0,

    rataHafalan: rekap.length
        ? rekap.reduce(
            (total, item) => total + (Number(item.nilaiHafalan) || 0),
            0
        ) / rekap.length
        : 0,

    rataIbadah: rekap.length
        ? rekap.reduce(
            (total, item) => total + (Number(item.nilaiIbadah) || 0),
            0
        ) / rekap.length
        : 0,

    rataNilaiAkhir: rekap.length
        ? rekap.reduce(
            (total, item) => total + (Number(item.nilaiAkhir) || 0),
            0
        ) / rekap.length
        : 0

};

state.dashboard = {
    rekap,
    statistik,
    summary,
    periode: getPeriode()
};

    updateDashboardSummary();

    renderDashboardTable(rekap);

    renderRanking(rekap);

    updateGrafikDashboard();

}

async function ambilSemuaData() {

    const [
        hafalanSnap,
        hadirSnap,
        ibadahSnap
    ] = await Promise.all([

        getDocs(collection(db,"setoran_hafalan")),
        getDocs(collection(db,"kehadiran_santri")),
        getDocs(collection(db,"ibadah_akhlaq_santri"))

    ]);

    const hafalan = hafalanSnap.docs.map(d=>d.data());
    const kehadiran = hadirSnap.docs.map(d=>d.data());
    const ibadah = ibadahSnap.docs.map(d=>d.data());

    return {
        hafalan,
        kehadiran,
        ibadah
    };
}

// =====================================
// ENGINE PERIODE V3
// =====================================

function getPeriode() {

    const now = new Date();

    return {

        bulan:
            document.getElementById("filterBulan")?.dataset.value ||
            String(now.getMonth() + 1).padStart(2, "0"),

        tahun:
            document.getElementById("filterTahun")?.dataset.value ||
            String(now.getFullYear())

    };

}

// =====================================

function filterPeriode(data = []) {

    const { bulan, tahun } = getPeriode();

    return data.filter(item => {

        if (!item.tanggal) return false;

        const t = new Date(item.tanggal);

        return (
            String(t.getMonth() + 1).padStart(2, "0") === bulan &&
            String(t.getFullYear()) === tahun
        );

    });

}

// =====================================

function filterSebelumPeriode(data = []) {

    const { bulan, tahun } = getPeriode();

    return data.filter(item => {

        if (!item.tanggal) return false;

        const t = new Date(item.tanggal);

        const b = String(t.getMonth() + 1).padStart(2, "0");
        const y = String(t.getFullYear());

        return (
            y < tahun ||
            (y === tahun && b < bulan)
        );

    });

}

function hitungTotalAyat(data = []) {

    return data.reduce(
        (a, b) => a + Number(b.totalAyat || 0),
        0
    );

}

function hitungProgressHafalan(data = []) {

    const lama = filterSebelumPeriode(data);

    const baru = filterPeriode(data);

    const totalLama = hitungTotalAyat(lama);

    const totalBaru = hitungTotalAyat(baru);

    return {

        hafalanLama: totalLama,

        hafalanBaru: totalBaru,

        akumulasi: totalLama + totalBaru,

        totalAyat: data.reduce(
            (a, b) => a + Number(b.totalAyat || 0),
            0
        )

    };

}


function hitungNilaiSantri(hafalan=[], kehadiran=[], ibadah=[]) {

    // ==========================
    // HAFALAN
    // ==========================

const now = new Date();

const bulan = now.getMonth() + 1;
const tahun = now.getFullYear();

    const kel = rataHuruf(hafalan, "kelancaran");
    const tah = rataHuruf(hafalan, "tahsin");
    const taj = rataHuruf(hafalan, "tajwid");
const progress = hitungProgressHafalan(hafalan);
    const nilaiHafalan = predikatHafalan(kel, tah, taj);

const hafalanLama = hafalan.filter(item => {

    const tgl = new Date(item.tanggal);

    return (
        tgl.getFullYear() < tahun ||
        (
            tgl.getFullYear() === tahun &&
            (tgl.getMonth() + 1) < bulan
        )
    );

});

const hafalanBaru = hafalan.filter(item => {

    const tgl = new Date(item.tanggal);

    return (
        tgl.getFullYear() === tahun &&
        (tgl.getMonth() + 1) === bulan
    );

});

const totalLama = hitungTotalAyat(hafalanLama);
const totalBaru = hitungTotalAyat(hafalanBaru);

const akumulasi = totalLama + totalBaru;
const totalAyat = akumulasi;

    const juz = hafalan.reduce((m,d)=>{
        const j = Number(d.juzSelesai||d.juzMulai||0);
        return j>m ? j : m;
    },0);

    // ==========================
    // KEHADIRAN
    // ==========================

    const hadir = kehadiran.filter(x=>x.status==="Hadir").length;
    const izin  = kehadiran.filter(x=>x.status==="Izin").length;
    const sakit = kehadiran.filter(x=>x.status==="Sakit").length;
    const alpha = kehadiran.filter(x=>x.status==="Alpha").length;

    const total = hadir+izin+sakit+alpha;

    const persen = total
        ? Math.round(hadir*100/total)
        : 0;

    const hurufKehadiran = nilaiKehadiran(persen);

const dataKehadiran = {
    angka: konversiHurufKeAngka(hurufKehadiran),
    ...angkaKeHuruf(konversiHurufKeAngka(hurufKehadiran))
};

 // ==========================
// IBADAH & AKHLAQ
// ==========================

const rataSholat = ibadah.length
    ? ibadah.reduce((a, b) => a + Number(b.rataSholat || 0), 0) / ibadah.length
    : 0;

const rataAkhlaq = ibadah.length
    ? ibadah.reduce((a, b) => a + Number(b.rataAkhlaq || 0), 0) / ibadah.length
    : 0;

const rataTotal = ibadah.length
    ? ibadah.reduce((a, b) => a + Number(b.rataTotal || 0), 0) / ibadah.length
    : 0;

const predikatIbadah = angkaKeHuruf(rataTotal);

const nilaiAkhir =
(
    nilaiHafalan.angka * 0.40 +
    dataKehadiran.angka * 0.30 +
    predikatIbadah.angka * 0.30
);

    return {

    // ==========================
    // HAFALAN
    // ==========================
    hafalanLama: progress.hafalanLama,
    hafalanBaru: progress.hafalanBaru,
    akumulasi: progress.akumulasi,
    totalAyat: progress.totalAyat,
    juz,

    frekuensi: hafalan.length,
    tasmi: hafalan.filter(x => x.tasmi).length,

    nilaiHafalan: nilaiHafalan.angka,
    kualitas: nilaiHafalan.angka,
    predikatHafalan: nilaiHafalan.arab,
    predikatHafalanArab: nilaiHafalan.tulisan,

    // ==========================
    // KEHADIRAN
    // ==========================
    hadir,
    izin,
    sakit,
    alpha,

    persenHadir: persen,

    nilaiKehadiran: dataKehadiran.angka,
predikatKehadiran: dataKehadiran.arab,
predikatKehadiranArab: dataKehadiran.tulisan,
    // ==========================
    // IBADAH
    // ==========================
    nilaiIbadah: Number(rataSholat.toFixed(1)),
nilaiAkhlaq: Number(rataAkhlaq.toFixed(1)),
nilaiIbadahAkhlaq: Number(rataTotal.toFixed(1)),

predikatIbadah: predikatIbadah.arab,
predikatIbadahArab: predikatIbadah.tulisan,
    // ==========================
    // NILAI AKHIR
    // ==========================
    nilaiAkhir,

    predikat: angkaKeHuruf(nilaiAkhir).arab,
    predikatArab: angkaKeHuruf(nilaiAkhir).tulisan

};
}

function hitungRekapPerSantri(data) {
data = data || {};

    const hafalan = data.hafalan || [];
    const kehadiran = data.kehadiran || [];
    const ibadah = data.ibadah || [];

    const map = new Map();

    data.hafalan.forEach(item => {

        if (!item.id_santri) return;

        if (!map.has(item.id_santri)) {

            map.set(item.id_santri, {

    id_santri: item.id_santri,
    nama: item.nama || "-",
    kelas: item.kelas || "-",

    hadir: 0,
    izin: 0,
    sakit: 0,
    alpha: 0,

    rataIbadah: 0,
    jumlahIbadah: 0

});

        }

    });

    // =========================
    // KEHADIRAN
    // =========================
    data.kehadiran.forEach(item => {

        const r = map.get(item.id_santri);
        if (!r) return;

        if (item.status === "Hadir") r.hadir++;
        if (item.status === "Izin") r.izin++;
        if (item.status === "Sakit") r.sakit++;
        if (item.status === "Alpha") r.alpha++;
    });

    // =========================
    // IBADAH
    // =========================
    data.ibadah.forEach(item => {

        const r = map.get(item.id_santri);
        if (!r) return;

        r.rataIbadah += Number(item.rataTotal || 0);
        r.jumlahIbadah++;
    });
    
     // =========================
    // SCORING ENGINE
    // =========================
    const hasil = [];

map.forEach((santri, id) => {

    const nilai = hitungNilaiSantri(

        data.hafalan.filter(x => x.id_santri === id),

        data.kehadiran.filter(x => x.id_santri === id),

        data.ibadah.filter(x => x.id_santri === id)

    );

    hasil.push({

        id_santri: santri.id_santri,

        nama: santri.nama,

        kelas: santri.kelas,

        ...nilai

    });

});

return hasil;
}

function hitungSummaryDashboard(rekap = []) {

    if (!Array.isArray(rekap) || !rekap.length) {

        return {

            terbaik: null,
            hafalan: null,
            hadir: null,
            ibadah: null,

            avgHafalan: 0,
            avgHadir: 0,
            avgIbadah: 0,
            avgNilai: 0,

            jumlahSantri: 0,
            totalSetoran: 0,
            totalAyat: 0,
            totalTasmi: 0

        };

    }

    return {

        // =====================================
        // TERBAIK
        // =====================================

        terbaik: [...rekap]
            .sort((a, b) => b.nilaiAkhir - a.nilaiAkhir)[0],

        hafalan: [...rekap]
            .sort((a, b) => b.totalAyat - a.totalAyat)[0],

        hadir: [...rekap]
            .sort((a, b) => b.persenHadir - a.persenHadir)[0],

        ibadah: [...rekap]
            .sort((a, b) => b.nilaiIbadah - a.nilaiIbadah)[0],

        // =====================================
        // RATA-RATA
        // =====================================

        avgHafalan:
            formatNilai(
                rekap.reduce((a, b) => a + Number(b.nilaiHafalan || 0), 0)
                / rekap.length
            ),

        avgHadir:
            formatNilai(
                rekap.reduce((a, b) => a + Number(b.persenHadir || 0), 0)
                / rekap.length
            ),

        avgIbadah:
            formatNilai(
                rekap.reduce((a, b) => a + Number(b.nilaiIbadah || 0), 0)
                / rekap.length
            ),

        avgNilai:
            formatNilai(
                rekap.reduce((a, b) => a + Number(b.nilaiAkhir || 0), 0)
                / rekap.length
            ),

        // =====================================
        // STATISTIK
        // =====================================

        jumlahSantri: rekap.length,

        totalSetoran:
            rekap.reduce((a, b) => a + Number(b.frekuensi || 0), 0),

        totalAyat:
            rekap.reduce((a, b) => a + Number(b.totalAyat || 0), 0),

        totalTasmi:
            rekap.reduce((a, b) => a + Number(b.tasmi || 0), 0)

    };

}

function updateDashboardSummary() {

    const s = state.dashboard.summary;

    if (!s) return;

    // =====================================
    // DATA KOSONG
    // =====================================

    if (!s.terbaik) {

        setCard("dashBestNama", "-");
        setCard("dashBestPredikat", "-");

        setCard("dashHafalanNama", "-");
        setCard("dashHafalanInfo", "0 Ayat");
        setCard("dashHafalanNilai", "-");

        setCard("dashHadirNama", "-");
        setCard("dashHadirPersen", "0 %");
        setCard("dashHadirNilai", "-");

        setCard("dashIbadahNama", "-");
        setCard("dashIbadahNilai", "-");

        setCard("dashAvgHadir", "-");
        setCard("dashAvgHafalan", "-");
        setCard("dashAvgIbadah", "-");
        setCard("dashAvgPredikat", "-");

        // Card statistik (Dashboard V3)

        setCard("dashJumlahSantri", "0");
        setCard("dashTotalSetoran", "0");
        setCard("dashTotalAyat", "0");
        setCard("dashTotalTasmi", "0");

        return;
    }

    // =====================================
    // SANTRI TERBAIK
    // =====================================

    setCard("dashBestNama", s.terbaik.nama);
    setPredikatCard("dashBestPredikat", s.terbaik.nilaiAkhir);

    // =====================================
    // HAFALAN TERBAIK
    // =====================================

    setCard("dashHafalanNama", s.hafalan.nama);
    setCard("dashHafalanInfo", `${s.hafalan.totalAyat} Ayat`);
    setPredikatCard("dashHafalanNilai", s.hafalan.nilaiHafalan);

    // =====================================
    // KEHADIRAN TERBAIK
    // =====================================

    const hasilKehadiran = konversiPersenKehadiran(s.hadir.persenHadir);
setCard("dashHadirNama", s.hadir.nama);
setCard("dashHadirPersen", `${formatNilai(s.hadir.persenHadir)} %`);
setPredikatCard("dashHadirNilai", hasilKehadiran.angka);
    // =====================================
    // IBADAH TERBAIK
    // =====================================

    setCard("dashIbadahNama", s.ibadah.nama);
    setPredikatCard("dashIbadahNilai", s.ibadah.nilaiIbadah);

    // =====================================
    // RATA-RATA
    // =====================================
const hasil = konversiPersenKehadiran(s.avgHadir);
const nilai = angkaKeHuruf(hasil.angka);
document.getElementById("dashAvgHadir").innerHTML = `
    <strong>${formatNilai(s.avgHadir)} %</strong><br>
    <small>${formatNilai(hasil.angka)}</small><br>
    <small>${nilai.arab}</small><br>
    <small dir="rtl">${nilai.tulisan}</small>
`;

    setPredikatCard("dashAvgHafalan", s.avgHafalan);
    setPredikatCard("dashAvgIbadah", s.avgIbadah);
    setPredikatCard("dashAvgPredikat", s.avgNilai);

    // =====================================
    // STATISTIK
    // =====================================

    setCard("dashJumlahSantri", s.jumlahSantri);
    setCard("dashTotalSetoran", s.totalSetoran);
    setCard("dashTotalAyat", s.totalAyat);
    setCard("dashTotalTasmi", s.totalTasmi);
   
   updateGrafikDashboard();
}

function konversiHurufKeAngka(huruf) {
    switch (huruf) {
        case "A": return 95;
        case "B": return 85;
        case "C": return 75;
        case "D": return 65;
        default: return 0;
    }
}
function renderDashboardTable(data) {

    const tbodyKehadiran = document.getElementById("dashboardBodyKehadiran");
    const tbodyHafalan   = document.getElementById("dashboardBodyHafalan");
    const tbodyIbadah    = document.getElementById("dashboardBodyIbadah");
    const tbodyRekap     = document.getElementById("dashboardBodyRekap");

    tbodyKehadiran.innerHTML = "";
    tbodyHafalan.innerHTML = "";
    tbodyIbadah.innerHTML = "";
    tbodyRekap.innerHTML = "";

    data.forEach((row, i) => {

        // =========================
        // KEHADIRAN
        // =========================
        tbodyKehadiran.innerHTML += `
        <tr>
            <td>${i+1}</td>
            <td>${row.nama ?? "-"}</td>
            <td>${row.id_santri ?? "-"}</td>
            <td>${row.kelas || row.tingkat_unit || "-"}</td>

            <td>${row.hadir ?? 0}</td>
            <td>${row.izin ?? 0}</td>
            <td>${row.sakit ?? 0}</td>
            <td>${row.alpha ?? 0}</td>

            <td>${formatNilai(row.persenHadir)}%</td>
          <td>${konversiHurufKeAngka(nilaiKehadiran(row.persenHadir))}</td>
            <td><strong>${row.predikatKehadiran ?? "-"}</strong></td>
        </tr>`;

        // =========================
        // HAFALAN
        // =========================
        tbodyHafalan.innerHTML += `
        <tr>
            <td>${i+1}</td>
            <td>${row.nama ?? "-"}</td>
            <td>${row.id_santri ?? "-"}</td>
            <td>${row.kelas || row.tingkat_unit || "-"}</td>

            <td>${row.hafalanLama ?? 0}</td>
            <td>${row.hafalanBaru ?? 0}</td>
            <td>${row.akumulasi ?? 0}</td>

            <td>${row.frekuensi ?? 0}</td>
            <td>${row.totalAyat ?? 0}</td>
            <td>${row.tasmi ?? 0}</td>

            <td>${formatNilai(row.nilaiHafalan)}</td>
            <td><strong>${row.predikatHafalan ?? row.predikat ?? "-"}</strong></td>
        </tr>`;

        // =========================
        // IBADAH & AKHLAQ
        // =========================
        
        tbodyIbadah.innerHTML += `
        <tr>
            <td>${i+1}</td>
            <td>${row.nama ?? "-"}</td>
            <td>${row.id_santri ?? "-"}</td>
            <td>${row.kelas || row.tingkat_unit || "-"}</td>

 <td>${formatNilai(row.nilaiIbadah)}</td>
<td>${formatNilai(row.nilaiAkhlaq)}</td>
<td>${formatNilai(row.nilaiIbadahAkhlaq)}</td>
<td><strong>${row.predikatIbadah}</strong></td>   </tr>`;

        // =========================
        // REKAP AKHIR
        // =========================
        tbodyRekap.innerHTML += `
        <tr>
            <td>${i+1}</td>
            <td>${row.nama ?? "-"}</td>
            <td>${row.id_santri ?? "-"}</td>
            <td>${row.kelas || row.tingkat_unit || "-"}</td>

  <td>${row.nilaiKehadiran}</td>
            <td>${formatNilai(row.nilaiHafalan)}</td>
            <td>${formatNilai(row.nilaiIbadahAkhlaq ?? row.nilaiIbadah)}</td>
            <td><strong>${formatNilai(row.nilaiAkhir)}</strong></td>
            <td><strong>${row.predikat ?? "-"}</strong></td>
        </tr>`;
    });

}

function setCard(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = value;
}

// ============================================================
// GRAFIK RINGKASAN (BAR CHART)
// ============================================================

let chartRingkasan = null;

function renderGrafik(labels, values, title) {

    const canvas = document.getElementById("grafikRingkasan");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Update jika grafik sudah ada
    if (chartRingkasan) {

        chartRingkasan.data.labels = labels;

        chartRingkasan.data.datasets[0].data = values;

        chartRingkasan.options.plugins.title.text = title;

        chartRingkasan.update();

        return;

    }

    // Buat grafik pertama kali
    chartRingkasan = new Chart(ctx, {

        type: "bar",

        data: {

            labels: labels,

            datasets: [

                {

                    label: "Statistik",

                    data: values,

                    backgroundColor: [
                        "#4CAF50",
                        "#2196F3",
                        "#FF9800",
                        "#9C27B0"
                    ],

                    borderColor: [
                        "#388E3C",
                        "#1976D2",
                        "#F57C00",
                        "#7B1FA2"
                    ],

                    borderWidth: 1,

                    borderRadius: 8,

                    barPercentage: 0.6,

                    categoryPercentage: 0.6

                }

            ]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            layout: {

                padding: {

                    top: 10,

                    right: 15,

                    bottom: 10,

                    left: 15

                }

            },

            plugins: {

                legend: {

                    display: false

                },

                title: {

                    display: true,

                    text: title

                }

            },

            scales: {

                y: {

                    beginAtZero: true

                },

                x: {

                    grid: {

                        display: false

                    }

                }

            }

        }

    });

}

function updateGrafikDashboard() {

    const mode = document.getElementById("grafikMode").value;

    const s = state.dashboard.summary;

    if (!s) return;

    switch (mode) {

        case "ringkasan":

            renderGrafik(
                ["Hafalan", "Kehadiran", "Ibadah", "Nilai Akhir"],
                [
                    s.avgHafalan,
                    s.avgHadir,
                    s.avgIbadah,
                    s.avgNilai
                ],
                "Statistik Ringkasan"
            );

            break;

        case "hafalan":

            renderGrafik(
                ["Santri", "Setoran", "Ayat", "Tasmi'"],
                [
                    s.jumlahSantri,
                    s.totalSetoran,
                    s.totalAyat,
                    s.totalTasmi
                ],
                "Statistik Hafalan"
            );

            break;

        case "kehadiran":

            renderGrafik(
                ["Rata-rata Hadir"],
                [
                    s.avgHadir
                ],
                "Statistik Kehadiran"
            );

            break;

        case "ibadah":

            renderGrafik(
                ["Rata-rata Ibadah"],
                [
                    s.avgIbadah
                ],
                "Statistik Ibadah"
            );

            break;

    }

}

document
.getElementById("grafikMode")
.addEventListener("change", updateGrafikDashboard);

/* ==========================================================
   PART 9
   EXPORT WORD (.DOCX)
========================================================== */
// ======================================
// THEME
// ======================================

// ======================================
// THEME
// ======================================

const THEME = {
    primary: "166534",
    secondary: "16A34A",
    light: "F3F4F6",
    border: "D1D5DB",
    white: "FFFFFF",
    text: "111827"
};

const CARD = {

    santri: "2563EB",
    setoran: "16A34A",
    ayat: "9333EA",
    tasmi: "EA580C",

    hadir: "0891B2",
    hafalan: "059669",
    ibadah: "D97706",
    nilai: "DC2626",

    terbaik: "CA8A04",
    juaraHafalan: "7C3AED",
    juaraHadir: "4338CA",
    juaraIbadah: "0F766E"

};

// ======================================
// HEADER DASHBOARD
// ======================================

function buatHeaderDashboard(logoBytes, periode) {

    return [

        new docx.Paragraph({
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
                new docx.ImageRun({
                    data: logoBytes,
                    transformation: {
                        width: 90,
                        height: 90
                    }
                })
            ]
        }),

        new docx.Paragraph({
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 80 },
            children: [
                new docx.TextRun({
                    text: "DASHBOARD ADMIN SANTRI",
                    bold: true,
                    size: 34
                })
            ]
        }),

        new docx.Paragraph({
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 120 },
            children: [
                new docx.TextRun({
                    text: "Daarul Khoirot Al-Madani",
                    italics: true,
                    size: 24
                })
            ]
        }),

        new docx.Paragraph({
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 40 },
            children: [
                new docx.TextRun({
                    text: "Periode : " + periode,
                    bold: true,
                    size: 22
                })
            ]
        }),

        new docx.Paragraph({
            alignment: docx.AlignmentType.CENTER,
            spacing: { after: 250 },
            children: [
                new docx.TextRun({
                    text: "Tanggal Cetak : " +
                        new Date().toLocaleDateString("id-ID"),
                    size: 20
                })
            ]
        })

    ];

}

// ======================================
// JUDUL HALAMAN
// ======================================

function buatJudulHalaman(judul, subjudul = "") {

    return [

        new docx.Paragraph({

            alignment: docx.AlignmentType.CENTER,

            spacing: {
                before: 120,
                after: 80
            },

            children: [

                new docx.TextRun({

                    text: judul,

                    bold: true,

                    size: 32

                })

            ]

        }),

        ...(subjudul ? [

            new docx.Paragraph({

                alignment: docx.AlignmentType.CENTER,

                spacing: {
                    after: 220
                },

                children: [

                    new docx.TextRun({

                        text: subjudul,

                        italics: true,

                        size: 22

                    })

                ]

            })

        ] : [])

    ];

}

// ======================================
// SECTION
// ======================================

function buatSection(title) {

    return new docx.Paragraph({

        spacing: {

            before: 220,

            after: 120

        },

        border: {

            bottom: {

                style: docx.BorderStyle.SINGLE,

                size: 8,

                color: THEME.primary

            }

        },

        children: [

            new docx.TextRun({

                text: title,

                bold: true,

                size: 26,

                color: THEME.primary

            })

        ]

    });

}

// ======================================
// CELL HEADER
// ======================================

function cell(text, width) {

    return new docx.TableCell({

        width: {
            size: width,
            type: docx.WidthType.DXA
        },

        children: [

            new docx.Paragraph({

                spacing: {
                    before: 0,
                    after: 0
                },

                children: [
                    new docx.TextRun(
                        String(text ?? "-")
                    )
                ]

            })

        ]

    });

}


function cellHeader(text, width) {

    return new docx.TableCell({

        width: {
            size: width,
            type: docx.WidthType.DXA
        },

        shading: {
            fill: "166534"
        },

        children: [

            new docx.Paragraph({

                alignment: docx.AlignmentType.CENTER,

                spacing: {
                    before: 0,
                    after: 0
                },

                children: [
                    new docx.TextRun({
                        text: text,
                        bold: true,
                        color: "FFFFFF"
                    })
                ]

            })

        ]

    });

}

// ======================================
// TABLE
// ======================================

function buatTabel(headers, rows, options = {}) {

    return new docx.Table({

        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE
        },

        rows: [

            new docx.TableRow({

                tableHeader: true,

                children: headers.map(cellHeader)

            }),

            ...rows.map(row =>

                new docx.TableRow({

                    children: row.map(cell)

                })

            )

        ]

    });

}

function dashboardCard(judul, nilai, warna = "166534") {

    return new docx.TableCell({

        width: {
            size: 25,
            type: docx.WidthType.PERCENTAGE
        },

        shading: {
            type: docx.ShadingType.CLEAR,
            fill: warna
        },

        margins: {
            top: 140,
            bottom: 140,
            left: 120,
            right: 120
        },

        borders: {

            top: {
                style: docx.BorderStyle.SINGLE,
                color: warna,
                size: 6
            },

            bottom: {
                style: docx.BorderStyle.SINGLE,
                color: warna,
                size: 6
            },

            left: {
                style: docx.BorderStyle.SINGLE,
                color: warna,
                size: 6
            },

            right: {
                style: docx.BorderStyle.SINGLE,
                color: warna,
                size: 6
            }

        },

        children: [

            new docx.Paragraph({

                alignment: docx.AlignmentType.CENTER,

                children: [

                    new docx.TextRun({

                        text: judul,
                        bold: true,
                        color: "FFFFFF",
                        size: 20

                    })

                ]

            }),

            new docx.Paragraph({

                alignment: docx.AlignmentType.CENTER,

                spacing: {
                    before: 120
                },

                children: [

                    new docx.TextRun({

                        text: String(nilai),
                        bold: true,
                        color: "FFFFFF",
                        size: 30

                    })

                ]

            })

        ]

    });

}

function getPredikat(nilai) {

    nilai = Number(nilai) || 0;

    if (nilai >= 90) return "Mumtaz";
    if (nilai >= 80) return "Jayyid Jiddan";
    if (nilai >= 70) return "Jayyid";
    if (nilai >= 60) return "Maqbul";

    return "Perlu Pembinaan";
}

function getPredikatKehadiran(alpha) {

    alpha = Number(alpha) || 0;

    if (alpha === 0) return "Mumtaz";
    if (alpha === 1) return "Jayyid Jiddan";
    if (alpha <= 3) return "Jayyid";
    if (alpha <= 5) return "Maqbul";

    return "Perlu Pembinaan";
}



function formatPredikat(predikat) {
    return predikat || "-";
}

window.exportToWord = async function () {
const logoBytes = await fetch("main_logo.png")
    .then(r => r.arrayBuffer());

    try {

        const rekap = state.dashboard?.rekap || [];
        const st = state.dashboard?.statistik || {};
        const sm = state.dashboard?.summary || {};
        const p = state.dashboard?.periode;


        if (!rekap.length) {

            info("Belum ada data.");
            return;

        }

        const namaBulan = [
            "Januari","Februari","Maret","April","Mei","Juni",
            "Juli","Agustus","September","Oktober","November","Desember"
        ];

        const periode = p
            ? `${namaBulan[Number(p.bulan)-1]} ${p.tahun}`
            : "-";

        const {
    Document,
    Packer,
    Paragraph,
    Table,
    TableRow,
    TableCell,
    WidthType,
    HeadingLevel,
    TextRun,
    ImageRun,
    AlignmentType,
    Footer,
    PageNumber
} = docx;

console.log(JSON.stringify(rekap[0], null, 2));
       const children = [];
      
      // ======================================
// STATISTIK DASHBOARD
// ======================================

const totalSantri = rekap.length;

const totalHadir = rekap.reduce((t, s) => t + (Number(s.hadir) || 0), 0);
const totalIzin = rekap.reduce((t, s) => t + (Number(s.izin) || 0), 0);
const totalSakit = rekap.reduce((t, s) => t + (Number(s.sakit) || 0), 0);
const totalAlpha = rekap.reduce((t, s) => t + (Number(s.alpha) || 0), 0);

const totalSetoran = rekap.reduce((t, s) => t + (Number(s.frekuensi) || 0), 0);
const totalAyat = rekap.reduce((t, s) => t + (Number(s.totalAyat) || 0), 0);
const totalTasmi = rekap.reduce((t, s) => t + (Number(s.tasmi) || 0), 0);

const rataKehadiran = totalSantri
    ? rekap.reduce((t, s) => t + (Number(s.nilaiKehadiran) || 0), 0) / totalSantri
    : 0;

const rataHafalan = totalSantri
    ? rekap.reduce((t, s) => t + (Number(s.nilaiHafalan) || 0), 0) / totalSantri
    : 0;

const rataIbadah = totalSantri
    ? rekap.reduce((t, s) => t + (Number(s.nilaiIbadahAkhlaq) || 0), 0) / totalSantri
    : 0;

const rataNilai = totalSantri
    ? rekap.reduce((t, s) => t + (Number(s.nilaiAkhir) || 0), 0) / totalSantri
    : 0;

const santriTerbaik = totalSantri
    ? [...rekap].sort((a, b) => b.nilaiAkhir - a.nilaiAkhir)[0]
    : null;

// ======================================
// SANTRI TERBAIK
// ======================================

const terbaikHafalan =
    [...rekap]
        .sort((a, b) => b.nilaiHafalan - a.nilaiHafalan)[0]?.nama || "-";

const terbaikKehadiran =
    [...rekap]
        .sort((a, b) => b.nilaiKehadiran - a.nilaiKehadiran)[0]?.nama || "-";

const terbaikIbadah =
    [...rekap]
        .sort((a, b) => b.nilaiIbadahAkhlaq - a.nilaiIbadahAkhlaq)[0]?.nama || "-";

const terbaikNilai =
    [...rekap]
        .sort((a, b) => b.nilaiAkhir - a.nilaiAkhir)[0]?.nama || "-";
       
       console.log("Statistik:", st);
console.log("Summary:", sm);
// ======================================
// HEADER DASHBOARD
// ======================================

children.push(
    ...buatHeaderDashboard(
        logoBytes,
        periode
    )
);

children.push(

    new Table({

        width: {
            size: 100,
            type: docx.WidthType.PERCENTAGE
        },

        rows: [

            // BARIS 1

          new TableRow({

    children: [

        dashboardCard("Jumlah Santri", st.jumlahSantri, CARD.santri),

        dashboardCard("Total Setoran", st.totalSetoran, CARD.setoran),

        dashboardCard("Total Ayat", st.totalAyat, CARD.ayat),

        dashboardCard("Total Tasmi'", st.totalTasmi, CARD.tasmi)

    ]

}),

new TableRow({
        height: {
            value: 200,
            rule: docx.HeightRule.EXACT
        },
        children: [
            new TableCell({
                children: [
                    new Paragraph("")
                ],
                columnSpan: 4,
                borders: {
                    top: { style: docx.BorderStyle.NONE },
                    bottom: { style: docx.BorderStyle.NONE },
                    left: { style: docx.BorderStyle.NONE },
                    right: { style: docx.BorderStyle.NONE }
                }
            })
        ]
    }),

            // BARIS 2

            new TableRow({

    children: [

        dashboardCard(
            "Rata Hadir",
            formatNilai(st.rataKehadiran),
            CARD.hadir
        ),

        dashboardCard(
            "Rata Hafalan",
            formatNilai(st.rataHafalan),
            CARD.hafalan
        ),

        dashboardCard(
            "Rata Ibadah",
            formatNilai(st.rataIbadah),
            CARD.ibadah
        ),

        dashboardCard(
            "Nilai Akhir",
            formatNilai(st.rataNilaiAkhir),
            CARD.nilai
        )

    ]

}),

new TableRow({
        height: {
            value: 200,
            rule: docx.HeightRule.EXACT
        },
        children: [
            new TableCell({
                children: [
                    new Paragraph("")
                ],
                columnSpan: 4,
                borders: {
                    top: { style: docx.BorderStyle.NONE },
                    bottom: { style: docx.BorderStyle.NONE },
                    left: { style: docx.BorderStyle.NONE },
                    right: { style: docx.BorderStyle.NONE }
                }
            })
        ]
    }),

            // BARIS 3

          new TableRow({

    children: [

        dashboardCard(
            "Terbaik",
            sm.terbaik?.nama || "-",
            CARD.terbaik
        ),

        dashboardCard(
            "Hafalan",
            sm.hafalan?.nama || "-",
            CARD.juaraHafalan
        ),

        dashboardCard(
            "Kehadiran",
            sm.hadir?.nama || "-",
            CARD.juaraHadir
        ),

        dashboardCard(
            "Ibadah",
            sm.ibadah?.nama || "-",
            CARD.juaraIbadah
        )

    ]

})
        ]

    })

);

// ======================================
// HALAMAN 2 - KEHADIRAN
// ======================================

const tabelKehadiran = buatTabel(

[
    "No",
    "Nama Santri",
    "ID",
    "Kelas",
    "Hadir",
    "Izin",
    "Sakit",
    "Alpha",
    "Kehadiran (%)",
    "Nilai",
    "Predikat"
],

rekap.map((s,i)=>[

    i + 1,
    s.nama,
    s.id_santri,
    s.kelas,
    s.hadir,
    s.izin,
    s.sakit,
    s.alpha,
    s.persenHadir,
    s.nilaiKehadiran,
    s.predikatKehadiran

]),

{
    columnWidths: [
        500,
        2200,
        900,
        1000,
        700,
        700,
        700,
        700,
        1200,
        800,
        1000
    ]
}

);

children.push(

    new Paragraph({
        pageBreakBefore: true
    }),

    ...buatJudulHalaman(
        "KEHADIRAN SANTRI",
        "Daarul Khoirot Al-Madani"
    ),

    buatSection("DATA KEHADIRAN"),

    tabelKehadiran

);

// ======================================
// HALAMAN 3 - HAFALAN
// ======================================


const tabelHafalan = buatTabel(

[
    "No",
    "Nama Santri",
    "ID",
    "Kelas",
    "Lama",
    "Baru",
    "Akumulasi",
    "Frekuensi",
    "Ayat",
    "Tasmi'",
    "Nilai",
    "Predikat"
],

rekap.map((s,i)=>[

    i + 1,
    s.nama,
    s.id_santri,
    s.kelas,
    s.hafalanLama,
    s.hafalanBaru,
    s.akumulasi,
    s.frekuensi,
    s.totalAyat,
    s.tasmi,
    s.nilaiHafalan,
    s.predikatHafalan

]),

{
    columnWidths: [
        450,   // No
        2200,  // Nama Santri
        800,   // ID
        900,   // Kelas
        750,   // Lama
        750,   // Baru
        1000,  // Akumulasi
        900,   // Frekuensi
        800,   // Ayat
        800,   // Tasmi'
        800,   // Nilai
        1000   // Predikat
    ]
}

);

children.push(

    new Paragraph({
        pageBreakBefore: true
    }),

    ...buatJudulHalaman(
        "HAFALAN SANTRI",
        "Daarul Khoirot Al-Madani"
    ),

    buatSection("DATA HAFALAN"),

    tabelHafalan

);

// ======================================
// HALAMAN 4 - IBADAH
// ======================================
const tabelIbadah = buatTabel(

[
    "No",
    "Nama Santri",
    "ID",
    "Kelas",
    "Ibadah",
    "Akhlaq",
    "Rata-rata",
    "Predikat"
],

rekap.map((s,i)=>[

    i + 1,
    s.nama,
    s.id_santri,
    s.kelas,
    s.nilaiIbadah,
    s.nilaiAkhlaq,
    s.nilaiIbadahAkhlaq,
    s.predikatIbadah

]),

{
    columnWidths: [
        500,   // No
        2800,  // Nama Santri
        900,   // ID
        1000,  // Kelas
        1200,  // Ibadah
        1200,  // Akhlaq
        1200,  // Rata-rata
        1200   // Predikat
    ]
}

);

children.push(

    new Paragraph({
        pageBreakBefore: true
    }),

    ...buatJudulHalaman(
        "IBADAH & AKHLAQ",
        "Daarul Khoirot Al-Madani"
    ),

    buatSection("DATA IBADAH"),

    tabelIbadah

);

// ======================================
// HALAMAN 5 - REKAP NILAI
// ======================================
const tabelRekap = buatTabel(

[
    "No",
    "Nama Santri",
    "ID",
    "Kelas",
    "Kehadiran",
    "Hafalan",
    "Ibadah",
    "Nilai Akhir",
    "Predikat"
],

rekap.map((s,i)=>[

    i + 1,
    s.nama,
    s.id_santri,
    s.kelas,
    s.nilaiKehadiran,
    s.nilaiHafalan,
    s.nilaiIbadahAkhlaq,
    s.nilaiAkhir,
    s.predikat

]),

{
    columnWidths: [
        500,   // No
        2800,  // Nama Santri
        900,   // ID
        1000,  // Kelas
        1200,  // Kehadiran
        1200,  // Hafalan
        1200,  // Ibadah
        1200,  // Nilai Akhir
        1200   // Predikat
    ]
}

);

children.push(

    new Paragraph({
        pageBreakBefore: true
    }),

    ...buatJudulHalaman(
        "REKAP NILAI SANTRI",
        "Daarul Khoirot Al-Madani"
    ),

    buatSection("REKAP NILAI"),

    tabelRekap

);

// ======================================
// HALAMAN 6 - RANKING
// ======================================
const ranking = [...rekap].sort(
(a,b)=>b.nilaiAkhir-a.nilaiAkhir
);

const tabelRanking = buatTabel(

[
    "Rank",
    "Nama",
    "ID",
    "Kelas",
    "Kehadiran",
    "Hafalan",
    "Ibadah",
    "Nilai Akhir",
    "Predikat"
],

ranking.map((s,i)=>[

    i + 1,
    s.nama,
    s.id_santri,
    s.kelas,
    s.nilaiKehadiran,
    s.nilaiHafalan,
    s.nilaiIbadahAkhlaq,
    s.nilaiAkhir,
    s.predikat

]),

{
    columnWidths: [
        700,   // Rank
        2800,  // Nama
        900,   // ID
        1000,  // Kelas
        1200,  // Kehadiran
        1200,  // Hafalan
        1200,  // Ibadah
        1200,  // Nilai Akhir
        1200   // Predikat
    ]
}

);

children.push(

    new Paragraph({
        pageBreakBefore: true
    }),

    ...buatJudulHalaman(
        "RANKING SANTRI",
        "Daarul Khoirot Al-Madani"
    ),

    buatSection("PERINGKAT SANTRI"),

    tabelRanking

);

const doc = new Document({

    sections: [

        {

            footers: {
    default: new Footer({

        children: [

            new Paragraph({

                alignment: AlignmentType.CENTER,

                border: {
                    top: {
                        style: docx.BorderStyle.SINGLE,
                        size: 4,
                        color: "166534"
                    }
                },

                spacing: {
                    before: 120
                },

                children: [

                    new TextRun({
                        text: "Daarul Khoirot Al-Madani",
                        bold: true,
                        color: "166534"
                    }),

                    new TextRun({
                        text: "   |   Halaman "
                    }),

                    PageNumber.CURRENT

                ]

            })

        ]

    })
}, 
            children

        }

    ]

});


const blob = await Packer.toBlob(doc);

saveAs(blob, "Dashboard_Santri.docx");

sukses("Export Word berhasil.");

} catch (err) {

    console.error(err);
    console.log(err.name);
    console.log(err.message);
    console.log(err.stack);

}

};


/* ==========================================================
   PART 10
   EXPORT PDF (jsPDF + AUTOTABLE)
   PRINT + PDF INDIVIDUAL
========================================================== */
/* ==============================
   EXPORT DASHBOARD PDF
============================== */

function pdfCard(pdf, x, y, w, h, title, value) {

    // Shadow
    pdf.setFillColor(220,220,220);
    pdf.roundedRect(x+1, y+1, w, h, 3,3,"F");

    // Card
    pdf.setFillColor(255,255,255);
    pdf.setDrawColor(22,101,52);
    pdf.setLineWidth(0.4);
    pdf.roundedRect(x,y,w,h,3,3,"FD");

// ================= WARNA HEADER =================

let warna = [22, 101, 52]; // Default hijau

switch (title) {

    case "Jumlah Santri":
        warna = [37, 99, 235];     // Biru
        break;

    case "Total Setoran":
        warna = [245, 158, 11];    // Oranye
        break;

    case "Total Ayat":
        warna = [16, 185, 129];    // Emerald
        break;

    case "Total Tasmi":
        warna = [139, 92, 246];    // Ungu
        break;

    case "Rata Hadir":
        warna = [14, 165, 233];    // Sky Blue
        break;

    case "Rata Hafalan":
        warna = [5, 150, 105];     // Hijau Tua
        break;

    case "Rata Ibadah":
        warna = [234, 88, 12];     // Jingga
        break;

    case "Nilai Akhir":
        warna = [220, 38, 38];     // Merah
        break;

    case "Terbaik":
        warna = [202, 138, 4];     // Emas
        break;

    case "Hafalan":
        warna = [34, 197, 94];     // Hijau
        break;

    case "Kehadiran":
        warna = [59, 130, 246];    // Biru
        break;

    case "Ibadah":
        warna = [168, 85, 247];    // Ungu
        break;

}

// Header
pdf.setFillColor(...warna);
pdf.roundedRect(x, y, w, 8, 3, 3, "F");

pdf.setTextColor(255);
pdf.setFont("helvetica", "bold");
pdf.setFontSize(8);
pdf.text(title, x + 3, y + 5.3);

    // Isi
    pdf.setTextColor(30);

    const namaCard = ["Terbaik","Hafalan","Kehadiran","Ibadah"];

    if (namaCard.includes(title)) {

        pdf.setFontSize(10);
        pdf.setFont("helvetica","bold");

        let isi = pdf.splitTextToSize(String(value), w-8);

        if (isi.length > 2) {
            isi = isi.slice(0,2);
            isi[1] += "...";
        }

        pdf.text(isi, x+4, y+15);

    } else {

        pdf.setFontSize(16);
        pdf.setFont("helvetica","bold");

        pdf.text(
            String(value),
            x + w/2,
            y + 18,
            { align: "center" }
        );

    }

}

function tambahHalamanTabel(pdf, judul, periode, kolom, baris) {

    pdf.addPage();

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(15);
    pdf.text(judul, 14, 18);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text("Periode : " + periode, 14, 25);

    pdf.autoTable({

    startY: 32,

    head: [kolom],

    body: baris,

    theme: "grid",

    tableWidth: "auto",

    styles: {
        fontSize: 8,
        cellPadding: 2,
        lineColor: [180,180,180],
        lineWidth: 0.1,
        valign: "middle",
        halign: "center"      // Default semua isi rata tengah
    },

    headStyles: {
        fillColor: [22,101,52],
        textColor: 255,
        halign: "center",
        valign: "middle",
        fontStyle: "bold",
        fontSize: 8
    },

    alternateRowStyles: {
        fillColor: [247,250,247]
    },

    didParseCell(data) {

        // Header selalu rata tengah
        if (data.section === "head") {
            data.cell.styles.halign = "center";
        }

        // Kolom Nama Santri (kolom ke-2) rata kiri
        if (data.section === "body" && data.column.index === 1) {
            data.cell.styles.halign = "left";
        }

    }

});
} 

window.exportToPDF = function () {
    try {
        const data = state.dashboard?.rekap || [];
const rekap = data;

const st = state.dashboard?.statistik || {};
const sm = state.dashboard?.summary || {};
if (!data.length) {
    info("Belum ada data.");
    return;
}

const w = 55;
const h = 25;

const { jsPDF } = window.jspdf;
        
const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
});
        
// ================= HALAMAN DASHBOARD =================

const pageWidth = pdf.internal.pageSize.width;

pdf.setFont("helvetica", "bold");
pdf.setFontSize(16);

pdf.text(
    "DASHBOARD ADMIN SANTRI",
    pageWidth / 2,
    15,
    { align: "center" }
);
        
pdf.setFontSize(11);
pdf.setFont("helvetica", "normal");
pdf.text(
    "Daarul Khoirot Al-Madani",
    pageWidth / 2,
    23,
    { align: "center" }
);

pdf.setFont("helvetica", "normal");
pdf.setFontSize(11);
const p = state.dashboard?.periode;

const namaBulan = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember"
];

const periode = p
    ? `${namaBulan[Number(p.bulan) - 1]} ${p.tahun}`
    : "-";
pdf.text("Lembaga Pendidikan Islam Daarul Khoirot Al-Madani", 14, 32);
pdf.text("Periode : " + periode, 14, 38);
pdf.text("Tanggal : " + new Date().toLocaleDateString("id-ID"), 14, 44);

const yCard = 55;

pdfCard(pdf, 15,  yCard,      w, h, "Jumlah Santri", st.jumlahSantri);
pdfCard(pdf, 75,  yCard,      w, h, "Total Setoran", st.totalSetoran);
pdfCard(pdf, 135, yCard,      w, h, "Total Ayat", st.totalAyat);
pdfCard(pdf, 195, yCard,      w, h, "Total Tasmi", st.totalTasmi);

pdfCard(pdf, 15,  yCard + 35, w, h, "Rata Hadir", formatNilai(st.rataKehadiran) + "%");
pdfCard(pdf, 75,  yCard + 35, w, h, "Rata Hafalan", formatNilai(st.rataHafalan));
pdfCard(pdf, 135, yCard + 35, w, h, "Rata Ibadah", formatNilai(st.rataIbadah));
pdfCard(pdf, 195, yCard + 35, w, h, "Nilai Akhir", formatNilai(st.rataNilaiAkhir));

pdfCard(pdf, 15,  yCard + 70, w, h, "Terbaik", sm.terbaik?.nama || "-");
pdfCard(pdf, 75,  yCard + 70, w, h, "Hafalan", sm.hafalan?.nama || "-");
pdfCard(pdf, 135, yCard + 70, w, h, "Kehadiran", sm.hadir?.nama || "-");
pdfCard(pdf, 195, yCard + 70, w, h, "Ibadah", sm.ibadah?.nama || "-");

const kolomKehadiran = [
    "No","Nama Santri","ID Santri","Unit",
    "Hadir","Izin","Sakit","Alpha",
    "Kehadiran (%)","Nilai","Predikat"
];

const barisKehadiran = [];

rekap.forEach((r,i)=>{

    barisKehadiran.push([

        i+1,
        r.nama ?? "-",
        r.id_santri ?? "-",
        r.kelas || r.tingkat_unit || "-",
        r.hadir ?? 0,
        r.izin ?? 0,
        r.sakit ?? 0,
        r.alpha ?? 0,
        formatNilai(r.persenHadir)+"%",
        formatNilai(r.nilaiKehadiran),
        r.predikatKehadiran ?? "-"

    ]);

});

tambahHalamanTabel(
    pdf,
    "DATA KEHADIRAN SANTRI",
    periode,
    kolomKehadiran,
    barisKehadiran
);

const kolomHafalan = [
    "No","Nama Santri","ID Santri","Unit",
    "Hafalan Lama","Hafalan Baru","Akumulasi",
    "Frekuensi","Total Ayat","Tasmi'","Nilai","Predikat"
];

const barisHafalan = [];

rekap.forEach((r,i)=>{

    barisHafalan.push([

        i+1,
        r.nama ?? "-",
        r.id_santri ?? "-",
        r.kelas || r.tingkat_unit || "-",
        r.hafalanLama ?? 0,
        r.hafalanBaru ?? 0,
        r.akumulasi ?? 0,
        r.frekuensi ?? 0,
        r.totalAyat ?? 0,
        r.tasmi ?? 0,
        formatNilai(r.nilaiHafalan),
        r.predikatHafalan ?? "-"

    ]);

});

tambahHalamanTabel(
    pdf,
    "DATA HAFALAN SANTRI",
    periode,
    kolomHafalan,
    barisHafalan
);

const kolomIbadah = [
    "No","Nama Santri","ID Santri","Unit",
    "Nilai Ibadah","Nilai Akhlaq","Rata-rata","Predikat"
];

const barisIbadah = [];

rekap.forEach((r,i)=>{

    barisIbadah.push([

        i+1,
        r.nama ?? "-",
        r.id_santri ?? "-",
        r.kelas || r.tingkat_unit || "-",
        formatNilai(r.nilaiIbadah),
        formatNilai(r.nilaiAkhlaq),
        formatNilai((Number(r.nilaiIbadah)+Number(r.nilaiAkhlaq))/2),
        r.predikatIbadah ?? "-"

    ]);

});

tambahHalamanTabel(
    pdf,
    "DATA IBADAH & AKHLAQ",
    periode,
    kolomIbadah,
    barisIbadah
);

const kolomRekap = [
    "No","Nama Santri","ID Santri","Unit",
    "Kehadiran","Hafalan",
    "Ibadah & Akhlaq",
    "Nilai Akhir","Predikat"
];

const barisRekap = [];

rekap.forEach((r,i)=>{

    barisRekap.push([

        i+1,
        r.nama ?? "-",
        r.id_santri ?? "-",
        r.kelas || r.tingkat_unit || "-",
        formatNilai(r.nilaiKehadiran), 
        formatNilai(r.nilaiHafalan),
        formatNilai(r.nilaiIbadah),
        formatNilai(r.nilaiAkhir),
        r.predikat ?? "-"

    ]);

});

tambahHalamanTabel(
    pdf,
    "REKAPITULASI NILAI AKHIR",
    periode,
    kolomRekap,
    barisRekap
);

const kolomRanking = [
    "No","Nama Santri","ID Santri","Unit",
    "Kehadiran","Hafalan",
    "Ibadah","Nilai Akhir","Predikat"
];

const ranking = [...rekap].sort(
    (a,b)=>(b.nilaiAkhir||0)-(a.nilaiAkhir||0)
);

const barisRanking = [];

ranking.forEach((r,i)=>{

    barisRanking.push([

        i+1,
        r.nama ?? "-",
        r.id_santri ?? "-",
        r.kelas || r.tingkat_unit || "-",
        formatNilai(r.nilaiKehadiran), 
        formatNilai(r.nilaiHafalan),
        formatNilai(r.nilaiIbadah),
        formatNilai(r.nilaiAkhir),
        r.predikat ?? "-"

    ]);

});

tambahHalamanTabel(
    pdf,
    "RANKING SANTRI",
    periode,
    kolomRanking,
    barisRanking
);

        
const pageCount = pdf.internal.getNumberOfPages();

for (let i = 1; i <= pageCount; i++) {

    pdf.setPage(i);

    pdf.setFontSize(8);

    pdf.text(
        "Daarul Khoirot Al-Madani",
        14,
        pdf.internal.pageSize.height - 8
    );

    pdf.text(
        "Halaman " + i + " / " + pageCount,
        pdf.internal.pageSize.width - 35,
        pdf.internal.pageSize.height - 8
    );

}

const tanggal = new Date()
    .toLocaleDateString("id-ID")
    .replaceAll("/", "-");

pdf.save("Dashboard_Santri_" + tanggal + ".pdf");
        sukses("Export PDF Dashboard berhasil.");


    } catch (err) {
        console.error(err);
        gagal("Export PDF gagal.");
    }
};

/* ==============================
   PRINT LAPORAN DASHBOARD
============================== */

window.printLaporan = function () {

    try {

        const area = document.getElementById("boxLaporanRekap");

        if (!area) {
            gagal("Area raport tidak ditemukan.");
            return;
        }


        const isiRaport = area.innerHTML;


        const win = window.open("", "_blank");


        win.document.write(`

        <html>
        <head>

        <title>Raport Santri</title>

        <style>

        body {
            font-family: Arial, sans-serif;
            padding:20px;
        }


        table {
            width:100%;
            border-collapse:collapse;
        }


        th, td {
            border:1px solid #333;
            padding:8px;
        }


        .button-group,
        .no-print {
            display:none !important;
        }


        .catatan-card,
        .motivasi-card {
            margin-top:15px;
        }


        </style>


        </head>


        <body>

            ${isiRaport}

        </body>


        </html>

        `);


        win.document.close();

        win.focus();

        win.print();


        sukses("Raport siap dicetak.");


    } catch(err){

        console.error(err);

        gagal("Cetak raport gagal.");

    }

};

/* ==========================================================
   PART 11 (FINAL)
   UI EXPORT + LOADING + ERROR HANDLER + CLEANUP
========================================================== */

function safeRun(fn, errorMessage="Terjadi kesalahan") {

    try {

        fn();

    } catch(err){

        console.error(err);
        gagal(errorMessage);

    }

}


window.exportDashboardWord = function(){

    safeRun(()=>{

        setLoading(true);

        exportToWord();

        setLoading(false);

    },"Export Word gagal");

};


window.exportDashboardPDF = function(){

    safeRun(()=>{

        setLoading(true);

        exportToPDF();

        setLoading(false);

    },"Export PDF gagal");

};


window.exportPrint = function(){

    safeRun(()=>{

        printLaporan();

    },"Print gagal");

};


/* ==============================
   OPTIONAL: CLEAN DASHBOARD CHECK
============================== */

window.validateDashboardData = function () {

    if (!Array.isArray(state.dashboardData)) {
        state.dashboardData = [];
    }

};


/* ==============================
   INIT SAFETY (AUTO RUN)
============================== */

window.addEventListener("load", () => {

    validateDashboardData();

    
});

document.getElementById("btnResetData").addEventListener("click", async () => {

    if (!state.santriAktif) {
    	
        Swal.fire({
            icon: "warning",
            title: "Pilih Santri",
            text: "Silakan pilih santri terlebih dahulu."
        });
        return;
    }

    const result = await Swal.fire({
        title: "Reset Data Santri?",
        html: `
            Semua data <b>${state.santriAktif.nama}</b> akan dihapus.<br>
            <small>• Hafalan<br>• Kehadiran<br>• Ibadah & Akhlaq</small>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal"
    });

    if (!result.isConfirmed) return;

    try {

        const idSantri = state.santriAktif.id;


        // ==========================
        // HAPUS HAFALAN
        // ==========================
        const hafalanSnap = await getDocs(
            query(
                collection(db, COL.HAFALAN),
                where("id_santri", "==", idSantri)
            )
        );

        // ==========================
        // HAPUS KEHADIRAN
        // ==========================
        const kehadiranSnap = await getDocs(
            query(
                collection(db, COL.KEHADIRAN),
                where("id_santri", "==", idSantri)
            )
        );

        // ==========================
        // HAPUS IBADAH
        // ==========================
        const ibadahSnap = await getDocs(
            query(
                collection(db, COL.IBADAH),
                where("id_santri", "==", idSantri)
            )
        );

        const hapus = [];

        hafalanSnap.forEach(d => {
    
    hapus.push(deleteDoc(d.ref));
});

kehadiranSnap.forEach(d => {


    hapus.push(deleteDoc(d.ref));
});

ibadahSnap.forEach(d => {
    
    hapus.push(deleteDoc(d.ref));
});

        await Promise.all(hapus);

        
// ==========================
// RESET DASHBOARD ADMIN
// ==========================
window._rekapCache = [];

state.dashboard.rekap = [];
state.dashboard.summary = {};

updateDashboardSummary();
renderDashboardTable([]);
renderRanking([]);

// Kosongkan tabel secara langsung
const body = document.getElementById("dashboardBody");
if (body) body.innerHTML = "";

const ranking = document.getElementById("rankingBody");
if (ranking) ranking.innerHTML = "";

        Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Semua data santri berhasil dihapus."
        });

    } catch (error) {
        console.error(error);

        Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Terjadi kesalahan saat menghapus data."
        });
    }

});


window.simpanDanKeIbadah = simpanDanKeIbadah;
window.generateLaporan = generateLaporan;
window.resetForm = resetForm;