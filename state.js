// Helper: aman ambil closest
const $closest = (element, selector) => 
    element ? element.closest(selector) : null;

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
    rankingBody: $("rankingBody"),

    /* ========= BUTTON ========= */

    btnGenerate: $("btnProsesRekap"),
    btnReset: $("btnResetData")

};

    const wrapKelancaran = $closest(el.kelancaran, ".dropdown-wrapper-custom");
const wrapTahsin     = $closest(el.tahsin,     ".dropdown-wrapper-custom");
const wrapTajwid     = $closest(el.tajwid,     ".dropdown-wrapper-custom");


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

/*========================
   WRAPPER
========================================================== */

const wrapperMulai   = $closest(el.menuAyatMulai,      ".dropdown-wrapper-custom");
const wrapperSelesai = $closest(el.menuAyatSelesai,    ".dropdown-wrapper-custom");
const wrapperStatus  = $closest(el.boxStatusKehadiran, ".dropdown-wrapper-custom");




