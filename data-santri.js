/* ================================================================
   DATA SANTRI AKTIF — JS FINAL v3.0
   Daarul Khoirot Almadani
================================================================ */

window.dataSantriCache = {};
let filterState = { keyword: '', status: '', unit: '' };


/* ================================================================
   UTILITY
================================================================ */
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

function escapeHTML(v) {
    return String(v ?? '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// Force cleanup SweetAlert kalau stuck
function forceCloseSwal() {
    try {
        Swal.close();
    } catch(e) {}
    document.body.classList.remove('swal2-shown', 'swal2-height-auto', 'swal2-toast-shown');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    const container = document.querySelector('.swal2-container');
    if (container) container.remove();
}

// Emergency: tekan ESC untuk force close kalau stuck
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.querySelector('.swal2-container')) {
        setTimeout(() => {
            if (document.querySelector('.swal2-container')) {
                console.log('🚨 ESC emergency close');
                forceCloseSwal();
            }
        }, 300);
    }
});


/* ================================================================
   MUAT DATA SANTRI
================================================================ */
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

        // Sort berdasarkan id_santri
        const dataArray = [];
        snap.forEach(docSnap => {
            dataArray.push({ id: docSnap.id, data: docSnap.data() });
        });

        dataArray.sort((a, b) => {
            const idA = a.data.id_santri || '';
            const idB = b.data.id_santri || '';
            return String(idA).localeCompare(String(idB), undefined, { numeric: true });
        });

        // Render
        dataArray.forEach(item => {
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
        console.error("❌ Error load:", err);
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align:center; color:#dc2626; padding:30px;">
                    Gagal memuat: ${err.message}
                </td>
            </tr>
        `;
    }
}


/* ================================================================
   FILTER
================================================================ */
function filterSantri(kw)  { filterState.keyword = kw.toLowerCase().trim(); applyFilter(); }
function filterByStatus(s) { filterState.status  = s.toLowerCase().trim(); applyFilter(); }
function filterByUnit(u)   { filterState.unit    = u.toLowerCase().trim(); applyFilter(); }

function applyFilter() {
    document.querySelectorAll('#dsTableBody tr[data-searchable]').forEach(row => {
        const matchKw = !filterState.keyword || row.dataset.searchable.includes(filterState.keyword);
        const matchSt = !filterState.status  || row.dataset.status === filterState.status;
        const matchUn = !filterState.unit    || row.dataset.unit.includes(filterState.unit);
        row.style.display = (matchKw && matchSt && matchUn) ? '' : 'none';
    });
}


/* ================================================================
   EDIT SANTRI — v3.0 Ultra-Safe (Anti Stuck)
================================================================ */
async function editSantri(id) {
    const d = window.dataSantriCache[id];
    if (!d) {
        Swal.fire({
            icon: 'error',
            title: 'Data Tidak Ditemukan',
            text: 'Silakan refresh halaman dan coba lagi.',
            confirmButtonColor: '#1a5d1a'
        });
        return;
    }
    
    const esc = escapeHTML;
    const sel = (val, current) => String(val) === String(current) ? 'selected' : '';
    
    // Format tanggal
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
    const currentUnit   = d.tingkat_unit || '';
    const currentJK     = d.jenis_kelamin || '';
    const currentStatus = d.status_santri || 'Aktif';
    const currentHP     = d.hp_ayah || d.hp_ibu || d.no_hp_wali || '';
    
    // ===== MODAL EDIT =====
    let formData;
    try {
        const result = await Swal.fire({
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
                               value="${esc(d.nama_santri || '')}" 
                               placeholder="Nama sesuai akta" required>
                    </div>
                    
                    <!-- Unit + Kelas (Grid 2 kolom) -->
                    <div class="edit-grid-2">
                        <div class="edit-field form-group">
                            <label><i class="fas fa-school"></i> Unit <span class="req">*</span></label>
                            <select id="edit-unit" 
                                    name="tingkat_unit"
                                    data-cd="true" 
                                    data-cd-main-icon="fas fa-school"
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
                                   placeholder="7A">
                        </div>
                    </div>
                    
                    <!-- Jenis Kelamin -->
                    <div class="edit-field form-group">
                        <label><i class="fas fa-venus-mars"></i> Jenis Kelamin <span class="req">*</span></label>
                        <select id="edit-jk" 
                                name="jenis_kelamin"
                                data-cd="true"
                                data-cd-main-icon="fas fa-venus-mars"
                                data-cd-placeholder="-- Pilih --"
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
                    
                    <!-- HP -->
                    <div class="edit-field form-group">
                        <label><i class="fas fa-phone"></i> HP Ayah / Ibu <span class="req">*</span></label>
                        <input type="tel" id="edit-hp" 
                               value="${esc(currentHP)}" 
                               placeholder="cth: 08123456789" required>
                        <small>
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
            allowOutsideClick: true,    // ⭐ Boleh klik luar (anti stuck)
            allowEscapeKey: true,        // ⭐ Boleh ESC (anti stuck)
            reverseButtons: false,
            customClass: {
                popup: 'premium-popup edit-santri-popup',
                title: 'premium-title',
                confirmButton: 'premium-button',
                cancelButton:  'premium-button'
            },
            
            // ⭐ INIT CUSTOM DROPDOWN
            didOpen: () => {
                setTimeout(() => {
                    try {
                        const popup = Swal.getPopup();
                        if (!popup) return;
                        
                        const selects = popup.querySelectorAll('select[data-cd="true"]');
                        console.log(`📋 Select ditemukan: ${selects.length}`);
                        
                        if (typeof CustomDropdown === 'undefined') {
                            console.warn('⚠️ CustomDropdown tidak tersedia, pakai native select');
                            selects.forEach(s => {
                                s.style.cssText = `
                                    display: block !important;
                                    width: 100% !important;
                                    padding: 12px 16px !important;
                                    border: 2px solid #1a5d1a !important;
                                    border-radius: 10px !important;
                                    font-family: Quicksand, sans-serif !important;
                                    font-size: 0.9rem !important;
                                    background: #fff !important;
                                    min-height: 46px !important;
                                `;
                            });
                            return;
                        }
                        
                        // Cleanup wrapper existing
                        popup.querySelectorAll('.cd-wrapper').forEach(w => {
                            const innerSelect = w.querySelector('select[data-cd="true"]');
                            if (innerSelect) {
                                w.parentNode.insertBefore(innerSelect, w);
                                delete innerSelect.dataset.cdInit;
                                innerSelect.classList.remove('cd-native');
                                innerSelect.removeAttribute('style');
                            }
                            w.remove();
                        });
                        
                        // Auto-assign icon
                        if (typeof autoAssignDropdownIcons === 'function') {
                            autoAssignDropdownIcons();
                        }
                        
                        // Create dropdown
                        selects.forEach(s => {
                            try {
                                if (!s.dataset.cdInit) {
                                    CustomDropdown.create(s);
                                    console.log(`✅ Created: ${s.id}`);
                                }
                            } catch (err) {
                                console.error(`❌ Error create ${s.id}:`, err);
                            }
                        });
                        
                    } catch (err) {
                        console.error('❌ didOpen error:', err);
                    }
                }, 150);
            },
            
            // ⭐ VALIDASI ULTRA-SAFE (anti crash)
            preConfirm: () => {
                try {
                    const getVal = (id) => {
                        const el = document.getElementById(id);
                        if (!el) {
                            console.warn(`⚠️ Element #${id} tidak ditemukan`);
                            return '';
                        }
                        return (el.value || '').trim();
                    };
                    
                    const data = {
                        nama_santri:   getVal('edit-nama'),
                        tingkat_unit:  getVal('edit-unit'),
                        kelas:         getVal('edit-kelas'),
                        jenis_kelamin: getVal('edit-jk'),
                        nama_ayah:     getVal('edit-nama-ayah'),
                        hp_ayah:       getVal('edit-hp'),
                        status_santri: getVal('edit-status'),
                        updated_at:    new Date().toISOString(),
                        updated_by:    (window.currentUser && window.currentUser.email) || 'admin'
                    };
                    
                    console.log('📤 Data yang akan disimpan:', data);
                    
                    // Validasi
                    if (!data.nama_santri) {
                        Swal.showValidationMessage('❌ Nama lengkap wajib diisi');
                        return false;
                    }
                    if (data.nama_santri.length < 3) {
                        Swal.showValidationMessage('❌ Nama minimal 3 karakter');
                        return false;
                    }
                    if (!data.tingkat_unit) {
                        Swal.showValidationMessage('❌ Unit wajib dipilih');
                        return false;
                    }
                    if (!data.jenis_kelamin) {
                        Swal.showValidationMessage('❌ Jenis kelamin wajib dipilih');
                        return false;
                    }
                    if (!data.hp_ayah) {
                        Swal.showValidationMessage('❌ No. HP wajib diisi');
                        return false;
                    }
                    
                    const hpClean = data.hp_ayah.replace(/[\s\-\+]/g, '');
                    if (!/^(08|628)\d{7,12}$/.test(hpClean)) {
                        Swal.showValidationMessage('❌ Format HP salah (08xx atau 628xx)');
                        return false;
                    }
                    
                    if (!data.status_santri) {
                        Swal.showValidationMessage('❌ Status wajib dipilih');
                        return false;
                    }
                    
                    return data;
                    
                } catch (err) {
                    console.error('❌ preConfirm error:', err);
                    Swal.showValidationMessage('❌ Error: ' + err.message);
                    return false;
                }
            }
        });
        
        formData = result.value;
        
    } catch (err) {
        console.error('❌ Modal error:', err);
        forceCloseSwal();
        return;
    }
    
    // Kalau user batal / gagal validasi
    if (!formData) {
        console.log('ℹ️ User batal edit atau gagal validasi');
        return;
    }
    
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
        allowOutsideClick: true,
        allowEscapeKey: true,
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
    
    // ===== UPDATE FIRESTORE =====
    try {
        const docRef = window.firebaseDoc(window.db, 'pendaftaran_santri', id);
        await window.firebaseUpdateDoc(docRef, formData);
        
        // Update cache
        window.dataSantriCache[id] = { ...window.dataSantriCache[id], ...formData };
        
        // Refresh tabel
        if (typeof window.muatDataSantri === 'function') {
            window.muatDataSantri();
        }
        
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


/* ================================================================
   UBAH STATUS SANTRI (Quick Change)
================================================================ */
async function ubahStatus(id) {
    const d = window.dataSantriCache[id];
    if (!d) return;

    const esc = escapeHTML;
    const currentStatus = d.status_santri || 'Aktif';
    const sel = (val) => val === currentStatus ? 'selected' : '';

    try {
        const { value: newStatus } = await Swal.fire({
            title: '<i class="fas fa-user-cog"></i> Ubah Status Santri',
            html: `
                <div style="text-align:left; padding:10px 5px;">
                    <p style="margin-bottom:15px;">
                        Santri: <b style="color:#1a5d1a;">${esc(d.nama_santri)}</b><br>
                        Status saat ini: <b>${esc(currentStatus)}</b>
                    </p>
                    <div class="edit-field form-group">
                        <label style="font-weight:700; color:#1a5d1a; margin-bottom:6px; display:block;">
                            <i class="fas fa-exchange-alt"></i> Status Baru
                        </label>
                        <select id="status-baru" 
                                name="status_santri"
                                data-cd="true"
                                data-cd-main-icon="fas fa-check-circle"
                                required>
                            <option value="Aktif"    ${sel('Aktif')}>🟢 Aktif</option>
                            <option value="Nonaktif" ${sel('Nonaktif')}>⚪ Nonaktif</option>
                            <option value="Alumni"   ${sel('Alumni')}>🎓 Alumni</option>
                            <option value="Pindah"   ${sel('Pindah')}>↪️ Pindah</option>
                        </select>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: '<i class="fas fa-save"></i> Simpan',
            cancelButtonText:  '<i class="fas fa-times"></i> Batal',
            confirmButtonColor: '#1a5d1a',
            cancelButtonColor:  '#6b7280',
            allowOutsideClick: true,
            allowEscapeKey: true,
            customClass: { popup: 'premium-popup edit-santri-popup', title: 'premium-title' },
            didOpen: () => {
                setTimeout(() => {
                    if (typeof CustomDropdown !== 'undefined') {
                        const s = document.getElementById('status-baru');
                        if (s && !s.dataset.cdInit) CustomDropdown.create(s);
                    }
                }, 150);
            },
            preConfirm: () => {
                try {
                    const el = document.getElementById('status-baru');
                    const val = el ? el.value : '';
                    if (!val) { Swal.showValidationMessage('❌ Status wajib dipilih'); return false; }
                    return val;
                } catch (err) {
                    Swal.showValidationMessage('❌ Error: ' + err.message);
                    return false;
                }
            }
        });

        if (!newStatus) return;

        // Update Firestore
        await window.firebaseUpdateDoc(
            window.firebaseDoc(window.db, "pendaftaran_santri", id),
            { 
                status_santri: newStatus,
                updated_at: new Date().toISOString()
            }
        );
        
        Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            html: `Status <b>${esc(d.nama_santri)}</b> diubah menjadi <b>${esc(newStatus)}</b>`,
            confirmButtonColor: '#1a5d1a',
            timer: 2000,
            timerProgressBar: true
        });
        
        muatDataSantri();
        
    } catch (err) {
        console.error('❌ Error ubah status:', err);
        forceCloseSwal();
        Swal.fire('Gagal', err.message, 'error');
    }
}


/* ================================================================
   HAPUS SANTRI
================================================================ */
async function hapusSantri(id) {
    const d = window.dataSantriCache[id];
    if (!d) return;

    const esc = escapeHTML;

    const confirm = await Swal.fire({
        title: 'Hapus Santri?',
        html: `
            <p>Anda akan menghapus data <b>${esc(d.nama_santri)}</b>.</p>
            <p style="color:#dc2626; font-weight:700; margin-top:10px;">
                ⚠️ Tindakan ini tidak bisa dibatalkan!
            </p>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-trash"></i> Ya, Hapus',
        cancelButtonText:  '<i class="fas fa-times"></i> Batal',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        allowOutsideClick: true,
        allowEscapeKey: true
    });

    if (!confirm.isConfirmed) return;

    try {
        await window.firebaseDeleteDoc(
            window.firebaseDoc(window.db, "pendaftaran_santri", id)
        );
        Swal.fire({
            icon: 'success',
            title: 'Terhapus!',
            text: 'Data santri berhasil dihapus',
            confirmButtonColor: '#1a5d1a',
            timer: 2000,
            timerProgressBar: true
        });
        muatDataSantri();
    } catch (err) {
        console.error('❌ Error hapus:', err);
        Swal.fire('Gagal', err.message, 'error');
    }
}


/* ================================================================
   TAMBAH SANTRI (Redirect ke form pendaftaran)
================================================================ */
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
        allowOutsideClick: true,
        allowEscapeKey: true,
        customClass: {
            popup: 'swal-tambah-popup',
            confirmButton: 'swal-btn-tutup'
        }
    });
}


