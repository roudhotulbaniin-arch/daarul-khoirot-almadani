/* ================================================================
   DATA SANTRI AKTIF — JS
================================================================ */

window.dataSantriCache = {};
let filterState = { keyword: '', status: '', unit: '' };


function safeVal(val) {
    return val && val !== "" ? val : "-";
}

function formatTgl(iso) {
    if (!iso) return "-";
    try {
        return new Date(iso).toLocaleDateString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    } catch { return iso; }
}


/* ========== MUAT DATA ========== */
async function muatDataSantri() {
    const tbody = document.getElementById('dsTableBody');
    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="10" style="text-align:center; padding:40px;">
                <i class="fas fa-spinner fa-spin"></i> Memuat...
            </td>
        </tr>
    `;

    try {
        const { collection, getDocs } = 
            await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

        const snap = await getDocs(collection(window.db, "pendaftaran_santri"));

tbody.innerHTML = '';
window.dataSantriCache = {};

let totalAktif = 0, totalTPQ = 0, totalMDT = 0, totalPONPES = 0, totalAlumni = 0;
let no = 1;

// ✅ Konversi snapshot ke array agar bisa di-sort
const dataArray = [];
snap.forEach(docSnap => {
    dataArray.push({
        id: docSnap.id,
        data: docSnap.data()
    });
});

// ✅ Sort berdasarkan id_santri (numeric-aware)
dataArray.sort((a, b) => {
    const idA = a.data.id_santri || '';
    const idB = b.data.id_santri || '';
    return String(idA).localeCompare(String(idB), undefined, { numeric: true });
});

// ✅ Baru loop yang sudah terurut
dataArray.forEach(item => {
    const docSnap = { id: item.id, data: () => item.data };
    const d = item.data;

    window.dataSantriCache[item.id] = d;

    const status = d.status_santri || 'Aktif';
    const unit = (d.tingkat_unit || '').toUpperCase();

    if (status === 'Aktif') totalAktif++;
    if (status === 'Alumni') totalAlumni++;
    if (unit.includes('TPQ')) totalTPQ++;
    else if (unit.includes('MDT')) totalMDT++;
    else if (unit.includes('PONPES') || unit.includes('PESANTREN') || unit.includes('PST')) totalPONPES++;

    const hpKontak = d.hp_ayah || d.hp_ibu || '-';
    const statusClass = status.toLowerCase();

    const row = document.createElement('tr');
    row.dataset.searchable = [d.nama_santri, d.id_santri, d.nik].filter(Boolean).join(' ').toLowerCase();
    row.dataset.status = status.toLowerCase();
    row.dataset.unit = unit.toLowerCase();

    row.innerHTML = `
        <td>${no++}</td>
        <td><span class="ds-id-badge">${safeVal(d.id_santri)}</span></td>
        <td class="nama-cell">${safeVal(d.nama_santri)}</td>
        <td>${safeVal(d.tingkat_unit)}</td>
        <td>${safeVal(d.jenis_kelamin)}</td>
        <td>${safeVal(d.nama_ayah)}</td>
        <td>${hpKontak}</td>
        <td>${formatTgl(d.tgl_daftar)}</td>
        <td><span class="ds-status ${statusClass}">${status}</span></td>
        <td>
            <div class="ds-actions">
                <button class="btn-aksi edit" onclick="editSantri('${item.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-aksi status" onclick="ubahStatus('${item.id}')" title="Status">
                    <i class="fas fa-user-cog"></i>
                </button>
                <button class="btn-aksi hapus" onclick="hapusSantri('${item.id}')" title="Hapus">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    tbody.appendChild(row);
});
        document.getElementById('dsTotalAktif').textContent = totalAktif;
        document.getElementById('dsTotalTPQ').textContent = totalTPQ;
        document.getElementById('dsTotalMDT').textContent = totalMDT;
        document.getElementById('dsTotalPONPES').textContent = totalPONPES;
        document.getElementById('dsTotalAlumni').textContent = totalAlumni;

        if (snap.size === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="10" style="text-align:center; padding:40px; color:#94a3b8;">
                        <i class="fas fa-inbox" style="font-size:2rem;"></i>
                        <br><br>Belum ada data santri
                    </td>
                </tr>
            `;
        }

        console.log(`✅ ${snap.size} santri dimuat`);

    } catch (err) {
        console.error("❌ Error:", err);
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align:center; color:#dc2626; padding:30px;">
                    Gagal memuat: ${err.message}
                </td>
            </tr>
        `;
    }
}


