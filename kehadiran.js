/* ==========================================================
   PART 3 - KEHADIRAN SANTRI
   Versi Final & Bersih
========================================================== */


/* ==========================================================
   VALIDASI
========================================================== */
function validasiKehadiran() {

    if (!pastikanSantriDipilih()) return false;

    if (!el.tanggalKehadiran || !el.tanggalKehadiran.value) {
        info("Tanggal kehadiran belum dipilih.");
        return false;
    }

    if (!el.statusKehadiran || !el.statusKehadiran.value) {
        info("Status kehadiran belum dipilih.");
        return false;
    }

    return true;
}


/* ==========================================================
   AMBIL DATA KEHADIRAN DARI FORM
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
   HELPER SET STATUS KEHADIRAN
========================================================== */
function setStatusKehadiran(value) {
    const elStatus = document.getElementById('statusKehadiran');
    if (!elStatus) return;

    elStatus.value = value;

    if (typeof CustomDropdown !== "undefined") {
        CustomDropdown.refresh(elStatus);
    }
}


/* ==========================================================
   DOC ID
========================================================== */
function getKehadiranId(data) {
    return `${data.id_santri}_${data.tanggal}`;
}


/* ==========================================================
   SIMPAN KEHADIRAN KE FIRESTORE
========================================================== */
async function simpanKehadiran() {

    if (!validasiKehadiran()) return false;

    try {
        setLoading(true);

        const data = getDataKehadiran();

        console.log("📝 Menyimpan kehadiran:", data);

        await setDoc(
            doc(db, COL.KEHADIRAN, getKehadiranId(data)),
            data,
            { merge: true }
        );

        // Update state (replace jika sudah ada, tambah jika belum)
        const idxExisting = state.historyKehadiran.findIndex(
            x => x.id_santri === data.id_santri && x.tanggal === data.tanggal
        );

        if (idxExisting >= 0) {
            state.historyKehadiran[idxExisting] = { ...data };
        } else {
            state.historyKehadiran.push(data);
        }

        // Refresh dashboard mini
        if (typeof refreshDashboardMini === "function") {
            refreshDashboardMini();
        }

        sukses("Kehadiran berhasil disimpan.");
        return true;

    } catch (err) {
        console.error("❌ Error simpanKehadiran:", err.code, err.message, err);
        gagal("Gagal menyimpan kehadiran: " + (err.message || err));
        return false;

    } finally {
        setLoading(false);
    }
}


/* ==========================================================
   RESET FORM KEHADIRAN
========================================================== */
function resetFormKehadiran() {

    // Reset tanggal ke hari ini
    if (el.tanggalKehadiran) {
        el.tanggalKehadiran.value = today();
    }

    // Reset status
    if (el.statusKehadiran) {
        el.statusKehadiran.value = '';
        el.statusKehadiran.selectedIndex = 0;

        if (typeof CustomDropdown !== "undefined") {
            CustomDropdown.refresh(el.statusKehadiran);
        }
    }
}


/* ==========================================================
   LOAD HISTORY KEHADIRAN
========================================================== */
window.loadHistoryKehadiran = async function () {

    if (!pastikanSantriDipilih(false)) return [];

    try {
        const q = query(
            collection(db, COL.KEHADIRAN),
            where("id_santri", "==", state.santriAktif.id_santri),
            orderBy("tanggal", "asc")
        );

        const snap = await getDocs(q);

        state.historyKehadiran = snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        console.log(`✅ Loaded ${state.historyKehadiran.length} kehadiran`);

        // Refresh dropdown status
        const elStatus = document.getElementById('statusKehadiran');
        if (elStatus && typeof CustomDropdown !== "undefined") {
            CustomDropdown.refresh(elStatus);
        }

        return state.historyKehadiran;

    } catch (err) {
        console.error("❌ Error loadHistoryKehadiran:", err.code, err.message, err);
        return [];
    }
};


