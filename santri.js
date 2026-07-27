/* ==========================================================
   LOAD SANTRI
========================================================== */

async function loadSantri() {
    try {
        const snap = await getDocs(collection(db, COL.SANTRI));

        state.daftarSantri = snap.docs
            .map(doc => {
                const data = doc.data();

                // ⭐ Fallback id_santri untuk dokumen lama yang belum punya
                const idSantri = data.id_santri
                    || `LEGACY-${doc.id.slice(0, 8).toUpperCase()}`;

                return {
                    ...data,
                    id       : idSantri,          // ← satu sumber kebenaran
                    id_santri: idSantri,          // ← sinkron dengan id
                    nama     : data.nama_santri || "Tanpa Nama",
                    kelas    : data.tingkat_unit  || "-"
                };
            })
            .sort((a, b) => {
                // ⭐ Fallback aman supaya tidak crash
                const namaA = (a.nama || "").toLowerCase();
                const namaB = (b.nama || "").toLowerCase();
                return namaA.localeCompare(namaB, "id");
            });

        console.log(`✅ ${state.daftarSantri.length} santri dimuat`);

        renderMenuSantri(state.daftarSantri);
        state.santri = state.daftarSantri;
        isiFilterSantriDashboard();

    } catch (err) {
        console.error("❌ loadSantri:", err);
        gagal("Gagal memuat data santri.");
    }
}


/* ==========================================================
   SEARCH SANTRI
========================================================== */

el.searchSantri.addEventListener("input", function () {
    filterSantriPanel = this.value.toLowerCase().trim();

    const hasil = state.daftarSantri.filter(s => {
        const namaCocok = (s.nama || s.nama_santri || "")
            .toLowerCase()
            .includes(filterSantriPanel);

        // ⭐ Bonus: bisa search by ID juga
        const idCocok = (s.id_santri || s.id || "")
            .toLowerCase()
            .includes(filterSantriPanel);

        return namaCocok || idCocok;
    });

    renderMenuSantri(hasil);

    document
        .querySelector(".dropdown-wrapper-custom")
        ?.classList.add("open");
});


/* ==========================================================
   PILIH SANTRI
========================================================== */

el.menuSantri.addEventListener("click", e => {
    const item = e.target.closest(".dropdown-item-custom");
    if (!item) return;

    const id = item.dataset.id;
    pilihSantri(id);
    closeDropdown();
});


/* ==========================================================
   SET SANTRI — DIPERBAIKI
========================================================== */

function pilihSantri(id) {
    // Cari berdasarkan id (sudah sinkron dengan id_santri)
    const santri = state.daftarSantri.find(s => s.id === id);

    if (!santri) {
        console.warn("⚠️ Santri tidak ditemukan dengan id:", id);
        return;
    }

    // ⭐ Tidak perlu di-overwrite lagi — sudah sinkron di loadSantri()
    state.santriAktif = { ...santri };

    // ⭐ Gunakan santri.id (sudah = id_santri)
    el.idSantri.value    = santri.id;
    el.santri.value      = santri.id;
    el.searchSantri.value = santri.nama || santri.nama_santri || "";

    console.log("👤 Santri dipilih:", {
        id      : santri.id,
        id_santri: santri.id_santri,
        nama    : santri.nama
    });

    tampilIdentitas(santri);
}


/* ==========================================================
   IDENTITAS
========================================================== */

function tampilIdentitas(data) {
    // ⭐ Konsisten: pakai id_santri || id
    el.infoId.textContent     = data.id_santri || data.id || "-";
    el.infoNama.textContent   = data.nama_santri || data.nama || "-";
    el.infoAyah.textContent   = data.nama_ayah  || "-";
    el.infoKelas.textContent  = data.tingkat_unit || data.kelas || "-";
    el.infoStatus.textContent = data.status_santri || "-";
    el.infoDaftar.textContent = formatTanggal(data.tgl_daftar || "-");

    el.kartuSantri.style.display = "block";
    el.navSantri.style.display   = "flex";
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
    ].forEach(i => i.textContent = "-");

    // ⭐ Tambahan: reset state dan sembunyikan kartu
    state.santriAktif        = null;
    el.kartuSantri.style.display = "none";
    el.navSantri.style.display   = "none";
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

    // ⭐ Double-check: id harus ada
    if (!state.santriAktif.id) {
        console.error("❌ santriAktif tidak punya id:", state.santriAktif);
        if (showAlert) {
            gagal("Data santri tidak valid. Silakan pilih ulang.");
        }
        return false;
    }

    return true;
}