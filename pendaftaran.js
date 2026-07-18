/* Helper untuk refresh custom dropdown */
function refreshCD(el) {
    if (typeof CustomDropdown !== "undefined" && el) {
        CustomDropdown.refresh(el);
    }
}

/* ================================================================
   PENDAFTARAN.JS — Daarul Khoirot Almadani
   Versi Final — Bersih & Terorganisir
   ================================================================ */


/* =========================================================
   1. HANDLE FORM SUBMIT (Simpan ke Firebase Firestore)
========================================================= */
async function handleFormSubmit(event) {
    if (event) event.preventDefault();
    const form = document.getElementById('formPendaftaran');

    Swal.fire({
        title: 'Sedang Menyimpan...',
        text: 'Memproses data dan mengompres foto...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
    });

    try {
        const formData = new FormData(form);
        let dataFinal = {};

        const getTeks = (idOrName) => {
            const el = document.getElementById(idOrName) || document.getElementsByName(idOrName)[0];
            if (!el) return "-";
            if (el.tagName === 'SELECT') {
                return el.selectedIndex !== -1 ? el.options[el.selectedIndex].text : "-";
            }
            return el.value || "-";
        };

        // 1. Ambil seluruh data input berbasis atribut 'name'
        formData.forEach((value, key) => {
            if (!(value instanceof File) && !key.startsWith('riwayat_sakit')) {
                dataFinal[key] = value;
            }
        });

        // 2. Ambil paksa nama_santri secara manual jika FormData melewatkannya
        const inputNamaSantri = document.getElementsByName('nama_santri')[0] || document.getElementById('nama_santri');
        if (inputNamaSantri && inputNamaSantri.value) {
            dataFinal['nama_santri'] = inputNamaSantri.value;
        }

        // 3. Ambil Checkbox Riwayat Sakit
        const riwayatList = form.querySelectorAll('input[name="riwayat_sakit[]"]:checked');
        let arraySakit = Array.from(riwayatList).map(el => el.value);

        if (dataFinal['w_sehat'] === "Sehat" || arraySakit.length === 0) {
            dataFinal['riwayat_sakit'] = ["Tidak Ada / Sehat"];
        } else {
            dataFinal['riwayat_sakit'] = arraySakit;
        }

        // 4. Konversi kode wilayah jadi teks nama
        const listWilayah = [
            'prov_ayah', 'kab_ayah', 'kec_ayah', 'desa_ayah',
            'prov_ibu', 'kab_ibu', 'kec_ibu', 'desa_ibu',
            'prov_santri', 'kab_santri', 'kec_santri', 'desa_santri',
            'pjk_ibu', 'pjk_ayah', 'tingkat_unit'
        ];
        listWilayah.forEach(field => {
            const teks = getTeks(field);
            if (teks && !teks.includes("-- Pilih")) dataFinal[field] = teks;
        });

        // 5. Kompresi foto KK & Ijazah
        const options = { maxSizeMB: 0.1, maxWidthOrHeight: 1024, useWebWorker: true };
        const toBase64 = f => new Promise((res, rej) => {
            const r = new FileReader();
            r.readAsDataURL(f);
            r.onload = () => res(r.result);
            r.onerror = e => rej(e);
        });

        const fKK = document.getElementsByName('up_kk')[0]?.files[0];
        if (fKK) {
            const comp = await imageCompression(fKK, options);
            dataFinal['file_kk_data'] = await toBase64(comp);
        }

        const fIjazah = document.getElementsByName('up_ijazah')[0]?.files[0];
        if (fIjazah) {
            const comp = await imageCompression(fIjazah, options);
            dataFinal['file_ijazah_data'] = await toBase64(comp);
        }

        // 6. Status persetujuan
        const elPernyataan = document.getElementsByName('cek_pernyataan')[0];
        if (elPernyataan) {
            dataFinal['status_setuju'] = elPernyataan.checked ? "SETUJU" : "TIDAK SETUJU";
        }

        // 7. Bersihkan properti sampah
        delete dataFinal['up_kk'];
        delete dataFinal['up_ijazah'];
        delete dataFinal['cek_pernyataan'];
        delete dataFinal['riwayat_sakit[]'];
        dataFinal['waktu_simpan'] = new Date().toISOString();

        // 8. Simpan ke Firebase (pakai window.firebaseDB dari HTML)
        if (!window.firebaseDB || !window.firebaseAddDoc || !window.firebaseCollection) {
            throw new Error("Firebase belum siap. Cek script module di HTML.");
        }

        const docRef = await window.firebaseAddDoc(
            window.firebaseCollection(window.firebaseDB, "pendaftaran_santri"),
            dataFinal
        );

        if (docRef.id) {
            Swal.fire('Berhasil!', 'Data pendaftaran tersimpan.', 'success').then(() => {
                if (typeof window.kirimWA === "function") window.kirimWA(dataFinal);
                form.reset();
                location.reload();
            });
        }
    } catch (error) {
        console.error("Firebase Error:", error);
        Swal.fire('Gagal Simpan ke Firebase!', error.message, 'error');
    }
}


