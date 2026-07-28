/* ================================================================
   PENGATURAN SISTEM — JS
================================================================ */

// Load setting dari localStorage
document.addEventListener('DOMContentLoaded', () => {
    const saved = JSON.parse(localStorage.getItem('dka_settings') || '{}');
    if (saved.namaLembaga)  document.getElementById('setNamaLembaga').value  = saved.namaLembaga;
    if (saved.alamat)       document.getElementById('setAlamat').value       = saved.alamat;
    if (saved.email)        document.getElementById('setEmail').value        = saved.email;
    if (saved.waAdmin)      document.getElementById('setWaAdmin').value      = saved.waAdmin;
    if (saved.telKantor)    document.getElementById('setTelKantor').value    = saved.telKantor;
    if (saved.prefixId)     document.getElementById('setPrefixId').value     = saved.prefixId;
    if (saved.digitId)      document.getElementById('setDigitId').value      = saved.digitId;
    if (saved.lastBackup)   document.getElementById('lastBackup').textContent = saved.lastBackup;

    updatePreviewId();
});

// Preview ID
function updatePreviewId() {
    const prefix = document.getElementById('setPrefixId').value || 'DKM';
    const digit  = parseInt(document.getElementById('setDigitId').value || 3);
    const nomor  = String(1).padStart(digit, '0');
    document.getElementById('previewId').textContent = `${prefix}${nomor}`;
}

document.getElementById('setPrefixId')?.addEventListener('input', updatePreviewId);
document.getElementById('setDigitId')?.addEventListener('change', updatePreviewId);


/* ========== SAVE FUNCTIONS ========== */
function getSaved() { return JSON.parse(localStorage.getItem('dka_settings') || '{}'); }
function saveSettings(newData) {
    const merged = { ...getSaved(), ...newData };
    localStorage.setItem('dka_settings', JSON.stringify(merged));
}

function simpanProfil() {
    saveSettings({
        namaLembaga: document.getElementById('setNamaLembaga').value,
        alamat: document.getElementById('setAlamat').value,
        email: document.getElementById('setEmail').value
    });
    Swal.fire('Tersimpan!', 'Profil lembaga berhasil diperbarui', 'success');
}

function simpanKontak() {
    saveSettings({
        waAdmin: document.getElementById('setWaAdmin').value,
        telKantor: document.getElementById('setTelKantor').value
    });
    Swal.fire('Tersimpan!', 'Kontak admin berhasil diperbarui', 'success');
}

function simpanFormatId() {
    saveSettings({
        prefixId: document.getElementById('setPrefixId').value,
        digitId: document.getElementById('setDigitId').value
    });
    Swal.fire('Tersimpan!', 'Format ID santri berhasil diperbarui', 'success');
}


/* ========== BACKUP ========== */
async function backupJSON() {
    try {
        const { collection, getDocs } = 
            await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
        
        const snap = await getDocs(collection(window.db, "pendaftaran_santri"));
        const data = [];
        snap.forEach(d => data.push({ id: d.id, ...d.data() }));

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Backup_DKM_${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        const now = new Date().toLocaleString('id-ID');
        saveSettings({ lastBackup: now });
        document.getElementById('lastBackup').textContent = now;

        Swal.fire('Berhasil!', `${data.length} record berhasil dibackup`, 'success');
    } catch (err) {
        Swal.fire('Gagal', err.message, 'error');
    }
}

async function backupExcel() {
    try {
        const { collection, getDocs } = 
            await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
        
        const snap = await getDocs(collection(window.db, "pendaftaran_santri"));
        
        let csv = 'ID Santri,Nama,Unit,NIK,Nama Ayah,HP,Status\n';
        snap.forEach(d => {
            const r = d.data();
            csv += `"${r.id_santri || ''}","${r.nama_santri || ''}","${r.tingkat_unit || ''}","${r.nik || ''}","${r.nama_ayah || ''}","${r.hp_ayah || ''}","${r.status_santri || 'Aktif'}"\n`;
        });

        const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `Backup_DKM_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();

        Swal.fire('Berhasil!', `${snap.size} data berhasil di-export ke CSV`, 'success');
    } catch (err) {
        Swal.fire('Gagal', err.message, 'error');
    }
}


/* ========== SECURITY ========== */
function gantiPassword() {
    Swal.fire({
        title: '🔐 Ganti Password Admin',
        html: '<p>Untuk keamanan, silakan ganti password langsung dari Firebase Authentication Console.</p>',
        icon: 'info',
        confirmButtonColor: '#1a5d1a'
    });
}

function lihatAktivitas() {
    Swal.fire({
        title: '📋 Riwayat Aktivitas',
        html: '<p>Fitur log aktivitas sedang dalam pengembangan.</p>',
        icon: 'info',
        confirmButtonColor: '#1a5d1a'
    });
}

/* Expose */
window.simpanProfil = simpanProfil;
window.simpanKontak = simpanKontak;
window.simpanFormatId = simpanFormatId;
window.backupJSON = backupJSON;
window.backupExcel = backupExcel;
window.gantiPassword = gantiPassword;
window.lihatAktivitas = lihatAktivitas;