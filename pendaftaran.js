/* ================================================================
   PENDAFTARAN.JS — Daarul Khoirot Almadani
   Versi 2.0 — Refactored & Bug Fixed
   
   CHANGELOG:
   - Fix: inline style button-group dihapus otomatis via MutationObserver
   - Fix: perbaruiTombolNavigasi — logika index-based (bukan hardcode nama tab)
   - Fix: generateIdSantri — tambah lock flag cegah race condition
   - Fix: getElByName — hapus parameter suffix yang tidak berfungsi benar
   - Fix: handleStatusAyah — sekarang memanggil toggleAyahFields juga
   - Fix: loadWilayah — retry otomatis jika API gagal (max 2x)
   - Fix: toggleDomisiliIbu & toggleDomisiliSantri — cek elemen sebelum akses
   - Fix: validateInput tab 'ortu' — tambah validasi NIK Ibu 16 digit
   - Fix: kirimWA — fallback lebih robust untuk semua field
   - Improve: semua try-catch lebih informatif
   - Improve: console.log dikelompokkan dengan group/groupEnd
================================================================ */


/* ================================================================
   KONSTANTA GLOBAL
================================================================ */
const URUTAN_TAB   = ['info', 'santri', 'ortu', 'alamat', 'pernyataan'];
const ADMIN_WA     = '6281401643188';
const FIREBASE_CDN = 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
const API_WILAYAH  = 'https://www.emsifa.com/api-wilayah-indonesia/api';

/* Warna tombol SweetAlert */
const SWAL_BTN_COLOR  = '#1a5319';
const SWAL_ICON_COLOR = '#bc6c25';

/* Alamat Pesantren (statis) */
const ALAMAT_PESANTREN = {
    prov : '32',         prov_text : 'JAWA BARAT',
    kab  : '3215',       kab_text  : 'KABUPATEN KARAWANG',
    kec  : '321516',     kec_text  : 'JATISARI',
    desa : '3215162001', desa_text : 'JATISARI',
    al   : 'Dusun Sukamaju II',
    rt   : '002',
    rw   : '004',
    pos  : '41374'
};


/* ================================================================
   BAGIAN 0 — HELPER DASAR
================================================================ */

/**
 * Refresh custom dropdown jika library tersedia
 */
function refreshCD(el) {
    if (typeof CustomDropdown !== 'undefined' && el) {
        try {
            CustomDropdown.refresh(el);
        } catch (err) {
            console.warn('⚠️ refreshCD error:', err);
        }
    }
}

/**
 * Ambil elemen berdasarkan name attribute
 * Selalu cari dari seluruh dokumen (tidak pakai suffix box)
 */
function getElByName(name) {
    return document.getElementsByName(name)[0] || null;
}

/**
 * Ambil elemen berdasarkan name atau id
 */
function getElById(nameOrId) {
    return document.getElementsByName(nameOrId)[0]
        || document.getElementById(nameOrId)
        || null;
}

/**
 * Ambil value elemen, trim whitespace
 */
function getVal(nameOrId) {
    const el = getElById(nameOrId);
    return el?.value?.trim() ?? '';
}

/**
 * Set style locked/unlocked pada elemen input
 */
function applyInputStyle(el, isLocked) {
    if (!el) return;
    el.style.backgroundColor = isLocked ? '#e9ecef' : '#ffffff';
    el.style.color           = isLocked ? '#6c757d' : '#000000';
    el.style.cursor          = isLocked ? 'not-allowed' : '';
    el.style.opacity         = isLocked ? '0.75' : '1';
}

/**
 * Tampilkan SweetAlert warning
 */
function showWarning(message) {
    return Swal.fire({
        title           : 'Data Belum Lengkap',
        html            : message,
        icon            : 'warning',
        iconColor       : SWAL_ICON_COLOR,
        confirmButtonText: 'Lengkapi Data',
        confirmButtonColor: SWAL_BTN_COLOR,
        background      : '#ffffff'
    });
}

/**
 * Tampilkan SweetAlert error
 */
function showError(title, text) {
    return Swal.fire({
        title,
        text,
        icon            : 'error',
        confirmButtonColor: SWAL_BTN_COLOR
    });
}


/* ================================================================
   BAGIAN 0.5 — MAPPING KODE POS KARAWANG
================================================================ */
const MAPPING_POS_KARAWANG = {
    '3215010': '41311', '3215011': '41361', '3215012': '41361', '3215013': '41361',
    '3215020': '41314', '3215021': '41361', '3215030': '41315', '3215040': '41363',
    '3215050': '41361', '3215060': '41375', '3215070': '41374', '3215080': '41384',
    '3215090': '41383', '3215100': '41373', '3215110': '41371', '3215120': '41372',
    '3215130': '41381', '3215140': '41382', '3215150': '41353', '3215160': '41354',
    '3215170': '41352', '3215180': '41351', '3215190': '41353', '3215200': '41355',
    '3215210': '41351', '3215220': '41351', '3215230': '41351', '3215240': '41384',
    '3215250': '41311', '3215260': '41311', '3215022': '41361', '3215014': '41316',
    '3215161': '41354', '3215051': '41361'
};


/* ================================================================
   BAGIAN 1 — GENERATE ID SANTRI AUTO-INCREMENT
   Format: DKM001, DKM002, DKM003, ...
================================================================ */

/* Lock flag — cegah 2 panggilan bersamaan (race condition) */
let _sedangGenerateId = false;

async function generateIdSantri() {
    /* Tunggu jika sedang berjalan */
    let tunggu = 0;
    while (_sedangGenerateId && tunggu < 10) {
        await new Promise(r => setTimeout(r, 200));
        tunggu++;
    }

    _sedangGenerateId = true;

    try {
        const { getDocs, collection } = await import(FIREBASE_CDN);
        const dbRef = window.firebaseDB || window.db;

        if (!dbRef) {
            throw new Error('Firebase DB tidak tersedia (window.firebaseDB & window.db kosong)');
        }

        const snap = await getDocs(collection(dbRef, 'pendaftaran_santri'));

        let nomorTertinggi = 0;
        snap.docs.forEach(doc => {
            const idSantri = doc.data().id_santri || '';
            const match    = idSantri.match(/^DKM(\d+)$/);
            if (match) {
                const nomor = parseInt(match[1], 10);
                if (nomor > nomorTertinggi) nomorTertinggi = nomor;
            }
        });

        const nomorBaru = nomorTertinggi + 1;
        const idBaru    = `DKM${String(nomorBaru).padStart(3, '0')}`;

        console.log(`🆔 ID Terakhir : DKM${String(nomorTertinggi).padStart(3, '0')}`);
        console.log(`🆔 ID Baru     : ${idBaru}`);
        console.log(`📊 Total data  : ${snap.docs.length} dokumen`);

        return idBaru;

    } catch (err) {
        console.error('❌ generateIdSantri error:', err);
        const fallback = `DKM-TMP-${Date.now().toString().slice(-6)}`;
        console.warn('⚠️ Pakai fallback ID:', fallback);
        return fallback;

    } finally {
        /* Selalu lepas lock */
        _sedangGenerateId = false;
    }
}


/* ================================================================
   BAGIAN 2 — HANDLE FORM SUBMIT
================================================================ */