/* =========================================================
   2. HELPER GLOBAL
========================================================= */
function getEl(name) {
    return document.getElementsByName(name)[0];
}

function getElByName(name, suffix = '') {
    if (suffix) {
        const box = document.querySelector(`[name="box_${suffix}"]`);
        return box ? box.querySelector(`[name="${name}"]`) : null;
    }
    return document.getElementsByName(name)[0];
}


/* =========================================================
   3. MAPPING KODE POS KARAWANG
========================================================= */
const mappingPosKarawang = {
    "3215010": "41311", "3215011": "41361", "3215012": "41361", "3215013": "41361",
    "3215020": "41314", "3215021": "41361", "3215030": "41315", "3215040": "41363",
    "3215050": "41361", "3215060": "41375", "3215070": "41374", "3215080": "41384",
    "3215090": "41383", "3215100": "41373", "3215110": "41371", "3215120": "41372",
    "3215130": "41381", "3215140": "41382", "3215150": "41353", "3215160": "41354",
    "3215170": "41352", "3215180": "41351", "3215190": "41353", "3215200": "41355",
    "3215210": "41351", "3215220": "41351", "3215230": "41351", "3215240": "41384",
    "3215250": "41311", "3215260": "41311", "3215022": "41361", "3215014": "41316",
    "3215161": "41354", "3215051": "41361"
};


/* =========================================================
   4. LOAD WILAYAH (API Emsifa)
========================================================= */
async function loadWilayah(endpoint, elementName, placeholder) {
    const el = getEl(elementName);
    if (!el) {
        console.error(`Elemen "${elementName}" tidak ditemukan`);
        return;
    }

    el.innerHTML = '<option value="">Loading...</option>';
    el.disabled = true;

    // ⭐ Refresh custom dropdown (biar text "Loading..." muncul)
    if (typeof CustomDropdown !== "undefined") {
        CustomDropdown.refresh(el);
    }

    const url = `https://www.emsifa.com/api-wilayah-indonesia/api/${endpoint}.json`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Gagal load API");
        const data = await res.json();

        let opt = `<option value="${placeholder === 'Pilih Provinsi' ? 'provinces_init_val' : ''}">${placeholder}</option>`;
        data.forEach(d => {
            opt += `<option value="${d.id}">${d.name}</option>`;
        });
        el.innerHTML = opt;
        el.disabled = false;

        // ⭐ Refresh custom dropdown SETELAH data terisi
        if (typeof CustomDropdown !== "undefined") {
            CustomDropdown.refresh(el);
        }
    } catch (err) {
        console.error("ERROR API:", err);
        el.innerHTML = `<option value="">Gagal memuat data</option>`;
        if (typeof CustomDropdown !== "undefined") {
            CustomDropdown.refresh(el);
        }
    }
}

/* ---------- WILAYAH AYAH ---------- */
function loadKabAyah(val) {
    getEl('kab_ayah').innerHTML = '<option value="">Pilih Kabupaten</option>';
    getEl('kec_ayah').innerHTML = '<option value="">Pilih Kecamatan</option>';
    getEl('desa_ayah').innerHTML = '<option value="">Pilih Desa</option>';


    // ⭐ Refresh
    refreshCD(kab); refreshCD(kec); refreshCD(desa);

    const inputPos = getEl('pos_ayah');
    if (inputPos) inputPos.value = "";
    if (val && val !== "provinces_init_val") loadWilayah(`regencies/${val}`, 'kab_ayah', 'Pilih Kabupaten');
}

function loadKecAyah(val) {
    getEl('kec_ayah').innerHTML = '<option value="">Pilih Kecamatan</option>';
    getEl('desa_ayah').innerHTML = '<option value="">Pilih Desa</option>';
    const inputPos = getEl('pos_ayah');
    if (inputPos) inputPos.value = "";
    if (val) loadWilayah(`districts/${val}`, 'kec_ayah', 'Pilih Kecamatan');
}

function loadDesaDanPosAyah(val) {
    if (!val) return;
    loadWilayah(`villages/${val}`, 'desa_ayah', 'Pilih Desa');

    const inputPos = document.getElementsByName('pos_ayah')[0];
    if (inputPos) {
        const kodeAuto = mappingPosKarawang[val];
        if (kodeAuto) {
            inputPos.value = kodeAuto;
            inputPos.readOnly = true;
            inputPos.style.backgroundColor = "#f0f0f0";
            inputPos.style.color = "#6c757d";
        } else {
            inputPos.value = "";
            inputPos.readOnly = false;
            inputPos.style.backgroundColor = "#ffffff";
            inputPos.style.color = "#000000";
            inputPos.placeholder = "Isi Kode Pos Manual";
        }
    }
}

/* ---------- WILAYAH IBU ---------- */
function loadKabIbu(val) {
    if (val && val !== "provinces_init_val") loadWilayah(`regencies/${val}`, 'kab_ibu', 'Pilih Kabupaten');
}

function loadKecIbu(val) {
    if (val) loadWilayah(`districts/${val}`, 'kec_ibu', 'Pilih Kecamatan');
}