/* ========== FILTER ========== */
function filterSantri(kw) { filterState.keyword = kw.toLowerCase().trim(); applyFilter(); }
function filterByStatus(s) { filterState.status = s.toLowerCase().trim(); applyFilter(); }
function filterByUnit(u) { filterState.unit = u.toLowerCase().trim(); applyFilter(); }

function applyFilter() {
    document.querySelectorAll('#dsTableBody tr[data-searchable]').forEach(row => {
        const matchKw = !filterState.keyword || row.dataset.searchable.includes(filterState.keyword);
        const matchSt = !filterState.status || row.dataset.status === filterState.status;
        const matchUn = !filterState.unit || row.dataset.unit.includes(filterState.unit);
        row.style.display = (matchKw && matchSt && matchUn) ? '' : 'none';
    });
}

/* ================================================================
   EDIT SANTRI — Menggunakan CustomDropdown existing
================================================================ */

async function editSantri(id) {
    const d = window.dataSantriCache[id];
    if (!d) {
        Swal.fire({
            icon: 'error',
            title: 'Data Tidak Ditemukan',
            text: 'Silakan refresh halaman dan coba lagi.',
            confirmButtonColor: '#1a5d1a',
            customClass: { popup: 'premium-popup', title: 'premium-title' }
        });
        return;
    }
    
    // Escape helper
    const esc = (v) => String(v ?? '')
        .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    
    // Helper: option selected checker
    const sel = (val, current) => String(val) === String(current) ? 'selected' : '';
    
    // Format tanggal daftar
    const tglDaftar = d.tgl_daftar || d.tanggal_daftar || d.created_at || '';
    let tglDaftarFmt = '-';
    if (tglDaftar) {
        try {
            const t = tglDaftar.toDate ? tglDaftar.toDate() : new Date(tglDaftar);
            tglDaftarFmt = t.toLocaleDateString('id-ID', {
                day: '2-digit', month: 'long', year: 'numeric'
            });
        } catch(e) { tglDaftarFmt = String(tglDaftar); }
    }
    
    // Data awal
    const currentUnit   = d.unit || d.tingkat_unit || '';
    const currentJK     = d.jenis_kelamin || '';
    const currentStatus = d.status || 'Aktif';
    
    // ===== MODAL =====
    const { value: formData } = await Swal.fire({
        title: `<i class="fas fa-user-edit"></i> Edit Data Santri`,
        width: 600,
        html: `
            <div class="edit-santri-form">
                
                <!-- Info Read-only -->
                <div class="edit-info-box">
                    <div class="edit-info-row">
                        <span><i class="fas fa-id-badge"></i> ID Santri</span>
                        <b>${esc(d.id_santri || id)}</b>
                    </div>
                    <div class="edit-info-row">
                        <span><i class="fas fa-calendar-check"></i> Tgl Daftar</span>
                        <b>${esc(tglDaftarFmt)}</b>
                    </div>
                </div>
                
                <!-- Nama Lengkap -->
                <div class="edit-field form-group">
                    <label><i class="fas fa-user"></i> Nama Lengkap <span class="req">*</span></label>
                    <input type="text" id="edit-nama" 
                           value="${esc(d.nama_santri || d.nama_lengkap || '')}" 
                           placeholder="Nama sesuai akta" required>
                </div>
                
                <!-- Unit & Kelas -->
                <div class="edit-grid-2">
                    <div class="edit-field form-group">
                        <label><i class="fas fa-school"></i> Unit <span class="req">*</span></label>
                        <select id="edit-unit" 
                                name="tingkat_unit"
                                data-cd="true" 
                                data-cd-placeholder="-- Pilih Unit --"
                                required>
                            <option value="">-- Pilih Unit --</option>
                            <optgroup label="📚 Unit TPQ">
                                <option value="TPQ - Tingkat 1" ${sel('TPQ - Tingkat 1', currentUnit)}>TPQ - Tingkat 1</option>
                                <option value="TPQ - Tingkat 2" ${sel('TPQ - Tingkat 2', currentUnit)}>TPQ - Tingkat 2</option>
                            </optgroup>
                            <optgroup label="📖 Unit MDT">
                                <option value="MDT - Tingkat 1" ${sel('MDT - Tingkat 1', currentUnit)}>MDT - Tingkat 1</option>
                                <option value="MDT - Tingkat 2" ${sel('MDT - Tingkat 2', currentUnit)}>MDT - Tingkat 2</option>
                                <option value="MDT - Tingkat 3" ${sel('MDT - Tingkat 3', currentUnit)}>MDT - Tingkat 3</option>
                                <option value="MDT - Tingkat 4" ${sel('MDT - Tingkat 4', currentUnit)}>MDT - Tingkat 4</option>
                            </optgroup>
                            <optgroup label="🕌 Unit Pesantren">
                                <option value="Pesantren Tahun 1" ${sel('Pesantren Tahun 1', currentUnit)}>Pesantren Tahun 1</option>
                                <option value="Pesantren Tahun 2" ${sel('Pesantren Tahun 2', currentUnit)}>Pesantren Tahun 2</option>
                                <option value="Pesantren Tahun 3" ${sel('Pesantren Tahun 3', currentUnit)}>Pesantren Tahun 3</option>
                            </optgroup>
                        </select>
                    </div>
                    <div class="edit-field form-group">
                        <label><i class="fas fa-chalkboard"></i> Kelas</label>
                        <input type="text" id="edit-kelas" 
                               value="${esc(d.kelas || '')}" 
                               placeholder="cth: 7A, X-RPL">
                    </div>
                </div>
                
                <!-- Jenis Kelamin -->
                <div class="edit-field form-group">
                    <label><i class="fas fa-venus-mars"></i> Jenis Kelamin <span class="req">*</span></label>
                    <select id="edit-jk" 
                            name="jenis_kelamin"
                            data-cd="true"
                            data-cd-placeholder="-- Pilih Jenis Kelamin --"
                            required>
                        <option value="">-- Pilih --</option>
                        <option value="Laki-laki" ${sel('Laki-laki', currentJK)}>Laki-laki</option>
                        <option value="Perempuan" ${sel('Perempuan', currentJK)}>Perempuan</option>
                    </select>
                </div>
                
                <!-- Nama Ayah -->
                <div class="edit-field form-group">
                    <label><i class="fas fa-male"></i> Nama Ayah</label>
                    <input type="text" id="edit-nama-ayah" 
                           value="${esc(d.nama_ayah || '')}" 
                           placeholder="Nama ayah kandung">
                </div>
                
                <!-- HP Ayah/Ibu -->
                <div class="edit-field form-group">
                    <label><i class="fas fa-phone"></i> HP Ayah / Ibu <span class="req">*</span></label>
                    <input type="tel" id="edit-hp" 
                           value="${esc(d.no_hp_wali || d.hp_ayah || d.no_hp || '')}" 
                           placeholder="cth: 08123456789" required>
                    <small style="color:#6b7280; font-size:0.75rem; margin-top:3px; display:block;">
                        <i class="fas fa-info-circle"></i> Untuk konfirmasi via WhatsApp
                    </small>
                </div>
                
                <!-- Status -->
                <div class="edit-field form-group">
                    <label><i class="fas fa-check-circle"></i> Status <span class="req">*</span></label>
                    <select id="edit-status" 
                            name="status_santri"
                            data-cd="true"
                            data-cd-main-icon="fas fa-check-circle"
                            data-cd-placeholder="-- Pilih Status --"
                            required>
                        <option value="Aktif"    ${sel('Aktif', currentStatus)}>🟢 Aktif</option>
                        <option value="Nonaktif" ${sel('Nonaktif', currentStatus)}>⚪ Nonaktif</option>
                        <option value="Alumni"   ${sel('Alumni', currentStatus)}>🎓 Alumni</option>
                        <option value="Pindah"   ${sel('Pindah', currentStatus)}>↪️ Pindah</option>
                    </select>
                </div>
                
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-save"></i> Simpan',
        cancelButtonText:  '<i class="fas fa-times"></i> Batal',
        confirmButtonColor: '#1a5d1a',
        cancelButtonColor:  '#6b7280',
        focusConfirm: false,
        allowOutsideClick: false,
        customClass: {
            popup: 'premium-popup edit-santri-popup',
            title: 'premium-title',
            confirmButton: 'premium-button',
            cancelButton:  'premium-button'
        },
        
        // ⭐ AKTIFKAN CustomDropdown setelah modal render
        didOpen: () => {
            // Init semua <select data-cd="true"> di dalam modal
            if (typeof CustomDropdown !== 'undefined' && CustomDropdown.init) {
                CustomDropdown.init();
                console.log('✅ CustomDropdown aktif di modal edit santri');
            } else {
                console.warn('⚠️ CustomDropdown belum termuat');
            }
        },
        
        preConfirm: () => {
            const data = {
                nama_santri:   document.getElementById('edit-nama').value.trim(),
                unit:          document.getElementById('edit-unit').value,
                kelas:         document.getElementById('edit-kelas').value.trim(),
                jenis_kelamin: document.getElementById('edit-jk').value,
                nama_ayah:     document.getElementById('edit-nama-ayah').value.trim(),
                no_hp_wali:    document.getElementById('edit-hp').value.trim(),
                status:        document.getElementById('edit-status').value,
                updated_at:    new Date().toISOString(),
                updated_by:    (window.currentUser && window.currentUser.email) || 'admin'
            };
            
            // ===== VALIDASI =====
            if (!data.nama_santri) {
                Swal.showValidationMessage('❌ Nama lengkap wajib diisi');
                return false;
            }
            if (data.nama_santri.length < 3) {
                Swal.showValidationMessage('❌ Nama minimal 3 karakter');
                return false;
            }
            if (!data.unit) {
                Swal.showValidationMessage('❌ Unit wajib dipilih');
                return false;
            }
            if (!data.jenis_kelamin) {
                Swal.showValidationMessage('❌ Jenis kelamin wajib dipilih');
                return false;
            }
            if (!data.no_hp_wali) {
                Swal.showValidationMessage('❌ No. HP wajib diisi');
                return false;
            }
            if (!/^(08|628|\+628)\d{7,12}$/.test(data.no_hp_wali.replace(/\s|-/g, ''))) {
                Swal.showValidationMessage('❌ Format HP tidak valid (08xx / 628xx)');
                return false;
            }
            if (!data.status) {
                Swal.showValidationMessage('❌ Status wajib dipilih');
                return false;
            }
            
            return data;
        }
    });
    
    if (!formData) return;
    
    // ===== KONFIRMASI =====
    const konfirmasi = await Swal.fire({
        title: 'Simpan Perubahan?',
        html: `
            <p>Data <b>${esc(formData.nama_santri)}</b> akan diperbarui.</p>
            <p style="color:#6b7280; font-size:0.85rem; margin-top:10px;">
                Pastikan data sudah benar sebelum menyimpan.
            </p>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-check"></i> Ya, Simpan',
        cancelButtonText:  '<i class="fas fa-times"></i> Batal',
        confirmButtonColor: '#1a5d1a',
        cancelButtonColor:  '#6b7280',
        customClass: { popup: 'premium-popup', title: 'premium-title' }
    });
    
    if (!konfirmasi.isConfirmed) return;
    
    // ===== LOADING =====
    Swal.fire({
        title: 'Menyimpan...',
        html: '<i class="fas fa-spinner fa-spin fa-2x" style="color:#1a5d1a;"></i><p style="margin-top:15px;">Mohon tunggu</p>',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        customClass: { popup: 'premium-popup' }
    });
    
    try {
        // ===== UPDATE FIRESTORE =====
        const docRef = window.firebaseDoc(window.firebaseDB, 'santri', id);
        await window.firebaseUpdateDoc(docRef, formData);
        
        // Update cache lokal
        window.dataSantriCache[id] = { ...window.dataSantriCache[id], ...formData };
        
        // Refresh tabel
        if (typeof window.muatDataSantri === 'function') {
            window.muatDataSantri();
        } else if (typeof renderTabelSantri === 'function') {
            renderTabelSantri();
        }
        
        // ===== SUKSES =====
        await Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            html: `Data <b>${esc(formData.nama_santri)}</b> telah diperbarui.`,
            confirmButtonColor: '#1a5d1a',
            timer: 2500,
            timerProgressBar: true,
            customClass: { popup: 'premium-popup', title: 'premium-title' }
        });
        
    } catch (error) {
        console.error('❌ Error update santri:', error);
        Swal.fire({
            icon: 'error',
            title: 'Gagal Menyimpan',
            html: `
                <p>Terjadi kesalahan saat menyimpan data.</p>
                <p style="color:#dc2626; font-size:0.85rem; margin-top:10px;">
                    <b>Detail:</b> ${esc(error.message)}
                </p>
            `,
            confirmButtonColor: '#dc2626',
            customClass: { popup: 'premium-popup', title: 'premium-title' }
        });
    }
}

