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
   HITUNG JUMLAH AYAT
========================================================== */

function updateAkumulasi() {

    const current = Number(el.setoran.value);

    if (!isNaN(current) && current >= 0) {
        el.akumulasi.value = current;
    } else {
        el.akumulasi.value = "";
    }

}

function hitungSetoran() {

    const mulai = Number(el.ayatMulai.value);
    const selesai = Number(el.ayatSelesai.value);

    if (isNaN(mulai) || isNaN(selesai)) {
        el.setoran.value = "";
        return;
    }

    if (selesai < mulai) {
        el.setoran.value = "0";
        el.akumulasi.value = "0";
        return;
    }

    const hasil = selesai - mulai + 1;

    el.setoran.value = hasil;
    el.akumulasi.value = hasil;

}

function hitungAyatTertinggi(data) {

    if (!Array.isArray(data) || data.length === 0) return "-";

    let max = 0;

    data.forEach(item => {

        const mulai = Number(item?.ayat_mulai);
        const selesai = Number(item?.ayat_selesai);

        if (isNaN(mulai) || isNaN(selesai)) return;

        const jumlah = selesai >= mulai
            ? (selesai - mulai + 1)
            : 0;

        if (jumlah > max) max = jumlah;

    });

    return max > 0 ? `${max} Ayat` : "-";

}

function syncHitungan() {

    if (typeof hitungTotalAyat !== "function") return;

    const total = hitungTotalAyat();

    el.setoran.value = total;
    el.akumulasi.value = total;

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

    if (Number(el.ayatSelesai.value) < Number(el.ayatMulai.value)) {
        info("Ayat selesai tidak boleh lebih kecil dari ayat mulai.");
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

        id_santri: state.santriAktif.id,
        nama: state.santriAktif.nama,
        kelas: state.santriAktif.kelas,

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

        juzMulai: getJuzFromAyat(mulai),
        juzSelesai: getJuzFromAyat(selesai),

        createdAt: serverTimestamp()

    };

}


/* ==========================================================
   DOC ID
========================================================== */

function getHafalanId(data) {

    return `${data.id_santri}_${data.tanggal}`;

}


/* ==========================================================
   SIMPAN
========================================================== */

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

        sukses("Hafalan berhasil disimpan.");

        return true;

    } catch (err) {

        console.error(err);

        gagal("Gagal menyimpan hafalan.");

        return false;

    } finally {

        setLoading(false);

    }

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
   HITUNG OTOMATIS
========================================================== */

el.ayatMulai?.addEventListener("input", syncHitungan);

el.ayatSelesai?.addEventListener("input", syncHitungan);

/* ==========================================================
   RESET FORM
========================================================== */

function resetForm() {

    const form = document.getElementById("formHafalan");

    if (!form) return;

    form.querySelectorAll("input, textarea, select").forEach(item => {

        if (item.type === "checkbox") {

            item.checked = false;

        } else {

            item.value = "";

        }

    });

}

/* ==========================================================
   EXPORT
========================================================== */

window.simpanHafalan = simpanHafalan;


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