function loadDesaDanPosIbu(val) {
    if (val) {
        loadWilayah(`villages/${val}`, 'desa_ibu', 'Pilih Desa');
        const inputPos = document.getElementsByName('pos_ibu')[0];
        if (inputPos) inputPos.value = mappingPosKarawang[val] || "";
    }
}

/* ---------- WILAYAH SANTRI ---------- */
function loadKabSantri(val) {
    if (val && val !== "provinces_init_val") loadWilayah(`regencies/${val}`, 'kab_santri', 'Pilih Kabupaten');
}

function loadKecSantri(val) {
    if (val) loadWilayah(`districts/${val}`, 'kec_santri', 'Pilih Kecamatan');
}

function loadDesaDanPosSantri(val) {
    if (val) {
        loadWilayah(`villages/${val}`, 'desa_santri', 'Pilih Desa');
        const inputPos = document.getElementsByName('pos_santri')[0];
        if (inputPos) inputPos.value = mappingPosKarawang[val] || "";
    }
}


/* =========================================================
   5. LOCK / RESET / COPY / DOMISILI
========================================================= */
function lockFields(suffix, isLocked) {
    const dropdowns = [`prov_${suffix}`, `kab_${suffix}`, `kec_${suffix}`, `desa_${suffix}`];
    dropdowns.forEach(name => {
        const el = getElByName(name, suffix);
        if (el) {
            el.disabled = isLocked;
            el.style.backgroundColor = isLocked ? "#f0f0f0" : "#ffffff";
        }
    });

    const inputs = [`al_${suffix}`, `rt_${suffix}`, `rw_${suffix}`, `pos_${suffix}`];
    inputs.forEach(name => {
        const el = getElByName(name, suffix);
        if (el) {
            if (isLocked) el.setAttribute('readonly', 'true');
            else el.removeAttribute('readonly');
            el.style.backgroundColor = isLocked ? "#f8f9fa" : "#ffffff";
            el.style.color = isLocked ? "#6c757d" : "#000000";
            el.style.cursor = isLocked ? "not-allowed" : "text";
        }
    });
}

function resetFields(suffix) {
    const dropdowns = [`prov_${suffix}`, `kab_${suffix}`, `kec_${suffix}`, `desa_${suffix}`];
    dropdowns.forEach(name => {
        const el = getElByName(name, suffix);
        if (el) el.innerHTML = `<option value="">Pilih Data</option>`;
refreshCD(el); // ⭐ Refresh
        }
    });
    const inputs = [`al_${suffix}`, `rt_${suffix}`, `rw_${suffix}`, `pos_${suffix}`];
    inputs.forEach(name => {
        const el = getElByName(name, suffix);
        if (el) el.value = "";
    });
}

function dataAyahLengkap() {
    const prov   = getElByName('prov_ayah')?.value;
    const kab    = getElByName('kab_ayah')?.value;
    const kec    = getElByName('kec_ayah')?.value;
    const desa   = getElByName('desa_ayah')?.value;
    const alamat = getElByName('al_ayah')?.value?.trim();
    const rt     = getElByName('rt_ayah')?.value?.trim();
    const rw     = getElByName('rw_ayah')?.value?.trim();
    const pos    = getElByName('pos_ayah')?.value?.trim();
    return !!(prov && prov !== "provinces_init_val" && kab && kec && desa && alamat && rt && rw && pos);
}

function copyDataAlamat(from, to) {
    const fields = ['al', 'rt', 'rw', 'pos', 'prov', 'kab', 'kec', 'desa'];
    fields.forEach(f => {
        const sourceEl = getElByName(`${f}_${from}`);
        const targetEl = getElByName(`${f}_${to}`);
        if (sourceEl && targetEl) {
            if (sourceEl.tagName === 'SELECT') {
                if (sourceEl.selectedIndex >= 0) {
                    targetEl.innerHTML = `<option value="${sourceEl.value}">${sourceEl.options[sourceEl.selectedIndex].text}</option>`;
                    targetEl.value = sourceEl.value;
refreshCD(targetEl); // ⭐ Refresh
                
                }
            } else {
                targetEl.value = sourceEl.value || "";
            }
        }
    });
}

function isiAlamatPesantren() {
    const d = {
        prov: "32", prov_text: "JAWA BARAT",
        kab: "3215", kab_text: "KABUPATEN KARAWANG",
        kec: "321516", kec_text: "JATISARI",
        desa: "3215162001", desa_text: "JATISARI",
        al: "Dusun Sukamaju II", rt: "002", rw: "004", pos: "41374"
    };
    const setSel = (n, v, t) => {
        const el = getElByName(n);
        if (el) { el.innerHTML = `<option value="${v}">${t}</option>`; el.value = v;
refreshCD(el); // ⭐ Refresh
                 }
    };
    setSel('prov_santri', d.prov, d.prov_text);
    setSel('kab_santri', d.kab, d.kab_text);
    setSel('kec_santri', d.kec, d.kec_text);
    setSel('desa_santri', d.desa, d.desa_text);
    if (getElByName('al_santri')) getElByName('al_santri').value = d.al;
    if (getElByName('rt_santri')) getElByName('rt_santri').value = d.rt;
    if (getElByName('rw_santri')) getElByName('rw_santri').value = d.rw;
    if (getElByName('pos_santri')) getElByName('pos_santri').value = d.pos;
}