async function handleFormSubmit(event) {
    if (event) event.preventDefault();

    const form = document.getElementById('formPendaftaran');
    if (!form) {
        console.error('❌ Form #formPendaftaran tidak ditemukan!');
        return;
    }

    /* Tampilkan loading */
    Swal.fire({
        title          : 'Sedang Menyimpan...',
        text           : 'Memproses data dan mengompres foto...',
        allowOutsideClick: false,
        didOpen        : () => Swal.showLoading()
    });

    try {
        const formData  = new FormData(form);
        const dataFinal = {};

        /* ── 1. Helper ambil teks dari select atau input ── */
        const getTeksEl = (nameOrId) => {
            const el = getElById(nameOrId);
            if (!el) return '-';
            if (el.tagName === 'SELECT') {
                return el.selectedIndex !== -1
                    ? (el.options[el.selectedIndex].text || '-')
                    : '-';
            }
            return el.value?.trim() || '-';
        };

        /* ── 2. Kumpulkan semua input (kecuali File & riwayat_sakit) ── */
        formData.forEach((value, key) => {
            if (!(value instanceof File) && !key.startsWith('riwayat_sakit')) {
                dataFinal[key] = value;
            }
        });

        /* ── 3. Paksa nama_santri jika FormData melewatkannya ── */
        const inputNama = getElById('nama_santri');
        if (inputNama?.value) {
            dataFinal['nama_santri'] = inputNama.value.trim();
        }

        /* ── 4. Checkbox riwayat sakit ── */
        const checkboxSakit = form.querySelectorAll('input[name="riwayat_sakit[]"]:checked');
        const arraySakit    = Array.from(checkboxSakit).map(el => el.value);

        dataFinal['riwayat_sakit'] = (
            dataFinal['w_sehat'] === 'Sehat' || arraySakit.length === 0
        ) ? ['Tidak Ada / Sehat'] : arraySakit;

        /* ── 5. Konversi kode wilayah → teks nama ── */
        const fieldWilayah = [
            'prov_ayah', 'kab_ayah', 'kec_ayah', 'desa_ayah',
            'prov_ibu',  'kab_ibu',  'kec_ibu',  'desa_ibu',
            'prov_santri','kab_santri','kec_santri','desa_santri',
            'pjk_ibu', 'pjk_ayah', 'tingkat_unit'
        ];
        fieldWilayah.forEach(field => {
            const teks = getTeksEl(field);
            if (teks && !teks.includes('-- Pilih') && !teks.includes('Pilih ')) {
                dataFinal[field] = teks;
            }
        });

        /* ── 6. Kompresi foto KK & Ijazah ── */
        const opsiKompresi = { maxSizeMB: 0.1, maxWidthOrHeight: 1024, useWebWorker: true };

        const toBase64 = (file) => new Promise((resolve, reject) => {
            const reader    = new FileReader();
            reader.onload   = () => resolve(reader.result);
            reader.onerror  = (e) => reject(e);
            reader.readAsDataURL(file);
        });

        const fileKK = getElByName('up_kk')?.files?.[0];
        if (fileKK) {
            const compressed          = await imageCompression(fileKK, opsiKompresi);
            dataFinal['file_kk_data'] = await toBase64(compressed);
        }

        const fileIjazah = getElByName('up_ijazah')?.files?.[0];
        if (fileIjazah) {
            const compressed              = await imageCompression(fileIjazah, opsiKompresi);
            dataFinal['file_ijazah_data'] = await toBase64(compressed);
        }

        /* ── 7. Status persetujuan ── */
        const elPernyataan = getElByName('cek_pernyataan');
        dataFinal['status_setuju'] = elPernyataan?.checked ? 'SETUJU' : 'TIDAK SETUJU';

        /* ── 8. Hapus field yang tidak perlu disimpan ── */
        ['up_kk', 'up_ijazah', 'cek_pernyataan', 'riwayat_sakit[]'].forEach(k => {
            delete dataFinal[k];
        });

        /* ── 9. Field wajib sistem ── */
        dataFinal['id_santri']     = await generateIdSantri();
        dataFinal['status_santri'] = 'Aktif';
        dataFinal['waktu_simpan']  = new Date().toISOString();

        if (!dataFinal['tgl_daftar']) {
            dataFinal['tgl_daftar'] = new Date().toISOString().split('T')[0];
        }

        /* Validasi id_santri wajib berhasil di-generate */
        if (!dataFinal['id_santri']) {
            throw new Error('Gagal generate id_santri!');
        }

        console.group('📦 Data Final Pendaftaran');
        console.log('id_santri    :', dataFinal['id_santri']);
        console.log('nama_santri  :', dataFinal['nama_santri']);
        console.log('status_santri:', dataFinal['status_santri']);
        console.log('waktu_simpan :', dataFinal['waktu_simpan']);
        console.groupEnd();

        /* ── 10. Simpan ke Firestore ── */
        const dbRef = window.firebaseDB || window.db;
        if (!dbRef) {
            throw new Error('Firebase DB belum siap saat menyimpan.');
        }

        const { addDoc, collection: fsCollection } = await import(FIREBASE_CDN);
        const docRef = await addDoc(fsCollection(dbRef, 'pendaftaran_santri'), dataFinal);

        if (!docRef?.id) {
            throw new Error('Firestore tidak mengembalikan docRef.id');
        }

        console.log('✅ Tersimpan! Firebase Doc ID:', docRef.id);
        console.log('✅ ID Santri Custom          :', dataFinal['id_santri']);

        /* ── 11. Sukses — tampilkan modal ── */
        await Swal.fire({
            title           : 'Pendaftaran Berhasil! 🎉',
            html            : `
                <p style="margin-bottom:12px;">Data santri telah tersimpan dengan aman.</p>
                <div style="
                    background   : #f0f9f0;
                    border       : 2px solid #1a5d1a;
                    border-radius: 10px;
                    padding      : 14px;
                    margin       : 12px 0;
                ">
                    <p style="margin:0; font-size:0.8rem; color:#555;
                              text-transform:uppercase; letter-spacing:1px;">
                        ID Santri Anda
                    </p>
                    <p style="
                        margin       : 6px 0 0;
                        font-size    : 1.8rem;
                        font-weight  : bold;
                        color        : #1a5d1a;
                        letter-spacing: 2px;
                    ">${dataFinal['id_santri']}</p>
                </div>
                <p style="font-size:0.8rem; color:#888; margin-top:12px;">
                    Simpan ID ini untuk keperluan administrasi.<br>
                    Data akan dikirim ke admin via WhatsApp.
                </p>
            `,
            icon            : 'success',
            confirmButtonColor: SWAL_BTN_COLOR,
            confirmButtonText : 'Lanjut Kirim WA',
            allowOutsideClick : false
        });

        /* Kirim WA → reset form → reload */
        if (typeof window.kirimWA === 'function') {
            window.kirimWA(dataFinal);
        }
        form.reset();
        location.reload();

    } catch (error) {
        console.error('❌ handleFormSubmit error:', error);
        Swal.fire({
            title: 'Gagal Menyimpan Data!',
            html : `<code style="font-size:0.85rem">${error.message}</code>`,
            icon : 'error',
            confirmButtonColor: SWAL_BTN_COLOR
        });
    }
}


/* ================================================================
   BAGIAN 3 — LOAD WILAYAH (API Emsifa + retry)
================================================================ */

/**
 * Load data wilayah dari API, dengan retry otomatis jika gagal
 * @param {string} endpoint   - misal 'provinces', 'regencies/32'
 * @param {string} elName     - name attribute elemen select
 * @param {string} placeholder - teks placeholder option pertama
 * @param {number} retryCount  - internal, jangan diisi manual
 */
