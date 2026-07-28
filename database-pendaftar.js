/* ================================================================
   🗄️ DATABASE PENDAFTAR — JS
================================================================ */

window.dataPendaftarCache = {};
let currentFilter = { keyword: '', unit: '' };


/* ========== HELPER ========== */
function safeVal(val) {
    return val && val !== "" ? val : "-";
}

function formatRiwayat(d) {
    if (d.riwayat_sakit && Array.isArray(d.riwayat_sakit)) {
        return d.riwayat_sakit.length > 0 ? d.riwayat_sakit.join(', ') : "Tidak ada";
    }
    return "Tidak ada";
}

function formatWaktu(iso) {
    if (!iso) return "-";
    try {
        return new Date(iso).toLocaleString('id-ID', {
            day: '2-digit', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    } catch { return iso; }
}

async function muatDataPendaftar() {
    const tbody = document.getElementById('dbTablePendaftar');
    if (!tbody) return;

    tbody.innerHTML = `
        <tr>
            <td colspan="49" style="text-align:center; padding:40px;">
                <i class="fas fa-spinner fa-spin" style="font-size:1.5rem; color:#1a5d1a;"></i>
                <br><br>Memuat data pendaftar...
            </td>
        </tr>
    `;

    try {
        const dbRef = window.db || window.firebaseDB;
        if (!dbRef) throw new Error("Firebase DB tidak tersedia");

        const { collection, getDocs, query, orderBy } = 
            await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js");

        const q = query(collection(dbRef, "pendaftaran_santri"), orderBy("waktu_simpan", "desc"));
        const snapshot = await getDocs(q);

        tbody.innerHTML = '';
        window.dataPendaftarCache = {};

        let totalSetuju = 0;
        let totalTPQ    = 0;
        let totalMDT    = 0;
        let totalPONPES = 0;      // ⭐ Counter baru
        let no = 1;

        snapshot.forEach((docSnap) => {
            const d = docSnap.data();
            window.dataPendaftarCache[docSnap.id] = d;

            if (d.status_setuju === "SETUJU") totalSetuju++;
            
            // ⭐ Deteksi unit lebih fleksibel (case-insensitive)
            const unit = (d.tingkat_unit || '').toUpperCase();
            
            if (unit.includes('TPQ'))                                totalTPQ++;
            else if (unit.includes('MDT'))                           totalMDT++;
            else if (unit.includes('PONPES') || 
                     unit.includes('PESANTREN') || 
                     unit.includes('PST'))                           totalPONPES++;

            // ... kode render row (sama seperti sebelumnya) ...
            const badgeSetuju = d.status_setuju === "SETUJU"
                ? '<span class="db-badge-setuju"><i class="fas fa-check"></i> Setuju</span>'
                : '<span class="db-badge-belum"><i class="fas fa-times"></i> Belum</span>';

            const idBadge = d.id_santri 
                ? `<span class="db-id-santri">${d.id_santri}</span>`
                : '<span style="color:#999;">-</span>';

            const row = document.createElement('tr');
            row.dataset.searchable = [
                d.nama_santri, d.nik, d.id_santri, d.no_kk, d.nama_ayah, d.nama_ibu
            ].filter(Boolean).join(' ').toLowerCase();
            row.dataset.unit = (d.tingkat_unit || '').toLowerCase();

            row.innerHTML = `
                <td>${no++}</td>
                <td>${idBadge}</td>
                <td>${formatWaktu(d.waktu_simpan)}</td>
                <td class="nama-cell">${safeVal(d.nama_santri)}</td>
                <td>${safeVal(d.tingkat_unit)}</td>
                <td>${safeVal(d.nik)}</td>
                <td>${safeVal(d.no_kk)}</td>
                <td>${safeVal(d.nisn)}</td>
                <td>${safeVal(d.jenis_kelamin)}</td>
                <td>${safeVal(d.tmpt_lahir)}, ${safeVal(d.tgl_lahir)}</td>
                <td>${safeVal(d.anak_ke)}</td>
                <td>${safeVal(d.jml_saudara)}</td>
                <td>${safeVal(d.cita)}</td>
                <td>${safeVal(d.hobi)}</td>
                <td>${safeVal(d.keb_khusus)}</td>
                <td>${safeVal(d.disabilitas)}</td>
                <td>${safeVal(d.biaya)}</td>
                <td>${safeVal(d.st_ayah)}</td>
                <td>${safeVal(d.nama_ayah)}</td>
                <td>${safeVal(d.wn_ayah)}</td>
                <td>${safeVal(d.nik_ayah)}</td>
                <td>${safeVal(d.kk_ayah)}</td>
                <td>${safeVal(d.tmpt_ayah)}, ${safeVal(d.tgl_ayah)}</td>
                <td>${safeVal(d.pdk_ayah)}</td>
                <td>${safeVal(d.pjk_ayah)}</td>
                <td>${safeVal(d.hasil_ayah)}</td>
                <td>${safeVal(d.hp_ayah)}</td>
                <td>${safeVal(d.st_ibu)}</td>
                <td>${safeVal(d.nama_ibu)}</td>
                <td>${safeVal(d.wn_ibu)}</td>
                <td>${safeVal(d.nik_ibu)}</td>
                <td>${safeVal(d.tmpt_ibu)}, ${safeVal(d.tgl_ibu)}</td>
                <td>${safeVal(d.pdk_ibu)}</td>
                <td>${safeVal(d.pjk_ibu)}</td>
                <td>${safeVal(d.hasil_ibu)}</td>
                <td>${safeVal(d.hp_ibu)}</td>
                <td>${safeVal(d.st_wali)}</td>
                <td>${safeVal(d.al_ayah)}, RT ${safeVal(d.rt_ayah)}/${safeVal(d.rw_ayah)}, ${safeVal(d.desa_ayah)}</td>
                <td>${safeVal(d.al_ibu)}, RT ${safeVal(d.rt_ibu)}/${safeVal(d.rw_ibu)}, ${safeVal(d.desa_ibu)}</td>
                <td>${safeVal(d.al_santri)}, RT ${safeVal(d.rt_santri)}/${safeVal(d.rw_santri)}, ${safeVal(d.desa_santri)}</td>
                <td>${safeVal(d.w_visi)}</td>
                <td>${safeVal(d.w_pola)}</td>
                <td>${safeVal(d.w_perilaku)}</td>
                <td>${safeVal(d.w_sehat)}</td>
                <td>${formatRiwayat(d)}</td>
                <td>${safeVal(d.w_tazir)}</td>
                <td>${safeVal(d.w_harapan)}</td>
                <td>${badgeSetuju}</td>
                <td>
                    <button class="btn-detail-db" onclick="lihatDetailPendaftar('${docSnap.id}')">
                        <i class="fas fa-eye"></i> Detail
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        // ⭐ Update summary (termasuk PONPES)
        document.getElementById('dbTotalPendaftar').textContent = snapshot.size;
        document.getElementById('dbTotalSetuju').textContent    = totalSetuju;
        document.getElementById('dbTotalTPQ').textContent       = totalTPQ;
        document.getElementById('dbTotalMDT').textContent       = totalMDT;
        document.getElementById('dbTotalPONPES').textContent    = totalPONPES;   // ⭐ Baru

        if (snapshot.size === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="49" style="text-align:center; padding:40px; color:#94a3b8;">
                        <i class="fas fa-inbox" style="font-size:2rem;"></i>
                        <br><br>Belum ada data pendaftar
                    </td>
                </tr>
            `;
        }

        console.log(`✅ ${snapshot.size} pendaftar dimuat`);
        console.log(`   📊 TPQ: ${totalTPQ}, MDT: ${totalMDT}, PONPES: ${totalPONPES}`);

    } catch (err) {
        console.error("❌ Error:", err);
        tbody.innerHTML = `
            <tr>
                <td colspan="49" style="text-align:center; padding:30px; color:#dc2626;">
                    <i class="fas fa-exclamation-triangle"></i>
                    Gagal memuat: ${err.message}
                </td>
            </tr>
        `;
    }
}

/* ========== FILTER SEARCH ========== */
function filterDatabasePendaftar(keyword) {
    currentFilter.keyword = keyword.toLowerCase().trim();
    applyFilters();
}

function filterByUnit(unit) {
    currentFilter.unit = unit.toLowerCase().trim();
    applyFilters();
}

function applyFilters() {
    const rows = document.querySelectorAll('#dbTablePendaftar tr[data-searchable]');
    let visibleCount = 0;

    rows.forEach(row => {
        const searchable = row.dataset.searchable || '';
        const unit = row.dataset.unit || '';
        
        const matchKeyword = !currentFilter.keyword || searchable.includes(currentFilter.keyword);
        const matchUnit = !currentFilter.unit || unit.includes(currentFilter.unit);
        
        const show = matchKeyword && matchUnit;
        row.style.display = show ? '' : 'none';
        if (show) visibleCount++;
    });

    // Info filter
    const info = document.getElementById('dbFilterInfo');
    const infoText = document.getElementById('dbFilterInfoText');
    if (currentFilter.keyword || currentFilter.unit) {
        info.style.display = 'flex';
        infoText.textContent = `Menampilkan ${visibleCount} hasil${currentFilter.keyword ? ` untuk "${currentFilter.keyword}"` : ''}${currentFilter.unit ? ` di unit ${currentFilter.unit.toUpperCase()}` : ''}`;
    } else {
        info.style.display = 'none';
    }
}


/* ========== DETAIL POPUP ========== */
window.lihatDetailPendaftar = function(id) {
    const d = window.dataPendaftarCache[id];
    if (!d) return Swal.fire('Error', 'Data tidak ditemukan', 'error');

    Swal.fire({
        title: `<i class="fas fa-user-graduate"></i> ${d.nama_santri || 'Detail Santri'}`,
        html: `
            <div style="text-align:left; padding:10px; font-size:0.9rem; line-height:1.7;">
                <p><b>🆔 ID Santri:</b> ${d.id_santri || '-'}</p>
                <p><b>📚 Unit:</b> ${d.tingkat_unit || '-'}</p>
                <p><b>🎂 TTL:</b> ${d.tmpt_lahir || '-'}, ${d.tgl_lahir || '-'}</p>
                <p><b>👨 Ayah:</b> ${d.nama_ayah || '-'} (${d.hp_ayah || '-'})</p>
                <p><b>👩 Ibu:</b> ${d.nama_ibu || '-'} (${d.hp_ibu || '-'})</p>
                <p><b>🏠 Alamat:</b> ${d.al_santri || '-'}, ${d.desa_santri || '-'}</p>
                <p><b>🎯 Cita-cita:</b> ${d.cita || '-'}</p>
                <p><b>❤️ Kesehatan:</b> ${d.w_sehat || '-'}</p>
                <p><b>🏥 Riwayat:</b> ${formatRiwayat(d)}</p>
                <hr style="margin:14px 0;">
                <p><b>Status:</b> ${d.status_setuju === 'SETUJU' ? '✅ Menyetujui' : '❌ Belum'}</p>
                <p><b>Waktu Daftar:</b> ${formatWaktu(d.waktu_simpan)}</p>
            </div>
        `,
        width: '95%',
        confirmButtonText: 'Tutup',
        confirmButtonColor: '#1a5d1a'
    });
};


/* ========== EXPORT EXCEL ========== */
function exportToExcel() {
    const rows = document.querySelectorAll('#dbTablePendaftar tr:not([style*="display: none"])');
    if (rows.length === 0) return Swal.fire('Tidak ada data', 'Tidak ada data untuk di-export', 'warning');

    let csv = '';
    // Header
    const headers = document.querySelectorAll('.db-table thead th');
    csv += Array.from(headers).slice(0, -1).map(th => `"${th.textContent.trim()}"`).join(',') + '\n';
    
    // Body
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        csv += Array.from(cells).slice(0, -1).map(td => `"${td.textContent.trim().replace(/"/g, '""')}"`).join(',') + '\n';
    });

    // Download
    const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Database_Pendaftar_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    Swal.fire('Berhasil', 'File CSV berhasil diunduh', 'success');
}


/* ========== EXPOSE ========== */
window.muatDataPendaftar = muatDataPendaftar;
window.filterDatabasePendaftar = filterDatabasePendaftar;
window.filterByUnit = filterByUnit;
window.exportToExcel = exportToExcel;