function toggleDomisiliIbu(val) {
    const box = getElByName('box_ibu');
    if (box) box.style.display = (val === "") ? 'none' : 'grid';

    if (val === 'sama') {
        if (!dataAyahLengkap()) {
            Swal.fire({
                icon: 'warning',
                title: 'Peringatan',
                text: 'Lengkapi Alamat Ayah terlebih dahulu',
                confirmButtonColor: '#2d6a4f'
            });
            const elDomIbu = getElByName('pilih_dom_ibu');
            if (elDomIbu) elDomIbu.value = "";
            if (box) box.style.display = 'none';
            return;
        }
        copyDataAlamat('ayah', 'ibu');
        lockFields('ibu', true);
    } else if (val === 'beda') {
        lockFields('ibu', false);
        resetFields('ibu');
        const provIbuEl = getElByName('prov_ibu');
        if (provIbuEl) {
            provIbuEl.id = "prov_ibu_temp";
            loadWilayah('provinces', 'prov_ibu_temp', 'Pilih Provinsi');
        }
    }
}

function toggleDomisiliSantri(val) {
    const box = getElByName('box_santri');
    if (box) box.style.display = (val === "") ? 'none' : 'grid';

    if (val === 'mukim') {
        isiAlamatPesantren();
        lockFields('santri', true);
    } else if (val === 'sama') {
        if (!dataAyahLengkap()) {
            Swal.fire({
                icon: 'warning',
                title: 'Peringatan',
                text: 'Lengkapi Alamat Ayah Terlebih Dahulu (Provinsi s/d Kode Pos)',
                confirmButtonColor: '#2d6a4f'
            });
            const elDomSantri = getElByName('pilih_dom_santri');
            if (elDomSantri) elDomSantri.value = "";
            if (box) box.style.display = 'none';
            return;
        }
        copyDataAlamat('ayah', 'santri');
        lockFields('santri', true);
    } else if (val === 'beda') {
        resetFields('santri');
        lockFields('santri', false);
        const provSantriEl = getElByName('prov_santri');
        if (provSantriEl) {
            provSantriEl.id = "prov_santri_temp";
            loadWilayah('provinces', 'prov_santri_temp', 'Pilih Provinsi');
        }
    }
}


/* =========================================================
   6. TOGGLE FIELDS (Ayah / NISN / HP / Riwayat Kesehatan)
========================================================= */
function toggleAyahFields(status) {
    const fields = ['wn_ayah','nik_ayah','kk_ayah','tmpt_ayah','tgl_ayah','pdk_ayah','pjk_ayah','hasil_ayah','hp_ayah'];
    const isLocked = (status === 'Meninggal' || status === 'Tidak Diketahui');

    fields.forEach(name => {
        const el = document.getElementsByName(name)[0];
        if (!el) return;

        if (isLocked) {
            if (el.type === 'date' || el.tagName === 'SELECT') el.value = "";
            else el.value = "-";

            if (el.tagName === 'SELECT') el.disabled = true;
            else el.readOnly = true;

            el.style.backgroundColor = "#e9ecef";
            el.style.color = "#6c757d";
            el.style.opacity = "0.7";
        } else {
            if (el.value === "-") el.value = "";

            if (el.tagName === 'SELECT') el.disabled = false;
            else el.readOnly = false;

            el.style.backgroundColor = "#ffffff";
            el.style.color = "#000000";
            el.style.opacity = "1";
        }
    });
}

function handleNoNISN(checked) {
    const el = document.getElementsByName('nisn')[0];
    if (!el) return;
    if (checked) {
        el.value = '0000000000';
        el.readOnly = true;
        el.style.backgroundColor = '#e9ecef';
        el.style.color = '#6c757d';
        el.style.cursor = 'not-allowed';
    } else {
        el.value = '';
        el.readOnly = false;
        el.style.backgroundColor = '#ffffff';
        el.style.color = '#000000';
        el.style.cursor = 'text';
    }
}

function toggleHP(cb, inputName) {
    const el = document.getElementsByName(inputName)[0];
    if (!el) return;
    if (cb.checked) {
        el.value = 'TIDAK MEMILIKI';
        el.readOnly = true;
        el.style.backgroundColor = '#e9ecef';
        el.style.color = '#6c757d';
        el.style.cursor = 'not-allowed';
    } else {
        el.value = '';
        el.readOnly = false;
        el.style.backgroundColor = '#ffffff';
        el.style.color = '#000000';
        el.style.cursor = 'text';
    }
}

function toggleRiwayat() {
    const sel = document.getElementById("selectKesehatan");
    const div = document.getElementById("divRiwayatSakit");
    if (!sel || !div) return;
    div.style.display = (sel.value === "Pernah Sakit") ? "block" : "none";
}


