
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

const dashDropdown = document.getElementById("dashFilterDropdown");

dashDropdown?.addEventListener("click", function(e){

    const item = e.target.closest(".dropdown-item-custom");

    if(!item) return;

    const nama = item.dataset.nama;

    if(!nama) return;

    document.getElementById("dashFilterSantri").value = nama;

    dashDropdown.parentElement.classList.remove("open");

    rebuildDashboard();

});

function isiFilterSantriDashboard() {

    const select = document.getElementById("dashFilterSantri");

    if (!select) return;

    select.innerHTML = '<option value="">Semua Santri</option>';

    state.daftarSantri.forEach(s => {

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
   RANKING
========================================================== */

function buildRanking(data = []) {

    const map = {};

    data.forEach(item => {

        const id = item.id_santri;

        if (!id) return;

        if (!map[id]) {

            map[id] = {

                id,
                nama: item.nama || "-",
                kelas: item.kelas || "-",
                totalAyat: 0,
                juzTertinggi: 0

            };

        }

        map[id].totalAyat += Number(item.totalAyat || 0);

        const juz = Number(item.juzSelesai || item.juzMulai || 0);

        if (!isNaN(juz) && juz > map[id].juzTertinggi) {

            map[id].juzTertinggi = juz;

        }

    });

    return Object.values(map)
        .sort((a, b) => b.totalAyat - a.totalAyat);

}


/* ==========================================================
   RENDER RANKING
========================================================== */

function renderRanking(data = []) {

    const tbody = el.rankingBody;

    if (!tbody) return;

    if (!Array.isArray(data) || data.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td colspan="9">Belum ada data</td>
            </tr>
        `;

        return;

    }

    const ranking = [...data].sort((a, b) => {

        if (b.nilaiAkhir !== a.nilaiAkhir) {
            return b.nilaiAkhir - a.nilaiAkhir;
        }

        if (b.nilaiHafalan !== a.nilaiHafalan) {
            return b.nilaiHafalan - a.nilaiHafalan;
        }

        if (b.nilaiIbadah !== a.nilaiIbadah) {
            return b.nilaiIbadah - a.nilaiIbadah;
        }

        return b.persenHadir - a.persenHadir;

    });

    tbody.innerHTML = ranking.map((s, index) => {

        const predikat = angkaKeHuruf(s.nilaiAkhir);

        return `

            <tr>

                <td>
                    <span class="rank-badge">
                        ${index + 1}
                    </span>
                </td>

                <td>${s.nama || "-"}</td>

                <td>${s.id_santri || s.id || "-"}</td>

                <td>${s.kelas || "-"}</td>

                <td>${formatNilai(s.persenHadir)}%</td>

                <td>${formatNilai(s.nilaiHafalan)}</td>

                <td>${formatNilai(s.nilaiIbadah)}</td>

                <td>
                    <strong>${formatNilai(s.nilaiAkhir)}</strong>
                </td>

                <td>
                    ${predikat.latin}<br>
                    <small dir="rtl">
                        ${predikat.tulisan}
                    </small>
                </td>

            </tr>

        `;

    }).join("");

}


/* ==========================================================
   LISTENER IBADAH
========================================================== */

function listenIbadah() {

    const q = collection(db, COL.IBADAH);

    onSnapshot(q, (snapshot) => {

        state.historyIbadah = snapshot.docs.map(doc => ({

            id: doc.id,
            ...doc.data()

        }));

        isiDashboardIbadah(state.historyIbadah);

    });

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

    const hasil = angkaKeHuruf(persen);
    document.getElementById("dash-hadir").textContent = hadir;
document.getElementById("dash-izin").textContent = izin;
document.getElementById("dash-sakit").textContent = sakit;
document.getElementById("dash-alpha").textContent = alpha;
document.getElementById("dash-persen").textContent = persen + "%";
const elNilai = document.getElementById("dash-nilai-kehadiran");

if (elNilai) {
elNilai.innerHTML = `
    <strong>${formatNilai(hasil.angka)}</strong><br>
    <small>${hasil.latin}</small><br>
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
    <small>${hasil.latin}</small><br>
    <small dir="rtl">${hasil.tulisan}</small>
`;

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
    <small>${nilai.latin}</small><br>
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

async function rebuildDashboard() {

    try {

        const semuaData = await ambilSemuaData();

  let rekap = hitungRekapPerSantri(semuaData);

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

    renderDashboardTable(rekap);

renderRanking(rekap);

setTimeout(() => {
    updateGrafikDashboard();
}, 300);
    
    } catch (error) {
    console.error(error.stack);
}


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

function hitungNilaiSantri(hafalan=[], kehadiran=[], ibadah=[]) {

    // ==========================
    // HAFALAN
    // ==========================
    const kel = rataHuruf(hafalan, "kelancaran");
    const tah = rataHuruf(hafalan, "tahsin");
    const taj = rataHuruf(hafalan, "tajwid");
const progress = hitungProgressHafalan(hafalan);
    const nilaiHafalan = predikatHafalan(kel, tah, taj);

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

const nilaiAkhir = Number((
    nilaiHafalan.angka * 0.40 +
    dataKehadiran.angka * 0.30 +
    predikatIbadah.angka * 0.30
).toFixed(1));

const hasilAkhir = angkaKeHuruf(nilaiAkhir);
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
    predikatHafalan: nilaiHafalan.latin,
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
predikatKehadiran: dataKehadiran.latin,
predikatKehadiranArab: dataKehadiran.tulisan,
    // ==========================
    // IBADAH
    // ==========================
    nilaiIbadah: Number(rataSholat.toFixed(1)),
nilaiAkhlaq: Number(rataAkhlaq.toFixed(1)),
nilaiIbadahAkhlaq: Number(rataTotal.toFixed(1)),

predikatIbadah: predikatIbadah.latin,
predikatIbadahArab: predikatIbadah.tulisan,
    // ==========================
    // NILAI AKHIR
    // ==========================
    nilaiAkhir,

    
    predikat: hasilAkhir.latin,
predikatArab: hasilAkhir.tulisan
};
}

function hitungRekapPerSantri(data) {
data = data || {};

    const hafalan = data.hafalan || [];
    const kehadiran = data.kehadiran || [];
    const ibadah = data.ibadah || [];

    const map = new Map();

    hafalan.forEach(item => {

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
    // SCORING ENGINE
    // =========================
    const hasil = [];

map.forEach((santri, id) => {

    const nilai = hitungNilaiSantri(

        hafalan.filter(x => x.id_santri === id),

        kehadiran.filter(x => x.id_santri === id),

        ibadah.filter(x => x.id_santri === id)

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

    if (!Array.isArray(rekap) || rekap.length === 0) {
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

    const terbaik = [...rekap]
        .sort((a, b) => b.nilaiAkhir - a.nilaiAkhir)[0];

    const terbaikHafalan = [...rekap]
        .sort((a, b) => b.nilaiHafalan - a.nilaiHafalan)[0];

    const terbaikHadir = [...rekap]
        .sort((a, b) => b.persenHadir - a.persenHadir)[0];

    const terbaikIbadah = [...rekap]
        .sort((a, b) => b.nilaiIbadah - a.nilaiIbadah)[0];

    return {

        terbaik,

        hafalan: terbaikHafalan,
        hadir: terbaikHadir,
        ibadah: terbaikIbadah,

        avgHafalan: formatNilai(
            rekap.reduce((t, s) => t + Number(s.nilaiHafalan || 0), 0) / rekap.length
        ),

        avgHadir: formatNilai(
            rekap.reduce((t, s) => t + Number(s.persenHadir || 0), 0) / rekap.length
        ),

        avgIbadah: formatNilai(
            rekap.reduce((t, s) => t + Number(s.nilaiIbadah || 0), 0) / rekap.length
        ),

        avgNilai: formatNilai(
            rekap.reduce((t, s) => t + Number(s.nilaiAkhir || 0), 0) / rekap.length
        ),

        jumlahSantri: rekap.length,

        totalSetoran: rekap.reduce(
            (t, s) => t + Number(s.frekuensi || 0),
            0
        ),

        totalAyat: rekap.reduce(
            (t, s) => t + Number(s.totalAyat || 0),
            0
        ),

        totalTasmi: rekap.reduce(
            (t, s) => t + Number(s.tasmi || 0),
            0
        )

    };

}
function renderDashboardTable(data) {

    const tbodyKehadiran = document.getElementById("dashboardBodyKehadiran");
    const tbodyHafalan   = document.getElementById("dashboardBodyHafalan");
    const tbodyIbadah    = document.getElementById("dashboardBodyIbadah");
    const tbodyRekap     = document.getElementById("dashboardBodyRekap");

    // Bersihkan tabel terlebih dahulu
    if (tbodyKehadiran) tbodyKehadiran.innerHTML = "";
    if (tbodyHafalan) tbodyHafalan.innerHTML = "";
    if (tbodyIbadah) tbodyIbadah.innerHTML = "";
    if (tbodyRekap) tbodyRekap.innerHTML = "";

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

// ============================================================
// GRAFIK DASHBOARD
// ============================================================

const BAR_COLORS = {
    background: [
        "#4CAF50",
        "#2196F3",
        "#FF9800",
        "#9C27B0"
    ],
    border: [
        "#388E3C",
        "#1976D2",
        "#F57C00",
        "#7B1FA2"
    ]
};

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

    const modeEl = document.getElementById("grafikMode");
if (!modeEl) return;
const mode = modeEl.value;

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

const grafikMode =
document.getElementById("grafikMode");

if (grafikMode) {
    grafikMode.addEventListener(
        "change",
        updateGrafikDashboard
    );
}
