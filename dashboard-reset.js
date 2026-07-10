
/* ==============================
   OPTIONAL: CLEAN DASHBOARD CHECK
============================== */

window.validateDashboardData = function () {

    if (!Array.isArray(state.dashboardData)) {
        state.dashboardData = [];
    }

};


/* ==============================
   INIT SAFETY (AUTO RUN)
============================== */

window.addEventListener("load", () => {

    validateDashboardData();

    
});

document.getElementById("btnResetData").addEventListener("click", async () => {

    if (!state.santriAktif) {
    	
        Swal.fire({
            icon: "warning",
            title: "Pilih Santri",
            text: "Silakan pilih santri terlebih dahulu."
        });
        return;
    }

    const result = await Swal.fire({
        title: "Reset Data Santri?",
        html: `
            Semua data <b>${state.santriAktif.nama}</b> akan dihapus.<br>
            <small>• Hafalan<br>• Kehadiran<br>• Ibadah & Akhlaq</small>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Ya, Hapus",
        cancelButtonText: "Batal"
    });

    if (!result.isConfirmed) return;

    try {

        const idSantri = state.santriAktif.id;


        // ==========================
        // HAPUS HAFALAN
        // ==========================
        const hafalanSnap = await getDocs(
            query(
                collection(db, COL.HAFALAN),
                where("id_santri", "==", idSantri)
            )
        );

        // ==========================
        // HAPUS KEHADIRAN
        // ==========================
        const kehadiranSnap = await getDocs(
            query(
                collection(db, COL.KEHADIRAN),
                where("id_santri", "==", idSantri)
            )
        );

        // ==========================
        // HAPUS IBADAH
        // ==========================
        const ibadahSnap = await getDocs(
            query(
                collection(db, COL.IBADAH),
                where("id_santri", "==", idSantri)
            )
        );

        const hapus = [];

        hafalanSnap.forEach(d => {
    
    hapus.push(deleteDoc(d.ref));
});

kehadiranSnap.forEach(d => {


    hapus.push(deleteDoc(d.ref));
});

ibadahSnap.forEach(d => {
    
    hapus.push(deleteDoc(d.ref));
});

        await Promise.all(hapus);

        
// ==========================
// RESET DASHBOARD ADMIN
// ==========================
window._rekapCache = [];

state.dashboard.rekap = [];
state.dashboard.summary = {};

updateDashboardSummary();
renderDashboardTable([]);
renderRanking([]);

// Kosongkan tabel secara langsung
const body = document.getElementById("dashboardBody");
if (body) body.innerHTML = "";

const ranking = document.getElementById("rankingBody");
if (ranking) ranking.innerHTML = "";

        Swal.fire({
            icon: "success",
            title: "Berhasil",
            text: "Semua data santri berhasil dihapus."
        });

    } catch (error) {
        console.error(error);

        Swal.fire({
            icon: "error",
            title: "Gagal",
            text: "Terjadi kesalahan saat menghapus data."
        });
    }

});


window.simpanDanKeIbadah = simpanDanKeIbadah;
window.generateLaporan = generateLaporan;
window.resetForm = resetForm;