/* =========================================================
   7. VALIDASI INPUT PER TAB
========================================================= */
function validateInput(tabId) {
    const isNumeric = /^\d+$/;

    const showWarningAlert = (message) => {
        Swal.fire({
            title: 'Data Belum Lengkap',
            html: message,
            icon: 'warning',
            iconColor: '#bc6c25',
            confirmButtonText: 'Lengkapi Data',
            confirmButtonColor: '#1a5319',
            background: '#ffffff'
        });
    };

    const check = (name, label) => {
        const el = document.getElementsByName(name)[0] || document.getElementById(name);
        if (!el) {
            console.error(`Elemen '${name}' tidak ditemukan!`);
            return false;
        }
        const val = el.value ? el.value.trim() : "";
        if (val === "" || val.includes("-- Pilih")) {
            showWarningAlert(`Field <b>${label}</b> wajib diisi dengan benar!`);
            return false;
        }
        return true;
    };

    if (tabId === 'info') return true;

    if (tabId === 'santri') {
        if (!check('tgl_daftar', 'Tanggal Pendaftaran')) return false;
        if (!check('nama_santri', 'Nama Lengkap Santri')) return false;
        if (!check('tingkat_unit', 'Pilihan Unit & Kelas')) return false;
        if (!check('nik', 'NIK')) return false;
        if (!check('no_kk', 'Nomor KK')) return false;
        if (!check('jenis_kelamin', 'Jenis Kelamin')) return false;

        const nikVal = document.getElementsByName('nik')[0]?.value || "";
        if (nikVal.length !== 16 || !isNumeric.test(nikVal)) {
            Swal.fire({ title: 'Format Salah', text: 'NIK Santri harus 16 digit angka!', icon: 'error', confirmButtonColor: '#1a5319' });
            return false;
        }
    }

    if (tabId === 'ortu') {
        const statusAyah = document.getElementsByName('st_ayah')[0]?.value;
        if (!check('nama_ayah', 'Nama Ayah Kandung')) return false;
        if (!check('st_ayah', 'Status Ayah')) return false;

        if (statusAyah === 'Masih Hidup') {
            if (!check('nik_ayah', 'NIK Ayah')) return false;
            if (!check('kk_ayah', 'Nomor KK Ayah')) return false;
            if (!check('pjk_ayah', 'Pekerjaan Utama Ayah')) return false;
            if (!check('hasil_ayah', 'Penghasilan Ayah')) return false;
            if (!check('hp_ayah', 'No Handphone Ayah')) return false;

            const nikA = document.getElementsByName('nik_ayah')[0]?.value || "";
            if (nikA.length !== 16 || !isNumeric.test(nikA)) {
                Swal.fire({ title: 'Format Salah', text: 'NIK Ayah harus 16 digit angka!', icon: 'error', confirmButtonColor: '#1a5319' });
                return false;
            }
        }

        if (!check('nama_ibu', 'Nama Ibu Kandung')) return false;
        if (!check('nik_ibu', 'NIK Ibu')) return false;
        if (!check('tgl_ibu', 'Tanggal Lahir Ibu')) return false;
        if (!check('hp_ibu', 'No Handphone Ibu')) return false;
        if (!check('st_wali', 'Status Wali Santri')) return false;
    }

    if (tabId === 'alamat') {
        if (!check('milik_ayah', 'Status Kepemilikan Rumah')) return false;
        if (!check('prov_ayah', 'Provinsi')) return false;
        if (!check('kab_ayah', 'Kabupaten')) return false;
        if (!check('al_ayah', 'Alamat Jalan/Kampung')) return false;
        if (!check('pilih_dom_ibu', 'Pilihan Domisili Ibu')) return false;
        if (!check('pilih_dom_santri', 'Pilihan Domisili Santri')) return false;
    }

    if (tabId === 'pernyataan') {
        const elCek = document.getElementsByName('cek_pernyataan')[0];
        if (!elCek || !elCek.checked) {
            Swal.fire({ title: 'Persetujuan Diperlukan', text: 'Silakan centang kotak persetujuan sebelum mengirimkan data.', icon: 'warning', confirmButtonColor: '#1a5319' });
            return false;
        }
    }

    return true;
}


/* =========================================================
   8. NAVIGASI TAB
========================================================= */
const urutanTab = ['info', 'santri', 'ortu', 'alamat', 'pernyataan'];

function dapatkanTabAktif() {
    const currentTab = document.querySelector('.tab-content.active');
    return currentTab ? currentTab.id : 'info';
}

function perbaruiTombolNavigasi(currentId) {
    const btnPrev = document.getElementById('btn-global-prev');
    const btnMain = document.getElementById('btn-global-main');

    if (btnPrev) {
        btnPrev.style.display = (currentId === 'info' || currentId === 'santri') ? 'none' : 'flex';
    }

    if (btnMain) {
        if (currentId === 'pernyataan') {
            btnMain.innerHTML = '<i class="fas fa-save fa-lg"></i> Simpan';
            btnMain.className = 'btn-simpan-final';
        } else {
            btnMain.innerHTML = 'Lanjut <i class="fas fa-chevron-circle-right fa-lg"></i>';
            btnMain.className = 'btn-next';
        }
    }
}

