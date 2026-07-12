
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
set("avgTotalHuruf", predikat.latin);
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

const generateLaporanLama = window.generateLaporan;

window.generateLaporan = async function () {

    if (typeof generateLaporanLama === "function") {
        await generateLaporanLama();
    }

    tampilkanRekapKehadiran();
    tampilkanRekapIbadah();
    tampilkanCatatan();

};

