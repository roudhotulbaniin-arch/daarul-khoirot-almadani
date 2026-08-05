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

/* ==========================================================================
   EDIT SANTRI — Fungsi Lengkap
   ========================================================================== */

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

    // Helper untuk escape HTML (mencegah XSS)
    const esc = (v) => {
        if (v === null || v === undefined) return '';
        return String(v)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    };

    // Helper untuk generate opsi <option>
    const opt = (value, label, selected) => `
        <option value="${esc(value)}" ${selected == value ? 'selected' : ''}>${esc(label)}</option>
    `;

    const { value: formData } = await Swal.fire({
        title: `<i class="fas fa-user-edit"></i> Edit Data Santri`,
        width: 800,
        html: `
            <div class="edit-santri-form">

                <!-- ===== DATA PRIBADI ===== -->
                <div class="edit-section">
                    <h4><i class="fas fa-id-card"></i> Data Pribadi</h4>
                    <div class="edit-grid">
                        <div class="edit-field">
                            <label>Nama Lengkap <span class="req">*</span></label>
                            <input type="text" id="edit-nama" value="${esc(d.nama_santri)}" required>
                        </div>
                        <div class="edit-field">
                            <label>NIK (16 digit) <span class="req">*</span></label>
                            <input type="text" id="edit-nik" value="${esc(d.nik)}" maxlength="16" pattern="[0-9]{16}" required>
                        </div>
                        <div class="edit-field">
                            <label>NISN</label>
                            <input type="text" id="edit-nisn" value="${esc(d.nisn)}" maxlength="10">
                        </div>
                        <div class="edit-field">
                            <label>Jenis Kelamin <span class="req">*</span></label>
                            <select id="edit-jk" required>
                                ${opt('Laki-laki',  'Laki-laki',  d.jenis_kelamin)}
                                ${opt('Perempuan', 'Perempuan', d.jenis_kelamin)}
                            </select>
                        </div>
                        <div class="edit-field">
                            <label>Tempat Lahir</label>
                            <input type="text" id="edit-tempat-lahir" value="${esc(d.tempat_lahir)}">
                        </div>
                        <div class="edit-field">
                            <label>Tanggal Lahir</label>
                            <input type="date" id="edit-tgl-lahir" value="${esc(d.tanggal_lahir)}">
                        </div>
                    </div>
                </div>

                <!-- ===== KONTAK & ALAMAT ===== -->
                <div class="edit-section">
                    <h4><i class="fas fa-map-marker-alt"></i> Kontak & Alamat</h4>
                    <div class="edit-grid">
                        <div class="edit-field">
                            <label>No. HP</label>
                            <input type="tel" id="edit-hp" value="${esc(d.no_hp)}">
                        </div>
                        <div class="edit-field">
                            <label>Email</label>
                            <input type="email" id="edit-email" value="${esc(d.email)}">
                        </div>
                        <div class="edit-field full">
                            <label>Alamat Lengkap</label>
                            <textarea id="edit-alamat" rows="2">${esc(d.alamat)}</textarea>
                        </div>
                        <div class="edit-field">
                            <label>Desa/Kelurahan</label>
                            <input type="text" id="edit-desa" value="${esc(d.desa)}">
                        </div>
                        <div class="edit-field">
                            <label>Kecamatan</label>
                            <input type="text" id="edit-kecamatan" value="${esc(d.kecamatan)}">
                        </div>
                        <div class="edit-field">
                            <label>Kabupaten/Kota</label>
                            <input type="text" id="edit-kabupaten" value="${esc(d.kabupaten)}">
                        </div>
                        <div class="edit-field">
                            <label>Provinsi</label>
                            <input type="text" id="edit-provinsi" value="${esc(d.provinsi)}">
                        </div>
                    </div>
                </div>

                <!-- ===== DATA ORANG TUA / WALI ===== -->
                <div class="edit-section">
                    <h4><i class="fas fa-users"></i> Data Orang Tua / Wali</h4>
                    <div class="edit-grid">
                        <div class="edit-field">
                            <label>Nama Ayah</label>
                            <input type="text" id="edit-nama-ayah" value="${esc(d.nama_ayah)}">
                        </div>
                        <div class="edit-field">
                            <label>Pekerjaan Ayah</label>
                            <input type="text" id="edit-pekerjaan-ayah" value="${esc(d.pekerjaan_ayah)}">
                        </div>
                        <div class="edit-field">
                            <label>Nama Ibu</label>
                            <input type="text" id="edit-nama-ibu" value="${esc(d.nama_ibu)}">
                        </div>
                        <div class="edit-field">
                            <label>Pekerjaan Ibu</label>
                            <input type="text" id="edit-pekerjaan-ibu" value="${esc(d.pekerjaan_ibu)}">
                        </div>
                        <div class="edit-field">
                            <label>No. HP Wali <span class="req">*</span></label>
                            <input type="tel" id="edit-hp-wali" value="${esc(d.no_hp_wali)}" required>
                        </div>
                        <div class="edit-field">
                            <label>Biaya Sekolah Oleh</label>
                            <select id="edit-biaya">
                                ${opt('',            '-- Pilih --',    d.biaya_sekolah)}
                                ${opt('Ayah',        'Ayah',           d.biaya_sekolah)}
                                ${opt('Ibu',         'Ibu',            d.biaya_sekolah)}
                                ${opt('Ayah & Ibu',  'Ayah & Ibu',     d.biaya_sekolah)}
                                ${opt('Wali',        'Wali',           d.biaya_sekolah)}
                                ${opt('Beasiswa',    'Beasiswa',       d.biaya_sekolah)}
                            </select>
                        </div>
                    </div>
                </div>

                <!-- ===== DATA PENDIDIKAN ===== -->
                <div class="edit-section">
                    <h4><i class="fas fa-graduation-cap"></i> Data Pendidikan</h4>
                    <div class="edit-grid">
                        <div class="edit-field">
                            <label>Jenjang</label>
                            <select id="edit-jenjang">
                                ${opt('',      '-- Pilih --', d.jenjang)}
                                ${opt('MI',    'MI',          d.jenjang)}
                                ${opt('MTs',   'MTs',         d.jenjang)}
                                ${opt('MA',    'MA',          d.jenjang)}
                                ${opt('SMK',   'SMK',         d.jenjang)}
                            </select>
                        </div>
                        <div class="edit-field">
                            <label>Kelas</label>
                            <input type="text" id="edit-kelas" value="${esc(d.kelas)}">
                        </div>
                        <div class="edit-field">
                            <label>Asal Sekolah</label>
                            <input type="text" id="edit-asal-sekolah" value="${esc(d.asal_sekolah)}">
                        </div>
                        <div class="edit-field">
                            <label>Status Pendaftaran</label>
                            <select id="edit-status">
                                ${opt('Pending',   'Pending',   d.status)}
                                ${opt('Diterima',  'Diterima',  d.status)}
                                ${opt('Ditolak',   'Ditolak',   d.status)}
                                ${opt('Aktif',     'Aktif',     d.status)}
                                ${opt('Nonaktif',  'Nonaktif',  d.status)}
                                ${opt('Lulus',     'Lulus',     d.status)}
                            </select>
                        </div>
                    </div>
                </div>

                <!-- ===== CATATAN ADMIN ===== -->
                <div class="edit-section">
                    <h4><i class="fas fa-sticky-note"></i> Catatan Admin</h4>
                    <div class="edit-field full">
                        <textarea id="edit-catatan" rows="3" placeholder="Catatan khusus untuk santri ini...">${esc(d.catatan_admin)}</textarea>
                    </div>
                </div>

            </div>
        `,
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-save"></i> Simpan Perubahan',
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
        preConfirm: () => {
            // Ambil semua nilai
            const data = {
                nama_santri:      document.getElementById('edit-nama').value.trim(),
                nik:              document.getElementById('edit-nik').value.trim(),
                nisn:             document.getElementById('edit-nisn').value.trim(),
                jenis_kelamin:    document.getElementById('edit-jk').value,
                tempat_lahir:     document.getElementById('edit-tempat-lahir').value.trim(),
                tanggal_lahir:    document.getElementById('edit-tgl-lahir').value,
                no_hp:            document.getElementById('edit-hp').value.trim(),
                email:            document.getElementById('edit-email').value.trim(),
                alamat:           document.getElementById('edit-alamat').value.trim(),
                desa:             document.getElementById('edit-desa').value.trim(),
                kecamatan:        document.getElementById('edit-kecamatan').value.trim(),
                kabupaten:        document.getElementById('edit-kabupaten').value.trim(),
                provinsi:         document.getElementById('edit-provinsi').value.trim(),
                nama_ayah:        document.getElementById('edit-nama-ayah').value.trim(),
                pekerjaan_ayah:   document.getElementById('edit-pekerjaan-ayah').value.trim(),
                nama_ibu:         document.getElementById('edit-nama-ibu').value.trim(),
                pekerjaan_ibu:    document.getElementById('edit-pekerjaan-ibu').value.trim(),
                no_hp_wali:       document.getElementById('edit-hp-wali').value.trim(),
                biaya_sekolah:    document.getElementById('edit-biaya').value,
                jenjang:          document.getElementById('edit-jenjang').value,
                kelas:            document.getElementById('edit-kelas').value.trim(),
                asal_sekolah:     document.getElementById('edit-asal-sekolah').value.trim(),
                status:           document.getElementById('edit-status').value,
                catatan_admin:    document.getElementById('edit-catatan').value.trim(),
                updated_at:       new Date().toISOString(),
                updated_by:       (window.currentUser && window.currentUser.email) || 'admin'
            };

            // ===== VALIDASI =====
            if (!data.nama_santri) {
                Swal.showValidationMessage('❌ Nama santri wajib diisi');
                return false;
            }
            if (!data.nik || !/^\d{16}$/.test(data.nik)) {
                Swal.showValidationMessage('❌ NIK harus 16 digit angka');
                return false;
            }
            if (data.nisn && !/^\d{10}$/.test(data.nisn)) {
                Swal.showValidationMessage('❌ NISN harus 10 digit angka');
                return false;
            }
            if (!data.jenis_kelamin) {
                Swal.showValidationMessage('❌ Jenis kelamin wajib dipilih');
                return false;
            }
            if (!data.no_hp_wali) {
                Swal.showValidationMessage('❌ No. HP Wali wajib diisi');
                return false;
            }
            if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                Swal.showValidationMessage('❌ Format email tidak valid');
                return false;
            }

            return data;
        }
    });

    // Jika user batal
    if (!formData) return;

    // ===== KONFIRMASI SEBELUM SIMPAN =====
    const konfirmasi = await Swal.fire({
        title: 'Simpan Perubahan?',
        html: `
            <p>Data santri <b>${esc(formData.nama_santri)}</b> akan diperbarui.</p>
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
        customClass: {
            popup: 'premium-popup',
            title: 'premium-title'
        }
    });

    if (!konfirmasi.isConfirmed) return;

    // ===== LOADING STATE =====
    Swal.fire({
        title: 'Menyimpan...',
        html: '<i class="fas fa-spinner fa-spin fa-2x" style="color:#1a5d1a;"></i><p style="margin-top:15px;">Mohon tunggu sebentar</p>',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false
    });

    try {
        // ===== UPDATE KE FIREBASE =====
        // Sesuaikan dengan struktur database Anda:

        // ▶️ Jika pakai FIREBASE REALTIME DATABASE:
        await firebase.database().ref(`santri/${id}`).update(formData);

        // ▶️ Jika pakai FIRESTORE, ganti dengan:
        // await firebase.firestore().collection('santri').doc(id).update(formData);

        // ▶️ Jika pakai modular SDK v9+:
        // import { ref, update } from "firebase/database";
        // await update(ref(db, `santri/${id}`), formData);

        // ===== UPDATE CACHE LOKAL =====
        window.dataSantriCache[id] = { ...window.dataSantriCache[id], ...formData };

        // ===== REFRESH TAMPILAN =====
        if (typeof renderTabelSantri === 'function') {
            renderTabelSantri();
        } else if (typeof loadDataSantri === 'function') {
            loadDataSantri();
        }

        // ===== SUKSES =====
        await Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            html: `Data <b>${esc(formData.nama_santri)}</b> telah diperbarui.`,
            confirmButtonColor: '#1a5d1a',
            timer: 2500,
            timerProgressBar: true,
            customClass: {
                popup: 'premium-popup',
                title: 'premium-title'
            }
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
            customClass: {
                popup: 'premium-popup',
                title: 'premium-title'
            }
        });
    }
}

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