function handleMainAction() {
    const currentId = dapatkanTabAktif();
    if (currentId === 'pernyataan') {
        prosesSimpanFinal();
    } else {
        navigasiMaju();
    }
}

function navigasiMaju() {
    const currentId = dapatkanTabAktif();
    const currentIndex = urutanTab.indexOf(currentId);
    if (validateInput(currentId)) {
        if (currentIndex < urutanTab.length - 1) {
            openTab(null, urutanTab[currentIndex + 1]);
        }
    }
}

function navigasiMundur() {
    const currentId = dapatkanTabAktif();
    const currentIndex = urutanTab.indexOf(currentId);
    if (currentIndex > 0) {
        openTab(null, urutanTab[currentIndex - 1]);
    }
}

function openTab(evt, targetId) {
    const tabcontents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabcontents.length; i++) {
        tabcontents[i].style.display = "none";
        tabcontents[i].classList.remove("active");
    }

    const tablinks = document.getElementsByClassName("tab-link");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    const targetTab = document.getElementById(targetId);
    if (targetTab) {
        targetTab.style.display = "block";
        targetTab.classList.add("active");
    } else {
        console.error("Tab dengan ID '" + targetId + "' tidak ditemukan!");
    }

    if (evt && evt.currentTarget) {
        evt.currentTarget.classList.add('active');
    } else {
        const autoBtn = document.querySelector(`.tab-link[onclick*="'${targetId}'"]`);
        if (autoBtn) autoBtn.classList.add('active');
    }

    perbaruiTombolNavigasi(targetId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prosesSimpanFinal() {
    if (validateInput('pernyataan')) {
        if (typeof handleFormSubmit === "function") {
            handleFormSubmit();
        } else {
            console.error("Fungsi handleFormSubmit tidak ditemukan!");
        }
    }
}


/* =========================================================
   9. KIRIM WHATSAPP (Setelah data tersimpan)
========================================================= */
function kirimWA(data) {
    const gV = (name) => {
        if (data) {
            if (name === 'nama' || name === 'nama_santri') return (data['nama_santri'] || data['nama'] || "-").trim();
            if (name === 'no_kk' || name === 'kk_santri') return (data['no_kk'] || data['kk_santri'] || "-").trim();
            if (name === 'jenis_kelamin' || name === 'jk_santri') return (data['jenis_kelamin'] || data['jk_santri'] || "-").trim();
            if (name === 'cita' || name === 'cita_cita') return (data['cita'] || data['cita_cita'] || "-").trim();
            if (name === 'hobi' || name === 'hobi_santri') return (data['hobi'] || data['hobi_santri'] || "-").trim();
            if (name === 'pjk_ibu' || name === 'pekerjaan_ibu' || name === 'pkerjaan_ibu') {
                return (data['pjk_ibu'] || data['pekerjaan_ibu'] || data['pkerjaan_ibu'] || "-").trim();
            }
            return data[name] !== undefined ? String(data[name]).trim() : "-";
        }
        const el = document.getElementsByName(name)[0] || document.getElementsByName('nama_santri')[0];
        return el ? (el.value.trim() || "-") : "-";
    };

    const gT = (idOrName) => {
        if (data && data[idOrName] !== undefined) {
            return data[idOrName] ? String(data[idOrName]).trim() : "-";
        }
        const el = document.getElementById(idOrName) || document.getElementsByName(idOrName)[0];
        if (el && el.tagName === 'SELECT' && el.selectedIndex !== -1) {
            const teks = el.options[el.selectedIndex].text;
            return teks.includes("Pilih") ? "-" : teks;
        }
        return el ? (el.value.trim() || "-") : "-";
    };

    let status_setuju = "❌ BELUM MENYETUJUI";
    if (data && data['status_setuju'] === "SETUJU") {
        status_setuju = "✅ SUDAH MENYETUJUI";
    } else {
        const elCek = document.getElementsByName('cek_pernyataan')[0];
        if (elCek && elCek.checked) status_setuju = "✅ SUDAH MENYETUJUI";
    }

    const ICON_SANTRI = "🧒", ICON_AYAH = "👲", ICON_IBU = "🧕";
    const RUMAH_AYAH = "🏡", RUMAH_IBU = "🏠", RUMAH_SANTRI = "🏘️";
    const CLIP = "📋", ICON_MEMO = "📝";

    let m = "*PENDAFTARAN SANTRI BARU*\n";
    m += "*DAARUL KHOIROT AL-MADANI*\n";
    m += "------------------------------------------\n\n";

    m += `*${ICON_SANTRI} DATA SANTRI*\n`;
    m += "• Nama: " + gV('nama_santri') + "\n";
    m += "• Unit: " + gT('tingkat_unit') + "\n";
    m += "• NIK: " + gV('nik') + "\n";
    m += "• No. KK: " + gV('no_kk') + "\n";
    m += "• NISN: " + gV('nisn') + "\n";
    m += "• Gender: " + gV('jenis_kelamin') + "\n";
    m += "• TTL: " + gV('tmpt_lahir') + ", " + gV('tgl_lahir') + "\n";
    m += "• Anak Ke: " + gV('anak_ke') + " dari " + gV('jml_saudara') + " bersaudara\n";
    m += "• Cita-cita: " + gV('cita') + "\n";
    m += "• Hobi: " + gV('hobi') + "\n";
    m += "• Keb. Khusus: " + gV('keb_khusus') + "\n";
    m += "• Disabilitas: " + gV('disabilitas') + "\n";
    m += "• Biaya Oleh: " + gV('biaya') + "\n\n";

    m += `*${ICON_AYAH} DATA AYAH*\n`;
    m += "• Status: " + gV('st_ayah') + "\n";
    m += "• Nama Ayah: " + gV('nama_ayah') + "\n";
    m += "• WN: " + gV('wn_ayah') + "\n";
    m += "• NIK Ayah: " + gV('nik_ayah') + "\n";
    m += "• KK Ayah: " + gV('kk_ayah') + "\n";
    m += "• TTL: " + gV('tmpt_ayah') + ", " + gV('tgl_ayah') + "\n";
    m += "• Pendidikan: " + gV('pdk_ayah') + "\n";
    m += "• Pekerjaan: " + gV('pjk_ayah') + "\n";
    m += "• Penghasilan: " + gV('hasil_ayah') + "\n";
    m += "• No. HP: " + gV('hp_ayah') + "\n\n";

    m += `*${ICON_IBU} DATA IBU*\n`;
    m += "• Status: " + gV('st_ibu') + "\n";
    m += "• Nama Ibu: " + gV('nama_ibu') + "\n";
    m += "• WN: " + gV('wn_ibu') + "\n";
    m += "• NIK Ibu: " + gV('nik_ibu') + "\n";
    m += "• TTL: " + gV('tmpt_ibu') + ", " + gV('tgl_ibu') + "\n";
    m += "• Pendidikan: " + gV('pdk_ibu') + "\n";
    m += "• Pekerjaan: " + gV('pjk_ibu') + "\n";
    m += "• Penghasilan: " + gV('hasil_ibu') + "\n";
    m += "• No. HP: " + gV('hp_ibu') + "\n\n";

    m += `*${RUMAH_AYAH} ALAMAT AYAH*\n`;
    m += "• Status Milik: " + gV('milik_ayah') + "\n";
    m += "• Alamat: " + gV('al_ayah') + ", RT." + gV('rt_ayah') + "/RW." + gV('rw_ayah') + "\n";
    m += "  Desa: " + gT('desa_ayah') + ", Kec: " + gT('kec_ayah') + "\n";
    m += "• Wilayah: " + gT('kab_ayah') + ", " + gT('prov_ayah') + "\n\n";

    m += `*${RUMAH_IBU} ALAMAT IBU*\n`;
    m += "• Alamat: " + gV('al_ibu') + ", RT." + gV('rt_ibu') + "/RW." + gV('rw_ibu') + "\n";
    m += "  Desa: " + gT('desa_ibu') + ", Kec: " + gT('kec_ibu') + "\n";
    m += "• Wilayah: " + gT('kab_ibu') + ", " + gT('prov_ibu') + "\n\n";

    m += `*${RUMAH_SANTRI} ALAMAT SANTRI*\n`;
    m += "• Alamat: " + gV('al_santri') + ", RT." + gV('rt_santri') + "/RW." + gV('rw_santri') + "\n";
    m += "  Desa: " + gT('desa_santri') + ", Kec: " + gT('kec_santri') + "\n";
    m += "• Wilayah: " + gT('kab_santri') + ", " + gT('prov_santri') + "\n\n";

    m += `*${CLIP} INFORMASI TAMBAHAN*\n`;
    m += "• Visi: " + gV('w_visi') + "\n";
    m += "• Pola: " + gV('w_pola') + "\n";
    m += "• Perilaku: " + gV('w_perilaku') + "\n";
    m += "• Sehat: " + gV('w_sehat') + "\n";

    let riwayatText = "Tidak ada";
    if (data && data.riwayat_sakit && Array.isArray(data.riwayat_sakit)) {
        riwayatText = data.riwayat_sakit.length > 0 ? data.riwayat_sakit.join(", ") : "Tidak ada";
    }
    m += "• Riwayat Penyakit: " + riwayatText + "\n";

    m += "• Tazir: " + gV('w_tazir') + "\n";
    m += "• Harapan: " + gV('w_harapan') + "\n\n";

    m += `*${ICON_MEMO} PERNYATAAN ORANG TUA*\n`;
    m += "• Status: " + status_setuju + "\n\n";

    m += "------------------------------------------\n";
    m += "_Pendaftaran ini telah disetujui secara digital._\n";
    m += "_Mohon segera diproses, Terima Kasih._";

    const adminNumber = "6281401643188";
    const waUrl = "https://wa.me/" + adminNumber + "?text=" + encodeURIComponent(m);
    window.location.href = waUrl;
}


/* =========================================================
   10. DOM READY — Event Listeners
========================================================= */document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ pendaftaran.js loaded");

    /* =====================================================
       AUTO-CONVERT SEMUA <select> JADI CUSTOM DROPDOWN
    ===================================================== */
    document.querySelectorAll('form select').forEach(sel => {
        if (sel.hasAttribute('data-cd')) return; // skip jika sudah ada
        
        sel.setAttribute('data-cd', 'true');
        
        // Ambil placeholder dari opsi pertama (jika value kosong)
        const firstOpt = sel.options[0];
        if (firstOpt && (!firstOpt.value || firstOpt.value === "")) {
            const placeholder = firstOpt.textContent.trim();
            sel.setAttribute('data-cd-placeholder', placeholder);
        }
        
        // Aktifkan search untuk dropdown wilayah (banyak opsi)
        const nameAttr = sel.getAttribute('name') || '';
        if (
            nameAttr.startsWith('prov_') ||
            nameAttr.startsWith('kab_') ||
            nameAttr.startsWith('kec_') ||
            nameAttr.startsWith('desa_')
        ) {
            sel.setAttribute('data-cd-search', 'true');
        }
    });
    
    // Inisialisasi custom dropdown untuk SEMUA select
    if (typeof CustomDropdown !== "undefined") {
        CustomDropdown.init();
        console.log("✅ Semua select dikonversi jadi Custom Dropdown");
    } else {
        console.warn("⚠️ CustomDropdown belum ter-load");
    }

    /* =====================================================
       LOAD PROVINSI AYAH OTOMATIS
    ===================================================== */
    loadWilayah('provinces', 'prov_ayah', 'Pilih Provinsi');

    /* =====================================================
       MENU TOGGLE (hamburger)
    ===================================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            nav.classList.toggle('show');
        });
        console.log("✅ Menu toggle bound");
    }

    /* Highlight menu aktif */
    const currentUrl = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("nav ul li a").forEach(item => {
        if (item.getAttribute("href") === currentUrl) item.classList.add("active");
        item.addEventListener('click', () => { if (nav) nav.classList.remove('show'); });
    });

    /* Klik luar → tutup menu */
    document.addEventListener('click', function (e) {
        if (nav && menuToggle && !nav.contains(e.target) && e.target !== menuToggle) {
            nav.classList.remove('show');
        }
    });

    /* Validasi 16 digit */
    const isNumeric = /^\d+$/;
    function pasangValidasi16Digit(inputId, errorId, labelNama) {
        const inputEl = document.getElementById(inputId);
        const errorEl = document.getElementById(errorId);
        if (!inputEl || !errorEl) return;
        inputEl.addEventListener("input", function () {
            const val = inputEl.value.trim();
            if (val === "") {
                inputEl.classList.remove("input-error", "input-success");
                errorEl.style.display = "none";
            } else if (val.length !== 16 || !isNumeric.test(val)) {
                inputEl.classList.add("input-error");
                inputEl.classList.remove("input-success");
                errorEl.textContent = `${labelNama} harus berupa 16 digit angka!`;
                errorEl.style.display = "block";
            } else {
                inputEl.classList.add("input-success");
                inputEl.classList.remove("input-error");
                errorEl.style.display = "none";
            }
        });
    }
    pasangValidasi16Digit("nikSantri", "errorNikSantri", "NIK Santri");
    pasangValidasi16Digit("kkAyah", "errorKkAyah", "Nomor KK");
    pasangValidasi16Digit("nikAyah", "errorNikAyah", "NIK Ayah");
});


