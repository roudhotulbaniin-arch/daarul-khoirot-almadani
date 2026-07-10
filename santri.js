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

el.searchSantri.addEventListener("input", function () {

    filterSantriPanel = this.value
        .toLowerCase()
        .trim();

    const hasil = state.daftarSantri.filter(s =>
        (s.nama_santri || s.nama)
            .toLowerCase()
            .includes(filterSantriPanel)
    );

    renderMenuSantri(hasil);

    document
        .querySelector(".dropdown-wrapper-custom")
        ?.classList.add("open");

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