async function loadWilayah(endpoint, elName, placeholder, retryCount = 0) {
    const el = getElByName(elName);
    if (!el) {
        console.error(`❌ Elemen [name="${elName}"] tidak ditemukan`);
        return;
    }

    /* Loading state */
    el.innerHTML = '<option value="">Memuat data...</option>';
    el.disabled  = true;
    refreshCD(el);

    const url = `${API_WILAYAH}/${endpoint}.json`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

        const data = await res.json();
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Data kosong dari API');
        }

        let opsi = `<option value="">${placeholder}</option>`;
        data.forEach(d => {
            opsi += `<option value="${d.id}">${d.name}</option>`;
        });

        el.innerHTML = opsi;
        el.disabled  = false;

        setTimeout(() => {
            refreshCD(el);
            console.log(`✅ [${endpoint}] → ${data.length} item → [${elName}]`);
        }, 50);

    } catch (err) {
        console.error(`❌ loadWilayah(${endpoint}) gagal [retry: ${retryCount}]:`, err);

        /* Retry max 2 kali dengan delay 1 detik */
        if (retryCount < 2) {
            console.warn(`🔄 Retry ke-${retryCount + 1} untuk ${endpoint}...`);
            setTimeout(() => loadWilayah(endpoint, elName, placeholder, retryCount + 1), 1000);
        } else {
            el.innerHTML = `<option value="">⚠️ Gagal memuat — coba refresh</option>`;
            el.disabled  = false;
            refreshCD(el);
        }
    }
}

/* ── Helper reset dropdown cascade ── */
function resetDropdownCascade(namaList) {
    namaList.forEach(name => {
        const el = getElByName(name);
        if (!el) return;

        /* Buat placeholder yang relevan dari nama field */
        const bagian      = name.split('_')[0]; // 'kab', 'kec', dst
        const labelMap    = {
            kab  : 'Kabupaten/Kota',
            kec  : 'Kecamatan',
            desa : 'Desa/Kelurahan'
        };
        const label = labelMap[bagian] || 'Data';

        el.innerHTML = `<option value="">Pilih ${label}</option>`;
        refreshCD(el);
    });
}

/* ── Helper auto-fill kode pos ── */
function autoFillKodePos(kecamatanId, elPosName) {
    const inputPos = getElByName(elPosName);
    if (!inputPos) return;

    const kodeAuto = MAPPING_POS_KARAWANG[kecamatanId];

    if (kodeAuto) {
        inputPos.value    = kodeAuto;
        inputPos.readOnly = true;
        applyInputStyle(inputPos, true);
    } else {
        inputPos.value       = '';
        inputPos.readOnly    = false;
        inputPos.placeholder = 'Isi Kode Pos Manual';
        applyInputStyle(inputPos, false);
    }
}


/* ── WILAYAH AYAH ── */
function loadKabAyah(val) {
    resetDropdownCascade(['kab_ayah', 'kec_ayah', 'desa_ayah']);
    const inputPos = getElByName('pos_ayah');
    if (inputPos) { inputPos.value = ''; inputPos.readOnly = false; applyInputStyle(inputPos, false); }
    if (val) loadWilayah(`regencies/${val}`, 'kab_ayah', 'Pilih Kabupaten/Kota');
}

function loadKecAyah(val) {
    resetDropdownCascade(['kec_ayah', 'desa_ayah']);
    const inputPos = getElByName('pos_ayah');
    if (inputPos) { inputPos.value = ''; inputPos.readOnly = false; applyInputStyle(inputPos, false); }
    if (val) loadWilayah(`districts/${val}`, 'kec_ayah', 'Pilih Kecamatan');
}

function loadDesaDanPosAyah(val) {
    if (!val) return;
    loadWilayah(`villages/${val}`, 'desa_ayah', 'Pilih Desa/Kelurahan');
    autoFillKodePos(val, 'pos_ayah');
}

/* ── WILAYAH IBU ── */
function loadKabIbu(val) {
    resetDropdownCascade(['kab_ibu', 'kec_ibu', 'desa_ibu']);
    const inputPos = getElByName('pos_ibu');
    if (inputPos) { inputPos.value = ''; inputPos.readOnly = false; applyInputStyle(inputPos, false); }
    if (val) loadWilayah(`regencies/${val}`, 'kab_ibu', 'Pilih Kabupaten/Kota');
}

function loadKecIbu(val) {
    resetDropdownCascade(['kec_ibu', 'desa_ibu']);
    const inputPos = getElByName('pos_ibu');
    if (inputPos) { inputPos.value = ''; inputPos.readOnly = false; applyInputStyle(inputPos, false); }
    if (val) loadWilayah(`districts/${val}`, 'kec_ibu', 'Pilih Kecamatan');
}

function loadDesaDanPosIbu(val) {
    if (!val) return;
    loadWilayah(`villages/${val}`, 'desa_ibu', 'Pilih Desa/Kelurahan');
    autoFillKodePos(val, 'pos_ibu');
}

/* ── WILAYAH SANTRI ── */
function loadKabSantri(val) {
    resetDropdownCascade(['kab_santri', 'kec_santri', 'desa_santri']);
    const inputPos = getElByName('pos_santri');
    if (inputPos) { inputPos.value = ''; inputPos.readOnly = false; applyInputStyle(inputPos, false); }
    if (val) loadWilayah(`regencies/${val}`, 'kab_santri', 'Pilih Kabupaten/Kota');
}

function loadKecSantri(val) {
    resetDropdownCascade(['kec_santri', 'desa_santri']);
    const inputPos = getElByName('pos_santri');
    if (inputPos) { inputPos.value = ''; inputPos.readOnly = false; applyInputStyle(inputPos, false); }
    if (val) loadWilayah(`districts/${val}`, 'kec_santri', 'Pilih Kecamatan');
}

function loadDesaDanPosSantri(val) {
    if (!val) return;
    loadWilayah(`villages/${val}`, 'desa_santri', 'Pilih Desa/Kelurahan');
    autoFillKodePos(val, 'pos_santri');
}


/* ================================================================
   BAGIAN 4 — LOCK / RESET / COPY ALAMAT
================================================================ */

/**
 * Lock atau unlock semua field alamat berdasarkan suffix
 * suffix: 'ayah' | 'ibu' | 'santri'
 */
function lockFields(suffix, isLocked) {
    /* Dropdown */
    ['prov', 'kab', 'kec', 'desa'].forEach(prefix => {
        const el = getElByName(`${prefix}_${suffix}`);
        if (!el) return;
        el.disabled = isLocked;
        applyInputStyle(el, isLocked);
    });

    /* Input teks */
    ['al', 'rt', 'rw', 'pos'].forEach(prefix => {
        const el = getElByName(`${prefix}_${suffix}`);
        if (!el) return;
        if (isLocked) {
            el.setAttribute('readonly', 'readonly');
        } else {
            el.removeAttribute('readonly');
        }
        applyInputStyle(el, isLocked);
    });
}

/**
 * Reset semua field alamat ke kosong
 */
function resetFields(suffix) {
    /* Dropdown */
    ['prov', 'kab', 'kec', 'desa'].forEach(prefix => {
        const el = getElByName(`${prefix}_${suffix}`);
        if (!el) return;
        el.innerHTML = `<option value="">Pilih Data</option>`;
        el.disabled  = false;
        applyInputStyle(el, false);
        refreshCD(el);
    });

    /* Input teks */
    ['al', 'rt', 'rw', 'pos'].forEach(prefix => {
        const el = getElByName(`${prefix}_${suffix}`);
        if (!el) return;
        el.value = '';
        el.removeAttribute('readonly');
        applyInputStyle(el, false);
    });
}