/* ================================================================
   NAIK KELAS MASSAL
================================================================ */
async function naikKelasMassal() {
    console.log("🎓 Memulai naik kelas massal");
    
    const konf = await Swal.fire({
        title: '<i class="fas fa-arrow-up"></i> Naik Kelas Massal?',
        html: `
            <p>Semua santri akan naik ke tingkat berikutnya.</p>
            <p style="color:#f59e0b; font-weight:700; margin-top:10px;">
                ⚠️ Yakin ingin melanjutkan?
            </p>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-check"></i> Ya, Naikkan Semua',
        cancelButtonText:  '<i class="fas fa-times"></i> Batal',
        confirmButtonColor: '#f59e0b',
        cancelButtonColor: '#6b7280',
        allowOutsideClick: true,
        allowEscapeKey: true
    });
    
    if (!konf.isConfirmed) return;
    
    Swal.fire({
        title: 'Memproses...',
        html: '<i class="fas fa-spinner fa-spin fa-2x" style="color:#1a5d1a;"></i>',
        allowOutsideClick: false,
        showConfirmButton: false
    });
    
    try {
        const { collection, getDocs, doc, writeBatch } 
            = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");
        
        const snap = await getDocs(collection(window.db, "pendaftaran_santri"));
        
        if (snap.empty) {
            Swal.fire({ icon: 'warning', title: 'Data Kosong', text: 'Tidak ada santri untuk dinaikkan.' });
            return;
        }
        
        const batch = writeBatch(window.db);
        let counter = 0, skipped = 0;
        
        // Mapping kenaikan unit
        const naikMap = {
            'TPQ - Tingkat 1':    'TPQ - Tingkat 2',
            'TPQ - Tingkat 2':    'MDT - Tingkat 1',
            'MDT - Tingkat 1':    'MDT - Tingkat 2',
            'MDT - Tingkat 2':    'MDT - Tingkat 3',
            'MDT - Tingkat 3':    'MDT - Tingkat 4',
            'MDT - Tingkat 4':    'Pesantren Tahun 1',
            'Pesantren Tahun 1':  'Pesantren Tahun 2',
            'Pesantren Tahun 2':  'Pesantren Tahun 3',
            'Pesantren Tahun 3':  null  // Lulus
        };
        
        snap.forEach(docSnap => {
            const data = docSnap.data();
            const unitSekarang = data.tingkat_unit;
            const status = data.status_santri || 'Aktif';
            
            // Skip yang bukan aktif
            if (status !== 'Aktif') { skipped++; return; }
            
            const unitBaru = naikMap[unitSekarang];
            
            if (unitBaru === null) {
                // Lulus jadi Alumni
                batch.update(doc(window.db, "pendaftaran_santri", docSnap.id), {
                    status_santri: 'Alumni',
                    tahun_lulus: new Date().getFullYear(),
                    updated_at: new Date().toISOString()
                });
                counter++;
            } else if (unitBaru) {
                batch.update(doc(window.db, "pendaftaran_santri", docSnap.id), {
                    tingkat_unit: unitBaru,
                    tahun_naik: new Date().getFullYear(),
                    updated_at: new Date().toISOString()
                });
                counter++;
            } else {
                skipped++;
            }
        });
        
        await batch.commit();
        
        await Swal.fire({
            icon: 'success',
            title: 'Berhasil! 🎉',
            html: `
                <p><b>${counter}</b> santri berhasil dinaikkan.</p>
                <p style="color:#6b7280;"><b>${skipped}</b> santri dilewati (nonaktif).</p>
            `,
            confirmButtonColor: '#1a5d1a'
        });
        
        muatDataSantri();
        
    } catch (err) {
        console.error("❌ Error naik kelas:", err);
        Swal.fire({
            icon: 'error',
            title: 'Gagal Memproses',
            text: err.message,
            confirmButtonColor: '#dc2626'
        });
    }
}


/* ================================================================
   EXPOSE KE GLOBAL
================================================================ */
window.muatDataSantri  = muatDataSantri;
window.filterSantri    = filterSantri;
window.filterByStatus  = filterByStatus;
window.filterByUnit    = filterByUnit;
window.editSantri      = editSantri;
window.ubahStatus      = ubahStatus;
window.hapusSantri     = hapusSantri;
window.tambahSantri    = tambahSantri;
window.naikKelasMassal = naikKelasMassal;
window.forceCloseSwal  = forceCloseSwal;


/* ================================================================
   HANDLE LOGOUT ADMIN
================================================================ */
document.addEventListener("DOMContentLoaded", () => {
    const btnLogout = document.getElementById("btnLogout");
    if (!btnLogout) return;
    
    console.log("✅ Tombol logout siap");
    
    btnLogout.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Kalau ada SwalPremium, pakai itu
        if (typeof SwalPremium !== "undefined" && SwalPremium.logout) {
            SwalPremium.logout({
                redirectUrl: "login.html",
                onConfirm: async () => {
                    try {
                        if (typeof firebase !== "undefined" && firebase.auth) {
                            await firebase.auth().signOut();
                        }
                        localStorage.clear();
                        sessionStorage.clear();
                        window.location.replace("login.html");
                    } catch (error) {
                        console.error("❌ Error logout:", error);
                    }
                }
            });
            return;
        }
        
        // Fallback: Swal biasa
        Swal.fire({
            title: 'Yakin logout?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya, Logout',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            allowOutsideClick: true,
            allowEscapeKey: true
        }).then(result => {
            if (result.isConfirmed) {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = "login.html";
            }
        });
    });
});