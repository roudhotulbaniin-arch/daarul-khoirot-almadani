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
         <small>${nilai.latin}</small>
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
            item.id_santri === state.santriAktif.id &&
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
          <small>${hasil.latin}</small>
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