/**
 * Cek apakah data alamat Ayah sudah terisi lengkap
 */
function dataAyahLengkap() {
    const fields = ['prov_ayah', 'kab_ayah', 'kec_ayah', 'desa_ayah',
                    'al_ayah', 'rt_ayah', 'rw_ayah', 'pos_ayah'];

    return fields.every(name => {
        const val = getVal(name);
        return val !== '' && val !== 'provinces_init_val'
            && val !== 'regencies_init_val' && val !== 'districts_init_val'
            && val !== 'villages_init_val';
    });
}

/**
 * Copy data alamat dari satu suffix ke suffix lain
 */
function copyDataAlamat(from, to) {
    const fieldList = ['al', 'rt', 'rw', 'pos', 'prov', 'kab', 'kec', 'desa'];

    fieldList.forEach(prefix => {
        const src = getElByName(`${prefix}_${from}`);
        const dst = getElByName(`${prefix}_${to}`);
        if (!src || !dst) return;

        if (src.tagName === 'SELECT') {
            if (src.selectedIndex >= 0) {
                const opt = src.options[src.selectedIndex];
                dst.innerHTML = `<option value="${src.value}">${opt.text}</option>`;
                dst.value     = src.value;
                refreshCD(dst);
            }
        } else {
            dst.value = src.value || '';
        }
    });
}

/**
 * Isi alamat santri dengan alamat pesantren (untuk domisili Mukim)
 */
function isiAlamatPesantren() {
    const d = ALAMAT_PESANTREN;

    const setSel = (name, val, teks) => {
        const el = getElByName(name);
        if (!el) return;
        el.innerHTML = `<option value="${val}">${teks}</option>`;
        el.value     = val;
        refreshCD(el);
    };

    setSel('prov_santri', d.prov, d.prov_text);
    setSel('kab_santri',  d.kab,  d.kab_text);
    setSel('kec_santri',  d.kec,  d.kec_text);
    setSel('desa_santri', d.desa, d.desa_text);

    ['al', 'rt', 'rw', 'pos'].forEach(prefix => {
        const el = getElByName(`${prefix}_santri`);
        if (el) el.value = d[prefix];
    });
}


/* ================================================================
   BAGIAN 5 — TOGGLE DOMISILI
================================================================ */

function toggleDomisiliIbu(val) {
    /* Tampilkan/sembunyikan box alamat ibu */
    const box = getElByName('box_ibu')
             || document.getElementById('box_ibu')
             || document.querySelector('.box-ibu, [data-box="ibu"]');

    if (box) box.style.display = (val === '') ? 'none' : 'grid';

    if (val === 'sama') {
        if (!dataAyahLengkap()) {
            showWarning('Lengkapi <b>Alamat Ayah</b> terlebih dahulu sebelum memilih <b>Sama dengan Ayah</b>.');
            const elDom = getElByName('pilih_dom_ibu');
            if (elDom) elDom.value = '';
            if (box) box.style.display = 'none';
            return;
        }
        copyDataAlamat('ayah', 'ibu');
        lockFields('ibu', true);

    } else if (val === 'beda') {
        lockFields('ibu', false);
        resetFields('ibu');
        loadWilayah('provinces', 'prov_ibu', 'Pilih Provinsi');

    } else {
        /* val === '' — reset saja */
        lockFields('ibu', false);
        resetFields('ibu');
    }
}

function toggleDomisiliSantri(val) {
    /* Tampilkan/sembunyikan box alamat santri */
    const box = getElByName('box_santri')
             || document.getElementById('box_santri')
             || document.querySelector('.box-santri, [data-box="santri"]');

    if (box) box.style.display = (val === '') ? 'none' : 'grid';

    if (val === 'mukim') {
        isiAlamatPesantren();
        lockFields('santri', true);

    } else if (val === 'sama') {
        if (!dataAyahLengkap()) {
            showWarning('Lengkapi <b>Alamat Ayah</b> terlebih dahulu sebelum memilih <b>Sama dengan Ayah</b>.');
            const elDom = getElByName('pilih_dom_santri');
            if (elDom) elDom.value = '';
            if (box) box.style.display = 'none';
            return;
        }
        copyDataAlamat('ayah', 'santri');
        lockFields('santri', true);

    } else if (val === 'beda') {
        lockFields('santri', false);
        resetFields('santri');
        loadWilayah('provinces', 'prov_santri', 'Pilih Provinsi');

    } else {
        /* val === '' */
        lockFields('santri', false);
        resetFields('santri');
    }
}


/* ================================================================
   BAGIAN 6 — TOGGLE FIELDS (Ayah / NISN / HP / Kesehatan)
================================================================ */

/**
 * Lock/unlock semua field ayah saat status = Meninggal / Tidak Diketahui
 * Flatpickr-aware: gunakan _flatpickr instance
 */
function toggleAyahFields(status) {
    const fieldList = [
        'wn_ayah', 'nik_ayah', 'kk_ayah', 'tmpt_ayah',
        'tgl_ayah', 'pdk_ayah', 'pjk_ayah', 'hasil_ayah', 'hp_ayah'
    ];
    const isLocked = (status === 'Meninggal' || status === 'Tidak Diketahui');

    /* Panggil handleStatusAyah untuk reset domisili jika perlu */
    handleStatusAyah(status);

    fieldList.forEach(name => {
        const el = document.getElementsByName(name)[0];
        if (!el) return;

        const isSelect       = el.tagName === 'SELECT';
        const isFlatpickrEl  = (name === 'tgl_ayah')
                            || el.classList.contains('flatpickr-input')
                            || el.classList.contains('custom-date-input');

        if (isLocked) {
            /* Kosongkan nilai */
            if (isSelect || isFlatpickrEl) {
                el.value = '';
            } else {
                el.value = '-';
            }

            /* Disable/readonly */
            if (isSelect) {
                el.disabled = true;
            } else {
                el.readOnly = true;
                el.setAttribute('readonly', 'readonly');
            }

            /* Matikan flatpickr */
            if (isFlatpickrEl) {
                const fp = el._flatpickr;
                if (fp) { fp.clear(); fp.close(); fp.set('clickOpens', false); }
                el.style.pointerEvents = 'none';
                el.tabIndex            = -1;
                const wrapper = el.closest('.input-icon-wrapper');
                if (wrapper) wrapper.style.pointerEvents = 'none';
            }

            applyInputStyle(el, true);

        } else {
            /* Kembalikan nilai default */
            if (!isFlatpickrEl && el.value === '-') el.value = '';

            if (isSelect) {
                el.disabled = false;
            } else {
                /* Flatpickr input HARUS tetap readonly — dikontrol flatpickr */
                if (isFlatpickrEl) {
                    el.readOnly = true;
                    el.setAttribute('readonly', 'readonly');
                } else {
                    el.readOnly = false;
                    el.removeAttribute('readonly');
                }
            }

            /* Aktifkan kembali flatpickr */
            if (isFlatpickrEl) {
                const fp = el._flatpickr;
                if (fp) fp.set('clickOpens', true);
                el.style.pointerEvents = 'auto';
                el.tabIndex            = 0;
                const wrapper = el.closest('.input-icon-wrapper');
                if (wrapper) wrapper.style.pointerEvents = 'auto';
            }

            applyInputStyle(el, false);
        }
    });
}