/* =========================================================
   11. EXPOSE KE WINDOW (agar bisa dipanggil dari onclick HTML)
========================================================= */
window.handleFormSubmit    = handleFormSubmit;
window.loadWilayah         = loadWilayah;
window.loadKabAyah         = loadKabAyah;
window.loadKecAyah         = loadKecAyah;
window.loadDesaDanPosAyah  = loadDesaDanPosAyah;
window.loadKabIbu          = loadKabIbu;
window.loadKecIbu          = loadKecIbu;
window.loadDesaDanPosIbu   = loadDesaDanPosIbu;
window.loadKabSantri       = loadKabSantri;
window.loadKecSantri       = loadKecSantri;
window.loadDesaDanPosSantri= loadDesaDanPosSantri;
window.lockFields          = lockFields;
window.resetFields         = resetFields;
window.dataAyahLengkap     = dataAyahLengkap;
window.copyDataAlamat      = copyDataAlamat;
window.toggleDomisiliIbu   = toggleDomisiliIbu;
window.toggleDomisiliSantri= toggleDomisiliSantri;
window.toggleAyahFields    = toggleAyahFields;
window.handleNoNISN        = handleNoNISN;
window.toggleHP            = toggleHP;
window.toggleRiwayat       = toggleRiwayat;
window.validateInput       = validateInput;
window.openTab             = openTab;
window.navigasiMaju        = navigasiMaju;
window.navigasiMundur      = navigasiMundur;
window.handleMainAction    = handleMainAction;
window.prosesSimpanFinal   = prosesSimpanFinal;
window.kirimWA             = kirimWA;

console.log("✅ Semua fungsi ter-expose ke window");