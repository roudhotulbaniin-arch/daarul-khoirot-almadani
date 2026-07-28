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

        snap.forEach(docSnap => {
            const d = docSnap.data();
            window.dataSantriCache[docSnap.id] = d;

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
                        <button class="btn-aksi edit" onclick="editSantri('${docSnap.id}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-aksi status" onclick="ubahStatus('${docSnap.id}')" title="Status">
                            <i class="fas fa-user-cog"></i>
                        </button>
                        <button class="btn-aksi hapus" onclick="hapusSantri('${docSnap.id}')" title="Hapus">
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


/* ========== AKSI ========== */
function editSantri(id) {
    const d = window.dataSantriCache[id];
    if (!d) return;

    Swal.fire({
        title: `<i class="fas fa-edit"></i> Edit Data Santri`,
        html: `
            <div style="text-align:left; padding:10px;">
                <p style="margin-bottom:10px;"><b>${d.nama_santri}</b></p>
                <p style="color:#6b7280; font-size:0.85rem;">
                    Fitur edit lengkap sedang dalam pengembangan. 
                    Untuk sementara, edit langsung di Firebase Console.
                </p>
            </div>
        `,
        icon: 'info',
        confirmButtonColor: '#1a5d1a'
    });
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

/* ========== EXPOSE ========== */
window.muatDataSantri = muatDataSantri;
window.filterSantri = filterSantri;
window.filterByStatus = filterByStatus;
window.filterByUnit = filterByUnit;
window.editSantri = editSantri;
window.ubahStatus = ubahStatus;
window.hapusSantri = hapusSantri;
window.tambahSantri = tambahSantri;
window.naikKelasMassal = naikKelasMassal;