/**
 * Handle perubahan status ayah:
 * - Reset domisili ibu/santri jika = 'sama' saat status = Tidak Diketahui
 */
function handleStatusAyah(status) {
    if (status !== 'Tidak Diketahui') return;

    const domIbu = getElByName('pilih_dom_ibu');
    if (domIbu?.value === 'sama') {
        domIbu.value = '';
        toggleDomisiliIbu('');
    }

    const domSantri = getElByName('pilih_dom_santri');
    if (domSantri?.value === 'sama') {
        domSantri.value = '';
        toggleDomisiliSantri('');
    }
}

/**
 * Checkbox "Tidak punya NISN" — isi dengan 0000000000
 */
function handleNoNISN(checked) {
    const el = getElByName('nisn');
    if (!el) return;

    if (checked) {
        el.value    = '0000000000';
        el.readOnly = true;
        applyInputStyle(el, true);
    } else {
        el.value    = '';
        el.readOnly = false;
        applyInputStyle(el, false);
    }
}

/**
 * Checkbox "Tidak memiliki HP"
 * @param {HTMLInputElement} cb        - elemen checkbox
 * @param {string}           inputName - name dari input HP
 */
function toggleHP(cb, inputName) {
    const el = getElByName(inputName);
    if (!el) return;

    if (cb.checked) {
        el.value    = 'TIDAK MEMILIKI';
        el.readOnly = true;
        applyInputStyle(el, true);
    } else {
        el.value    = '';
        el.readOnly = false;
        applyInputStyle(el, false);
    }
}

/**
 * Toggle section riwayat sakit berdasarkan pilihan dropdown kesehatan
 */
function toggleRiwayat() {
    const sel = document.getElementById('selectKesehatan');
    const div = document.getElementById('divRiwayatSakit');
    if (!sel || !div) return;
    div.style.display = (sel.value === 'Pernah Sakit') ? 'block' : 'none';
}


/* ================================================================
   BAGIAN 7 — VALIDASI INPUT PER TAB
================================================================ */

function validateInput(tabId) {
    const REGEX_NUMERIK = /^\d+$/;

    /* ── Nilai yang dianggap tidak valid ── */
    const NILAI_INVALID = new Set([
        '', '-- Pilih --', 'Pilih Data',
        'provinces_init_val', 'regencies_init_val',
        'districts_init_val', 'villages_init_val'
    ]);

    const TEKS_PLACEHOLDER_SELECT = new Set([
        '-- Pilih --', 'Pilih Data', 'Pilih Provinsi',
        'Pilih Kabupaten', 'Pilih Kabupaten/Kota',
        'Pilih Kecamatan', 'Pilih Desa', 'Pilih Desa/Kelurahan',
        'Pilih Kelurahan', 'Memuat data...'
    ]);

    /* ── Cek apakah value dianggap tidak valid ── */
    const nilaiTidakValid = (el, val) => {
        if (!el) return true;
        if (NILAI_INVALID.has(val)) return true;

        if (el.tagName === 'SELECT' && el.selectedIndex >= 0) {
            const teks = el.options[el.selectedIndex]?.text?.trim() || '';
            if (TEKS_PLACEHOLDER_SELECT.has(teks)) return true;
        }

        return false;
    };

    /* ── Check satu field ── */
    const check = (name, label) => {
        const el  = getElById(name);
        const val = el?.value?.trim() ?? '';

        if (!el) {
            console.warn(`⚠️ Field '${name}' tidak ditemukan di DOM`);
            return true; // Jangan blokir jika field tidak ada
        }

        if (nilaiTidakValid(el, val)) {
            showWarning(`Field <b>${label}</b> wajib diisi dengan benar!`);
            el.focus?.();
            return false;
        }

        return true;
    };

    /* ── Check semua field alamat ── */
    const checkAlamat = (suffix, label) => {
        const fields = [
            [`prov_${suffix}`,  `Provinsi ${label}`],
            [`kab_${suffix}`,   `Kabupaten/Kota ${label}`],
            [`kec_${suffix}`,   `Kecamatan ${label}`],
            [`desa_${suffix}`,  `Desa/Kelurahan ${label}`],
            [`al_${suffix}`,    `Alamat Lengkap ${label}`],
            [`rt_${suffix}`,    `RT ${label}`],
            [`rw_${suffix}`,    `RW ${label}`],
            [`pos_${suffix}`,   `Kode Pos ${label}`]
        ];
        return fields.every(([name, lbl]) => check(name, lbl));
    };

    /* ── TAB INFO ── */
    if (tabId === 'info') return true;

    /* ── TAB SANTRI ── */
    if (tabId === 'santri') {
        if (!check('tgl_daftar',    'Tanggal Pendaftaran'))   return false;
        if (!check('nama_santri',   'Nama Lengkap Santri'))   return false;
        if (!check('tingkat_unit',  'Pilihan Unit & Kelas'))  return false;
        if (!check('nik',           'NIK Santri'))            return false;
        if (!check('no_kk',         'Nomor KK'))              return false;
        if (!check('jenis_kelamin', 'Jenis Kelamin'))         return false;

        const nikVal = getVal('nik');
        if (nikVal.length !== 16 || !REGEX_NUMERIK.test(nikVal)) {
            showError('Format Salah', 'NIK Santri harus 16 digit angka!');
            return false;
        }
    }

    /* ── TAB ORTU ── */
    if (tabId === 'ortu') {
        const statusAyah = getVal('st_ayah');

        if (!check('nama_ayah', 'Nama Ayah Kandung')) return false;
        if (!check('st_ayah',   'Status Ayah'))        return false;

        /* Field detail ayah — wajib hanya jika masih hidup */
        if (statusAyah === 'Masih Hidup') {
            if (!check('nik_ayah',   'NIK Ayah'))           return false;
            if (!check('kk_ayah',    'Nomor KK Ayah'))       return false;
            if (!check('pjk_ayah',   'Pekerjaan Ayah'))      return false;
            if (!check('hasil_ayah', 'Penghasilan Ayah'))    return false;
            if (!check('hp_ayah',    'No. HP Ayah'))         return false;

            const nikAyah = getVal('nik_ayah');
            if (nikAyah.length !== 16 || !REGEX_NUMERIK.test(nikAyah)) {
                showError('Format Salah', 'NIK Ayah harus 16 digit angka!');
                return false;
            }
        }

        if (!check('nama_ibu', 'Nama Ibu Kandung'))     return false;
        if (!check('nik_ibu',  'NIK Ibu'))               return false;
        if (!check('tgl_ibu',  'Tanggal Lahir Ibu'))     return false;
        if (!check('hp_ibu',   'No. HP Ibu'))            return false;
        if (!check('st_wali',  'Status Wali Santri'))    return false;

        /* ── Validasi NIK Ibu 16 digit (yang sebelumnya tidak ada) ── */
        const nikIbu = getVal('nik_ibu');
        if (nikIbu.length !== 16 || !REGEX_NUMERIK.test(nikIbu)) {
            showError('Format Salah', 'NIK Ibu harus 16 digit angka!');
            return false;
        }
    }

    /* ── TAB ALAMAT ── */
    if (tabId === 'alamat') {
        const statusAyah       = getVal('st_ayah');
        const domIbu           = getVal('pilih_dom_ibu');
        const domSantri        = getVal('pilih_dom_santri');
        const ayahTdkDiketahui = (statusAyah === 'Tidak Diketahui');

        /* Alamat Ayah — skip jika tidak diketahui */
        if (!ayahTdkDiketahui) {
            if (!check('milik_ayah', 'Status Kepemilikan Rumah Ayah')) return false;
            if (!checkAlamat('ayah', 'Ayah'))                          return false;
        }

        /* Domisili Ibu */
        if (!check('pilih_dom_ibu', 'Pilihan Domisili Ibu')) return false;

        if (ayahTdkDiketahui && domIbu === 'sama') {
            showWarning(
                'Karena <b>Status Ayah = Tidak Diketahui</b>, ' +
                '<b>Domisili Ibu</b> tidak bisa <b>Sama dengan Ayah</b>. ' +
                'Silakan pilih <b>Beda Alamat</b>.'
            );
            return false;
        }

        if (domIbu === 'sama' && !dataAyahLengkap()) {
            showWarning('Alamat <b>Ayah</b> belum lengkap. Tidak bisa pakai <b>Sama dengan Ayah</b>.');
            return false;
        }

        if (domIbu === 'beda' && !checkAlamat('ibu', 'Ibu')) return false;

        /* Domisili Santri */
        if (!check('pilih_dom_santri', 'Pilihan Domisili Santri')) return false;

        if (ayahTdkDiketahui && domSantri === 'sama') {
            showWarning(
                'Karena <b>Status Ayah = Tidak Diketahui</b>, ' +
                '<b>Domisili Santri</b> tidak bisa <b>Sama dengan Ayah</b>. ' +
                'Silakan pilih <b>Mukim</b> atau <b>Beda Alamat</b>.'
            );
            return false;
        }

        if (domSantri === 'sama' && !dataAyahLengkap()) {
            showWarning('Alamat <b>Ayah</b> belum lengkap. Tidak bisa pakai <b>Sama dengan Ayah</b>.');
            return false;
        }

        if ((domSantri === 'beda' || domSantri === 'mukim') && !checkAlamat('santri', 'Santri')) {
            return false;
        }
    }

    /* ── TAB PERNYATAAN ── */
    if (tabId === 'pernyataan') {
        const elCek = getElByName('cek_pernyataan');
        if (!elCek?.checked) {
            Swal.fire({
                title             : 'Persetujuan Diperlukan',
                text              : 'Silakan centang kotak persetujuan sebelum mengirimkan data.',
                icon              : 'warning',
                confirmButtonColor: SWAL_BTN_COLOR
            });
            return false;
        }
    }

    return true;
}


