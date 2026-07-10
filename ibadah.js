/* ==========================================================
   PART 5
   IBADAH & AKHLAQ
========================================================== */


/* ==========================================================
   KONVERSI PREDIKAT
========================================================== */

window.konversiAngkaKePredikatIbadah = function (nilai) {

    nilai = Number(nilai);

    if (nilai >= 90) return "Sangat Baik";
    if (nilai >= 80) return "Baik";
    if (nilai >= 70) return "Cukup";

    return "Kurang";

};

window.hurufKeArab = function (nilai) {

    const hasil = angkaKeHuruf(nilai);

    return `${hasil.latin} (${hasil.tulisan})`;

};

/* ==========================================================
   RATA-RATA
========================================================== */

function rataHuruf(data, field) {

    if (!Array.isArray(data) || !data.length) return 0;

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

    return Number.isInteger(nilai)
        ? nilai
        : Number(nilai.toFixed(1));

}

/* ==========================================================
   RATA SHOLAT
========================================================== */

function rataSholat() {

    const list = [

        el.subuh.value,
        el.dzuhur.value,
        el.ashar.value,
        el.maghrib.value,
        el.isya.value

    ];

    const nilai = list
        .map(nilaiToAngka)
        .filter(v => v > 0);


    if (!nilai.length) return 0;


    const total = nilai.reduce(
        (a, b) => a + b,
        0
    );


    return Number(
        (total / nilai.length).toFixed(1)
    );

}


/* ==========================================================
   RATA AKHLAQ
========================================================== */

function rataAkhlaq() {

    const list = [

        el.adabGuru.value,
        el.adabOrtu.value,
        el.disiplin.value,
        el.kebersihan.value

    ];


    const nilai = list
        .map(nilaiToAngka)
        .filter(v => v > 0);


    if (!nilai.length) return 0;


    const total = nilai.reduce(
        (a, b) => a + b,
        0
    );


    return Number(
        (total / nilai.length).toFixed(1)
    );

}

/* ==========================================================
   ANGKA KE HURUF
========================================================== */

function angkaKeHuruf(nilai) {

    nilai = Number(nilai) || 0;


    if (nilai >= 90)
        return {
            angka: nilai,
            predikat: "Mumtaz",
            latin: "Mumtaz",
            tulisan: "ممتاز"
        };


    if (nilai >= 80)
        return {
            angka: nilai,
            predikat: "Jayyid Jiddan",
            latin: "Jayyid Jiddan",
            tulisan: "جيد جداً"
        };


    if (nilai >= 70)
        return {
            angka: nilai,
            predikat: "Jayyid",
            latin: "Jayyid",
            tulisan: "جيد"
        };


    if (nilai >= 60)
        return {
            angka: nilai,
            predikat: "Maqbul",
            latin: "Maqbul",
            tulisan: "مقبول"
        };


    return {
        angka: nilai,
        predikat: "Dha'if",
        latin: "Dha'if",
        tulisan: "ضعيف"
    };

}

/* ==========================================================
   DATA IBADAH
========================================================== */

function getDataIbadah() {

    const nilaiSholat = rataSholat();

    const nilaiTilawah = nilaiToAngka(
        el.tilawah.value
    );


    const nilaiIbadah = Number(
        ((nilaiSholat + nilaiTilawah) / 2)
        .toFixed(1)
    );


    const nilaiAkhlaq = rataAkhlaq();


    const rataTotal = Number(
        ((nilaiIbadah + nilaiAkhlaq) / 2)
        .toFixed(1)
    );


    return {

        id_santri: state.santriAktif.id,
        nama: state.santriAktif.nama,
        kelas: state.santriAktif.kelas,

        tanggal: el.tanggal.value,


        ibadah: {

            subuh: el.subuh.value,
            dzuhur: el.dzuhur.value,
            ashar: el.ashar.value,
            maghrib: el.maghrib.value,
            isya: el.isya.value,
            tilawah: el.tilawah.value

        },


        akhlaq: {

            adabGuru: el.adabGuru.value,
            adabOrtu: el.adabOrtu.value,
            disiplin: el.disiplin.value,
            kebersihan: el.kebersihan.value

        },


        rataSholat: nilaiSholat,
        rataIbadah: nilaiIbadah,
        rataAkhlaq: nilaiAkhlaq,
        rataTotal,


        catatan: trim(
            el.catatanAkhlaq.value
        ),


        createdAt: serverTimestamp()

    };

}



/* ==========================================================
   VALIDASI
========================================================== */

function validasiIbadah() {

    if (!pastikanSantriDipilih())
        return false;


    if (!el.subuh.value) {

        info("Nilai Sholat Subuh belum dipilih.");

        return false;

    }


    if (!el.tilawah.value) {

        info("Nilai Tilawah belum dipilih.");

        return false;

    }


    return true;

}

/* ==========================================================
   DOC ID
========================================================== */

function getIbadahId(data) {

    return `${data.id_santri}_${data.tanggal}`;

}

/* ==========================================================
   SIMPAN
========================================================== */

async function simpanIbadah() {

    if (!validasiIbadah())
        return false;


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


        sukses(
            "Data ibadah berhasil disimpan."
        );


        return true;


    } catch (err) {

        console.error(err);

        gagal(
            "Gagal menyimpan data ibadah."
        );


        return false;


    } finally {

        setLoading(false);

    }

}


/* ==========================================================
   LOAD HISTORY
========================================================== */

async function loadHistoryIbadah() {

    if (!pastikanSantriDipilih(false))
        return;


    try {

        const q = query(

            collection(
                db,
                COL.IBADAH
            ),

            where(
                "id_santri",
                "==",
                state.santriAktif.id
            ),

            orderBy(
                "tanggal",
                "desc"
            )

        );


        const snap = await getDocs(q);


        state.historyIbadah = snap.docs.map(doc => ({

            id: doc.id,

            ...doc.data()

        }));


    } catch (err) {

        console.error(err);

    }

}

/* ==========================================================
   RESET
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

    ].forEach(item => {

        item.value = "";

    });


    el.catatanAkhlaq.value = "";

}

/* ==========================================================
   REFRESH MINI DASHBOARD
========================================================== */

async function refreshMiniDashboard() {

    await Promise.all([

        loadHistoryHafalan(),
        loadHistoryKehadiran(),
        loadHistoryIbadah()

    ]);


    refreshDashboardMini();

}

/* ==========================================================
   SIMPAN & REKAP
========================================================== */

window.simpanDanKeRekap = async function () {

    const ok = await simpanIbadah();


    if (!ok)
        return;


    await refreshMiniDashboard();


    resetFormIbadah();


    openTab(
        null,
        "rekap-panel"
    );

};

/* ==========================================================
   REFRESH HISTORY
========================================================== */

async function refreshSemuaHistory() {

    await Promise.all([

        loadHistoryHafalan(),
        loadHistoryKehadiran(),
        loadHistoryIbadah()

    ]);


    refreshDashboardMini();

}