
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