/* ================================================================
   BAGIAN 8 — NAVIGASI TAB
================================================================ */

function dapatkanTabAktif() {
    const aktif = document.querySelector('.tab-content.active');
    return aktif?.id ?? URUTAN_TAB[0];
}

/**
 * Update tampilan tombol Kembali & Lanjut/Simpan
 * Menggunakan index untuk logika yang benar
 */
function perbaruiTombolNavigasi(currentId) {
    const btnPrev   = document.getElementById('btn-global-prev');
    const btnMain   = document.getElementById('btn-global-main');
    const idx       = URUTAN_TAB.indexOf(currentId);
    const isFirst   = idx <= 0;
    const isLast    = idx === URUTAN_TAB.length - 1;

    /* Tombol Kembali — sembunyikan di tab pertama saja */
    if (btnPrev) {
        btnPrev.style.display = isFirst ? 'none' : 'inline-flex';
    }

    /* Tombol Lanjut/Simpan */
    if (btnMain) {
        if (isLast) {
            btnMain.innerHTML = '<i class="fas fa-save fa-lg"></i>&nbsp;Simpan';
            btnMain.className = 'btn-simpan-final';
        } else {
            btnMain.innerHTML = 'Lanjut&nbsp;<i class="fas fa-chevron-circle-right fa-lg"></i>';
            btnMain.className = 'btn-next';
        }
    }

    console.log(
        `📍 Tab aktif: "${currentId}" (idx:${idx})`,
        `| btnPrev: ${isFirst ? 'hidden' : 'visible'}`,
        `| btnMain: ${isLast ? 'Simpan' : 'Lanjut'}`
    );
}

function handleMainAction() {
    const currentId = dapatkanTabAktif();
    if (currentId === URUTAN_TAB[URUTAN_TAB.length - 1]) {
        prosesSimpanFinal();
    } else {
        navigasiMaju();
    }
}

function navigasiMaju() {
    const currentId  = dapatkanTabAktif();
    const currentIdx = URUTAN_TAB.indexOf(currentId);

    if (!validateInput(currentId)) return;

    if (currentIdx < URUTAN_TAB.length - 1) {
        openTab(null, URUTAN_TAB[currentIdx + 1]);
    }
}

function navigasiMundur() {
    const currentId  = dapatkanTabAktif();
    const currentIdx = URUTAN_TAB.indexOf(currentId);

    if (currentIdx > 0) {
        openTab(null, URUTAN_TAB[currentIdx - 1]);
    }
}