/* ==========================================================
   SIMPAN & LANJUT KE TAB HAFALAN
========================================================== */
window.simpanDanKeHafalan = async function () {

    const ok = await simpanKehadiran();
    if (!ok) return;

    // Reset form
    resetFormKehadiran();

    // Reload history dari Firestore
    await loadHistoryKehadiran();

    // Refresh dashboard mini
    if (typeof refreshDashboardMini === "function") {
        refreshDashboardMini();
    }

    // Pindah ke tab hafalan
    if (typeof openTab === "function") {
        openTab(null, "input-panel");
    }
};


/* ==========================================================
   REKAP KEHADIRAN
========================================================== */
function hitungRekapKehadiran(data) {
    const hasil = { hadir: 0, izin: 0, sakit: 0, alpha: 0 };

    data.forEach(item => {
        switch (item.status) {
            case "Hadir": hasil.hadir++; break;
            case "Izin":  hasil.izin++;  break;
            case "Sakit": hasil.sakit++; break;
            case "Alpha": hasil.alpha++; break;
        }
    });

    hasil.total = hasil.hadir + hasil.izin + hasil.sakit + hasil.alpha;
    hasil.persentase = hasil.total === 0 
        ? 0 
        : Math.round((hasil.hadir / hasil.total) * 100);

    return hasil;
}


/* ==========================================================
   FILTER KEHADIRAN BULANAN
========================================================== */
function filterKehadiranBulanan() {

    const bulan = el.bulan?.dataset?.value || "";
    const tahun = el.tahun?.dataset?.value || "";

    if (!bulan || !tahun) return [];

    return state.historyKehadiran.filter(item => {
        const tgl = new Date(item.tanggal);
        return (
            item.id_santri === state.santriAktif?.id_santri &&
            String(tgl.getMonth() + 1).padStart(2, "0") === bulan &&
            String(tgl.getFullYear()) === tahun
        );
    });
}


/* ==========================================================
   NILAI KEHADIRAN (Persen → Huruf)
========================================================== */
function nilaiKehadiran(persen) {
    if (persen >= 95) return "A";
    if (persen >= 85) return "B";
    if (persen >= 75) return "C";
    return "D";
}


/* ==========================================================
   RENDER FILTER DASHBOARD SANTRI
========================================================== */
function renderFilterDashboard(list) {
    const menu = document.getElementById("dashFilterDropdown");
    if (!menu) return;

    if (!list.length) {
        menu.innerHTML = `
            <div class="dropdown-item-custom">Tidak ada data</div>
        `;
        return;
    }

    menu.innerHTML = list.map(s => `
        <div class="dropdown-item-custom" data-nama="${s.nama}">
            ${s.nama}
        </div>
    `).join("");
}


/* ==========================================================
   EVENT LISTENER FILTER DASHBOARD (DIAMANKAN)
========================================================== */
(function initDashFilter() {

    const inputFilter = document.getElementById("dashFilterSantri");
    const dashDropdown = document.getElementById("dashFilterDropdown");

    if (inputFilter) {
        inputFilter.addEventListener("input", function () {
            const keyword = this.value.toLowerCase().trim();

            filterSantriDashboard = keyword;

            const hasil = state.daftarSantri.filter(s =>
                (s.nama || "").toLowerCase().includes(keyword)
            );

            renderFilterDashboard(hasil);

            const parent = document.querySelector("#dashFilterDropdown")?.parentElement;
            if (parent) parent.classList.add("open");

            rebuildDashboard();
        });
    }

    if (dashDropdown) {
        dashDropdown.addEventListener("click", function (e) {
            const item = e.target.closest(".dropdown-item-custom");
            if (!item) return;

            const nama = item.dataset.nama;
            if (!nama) return;

            const inp = document.getElementById("dashFilterSantri");
            if (inp) inp.value = nama;

            dashDropdown.parentElement?.classList.remove("open");
            rebuildDashboard();
        });
    }
})();