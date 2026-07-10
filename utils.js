
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

function nilaiToAngka(label) {

    if (typeof label !== "string") return 0;

    label = label.trim().toLowerCase();

    // Ibadah & Akhlaq
    switch (label) {

        case "sangat baik":
            return 95;

        case "baik":
            return 80;

        case "cukup":
            return 70;

        case "kurang":
            return 50;

    }

    // Hafalan
    if (label.startsWith("a")) return 95;
    if (label.startsWith("b")) return 80;
    if (label.startsWith("c")) return 70;
    if (label.startsWith("d")) return 50;

    return 0;

}


// =====================================
// ENGINE PERIODE V3
// =====================================

function getPeriode() {
    const now = new Date();

    return {
        bulan: el.bulan?.dataset.value ||
               String(now.getMonth() + 1).padStart(2, "0"),

        tahun: el.tahun?.dataset.value ||
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

function konversiHurufKeAngka(huruf) {
    switch (huruf) {
        case "A": return 95;
        case "B": return 85;
        case "C": return 75;
        case "D": return 65;
        default: return 0;
    }
}

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
