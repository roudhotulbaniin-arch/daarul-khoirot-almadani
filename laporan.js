
/* ==========================================================
   GENERATE
========================================================== */window.generateLaporan = async function () {

    if (!pastikanSantriDipilih()) return;

    try {

        // ======================
        // LOAD DATA (dengan try-catch per fungsi)
        // ======================
        try {
            await loadHistoryHafalan();
            console.log("✅ Hafalan loaded:", state.historyHafalan?.length);
        } catch (e) {
            console.error("❌ loadHistoryHafalan:", e);
        }

        try {
            await loadHistoryKehadiran();
            console.log("✅ Kehadiran loaded:", state.historyKehadiran?.length);
        } catch (e) {
            console.error("❌ loadHistoryKehadiran:", e);
        }

        try {
            await loadHistoryIbadah();
            console.log("✅ Ibadah loaded:", state.historyIbadah?.length);
        } catch (e) {
            console.error("❌ loadHistoryIbadah:", e);
        }

        const data = filterHafalanBulanan() || [];

        // ======================
        // NORMALISASI DATA
        // ======================
        const laporan = data.map(item => ({
            ...item,
            id_santri: item.id_santri ?? "-",
            nama_santri: item.nama ?? "-",
            unit_kelas: item.kelas ?? "-",
            surah_label: item.surah ?? "-",
            ayat_mulai: Number(item.ayatMulai ?? 0),
            ayat_selesai: Number(item.ayatSelesai ?? 0),
            total_ayat_bulanan: Number(item.totalAyat ?? 0),
            is_tasmi: Boolean(item.tasmi),
            nilai: {
                kelancaran: item.kelancaran ?? "-",
                tahsin: item.tahsin ?? "-",
                tajwid: item.tajwid ?? "-"
            },
            kelancaran: item.kelancaran ?? "-",
            tahsin: item.tahsin ?? "-",
            tajwid: item.tajwid ?? "-",
            catatan: item.catatan ?? "-",
            motivasi: item.motivasi ?? "-",
            tanggal_input: item.tanggal ?? ""
        }));

        // ✅ FIX: Gunakan nama fungsi yang benar
        if (typeof refreshDashboardMini === "function") {
            refreshDashboardMini();
        }

        // ======================
        // HITUNG NILAI HAFALAN
        // ======================
        const kelancaran = rataHuruf(data, "kelancaran");
        const tahsin = rataHuruf(data, "tahsin");
        const tajwid = rataHuruf(data, "tajwid");

        const predikat = predikatHafalan(kelancaran, tahsin, tajwid);

        // ======================
        // AMBIL ELEMENT
        // ======================
        const el = (id) => document.getElementById(id);

        const box = el("boxLaporanRekap");
        const mini = el("dashboardRekap");

        if (!box || !mini) {
            console.error("❌ boxLaporanRekap / dashboardRekap tidak ditemukan");
            return;
        }

        mini.style.display = "none";
        box.style.display = "block";

        const set = (id, val) => {
            const e = el(id);
            if (e) e.textContent = val ?? "-";
        };

        // Data terakhir (safe)
        const terakhir = laporan.at(-1) || {};
        const ibadahTerakhir = (state.historyIbadah || []).at(-1) || null;

        // ======================
        // HAFALAN
        // ======================
        try {
            set("cellHafalanLama", getHafalanLama());
            set("cellHafalanBaru", getHafalanBaru(laporan));
            set("cellHafalanTerakhir", getAkumulasiTerakhir(laporan));
        } catch (e) {
            console.error("❌ Error blok Hafalan:", e);
        }

        // ======================
        // NILAI HAFALAN
        // ======================
        try {
            set("avgKelancaranGabungan", formatNilai(kelancaran));
            set("avgTahsinGabungan", formatNilai(tahsin));
            set("avgTajwidGabungan", formatNilai(tajwid));
            set("avgTotalGabungan", formatNilai(predikat.angka));
            set("avgTotalAngka", formatNilai(predikat.angka));
            set("avgTotalHuruf", predikat.arab);
            set("avgTotalArab", predikat.tulisan);
        } catch (e) {
            console.error("❌ Error blok Nilai:", e);
        }

// ======================
// KEHADIRAN
// ======================
try {
    const dataKehadiran = filterKehadiranBulanan() || [];
    
    // 🔍 DEBUG
    console.log("📊 Total data kehadiran:", dataKehadiran.length);
    console.log("📊 state.historyKehadiran:", state.historyKehadiran?.length);
    console.log("📊 el.bulan value:", el.bulan?.dataset?.value);
    console.log("📊 el.tahun value:", el.tahun?.dataset?.value);
    console.log("📊 santriAktif:", state.santriAktif?.id_santri);

    // ✅ FIX: pakai nama fungsi yang benar
    const rekap = hitungRekapKehadiran(dataKehadiran) || {
        hadir: 0, izin: 0, sakit: 0, alpha: 0, persentase: 0, total: 0
    };
    
    console.log("📊 Hasil rekap:", rekap);

    // ✅ FIX: pakai property 'persentase' bukan 'persen'
    const persen = rekap.persentase ?? 0;

    const hasilKehadiran = konversiPersenKehadiran(persen);
    const predikatKehadiran = angkaKeHuruf(hasilKehadiran.angka);

    set("rekapHadir", rekap.hadir);
    set("rekapIzin", rekap.izin);
    set("rekapSakit", rekap.sakit);
    set("rekapAlpha", rekap.alpha);
    set("rekapPersentase", formatNilai(persen) + "%");

    set("rekapNilaiKehadiran", formatNilai(predikatKehadiran.angka));
    set("rekapNilaiKehadiranAngka", formatNilai(predikatKehadiran.angka));
    set("rekapPredikatKehadiran", predikatKehadiran.latin);
    set("rekapArabKehadiran", predikatKehadiran.tulisan);
} catch (e) {
    console.error("❌ Error blok Kehadiran:", e);
}

// ======================
// IBADAH & AKHLAQ
// ======================
try {
    const dataIbadah = filterIbadahBulanan() || [];
    console.log("📊 Data Ibadah:", dataIbadah.length);
    console.log("📊 Sample Ibadah:", dataIbadah[0]);

    if (dataIbadah.length) {
        const last = dataIbadah[dataIbadah.length - 1];

        set("rekapSholat", formatNilai(last.rataSholat));
        set("rekapTilawah", formatNilai(nilaiToAngka(last.ibadah?.tilawah)));
        set("rekapAdabGuru", formatNilai(nilaiToAngka(last.akhlaq?.adabGuru)));
        set("rekapAdabOrtu", formatNilai(nilaiToAngka(last.akhlaq?.adabOrtu)));
        set("rekapDisiplin", formatNilai(nilaiToAngka(last.akhlaq?.disiplin)));
        set("rekapKebersihan", formatNilai(nilaiToAngka(last.akhlaq?.kebersihan)));

        const predikatIbadah = angkaKeHuruf(last.rataTotal);

        // ✅ Nilai (box hijau di bawah tabel)
        set("rekapNilaiIbadah", formatNilai(predikatIbadah.angka));
        set("rekapPredikatIbadah", predikatIbadah.latin);
        set("rekapArabIbadah", predikatIbadah.tulisan);

        // ✅ Predikat di TABEL Ibadah (baris terakhir)
        const elPredikatTabel = document.getElementById("rekapPredikatAkhlaq");
        if (elPredikatTabel) {
            elPredikatTabel.innerHTML = `
                <strong>${predikatIbadah.latin}</strong><br>
                <small dir="rtl">${predikatIbadah.tulisan}</small>
            `;
        }
    }
} catch (e) {
    console.error("❌ Error blok Ibadah:", e);
}

        // ======================
        // BOX NILAI IBADAH (dari state.historyIbadah)
        // ======================
        try {
            if (ibadahTerakhir) {
                const predikatIbadah = angkaKeHuruf(ibadahTerakhir.rataTotal);
                set("rekapNilaiIbadah", formatNilai(predikatIbadah.angka));
                set("rekapPredikatIbadah", predikatIbadah.latin);
                set("rekapArabIbadah", predikatIbadah.tulisan);
            }
        } catch (e) {
            console.error("❌ Error blok Ibadah Box:", e);
        }

        // ======================
        // INTENSITAS
        // ======================
        try {
            set("txtTotalSetoran", laporan.length);
            set("txtTotalAyat", hitungTotalAyat(laporan));
            set("txtTotalTasmi", hitungTasmi(laporan));
        } catch (e) {
            console.error("❌ Error blok Intensitas:", e);
        }

        // ======================
        // IDENTITAS
        // ======================
        set("lblNama", terakhir?.nama_santri || "-");
        set("lblKelasUnit", terakhir?.unit_kelas || "-");
        set("lblNIS", terakhir?.id_santri || "-");

        // ======================
        // CATATAN
        // ======================
        try {
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

            set("cellMotivasiUstadz", terakhir?.motivasi || "-");
        } catch (e) {
            console.error("❌ Error blok Catatan:", e);
        }

        // ======================
        // PERIODE
        // ======================
        const bulanFilter = document.getElementById("filter-bulan");
        const tahunFilter = document.getElementById("filter-tahun");

        const namaBulan = [
            "Januari","Februari","Maret","April","Mei","Juni",
            "Juli","Agustus","September","Oktober","November","Desember"
        ];

        const sekarang = new Date();

        const bulan = bulanFilter?.value?.trim()
            ? bulanFilter.value
            : namaBulan[sekarang.getMonth()];

        const tahun = tahunFilter?.value?.trim()
            ? tahunFilter.value
            : sekarang.getFullYear();

        set("txtPeriodeLaporan", `Periode: ${bulan} ${tahun}`);
        set("lblPeriode", `${bulan} ${tahun}`);

        sukses("Laporan berhasil dibuat.");

    } catch (err) {
        console.error("❌ ERROR GENERATE LAPORAN:", err);
        console.error("Stack:", err?.stack);
        alert("Gagal membuat laporan: " + (err?.message || "Unknown error"));
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