// Expose ke global
window.editSantri = editSantri;
async function ubahStatus(id) {
    const d = window.dataSantriCache[id];
    if (!d) return;

    const { value: newStatus } = await Swal.fire({
        title: 'Ubah Status Santri',
        html: `<p><b>${d.nama_santri}</b></p><p style="color:#6b7280; font-size:0.85rem;">Status saat ini: <b>${d.status_santri || 'Aktif'}</b></p>`,
        input: 'select',
        inputOptions: {
            'Aktif': '✅ Aktif',
            'Nonaktif': '⏸️ Nonaktif',
            'Alumni': '🎓 Alumni',
            'Pindah': '🔄 Pindah'
        },
        inputPlaceholder: 'Pilih status baru',
        showCancelButton: true,
        confirmButtonText: 'Simpan',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#1a5d1a'
    });

    if (!newStatus) return;

    try {
        await window.firebaseUpdateDoc(
            window.firebaseDoc(window.db, "pendaftaran_santri", id),
            { status_santri: newStatus }
        );
        Swal.fire('Berhasil!', `Status diubah menjadi <b>${newStatus}</b>`, 'success');
        muatDataSantri();
    } catch (err) {
        Swal.fire('Gagal', err.message, 'error');
    }
}

async function hapusSantri(id) {
    const d = window.dataSantriCache[id];
    if (!d) return;

    const confirm = await Swal.fire({
        title: 'Hapus Santri?',
        html: `Anda akan menghapus data <b>${d.nama_santri}</b>.<br>Tindakan ini tidak bisa dibatalkan!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#dc2626'
    });

    if (!confirm.isConfirmed) return;

    try {
        await window.firebaseDeleteDoc(
            window.firebaseDoc(window.db, "pendaftaran_santri", id)
        );
        Swal.fire('Terhapus!', 'Data santri berhasil dihapus', 'success');
        muatDataSantri();
    } catch (err) {
        Swal.fire('Gagal', err.message, 'error');
    }
}

function tambahSantri() {
    Swal.fire({
        title: '➕ Tambah Santri Manual',
        html: `
            <p>Untuk menambah santri baru, silakan pakai form pendaftaran.</p>
            <a href="pendaftaran.html" style="color:#1a5d1a; font-weight:700;">→ Buka Form Pendaftaran</a>
        `,
        icon: 'info',
        confirmButtonColor: '#1a5d1a'
    });
}

function tambahSantri() {
    Swal.fire({
        title: '<i class="fas fa-user-plus"></i> Tambah Santri Manual',
        html: `
            <div class="swal-tambah-content">
                <p class="swal-tambah-desc">
                    Untuk menambahkan santri baru, silakan gunakan 
                    <b>form pendaftaran resmi</b>.
                </p>
                
                <a href="pendaftaran.html" class="btn-buka-form-swal">
                    <i class="fas fa-external-link-alt"></i>
                    <span>Buka Form Pendaftaran</span>
                </a>
                
                <p class="swal-tambah-note">
                    <i class="fas fa-info-circle"></i>
                    Data akan otomatis masuk ke database
                </p>
            </div>
        `,
        icon: 'info',
        showConfirmButton: true,
        confirmButtonText: '<i class="fas fa-times"></i> Tutup',
        confirmButtonColor: '#6b7280',
        customClass: {
            popup: 'swal-tambah-popup',
            confirmButton: 'swal-btn-tutup'
        }
    });
}

// ================================================================
// 🎓 NAIK KELAS MASSAL
// ================================================================
async function naikKelasMassal() {
    console.log("🎓 Memulai naik kelas massal");
    
    // Cek SwalPremium tersedia
    if (typeof SwalPremium === 'undefined') {
        alert("SwalPremium belum ter-load!");
        return;
    }
    
    // 1. Konfirmasi
    const konf = await SwalPremium.confirm({
        title: "Naik Kelas Massal?",
        text: "Semua santri akan naik ke tingkat berikutnya. Yakin ingin melanjutkan?",
        confirmText: "Ya, Naikkan Semua",
        cancelText: "Batal",
        color: "warning"
    });
    
    if (!konf.isConfirmed) return;
    
    // 2. Loading
    SwalPremium.loading({
        title: "Memproses...",
        text: "Sedang menaikkan kelas semua santri"
    });
    
    try {
        // Import functions
        const { collection, getDocs, doc, writeBatch } 
            = await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js");
        
        // 3. Ambil semua santri
        const snap = await getDocs(collection(db, "santri"));
        
        if (snap.empty) {
            SwalPremium.close();
            SwalPremium.warning({
                title: "Data Kosong",
                text: "Tidak ada santri untuk dinaikkan."
            });
            return;
        }
        
        // 4. Batch update
        const batch = writeBatch(db);
        let counter = 0;
        let skipped = 0;
        
        snap.forEach(docSnap => {
            const data = docSnap.data();
            const kelasSekarang = parseInt(data.kelas || 0);
            
            // Aturan: kelas max 12 (SMA)
            if (kelasSekarang >= 12) {
                skipped++;
                return;
            }
            
            batch.update(doc(db, "santri", docSnap.id), {
                kelas: kelasSekarang + 1,
                tahun_naik: new Date().getFullYear(),
                updated_at: new Date()
            });
            counter++;
        });
        
        await batch.commit();
        
        // 5. Success
        SwalPremium.close();
        await SwalPremium.success({
            title: "Berhasil! 🎉",
            text: `${counter} santri dinaikkan, ${skipped} sudah maksimal.`
        });
        
        // 6. Reload
        if (typeof muatDataSantri === 'function') {
            await muatDataSantri();
        }
        
    } catch (err) {
        console.error("❌ Error:", err);
        SwalPremium.close();
        SwalPremium.error({
            title: "Gagal Memproses",
            text: err.message
        });
    }
}


/* ========== EXPOSE ========== */
window.muatDataSantri = muatDataSantri;
window.filterSantri = filterSantri;
window.filterByStatus = filterByStatus;
window.filterByUnit = filterByUnit;
window.editSantri = editSantri;
window.ubahStatus = ubahStatus;
window.hapusSantri = hapusSantri;
window.tambahSantri = tambahSantri;
window.naikKelasMassal = naikKelasMassal;  // ✅ Sekarang tidak error 

// ================================================================
// 🚪 HANDLE TOMBOL LOGOUT ADMIN
// ================================================================
document.addEventListener("DOMContentLoaded", () => {
    
    const btnLogout = document.getElementById("btnLogout");
    
    if (!btnLogout) {
        console.error("❌ Tombol #btnLogout tidak ditemukan!");
        return;
    }
    
    console.log("✅ Tombol logout siap digunakan");
    
    btnLogout.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log("🖱️ Tombol logout diklik");
        
        // Pastikan SwalPremium sudah ter-load
        if (typeof SwalPremium === "undefined") {
            console.error("❌ SwalPremium belum ter-load!");
            
            // Fallback logout biasa
            if (confirm("Yakin ingin logout?")) {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = "login.html";
            }
            return;
        }
        
        // Panggil SwalPremium.logout()
        SwalPremium.logout({
            redirectUrl: "login.html",
            
            // Custom action logout (Firebase)
            onConfirm: async () => {
                try {
                    // Kalau pakai Firebase Auth
                    if (typeof firebase !== "undefined" && firebase.auth) {
                        await firebase.auth().signOut();
                    }
                    
                    // Atau kalau pakai module Firebase v9+
                    // import { getAuth, signOut } from "..."
                    // await signOut(getAuth());
                    
                    // Clear storage
                    localStorage.clear();
                    sessionStorage.clear();
                    
                    // Redirect
                    window.location.replace("login.html");
                    
                } catch (error) {
                    console.error("❌ Error saat logout:", error);
                    SwalPremium.error({
                        title: "Gagal Logout",
                        text: "Terjadi kesalahan saat logout",
                        detail: error.message
                    });
                }
            }
        });
    });
});