function openTab(evt, targetId) {
    /* Sembunyikan semua tab */
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
        tab.classList.remove('active');
    });

    /* Nonaktifkan semua tab-link */
    document.querySelectorAll('.tab-link').forEach(link => {
        link.classList.remove('active');
    });

    /* Tampilkan tab target */
    const targetTab = document.getElementById(targetId);
    if (targetTab) {
        targetTab.style.display = 'block';
        targetTab.classList.add('active');
    } else {
        console.error(`❌ Tab #${targetId} tidak ditemukan di DOM!`);
        return;
    }

    /* Aktifkan tab-link yang sesuai */
    if (evt?.currentTarget) {
        evt.currentTarget.classList.add('active');
    } else {
        const matchLink = document.querySelector(`.tab-link[onclick*="'${targetId}'"]`);
        if (matchLink) matchLink.classList.add('active');
    }

    perbaruiTombolNavigasi(targetId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prosesSimpanFinal() {
    if (validateInput('pernyataan')) {
        handleFormSubmit();
    }
}


/* ================================================================
   BAGIAN 9 — KIRIM WHATSAPP
================================================================ */

function kirimWA(data) {
    /* Ambil nilai dari data object (Firestore) atau dari DOM sebagai fallback */
    const gV = (name) => {
        if (!data) {
            const el = getElById(name);
            return el?.value?.trim() || '-';
        }

        /* Alias field */
        const aliases = {
            nama_santri  : ['nama_santri', 'nama'],
            no_kk        : ['no_kk', 'kk_santri'],
            jenis_kelamin: ['jenis_kelamin', 'jk_santri'],
            cita         : ['cita', 'cita_cita'],
            hobi         : ['hobi', 'hobi_santri'],
            pjk_ibu      : ['pjk_ibu', 'pekerjaan_ibu', 'pkerjaan_ibu']
        };

        const keys = aliases[name] || [name];
        for (const k of keys) {
            if (data[k] !== undefined && data[k] !== null && data[k] !== '') {
                return String(data[k]).trim();
            }
        }
        return '-';
    };

    /* Ambil teks (bukan value) dari select, atau dari data */
    const gT = (nameOrId) => {
        if (data?.[nameOrId] !== undefined) {
            return String(data[nameOrId]).trim() || '-';
        }
        const el = getElById(nameOrId);
        if (el?.tagName === 'SELECT' && el.selectedIndex !== -1) {
            const teks = el.options[el.selectedIndex].text;
            return teks.includes('Pilih') ? '-' : teks;
        }
        return el?.value?.trim() || '-';
    };

    /* Status persetujuan */
    let statusSetuju = '❌ BELUM MENYETUJUI';
    if (data?.['status_setuju'] === 'SETUJU') {
        statusSetuju = '✅ SUDAH MENYETUJUI';
    } else {
        const elCek = getElByName('cek_pernyataan');
        if (elCek?.checked) statusSetuju = '✅ SUDAH MENYETUJUI';
    }

    /* Riwayat sakit */
    let riwayatText = 'Tidak ada';
    if (data?.riwayat_sakit && Array.isArray(data.riwayat_sakit) && data.riwayat_sakit.length > 0) {
        riwayatText = data.riwayat_sakit.join(', ');
    }

    /* Susun pesan WhatsApp */
    const baris = (label, val) => `• ${label}: ${val}\n`;

    let m = '';
    m += `*PENDAFTARAN SANTRI BARU*\n`;
    m += `*DAARUL KHOIROT AL-MADANI*\n`;
    m += `------------------------------------------\n`;
    m += `*🆔 ID SANTRI: ${gV('id_santri')}*\n`;
    m += `------------------------------------------\n\n`;

    m += `*🧒 DATA SANTRI*\n`;
    m += baris('Nama',        gV('nama_santri'));
    m += baris('Unit',        gT('tingkat_unit'));
    m += baris('NIK',         gV('nik'));
    m += baris('No. KK',      gV('no_kk'));
    m += baris('NISN',        gV('nisn'));
    m += baris('Gender',      gV('jenis_kelamin'));
    m += baris('TTL',         `${gV('tmpt_lahir')}, ${gV('tgl_lahir')}`);
    m += baris('Anak Ke',     `${gV('anak_ke')} dari ${gV('jml_saudara')} bersaudara`);
    m += baris('Cita-cita',   gV('cita'));
    m += baris('Hobi',        gV('hobi'));
    m += baris('Keb. Khusus', gV('keb_khusus'));
    m += baris('Disabilitas', gV('disabilitas'));
    m += baris('Biaya Oleh',  gV('biaya'));
    m += '\n';

    m += `*👲 DATA AYAH*\n`;
    m += baris('Status',      gV('st_ayah'));
    m += baris('Nama',        gV('nama_ayah'));
    m += baris('WN',          gV('wn_ayah'));
    m += baris('NIK',         gV('nik_ayah'));
    m += baris('No. KK',      gV('kk_ayah'));
    m += baris('TTL',         `${gV('tmpt_ayah')}, ${gV('tgl_ayah')}`);
    m += baris('Pendidikan',  gV('pdk_ayah'));
    m += baris('Pekerjaan',   gT('pjk_ayah'));
    m += baris('Penghasilan', gV('hasil_ayah'));
    m += baris('No. HP',      gV('hp_ayah'));
    m += '\n';

    m += `*🧕 DATA IBU*\n`;
    m += baris('Status',      gV('st_ibu'));
    m += baris('Nama',        gV('nama_ibu'));
    m += baris('WN',          gV('wn_ibu'));
    m += baris('NIK',         gV('nik_ibu'));
    m += baris('TTL',         `${gV('tmpt_ibu')}, ${gV('tgl_ibu')}`);
    m += baris('Pendidikan',  gV('pdk_ibu'));
    m += baris('Pekerjaan',   gT('pjk_ibu'));
    m += baris('Penghasilan', gV('hasil_ibu'));
    m += baris('No. HP',      gV('hp_ibu'));
    m += '\n';

    m += `*🏡 ALAMAT AYAH*\n`;
    m += baris('Status Milik', gV('milik_ayah'));
    m += `• Alamat: ${gV('al_ayah')}, RT.${gV('rt_ayah')}/RW.${gV('rw_ayah')}\n`;
    m += `  Desa: ${gT('desa_ayah')}, Kec: ${gT('kec_ayah')}\n`;
    m += `• Wilayah: ${gT('kab_ayah')}, ${gT('prov_ayah')}\n\n`;

    m += `*🏠 ALAMAT IBU*\n`;
    m += `• Alamat: ${gV('al_ibu')}, RT.${gV('rt_ibu')}/RW.${gV('rw_ibu')}\n`;
    m += `  Desa: ${gT('desa_ibu')}, Kec: ${gT('kec_ibu')}\n`;
    m += `• Wilayah: ${gT('kab_ibu')}, ${gT('prov_ibu')}\n\n`;

    m += `*🏘️ ALAMAT SANTRI*\n`;
    m += `• Alamat: ${gV('al_santri')}, RT.${gV('rt_santri')}/RW.${gV('rw_santri')}\n`;
    m += `  Desa: ${gT('desa_santri')}, Kec: ${gT('kec_santri')}\n`;
    m += `• Wilayah: ${gT('kab_santri')}, ${gT('prov_santri')}\n\n`;

    m += `*📋 INFORMASI TAMBAHAN*\n`;
    m += baris('Visi',             gV('w_visi'));
    m += baris('Pola',             gV('w_pola'));
    m += baris('Perilaku',         gV('w_perilaku'));
    m += baris('Kondisi Kesehatan',gV('w_sehat'));
    m += baris('Riwayat Penyakit', riwayatText);
    m += baris('Tazir',            gV('w_tazir'));
    m += baris('Harapan',          gV('w_harapan'));
    m += '\n';

    m += `*📝 PERNYATAAN ORANG TUA*\n`;
    m += baris('Status', statusSetuju);
    m += '\n';

    m += `------------------------------------------\n`;
    m += `_Pendaftaran telah disetujui secara digital._\n`;
    m += `_Mohon segera diproses. Terima kasih._`;

    const waUrl = `https://wa.me/${ADMIN_WA}?text=${encodeURIComponent(m)}`;
    window.location.href = waUrl;
}


/* ================================================================
   BAGIAN 10 — DOM READY
================================================================ */

document.addEventListener('DOMContentLoaded', function () {
    console.group('🚀 pendaftaran.js — DOMContentLoaded');

    /* ── 10.1 Fix inline style button-group ── */
    (function fixButtonGroup() {
        const fixAll = () => {
            document.querySelectorAll('.button-group').forEach((el, i) => {
                if (el.hasAttribute('style')) {
                    el.removeAttribute('style');
                    console.log(`✅ Inline style dihapus dari .button-group[${i}]`);
                }
            });
        };

        fixAll();
        setTimeout(fixAll, 300);
        setTimeout(fixAll, 1000);

        /* MutationObserver — cegah style di-inject ulang */
        const target   = document.querySelector('form') || document.body;
        const observer = new MutationObserver(mutations => {
            mutations.forEach(m => {
                if (
                    m.type === 'attributes' &&
                    m.attributeName === 'style' &&
                    m.target.classList?.contains('button-group')
                ) {
                    m.target.removeAttribute('style');
                    console.log('🔄 Inline style button-group dicegah oleh Observer');
                }
            });
        });
        observer.observe(target, {
            attributes    : true,
            attributeFilter: ['style'],
            subtree       : true
        });

        console.log('👁️ MutationObserver button-group aktif');
    })();

    /* ── 10.2 Init Flatpickr ── */
    try {
        if (typeof flatpickr !== 'undefined') {
            const configDaftar = {
                locale           : 'id',
                dateFormat       : 'Y-m-d',
                altInput         : true,
                altFormat        : 'l, d F Y',
                defaultDate      : 'today',
                maxDate          : 'today',
                allowInput       : false,
                disableMobile    : true,
                monthSelectorType: 'static',
                onReady(_d, _s, inst) {
                    inst.altInput?.classList.add('custom-date-input');
                },
                onOpen(_d, _s, inst) {
                    inst.altInput?.closest('.input-icon-wrapper')
                        ?.classList.add('flatpickr-open');
                },
                onClose(_d, _s, inst) {
                    inst.altInput?.closest('.input-icon-wrapper')
                        ?.classList.remove('flatpickr-open');
                }
            };

            const configLahir = {
                locale           : 'id',
                dateFormat       : 'Y-m-d',
                altInput         : true,
                altFormat        : 'l, d F Y',
                maxDate          : 'today',
                minDate          : `${new Date().getFullYear() - 100}-01-01`,
                allowInput       : false,
                disableMobile    : true,
                monthSelectorType: 'dropdown',
                onReady(_d, _s, inst) {
                    inst.altInput?.classList.add('custom-date-input');
                },
                onOpen(_d, _s, inst) {
                    inst.altInput?.closest('.input-icon-wrapper')
                        ?.classList.add('flatpickr-open');
                },
                onClose(_d, _s, inst) {
                    inst.altInput?.closest('.input-icon-wrapper')
                        ?.classList.remove('flatpickr-open');
                }
            };

            flatpickr('#tgl_daftar', configDaftar);
            flatpickr('#tgl_lahir',  configLahir);
            flatpickr('#tgl_ayah',   configLahir);
            flatpickr('#tgl_ibu',    configLahir);

            console.log('✅ Flatpickr berhasil diinisialisasi');
        } else {
            console.warn('⚠️ Flatpickr tidak tersedia');
        }
    } catch (err) {
        console.error('❌ Error init Flatpickr:', err);
    }

    /* ── 10.3 Tutup Flatpickr saat klik di luar ── */
    document.addEventListener('click', function (e) {
        const isInsideCalendar = e.target.closest('.flatpickr-calendar');
        const isInsideInput    = e.target.closest(
            '.flatpickr-input, .custom-date-input, .input-icon-wrapper'
        );

        if (!isInsideCalendar && !isInsideInput) {
            document.querySelectorAll('.flatpickr-input').forEach(inp => {
                if (inp._flatpickr?.isOpen) inp._flatpickr.close();
            });
        }
    });

    /* ── 10.4 Init Custom Dropdown ── */
    try {
        const allSelects = document.querySelectorAll('form select');
        console.log(`📋 Ditemukan ${allSelects.length} elemen select`);

        allSelects.forEach(sel => {
            if (sel.hasAttribute('data-cd')) return;
            sel.setAttribute('data-cd', 'true');

            /* Set placeholder dari option pertama */
            const firstOpt = sel.options?.[0];
            if (firstOpt && (!firstOpt.value || firstOpt.value === '')) {
                sel.setAttribute('data-cd-placeholder', firstOpt.textContent.trim());
            }

            /* Aktifkan fitur search untuk dropdown wilayah */
            const name = sel.getAttribute('name') || '';
            if (/^(prov|kab|kec|desa)_/.test(name)) {
                sel.setAttribute('data-cd-search', 'true');
            }
        });

        if (typeof CustomDropdown !== 'undefined') {
            CustomDropdown.init();
            console.log('✅ Custom Dropdown diinisialisasi');
        } else {
            console.warn('⚠️ CustomDropdown tidak tersedia');
        }
    } catch (err) {
        console.error('❌ Error init Custom Dropdown:', err);
    }

    /* ── 10.5 Load Provinsi Ayah ── */
    try {
        loadWilayah('provinces', 'prov_ayah', 'Pilih Provinsi');
    } catch (err) {
        console.error('❌ Error load provinsi ayah:', err);
    }

    /* ── 10.6 Menu Toggle (Mobile Navbar) ── */
    try {
        const menuToggle = document.getElementById('menu-toggle');
        const nav        = document.querySelector('nav');

        if (menuToggle && nav) {
            menuToggle.addEventListener('click', e => {
                e.stopPropagation();
                nav.classList.toggle('show');
            });

            /* Tandai menu item yang aktif */
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            nav.querySelectorAll('ul li a').forEach(link => {
                if (link.getAttribute('href') === currentPage) {
                    link.classList.add('active');
                }
                link.addEventListener('click', () => nav.classList.remove('show'));
            });

            /* Tutup menu saat klik di luar */
            document.addEventListener('click', e => {
                if (!nav.contains(e.target) && e.target !== menuToggle) {
                    nav.classList.remove('show');
                }
            });

            console.log('✅ Menu toggle aktif');
        } else {
            console.warn('⚠️ #menu-toggle atau nav tidak ditemukan');
        }
    } catch (err) {
        console.error('❌ Error menu toggle:', err);
    }

    /* ── 10.7 Validasi real-time 16 digit (NIK/KK) ── */
    try {
        const REGEX_NUM = /^\d+$/;

        const pasangValidasi = (inputId, errorId, label) => {
            const inputEl = document.getElementById(inputId);
            const errorEl = document.getElementById(errorId);
            if (!inputEl || !errorEl) return;

            inputEl.addEventListener('input', () => {
                const val = inputEl.value.trim();

                if (val === '') {
                    inputEl.classList.remove('input-error', 'input-success');
                    errorEl.style.display = 'none';
                    return;
                }

                const valid = val.length === 16 && REGEX_NUM.test(val);
                inputEl.classList.toggle('input-error',   !valid);
                inputEl.classList.toggle('input-success',  valid);
                errorEl.textContent  = valid ? '' : `${label} harus berupa 16 digit angka!`;
                errorEl.style.display = valid ? 'none' : 'block';
            });
        };

        pasangValidasi('nikSantri', 'errorNikSantri', 'NIK Santri');
        pasangValidasi('kkAyah',    'errorKkAyah',    'Nomor KK');
        pasangValidasi('nikAyah',   'errorNikAyah',   'NIK Ayah');

        console.log('✅ Validasi 16 digit terpasang');
    } catch (err) {
        console.error('❌ Error validasi 16 digit:', err);
    }

    /* ── 10.8 Set tombol navigasi awal ── */
    try {
        perbaruiTombolNavigasi(dapatkanTabAktif());
    } catch (err) {
        console.warn('⚠️ Gagal set tombol navigasi awal:', err);
    }

    console.groupEnd();
});


/* ================================================================
   BAGIAN 11 — EXPOSE KE WINDOW
   (Diperlukan untuk onclick="..." di HTML)
================================================================ */
Object.assign(window, {
    /* Firebase & ID */
    handleFormSubmit,
    generateIdSantri,

    /* Wilayah */
    loadWilayah,
    loadKabAyah,   loadKecAyah,   loadDesaDanPosAyah,
    loadKabIbu,    loadKecIbu,    loadDesaDanPosIbu,
    loadKabSantri, loadKecSantri, loadDesaDanPosSantri,

    /* Alamat */
    lockFields,
    resetFields,
    dataAyahLengkap,
    copyDataAlamat,
    toggleDomisiliIbu,
    toggleDomisiliSantri,

    /* Toggle Fields */
    toggleAyahFields,
    handleStatusAyah,
    handleNoNISN,
    toggleHP,
    toggleRiwayat,

    /* Navigasi */
    validateInput,
    openTab,
    navigasiMaju,
    navigasiMundur,
    handleMainAction,
    prosesSimpanFinal,
    dapatkanTabAktif,
    perbaruiTombolNavigasi,

    /* WhatsApp */
    kirimWA,

    /* Helper */
    refreshCD,
    getElByName,
    getVal
});